import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const socialLinks = {
  facebook: "https://www.facebook.com/cinema.co.ao",
  twitter: "https://twitter.com/cinema_co_ao",
  instagram: "https://www.instagram.com/cinema.co.ao",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}