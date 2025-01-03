import { Outlet } from "react-router-dom";
import { Pizza } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen max-md:flex-col-reverse md:grid-cols-2">
      <div className="flex h-screen flex-1 flex-col justify-between border-foreground bg-muted p-10 text-muted-foreground md:border-r">
        <header className="flex items-center gap-3 text-lg font-medium text-foreground">
          <Pizza className="size-5" />
          <span className="font-semibold">forkly.shop</span>
        </header>

        <footer className="text-sm">
          Painel do parceiro &copy; forkly.shop - {new Date().getFullYear()}
        </footer>
      </div>
      <main className="relative flex flex-1 flex-col items-center justify-center p-8">
        <Outlet />
      </main>
    </div>
  );
}
