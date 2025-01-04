import { getProducts } from "@/api/get-products";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { OrderTableSkeleton } from "../orders/order-table-skeleton";
import { Pagination } from "../orders/pagination";
import { ProductTableRow } from "./product-table-row";
import { SearchProduct } from "./search-product";

export function Products() {
  const [searchParmas, setSearchParams] = useSearchParams();
  const productName = searchParmas.get("productName");
  const pageIndex = z.coerce.number().parse(searchParmas.get("page") ?? "1");

  const { data: result, isLoading } = useQuery({
    queryFn: () =>
      getProducts({
        pageIndex,
        productName,
      }),
    queryKey: ["products", pageIndex, productName],
  });

  const handlePagination = (pageIndex: number) => {
    setSearchParams((prev) => {
      prev.set("page", pageIndex.toString());
      return prev;
    });
  };

  return (
    <>
      <Helmet title="products" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <div className="space-y-2.5">
          <SearchProduct />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Name</TableHead>
                  <TableHead className="w-[140px]">Criado em</TableHead>

                  <TableHead className="w-[140px] text-right">Preço</TableHead>
                  <TableHead className="w-[30px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <OrderTableSkeleton />}
                {result &&
                  result.products.map((product) => (
                    <ProductTableRow key={product.id} {...product} />
                  ))}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              onPageChange={handlePagination}
              pageIndex={result.meta.pageIndex}
              perPage={result.meta.perPage}
              totalCount={result.meta.totalCount}
            />
          )}
        </div>
      </div>
    </>
  );
}
