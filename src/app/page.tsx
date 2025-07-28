"use client";
import CarRacingGame from "./CarRacingGame";
import Leaderboard from "./Leaderboard";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  useEffect(() => {
    const initializeSDK = () => {
      try {
        // Check if SDK and actions are available
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          sdk.actions.ready();
          console.log("Page component: SDK ready() called successfully");
        } else {
          console.warn("Page component: Farcaster SDK not properly initialized");
        }
      } catch (error) {
        console.warn("Page SDK initialization error:", error);
        // Continue without throwing
      }
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSDK);
    } else {
      // DOM is already ready
      initializeSDK();
    }
    
    return () => {
      document.removeEventListener('DOMContentLoaded', initializeSDK);
    };
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
