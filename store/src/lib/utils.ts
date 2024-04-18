import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategories(categories: any[]) {
  const result = {};
  categories.forEach((category) => {
    const route = category.route.split("/");
    let temp: any = result;
    route.forEach((r: string) => {
      if (!temp[r]) {
        temp[r] = {};
      }
      temp = temp[r];
    });
  });
  return result;
}

export function getFileURL(url?: string) {
  if (url?.startsWith("/")) {
    return `${import.meta.env.VITE_BACKEND_URL ?? ""}${url}`;
  }

  if (url == "" || url == null || url == undefined) {
    return null;
  }

  return url;
}
