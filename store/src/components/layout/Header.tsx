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
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";
import TopSheet from "../customComponents/TopSheet";
import Logo from "../customComponents/Logo";
import { LogIn02, SearchLg, UserCircle, XClose } from "@untitled-ui/icons-react";

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

  {/* Create the state in case the searchbar sheet will close if users have searched for the products or clicked the 'cancel' button */}
  const [isSearching, setIsSearching] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    isSearching && setSearchInput("")
  }, [isSearching])

  const LogoButton = () => {
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
        {/* Create the Logo component file onto the customComponent folder */}
        <Logo />
      </button>
    )
  }

  return (
    <header className="sticky top-0 flex h-[57px] items-center gap-4 border-b bg-background z-20">
      <div className="max-w-[1400px] m-auto w-full grid grid-cols-3 md:flex pl-4">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <LogoButton />
          <AppNavigationMenu />
        </nav>
        <MobileNavigationMenu />

        {/* Mobile logo: I have made it on the centre of the header */}
        <div className="md:hidden justify-center flex">
          <LogoButton />
        </div>

        <div className="flex ml-auto items-center gap-2">
          {/* Move the account button to the left side
              I have hidden the dropdown menu because I changed to menu and this dropdown may be used later
              If not, please consider removing it
          */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={() => {
                authState?.authenticated ? undefined : navigate("/login");
              }}
            >
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-transparent">
                {!isLoading &&
                !isFetching &&
                !isRefetching &&
                profile?.user?.user_image ? (
                  <Avatar className="h-7 w-7">
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
          </DropdownMenu> */}

          {/* Set the menu instead of dropdown when users would like to access account page or log out if they have logged in */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoading &&
            !isFetching &&
            !isRefetching ? (
              <>
                {authState?.authenticated ?
                  (
                    <div className="flex items-center">
                      <Button className="rounded-full !bg-transparent p-0 font-semibold text-base" variant="ghost" onClick={() => navigate("/account")}>
                        {profile?.user?.name}
                      </Button>
                      <Button size="icon" onClick={() => logout()} className="rounded-full !bg-transparent" variant="ghost">
                        <LogIn02 className="h-[22px] w-[22px]"/>
                      </Button>
                    </div>
                  ) : (
                    <Button size="icon" onClick={() => navigate("/login")} className="rounded-full !bg-transparent" variant="ghost">
                      <UserCircle className="h-[22px] w-[22px]" />
                    </Button> 
                  )
                }
              </>
            ) : (
              <Skeleton className="h-6 w-[100px]"/>
            )}

            <Separator className="h-6 w-[1px] bg-[#F0F0F0]"/>
          </div>

          {/* This is the searchbar sheet */}
          {config?.is_search_enabled == 1 && (
            <TopSheet open={isSearching} onOpenChange={setIsSearching} contentClassName="p-0 md:px-6" trigger={
              <Button variant="ghost" size="icon" className="rounded-full flex justify-center hover:bg-transparent">
                <SearchLg className="h-[22px] w-[22px]"/>
              </Button>
            }>
              <div className="max-w-[1400px] mx-auto w-full">
                <section className="flex items-start w-full justify-between md:gap-x-10 px-4 pt-3 pb-10">
                  <Logo className="hidden md:block"/>

                  <div className="w-full flex flex-col gap-y-5 md:gap-y-10">
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
                        <SearchLg className="absolute left-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          name="search"
                          placeholder={t("Search products")}
                          className="pl-12 w-full focus-visible:ring-0 focus-visible:ring-offset-0 bg-neutral-100 rounded-full border-neutral-100"
                          onChange={(e) => setSearchInput(e.target.value)}
                          value={searchInput}
                        />
                        {searchInput !== "" && <XClose className="absolute right-4 h-5 w-5" onClick={() => setSearchInput("")}/>}
                      </div>
                    </form>

                    <div className="space-y-6 font-semibold">
                      <h2 className="text-darkgray-300">Popular searches</h2>

                      {/* These are popular searches which I statically mock them up */}
                      <ul className="space-y-6">
                        <li>Long Hair</li>
                        <li>Liner</li>
                        <li>OPTP</li>
                      </ul>
                    </div>
                  </div>

                  <Button onClick={() => setIsSearching(false)} variant="ghost">
                    {t("Cancel")}
                  </Button>
                </section>
              </div>
            </TopSheet>
          )}

          {config?.enable_wishlist == 1 && <Wishlist />}
          <Cart />
        </div>
      </div>
    </header>
  );
};

export default Header;
