import Link from "next/link"
import { Images, Package, Tags } from "lucide-react"

import { getBanners } from "@/lib/banners"
import { getCategories } from "@/lib/categories"
import { getProducts } from "@/lib/products"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboardPage() {
  const [categories, products, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners(),
  ])

  const activeProducts = products.filter((product) => product.active)
  const activeBanners = banners.filter((banner) => banner.active)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="secondary">Dashboard</Badge>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Visão geral
          </h1>

          <p className="mt-2 text-muted-foreground">
            Acompanhe e gerencie os principais conteúdos da sua vitrine.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts.length} ativos na vitrine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tags className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Categorias cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Banners</CardTitle>
            <Images className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBanners.length} ativos na vitrine
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cadastre produtos, imagens, preços, descrições e especificações.
            </p>

            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products">Gerenciar produtos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Organize seus produtos em categorias exibidas na vitrine.
            </p>

            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/categories">Gerenciar categorias</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banners</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure banners para hero e áreas promocionais da loja.
            </p>

            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/banners">Gerenciar banners</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}