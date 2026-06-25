import { DEMO_MODE } from '../config';
import {
  buildDemoAllocations,
  DEMO_USER_ADDRESS,
  DEMO_UI_IDLE,
  type DemoScenarioId,
  type DemoUiState,
} from './scenarios';
import { resetDemoToSeed, setDemoAllocations } from '../utils/bsc';

export function buildDemoUiForScenario(id: DemoScenarioId): DemoUiState {
  const base: DemoUiState = { ...DEMO_UI_IDLE, scenario: id };

  switch (id) {
    case 'owned':
      return { ...base, mockWallet: DEMO_USER_ADDRESS };
    case 'loading':
      return { ...base, loading: true };
    case 'claim-modal':
      return { ...base, mockWallet: DEMO_USER_ADDRESS, claimModal: true };
    case 'claim-success':
      return {
        ...base,
        mockWallet: DEMO_USER_ADDRESS,
        claimModal: true,
        claimStatus: 'success',
      };
    case 'wrong-chain':
      return { ...base, mockWallet: DEMO_USER_ADDRESS, wrongChain: true };
    default:
      return base;
  }
}

export function applyDemoData(id: DemoScenarioId): void {
  if (!DEMO_MODE) return;

  switch (id) {
    case 'live':
      resetDemoToSeed();
      break;
    case 'empty':
      setDemoAllocations([]);
      break;
    case 'sold-out':
      setDemoAllocations(buildDemoAllocations(100));
      break;
    case 'owned':
      setDemoAllocations(
        buildDemoAllocations(25, { index: 12, address: DEMO_USER_ADDRESS }),
      );
      break;
    case 'loading':
    case 'claim-modal':
    case 'wrong-chain':
      resetDemoToSeed();
      break;
    case 'claim-success':
      setDemoAllocations(
        buildDemoAllocations(4, { index: 4, address: DEMO_USER_ADDRESS }),
      );
      break;
  }
}
