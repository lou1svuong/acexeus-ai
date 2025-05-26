import { ThemeProvider } from "@/components/theme/theme-provider";
import { WalletProviders } from "./wallet-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WalletProviders>{children}</WalletProviders>
    </ThemeProvider>
  );
}
