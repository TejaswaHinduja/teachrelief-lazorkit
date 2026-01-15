import Image from "next/image";

// App.tsx
import { LazorkitProvider } from '@lazorkit/wallet';

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: { 
    paymasterUrl: "https://kora.devnet.lazorkit.com" 
  }
};


export default function Home() {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
     hii
    </LazorkitProvider>
  );
}
