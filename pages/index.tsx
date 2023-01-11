import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react';
import HomeScreen from '../components/HomeScreen';

const Home: NextPage = () => {
  return (
    <div className='bg-[#1A1A1D]'>
      <HomeScreen />
    </div>
  )
}

export default Home
