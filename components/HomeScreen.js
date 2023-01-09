import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';

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
            }, (error) => {
                console.log('There was an error in getting the songs from the playlist')
            }
            );
        }
    }, [session, spotifyApi])
    function makeClonePlaylist() {
        spotifyApi.createPlaylist('Discover Weekly Clone', { 'public': true })
            .then(function (data) {
                var tempUri = data.body.uri;
                var strArr = tempUri.split(/\s*(?:\bas\b|:)\s*/);
                setCloneUri(strArr[2])
            }, function (err) {
                console.log('Something went wrong!', err);
            });
        spotifyApi.addTracksToPlaylist(cloneUri, ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"])
            .then(function (data) {
                console.log('Added tracks to playlist!');
            }, function (err) {
                console.log('Something went wrong!', err);
            });
    }
    return (
        <div className='h-screen flex flex-col space-y-8 justify-center 
        text-center overflow-hidden'>
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
            <button onClick={() => makeClonePlaylist()} className='bg-[#18D680] text-white p-5 rounded-full'>Save Discover Weekly</button>
        </div>
    )
}

export default HomeScreen