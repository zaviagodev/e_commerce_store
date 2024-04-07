import { Outlet, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { FileText, MapPinned, User } from "lucide-react";

const Account = () => {
  const t = useTranslate();
  const {
    data: profile,
    isLoading,
    isFetching,
    isRefetching,
  } = useGetIdentity();

  if (isLoading || isFetching || isRefetching) {
    return <div>Loading...</div>;
  }

  //   use tailwindcss classes to style the layout
  return (
    <div className="py-7 px-4 flex gap-x-8">
      <div className="w-2/5 hidden md:block">
        <div className="flex flex-col gap-3">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={profile?.user?.user_image}
              alt={`${profile?.user?.full_name} profile image`}
            />
            <AvatarFallback>{profile?.user?.full_name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold text-primary">
            {profile?.user.full_name}
          </h2>
        </div>
        {/* menu with profile, addresses and order history with active route highlited */}
        <nav className="flex flex-col mt-12">
          <NavLink
            className={({ isActive }) =>
              `flex font-bold items-center gap-x-[10px] leading-[10px] h-[50px] hover:text-linkblack text-linkblack ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
            end
            to="/account"
          >
            <User size={20} /> {t("Account Details")}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex font-bold items-center gap-x-[10px] leading-[10px] h-[50px] hover:text-linkblack text-darkgray ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
            to="/account/addresses"
          >
            <MapPinned size={20} /> {t("Addresses")}
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex font-bold items-center gap-x-[10px] leading-[10px] h-[50px] hover:text-linkblack text-darkgray ${
                isActive ? "text-primary" : "text-gray-500"
              }`
            }
            to="/account/orders"
          >
            <FileText size={20} /> {t("Orders")}
          </NavLink>
        </nav>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
