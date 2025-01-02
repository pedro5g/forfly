import { Outlet } from "react-router-dom";
import { Pizza } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="flex h-full flex-col justify-between border-r border-foreground bg-muted p-10 text-muted-foreground">
        <header className="flex items-center gap-3 text-lg font-medium text-foreground">
          <Pizza className="size-5" />
          <span className="font-semibold">forkly.shop</span>
        </header>

        <footer className="text-sm">
          Painel do parceiro &copy; forkly.shop - {new Date().getFullYear()}
        </footer>
      </div>
      <main className="relative flex flex-col items-center justify-center p-8">
        <Outlet />
      </main>
    </div>
  );
}
