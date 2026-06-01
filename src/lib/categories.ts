import "server-only"

import { baserowFetch } from "@/lib/baserow"
import { getActiveProducts } from "@/lib/products"
import type { Category } from "@/types/category"

const CATEGORIES_TABLE_ID = process.env.BASEROW_CATEGORIES_TABLE_ID

if (!CATEGORIES_TABLE_ID) {
  throw new Error("BASEROW_CATEGORIES_TABLE_ID não foi definido")
}

type BaserowCategoryRow = {
  id: number
  name: string
  slug: string
}

type BaserowListResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

function mapCategory(row: BaserowCategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  }
}

export async function getCategories() {
  const data = await baserowFetch<BaserowListResponse<BaserowCategoryRow>>(
    `/database/rows/table/${CATEGORIES_TABLE_ID}/?user_field_names=true&order_by=name`,
    {
      cache: "no-store",
    }
  )

  return data.results.map(mapCategory)
}

export async function getCategoriesWithProductCount() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getActiveProducts(),
  ])

  return categories.map((category) => {
    const productCount = products.filter(
      (product) => product.category?.id === category.id
    ).length

    return {
      ...category,
      productCount,
    }
  })
}

export async function getCategoryById(id: number) {
  const data = await baserowFetch<BaserowCategoryRow>(
    `/database/rows/table/${CATEGORIES_TABLE_ID}/${id}/?user_field_names=true`,
    {
      cache: "no-store",
    }
  )

  return mapCategory(data)
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories()

  return categories.find((category) => category.slug === slug) ?? null
}

export async function createCategory(data: {
  name: string
  slug: string
}) {
  const row = await baserowFetch<BaserowCategoryRow>(
    `/database/rows/table/${CATEGORIES_TABLE_ID}/?user_field_names=true`,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        slug: data.slug,
      }),
    }
  )

  return mapCategory(row)
}

export async function updateCategory(
  id: number,
  data: {
    name: string
    slug: string
  }
) {
  const row = await baserowFetch<BaserowCategoryRow>(
    `/database/rows/table/${CATEGORIES_TABLE_ID}/${id}/?user_field_names=true`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        slug: data.slug,
      }),
    }
  )

  return mapCategory(row)
}

export async function deleteCategory(id: number) {
  await baserowFetch<null>(
    `/database/rows/table/${CATEGORIES_TABLE_ID}/${id}/`,
    {
      method: "DELETE",
    }
  )
}