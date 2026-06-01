import "server-only"

import crypto from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import type { AdminUser } from "@/lib/admins"

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET

if (!SESSION_SECRET) {
  throw new Error("ADMIN_SESSION_SECRET não foi definido")
}

export type AdminSession = {
  adminId: number
  username: string
  exp: number
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", SESSION_SECRET as string)
    .update(value)
    .digest("base64url")
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

function createSessionToken(payload: AdminSession) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

function verifySessionToken(token: string): AdminSession | null {
  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)

  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSession

    if (!payload.adminId || !payload.username || !payload.exp) {
      return null
    }

    if (Date.now() > payload.exp) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function createAdminSession(admin: AdminUser) {
  const cookieStore = await cookies()

  const token = createSessionToken({
    adminId: admin.id,
    username: admin.username,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  })

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return verifySessionToken(token)
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()

  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAdmin() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}