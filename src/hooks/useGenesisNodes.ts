import { useCallback, useEffect, useState } from 'react';
import { DEMO_MODE, NODE_PRICE_USDT, NODE_PRICE_WEI, TOTAL_NODES } from '../config';
import type { ClaimStatus, GenesisAllocation } from '../types';
import {
  addDemoAllocation,
  fetchAllocationsFromChain,
  getUsdtBalance,
  sendUsdtPayment,
} from '../utils/bsc';

export function useGenesisNodes(walletAddress: `0x${string}` | null) {
  const [allocations, setAllocations] = useState<GenesisAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('idle');
  const [claimError, setClaimError] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await fetchAllocationsFromChain();
      setAllocations(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), 15_000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!walletAddress) {
      setBalance(null);
      return;
    }
    getUsdtBalance(walletAddress)
      .then(setBalance)
      .catch(() => setBalance(null));
  }, [walletAddress, allocations]);

  const claimedCount = allocations.length;
  const isSoldOut = claimedCount >= TOTAL_NODES;
  const nextIndex = isSoldOut ? null : claimedCount + 1;

  const userAllocation = walletAddress
    ? allocations.find((a) => a.address.toLowerCase() === walletAddress.toLowerCase()) ?? null
    : null;

  const canClaim =
    !!walletAddress &&
    !userAllocation &&
    !isSoldOut &&
    claimStatus !== 'pending' &&
    claimStatus !== 'confirming';

  const claim = useCallback(async () => {
    if (!walletAddress || userAllocation || isSoldOut) return;
    setClaimError(null);
    setClaimStatus('pending');
    try {
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 1200));
        setClaimStatus('confirming');
        const result = addDemoAllocation(walletAddress);
        if (!result) throw new Error('创世节点 100 个名额已全部售出');
        await load(true);
        setClaimStatus('success');
        return;
      }

      const bal = await getUsdtBalance(walletAddress);
      if (bal < NODE_PRICE_WEI) {
        throw new Error(
          `您的 USDT 不足 ${NODE_PRICE_USDT.toLocaleString()}，请先充值后再试`,
        );
      }

      setClaimStatus('confirming');
      await sendUsdtPayment(walletAddress);
      await load(true);
      setClaimStatus('success');
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : '加入失败，请重试');
      setClaimStatus('error');
    }
  }, [walletAddress, userAllocation, isSoldOut, load]);

  const resetClaimStatus = useCallback(() => {
    setClaimStatus('idle');
    setClaimError(null);
  }, []);

  return {
    allocations,
    loading,
    refreshing,
    claimedCount,
    isSoldOut,
    nextIndex,
    userAllocation,
    canClaim,
    claim,
    claimStatus,
    claimError,
    resetClaimStatus,
    refresh: () => load(true),
    balance,
  };
}
