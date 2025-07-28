"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Check if SDK and actions are available
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          await sdk.actions.ready();
          console.log("Farcaster SDK ready() called successfully");
        } else {
          console.warn("Farcaster SDK not properly initialized");
        }
      } catch (error) {
        console.warn("SDK initialization error (expected in preview):", error);
        // Don't throw - let the app continue
      }
    };

    // Call the async function
    initializeSDK();
  }, []);

  return <>{children}</>;
} 