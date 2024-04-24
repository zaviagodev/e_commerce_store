import { useTranslate } from "@refinedev/core";
import { PropsWithChildren } from "react";
import { Helmet } from "react-helmet";
import Header from "./Header";
import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslate();
  const { config } = useConfig();
          
  const location = useLocation()

  const checkIfCheckout = 
    location.pathname === "/checkout"
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href={getFileURL(config?.brand_logo) ?? "/favicon.ico"}
        />
        <title>{config?.company + " " + t("Store")}</title>
      </Helmet>
      <div className="flex min-h-screen w-full flex-col">
        {!checkIfCheckout && <Header />}
        {/* <Menu /> */}
        <div className={`${!checkIfCheckout ? "px-4 py-[50px]" : ""} w-full max-w-[1400px] mx-auto`}>
          {/* <Breadcrumb /> */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
