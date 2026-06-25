import { useCallback, useEffect, useState } from 'react';
import { BSC_CHAIN_ID } from '../config';
import type { WalletState } from '../types';
import { getWalletClient, switchToBsc } from '../utils/bsc';

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    connecting: false,
  });
  const [error, setError] = useState<string | null>(null);

  const syncAccount = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      const client = getWalletClient();
      const [address] = await client.getAddresses();
      const chainId = await client.getChainId();
      setState({ address, chainId, connecting: false });
    } catch {
      setState({ address: null, chainId: null, connecting: false });
    }
  }, []);

  useEffect(() => {
    syncAccount();
    const eth = window.ethereum;
    if (!eth?.on) return;

    const onAccounts = () => syncAccount();
    const onChain = () => syncAccount();
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => {
      eth.removeListener?.('accountsChanged', onAccounts);
      eth.removeListener?.('chainChanged', onChain);
    };
  }, [syncAccount]);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      // On mobile, redirect into MetaMask's in-app browser which injects window.ethereum
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
        return;
      }
      setError('请先安装加密钱包（如 MetaMask）');
      return;
    }
    setState((s) => ({ ...s, connecting: true }));
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await switchToBsc();
      await syncAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : '钱包连接失败，请重试');
      setState((s) => ({ ...s, connecting: false }));
    }
  }, [syncAccount]);

  const disconnect = useCallback(() => {
    setState({ address: null, chainId: null, connecting: false });
    setError(null);
  }, []);

  const isOnBsc = state.chainId === BSC_CHAIN_ID;

  return { ...state, error, connect, disconnect, isOnBsc, syncAccount };
}
