import { Loader2, RefreshCw } from 'lucide-react';
import { NODE_PRICE_USDT } from '../config';

type Props = {
  canClaim: boolean;
  isSoldOut: boolean;
  userIndex: number | null;
  walletConnected: boolean;
  nextIndex: number | null;
  claimStatus: string;
  refreshing: boolean;
  onClaimClick: () => void;
  onConnect: () => void;
  onRefresh: () => void;
};

export function ClaimPanel({
  canClaim,
  isSoldOut,
  userIndex,
  walletConnected,
  nextIndex,
  claimStatus,
  refreshing,
  onClaimClick,
  onConnect,
  onRefresh,
}: Props) {
  const busy = claimStatus === 'pending' || claimStatus === 'confirming';

  let title = `加入 #${nextIndex} 号创世节点`;
  let body = `支付 ${NODE_PRICE_USDT.toLocaleString()} USDT，获得该编号`;
  let primaryLabel = '立即加入';
  let onPrimary = onClaimClick;
  let primaryDisabled = !canClaim || busy;

  if (userIndex !== null) {
    title = `您已拥有创世节点 #${userIndex}`;
    body = '每个钱包只能加入 1 个，无法重复购买。';
    primaryLabel = '';
    onPrimary = () => {};
    primaryDisabled = true;
  } else if (isSoldOut) {
    title = '创世节点已全部加入';
    body = '100 个名额已满，感谢您的关注。';
    primaryLabel = '';
    onPrimary = () => {};
    primaryDisabled = true;
  } else if (!walletConnected) {
    title = '连接钱包，开始加入';
    body = `支付 ${NODE_PRICE_USDT.toLocaleString()} USDT，获得 #${nextIndex} 号创世节点`;
    primaryLabel = '连接钱包';
    onPrimary = onConnect;
    primaryDisabled = false;
  }

  return (
    <section className="feature-card" aria-label="加入创世节点">
      <h2 className="feature-card__title">{title}</h2>
      <p className="feature-card__body">{body}</p>
      <div className="feature-card__actions">
        {primaryLabel && (
          <button
            type="button"
            className="button-pill-cta"
            onClick={onPrimary}
            disabled={primaryDisabled}
          >
            {busy && <Loader2 size={16} className="spin" aria-hidden />}
            <span>{busy ? '处理中…' : primaryLabel}</span>
          </button>
        )}
        <button
          type="button"
          className="button-secondary-light button-secondary-light--block"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="刷新"
        >
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} aria-hidden />
          <span>{refreshing ? '刷新中…' : '刷新'}</span>
        </button>
      </div>
    </section>
  );
}
