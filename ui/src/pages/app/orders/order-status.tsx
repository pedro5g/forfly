import { StatusType } from "./order-table-row";

interface OrderStatusProps {
  status: StatusType;
}

const mapping: Record<StatusType, string> = {
  pending: "Pendente",
  canceled: "Cancelado",
  processing: "Preparando",
  delivering: "A caminho",
  delivered: "Entregue",
};

export const OrderStatus = ({ status }: OrderStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <span
        data-status={status}
        className="size-2 rounded-full data-[status=canceled]:bg-red-500 data-[status=delivered]:bg-emerald-400 data-[status=delivering]:bg-amber-500 data-[status=pending]:bg-slate-400 data-[status=processing]:bg-amber-500"
      />
      <span className="font-medium text-muted-foreground">
        {mapping[status]}
      </span>
    </div>
  );
};
