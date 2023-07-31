import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";

type Props = {};

interface Image {
  url: string;
}

interface Artist {
  images: Image[];
  name: string;
}

interface Album {
  images: Image[];
  name: string;
}

interface Artist {
  name: string;
}

interface Track {
  album: Album;
  name: string;
  duration_ms: string;
  artists: Artist[];
}

interface SpotifyResponseArtists {
  body: {
    items: Artist[];
  };
}

interface SpotifyResponseTracks {
  body: {
    items: Track[];
  };
}

function formatDuration(durationMs: number): string {
  // Convert duration from milliseconds to seconds
  let totalSeconds = Math.floor(durationMs / 1000);

  // Calculate the number of minutes and remaining seconds
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  // Convert the seconds to a string, padding with a leading zero if necessary
  let secondsStr = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

  return `${minutes}:${secondsStr}`;
}

function Wrapped({}: Props) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [view, setView] = useState("artists");
  useEffect(() => {
    if (spotifyApi.getAccessToken) {
      spotifyApi.getMyTopArtists({ limit: 32, offset: 0 }).then(
        function (data: SpotifyResponseArtists) {
          let artists = data.body.items;
          setTopArtists(artists);
        },
        function (err: any) {
          console.log("Something went wrong!", err);
        }
      );
      spotifyApi.getMyTopTracks({ limit: 50, offset: 0 }).then(
        function (data: SpotifyResponseTracks) {
          let tracks = data.body.items;
          setTopTracks(tracks);
          console.log(topTracks);
        },
        function (err: any) {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [session, spotifyApi]);
  return (
    <div className="flex flex-col h-screen bg-[#1A1A1D] justify-start items-center overflow-y-scroll md:scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-green-500 pt-10">
      <div className="flex justify-center items-center w-4/5 text-white py-8">
        <h2 className="text-2xl md:text-3xl font-bold mr-auto ml-4">
          Anytime Wrapped
        </h2>
        <button
          onClick={() => setView("artists")}
          className={`mx-2 px-3 py-1 rounded-full text-white text-sm md:text-base focus:outline-none ${
            view === "artists" ? "bg-green-500" : "bg-transparent"
          }`}
        >
          Top Artists
        </button>
        <button
          onClick={() => setView("tracks")}
          className={`mx-2 px-3 py-1 rounded-full text-white text-sm md:text-base focus:outline-none ${
            view === "tracks" ? "bg-green-500" : "bg-transparent"
          }`}
        >
          Top Tracks
        </button>
      </div>
      <div className="flex justify-center">
        {view === "artists" ? (
          <div className="grid grid-cols-4 gap-10 md:gap-20 mx-auto">
            {topArtists.map((artist, index) => (
              <div key={index}>
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-24 h-24 md:w-48 md:h-48 rounded-full hover:rounded-3xl transition-all ease-in duration-300 cursor-pointer"
                />
                <p className="text-white text-center py-2">{artist.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {topTracks.map((track, index) => (
              <div key={index} className="flex justify-center w-full pb-2">
              <div className="flex justify-between items-center w-4/5">
                <div className="flex items-center">
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="w-24 h-24 md:w-32 md:h-32 mx-5"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-sm md:text-base text-white">{track.name}</h2>
                    <div className="flex flex-row">
                      <h2 className="text-sm md:text-base text-white">{track.artists[0].name}</h2>
                      <h2>.</h2>
                      <h2 className="text-sm md:text-base text-white">{track.album.name}</h2>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <h2 className="text-sm md:text-base text-white">{formatDuration(Number(track.duration_ms))}</h2>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wrapped;
