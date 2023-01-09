import React from 'react'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';

function HomeScreen() {
    const spotifyApi = useSpotify();
    const { data: session } = useSession();
    var DiscoverWeekly = "";
    var finalUri = "";

    var temp = getDiscoverWeekly();
    console.log(temp);
    function getDiscoverWeekly() {
        spotifyApi.getUserPlaylists()
        .then(
            function (data) {
            for (let i = 0; i < data.body.items.length; i++) {
                if (data.body.items[i].name === "Discover Weekly") {
                    DiscoverWeekly = data.body.items[i].uri;
                    var strArr = DiscoverWeekly.split(/\s*(?:\bas\b|:)\s*/);
                    finalUri = strArr[2];
                    console.log("RUNNING");
                }
            }
        });
        return finalUri;
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
            <button className='bg-[#18D680] text-white p-5 rounded-full'>Save Discover Weekly</button>
        </div>
    )
}

export default HomeScreen