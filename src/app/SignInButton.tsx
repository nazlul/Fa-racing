"use client";
import { sdk } from "@farcaster/miniapp-sdk";

export default function SignInButton() {
  const handleSignIn = async () => {
    try {
      // Generate a random nonce (at least 8 alphanumeric characters)
      const nonce = Math.random().toString(36).substring(2, 12);
      const result = await sdk.actions.signIn({
        nonce,
        acceptAuthAddress: true,
      });
      // You can send result.signature and result.message to your backend for verification
      alert("Signed in!\nSignature: " + result.signature);
      console.log("Sign-in result:", result);
    } catch (error: any) {
      if (error.name === "RejectedByUser") {
        alert("User rejected sign-in.");
      } else {
        alert("Sign-in failed: " + error.message);
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