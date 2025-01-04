import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const searchProductSchema = z.object({
  productName: z.string().trim(),
});

type SearchProductSchemaType = z.infer<typeof searchProductSchema>;

export const SearchProduct = () => {
  const [searchParmas, setSearchParams] = useSearchParams();

  const productName = searchParmas.get("productName");

  const { register, handleSubmit, reset } = useForm<SearchProductSchemaType>({
    resolver: zodResolver(searchProductSchema),
    defaultValues: {
      productName: productName ?? "",
    },
  });

  function handleFilter({ productName }: SearchProductSchemaType) {
    setSearchParams((prev) => {
      if (productName) {
        prev.set("productName", productName);
      } else {
        prev.delete("productName");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilter() {
    setSearchParams((prev) => {
      prev.delete("productName");
      prev.delete("page");
      return prev;
    });

    reset({
      productName: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-sm font-semibold">Pesquisar</span>

      <Input
        placeholder="Pesquisar por nome"
        className="h-8 w-[320px]"
        {...register("productName")}
      />
      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 size-4" />
        Pesquisar
      </Button>
      <Button
        onClick={handleClearFilter}
        type="button"
        variant="outline"
        size="xs"
      >
        <X className="mr-2 size-4" />
        Limpar
      </Button>
    </form>
  );
};
