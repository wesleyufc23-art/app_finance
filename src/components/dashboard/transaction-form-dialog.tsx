"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Category, Transaction, TransactionType } from "@/types/database";

const transactionSchema = z.object({
  description: z.string().trim().min(1, "Informe uma descrição."),
  amount: z
    .number({ error: "Informe um valor válido." })
    .positive("O valor deve ser maior que zero."),
  date: z.string().min(1, "Informe a data."),
  type: z.enum(["income", "expense"]),
  category_id: z.string().min(1, "Selecione uma categoria."),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionFormDialog({
  categories,
  transaction,
  onSaved,
  trigger,
}: {
  categories: Category[];
  transaction?: Transaction;
  onSaved: () => void;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(transaction);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ?? todayISO(),
      type: transaction?.type ?? "expense",
      category_id: transaction?.category_id ?? "",
    },
  });

  const type = watch("type");

  useEffect(() => {
    if (open) {
      reset({
        description: transaction?.description ?? "",
        amount: transaction?.amount ?? undefined,
        date: transaction?.date ?? todayISO(),
        type: transaction?.type ?? "expense",
        category_id: transaction?.category_id ?? "",
      });
    }
  }, [open, transaction, reset]);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function onSubmit(values: TransactionFormValues) {
    const supabase = createClient();

    if (isEditing && transaction) {
      const { error } = await supabase
        .from("transactions")
        .update({
          description: values.description,
          amount: values.amount,
          date: values.date,
          type: values.type as TransactionType,
          category_id: values.category_id,
        })
        .eq("id", transaction.id);

      if (error) {
        toast.error("Não foi possível salvar a transação.");
        return;
      }
      toast.success("Transação atualizada.");
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }

      const { error } = await supabase.from("transactions").insert({
        description: values.description,
        amount: values.amount,
        date: values.date,
        type: values.type as TransactionType,
        category_id: values.category_id,
        user_id: user.id,
      });

      if (error) {
        toast.error("Não foi possível criar a transação.");
        return;
      }
      toast.success("Transação criada.");
    }

    setOpen(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da {type === "income" ? "receita" : "despesa"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Despesa</SelectItem>
                    <SelectItem value="income">Receita</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category_id && (
              <p className="text-sm text-destructive">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
