import { cn, getCategories } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useGo, useMany, useTranslate } from "@refinedev/core";
import React, { useMemo } from "react";

export function AppNavigationMenu() {
  const t = useTranslate();
  const { data } = useMany({
    dataProviderName: "storeProvider",
    resource: "categories",
    ids: [],
  });

  const categories = useMemo(() => {
    if (!data?.message.results) {
      return {};
    }
    return getCategories(data?.message.results ?? []);
  }, [data?.message.results]);

  return (
    <NavigationMenu className="static xl:relative">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold text-base">{t("Categories")}</NavigationMenuTrigger>
          <NavigationMenuContent className="!w-screen xl:!max-w-[1136px] text-base px-6 py-10">
            <ul className="grid gap-3 grid-cols-4"> {/* Original grid columns: lg:grid-cols-[.75fr_1fr] */}
              <RecursiveComponent data={{ ...categories }} />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <Link to="/docs">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"button">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <button
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </button>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const RecursiveComponent = ({ data }) => {
  const go = useGo();
  const pairs = Object.entries(data);

  return (
    <>
      {pairs.map(([categoryName, value]) => (
        <div className="flex flex-col gap-y-3">
          <li
            key={categoryName}
            className="ml-2 cursor-pointer font-semibold hover:text-black"
            onClick={() =>
              go({
                to: `/`,
                query: {
                  filters: [
                    {
                      field: "item_group",
                      operator: "eq",
                      value: categoryName,
                    },
                  ],
                },
                type: "push",
              })
            }
          >
            {categoryName}
          </li>
          <ul className="text-darkgray-300 text-sm">
            <RecursiveComponent data={value} />
          </ul>
        </div>
      ))}
    </>
  );
};
