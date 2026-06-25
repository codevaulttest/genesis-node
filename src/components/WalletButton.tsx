import { LogOut, Loader2, Wallet } from 'lucide-react';
import { shortenAddress } from '../utils/format';

type Props = {
  address: `0x${string}` | null;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
};

export function WalletButton({
  address,
  connecting,
  onConnect,
  onDisconnect,
}: Props) {
  if (!address) {
    return (
      <button
        type="button"
        className="nav-network nav-connect-chip"
        onClick={onConnect}
        disabled={connecting}
      >
        {connecting ? (
          <Loader2 size={12} className="spin" aria-hidden />
        ) : (
          <Wallet size={12} aria-hidden />
        )}
        <span>{connecting ? '连接中…' : '连接钱包'}</span>
      </button>
    );
  }

  return (
    <button type="button" className="nav-network nav-wallet-chip" onClick={onDisconnect}>
      <span className="wallet-dot" aria-hidden />
      <span>{shortenAddress(address)}</span>
      <LogOut size={12} aria-hidden />
    </button>
  );
}
