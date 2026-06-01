import type { BaserowFile } from "@/lib/baserow"

export type BannerPosition = "hero" | "promo"

export type Banner = {
  id: number
  title: string
  image: BaserowFile | null
  linkUrl: string | null
  position: BannerPosition
  active: boolean
  sortOrder: number
  createdAt: string | null
}