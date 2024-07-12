import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useTranslate } from "@refinedev/core";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Tag01 } from "@untitled-ui/icons-react";

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  itemCode: string;
  name: string;
  price: string;
  originalPrice?: string;
  inStock: boolean;
  image: string;
  hasVariants?: boolean | number;
  discount?: string | number;
  width?: number;
  height?: number;
}

const ProductCard = ({
  className,
  itemCode,
  name,
  price,
  discount,
  originalPrice,
  inStock,
  image,
  hasVariants = false,
  width,
  height,
  ...props
}: ProductProps) => {
  const t = useTranslate();
  const { addToCart } = useCart();
  return (
    <Link
      to={`/product/${itemCode}`}
      className="group"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className={cn("space-y-3", className)} {...props}>
        <div className="overflow-hidden rounded-md">
          <div className="aspect-square relative">
            <img
              src={image}
              alt={name}
              width={width}
              height={height}
              className={cn(
                "mx-auto object-cover transition-all group-hover:scale-105",
                "aspect-square"
              )}
            />

            {!inStock && (
              <Badge className="absolute top-4 left-4 py-1 px-1.5 flex items-center gap-x-1 rounded-md !bg-red-500">
                {t("Out of Stock")}
              </Badge>
            )}

            {discount && (
              <Badge
                className={`absolute ${
                  !inStock ? "top-12" : "top-4"
                } left-4 py-1 px-1.5 flex items-center gap-x-1 rounded-md !bg-red-500`}
              >
                <Tag01 className="h-3 w-3" />
                {discount}
              </Badge>
            )}

            {hasVariants ? (
              <Button variant="ghost" className="add-to-cart-btn">
                <span>{t("View Variants")}</span>
              </Button>
            ) : (
              inStock && (
                <Button
                  variant="ghost"
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(itemCode);
                  }}
                >
                  {t("Add to Cart")}
                </Button>
              )
            )}
          </div>
        </div>
        <div className="space-y-1 md:space-y-3 text-darkgray-400 group-hover:text-black group-hover:font-semibold">
          <h3 className="text-lg whitespace-pre overflow-hidden text-ellipsis">
            {name}
          </h3>

          {originalPrice ? (
            <span className="text-base flex items-center gap-x-2">
              <p className="text-red-500">{price}</p>
              <p className="line-through text-darkgray-300">{originalPrice}</p>
            </span>
          ) : (
            <p className="text-base">{price}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
