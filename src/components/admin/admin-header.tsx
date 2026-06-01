import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger />

      <Separator orientation="vertical" className="h-full" />

      <div>
        <p className="text-sm font-medium">Painel administrativo</p>
        <p className="text-xs text-muted-foreground">
          Gerencie os dados da sua vitrine
        </p>
      </div>
    </header>
  )
}