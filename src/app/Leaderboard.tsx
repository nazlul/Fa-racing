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

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("id, username, pfp_url, score")
        .order("score", { ascending: false })
        .limit(10);
      if (!error && data) setEntries(data);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-black/80 text-white p-4 rounded-lg w-full max-w-md mx-auto mt-4 border-2 border-pink-400">
      <h2 className="text-lg font-bold mb-2 text-pink-300">🏁 Leaderboard</h2>
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
    </div>
  );
} 