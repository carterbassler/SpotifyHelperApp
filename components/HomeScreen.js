import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';
import { setTimeout } from "timers-promises";

function HomeScreen() {
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
                    if (data.body.items[i].name === "Discover Weekly") {
                        var DiscoverWeekly = data.body.items[i].uri;
                        var strArr = DiscoverWeekly.split(/\s*(?:\bas\b|:)\s*/);
                        setUri(strArr[2]);
                    }
                }
            }, (error) => {
                console.log('There was an error in Retrieving The Playlist')
            })
            spotifyApi.getPlaylistTracks(uri, {
                offset: 0,
                limit: 30,
                fields: 'items'
            }).then((data) => {
                for (let i = 0; i < data.body.items.length; i++) {
                    trackUriArray.push(data.body.items[i].track.uri);
                }
                setUriArray(trackUriArray);
            }, (error) => {
                console.log('There was an error in getting the songs from the playlist')
            }
            );
        }
    }, [session, spotifyApi])
    function makeClonePlaylist() {
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
        <div className='h-screen flex flex-col space-y-8 justify-center 
        text-center overflow-hidden mx-auto'>
            <div className="relative h-32 w-32 mx-auto">
                <img className='object-contain rounded-full'
                    layout='fill'
                    objectFit='contain'
                    src={session?.user.image}
                    alt={''}
                />
            </div>
            <div className='z-20'>
                <h2 className='text-xl text-black pb-2'>
                    Welcome {session?.user.name}
                </h2>
            </div>
            <div>
                <button onClick={() => makeClonePlaylist()} className='bg-[#18D680] hover:bg-[#084c2d] hover:-translate-y-1 ease-in-out duration-200 text-white p-5 rounded-full'>Save Discover Weekly</button>
            </div>
        </div>
    )
}

export default HomeScreen