import React from 'react'
import {getProviders, signIn} from 'next-auth/react';

function login({ providers }) {
  return (
    <div className='flex flex-col items-center'>
        <img 
        className=''
        src = 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png'
        alt = 'spotify'
        />

        {Object.values(providers).map((provider) => (
            <div key={provider.name} >
                <button 
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className='bg-[#18D680] text-white p-5 rounded-full'>Login with {provider.name}</button>
            </div>
        ))}
    </div>
  )
}

export default login

export async function getServerSideProps() {
     const providers =  await getProviders(); 

     return {
        props: {
            providers
        }
     }
}