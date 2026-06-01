import Link from "next/link"
import { MessageCircle } from "lucide-react"

import { siteConfig } from "@/config/site"
import { formatCurrency } from "@/lib/format"
import { createWhatsappUrl } from "@/lib/whatsapp"
import type { Product } from "@/types/product"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0]?.url

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
    <Card className="group flex h-full min-h-97.5 overflow-hidden rounded-2xl p-0 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-full w-full flex-col">
        <Link href={`/produto/${product.slug}`} className="block shrink-0">
          <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="block h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Sem imagem
              </div>
            )}

            {product.featured ? (
              <Badge
                className="absolute left-3 top-3 shadow-sm"
                variant="secondary"
              >
                Destaque
              </Badge>
            ) : null}
          </div>
        </Link>

        <CardHeader className="min-h-28 space-y-1.5 px-4 pb-0 pt-4">
          <Link href={`/produto/${product.slug}`}>
            <h3 className="line-clamp-2 min-h-1 text-base font-semibold leading-snug transition hover:text-primary">
              {product.name}
            </h3>
          </Link>

          <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        </CardHeader>

        <CardContent className="mt-auto px-4 py-3">
          <div className="flex min-h-7 flex-wrap items-baseline gap-2">
            <strong className="text-lg">{formatCurrency(product.price)}</strong>

            {product.originalPrice ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <Button asChild size="sm" className="w-full">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-4" />
              Comprar
            </a>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}