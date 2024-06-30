import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import TopSheet from "../customComponents/TopSheet";
import { SearchLg, XClose } from "@untitled-ui/icons-react";
import Logo from "../customComponents/Logo";
import { useGo, useTranslate } from "@refinedev/core";
import { Input } from "../ui/input";
import ProductSearch from "./ProductSearch";

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

          <ProductSearch onSelect={() => setIsSearching(false)} />

          <Button onClick={() => setIsSearching(false)} variant="ghost">
            {t("Cancel")}
          </Button>
        </section>
      </div>
    </TopSheet>
  );
};

export default Search;
