import { useTranslate } from "@refinedev/core";
import { PropsWithChildren } from "react";
import { Helmet } from "react-helmet";
import Header from "./Header";
import { useConfig } from "@/hooks/useConfig";
import { getFileURL } from "@/lib/utils";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslate();
  const { config } = useConfig();
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
        <Header />
        {/* <Menu /> */}
        <div className="lg:px-64 py-6 content">
          {/* <Breadcrumb /> */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
