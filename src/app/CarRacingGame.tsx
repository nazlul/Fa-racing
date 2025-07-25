"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
// import { getFarcasterUser } from "./farcasterAuth"; // Placeholder for Farcaster user info
import { sdk } from '@farcaster/miniapp-sdk';

const LANES = 3;
const GAME_WIDTH = 240;
const GAME_HEIGHT = 400;
// Use the new player car image
const PLAYER_CAR_PNGS = [
  "/player-car.png",
];
// Adjust car size to be smaller for better fit
const CAR_WIDTH = 24;
const CAR_HEIGHT = 48;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 60;
const START_SPEED = 1.2; // slower start
const MAX_SPEED = 8;
const SPEED_INCREMENT = 0.005; // slower ramp
const COLORS = {
  bg: "#1a1a2a",
  road: "#444",
  lane: "#aaa",
  text: "#fff",
  border: "#0ff",
};
const ROAD_TEXTURE = "/road-texture.png";
const GRACE_FRAMES = 18; // ~0.3s at 60fps

// Use the new uploaded car images
const OBSTACLE_CAR_PNGS = [
  "/pixel_racecar_orange.png",
  "/pixel_racecar_purple.png",
  "/pixel_racecar_blue.png",
];

function getRandomLane() {
  return Math.floor(Math.random() * LANES);
}

