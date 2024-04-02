import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number | bigint) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}
