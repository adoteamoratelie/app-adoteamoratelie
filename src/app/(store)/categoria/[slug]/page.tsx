import Link from "next/link"
import { notFound } from "next/navigation"

import { getCategoriesWithProductCount, getCategoryBySlug } from "@/lib/categories"
import { getActiveProducts } from "@/lib/products"
import { ProductCard } from "@/components/store/product-card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CategoryPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const [category, products, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getActiveProducts(),
    getCategoriesWithProductCount(),
  ])

  if (!category) {
    notFound()
  }

  const categoryProducts = products.filter(
    (product) => product.category?.id === category.id
  )

  const otherCategories = categories.filter(
    (item) => item.id !== category.id
  )

  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary">Categoria</Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              {category.name}
            </h1>

            <p className="mt-5 text-lg text-muted-foreground">
              {categoryProducts.length === 1
                ? "1 produto encontrado nesta categoria."
                : `${categoryProducts.length} produtos encontrados nesta categoria.`}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/">Voltar para a loja</Link>
              </Button>

              <Button asChild variant="outline">
                <a href="#produtos">Ver produtos</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="produtos" className="container mx-auto space-y-6 px-4 py-12">
        <div>
          <Badge variant="secondary">Produtos</Badge>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Produtos em {category.name}
          </h2>

          <p className="mt-2 text-muted-foreground">
            Veja os produtos disponíveis para compra pelo WhatsApp.
          </p>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum produto ativo encontrado nesta categoria.
            </p>

            <Button asChild className="mt-5" variant="outline">
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {otherCategories.length > 0 ? (
        <section className="border-t bg-muted/30">
          <div className="container mx-auto space-y-6 px-4 py-12">
            <div>
              <Badge variant="secondary">Outras categorias</Badge>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Continue navegando
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherCategories.map((item) => (
                <Link key={item.id} href={`/categoria/${item.slug}`}>
                  <Card className="h-full transition hover:-translate-y-1 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.productCount === 1
                          ? "1 produto disponível"
                          : `${item.productCount ?? 0} produtos disponíveis`}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}