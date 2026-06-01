import { notFound } from "next/navigation"

import { ProductForm } from "@/components/admin/product-form"
import { getCategories } from "@/lib/categories"
import { getProductById } from "@/lib/products"

import { Badge } from "@/components/ui/badge"


type EditProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params

  const productId = Number(id)

  if (!productId || Number.isNaN(productId)) {
    notFound()
  }

  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary">Editar produto</Badge>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {product.name}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Atualize as informações deste produto.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}