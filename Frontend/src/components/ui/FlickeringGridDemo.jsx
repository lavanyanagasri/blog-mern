import React from "react";
import FlickeringGrid from "./FlickeringGrid";
import { ReactComponent as Logo } from "./undraw_happy-music_na4p.svg";

const FlickeringGridDemo = () => {
  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-black rounded-lg">
      {/* Background grid */}
      <FlickeringGrid
  squareSize={12}
  gridGap={6}
  color="#60A5FA"
  maxOpacity={0.9}
  flickerChance={0.5}
/>


      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        {/* Logo */}
        <div className="w-24 h-24 mb-4">
          <Logo className="w-full h-full object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold">
          Welcome to <span className="text-red-400">Echo</span>Journal
        </h1>

        {/* Bio */}
        <p className="text-sm text-gray-300 mt-3 max-w-md">
          A modern, expressive blogging platform built with React and Framer Motion.{" "}
          <span className="text-violet-500">Share thoughts, ideas,</span> and stories
          with the world — beautifully and effortlessly.
        </p>
      </div>
    </div>
  );
};

export default FlickeringGridDemo;
