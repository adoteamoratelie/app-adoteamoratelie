import "server-only"

import {
  baserowFetch,
  uploadBaserowFile,
  type BaserowFile,
} from "@/lib/baserow"
import type { Banner, BannerPosition } from "@/types/banner"

const BANNERS_TABLE_ID = process.env.BASEROW_BANNERS_TABLE_ID

if (!BANNERS_TABLE_ID) {
  throw new Error("BASEROW_BANNERS_TABLE_ID não foi definido")
}

type BaserowBannerRow = {
  id: number
  title: string
  image?: BaserowFile[] | null
  linkUrl?: string | null
  position?: string | null
  active?: boolean
  sortOrder?: string | number | null
  createdAt?: string | null
}

type BaserowListResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function parsePosition(value: string | null | undefined): BannerPosition {
  if (value === "promo") {
    return "promo"
  }

  return "hero"
}

function parseNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return 0
  }

  const parsed = Number(value)

  return Number.isNaN(parsed) ? 0 : parsed
}

function mapBanner(row: BaserowBannerRow): Banner {
  return {
    id: row.id,
    title: row.title,
    image: row.image?.[0] ?? null,
    linkUrl: row.linkUrl || null,
    position: parsePosition(row.position),
    active: Boolean(row.active),
    sortOrder: parseNumber(row.sortOrder),
    createdAt: row.createdAt ?? null,
  }
}

function normalizeImagePayload(image: BaserowFile | null) {
  if (!image) {
    return []
  }

  return [
    {
      name: image.name,
    },
  ]
}

export async function uploadBannerImage(file: File) {
  return uploadBaserowFile(file)
}

export async function getBanners() {
  const data = await baserowFetch<BaserowListResponse<BaserowBannerRow>>(
    `/database/rows/table/${BANNERS_TABLE_ID}/?user_field_names=true&order_by=sortOrder`,
    {
      cache: "no-store",
    }
  )

  return data.results.map(mapBanner)
}

export async function getActiveBanners() {
  const banners = await getBanners()

  return banners.filter((banner) => banner.active)
}

export async function getHeroBanners() {
  const banners = await getActiveBanners()

  return banners.filter((banner) => banner.position === "hero")
}

export async function getPromoBanners() {
  const banners = await getActiveBanners()

  return banners.filter((banner) => banner.position === "promo")
}

export async function getBannerById(id: number) {
  const data = await baserowFetch<BaserowBannerRow>(
    `/database/rows/table/${BANNERS_TABLE_ID}/${id}/?user_field_names=true`,
    {
      cache: "no-store",
    }
  )

  return mapBanner(data)
}

export async function createBanner(data: {
  title: string
  image: BaserowFile
  linkUrl: string | null
  position: BannerPosition
  active: boolean
  sortOrder: number
}) {
  const row = await baserowFetch<BaserowBannerRow>(
    `/database/rows/table/${BANNERS_TABLE_ID}/?user_field_names=true`,
    {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        image: normalizeImagePayload(data.image),
        linkUrl: data.linkUrl,
        position: data.position,
        active: Boolean(data.active),
        sortOrder: data.sortOrder,
        createdAt: new Date().toISOString(),
      }),
    }
  )

  return mapBanner(row)
}

export async function updateBanner(
  id: number,
  data: {
    title: string
    image: BaserowFile | null
    linkUrl: string | null
    position: BannerPosition
    active: boolean
    sortOrder: number
  }
) {
  const row = await baserowFetch<BaserowBannerRow>(
    `/database/rows/table/${BANNERS_TABLE_ID}/${id}/?user_field_names=true`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: data.title,
        image: normalizeImagePayload(data.image),
        linkUrl: data.linkUrl,
        position: data.position,
        active: Boolean(data.active),
        sortOrder: data.sortOrder,
      }),
    }
  )

  return mapBanner(row)
}

export async function deleteBanner(id: number) {
  await baserowFetch<null>(
    `/database/rows/table/${BANNERS_TABLE_ID}/${id}/`,
    {
      method: "DELETE",
    }
  )
}