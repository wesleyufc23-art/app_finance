import { createClient } from "@/lib/supabase/server";
import { FinanceDashboard } from "@/components/dashboard/finance-dashboard";
import { monthDateRange } from "@/lib/finance";
import type { Category, TransactionWithCategory } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const { start, end } = monthDateRange(year, month);

  const [{ data: categories }, { data: transactions }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("transactions")
      .select("*, category:categories(*)")
      .gte("date", start)
      .lt("date", end)
      .order("date", { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Acompanhe suas receitas, despesas e saldo do período.
        </p>
      </div>

      <FinanceDashboard
        categories={(categories ?? []) as Category[]}
        initialTransactions={(transactions ?? []) as TransactionWithCategory[]}
        initialFilters={{ month, year, categoryId: "all", search: "" }}
      />
    </div>
  );
}
