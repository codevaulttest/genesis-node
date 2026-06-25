import type { GenesisAllocation } from '../types';
import { shortenAddress } from '../utils/format';

type Props = {
  index: number;
  allocation: GenesisAllocation | undefined;
  isMine: boolean;
  isNext: boolean;
  isSelected: boolean;
  onSelect: (index: number) => void;
};

export function NodeCell({ index, allocation, isMine, isNext, isSelected, onSelect }: Props) {
  const claimed = !!allocation;
  const className = [
    'node-cell',
    claimed ? 'node-cell--claimed' : '',
    isNext ? 'node-cell--next' : '',
    isMine ? 'node-cell--mine' : '',
    isSelected && !isMine ? 'node-cell--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      id={`node-cell-${index}`}
      className={className}
      onClick={() => onSelect(index)}
      aria-pressed={isSelected}
      aria-current={isMine ? 'true' : undefined}
      aria-label={
        isMine
          ? `您的创世节点，#${index} 号`
          : claimed
            ? `#${index}，归属 ${shortenAddress(allocation!.address)}`
            : isNext
              ? `下一个号码 #${index}`
              : `#${index}，可加入`
      }
    >
      {isMine && <span className="node-cell__mine-tag">我的</span>}
      <span className="node-cell__index">#{index}</span>
      {claimed && !isMine && (
        <span className="node-cell__holder">{shortenAddress(allocation!.address, 4, 3)}</span>
      )}
      {!claimed && <span className="node-cell__status">{isNext ? '下一个' : '可加入'}</span>}
    </button>
  );
}
