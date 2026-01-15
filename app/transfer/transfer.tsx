// TransferButton.tsx
import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function TransferButton() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  const handleTransfer = async () => {
    try {
      if (!smartWalletPubkey) return;

      // 1. Create Instruction
      const destination = new PublicKey('RECIPIENT_ADDRESS');
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: destination,
        lamports: 0.1 * LAMPORTS_PER_SOL
      });

      // 2. Sign and Send
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: 'USDC' // Optional: Pay gas in USDC
        }
      });

      console.log('Transaction confirmed:', signature);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };

  return <button onClick={handleTransfer}>Send 0.1 SOL</button>;
}