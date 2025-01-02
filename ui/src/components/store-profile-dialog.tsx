import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRestaurantProfile } from "@/api/update-restaurant-profile";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

type UpdateRestaurantForm = z.infer<typeof formSchema>;

export const StoreProfileDialog = () => {
  const queyClient = useQueryClient();

  const { data: restaurantProfile } = useQuery({
    queryFn: getManagedRestaurant,
    queryKey: ["restaurant-profile"],
    staleTime: Infinity,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateRestaurantForm>({
    resolver: zodResolver(formSchema),
    values: {
      name: restaurantProfile?.name ?? "",
      description: restaurantProfile?.description ?? "",
    },
  });

  const updateCache = ({ name, description }: UpdateRestaurantForm) => {
    const cached = queyClient.getQueryData(["restaurant-profile"]);

    if (cached) {
      queyClient.setQueryData(["restaurant-profile"], {
        ...cached,
        name,
        description,
      });
    }

    return { cached };
  };

  const { mutateAsync: updateRestaurant } = useMutation({
    mutationFn: updateRestaurantProfile,
    onMutate({ name, description }) {
      const { cached } = updateCache({ name, description });

      return { previous: cached };
    },
    onError(_error, _variables, context) {
      if (context?.previous) {
        updateCache(context.previous as UpdateRestaurantForm);
      }
    },
  });

  const handleUpdateRestaurant = async ({
    name,
    description,
  }: UpdateRestaurantForm) => {
    try {
      toast.loading("Atualizando as informações do restaurant", {
        id: "id-restaurant",
      });
      await updateRestaurant({ name, description });

      toast.success("Informações atualizadas com sucesso 🎉", {
        id: "id-restaurant",
      });
    } catch (e) {
      toast.error("Error ou atualizar ❌", {
        id: "id-restaurant",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento vísiveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateRestaurant)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input
              {...register("name", { required: true })}
              className="col-span-3"
              id="name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              {...register("description")}
              className="col-span-3"
              id="description"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button disabled={isSubmitting} variant="success" type="submit">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
