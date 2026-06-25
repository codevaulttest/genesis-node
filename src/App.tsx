import { useCallback, useState } from 'react';
import { ClaimModal } from './components/ClaimModal';
import { ClaimPanel } from './components/ClaimPanel';
import { DevPanel } from './components/DevPanel';
import { NodeDetailPanel } from './components/NodeDetailPanel';
import { NodeGrid } from './components/NodeGrid';
import { StatsHero } from './components/StatsHero';
import { WalletButton } from './components/WalletButton';
import { DEMO_MODE } from './config';
import { applyDemoData, buildDemoUiForScenario } from './demo/applyDemoScenario';
import { DEMO_UI_IDLE, type DemoScenarioId } from './demo/scenarios';
import { useGenesisNodes } from './hooks/useGenesisNodes';
import { useWallet } from './hooks/useWallet';

export default function App() {
  const wallet = useWallet();
  const [demoUi, setDemoUi] = useState(DEMO_UI_IDLE);
  const effectiveAddress = demoUi.mockWallet ?? wallet.address;
  const nodes = useGenesisNodes(effectiveAddress);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const effectiveIsOnBsc = demoUi.wrongChain ? false : wallet.isOnBsc;
  const effectiveLoading = demoUi.loading || nodes.loading;
  const claimModalOpen = demoUi.claimModal || modalOpen;
  const claimStatus = demoUi.claimStatus ?? nodes.claimStatus;

  const selectedAllocation =
    selectedIndex !== null
      ? nodes.allocations.find((a) => a.index === selectedIndex) ?? null
      : null;

  const openClaim = () => {
    nodes.resetClaimStatus();
    setDemoUi((d) => ({ ...d, claimModal: false, claimStatus: null }));
    setModalOpen(true);
  };

  const handleClaim = async () => {
    await nodes.claim();
  };

  const closeModal = () => {
    if (claimStatus === 'pending' || claimStatus === 'confirming') return;
    setModalOpen(false);
    if (demoUi.claimModal || demoUi.claimStatus) {
      setDemoUi((d) => ({ ...d, claimModal: false, claimStatus: null }));
    }
    nodes.resetClaimStatus();
  };

  const handleDemoSelect = useCallback(
    (id: DemoScenarioId) => {
      applyDemoData(id);
      setDemoUi(buildDemoUiForScenario(id));
      setModalOpen(false);
      setSelectedIndex(null);
      nodes.resetClaimStatus();
      nodes.refresh();
    },
    [nodes],
  );

  return (
    <div className="app">
      {wallet.error && (
        <div className="toast-error" role="alert">
          {wallet.error}
        </div>
      )}

      <div className="dark-top">
        <header className="top-nav-light">
          <WalletButton
            address={effectiveAddress}
            connecting={wallet.connecting}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />
          {effectiveAddress && !effectiveIsOnBsc && (
            <span className="nav-network nav-network--warn">请切换到 BNB 链</span>
          )}
        </header>

        {effectiveLoading ? (
          <div className="loading-state" role="status">
            加载中…
          </div>
        ) : (
          <StatsHero
            claimedCount={nodes.claimedCount}
            nextIndex={nodes.nextIndex}
            isSoldOut={nodes.isSoldOut}
            userIndex={nodes.userAllocation?.index ?? null}
          />
        )}
      </div>

      <main className="main">
        {!effectiveLoading && (
          <ClaimPanel
            canClaim={nodes.canClaim}
            isSoldOut={nodes.isSoldOut}
            userIndex={nodes.userAllocation?.index ?? null}
            walletConnected={!!effectiveAddress}
            nextIndex={nodes.nextIndex}
            claimStatus={claimStatus}
            refreshing={nodes.refreshing}
            onClaimClick={openClaim}
            onConnect={wallet.connect}
            onRefresh={nodes.refresh}
          />
        )}
      </main>

      {!effectiveLoading && (
        <div className="node-grid-band">
          <NodeGrid
            allocations={nodes.allocations}
            walletAddress={effectiveAddress}
            userIndex={nodes.userAllocation?.index ?? null}
            nextIndex={nodes.nextIndex}
            isSoldOut={nodes.isSoldOut}
            selectedIndex={selectedIndex}
            onSelect={(index) =>
              setSelectedIndex((prev) => (prev === index ? null : index))
            }
          />
        </div>
      )}

      {selectedIndex !== null && (
        <NodeDetailPanel
          open
          allocation={selectedAllocation}
          index={selectedIndex}
          isMine={
            !!effectiveAddress &&
            !!selectedAllocation &&
            selectedAllocation.address.toLowerCase() === effectiveAddress.toLowerCase()
          }
          isNext={
            !nodes.isSoldOut &&
            nodes.nextIndex === selectedIndex &&
            !selectedAllocation
          }
          walletConnected={!!effectiveAddress}
          canJoin={nodes.canClaim}
          onJoin={() => {
            setSelectedIndex(null);
            openClaim();
          }}
          onConnect={wallet.connect}
          onClose={() => setSelectedIndex(null)}
        />
      )}

      <ClaimModal
        open={claimModalOpen}
        nextIndex={nodes.nextIndex}
        status={claimStatus}
        error={nodes.claimError}
        walletAddress={effectiveAddress}
        onConfirm={handleClaim}
        onClose={closeModal}
      />

      {DEMO_MODE && (
        <DevPanel current={demoUi.scenario} onSelect={handleDemoSelect} />
      )}

      <footer className="legal-band">
        知识宇宙 · 创世节点
      </footer>
    </div>
  );
}
