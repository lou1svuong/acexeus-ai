import ConnectWalletBtn from "../connect-wallet-btn";
import ThemeToggle from "../theme/theme-toggle";

export function Header() {
  return (
    <div className="w-full flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold">Polkadot AI Agent Kit</h1>

      <div className="flex items-center gap-2">
        <ConnectWalletBtn />
        <ThemeToggle />
      </div>
    </div>
  );
}
