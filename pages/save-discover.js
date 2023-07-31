import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import Popup from "../components/Popup";
import SpringModal from "../components/SpringModal";

function HomeScreen() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div class="bg-[#1A1A1D] flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white p-5 md:p-10">
        Save Discover Weekly
      </h1>
      <div className="w-4/5">
        <h2 className="text-sm md:text-xl text-white p-5 text-center">
          Are you loving your Spotify Discover Weekly but can't always get
          through all the songs before it refreshes each week? Don't worry,
          we've got you covered. By clicking the "Auto-Save Discover Weekly"
          button, our application will automatically save each week's curated
          Discover Weekly playlist into a separate clone playlist. This way,
          you'll never lose the chance to discover your next favorite song.
          Enjoy your music journey without the rush, and listen to your Discover
          Weekly playlists at your own pace.
        </h2>
      </div>
      <SpringModal isOpen={buttonPopup} setIsOpen={setButtonPopup} />
    </div>
  );
}

export default HomeScreen;
