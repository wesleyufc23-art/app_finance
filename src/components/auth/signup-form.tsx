"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { signUp, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signUp,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
          <MailCheck className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">Confirme seu e-mail para continuar</p>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de confirmação para{" "}
            {state.email && <span className="font-medium text-foreground">{state.email}</span>}
            . Abra sua caixa de entrada (e a pasta de spam, por garantia) e
            clique no link antes de fazer login.
          </p>
        </div>
        <Button className="w-full" nativeButton={false} render={<Link href="/login" />}>
          Já confirmei, ir para o login
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="voce@exemplo.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
        />
      </div>
      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Criando conta..." : "Criar conta"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
