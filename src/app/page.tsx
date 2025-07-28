"use client";
import CarRacingGame from "./CarRacingGame";
import Leaderboard from "./Leaderboard";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-[#181824] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold text-pink-300 mb-2 pixel-font">Farcaster Pixel Racer</h1>
      <p className="text-yellow-200 mb-4 text-center">Avoid collision. Speed increases!</p>
      <CarRacingGame />
      <Leaderboard />
    </div>
  );
}
