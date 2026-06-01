import Link from "next/link"

import { deleteBannerAction } from "@/actions/banners.actions"
import type { Banner } from "@/types/banner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type BannerTableProps = {
  banners: Banner[]
}

export function BannerTable({ banners }: BannerTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banners cadastrados</CardTitle>
      </CardHeader>

      <CardContent>
        {banners.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum banner cadastrado ainda.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-45 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {banners.map((banner) => {
                const imageUrl =
                  banner.image?.thumbnails?.small?.url || banner.image?.url

                return (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-24 overflow-hidden rounded-lg border bg-muted">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={banner.title}
                              className="size-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div>
                          <p className="font-medium">{banner.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {banner.linkUrl || "Sem link"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {banner.position === "hero" ? (
                        <Badge variant="secondary">Hero</Badge>
                      ) : (
                        <Badge variant="outline">Promo</Badge>
                      )}
                    </TableCell>

                    <TableCell>{banner.sortOrder}</TableCell>

                    <TableCell>
                      {banner.active ? (
                        <Badge>Ativo</Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/banners/${banner.id}/edit`}>
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
                                Excluir banner?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. O banner{" "}
                                <strong>{banner.title}</strong> será removido
                                do Baserow.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>

                              <form action={deleteBannerAction}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={banner.id}
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
        )}
      </CardContent>
    </Card>
  )
}