import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from "@/components/ThemeProvider"
import Nav from "@/components/Nav";

import ConvexClientProvider from "./ConvexClientProvider";

import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistMono.className} ${GeistSans.className}`}>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            <ConvexClientProvider>
              <Nav/>
              {children}
            </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
