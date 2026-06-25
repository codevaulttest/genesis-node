import { ExternalLink, X } from 'lucide-react';
import type { GenesisAllocation } from '../types';
import { bscscanAddressUrl, bscscanTxUrl, shortenAddress } from '../utils/format';

type Props = {
  open: boolean;
  allocation: GenesisAllocation | null;
  index: number;
  isMine: boolean;
  isNext: boolean;
  walletConnected: boolean;
  canJoin: boolean;
  onJoin: () => void;
  onConnect: () => void;
  onClose: () => void;
};

export function NodeDetailPanel({
  open,
  allocation,
  index,
  isMine,
  isNext,
  walletConnected,
  canJoin,
  onJoin,
  onConnect,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop modal-backdrop--center" role="presentation" onClick={onClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sheet__head">
          <h2 id="node-detail-title" className="modal-sheet__title">
            {isMine ? `您的 #${index} 号` : `#${index}`}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>

        <div className="modal-sheet__body">
          {isMine && (
            <div className="detail-mine-banner" role="status">
              这是您的创世节点
            </div>
          )}

          {allocation ? (
            <dl className="detail-list">
              <div className="detail-list__row">
                <dt className="detail-list__label">归属钱包</dt>
                <dd className="detail-list__value">
                  <a href={bscscanAddressUrl(allocation.address)} target="_blank" rel="noreferrer">
                    {shortenAddress(allocation.address, 8, 6)}
                    <ExternalLink size={12} aria-hidden />
                  </a>
                </dd>
              </div>
              <div className="detail-list__row">
                <dt className="detail-list__label">链上凭证</dt>
                <dd className="detail-list__value">
                  <a href={bscscanTxUrl(allocation.txHash)} target="_blank" rel="noreferrer">
                    {shortenAddress(allocation.txHash, 8, 6)}
                    <ExternalLink size={12} aria-hidden />
                  </a>
                </dd>
              </div>
            </dl>
          ) : isNext ? (
            <p className="detail-empty">这是下一个可加入的号码，支付后即可获得该编号。</p>
          ) : (
            <p className="detail-empty">这个号码还可以加入，连接钱包后参与。</p>
          )}
        </div>

        {isNext && (
          <div className="modal-sheet__actions">
            {!walletConnected ? (
              <button type="button" className="button-pill-cta" onClick={onConnect}>
                连接钱包
              </button>
            ) : canJoin ? (
              <button type="button" className="button-pill-cta" onClick={onJoin}>
                立即加入
              </button>
            ) : (
              <p className="detail-empty detail-empty--hint">每个钱包只能加入 1 个创世节点。</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
