import { formatUnits, parseUnits } from "viem"

export const formatUSDC = (value: number | bigint) =>
  formatUnits(BigInt(value), 6)

export const parseUSDC = (value: number | bigint) => parseUnits(`${value}`, 6)
