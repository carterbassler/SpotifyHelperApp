import React, { PropsWithChildren } from "react";
import SideBar from "../components/SideBar";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-grow">{children}</div>
    </div>
  );
};
export default Layout;