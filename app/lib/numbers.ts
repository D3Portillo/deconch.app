const Formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "code",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const localizeNumber = (value?: number | string) => {
  return Formatter.format(Number(value || 0))
    .replace("USD", "")
    .trim()
}

const RegularNumberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

/**
 * Append suffixes to large numbers for readability (e.g., 1,200 -> 1.2k)
 */
export const numberToShortWords = (_value: number | string): string => {
  const value = Number(_value)
  if (!Number.isFinite(value) || isNaN(value) || value === 0) return "0"

  if (value >= 1e12) return RegularNumberFormatter.format(value / 1e12) + "T"
  if (value >= 1e9) return RegularNumberFormatter.format(value / 1e9) + "B"
  if (value >= 1e6) return RegularNumberFormatter.format(value / 1e6) + "M"
  if (value >= 1e3) return RegularNumberFormatter.format(value / 1e3) + "k"
  if (value < 1e-4) return "<0.0001"
  if (value < 1) return Number(value.toFixed(4)).toString()

  return RegularNumberFormatter.format(value)
}
