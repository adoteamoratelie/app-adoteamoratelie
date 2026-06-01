import { CategoryForm } from "@/components/admin/category-form"
import { CategoryTable } from "@/components/admin/category-table"
import { getCategories } from "@/lib/categories"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary">Categorias</Badge>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Categorias
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gerencie as categorias que serão exibidas na vitrine.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Nova categoria</CardTitle>
          </CardHeader>

          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>

        <CategoryTable categories={categories} />
      </div>
    </div>
  )
}