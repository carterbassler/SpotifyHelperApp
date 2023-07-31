import React, { PropsWithChildren } from "react";
import SideBar from "../components/SideBar";
import NavBar from "./NavBar";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="md:flex">
      <div className="hidden md:flex">
        <SideBar />
      </div>
      <div className="flex md:hidden">
        <NavBar />
      </div>
      <div className="text-center md:flex-grow">{children}</div>
    </div>
  );
};
export default Layout;