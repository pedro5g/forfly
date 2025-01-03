import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const SELECT_OPTIONS: { value: string; content: string }[] = [
  { value: "all", content: "Todos" },
  { value: "pending", content: "Pendente" },
  { value: "canceled", content: "Cancelado" },
  { value: "processing", content: "Em preparo" },
  { value: "delivering", content: "A caminho" },
  { value: "delivered", content: "Entregue" },
];

const orderFilterSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
});

type OrderFiltersForm = z.infer<typeof orderFilterSchema>;

export const OrderTableFilters = () => {
  const [searchParmas, setSearchParams] = useSearchParams();

  const orderId = searchParmas.get("orderId");
  const customerName = searchParmas.get("customerName");
  const status = searchParmas.get("status");

  const { register, handleSubmit, control, reset } = useForm<OrderFiltersForm>({
    resolver: zodResolver(orderFilterSchema),
    defaultValues: {
      status: status ?? "all",
      orderId: orderId ?? "",
      customerName: customerName ?? "",
    },
  });

  function handleFilter({ orderId, customerName, status }: OrderFiltersForm) {
    setSearchParams((prev) => {
      if (orderId) {
        prev.set("orderId", orderId);
      } else {
        prev.delete("orderId");
      }
      if (status) {
        prev.set("status", status);
      } else {
        prev.delete("status");
      }
      if (customerName) {
        prev.set("customerName", customerName);
      } else {
        prev.delete("customerName");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilter() {
    setSearchParams((prev) => {
      prev.delete("orderId");
      prev.delete("customerName");
      prev.delete("status");

      prev.delete("page");
      return prev;
    });

    reset({
      orderId: "",
      customerName: "",
      status: "all",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros</span>
      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register("orderId")}
      />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
        {...register("customerName")}
      />
      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => (
          <Select
            name={name}
            defaultValue={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SELECT_OPTIONS.map((opt, i) => (
                <SelectItem value={opt.value} key={`key_${i}`}>
                  {opt.content}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 size-4" />
        Filtrar
      </Button>
      <Button
        onClick={handleClearFilter}
        type="button"
        variant="outline"
        size="xs"
      >
        <X className="mr-2 size-4" />
        Remover Filtros
      </Button>
    </form>
  );
};
