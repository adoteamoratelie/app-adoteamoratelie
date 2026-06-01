import { ProductForm } from "@/components/admin/product-form"
import { getCategories } from "@/lib/categories"

import { Badge } from "@/components/ui/badge"

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary">Novo produto</Badge>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Criar produto
        </h1>

        <p className="mt-2 text-muted-foreground">
          Preencha as informações para cadastrar um novo produto na vitrine.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}