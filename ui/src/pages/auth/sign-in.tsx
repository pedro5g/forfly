import { signIn } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
});

type SignINForm = z.infer<typeof signInSchema>;

export function SignIn() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm<SignINForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  const handleSignIn = async ({ email }: SignINForm) => {
    try {
      await authenticate({ email });
      toast.success("Enviamos um link de autenticação para o seu e-mail.", {
        action: {
          label: "Reenviar",
          onClick: () => handleSignIn({ email }),
        },
      });
    } catch (e) {
      toast.error("credencias invalidas");
    }
  };

  return (
    <>
      <Helmet title="Login" />
      <div className="w-full">
        <Button className="absolute right-8 top-8" variant={"ghost"} asChild>
          <Link to={"/sign-up"}>Novo estabelecimento</Link>
        </Button>

        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo panel do parceiro
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Seu e-mail</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
              <Button disabled={isSubmitted} className="w-full" type="submit">
                Acessar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
