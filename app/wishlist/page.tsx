import { WishlistPage } from "@/components/wishlist-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Wishlist",
  description:
    "View saved Destino Furniture Studio products and request one combined furniture quotation.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistRoute() {
  return <WishlistPage />;
}

