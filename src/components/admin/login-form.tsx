"use client"

import { useActionState } from "react"

import {
  loginAction,
  type LoginActionState,
} from "@/actions/auth.actions"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PawPrint } from "lucide-react"

const initialState: LoginActionState = {
  success: false,
  message: "",
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-bold">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-3">
            <PawPrint className="size-5"/>
          </div>
          Acessar painel administrativo
        </CardTitle>
        <CardDescription>
          Entre com seu usuário e senha para gerenciar a vitrine.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="admin"
            />

            {state.errors?.username ? (
              <p className="text-sm text-destructive">
                {state.errors.username[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
            />

            {state.errors?.password ? (
              <p className="text-sm text-destructive">
                {state.errors.password[0]}
              </p>
            ) : null}
          </div>

          {state.message ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}