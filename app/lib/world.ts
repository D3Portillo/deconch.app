import { createPublicClient, http } from "viem"
import { worldchain } from "viem/chains"

export const clientWorldchain = createPublicClient({
  chain: worldchain,
  transport: http(),
})
