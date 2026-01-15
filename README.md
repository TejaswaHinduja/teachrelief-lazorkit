# TeachRelief × LazorKit Demo

> **AI-Powered Grading Platform with Passkey Authentication & Gasless Payments**

This is a developer demo showcasing how to build a SaaS application with **passkey-based smart wallets** using [LazorKit SDK](https://lazorkit.com) on Solana.

---

## 🎯 What This Demo Shows

This application demonstrates **three core LazorKit features**:

1. **🔑 Passkey Authentication** - Sign in with FaceID, TouchID, or Windows Hello (no seed phrases!)
2. **💳 Gasless One-Time Payments** - Make payments without paying gas fees (sponsored by paymaster)
3. **🔄 Recurring Subscriptions** - Set up automatic monthly/yearly payments on Solana

### Inspired by TeachRelief
TeachRelief is an AI-powered education platform that automates assignment grading. This demo adapts the use case to showcase Web3 payment infrastructure.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd lazorkit

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
lazorkit/
├── app/
│   ├── auth/
│   │   ├── login/           # Passkey login page
│   │   └── signup/          # Wallet creation page
│   ├── dashboard/           # User dashboard (post-login)
│   ├── payment/             # One-time payment demo
│   ├── subscribe/           # Recurring subscription demo
│   ├── providers.tsx        # LazorKit provider wrapper
│   └── page.tsx            # Landing page
├── components/
│   └── ui/                 # Reusable UI components
└── lib/
    └── utils.ts            # Helper functions
```

---

## 🔐 How Passkey Login Works

### Step 1: User clicks "Sign in with Passkey"
```typescript
const { connect } = useWallet();
await connect(); // Opens browser passkey prompt
```

### Step 2: Browser authenticates via biometrics
- **iOS/macOS**: FaceID or TouchID
- **Windows**: Windows Hello (fingerprint/face/PIN)
- **Android**: Fingerprint or device PIN

### Step 3: LazorKit creates smart wallet
- No private keys stored
- Wallet tied to device passkey
- Instant account creation

---

## 💳 Gasless Payments

### How It Works

```typescript
const { signAndSendTransaction, smartWalletPubkey } = useWallet();

// Create transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipient,
  lamports: 0.001 * LAMPORTS_PER_SOL
});

// Send with gasless option
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    // Gas fees automatically sponsored by paymaster
  }
});
```

### Features Demonstrated
- ✅ User pays **only** for the service (0.001 SOL)
- ✅ Gas fees sponsored by LazorKit paymaster
- ✅ Works on Solana Devnet
- ✅ Transaction viewable on [Solscan](https://solscan.io)

---

## 🔄 Recurring Subscriptions

### Monthly & Yearly Plans
- **Monthly**: 0.05 SOL/month
- **Yearly**: 0.5 SOL/year (17% savings)

### How It Works (Conceptual)
In this demo, we simulate recurring payments. In production, you would:

1. Set up a **Token Program Delegation**
2. Authorize LazorKit to withdraw funds periodically
3. Use **Clockwork** or similar for automated scheduling

```typescript
// Approve recurring payment authority (production concept)
await signAndSendTransaction({
  instructions: [approveInstruction],
  transactionOptions: { /* recurring config */ }
});
```

---

## 🛠️ LazorKit Integration Guide

### 1. Install the SDK

```bash
npm install @lazorkit/wallet @solana/web3.js
```

### 2. Wrap Your App with Provider

```typescript
// app/providers.tsx
import { LazorkitProvider } from "@lazorkit/wallet";

export function Providers({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{ 
        paymasterUrl: "https://kora.devnet.lazorkit.com" 
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

### 3. Use Wallet Hooks

```typescript
import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    smartWalletPubkey,
    signAndSendTransaction 
  } = useWallet();

  return (
    <button onClick={() => connect()}>
      Connect Wallet
    </button>
  );
}
```

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Blockchain**: Solana (Devnet)
- **Wallet SDK**: LazorKit v2.0+
- **UI**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion

---

## 📦 Key Dependencies

```json
{
  "@lazorkit/wallet": "^2.0.1",
  "@solana/web3.js": "^1.98.4",
  "next": "16.1.2",
  "react": "19.2.3"
}
```

---

## 🌐 Live Demo

**Coming Soon** - Deploy to Vercel

---

## 📚 Tutorials

### Tutorial 1: Passkey Wallet Setup
See `tutorials/01-passkey-wallet.md` (coming soon)

### Tutorial 2: Gasless Payments
See `tutorials/02-gasless-payment.md` (coming soon)

### Tutorial 3: Recurring Subscriptions
See `tutorials/03-subscriptions.md` (coming soon)

---

## 🔒 Security Features

- ✅ **No seed phrases** - Passkeys use device biometrics
- ✅ **No private keys** - Managed by LazorKit SDK
- ✅ **Phishing resistant** - WebAuthn standard
- ✅ **Device-bound** - Cannot be exported

---

## 🎯 Why LazorKit?

| Traditional Wallets | LazorKit Smart Wallets |
|---------------------|------------------------|
| Seed phrase management | Passkey authentication |
| Gas fees paid by user | Gasless transactions |
| Wallet extension required | Works in any browser |
| Complex onboarding | One-click setup |

---

## 🐛 Troubleshooting

### Passkey not working?
- Ensure you're using a modern browser (Chrome/Safari/Edge)
- Check if biometrics are enabled on your device
- Try using PIN as fallback

### Transaction failing?
- Ensure you're on Solana Devnet
- Check wallet has sufficient balance
- Verify paymaster is configured correctly

---

## 📞 Contact

**Developer**: Tejaswa Hinduja
- Twitter: [@Tej_Codes](https://x.com/Tej_Codes)
- LinkedIn: [tejaswa-hinduja](https://www.linkedin.com/in/tejaswa-hinduja-b585b6323/)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **LazorKit** for the amazing SDK
- **TeachRelief** for the original concept
- **Solana** for the fast blockchain infrastructure

---

**Built with ❤️ for the LazorKit Bounty Program**
