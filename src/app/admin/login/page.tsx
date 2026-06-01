import { redirect } from "next/navigation"

import { LoginForm } from "@/components/admin/login-form"
import { getAdminSession } from "@/lib/session"

export default async function AdminLoginPage() {
  const session = await getAdminSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <LoginForm />
      </div>
    </main>
  )
}