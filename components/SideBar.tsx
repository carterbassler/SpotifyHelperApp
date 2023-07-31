import React, { ReactElement } from "react";
import { FaFire, FaHome } from "react-icons/fa";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { CiSaveUp2 } from 'react-icons/ci';
import { AiOutlineUser } from 'react-icons/ai';
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type Props = {};

type SideBarIconProps = {
  icon: ReactElement;
  text: string;
  to: string;
};

function Sidebar({}: Props) {
  const { data: session } = useSession();
  return (
    <div className="sticky top-0 left-0 h-screen w-24 m-0 flex flex-col bg-gray-900 text-white shadow-lg">
  <div className="flex flex-col h-full justify-between">
    <div className="p-5">
      <img
        className=""
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
        alt="spotify"
      />
    </div>
    <div>
      <SideBarIcon to={"/"} text={"Home"} icon={<FaHome size="32" />} />
      <SideBarIcon
        to={"/wrapped"}
        text={"My Wrapped"}
        icon={<FaFire size="32" />}
      />
      <SideBarIcon
        to={"save-discover"}
        text={"Save Discover Weekly"}
        icon={<CiSaveUp2 size="32" />}
      />
      <SideBarIcon
        to={"/profile"}
        text={"Profile"}
        icon={<AiOutlineUser size="32" />}
      />
    </div>
    <div className="p-5">
      <button onClick={() => signOut({ callbackUrl : '/login'})}>
      <SideBarIcon to={""} text={"Logout"} icon={<FiLogOut size="32" />} />
      </button>
    </div>
  </div>
</div>
  );
}

const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, text, to }) => (
  <Link href={to}>
    <div className="sidebar-icon group">
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  </Link>
);

export default Sidebar;
