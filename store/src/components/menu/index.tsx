import { useLogout, useMenu } from "@refinedev/core";
import { NavLink } from "react-router-dom";
import LangSelect from "../LangSelect";
import Cart from "../cart/Cart";

export const Menu = () => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();

  return (
    <nav className="menu">
      <ul>
        {menuItems.map((item) => (
          <li key={item.key}>
            <NavLink to={item.route ?? "/"}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
      <Cart />
      <LangSelect />
      <button onClick={() => logout()}>Logout</button>
    </nav>
  );
};
