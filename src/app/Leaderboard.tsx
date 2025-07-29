"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

interface LeaderboardEntry {
  id: string;
  username: string;
  pfp_url: string;
  score: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      console.log("Fetching leaderboard data...");
      const { data, error } = await supabase
        .from("leaderboard")
        .select("id, username, pfp_url, score")
        .order("score", { ascending: false })
        .limit(10);
      
      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        console.log("Leaderboard data fetched:", data);
        setEntries(data || []);
      }
      setLoading(false);
    }
    fetchLeaderboard();
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 text-white p-4 rounded-lg w-full max-w-md mx-auto mt-4 border-2 border-pink-400">
      <h2 className="text-lg font-bold mb-2 text-pink-300">🏁 Leaderboard</h2>
      {loading ? (
        <div className="text-center text-yellow-200 py-4">Loading leaderboard...</div>
      ) : entries.length === 0 ? (
        <div className="text-center text-gray-400 py-4">No scores yet. Be the first!</div>
      ) : (
        <ol className="space-y-2">
          {entries.map((entry, i) => (
            <li key={entry.id} className="flex items-center gap-3 bg-pink-900/40 p-2 rounded">
              <span className="font-mono text-yellow-200 w-6">{i + 1}.</span>
              <img src={entry.pfp_url} alt={entry.username} className="w-8 h-8 rounded-full border-2 border-pink-400" />
              <span className="font-bold text-pink-200">{entry.username}</span>
              <span className="ml-auto font-mono text-yellow-300">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
} 