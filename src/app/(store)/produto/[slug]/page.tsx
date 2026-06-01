import { notFound } from "next/navigation"
import { MessageCircle } from "lucide-react"

import { siteConfig } from "@/config/site"
import { formatCurrency } from "@/lib/format"
import { getProductBySlug } from "@/lib/products"
import { createWhatsappUrl } from "@/lib/whatsapp"
import { ProductGallery } from "@/components/store/product-gallery"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/produto/${
    product.slug
  }`

  const whatsappUrl = createWhatsappUrl({
    phone: siteConfig.whatsapp.phone,
    productName: product.name,
    productUrl,
    price: formatCurrency(product.price),
  })

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <div>
            {product.category?.name ? (
              <Badge variant="secondary">{product.category.name}</Badge>
            ) : null}

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <strong className="text-3xl">
              {formatCurrency(product.price)}
            </strong>

            {product.originalPrice ? (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-5" />
              Comprar pelo WhatsApp
            </a>
          </Button>

          <Separator />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Descrição</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          </div>

          {product.specifications.length > 0 ? (
            <>
              <Separator />

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Especificações</h2>

                <div className="rounded-xl border">
                  {product.specifications.map((specification, index) => (
                    <div
                      key={`${specification.label}-${index}`}
                      className="grid grid-cols-2 gap-4 border-b p-4 last:border-b-0"
                    >
                      <span className="text-sm font-medium">
                        {specification.label}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {specification.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}