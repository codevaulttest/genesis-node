import { AlertCircle, CheckCircle2, Info, Loader2, X } from 'lucide-react';
import { NODE_PRICE_USDT, TREASURY_ADDRESS, TOTAL_NODES } from '../config';
import type { ClaimStatus } from '../types';
import { shortenAddress } from '../utils/format';

type Props = {
  open: boolean;
  nextIndex: number | null;
  status: ClaimStatus;
  error: string | null;
  walletAddress: `0x${string}` | null;
  onConfirm: () => void;
  onClose: () => void;
};

export function ClaimModal({
  open,
  nextIndex,
  status,
  error,
  walletAddress,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  const busy = status === 'pending' || status === 'confirming';
  const success = status === 'success';

  return (
    <div className="modal-backdrop modal-backdrop--sheet" role="presentation" onClick={busy ? undefined : onClose}>
      <div
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sheet__head">
          <h2 id="claim-modal-title" className="modal-sheet__title">
            加入创世节点 #{nextIndex}
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            disabled={busy}
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="modal-success">
            <CheckCircle2 size={40} className="modal-success__icon" aria-hidden />
            <p>付款成功！您已获得创世节点。</p>
            <button type="button" className="button-pill-cta" onClick={onClose}>
              完成
            </button>
          </div>
        ) : (
          <>
            <div className="modal-sheet__body">
              <div className="modal-sheet__row">
                <span>您需要支付</span>
                <strong>{NODE_PRICE_USDT.toLocaleString()} USDT</strong>
              </div>
              <div className="modal-sheet__row">
                <span>转入地址</span>
                <code>{shortenAddress(TREASURY_ADDRESS, 8, 6)}</code>
              </div>
              <div className="modal-sheet__row">
                <span>您的钱包</span>
                <code>{walletAddress ? shortenAddress(walletAddress) : '—'}</code>
              </div>

              <div className="tips-banner" role="note">
                <Info size={16} className="tips-banner__icon" aria-hidden />
                <span>
                  每个钱包只能加入 1 个创世节点，按付款先后顺序编号，共 {TOTAL_NODES} 个名额。
                </span>
              </div>

              {error && (
                <div className="modal-error" role="alert">
                  <AlertCircle size={16} aria-hidden />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="modal-sheet__actions">
              <button
                type="button"
                className="button-pill-cta"
                onClick={onConfirm}
                disabled={busy}
              >
                {busy && <Loader2 size={16} className="spin" aria-hidden />}
                <span>
                  {status === 'pending'
                    ? '准备中…'
                    : status === 'confirming'
                      ? '等待确认…'
                      : '确认付款'}
                </span>
              </button>
              <button
                type="button"
                className="button-secondary-light button-secondary-light--block"
                onClick={onClose}
                disabled={busy}
              >
                取消
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
