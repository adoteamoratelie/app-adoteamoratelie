import Link from "next/link"

import { getHeroBanners, getPromoBanners } from "@/lib/banners"
import { getCategoriesWithProductCount } from "@/lib/categories"
import { getActiveProducts } from "@/lib/products"
import { HeroCarousel } from "@/components/store/hero-carousel"
import { ProductCard } from "@/components/store/product-card"
import { PromoBanners } from "@/components/store/promo-banners"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PawPrint } from "lucide-react"

export default async function HomePage() {
  const [categories, products, heroBanners, promoBanners] = await Promise.all([
    getCategoriesWithProductCount(),
    getActiveProducts(),
    getHeroBanners(),
    getPromoBanners(),
  ])

  return (
    <main>

      <HeroCarousel banners={heroBanners} />

      <section id="categorias" className="w-full px-4 py-5">
        <div className="container mx-auto space-y-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="secondary">Categorias</Badge>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Navegue por categoria
              </h2>

              <p className="mt-2 text-muted-foreground">
                Escolha uma categoria para encontrar os produtos disponíveis.
              </p>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma categoria disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <div>
                  <Link key={category.id} href={`/categoria/${category.slug}`}>
                    <Card className="h-full transition hover:-translate-y-1 hover:shadow-md gap-0">
                      <CardHeader>
                        <PawPrint className="size-6 stroke-primary mb-2"/>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {category.productCount === 1
                            ? "1 produto"
                            : `${category.productCount ?? 0} produtos`}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PromoBanners banners={promoBanners} />

      <section id="produtos" className="w-full px-4 border-t bg-muted/30">
        <div className="container mx-auto space-y-6 py-12">
          <div>
            <Badge variant="secondary">Produtos</Badge>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Nossos Produtos
            </h2>

            <p className="mt-2 text-muted-foreground">
              Confira os produtos disponíveis para compra pelo WhatsApp.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-background p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}