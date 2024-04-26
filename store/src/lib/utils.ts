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
      const name = categories.find((c) => c.route.endsWith(r))?.name;
      if (!temp[name]) {
        temp[name] = {};
      }
      temp = temp[name];
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

export function formatCurrency(value: number){
  const formattedValue = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value);

  const index = formattedValue.search(/\d/);
  const currencySymbol = formattedValue.slice(0, index);
  const numberValue = formattedValue.slice(index);

  return `${currencySymbol} ${numberValue}`
}
