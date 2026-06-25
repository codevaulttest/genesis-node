export function shortenAddress(address: string, head = 6, tail = 4): string {
  if (address.length <= head + tail) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

export function formatUsdt(amount: bigint, decimals = 18): string {
  const base = 10n ** BigInt(decimals);
  const whole = amount / base;
  const fraction = amount % base;
  if (fraction === 0n) return whole.toLocaleString('en-US');
  const fracStr = fraction.toString().padStart(Number(decimals), '0').replace(/0+$/, '');
  return `${whole.toLocaleString('en-US')}.${fracStr}`;
}

export function bscscanTxUrl(txHash: string): string {
  return `https://bscscan.com/tx/${txHash}`;
}

export function bscscanAddressUrl(address: string): string {
  return `https://bscscan.com/address/${address}`;
}
