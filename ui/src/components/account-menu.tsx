import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { StoreProfileDialog } from "./store-profile-dialog";
import { signOut } from "@/api/sign-out";
import { useNavigate } from "react-router-dom";

export const AccountMenu = () => {
  const navigate = useNavigate();

  const { data: userProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
    staleTime: Infinity,
  });
  const { data: restaurantProfile, isLoading: isLoadingRestaurantProfile } =
    useQuery({
      queryFn: getManagedRestaurant,
      queryKey: ["restaurant-profile"],
      staleTime: Infinity,
    });

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate("/sign-in", { replace: true });
    },
  });

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className="flex select-none items-center gap-2"
          >
            {isLoadingRestaurantProfile ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              restaurantProfile?.name
            )}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingUserProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="w-35 h-4" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span>{userProfile?.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {userProfile?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2">
              <Building className="size-4" />
              <span>Perfil da loja</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            asChild
            className="flex gap-2 text-rose-500 dark:text-rose-400"
            disabled={isSigningOut}
          >
            <button className="w-full" onClick={() => signOutFn()}>
              <LogOut className="size-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <StoreProfileDialog />
    </Dialog>
  );
};
