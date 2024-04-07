import { CircleUser, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetIdentity,
  useGo,
  useIsAuthenticated,
  useLogout,
  useTranslate,
} from "@refinedev/core";
import { AppNavigationMenu } from "./AppNavigationMenu";
import Cart from "../cart/Cart";
import Wishlist from "../wishlist/Wishlist";
import MobileNavigationMenu from "./MobileNavigationMenu";

const Header = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { data: authState } = useIsAuthenticated();
  const {
    data: profile,
    isLoading,
    isFetching,
    isRefetching,
  } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const go = useGo();

  return (
    <header className="lg:px-64 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <AppNavigationMenu />
      </nav>
      <MobileNavigationMenu />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form
          className="ml-auto flex-1 sm:flex-initial"
          onSubmit={(e) => {
            e.preventDefault();
            go({
              to: `/`,
              query: {
                filters: [
                  {
                    field: "search",
                    operator: "eq",
                    value: e.currentTarget.search.value,
                  },
                ],
                resetPagenation: 1,
              },
              type: "push",
            });
          }}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <Wishlist />
        <Cart />
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={() => {
              authState?.authenticated ? undefined : navigate("/login");
            }}
          >
            <Button variant="secondary" size="icon" className="rounded-full">
              {!isLoading &&
              !isFetching &&
              !isRefetching &&
              profile?.user?.user_image ? (
                <Avatar>
                  <AvatarImage
                    src={profile.user?.user_image}
                    alt={`${profile.user?.full_name} profile image`}
                  />
                  <AvatarFallback>{profile.user?.full_name[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <CircleUser className="h-5 w-5" />
              )}

              <span className="sr-only">{t("Toggle user menu")}</span>
            </Button>
          </DropdownMenuTrigger>
          {authState?.authenticated && (
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/account")}>
                {t("Profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                {t("Logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
