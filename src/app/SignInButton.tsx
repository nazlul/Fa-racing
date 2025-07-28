"use client";
import { sdk } from "@farcaster/miniapp-sdk";

export default function SignInButton() {
  const handleSignIn = async () => {
    try {
      const nonce = Math.random().toString(36).substring(2, 12);
      const result = await sdk.actions.signIn({
        nonce,
        acceptAuthAddress: true,
      });
      alert("Signed in!\nSignature: " + result.signature);
      console.log("Sign-in result:", result);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "name" in error) {
        if ((error as { name: string }).name === "RejectedByUser") {
          alert("User rejected sign-in.");
        } else {
          alert("Sign-in failed: " + (error as { message?: string }).message);
        }
      } else {
        alert("Sign-in failed: Unknown error");
      }
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-purple-600 text-white rounded mt-4"
    >
      Sign in with Farcaster
    </button>
  );
} 