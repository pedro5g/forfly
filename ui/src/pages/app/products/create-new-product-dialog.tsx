import { createNewProduct } from "@/api/create-new-procuct";
import { CurrencyInput } from "@/components/currency-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createNewProductSchema = z.object({
  name: z.string().trim(),
  description: z.string().optional(),
  price: z.coerce.number(),
});

type CreateNewProductSchemaType = z.infer<typeof createNewProductSchema>;

export const CreateNewProjectDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queries = useQueryClient();
  const { register, handleSubmit, control, reset } =
    useForm<CreateNewProductSchemaType>({
      resolver: zodResolver(createNewProductSchema),
      values: { name: "", description: undefined, price: 0 },
    });

  const onSubmit = async ({
    name,
    price,
    description,
  }: CreateNewProductSchemaType) => {
    toast.loading("cadastrando produto", {
      id: `${name}+${price}+${description?.substring(0, 5)}`,
    });
    try {
      await createNewProduct({ name, price, description });
      await queries.invalidateQueries({
        queryKey: ["products"],
        refetchType: "all",
      });
      toast.success("Produto cadastrado com sucesso ✅", {
        id: `${name}+${price}+${description?.substring(0, 5)}`,
      });
      reset();
    } catch (e) {
      toast.error("Ops, alguma coisa deu errado ao cadastrar ❌", {
        id: `${name}+${price}+${description?.substring(0, 5)}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <CirclePlus className="size-4" />
          <span className="sr-only">Detalhes do produto</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Criar produto</DialogTitle>
            <DialogDescription>
              crie um novo produto para o seu menu
            </DialogDescription>
          </DialogHeader>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="name" {...register("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Controller
                control={control}
                name="price"
                render={({ field: { value, onChange, name } }) => (
                  <CurrencyInput
                    onChange={onChange}
                    name={name}
                    value={value}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="min-h-44"
                {...register("description")}
              />
            </div>

            <Button className="w-full" type="submit">
              Criar
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
