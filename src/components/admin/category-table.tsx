import type { Category } from "@/types/category"
import { deleteCategoryAction } from "@/actions/categories.actions"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type CategoryTableProps = {
  categories: Category[]
}

export function CategoryTable({ categories }: CategoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias cadastradas</CardTitle>
      </CardHeader>

      <CardContent>
        {categories.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma categoria cadastrada ainda.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-30 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{category.slug}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" size="sm">
                          Excluir
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Excluir categoria?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. A categoria{" "}
                            <strong>{category.name}</strong> será removida do
                            Baserow.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>

                          <form action={deleteCategoryAction}>
                            <input
                              type="hidden"
                              name="id"
                              value={category.id}
                            />

                            <Button type="submit" variant="destructive">
                              Excluir definitivamente
                            </Button>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}