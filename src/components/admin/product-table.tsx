"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import { deleteProductAction } from "@/actions/products.actions"
import { formatCurrency } from "@/lib/format"
import type { Category } from "@/types/category"
import type { Product } from "@/types/product"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ProductTableProps = {
  products: Product[]
  categories: Category[]
}

export function ProductTable({ products, categories }: ProductTableProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.slug.toLowerCase().includes(normalizedSearch) ||
        product.shortDescription.toLowerCase().includes(normalizedSearch)

      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "without-category" && !product.category) ||
        String(product.category?.id) === categoryFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.active) ||
        (statusFilter === "inactive" && !product.active)

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && product.featured) ||
        (featuredFilter === "not-featured" && !product.featured)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesFeatured
      )
    })
  }, [products, search, categoryFilter, statusFilter, featuredFilter])

  const hasFilters =
    search ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    featuredFilter !== "all"

  function clearFilters() {
    setSearch("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setFeaturedFilter("all")
  }

  return (
    <Card>
      <CardHeader className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Produtos cadastrados</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredProducts.length === 1
                ? "1 produto encontrado"
                : `${filteredProducts.length} produtos encontrados`}
              {" de "}
              {products.length}
            </p>
          </div>

          {hasFilters ? (
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <Input
            placeholder="Buscar por nome, slug ou descrição..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="without-category">Sem categoria</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Destaque" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="featured">Em destaque</SelectItem>
              <SelectItem value="not-featured">Sem destaque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum produto encontrado com os filtros selecionados.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-45 text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.map((product) => {
                  const imageUrl =
                    product.images[0]?.thumbnails?.small?.url ||
                    product.images[0]?.url

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="size-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-1 font-medium">
                              {product.name}
                            </p>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {product.category?.name ? (
                          product.category.name
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell>{formatCurrency(product.price)}</TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {product.active ? (
                            <Badge>Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}

                          {product.featured ? (
                            <Badge variant="outline">Destaque</Badge>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              Editar
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button type="button" variant="destructive" size="sm">
                                Excluir
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir produto?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita. O produto{" "}
                                  <strong>{product.name}</strong> será removido
                                  do Baserow.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>

                                <form action={deleteProductAction}>
                                  <input
                                    type="hidden"
                                    name="id"
                                    value={product.id}
                                  />

                                  <Button type="submit" variant="destructive">
                                    Excluir definitivamente
                                  </Button>
                                </form>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}