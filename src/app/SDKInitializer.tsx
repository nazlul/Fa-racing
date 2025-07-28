"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function SDKInitializer() {
  useEffect(() => {
    console.log("SDKInitializer: Component mounted, calling ready() immediately");
    
    if (sdk?.actions?.ready) {
      try {
        sdk.actions.ready();
        console.log("SDKInitializer: ready() called successfully");
      } catch (error) {
        console.error("SDKInitializer: Error calling ready():", error);
      }
    } else {
      console.error("SDKInitializer: SDK not properly loaded");
    }
  }, []);

  return null; // This component doesn't render anything
} 