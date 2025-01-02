import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string) {
  return value.toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
  });
}

export function formatDateToNow(date: string | Date) {
  return formatDistanceToNow(date, {
    locale: ptBR,
    addSuffix: true,
  });
}

export async function wait(time: number = 500) {
  await new Promise((resolve) => setTimeout(resolve, time));
}
