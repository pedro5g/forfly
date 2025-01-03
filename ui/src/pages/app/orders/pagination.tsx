import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (pageIndex: number) => Promise<void> | void;
}

export const Pagination = ({
  pageIndex,
  perPage,
  totalCount,
  onPageChange,
}: PaginationProps) => {
  const pages = Math.ceil(totalCount / perPage) || 1;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} item(s)
      </span>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex} de {pages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={pageIndex === 1}
            onClick={() => onPageChange(1)}
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="size4" />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button
            disabled={pageIndex === 1}
            onClick={() => onPageChange(pageIndex - 1)}
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="size4" />
            <span className="sr-only">Proxima página</span>
          </Button>
          <Button
            disabled={pageIndex === pages}
            onClick={() => onPageChange(pageIndex + 1)}
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="size4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button
            disabled={pageIndex === pages}
            onClick={() => onPageChange(pages)}
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="size4" />
            <span className="sr-only">Ultima Página</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
