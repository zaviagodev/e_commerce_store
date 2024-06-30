import { Outlet, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { File06, MarkerPin04, User01 } from "@untitled-ui/icons-react";

const Account = () => {
  const t = useTranslate();
  const {
    data: profile,
    isLoading,
    isFetching,
    isRefetching,
  } = useGetIdentity();

  // if (isLoading || isFetching || isRefetching) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 px-4">
      <div className="hidden col-span-1 lg:flex flex-col py-12">
        <div className="flex flex-col gap-3">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profile?.user?.user_image}
              alt={`${profile?.user?.full_name} profile image`}
            />
            <AvatarFallback>{profile?.user?.full_name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-primary">
            {profile?.user.full_name}
          </h2>
        </div>
        {/* menu with profile, addresses and order history with active route highlited */}
        <nav className="flex flex-col mt-12">
          <NavLink
            className={({ isActive }) =>
              `flex font-bold items-center gap-x-[10px] h-[50px] ${
                isActive ? "text-primary" : "text-darkgray-500"
              }`
            }
            end
            to="/account"
          >
            <User01 className="h-5 w-5" /> {t("Account Details")}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex font-bold items-center gap-x-[10px] h-[50px] ${
                isActive ? "text-primary" : "text-darkgray-500"
              }`
            }
            to="/account/addresses"
          >
            <MarkerPin04 className="h-5 w-5" /> {t("Addresses")}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex font-bold items-center gap-x-[10px] h-[50px] ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
            to="/account/orders"
          >
            <File06 className="h-5 w-5" /> {t("Orders")}
          </NavLink>
        </nav>
      </div>
      <div
        className="lg:col-span-4 mx-auto lg:shadow-checkout h-[calc(100vh_-_57px)] py-4 lg:p-10 w-full lg:overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;
