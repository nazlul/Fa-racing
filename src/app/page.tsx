"use client";
import CarRacingGame from "./CarRacingGame";
import Leaderboard from "./Leaderboard";
import { useEffect, useState } from "react";

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<FarcasterUser | null>(null);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        const context = await sdk.context;
        if (context?.user) {
          setCurrentUser({
            fid: context.user.fid,
            username: context.user.username || "unknown",
            displayName: context.user.displayName || "User",
            pfpUrl: context.user.pfpUrl || "/icon.png",
          });
        }
        await sdk.actions.ready();
      } catch (err) {
        console.error("Farcaster SDK/context error:", err);
      }
    };
    initFarcaster();
  }, []);

  // Map FarcasterUser to CarRacingGame user prop shape
  const gameUser = currentUser
    ? {
        username: currentUser.username,
        pfp_url: currentUser.pfpUrl,
        id: String(currentUser.fid),
      }
    : undefined;

  return (
    <div className="font-sans min-h-screen bg-[#181824] flex flex-col items-center justify-center p-4">
      {currentUser && (
        <div className="flex items-center mb-4">
          <img src={currentUser.pfpUrl} alt="pfp" className="w-10 h-10 rounded-full mr-2" />
          <div>
            <div className="text-white font-bold">{currentUser.displayName} (@{currentUser.username})</div>
            <div className="text-xs text-gray-400">FID: {currentUser.fid}</div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-extrabold text-pink-300 mb-2 pixel-font">Farcaster Pixel Racer</h1>
      <p className="text-yellow-200 mb-4 text-center">Avoid collision. Speed increases!</p>
      <CarRacingGame user={gameUser} />
      <Leaderboard />
    </div>
  );
}
