import { BannerForm } from "@/components/admin/banner-form"

import { Badge } from "@/components/ui/badge"

export default function NewBannerPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary">Novo banner</Badge>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Criar banner
        </h1>

        <p className="mt-2 text-muted-foreground">
          Cadastre um novo banner para exibir na vitrine.
        </p>
      </div>

      <BannerForm />
    </div>
  )
}