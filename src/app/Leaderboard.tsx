"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Test() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);
  return <div>Test Mini App</div>;
} 