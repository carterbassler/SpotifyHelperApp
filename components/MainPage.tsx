import React from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";

type Props = {};

function MainPage({}: Props) {
    const [text, count] = useTypewriter({
        words: [
            "Anytime Wrapped",
            "Song Recommendations",
            "Save Discover Weekly"
        ],
        loop: true,
        delaySpeed: 2000,
    })
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="px-5 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        <span className="text-green-500">Vibify</span>
      </h1>
      <h1 className='text-3xl md:text-5xl lg:text-6xl font-semibold scroll-px-10 text-white'>
                    <span>{text}</span>
                    <Cursor cursorColor='#22C55E' />
                </h1>
    </div>
  );
}

export default MainPage;
