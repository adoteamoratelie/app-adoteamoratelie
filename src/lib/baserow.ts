import "server-only"

const BASEROW_API_URL = process.env.BASEROW_API_URL
const BASEROW_TOKEN = process.env.BASEROW_TOKEN

if (!BASEROW_API_URL) {
  throw new Error("BASEROW_API_URL não foi definida")
}

if (!BASEROW_TOKEN) {
  throw new Error("BASEROW_TOKEN não foi definido")
}

export type BaserowFile = {
  url: string
  thumbnails?: {
    tiny?: {
      url: string
      width: number
      height: number
    }
    small?: {
      url: string
      width: number
      height: number
    }
  }
  name: string
  size?: number
  mime_type?: string
  is_image?: boolean
  image_width?: number
  image_height?: number
  uploaded_at?: string
}

type BaserowFetchOptions = RequestInit & {
  revalidate?: number
}

export async function baserowFetch<T>(
  path: string,
  options: BaserowFetchOptions = {}
): Promise<T> {
  const response = await fetch(`${BASEROW_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BASEROW_TOKEN}`,
      ...options.headers,
    },
    next:
      typeof options.revalidate === "number"
        ? { revalidate: options.revalidate }
        : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Erro na API do Baserow: ${response.status} - ${errorText}`
    )
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

export async function uploadBaserowFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${BASEROW_API_URL}/user-files/upload-file/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Erro ao fazer upload para o Baserow: ${response.status} - ${errorText}`
    )
  }

  return response.json() as Promise<BaserowFile>
}