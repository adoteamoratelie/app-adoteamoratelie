"use server"

import { compare } from "bcryptjs"
import { redirect } from "next/navigation"

import { getAdminByUsername } from "@/lib/admins"
import { createAdminSession, deleteAdminSession } from "@/lib/session"
import { loginSchema } from "@/schemas/auth.schema"

export type LoginActionState = {
  success: boolean
  message: string
  errors?: {
    username?: string[]
    password?: string[]
  }
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const admin = await getAdminByUsername(parsed.data.username)

  if (!admin || !admin.active) {
    return {
      success: false,
      message: "Usuário ou senha inválidos.",
    }
  }

  const passwordMatches = await compare(
    parsed.data.password,
    admin.passwordHash
  )

  if (!passwordMatches) {
    return {
      success: false,
      message: "Usuário ou senha inválidos.",
    }
  }

  await createAdminSession(admin)

  redirect("/admin")
}

export async function logoutAction() {
  await deleteAdminSession()

  redirect("/admin/login")
}