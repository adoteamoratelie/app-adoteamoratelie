"use client"

import type { Banner } from "@/types/banner"

import { Card } from "@/components/ui/card"

type PromoBannersProps = {
  banners: Banner[]
}

function PromoBannerCard({ banner }: { banner: Banner }) {
  const imageUrl = banner.image?.url
  const isExternalLink = banner.linkUrl?.startsWith("http")

  const content = (
    <Card className="group h-full overflow-hidden rounded-2xl border bg-muted p-0">
      <div className="relative h-full w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={banner.title}
            className="block aspect-16/6 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-16/6 h-full w-full bg-muted" />
        )}
      </div>
    </Card>
  )

  if (!banner.linkUrl) {
    return content
  }

  return (
    <a
      href={banner.linkUrl}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      aria-label={banner.title}
      className="block h-full"
    >
      {content}
    </a>
  )
}

export function PromoBanners({ banners }: PromoBannersProps) {
  if (banners.length === 0) {
    return null
  }

  return (
    <section className="w-full px-4 py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {banners.map((banner) => (
            <PromoBannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      </div>
    </section>
  )
}