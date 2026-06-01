"use server"

import { revalidatePath } from "next/cache"

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/categories"
import { categorySchema } from "@/schemas/category.schema"
import { slugify } from "@/lib/slugify"

export type CategoryActionState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    slug?: string[]
  }
}

export async function createCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const name = String(formData.get("name") || "")
  const rawSlug = String(formData.get("slug") || "")

  const parsed = categorySchema.safeParse({
    name,
    slug: rawSlug || slugify(name),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await createCategory(parsed.data)

    revalidatePath("/")
    revalidatePath("/admin/categories")

    return {
      success: true,
      message: "Categoria criada com sucesso.",
    }
  } catch {
    return {
      success: false,
      message: "Não foi possível criar a categoria.",
    }
  }
}

export async function updateCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const id = Number(formData.get("id"))
  const name = String(formData.get("name") || "")
  const rawSlug = String(formData.get("slug") || "")

  if (!id || Number.isNaN(id)) {
    return {
      success: false,
      message: "Categoria inválida.",
    }
  }

  const parsed = categorySchema.safeParse({
    name,
    slug: rawSlug || slugify(name),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await updateCategory(id, parsed.data)

    revalidatePath("/")
    revalidatePath("/admin/categories")

    return {
      success: true,
      message: "Categoria atualizada com sucesso.",
    }
  } catch {
    return {
      success: false,
      message: "Não foi possível atualizar a categoria.",
    }
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const id = Number(formData.get("id"))

  if (!id || Number.isNaN(id)) {
    return
  }

  await deleteCategory(id)

  revalidatePath("/")
  revalidatePath("/admin/categories")
}