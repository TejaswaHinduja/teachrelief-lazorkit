"use client";

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode, useEffect } from "react";

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export function Providers({ children }: { children: ReactNode }) {
  // Fix for Buffer not defined in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { Buffer } = require("buffer");
      window.Buffer = window.Buffer || Buffer;
    }
  }, []);

  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}
