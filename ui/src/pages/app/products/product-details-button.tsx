import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";

import { Search } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { formatDate } from "date-fns";

interface ProductDetailsButtonProps {
  description: string | null;
  id: string;
  name: string;
  priceInCents: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductDetailsButton = ({
  id,
  name,
  description,
  priceInCents,
  available,
  createdAt,
  updatedAt,
}: ProductDetailsButtonProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <Search className="size-3" />
          <span className="sr-only">Detalhes do produto</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Produto: {id}</DialogTitle>
            <DialogDescription>Detalhes do produto</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">Nome</TableCell>
                  <TableCell className="flex justify-end">{name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    <div>
                      Descrição:
                      <br />
                      <br />
                      <p className="text-white">
                        {description ?? "Não informado"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    <div className="inline-flex w-full items-center justify-between">
                      {available ? "Disponível" : "Indisponível"}
                      <div
                        data-available={available}
                        className="size-3 rounded-full shadow-md data-[available=false]:bg-red-700 data-[available=true]:bg-green-500"
                      />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Criado em
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {formatDate(createdAt, "MM/dd/yyyy")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Atualizado em
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {formatDate(updatedAt, "MM/dd/yyyy")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Preço</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(priceInCents / 100)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
