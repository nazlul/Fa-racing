"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function AutoSignIn() {
  useEffect(() => {
    const doSignIn = async () => {
      try {
        const nonce = Math.random().toString(36).substring(2, 12);
        const result = await sdk.actions.signIn({
          nonce,
          acceptAuthAddress: true,
        });
        console.log("Signed in automatically:", result);
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          (error as { name: string }).name === "RejectedByUser"
        ) {
          console.log("User rejected sign-in.");
        } else {
          console.error("Sign-in failed:", error);
        }
      }
    };

    doSignIn();
  }, []);

  return null; // This component does not render anything
} 