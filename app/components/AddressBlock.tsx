import { blo } from "blo"
import type { Address } from "viem"

interface AddressBlockProps {
  address?: Address
  size?: number
}

export default function AddressBlock({ address, size = 8 }: AddressBlockProps) {
  return (
    <div className="border-2 AddressBlock border-white/15 rounded-lg overflow-hidden">
      <figure
        style={{
          width: `calc(var(--spacing) * ${size})`,
          height: `calc(var(--spacing) * ${size})`,
          backgroundImage: `url(${blo(address || "0x11CCFF", 16)})`,
          filter: "sepia(1) saturate(0.5) brightness(0.7) contrast(1.2)",
        }}
        className="bg-cover shrink-0"
      />
    </div>
  )
}
