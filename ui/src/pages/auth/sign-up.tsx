import { registerRestaurant } from "@/api/register-restaurant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  });

  const handleSignUp = async ({
    email,
    managerName,
    phone,
    restaurantName,
  }: SignUpForm) => {
    try {
      await registerRestaurantFn({ email, managerName, restaurantName, phone });

      toast.success("Restaurante cadastrado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/sign-in?email=${email}`),
        },
      });
    } catch (e) {
      toast.error("Erro ao cadastrar");
    }
  };

  return (
    <>
      <Helmet title="Cadastro" />
      <div>
        <Button className="absolute right-8 top-8" variant={"ghost"} asChild>
          <Link to={"/sign-in"}>Fazer login</Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e comece suas vendas
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
                <Input
                  id="restaurantName"
                  type="text"
                  {...register("restaurantName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerName">Seu nome</Label>
                <Input
                  id="managerName"
                  type="text"
                  {...register("managerName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="text" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Seu e-mail</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
              <Button disabled={isSubmitted} className="w-full" type="submit">
                Cadastrar
              </Button>
              <p className="p-6 text-center text-sm leading-relaxed text-muted-foreground">
                Ao continuar você concorda com nossos{" "}
                <a className="underline underline-offset-4" href="#">
                  termos de serviços
                </a>{" "}
                e{" "}
                <a className="underline underline-offset-4" href="#">
                  politicas de privacidade
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
