"use client"

import type { Banner } from "@/types/banner"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type HeroCarouselProps = {
  banners: Banner[]
}

function BannerImage({ banner }: { banner: Banner }) {
  const imageUrl = banner.image?.url
  const isExternalLink = banner.linkUrl?.startsWith("http")

  const content = (
    <div className="relative overflow-hidden rounded-2xl border bg-muted md:rounded-3xl">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={banner.title}
          className="aspect-16/7 w-full object-cover transition duration-300 hover:scale-[1.02]"
        />
      ) : (
        <div className="aspect-16/7" />
      )}
    </div>
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
      className="block"
    >
      {content}
    </a>
  )
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  if (banners.length === 0) {
    return (
      <section className="w-full overflow-hidden px-4 py-12">
        <div className="container mx-auto border bg-muted md:rounded-3xl">
          <div className="flex aspect-16/7 items-center justify-center p-8">
            <p className="text-center text-sm text-muted-foreground">
              Cadastre banners ativos na posição Hero para exibir este espaço.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full overflow-hidden px-4 py-5">
      <div className="container mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: banners.length > 2,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {banners.map((banner) => (
              <CarouselItem
                key={banner.id}
                className="basis-full pl-4 md:basis-1/2"
              >
                <BannerImage banner={banner} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {banners.length > 1 ? (
            <>
              <CarouselPrevious className="left-6 hidden md:flex" />
              <CarouselNext className="right-6 hidden md:flex" />

              <CarouselPrevious className="left-6 md:hidden" />
              <CarouselNext className="right-6 md:hidden" />
            </>
          ) : null}
        </Carousel>
      </div>
    </section>
  )
}