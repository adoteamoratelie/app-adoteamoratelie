"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
  uploadProductImages,
} from "@/lib/products"
import {
  productImagesSchema,
  productSchema,
} from "@/schemas/product.schema"
import { slugify } from "@/lib/slugify"

export type ProductActionState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    slug?: string[]
    shortDescription?: string[]
    description?: string[]
    price?: string[]
    originalPrice?: string[]
    categoryId?: string[]
    specifications?: string[]
    images?: string[]
  }
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "true"
}

function parseSpecifications(value: FormDataEntryValue | null) {
  try {
    const parsed = JSON.parse(String(value || "[]"))

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0)
}

function parseKeepImageNames(value: FormDataEntryValue | null) {
  try {
    const parsed = JSON.parse(String(value || "[]"))

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is string => typeof item === "string")
  } catch {
    return []
  }
}

function getRawProductData(formData: FormData) {
  const name = String(formData.get("name") || "")
  const rawSlug = String(formData.get("slug") || "")

  return {
    name,
    slug: rawSlug || slugify(name),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    originalPrice: formData.get("originalPrice"),
    categoryId: formData.get("categoryId"),
    specifications: parseSpecifications(formData.get("specifications")),
    featured: parseBoolean(formData.get("featured")),
    active: parseBoolean(formData.get("active")),
  }
}

function revalidateProductPaths(slug?: string) {
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/products")
  revalidatePath("/admin/products/new")

  if (slug) {
    revalidatePath(`/produto/${slug}`)
  }
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const rawData = getRawProductData(formData)

  const parsed = productSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const imageFiles = parseImageFiles(formData)
  const parsedImages = productImagesSchema.safeParse(imageFiles)

  if (!parsedImages.success) {
    return {
      success: false,
      message: "Verifique as imagens enviadas.",
      errors: {
        images: parsedImages.error.issues.map((error) => error.message),
      },
    }
  }

  try {
    const uploadedImages = await uploadProductImages(parsedImages.data)

    await createProduct({
      ...parsed.data,
      images: uploadedImages,
    })

    revalidateProductPaths(parsed.data.slug)
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error)

    return {
      success: false,
      message:
        "Não foi possível criar o produto. Verifique os campos no Baserow e tente novamente.",
    }
  }

  redirect("/admin/products")
}

export async function updateProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const id = Number(formData.get("id"))

  if (!id || Number.isNaN(id)) {
    return {
      success: false,
      message: "Produto inválido.",
    }
  }

  const rawData = getRawProductData(formData)

  const parsed = productSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const imageFiles = parseImageFiles(formData)
  const parsedImages = productImagesSchema.safeParse(imageFiles)

  if (!parsedImages.success) {
    return {
      success: false,
      message: "Verifique as imagens enviadas.",
      errors: {
        images: parsedImages.error.issues.map((error) => error.message),
      },
    }
  }

  try {
    const currentProduct = await getProductById(id)
    const keepImageNames = parseKeepImageNames(formData.get("keepImageNames"))

    const keptImages = currentProduct.images.filter((image) =>
      keepImageNames.includes(image.name)
    )

    const uploadedImages = await uploadProductImages(parsedImages.data)
    const finalImages = [...keptImages, ...uploadedImages]

    if (finalImages.length > 8) {
      return {
        success: false,
        message: "O produto pode ter no máximo 8 imagens.",
        errors: {
          images: ["Remova algumas imagens antes de salvar."],
        },
      }
    }

    await updateProduct(id, {
      ...parsed.data,
      images: finalImages,
    })

    revalidateProductPaths(currentProduct.slug)
    revalidateProductPaths(parsed.data.slug)
    revalidatePath(`/admin/products/${id}/edit`)
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error)

    return {
      success: false,
      message:
        "Não foi possível atualizar o produto. Verifique os campos no Baserow e tente novamente.",
    }
  }

  redirect("/admin/products")
}

export async function deleteProductAction(formData: FormData) {
  const id = Number(formData.get("id"))

  if (!id || Number.isNaN(id)) {
    return
  }

  try {
    const currentProduct = await getProductById(id)

    await deleteProduct(id)

    revalidateProductPaths(currentProduct.slug)
    revalidatePath(`/admin/products/${id}/edit`)
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR", error)

    return
  }

  redirect("/admin/products")
}