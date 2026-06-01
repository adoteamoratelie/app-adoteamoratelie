"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  createBanner,
  deleteBanner,
  getBannerById,
  updateBanner,
  uploadBannerImage,
} from "@/lib/banners"
import {
  bannerImageFileSchema,
  bannerSchema,
} from "@/schemas/banner.schema"

export type BannerActionState = {
  success: boolean
  message: string
  errors?: {
    title?: string[]
    linkUrl?: string[]
    position?: string[]
    active?: string[]
    sortOrder?: string[]
    image?: string[]
  }
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true"
}

function parseImageFile(formData: FormData) {
  const file = formData.get("image")

  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  return file
}

function getRawBannerData(formData: FormData) {
  return {
    title: formData.get("title"),
    linkUrl: formData.get("linkUrl"),
    position: formData.get("position"),
    active: parseBoolean(formData.get("active")),
    sortOrder: formData.get("sortOrder"),
  }
}

function revalidateBannerPaths() {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/banners")
  revalidatePath("/admin/banners/new")
}

export async function createBannerAction(
  _previousState: BannerActionState,
  formData: FormData
): Promise<BannerActionState> {
  const parsed = bannerSchema.safeParse(getRawBannerData(formData))

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const imageFile = parseImageFile(formData)

  if (!imageFile) {
    return {
      success: false,
      message: "Selecione uma imagem para o banner.",
      errors: {
        image: ["A imagem do banner é obrigatória."],
      },
    }
  }

  const parsedImage = bannerImageFileSchema.safeParse(imageFile)

  if (!parsedImage.success) {
    return {
      success: false,
      message: "Verifique a imagem enviada.",
      errors: {
        image: parsedImage.error.issues.map((error) => error.message),
      },
    }
  }

  try {
    const uploadedImage = await uploadBannerImage(parsedImage.data)

    await createBanner({
      ...parsed.data,
      image: uploadedImage,
    })

    revalidateBannerPaths()
  } catch (error) {
    console.error("CREATE_BANNER_ERROR", error)

    return {
      success: false,
      message:
        "Não foi possível criar o banner. Verifique os campos no Baserow e tente novamente.",
    }
  }

  redirect("/admin/banners")
}

export async function updateBannerAction(
  _previousState: BannerActionState,
  formData: FormData
): Promise<BannerActionState> {
  const id = Number(formData.get("id"))

  if (!id || Number.isNaN(id)) {
    return {
      success: false,
      message: "Banner inválido.",
    }
  }

  const parsed = bannerSchema.safeParse(getRawBannerData(formData))

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const imageFile = parseImageFile(formData)

  try {
    const currentBanner = await getBannerById(id)

    let image = currentBanner.image

    if (imageFile) {
      const parsedImage = bannerImageFileSchema.safeParse(imageFile)

      if (!parsedImage.success) {
        return {
          success: false,
          message: "Verifique a imagem enviada.",
          errors: {
            image: parsedImage.error.issues.map((error) => error.message),
          },
        }
      }

      image = await uploadBannerImage(parsedImage.data)
    }

    await updateBanner(id, {
      ...parsed.data,
      image,
    })

    revalidateBannerPaths()
    revalidatePath(`/admin/banners/${id}/edit`)
  } catch (error) {
    console.error("UPDATE_BANNER_ERROR", error)

    return {
      success: false,
      message:
        "Não foi possível atualizar o banner. Verifique os campos no Baserow e tente novamente.",
    }
  }

  redirect("/admin/banners")
}

export async function deleteBannerAction(formData: FormData) {
  const id = Number(formData.get("id"))

  if (!id || Number.isNaN(id)) {
    return
  }

  try {
    await deleteBanner(id)

    revalidateBannerPaths()
    revalidatePath(`/admin/banners/${id}/edit`)
  } catch (error) {
    console.error("DELETE_BANNER_ERROR", error)

    return
  }

  redirect("/admin/banners")
}