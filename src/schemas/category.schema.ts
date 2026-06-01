// src/schemas/category.schema.ts

import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome precisa ter pelo menos 2 caracteres")
    .max(80, "O nome pode ter no máximo 80 caracteres"),

  slug: z
    .string()
    .min(2, "O slug precisa ter pelo menos 2 caracteres")
    .max(100, "O slug pode ter no máximo 100 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens"
    ),
})

export type CategoryInput = z.infer<typeof categorySchema>