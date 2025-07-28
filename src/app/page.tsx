"use client";
import CarRacingGame from "./CarRacingGame";
import Leaderboard from "./Leaderboard";
import { useEffect, useState } from "react";

interface GameUser {
  username: string;
  pfp_url: string;
  id: string;
}

export default function Home() {
  const [user, setUser] = useState<GameUser | null>(null);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
        const context = await sdk.context;
        console.log("Farcaster context:", context);
        if (context?.user) {
          const u = {
            username: context.user.username || "anon",
            pfp_url: context.user.pfpUrl || "/window.svg",
            id: String(context.user.fid),
          };
          setUser(u);
          console.log("Fetched user:", u.username, u.pfp_url);
        } else {
          setUser(null);
          console.log("No user context, using anon");
        }
      } catch (err) {
        console.error("Farcaster SDK/context error:", err);
        setUser(null);
      }
    };
    initFarcaster();
  }, []);

  return (
    <div className="font-sans min-h-screen bg-[#181824] flex flex-col items-center justify-center p-4">
      {/* Show fetched user info at the top for debug */}
      <div className="flex items-center gap-2 mb-2">
        <img src={user?.pfp_url || "/window.svg"} alt={user?.username || "anon"} className="w-10 h-10 rounded-full border-2 border-pink-400" />
        <span className="font-bold text-pink-200">{user?.username || "anon"}</span>
      </div>
      <h1 className="text-3xl font-extrabold text-pink-300 mb-2 pixel-font">Farcaster Pixel Racer</h1>
      <p className="text-yellow-200 mb-4 text-center">Avoid collision. Speed increases!</p>
      <CarRacingGame user={user} />
      <Leaderboard />
    </div>
  );
}
