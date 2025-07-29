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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        console.log("Starting Farcaster initialization...");
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Wait for SDK to be ready
        await sdk.actions.ready();
        console.log("SDK ready, getting context...");
        
        // Get context with retry logic
        let context = null;
        let retries = 0;
        const maxRetries = 5;
        
        while (retries < maxRetries) {
          try {
            context = await sdk.context;
            console.log("Farcaster context attempt", retries + 1, ":", context);
            
            if (context?.user) {
              console.log("User found in context:", context.user);
              const u = {
                username: context.user.username || "anon",
                pfp_url: context.user.pfpUrl || "/window.svg",
                id: String(context.user.fid),
              };
              setUser(u);
              console.log("Successfully set user:", u);
              break;
            } else {
              console.log("No user in context, retrying...");
              retries++;
              if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
              }
            }
          } catch (contextError) {
            console.error("Error getting context:", contextError);
            retries++;
            if (retries < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        if (!context?.user) {
          console.log("No user context after retries, using anon");
          setUser(null);
        }
      } catch (err) {
        console.error("Farcaster SDK/context error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small delay to ensure SDK is properly initialized
    setTimeout(initFarcaster, 500);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-[#181824] flex flex-col items-center justify-center p-4">
      {/* Show fetched user info at the top for debug */}
      <div className="flex items-center gap-2 mb-2">
        {loading ? (
          <span className="text-yellow-200">Loading user...</span>
        ) : (
          <>
            <img src={user?.pfp_url || "/window.svg"} alt={user?.username || "anon"} className="w-10 h-10 rounded-full border-2 border-pink-400" />
            <span className="font-bold text-pink-200">{user?.username || "anon"}</span>
            <span className="text-xs text-gray-400">({user ? "Farcaster" : "Anonymous"})</span>
          </>
        )}
      </div>
      <h1 className="text-3xl font-extrabold text-pink-300 mb-2 pixel-font">Farcaster Pixel Racer</h1>
      <p className="text-yellow-200 mb-4 text-center">Avoid collision. Speed increases!</p>
      <CarRacingGame user={user} />
      <Leaderboard />
    </div>
  );
}
