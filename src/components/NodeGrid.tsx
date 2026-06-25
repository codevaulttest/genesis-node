import { useMemo } from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { TOTAL_NODES } from '../config';
import type { GenesisAllocation } from '../types';
import { NodeCell } from './NodeCell';

type Props = {
  allocations: GenesisAllocation[];
  walletAddress: `0x${string}` | null;
  userIndex: number | null;
  nextIndex: number | null;
  isSoldOut: boolean;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

export function NodeGrid({
  allocations,
  walletAddress,
  userIndex,
  nextIndex,
  isSoldOut,
  selectedIndex,
  onSelect,
}: Props) {
  const byIndex = useMemo(() => {
    const map = new Map<number, GenesisAllocation>();
    for (const a of allocations) map.set(a.index, a);
    return map;
  }, [allocations]);

  const locateMyNode = () => {
    if (userIndex === null) return;
    onSelect(userIndex);
    document.getElementById(`node-cell-${userIndex}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <section
      className={`node-grid-section${isSoldOut ? ' node-grid-section--complete' : ''}`}
      aria-label="全部创世节点"
    >
      {isSoldOut && (
        <div className="grid-complete-card" role="status">
          <CheckCircle2 size={28} className="grid-complete-card__icon" aria-hidden />
          <div>
            <strong className="grid-complete-card__title">
              {TOTAL_NODES} / {TOTAL_NODES} 已全部加入
            </strong>
            <p className="grid-complete-card__body">名额已满，以下是全部创世成员。</p>
          </div>
        </div>
      )}

      <div className="section-head">
        <h2 className="section-head__title">
          {isSoldOut ? '完整编号列表' : '全部创世节点'}
        </h2>
        <p className="section-head__caption">点击格子查看详情</p>
      </div>

      {userIndex !== null && walletAddress && (
        <div className="my-node-bar" role="status">
          <div className="my-node-bar__info">
            <span className="my-node-bar__label">您的编号</span>
            <strong className="my-node-bar__index">#{userIndex}</strong>
          </div>
          <button type="button" className="button-tertiary-text my-node-bar__locate" onClick={locateMyNode}>
            <MapPin size={14} aria-hidden />
            <span>在列表中定位</span>
          </button>
        </div>
      )}

      <div className="node-grid">
        {Array.from({ length: TOTAL_NODES }, (_, i) => {
          const index = i + 1;
          const allocation = byIndex.get(index);
          const isMine =
            !!walletAddress &&
            !!allocation &&
            allocation.address.toLowerCase() === walletAddress.toLowerCase();
          return (
            <NodeCell
              key={index}
              index={index}
              allocation={allocation}
              isMine={isMine}
              isNext={!isSoldOut && nextIndex === index && !allocation}
              isSelected={selectedIndex === index}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </section>
  );
}
