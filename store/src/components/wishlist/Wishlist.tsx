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
import WishlistItem from "./WishlistItem";
import { useWishlist } from "@/hooks/useWishlist";
import EmptyList from "../customComponents/EmptyList";
import { FlipBackward, Heart } from "@untitled-ui/icons-react";

const Wishlist = () => {
  const t = useTranslate();
  const { wishlist, wishlistCount, isOpen, setIsOpen } = useWishlist();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative hover:bg-transparent"
        >
          <Heart />
          {wishlistCount > 0 && (
            <span className="absolute top-0.5 -right-0.5 flex items-center justify-center h-4 w-4 bg-primary text-xs text-white rounded-full">
              {wishlistCount}
            </span>
          )}
          <span className="sr-only">{t("View wishlist")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full p-5">
        <SheetHeader className="bg-white -m-5 flex flex-row items-center justify-between z-10 px-4 py-3 border-b">

          {/* Set Undo2 as absolute to make the title centred */}
          <SheetClose asChild>
            <FlipBackward className="h-5 w-5 cursor-pointer hover:opacity-75 absolute" />
          </SheetClose>

          <SheetTitle className="!mx-auto !my-0 text-base">{t("Favorites")}</SheetTitle>
        </SheetHeader>
        {wishlistCount > 0 ? (
          <ul className="my-3 flex flex-col gap-y-3 pt-3">
            {wishlist.map((itemCode) => (
              <WishlistItem key={itemCode} itemCode={itemCode} />
            ))}
          </ul>
        ) : (
          <EmptyList 
            icon={<Heart className="text-white w-[30px] h-[30px]"/>}
            title={t("Empty_wishlist.title")}
            desc={t("Empty_wishlist.desc")}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Wishlist;
