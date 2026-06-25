import { NODE_PRICE_USDT, TOTAL_NODES } from '../config';

type Props = {
  claimedCount: number;
  nextIndex: number | null;
  isSoldOut: boolean;
  userIndex: number | null;
};

export function StatsHero({ claimedCount, nextIndex, isSoldOut, userIndex }: Props) {
  const remaining = TOTAL_NODES - claimedCount;

  return (
    <section className="hero-band-dark" aria-label="创世节点">
      <h1 className="display-title">知识宇宙 · 创世节点</h1>
      <p className="body-md">
        属于您的创世编号，等您来定。全球仅限 {TOTAL_NODES} 个。
      </p>

      <div className="product-ui-card-dark">
        <div className="stat-row">
          <span className="stat-row__label">已有参与者</span>
          <span className="stat-row__value">
            {claimedCount}
            <span className="stat-row__denom"> / {TOTAL_NODES} 人</span>
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-row__label">{isSoldOut ? '状态' : '下一个号码'}</span>
          <span className="stat-row__value stat-row__value--up">
            {isSoldOut ? '已全部加入' : `#${nextIndex}`}
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-row__label">剩余名额</span>
          <span className="stat-row__value">{remaining}</span>
        </div>
        <div className="stat-row">
          <span className="stat-row__label">加入费用</span>
          <span className="stat-row__value">
            {NODE_PRICE_USDT.toLocaleString()} USDT
          </span>
        </div>
      </div>

      {userIndex !== null && (
        <div className="status-banner status-banner--owned" role="status">
          <span className="status-banner__label">您的创世节点编号：</span>
          <span className="status-banner__value">#{userIndex}</span>
        </div>
      )}

      {isSoldOut && (
        <div className="status-banner status-banner--soldout" role="status">
          100 个名额已全部加入
        </div>
      )}
    </section>
  );
}
