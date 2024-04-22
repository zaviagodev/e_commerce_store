import { useCart } from "../../hooks/useCart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslate } from "@refinedev/core";
import { HeartIcon, ShoppingBag, Undo2 } from "lucide-react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import useConfig from "@/hooks/useConfig";

const Cart = () => {
  const t = useTranslate();
  const { config } = useConfig();
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal, serverCart } = useCart();
  const { setIsOpen } = useWishlist();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full relative"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 bg-primary text-xs text-white rounded-full">
              {cartCount}
            </span>
          )}
          <span className="sr-only">View cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between h-full">
        <SheetHeader className="bg-white -mt-4 flex flex-row items-center justify-between z-10 -mr-2 -ml-2">
          <SheetClose asChild>
            <Undo2 className="h-5 w-5 cursor-pointer hover:opacity-75" />
          </SheetClose>

          <SheetTitle className="!m-0">{t("Shopping Cart")}</SheetTitle>

          <HeartIcon
            className="h-5 w-5 cursor-pointer hover:opacity-75"
            onClick={() => setIsOpen(true)}
          />
        </SheetHeader>
        <ul className="my-3 flex flex-col gap-y-3">
          {Object.entries(cart).map(([itemCode, quantity]) => {
            if (!quantity) {
              return null;
            }
            return <CartItem key={itemCode} itemCode={itemCode} />;
          })}
        </ul>
        <SheetFooter className="block sm:justify-center mt-auto">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center text-lg font-medium">
              <h5>{t("Total")}</h5>
              <p>
                {typeof cartTotal === "string"
                  ? cartTotal
                  : new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency:
                        serverCart?.message.doc.price_list_currency ?? "THB",
                    }).format(cartTotal)}
              </p>
            </div>
            <SheetClose asChild>
              {config?.show_contact_us_button ? (
                <Button
                  disabled={cartCount === 0}
                  className="inset-2 w-full"
                  size="lg"
                  onClick={() => window.open(config?.contact_us_url, "_blank")}
                >
                  {config?.contact_us_label}
                </Button>
              ) : (
                <Button
                  disabled={cartCount === 0}
                  className="inset-2 w-full"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  {t("Checkout")}
                  <ShoppingBag className="ml-2 h-5 w-5" />
                </Button>
              )}
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
