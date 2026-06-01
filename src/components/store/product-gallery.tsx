"use client"

import type { BaserowFile } from "@/lib/baserow"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ProductGalleryProps = {
  images: BaserowFile[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border bg-muted text-sm text-muted-foreground">
        Sem imagem
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.name}>
              <div className="overflow-hidden rounded-2xl border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={`${productName} - imagem ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 ? (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        ) : null}
      </Carousel>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
          {images.map((image, index) => (
            <div key={image.name} className="overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.thumbnails?.small?.url || image.url}
                alt={`${productName} - miniatura ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}