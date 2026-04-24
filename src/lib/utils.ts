import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shouldUnoptimizeImage(src: string | undefined): boolean {
  if (!src) return false;
  const localDomains = [".test", "localhost", "127.0.0.1"];
  return localDomains.some((domain) => src.includes(domain));
}
