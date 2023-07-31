import type { NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import MainPage from "../components/MainPage";
import SideBar from "../components/SideBar";
import Router from "next/router";
import Layout from "../components/Layout";


const Home: NextPage = () => {
  return (
    <div className="bg-[#1A1A1D]">
      <MainPage />
    </div>
  );
};

export default Home;
