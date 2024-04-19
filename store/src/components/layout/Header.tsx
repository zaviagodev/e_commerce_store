import { CircleUser, Search, X } from "lucide-react";
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
import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import HeaderSearchbar from "../customComponents/HeaderSearchbar";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const t = useTranslate();
  const navigate = useNavigate();
  const { data: authState } = useIsAuthenticated();
  const { config } = useConfig();
  const {
    data: profile,
    isLoading,
    isFetching,
    isRefetching,
  } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const go = useGo();

  {/* Create the state in case the searchbar sheet will close if users have searched or clicked on the 'cancel' button */}
  const [isSearching, setIsSearching] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    isSearching && setSearchInput("")
  }, [isSearching])

  {/* Create a logo component to use it on the searchbar sheet and the header */}
  const Logo = () => {
    return (
      <button
        onClick={() =>
          go({
            to: `/`,
            query: {
              filters: [],
              resetPagenation: 1,
            },
            type: "push",
          })
        }
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        {config?.brand_logo ? (
          <img
            src={getFileURL(config?.brand_logo) ?? ""}
            alt={config?.company}
            className="min-h-[40px] h-[40px] w-auto max-w-[200px]"
          />
        ) : (
          <h2>{config?.company}</h2>
        )}
      </button>
    )
  }

  return (
    <header className="lg:px-64 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Logo />

        <AppNavigationMenu />
      </nav>
      <MobileNavigationMenu />

      {/* reduce the gap from 1rem to 0.5rem */}
      <div className="flex ml-auto items-center gap-2 md:ml-auto">

        {/* Move the account button to the left side */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={() => {
              authState?.authenticated ? undefined : navigate("/login");
            }}
          >
            <Button variant="ghost" size="icon" className="rounded-full">
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
        {/* End of the account button */}

        <Separator className="h-6 w-[1px] bg-[#F0F0F0]"/>

        {/* This is the searchbar sheet */}
        {config?.is_search_enabled == 1 && (
          <HeaderSearchbar open={isSearching} onOpenChange={setIsSearching}>

            <section className="flex items-start w-full justify-between gap-x-10 pt-3 py-10">
              <Logo />

              <div className="w-full flex flex-col gap-y-10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsSearching(false)
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
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      name="search"
                      placeholder="Search products..."
                      className="pl-12 w-full focus-visible:ring-0 focus-visible:ring-offset-0 bg-neutral-100 rounded-full border-neutral-100"
                      onChange={(e) => setSearchInput(e.target.value)}
                      value={searchInput}
                    />
                    {searchInput !== "" && <X className="absolute right-4 h-5 w-5" onClick={() => setSearchInput("")}/>}
                  </div>
                </form>

                <div className="flex flex-col gap-y-6">
                  <h2 className="text-[#909090]">Popular searches</h2>

                  {/* These are popular searches which I statically mock them up */}
                  <ul>
                    <li>Long Hair</li>
                    <li>Liner</li>
                    <li>OPTP</li>
                  </ul>
                </div>
              </div>

              <Button onClick={() => setIsSearching(false)} variant="ghost">
                Cancel
              </Button>
            </section>

          </HeaderSearchbar>
        )}

        {config?.enable_wishlist == 1 && <Wishlist />}
        <Cart />
      </div>
    </header>
  );
};

export default Header;
