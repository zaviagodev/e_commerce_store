import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useTranslate } from "@refinedev/core";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  itemCode: string;
  name: string;
  price: string;
  image: string;
  hasVariants?: boolean | number;

  width?: number;
  height?: number;
}

const ProductCard = ({
  className,
  itemCode,
  name,
  price,
  image,
  hasVariants = false,
  width,
  height,
  ...props
}: ProductProps) => {
  const t = useTranslate();
  const { addToCart } = useCart();
  return (
    <Link to={`/product/${itemCode}`}>
      <div className={cn("space-y-3", className)} {...props}>
        <div className="overflow-hidden rounded-md">
          <div className="aspect-square relative">
            <img
              src={image}
              alt={name}
              width={width}
              height={height}
              className={cn(
                "mx-auto object-cover transition-all hover:scale-105",
                "aspect-square"
              )}
            />
            {hasVariants ? (
              <Button className="w-64 absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <span>{t("View Variants")}</span>
              </Button>
            ) : (
              <Button
                className="w-64 absolute bottom-2 left-1/2 transform -translate-x-1/2"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(itemCode);
                }}
              >
                {t("Add to Cart")}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{name}</h3>
          <p className="text-xs text-muted-foreground">{price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
