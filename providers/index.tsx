import { ThemeProvider } from "@/components/theme/theme-provider";
import { WalletProviders } from "./wallet-provider";
import { PolkadotAgentProvider } from "./polkadot-agent-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WalletProviders>
        <PolkadotAgentProvider>{children}</PolkadotAgentProvider>
      </WalletProviders>
    </ThemeProvider>
  );
}
