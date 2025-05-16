import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { WorldviewProvider } from "@/contexts/worldview-context";

const geistSans = Geist({ // Corrected instantiation
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected instantiation
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
    <html lang="en" className="dark"> {/* Enforce dark theme */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <WorldviewProvider>
          {children}
          <Toaster />
        </WorldviewProvider>
      </body>
    </html>
  );
}
