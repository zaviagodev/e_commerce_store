import { PropsWithChildren } from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {

  const location = useLocation()

  const checkIfCheckout = 
    location.pathname === "/checkout"

  return (
    <div className="flex min-h-screen w-full flex-col">
      {!checkIfCheckout && <Header />}
      {/* <Menu /> */}
      <div className={`${!checkIfCheckout ? "px-4 py-[50px]" : ""} w-full max-w-[1400px] mx-auto`}>
        {/* <Breadcrumb /> */}
        <div>{children}</div>
      </div>
    </div>
  );
};
