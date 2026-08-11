import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  PieChart,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard consolidado",
    description:
      "Veja receitas, despesas e saldo do mês em cards claros, sem precisar abrir planilhas.",
  },
  {
    icon: PieChart,
    title: "Gráficos por categoria",
    description:
      "Entenda para onde vai seu dinheiro com um gráfico de pizza por categoria de gasto.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtros e exportação",
    description:
      "Filtre por período e categoria, busque transações e exporte tudo em CSV quando precisar.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Wallet className="size-6 text-primary" />
            Finanças+
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
              Entrar
            </Button>
            <Button nativeButton={false} render={<Link href="/signup" />}>
              Criar conta
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Controle suas finanças pessoais em um só lugar
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-balance">
            Registre receitas e despesas, categorize seus gastos e acompanhe
            sua saúde financeira com um dashboard simples e visual.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
              Começar agora
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Já tenho conta
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-none bg-transparent">
                <CardHeader>
                  <feature.icon className="size-8 text-primary" />
                  <CardTitle className="mt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          Finanças+ — projeto de finanças pessoais.
        </div>
      </footer>
    </div>
  );
}
