import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslate } from "@refinedev/core";
import { HeartIcon, Undo2 } from "lucide-react";
import WishlistItem from "./WishlistItem";
import { useWishlist } from "@/hooks/useWishlist";

const Wishlist = () => {
  const t = useTranslate();
  const { wishlist, wishlistCount, isOpen, setIsOpen } = useWishlist();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full relative"
        >
          <HeartIcon className="h-5 w-5 " />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 bg-primary text-xs text-white rounded-full">
              {wishlistCount}
            </span>
          )}
          <span className="sr-only">{t("View wishlist")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader className="bg-white -mt-4 flex flex-row items-center  z-10 -mr-2 -ml-2">
          <SheetClose asChild>
            <Undo2 className="h-5 w-5 cursor-pointer hover:opacity-75" />
          </SheetClose>

          <SheetTitle className="!mx-auto !my-0">{t("Favorites")}</SheetTitle>
        </SheetHeader>
        <ul className="my-3 flex flex-col gap-y-3">
          {wishlist.map((itemCode) => (
            <WishlistItem key={itemCode} itemCode={itemCode} />
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};

export default Wishlist;
