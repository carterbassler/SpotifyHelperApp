import React from 'react'
import { getProviders, signIn } from 'next-auth/react';

function login({ providers }) {
  return (
    <div class="bg-[#1A1A1D] flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Save Discover Weekly
          </h1>
          <img
            className=''
            src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png'
            alt='spotify'
          />
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Saving Your Discover Weekly Playlist in Just One Click!
          </h1>
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className='flex items-center justify-center'>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className='bg-[#18D680] hover:bg-[#084c2d] hover:-translate-y-1 ease-in-out duration-200 text-white p-5 rounded-full'>Login with {provider.name}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default login

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}