import { useGo, useMany, useTranslate } from "@refinedev/core";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { ChevronsUpDown, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
import { getFileURL } from "@/lib/utils";
import { useConfig } from "@/hooks/useConfig";

const MobileNavigationMenu = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslate();
  const { config } = useConfig();
  const go = useGo();
  const { data } = useMany({
    dataProviderName: "storeProvider",
    resource: "categories",
    ids: [],
  });

  const categories = data?.message.results;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden border-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("Toggle navigation menu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
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
            className="flex items-center gap-2 text-lg font-semibold -mt-2"
          >
            {config?.brand_logo ? (
              <img
                src={getFileURL(config?.brand_logo) ?? ""}
                alt={config?.company}
                className="min-h-[30px] h-[30px] w-auto max-w-[200px]"
              />
            ) : (
              <h2>{config?.company}</h2>
            )}
          </button>
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
            className="hover:text-foreground text-left"
          >
            {t("Home")}
          </button>
          <Link
            to="/account/orders"
            className="text-muted-foreground hover:text-foreground"
          >
            {t("Orders")}
          </Link>
          {/* nested categories as dropdown */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between space-x-4 text-muted-foreground hover:text-foreground">
                <button>{t("Categories")}</button>

                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 flex flex-col pl-4">
                {categories?.map((category: any) => (
                  <button
                    key={category.name}
                    className={`py-1 text-left text-muted-foreground font-medium hover:text-foreground text-base border-l-2 pl-2 hover:border-foreground ${
                      decodeURI(window.location.search).includes(category.name)
                        ? "border-foreground !text-foreground"
                        : ""
                    }`}
                    onClick={() => {
                      go({
                        to: `/`,
                        query: {
                          filters: [
                            {
                              field: "item_group",
                              operator: "eq",
                              value: category.name,
                            },
                          ],
                        },
                        type: "push",
                      });
                      setOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigationMenu;
