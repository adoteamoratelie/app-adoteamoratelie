import Link from "next/link"

import { BannerTable } from "@/components/admin/banner-table"
import { getBanners } from "@/lib/banners"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function AdminBannersPage() {
  const banners = await getBanners()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="secondary">Banners</Badge>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Banners
          </h1>

          <p className="mt-2 text-muted-foreground">
            Gerencie os banners do hero principal e das áreas promocionais.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/banners/new">Novo banner</Link>
        </Button>
      </div>

      <BannerTable banners={banners} />
    </div>
  )
}