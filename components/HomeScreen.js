import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';
import Popup from '../components/Popup';

function HomeScreen() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    const [uri, setUri] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [cloneUri, setCloneUri] = useState([]);
    var trackUriArray = [];
    const [uriArray, setUriArray] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);


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
        setButtonPopup(true);
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
        <div class="bg-[#1A1A1D] flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div className='flex items-center justify-left'>
                        <button onClick={() => signOut()} className='bg-[#18D680] hover:bg-[#084c2d] hover:-translate-y-1 ease-in-out duration-200 text-white p-3 rounded-full text-sm'>Log Out</button>
                    </div>
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                        Save Discover Weekly
                    </h1>
                    <div className="relative h-32 w-32 mx-auto">
                        <img className='object-contain rounded-full'
                            layout='fill'
                            objectFit='contain'
                            src={session?.user.image}
                            alt={''}
                        />
                    </div>
                    <Popup trigger={buttonPopup} setTrigger={setButtonPopup} />
                    <div className='z-20'>
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Welcome {session?.user.name}
                        </h1>
                        <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
                            DISCLAIMER
                        </h1>
                        <h1 class="text-md font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
                            You must have your "Discover Weekly" in your Liked Playlists
                        </h1>
                    </div>
                    <div className='flex items-center justify-center'>
                        <button onClick={() => makeClonePlaylist()} className='bg-[#18D680] hover:bg-[#084c2d] hover:-translate-y-1 ease-in-out duration-200 text-white p-5 rounded-full'>Save Discover Weekly</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen