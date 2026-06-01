"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"

import {
  createBannerAction,
  updateBannerAction,
  type BannerActionState,
} from "@/actions/banners.actions"
import type { Banner, BannerPosition } from "@/types/banner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type BannerFormProps = {
  banner?: Banner
}

const initialState: BannerActionState = {
  success: false,
  message: "",
}

function isBannerPosition(value: string): value is BannerPosition {
  return value === "hero" || value === "promo"
}

export function BannerForm({ banner }: BannerFormProps) {
  const action = banner ? updateBannerAction : createBannerAction

  const [state, formAction, isPending] = useActionState(action, initialState)

  const [title, setTitle] = useState(banner?.title ?? "")
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl ?? "")
  const [position, setPosition] = useState<BannerPosition>(
    banner?.position ?? "hero"
  )
  const [active, setActive] = useState(banner ? Boolean(banner.active) : true)
  const [sortOrder, setSortOrder] = useState(
    banner?.sortOrder !== undefined ? String(banner.sortOrder) : "0"
  )
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  function handlePositionChange(value: string) {
    if (isBannerPosition(value)) {
      setPosition(value)
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setImagePreview(null)
      return
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setImagePreview(URL.createObjectURL(file))
  }

  const currentImageUrl =
    banner?.image?.url || banner?.image?.thumbnails?.small?.url || null

  return (
    <form action={formAction} className="space-y-6">
      {banner ? <input type="hidden" name="id" value={banner.id} /> : null}

      <input type="hidden" name="position" value={position} />
      <input type="hidden" name="active" value={String(active)} />

      <Card>
        <CardHeader>
          <CardTitle>Informações do banner</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Nova coleção disponível"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            {state.errors?.title ? (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="linkUrl">Link do banner</Label>
            <Input
              id="linkUrl"
              name="linkUrl"
              placeholder="/#produtos ou https://exemplo.com"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Pode ser um link interno começando com / ou uma URL externa.
            </p>

            {state.errors?.linkUrl ? (
              <p className="text-sm text-destructive">
                {state.errors.linkUrl[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Posição</Label>

            <Select value={position} onValueChange={handlePositionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a posição" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="hero">Hero principal</SelectItem>
                <SelectItem value="promo">Promoção</SelectItem>
              </SelectContent>
            </Select>

            {state.errors?.position ? (
              <p className="text-sm text-destructive">
                {state.errors.position[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Ordem</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              step="1"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            />

            {state.errors?.sortOrder ? (
              <p className="text-sm text-destructive">
                {state.errors.sortOrder[0]}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
            <div>
              <Label>Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Exibir este banner na vitrine pública.
              </p>
            </div>

            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagem</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {currentImageUrl ? (
            <div className="space-y-3">
              <Label>Imagem atual</Label>

              <div className="overflow-hidden rounded-xl border bg-muted">
                <img
                  src={currentImageUrl}
                  alt={banner?.title ?? ""}
                  className="block aspect-16/7 w-full object-cover"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Se você não escolher uma nova imagem, esta será mantida.
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="image">
              {banner ? "Trocar imagem" : "Imagem do banner"}
            </Label>

            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />

            <p className="text-xs text-muted-foreground">
              Use uma imagem horizontal. Sugestão: 1600x700px ou maior. Máximo
              5MB.
            </p>

            {state.errors?.image ? (
              <p className="text-sm text-destructive">
                {state.errors.image[0]}
              </p>
            ) : null}
          </div>

          {imagePreview ? (
            <div className="space-y-3">
              <Label>Prévia da nova imagem</Label>

              <div className="overflow-hidden rounded-xl border bg-muted">
                <img
                  src={imagePreview}
                  alt=""
                  className="block aspect-16/7 w-full object-cover"
                />
              </div>
            </div>
          ) : null}
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
          <Link href="/admin/banners">Voltar</Link>
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : banner
              ? "Salvar alterações"
              : "Criar banner"}
        </Button>
      </div>
    </form>
  )
}