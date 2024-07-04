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
      contentClassName={`p-0 data-[state=open]:!translate-y-0 data-[state=closed]:!translate-y-0 ${isSearching ? 'fade-in-search' : 'fade-out-search'} shadow-none`}
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
      <div className={`max-w-[1400px] mx-auto w-full ${isSearching ? 'fade-in-search' : 'fade-out-search'} opacity-0`}>
        <section className="flex items-start w-full justify-between gap-x-4 md:gap-x-10 px-4 md:px-2 lg:px-4 pt-3 py-10">
          <Logo className="hidden md:block"/>

          <ProductSearch onSelect={() => setIsSearching(false)} className={`${isSearching ? 'search-input-anim-in' : 'search-input-anim-out'} mx-auto`}/>

          <Button onClick={() => setIsSearching(false)} variant="ghost">
            {t("Cancel")}
          </Button>
        </section>
      </div>
    </TopSheet>
  );
};

export default Search;
