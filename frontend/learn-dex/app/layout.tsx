import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./components/provider";
import "@rainbow-me/rainbowkit/styles.css";
import Header from "./components/header";
import { AppProvider } from "./components/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnDex",
  description:
    "LearnDex is a UniswapV2 fork which allows you to learn about DeFi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <AppProvider>
            <Header /> {children}{" "}
          </AppProvider>
        </Provider>
      </body>
    </html>
  );
}
