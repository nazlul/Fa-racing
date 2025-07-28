"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeSDK = () => {
      try {
        // Check if we're in a Farcaster environment
        if (typeof window !== 'undefined' && window.location.href.includes('farcaster')) {
          sdk.actions.ready();
          console.log("Farcaster SDK ready() called in Farcaster environment");
        } else {
          // In development/preview, still call ready but handle errors
          sdk.actions.ready();
          console.log("Farcaster SDK ready() called in development environment");
        }
      } catch (error) {
        console.warn("SDK initialization error (expected in preview):", error);
        // Don't throw - let the app continue
      }
    };

    // Small delay to ensure environment is ready
    const timer = setTimeout(initializeSDK, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
} 