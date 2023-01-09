import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react';
import HomeScreen from '../components/HomeScreen';

const Home: NextPage = () => {
  return (
    <div>
      <HomeScreen />
    </div>
  )
}

export default Home
