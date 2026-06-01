"use client"

import { useActionState, useEffect, useState } from "react"

import {
  createCategoryAction,
  updateCategoryAction,
  type CategoryActionState,
} from "@/actions/categories.actions"
import { slugify } from "@/lib/slugify"
import type { Category } from "@/types/category"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CategoryFormProps = {
  category?: Category
}

const initialState: CategoryActionState = {
  success: false,
  message: "",
}

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category ? updateCategoryAction : createCategoryAction

  const [state, formAction, isPending] = useActionState(action, initialState)

  const [name, setName] = useState(category?.name ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")

  useEffect(() => {
    if (!category) {
      setSlug(slugify(name))
    }
  }, [name, category])

  return (
    <form action={formAction} className="space-y-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="name">Nome da categoria</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Roupas Femininas"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        {state.errors?.name ? (
          <p className="text-sm text-destructive">
            {state.errors.name[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="Ex: roupas-femininas"
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
        />

        {state.errors?.slug ? (
          <p className="text-sm text-destructive">
            {state.errors.slug[0]}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={
            state.success
              ? "text-sm text-emerald-600"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Salvando..."
          : category
            ? "Salvar alterações"
            : "Criar categoria"}
      </Button>
    </form>
  )
}