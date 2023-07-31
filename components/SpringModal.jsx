import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheckSquare, FiX } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';

const ExampleWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const removeNotif = (id) => {
    setNotifications((prevNotifs) => prevNotifs.filter((notif) => notif.id !== id));
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 hover:bg-[#084c2d] hover:-translate-y-1 ease-in-out duration-200 text-white p-5 rounded-full"
      >
        Save Discover Weekly
      </button>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} setNotifications={setNotifications} />
      <div className="flex flex-col gap-1 w-72 fixed top-2 right-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SpringModal = ({ isOpen, setIsOpen, setNotifications }) => {
  const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [uri, setUri] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [cloneUri, setCloneUri] = useState([]);
    var trackUriArray = [];
    const [uriArray, setUriArray] = useState([]);
  useEffect(() => {
    if (spotifyApi.getAccessToken) {
        spotifyApi.getUserPlaylists().then((data) => {
            for (let i = 0; i < data.body.items.length; i++) {
                console.log(data.body.items[i].name);
                if (data.body.items[i].name === "Discover Weekly") {
                    var DiscoverWeekly = data.body.items[i].uri;
                    var strArr = DiscoverWeekly.split(/\s*(?:\bas\b|:)\s*/);
                    setUri(strArr[2]);
                    spotifyApi.getPlaylistTracks(strArr[2], {
                        offset: 0,
                        limit: 30,
                        fields: 'items'
                    }).then((data) => {
                        console.log(data.body.items);
                        for (let i = 0; i < data.body.items.length; i++) {
                            trackUriArray.push(data.body.items[i].track.uri);
                        }
                        setUriArray(trackUriArray);
                    }, (error) => {
                        console.log('There was an error in getting the songs from the playlist')
                    }
                    );
                }
            }
        }, (error) => {
            console.log('There was an error in Retrieving The Playlist')
        })
    }
}, [session, spotifyApi])
function makeClonePlaylist() {
  setIsOpen(false);
  setNotifications((pv) => [generateNotif(), ...pv]);
    var temp = getMonday(new Date()).toString();
    var temp2 = temp.split(/[ ,]+/);
    var playlistName = "Discover Weekly (" + temp2[0] + " " + temp2[1] + " " + temp2[2] + ")";
    spotifyApi.createPlaylist(playlistName, { 'public': true })
        .then(function (data) {
            var tempUri = data.body.uri;
            var strArr = tempUri.split(/\s*(?:\bas\b|:)\s*/);
            setCloneUri(strArr[2])
            console.log(uriArray)
            spotifyApi.addTracksToPlaylist(strArr[2], uriArray)
                .then(function (data) {
                    console.log('Added tracks to playlist!');
                }, function (err) {
                    console.log('Something went wrong!', err);
                });
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}
function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-green-500 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-green-500 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Disclaimer!
              </h3>
              <p className="text-center mb-6">
                In order to successfully save your Discover Weekly Playlist. You must have it in your liked playlists.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Nah, go back
                </button>
                <button
                  onClick={() => makeClonePlaylist()}
                  className="bg-white hover:opacity-90 transition-opacity text-green-500 font-semibold w-full py-2 rounded"
                >
                  Understood!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NOTIFICATION_TTL = 5000;

const Notification = ({ text, id, removeNotif }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, []);

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-2 flex items-start rounded gap-2 text-xs font-medium shadow-lg text-white bg-green-500 pointer-events-auto"
    >
      <FiCheckSquare className=" mt-0.5" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};

const generateNotif = () => {
  const data = {
    id: Math.random(),
    text: "Playlist Saved Successfully",
  };

  return data;
};

export default ExampleWrapper;
