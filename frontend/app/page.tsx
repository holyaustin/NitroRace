// app/page.tsx
import { ConnectWallet } from '@/components/ConnectWallet';
import { MyCars } from '@/components/MyCars';
import { JoinRace } from '@/components/JoinRace';

export default function Home() {
  return (
    <main className="min-h-screen p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">🏎️ Blockchain Racer</h1>

      <div className="flex justify-end mb-8">
        <ConnectWallet />
      </div>

      <MyCars />

      <JoinRace />

      {/* Admin panel – hide in prod 
      <DeclareWinner /> */}
    </main>
  );
}