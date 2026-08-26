export type PublishStatus = "draft" | "published";

export type Category = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  featured?: boolean;
  displayOrder: number;
  keywords: string[];
};

export type Brand = {
  slug: string;
  name: string;
  logo?: string;
  kind: "channel-partner" | "client";
  summary?: string;
  displayOrder: number;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  brandSlug?: string;
  furnitureType: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  fullDescription?: string;
  features?: string[];
  materials?: string[];
  dimensions?: string;
  finishes?: string[];
  sku?: string;
  brochureUrl?: string;
  relatedSlugs: string[];
  featured?: boolean;
  displayOrder: number;
  status: PublishStatus;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export type Project = {
  slug: string;
  title: string;
  clientName: string;
  sector: string;
  location: string;
  coverImage?: string;
  coverVideo?: string;
  gallery: string[];
  description: string;
  scope: string[];
  categories: string[];
  relatedProductSlugs: string[];
  featured?: boolean;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export type Client = {
  slug: string;
  name: string;
  logo?: string;
  sector: string;
  displayOrder: number;
};

export type Location = {
  slug: string;
  name: string;
  region: string;
  intro: string;
  services: string[];
  serviceAreas: string[];
  relatedProjectSlugs: string[];
  address?: string;
  businessHours?: string;
  mapEmbedUrl?: string;
  directionsUrl?: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export type Insight = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  image: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
};

export type Faq = {
  question: string;
  answer: string;
};

