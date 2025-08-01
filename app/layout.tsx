import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { GameProvider } from '@/contexts/GameContext';
import GameTracker from '@/components/GameTracker';
import Navbar from '@/components/Navbar';
import ChatbotWidget from '@/components/ChatbotWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'eMission Trade - Emissions Trading System Simulator',
  description: 'Interactive emissions trading system simulation for learning and training',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <GameProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <GameTracker />
            <ChatbotWidget />
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}