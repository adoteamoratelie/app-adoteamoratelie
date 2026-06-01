"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Trash2, X } from "lucide-react"

import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/actions/products.actions"
import { slugify } from "@/lib/slugify"
import type { Category } from "@/types/category"
import type { Product, ProductSpecification } from "@/types/product"
import type { BaserowFile } from "@/lib/baserow"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ProductFormProps = {
  product?: Product
  categories: Category[]
}

const initialState: ProductActionState = {
  success: false,
  message: "",
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const action = product ? updateProductAction : createProductAction

  const [state, formAction, isPending] = useActionState(action, initialState)

  const [name, setName] = useState(product?.name ?? "")
  const [slug, setSlug] = useState(product?.slug ?? "")
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? ""
  )
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(
    product?.price ? String(product.price) : ""
  )
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? String(product.originalPrice) : ""
  )
  const [categoryId, setCategoryId] = useState(
    product?.category?.id ? String(product.category.id) : ""
  )
  const [featured, setFeatured] = useState(
    product ? Boolean(product.featured) : false
  )
  const [active, setActive] = useState(
    product ? Boolean(product.active) : true
  )

  const [currentImages, setCurrentImages] = useState<BaserowFile[]>(
    product?.images ?? []
  )
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    product?.specifications.length
      ? product.specifications
      : [{ label: "", value: "" }]
  )

  useEffect(() => {
    if (!product) {
      setSlug(slugify(name))
    }
  }, [name, product])

  const specificationsJson = useMemo(() => {
    return JSON.stringify(
      specifications.filter(
        (specification) =>
          specification.label.trim() && specification.value.trim()
      )
    )
  }, [specifications])

  const keepImageNamesJson = useMemo(() => {
    return JSON.stringify(currentImages.map((image) => image.name))
  }, [currentImages])

  function updateSpecification(
    index: number,
    field: keyof ProductSpecification,
    value: string
  ) {
    setSpecifications((current) =>
      current.map((specification, currentIndex) =>
        currentIndex === index
          ? {
              ...specification,
              [field]: value,
            }
          : specification
      )
    )
  }

  function addSpecification() {
    setSpecifications((current) => [...current, { label: "", value: "" }])
  }

  function removeSpecification(index: number) {
    setSpecifications((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    )
  }

  function removeCurrentImage(imageName: string) {
    setCurrentImages((images) =>
      images.filter((image) => image.name !== imageName)
    )
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview))

    const previews = files.map((file) => URL.createObjectURL(file))

    setImagePreviews(previews)
  }

  return (
    <form action={formAction} className="space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="featured" value={String(featured)} />
      <input type="hidden" name="active" value={String(active)} />
      <input type="hidden" name="specifications" value={specificationsJson} />
      <input type="hidden" name="keepImageNames" value={keepImageNamesJson} />

      <Card>
        <CardHeader>
          <CardTitle>Informações principais</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="name">Nome do produto</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Arranhador Para Gatos"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            {state.errors?.name ? (
              <p className="text-sm text-destructive">
                {state.errors.name[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="Ex: arranhador-para-gatos"
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
            />

            {state.errors?.slug ? (
              <p className="text-sm text-destructive">
                {state.errors.slug[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shortDescription">Descrição curta</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              placeholder="Resumo rápido para aparecer nos cards"
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
            />

            {state.errors?.shortDescription ? (
              <p className="text-sm text-destructive">
                {state.errors.shortDescription[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descrição completa</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detalhes completos do produto"
              rows={7}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            {state.errors?.description ? (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preço e organização</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="199.90"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />

            {state.errors?.price ? (
              <p className="text-sm text-destructive">
                {state.errors.price[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="originalPrice">Preço original</Label>
            <Input
              id="originalPrice"
              name="originalPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="249.90"
              value={originalPrice}
              onChange={(event) => setOriginalPrice(event.target.value)}
            />

            {state.errors?.originalPrice ? (
              <p className="text-sm text-destructive">
                {state.errors.originalPrice[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label>Categoria</Label>

            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {state.errors?.categoryId ? (
              <p className="text-sm text-destructive">
                {state.errors.categoryId[0]}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Destaque</Label>
              <p className="text-sm text-muted-foreground">
                Exibir como produto destacado.
              </p>
            </div>

            <Switch checked={featured} onCheckedChange={setFeatured} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Exibir produto na vitrine pública.
              </p>
            </div>

            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentImages.length > 0 ? (
            <div className="space-y-3">
              <div className="grid gap-3 grid-cols-3 md:grid-cols-8">
                {currentImages.map((image) => (
                  <div
                    key={image.name}
                    className="group relative overflow-hidden rounded-lg border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.thumbnails?.small?.url || image.url}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 size-8"
                      onClick={() => removeCurrentImage(image.name)}
                    >
                      <X className="size-4" />
                      <span className="sr-only">Remover imagem</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : product ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Este produto ainda não possui imagens.
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="images">
              {product ? "Adicionar novas imagens" : "Enviar imagens"}
            </Label>

            <Input
              id="images"
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageChange}
            />

            <p className="text-xs text-muted-foreground">
              Você pode enviar até 8 imagens no total por produto, com até 5MB cada, 1600x1600. 
            </p>

            {state.errors?.images ? (
              <p className="text-sm text-destructive">
                {state.errors.images[0]}
              </p>
            ) : null}
          </div>

          {imagePreviews.length > 0 ? (
            <div className="space-y-3">
              <Label>Prévia das novas imagens</Label>

              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.map((url) => (
                  <div key={url} className="overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especificações</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {specifications.map((specification, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Ex: Material"
                value={specification.label}
                onChange={(event) =>
                  updateSpecification(index, "label", event.target.value)
                }
              />

              <Input
                placeholder="Ex: Madeira"
                value={specification.value}
                onChange={(event) =>
                  updateSpecification(index, "value", event.target.value)
                }
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSpecification(index)}
                disabled={specifications.length === 1}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remover especificação</span>
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addSpecification}>
            <Plus className="mr-2 size-4" />
            Adicionar especificação
          </Button>
        </CardContent>
      </Card>

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild type="button" variant="outline">
          <Link href="/admin/products">Voltar</Link>
        </Button>
        
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : product
              ? "Salvar Alterações"
              : "Criar Produto"}
        </Button>
      </div>
    </form>
  )
}