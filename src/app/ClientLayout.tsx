"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initializeSDK = () => {
      try {
        // Check if SDK and actions are available
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          sdk.actions.ready();
          console.log("Farcaster SDK ready() called successfully");
        } else {
          console.warn("Farcaster SDK not properly initialized");
        }
      } catch (error) {
        console.warn("SDK initialization error (expected in preview):", error);
        // Don't throw - let the app continue
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

  return <>{children}</>;
} 