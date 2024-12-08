// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";

import { ThemeProvider } from "@/context/ThemeProvider";
// import SessionProvider from "@/context/AuthProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kodex - Online Code Editor",
  description: "A powerful online code editor with support for multiple languages and themes.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col h-screen`}>
        {/* <SessionProvider> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
            {children}
          </ThemeProvider>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}