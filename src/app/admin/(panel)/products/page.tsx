import Link from "next/link"

import { ProductTable } from "@/components/admin/product-table"
import { getCategories } from "@/lib/categories"
import { getProducts } from "@/lib/products"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="secondary">Produtos</Badge>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Produtos
          </h1>

          <p className="mt-2 text-muted-foreground">
            Cadastre, filtre e gerencie os produtos exibidos na vitrine.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">Novo produto</Link>
        </Button>
      </div>

      <ProductTable products={products} categories={categories} />
    </div>
  )
}