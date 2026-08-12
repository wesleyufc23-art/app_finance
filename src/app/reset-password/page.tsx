import Link from "next/link";
import { Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <Wallet className="size-6 text-primary" />
          Finanças+
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Definir nova senha</CardTitle>
            <CardDescription>
              {user
                ? "Escolha uma nova senha para sua conta."
                : "Este link expirou ou já foi usado."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <ResetPasswordForm />
            ) : (
              <Button
                className="w-full"
                nativeButton={false}
                render={<Link href="/forgot-password" />}
              >
                Solicitar novo link
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
