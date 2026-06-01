import type { BaserowFile } from "@/lib/baserow"

export type ProductSpecification = {
  label: string
  value: string
}

export type ProductCategory = {
  id: number
  name: string
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice: number | null
  images: BaserowFile[]
  category: ProductCategory | null
  specifications: ProductSpecification[]
  featured: boolean
  active: boolean
  createdAt: string | null
  updatedAt: string | null
}