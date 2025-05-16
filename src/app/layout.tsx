
import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { WorldviewProvider } from "@/contexts/worldview-context";
import { Header } from "@/components/layout/header"; // Import the new Header

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Meta-Prism',
  description: 'A symbolic self-assessment tool for exploring how you construct reality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <WorldviewProvider>
          <Header /> {/* Add the global Header */}
          <div className="flex-grow"> {/* This div will ensure footer (if any) stays at bottom */}
            {children}
          </div>
          <Toaster />
        </WorldviewProvider>
      </body>
    </html>
  );
}
