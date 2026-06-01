import "server-only"

import { baserowFetch } from "@/lib/baserow"

const ADMINS_TABLE_ID = process.env.BASEROW_ADMINS_TABLE_ID

if (!ADMINS_TABLE_ID) {
  throw new Error("BASEROW_ADMINS_TABLE_ID não foi definido")
}

export type AdminUser = {
  id: number
  username: string
  passwordHash: string
  active: boolean
}

type BaserowAdminRow = {
  id: number
  username: string
  passwordHash: string
  active?: boolean | null
}

type BaserowListResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function mapAdmin(row: BaserowAdminRow): AdminUser {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    active: row.active === undefined || row.active === null ? true : row.active,
  }
}

export async function getAdmins() {
  const data = await baserowFetch<BaserowListResponse<BaserowAdminRow>>(
    `/database/rows/table/${ADMINS_TABLE_ID}/?user_field_names=true`,
    {
      cache: "no-store",
    }
  )

  return data.results.map(mapAdmin)
}

export async function getAdminByUsername(username: string) {
  const admins = await getAdmins()

  return (
    admins.find(
      (admin) =>
        admin.username.trim().toLowerCase() === username.trim().toLowerCase()
    ) ?? null
  )
}