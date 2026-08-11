"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/finance";
import type { TransactionWithCategory } from "@/types/database";

function toCSV(transactions: TransactionWithCategory[]) {
  const header = ["Descrição", "Categoria", "Tipo", "Data", "Valor"];
  const rows = transactions.map((tx) => [
    tx.description,
    tx.category?.name ?? "Sem categoria",
    tx.type === "income" ? "Receita" : "Despesa",
    formatDate(tx.date),
    tx.amount.toFixed(2).replace(".", ","),
  ]);

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  return [header, ...rows]
    .map((row) => row.map((cell) => escape(String(cell))).join(";"))
    .join("\n");
}

export function ExportCsvButton({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) {
  function handleExport() {
    const csv = "﻿" + toCSV(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `transacoes-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={transactions.length === 0}
    >
      <Download className="size-4" />
      Exportar CSV
    </Button>
  );
}
