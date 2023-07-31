import React, { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";

type Props = {};

interface Image {
  url: string;
}

interface Followers {
    href : string
    total : string
}

interface Profile {
  images: Image[];
  followers: Followers;
}

interface SpotifyProfileResponse {
  body: Profile;
}

interface Playlist {
  images: Image[];
  name: string;
  description: string;
}

interface SpotifyPlaylistResponse {
  body: {
    items: Playlist[];
  };
}

function Profile({}: Props) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<Profile>({
    images: [],
    followers: {
      href: "",
      total: ""
    },
  });
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  useEffect(() => {
    if (spotifyApi.getAccessToken) {
      spotifyApi.getMe().then(
        function (data: SpotifyProfileResponse) {
            console.log(
              "Some information about the authenticated user",
              data.body
            );
          let profile = data.body;
          setProfileData(profile);
        },
        function (err: any) {
          console.log("Something went wrong!", err);
        }
      );
      spotifyApi.getUserPlaylists({limit : 30, offset : 0}).then(
        function (data: SpotifyPlaylistResponse) {
          setPlaylistData(data.body.items);
        },
        function (err: any) {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [session, spotifyApi]);
  return (
    <div className="flex flex-col h-screen items-center overflow-y-scroll md:scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-green-500 pt-10 bg-[#1A1A1D]">
      <h1 className="text-3xl text-white p-5">Profile</h1>
      {profileData.images[1] && (
        <img
          src={profileData.images[1].url}
          className="w-32 h-32 md:w-48 md:h-48 rounded-full"
        />
      )}
      <div className="flex flex-row items-center justify-center text-center">
        <div className="flex flex-col p-5">
          <h2 className="text-green-500">{profileData.followers.total}</h2>
          <h2 className="text-white">Followers</h2>
        </div>
        {/* <div className="flex flex-col p-5">
          <h2 className="text-green-500">1</h2>
          <h2 className="text-white">Playlists</h2>
        </div> */}
      </div>
      <h2 className="text-2xl text-white p-5">Playlists</h2>
      <div className="flex justify-center">
  <div className="grid grid-cols-4 gap-5 md:gap-10 mx-auto">
    {playlistData.map((playlist, index) => (
      <div key={index}>
        <img
          src={playlist.images[0].url}
          alt={playlist.name}
          className="w-24 h-24 md:w-48 md:h-48 mx-auto"
        />
        <p className="text-white text-center py-2">{playlist.name}</p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}

export default Profile;
