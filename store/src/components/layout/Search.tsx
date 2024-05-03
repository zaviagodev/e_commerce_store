import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import TopSheet from "../customComponents/TopSheet";
import { SearchLg, XClose } from "@untitled-ui/icons-react";
import Logo from "../customComponents/Logo";
import { useGo, useTranslate } from "@refinedev/core";
import { Input } from "../ui/input";

const Search = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const t = useTranslate();
  const go = useGo();

  useEffect(() => {
    isSearching && setSearchInput("");
  }, [isSearching]);

  return (
    <TopSheet
      open={isSearching}
      onOpenChange={setIsSearching}
      contentClassName="py-0"
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="-mt-1 rounded-full relative hover:bg-transparent"
        >
          <SearchLg />
        </Button>
      }
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <section className="flex items-start w-full justify-between gap-x-10 px-4 pt-3 py-10">
          <Logo />

          <div className="w-full flex flex-col gap-y-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSearching(false);
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
                {searchInput !== "" && (
                  <XClose
                    className="absolute right-4 h-5 w-5"
                    onClick={() => setSearchInput("")}
                  />
                )}
              </div>
            </form>

            <div className="space-y-6 font-semibold">
              <h2 className="text-darkgray-300">{t("Popular searches")}</h2>

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
  );
};

export default Search;
