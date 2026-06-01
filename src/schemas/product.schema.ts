import { z } from "zod"

export const productSpecificationSchema = z.object({
  label: z.string().min(1, "Informe o nome da especificação"),
  value: z.string().min(1, "Informe o valor da especificação"),
})

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "O nome precisa ter pelo menos 2 caracteres")
    .max(120, "O nome pode ter no máximo 120 caracteres"),

  slug: z
    .string()
    .min(2, "O slug precisa ter pelo menos 2 caracteres")
    .max(140, "O slug pode ter no máximo 140 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens"
    ),

  shortDescription: z
    .string()
    .min(5, "A descrição curta precisa ter pelo menos 5 caracteres")
    .max(220, "A descrição curta pode ter no máximo 220 caracteres"),

  description: z
    .string()
    .min(10, "A descrição precisa ter pelo menos 10 caracteres"),

  price: z.coerce.number().positive("Informe um preço válido"),

  originalPrice: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return null
      }

      return value
    },
    z.coerce.number().positive("Informe um preço original válido").nullable()
  ),

  categoryId: z.coerce.number().positive("Selecione uma categoria"),

  specifications: z.array(productSpecificationSchema).default([]),

  featured: z.boolean().default(false),

  active: z.boolean().default(true),
})

export const productImageFileSchema = z
  .custom<File>((file) => file instanceof File, "Arquivo inválido")
  .refine((file) => file.size > 0, "Arquivo vazio")
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "A imagem deve ter no máximo 5MB"
  )
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type
      ),
    "Use imagens JPG, PNG, WEBP ou GIF"
  )

export const productImagesSchema = z.array(productImageFileSchema).max(
  8,
  "Envie no máximo 8 imagens por produto"
)

export type ProductInput = z.infer<typeof productSchema>