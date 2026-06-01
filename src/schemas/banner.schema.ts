import { z } from "zod"

export const bannerPositionSchema = z.enum(["hero", "promo"], {
  message: "Selecione uma posição válida",
})

export const bannerSchema = z.object({
  title: z
    .string()
    .min(2, "O título precisa ter pelo menos 2 caracteres")
    .max(120, "O título pode ter no máximo 120 caracteres"),

  linkUrl: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return null
      }

      return value
    },
    z
      .string()
      .min(1)
      .refine(
        (value) => value.startsWith("/") || value.startsWith("http"),
        "Use uma URL começando com /, http ou https"
      )
      .nullable()
  ),

  position: bannerPositionSchema,

  active: z.boolean().default(true),

  sortOrder: z.coerce.number().int("Use um número inteiro").default(0),
})

export const bannerImageFileSchema = z
  .custom<File>((file) => file instanceof File, "Arquivo inválido")
  .refine((file) => file.size > 0, "Selecione uma imagem")
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

export type BannerInput = z.infer<typeof bannerSchema>