import "server-only"

import {
  baserowFetch,
  uploadBaserowFile,
  type BaserowFile,
} from "@/lib/baserow"
import type {
  Product,
  ProductCategory,
  ProductSpecification,
} from "@/types/product"

const PRODUCTS_TABLE_ID = process.env.BASEROW_PRODUCTS_TABLE_ID

if (!PRODUCTS_TABLE_ID) {
  throw new Error("BASEROW_PRODUCTS_TABLE_ID não foi definido")
}

type BaserowLinkedRow = {
  id: number
  value?: string
  name?: string
}

type BaserowProductRow = {
  id: number
  name: string
  slug: string
  description: string
  shortDescription: string
  price: string | number
  originalPrice?: string | number | null
  images?: BaserowFile[] | null
  category?: BaserowLinkedRow[] | number[] | null
  specifications?: string | ProductSpecification[] | null
  featured?: boolean
  active?: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

type BaserowListResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function parseNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const parsed = Number(value)

  return Number.isNaN(parsed) ? null : parsed
}

function parseSpecifications(
  value: BaserowProductRow["specifications"]
): ProductSpecification[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  try {
    const parsed = JSON.parse(value)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item) =>
        typeof item?.label === "string" && typeof item?.value === "string"
    )
  } catch {
    return []
  }
}

function parseCategory(
  value: BaserowProductRow["category"]
): ProductCategory | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }

  const first = value[0]

  if (typeof first === "number") {
    return {
      id: first,
      name: "",
    }
  }

  return {
    id: first.id,
    name: first.value || first.name || "",
  }
}

function mapProduct(row: BaserowProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.shortDescription,
    price: Number(row.price),
    originalPrice: parseNumber(row.originalPrice),
    images: row.images ?? [],
    category: parseCategory(row.category),
    specifications: parseSpecifications(row.specifications),
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  }
}

function normalizeImagePayload(files: BaserowFile[]) {
  return files.map((file) => ({
    name: file.name,
  }))
}

export async function uploadProductImages(files: File[]) {
  if (files.length === 0) {
    return []
  }

  return Promise.all(files.map((file) => uploadBaserowFile(file)))
}

export async function getProducts() {
  const data = await baserowFetch<BaserowListResponse<BaserowProductRow>>(
    `/database/rows/table/${PRODUCTS_TABLE_ID}/?user_field_names=true&order_by=-createdAt`,
    {
      cache: "no-store",
    }
  )

  return data.results.map(mapProduct)
}

export async function getActiveProducts() {
  const products = await getProducts()

  return products.filter((product) => product.active)
}

export async function getFeaturedProducts() {
  const products = await getActiveProducts()

  return products.filter((product) => product.featured)
}

export async function getProductById(id: number) {
  const data = await baserowFetch<BaserowProductRow>(
    `/database/rows/table/${PRODUCTS_TABLE_ID}/${id}/?user_field_names=true`,
    {
      cache: "no-store",
    }
  )

  return mapProduct(data)
}

export async function getProductBySlug(slug: string) {
  const products = await getActiveProducts()

  return products.find((product) => product.slug === slug) ?? null
}

export async function createProduct(data: {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice: number | null
  images: BaserowFile[]
  categoryId: number
  specifications: ProductSpecification[]
  featured: boolean
  active: boolean
}) {
  const row = await baserowFetch<BaserowProductRow>(
    `/database/rows/table/${PRODUCTS_TABLE_ID}/?user_field_names=true`,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        originalPrice: data.originalPrice,
        images: normalizeImagePayload(data.images),
        category: [data.categoryId],
        specifications: JSON.stringify(data.specifications),
        featured: Boolean(data.featured),
        active: Boolean(data.active),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    }
  )

  return mapProduct(row)
}

export async function updateProduct(
  id: number,
  data: {
    name: string
    slug: string
    description: string
    shortDescription: string
    price: number
    originalPrice: number | null
    images: BaserowFile[]
    categoryId: number
    specifications: ProductSpecification[]
    featured: boolean
    active: boolean
  }
) {
  const row = await baserowFetch<BaserowProductRow>(
    `/database/rows/table/${PRODUCTS_TABLE_ID}/${id}/?user_field_names=true`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        originalPrice: data.originalPrice,
        images: normalizeImagePayload(data.images),
        category: [data.categoryId],
        specifications: JSON.stringify(data.specifications),
        featured: Boolean(data.featured),
        active: Boolean(data.active),
        updatedAt: new Date().toISOString(),
      }),
    }
  )

  return mapProduct(row)
}

export async function deleteProduct(id: number) {
  await baserowFetch<null>(
    `/database/rows/table/${PRODUCTS_TABLE_ID}/${id}/`,
    {
      method: "DELETE",
    }
  )
}