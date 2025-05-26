"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { moonbaseAlpha, moonbeam, westendAssetHub } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "ai-agent-kit-example",
  projectId: "455a9939d641d79b258424737e7f9205",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [westendAssetHub, moonbeam, moonbaseAlpha],
  transports: {
    [westendAssetHub.id]: http(),
    [moonbeam.id]: http(),
    [moonbaseAlpha.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: any }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={0}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#7856ff",
            accentColorForeground: "white",
          })}
          locale="en-US"
        >
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
