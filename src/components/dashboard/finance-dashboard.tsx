"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import { FiltersBar, type Filters } from "@/components/dashboard/filters-bar";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { TransactionFormDialog } from "@/components/dashboard/transaction-form-dialog";
import { ExportCsvButton } from "@/components/dashboard/export-csv-button";
import { createClient } from "@/lib/supabase/client";
import { monthDateRange } from "@/lib/finance";
import type { Category, TransactionWithCategory } from "@/types/database";

export function FinanceDashboard({
  categories,
  initialTransactions,
  initialFilters,
}: {
  categories: Category[];
  initialTransactions: TransactionWithCategory[];
  initialFilters: Filters;
}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    initialTransactions
  );
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (nextFilters: Filters) => {
    setLoading(true);
    const supabase = createClient();
    const { start, end } = monthDateRange(nextFilters.year, nextFilters.month);

    let query = supabase
      .from("transactions")
      .select("*, category:categories(*)")
      .gte("date", start)
      .lt("date", end)
      .order("date", { ascending: false });

    if (nextFilters.categoryId !== "all") {
      query = query.eq("category_id", nextFilters.categoryId);
    }

    if (nextFilters.search.trim()) {
      query = query.ilike("description", `%${nextFilters.search.trim()}%`);
    }

    const { data, error } = await query;
    setLoading(false);

    if (error) {
      toast.error("Não foi possível carregar as transações.");
      return;
    }

    setTransactions((data ?? []) as TransactionWithCategory[]);
  }, []);

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    fetchTransactions(next);
  }

  function handleChanged() {
    fetchTransactions(filters);
  }

  const { income, expense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const categoryChartData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const tx of transactions) {
      if (tx.type !== "expense") continue;
      const name = tx.category?.name ?? "Sem categoria";
      totals.set(name, (totals.get(name) ?? 0) + tx.amount);
    }
    return Array.from(totals.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <SummaryCards income={income} expense={expense} balance={balance} />

      <CategoryPieChart data={categoryChartData} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FiltersBar
            filters={filters}
            categories={categories}
            onChange={handleFiltersChange}
          />
          <div className="flex gap-2">
            <ExportCsvButton transactions={transactions} />
            <TransactionFormDialog
              categories={categories}
              onSaved={handleChanged}
              trigger={
                <Button>
                  <Plus className="size-4" />
                  Nova transação
                </Button>
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            categories={categories}
            onChanged={handleChanged}
          />
        )}
      </div>
    </div>
  );
}
