import { notFound } from "next/navigation"

import { BannerForm } from "@/components/admin/banner-form"
import { getBannerById } from "@/lib/banners"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type EditBannerPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditBannerPage({
  params,
}: EditBannerPageProps) {
  const { id } = await params

  const bannerId = Number(id)

  if (!bannerId || Number.isNaN(bannerId)) {
    notFound()
  }

  const banner = await getBannerById(bannerId)

  if (!banner) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary">Editar banner</Badge>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {banner.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Atualize as informações deste banner.
        </p>
      </div>

      <BannerForm banner={banner} />
    </div>
  )
}