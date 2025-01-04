import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateToNow, formatPrice } from "@/lib/utils";
import { ProductDetailsButton } from "./product-datails-button";

export interface OrderTableRowProps {
  description: string | null;
  id: string;
  name: string;
  priceInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductTableRow = (data: OrderTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <ProductDetailsButton {...data} />
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">{data.id}</TableCell>
      <TableCell className="font-medium capitalize">{data.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDateToNow(data.createdAt)}
      </TableCell>

      <TableCell className="text-right font-medium">
        {formatPrice(data.priceInCents / 100)}
      </TableCell>
    </TableRow>
  );
};
