import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from '@/providers/FirebaseProvider';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Balancium - Controle Financeiro",
  description: "Sistema de controle financeiro pessoal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <FirebaseProvider>
            <Toaster position="top-right" />
            {children}
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
