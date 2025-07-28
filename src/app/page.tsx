"use client";
import CarRacingGame from "./CarRacingGame";
import Leaderboard from "./Leaderboard";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  useEffect(() => {
    const initializeSDK = () => {
      try {
        sdk.actions.ready();
        console.log("Page component: SDK ready() called");
      } catch (error) {
        console.warn("Page SDK initialization error:", error);
        // Continue without throwing
      }
    };

    // Delay to ensure environment is ready
    const timer = setTimeout(initializeSDK, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-[#181824] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold text-pink-300 mb-2 pixel-font">Farcaster Pixel Racer</h1>
      <p className="text-yellow-200 mb-4 text-center">Avoid collision. Speed increases!</p>
      <CarRacingGame />
      <Leaderboard />
    </div>
  );
}
