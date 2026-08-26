import { siteConfig } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappHref}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(productName: string, path: string) {
  return `Hello Destino Furniture Studio, I would like to enquire about ${productName}. Page: ${absoluteUrl(path)}`;
}

export function projectWhatsappMessage(projectName: string, path: string) {
  return `Hello Destino Furniture Studio, I would like to discuss a project similar to ${projectName}. Page: ${absoluteUrl(path)}`;
}

export function quoteWhatsappMessage(productNames: string[], path: string) {
  const products = productNames.length
    ? `Products: ${productNames.join(", ")}. `
    : "";
  return `Hello Destino Furniture Studio, I would like a quotation. ${products}Page: ${absoluteUrl(path)}`;
}

