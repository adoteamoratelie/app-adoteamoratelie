import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, "Informe o usuário")
    .max(80, "Usuário muito longo"),

  password: z
    .string()
    .min(4, "Informe a senha")
    .max(120, "Senha muito longa"),
})

export type LoginInput = z.infer<typeof loginSchema>