export default function CarRacingGame() {
  // Game state
  const [carLane, setCarLane] = useState(1);
  const [obstacles, setObstacles] = useState([
    { y: -OBSTACLE_HEIGHT, lane: getRandomLane(), carType: Math.floor(Math.random() * OBSTACLE_CAR_PNGS.length) },
  ]);
  const [speed, setSpeed] = useState(START_SPEED);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastObstaclePassed, setLastObstaclePassed] = useState<number | null>(null);
  // Placeholder user info
  const user = {
    username: "anon",
    pfp_url: "/window.svg",
    id: "anon",
  };
  // const [user, setUser] = useState(null); // For real Farcaster auth
  const [playerCarIdx] = useState(() => Math.floor(Math.random() * PLAYER_CAR_PNGS.length));
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  // Remove all refs and state related to sound
  const touchStartX = useRef<number | null>(null);

  const gameRef = useRef<HTMLDivElement>(null);

  // Remove all useEffect and logic related to sound
  useEffect(() => {
    sdk.actions.ready();
  }, []);
  // Keyboard controls
  useEffect(() => {
    if (!started) return;
    function handleKey(e: KeyboardEvent) {
      if (gameOver) return;
      if (e.key === "ArrowLeft" && carLane > 0) {
        setCarLane(carLane - 1);
      }
      if (e.key === "ArrowRight" && carLane < LANES - 1) {
        setCarLane(carLane + 1);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [carLane, gameOver, started]);
  // Mobile swipe controls
  useEffect(() => {
    if (!started) return;
    function handleTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
    }
    function handleTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(dx) > 30) {
        if (dx < 0 && carLane > 0) {
          setCarLane(carLane - 1);
        }
        if (dx > 0 && carLane < LANES - 1) {
          setCarLane(carLane + 1);
        }
      }
      touchStartX.current = null;
    }
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [carLane, started]);

  // Game loop (randomize car types)
  useEffect(() => {
    if (!started) return;
    if (gameOver) return;
    const interval = setInterval(() => {
      setObstacles((obs) => {
        let newObs = obs.map((o) => ({ ...o, y: o.y + speed }));
        if (
          newObs.length === 0 ||
          newObs[newObs.length - 1].y > OBSTACLE_HEIGHT * 1.5
        ) {
          let nextLane = getRandomLane();
          if (newObs.length > 0 && nextLane === newObs[newObs.length - 1].lane) {
            nextLane = (nextLane + 1) % LANES;
          }
          // Random car type
          const carType = Math.floor(Math.random() * OBSTACLE_CAR_PNGS.length);
          newObs.push({ y: -OBSTACLE_HEIGHT, lane: nextLane, carType });
        }
        newObs = newObs.filter((o) => o.y < GAME_HEIGHT - 2);
        return newObs;
      });
      setScore((s) => s + 1);
      setSpeed((sp) => Math.min(sp + SPEED_INCREMENT, MAX_SPEED));
      setLastObstaclePassed((prev) => (prev !== null ? prev + 1 : null));
    }, 16);
    return () => clearInterval(interval);
  }, [speed, gameOver, started]);

  // Collision detection with improved grace zone at bottom
  useEffect(() => {
    let safe = true;
    // Shrink collision boxes by 4px on all sides
    const COLLISION_MARGIN = 4;
    const playerLeft = carLane * (GAME_WIDTH / LANES) + (GAME_WIDTH / LANES - CAR_WIDTH) / 2 + COLLISION_MARGIN;
    const playerTop = GAME_HEIGHT - CAR_HEIGHT - 10 + COLLISION_MARGIN;
    const playerRight = playerLeft + CAR_WIDTH - 2 * COLLISION_MARGIN;
    const playerBottom = playerTop + CAR_HEIGHT - 2 * COLLISION_MARGIN;
    for (const o of obstacles) {
      if (o.lane !== carLane) continue;
      const obsLeft = o.lane * (GAME_WIDTH / LANES) + (GAME_WIDTH / LANES - OBSTACLE_WIDTH) / 2 + COLLISION_MARGIN;
      const obsTop = o.y + COLLISION_MARGIN;
      const obsRight = obsLeft + OBSTACLE_WIDTH - 2 * COLLISION_MARGIN;
      const obsBottom = obsTop + OBSTACLE_HEIGHT - 2 * COLLISION_MARGIN;
      const overlap =
        playerLeft < obsRight &&
        playerRight > obsLeft &&
        playerTop < obsBottom &&
        playerBottom > obsTop;
      if (overlap) {
        setGameOver(true);
        safe = false;
        break;
      }
    }
    if (safe) {
      const allAbove = obstacles.every(
        (o) => o.y + OBSTACLE_HEIGHT < GAME_HEIGHT - CAR_HEIGHT - 10 - 8
      );
      if (allAbove) setLastObstaclePassed(0);
    }
  }, [obstacles, carLane]);

  // Submit score to leaderboard
  useEffect(() => {
    if (gameOver && score > 0) {
      supabase.from("leaderboard").insert([
        {
          username: user.username,
          pfp_url: user.pfp_url,
          score,
          user_id: user.id,
        },
      ]);
    }
  }, [gameOver]);

  // Restart
  function restart() {
    setCarLane(1);
    setObstacles([{ y: -OBSTACLE_HEIGHT, lane: getRandomLane(), carType: Math.floor(Math.random() * OBSTACLE_CAR_PNGS.length) }]);
    setSpeed(START_SPEED);
    setScore(0);
    setGameOver(false);
  }

  // Render pixel game
  return (
    <div className="flex flex-col items-center mt-6">
      {/* Start overlay */}
      {!started && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(20,20,40,0.95)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: 28,
          }}
          onClick={() => setStarted(true)}
          onTouchStart={() => setStarted(true)}
        >
          <div>🚗 Farcaster Pixel Racer</div>
          <div className="text-lg mt-2">Tap or press any key to start</div>
        </div>
      )}
      <div
        ref={gameRef}
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          background: `url(${ROAD_TEXTURE}) repeat, ${COLORS.bg}`,
          backgroundSize: "32px 32px",
          border: `4px solid ${COLORS.border}`,
          position: "relative",
          imageRendering: "pixelated",
          overflow: "hidden",
        }}
      >
        {/* Road */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: `url(${ROAD_TEXTURE}) repeat, ${COLORS.road}`,
            backgroundSize: "32px 32px",
            opacity: 0.01, // further reduce texture intensity
            imageRendering: "pixelated",
          }}
        />
        {/* Black overlay to further reduce texture */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        />
        {/* Lane lines */}
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(GAME_WIDTH / LANES) * i - 2}px`,
              top: 0,
              width: 4,
              height: "100%",
              background: COLORS.lane,
              opacity: 0.5,
              zIndex: 2,
            }}
          />
        ))}
        {/* Obstacles */}
        {obstacles.map((o, idx) => (
          <img
            key={idx}
            src={OBSTACLE_CAR_PNGS[o.carType ?? 0]}
            alt="Obstacle Car"
            style={{
              position: "absolute",
              left: `${o.lane * (GAME_WIDTH / LANES) + (GAME_WIDTH / LANES - OBSTACLE_WIDTH) / 2}px`,
              top: o.y,
              width: OBSTACLE_WIDTH,
              height: OBSTACLE_HEIGHT,
              zIndex: 3,
              imageRendering: "pixelated",
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Player car */}
        <img
          src={PLAYER_CAR_PNGS[playerCarIdx]}
          alt="Player Car"
          style={{
            position: "absolute",
            left: `${carLane * (GAME_WIDTH / LANES) + (GAME_WIDTH / LANES - CAR_WIDTH) / 2}px`,
            top: GAME_HEIGHT - CAR_HEIGHT - 10,
            width: CAR_WIDTH,
            height: CAR_HEIGHT,
            zIndex: 4,
            imageRendering: "pixelated",
            pointerEvents: "none",
          }}
        />
        {/* Score */}
        <div
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            color: COLORS.text,
            fontFamily: "monospace",
            fontSize: 18,
            zIndex: 5,
          }}
        >
          Score: {score}
        </div>
        {/* Game Over */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "monospace",
              fontSize: 28,
              zIndex: 10,
            }}
          >
            <div>Game Over</div>
            <div className="text-lg mt-2 text-white">Score: {score}</div>
            <button
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded border-2 border-pink-300 hover:bg-pink-700"
              onClick={restart}
            >
              Restart
            </button>
          </div>
        )}
      </div>
      {/* User info */}
      <div className="flex items-center gap-2 mt-2">
        <img src={user.pfp_url} alt={user.username} className="w-8 h-8 rounded-full border-2 border-pink-400" />
        <span className="font-bold text-pink-200">{user.username}</span>
      </div>
    </div>
  );
} 