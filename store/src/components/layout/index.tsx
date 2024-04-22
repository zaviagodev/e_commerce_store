import { PropsWithChildren } from "react";
import Header from "./Header";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      {/* <Menu /> */}
      <div className="px-4 max-w-[1400px] w-full mx-auto py-10">
        {/* <Breadcrumb /> */}
        <div>{children}</div>
      </div>
    </div>
  );
};
