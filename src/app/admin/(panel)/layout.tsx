import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { requireAdmin } from "@/lib/session"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <AdminHeader />

        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}