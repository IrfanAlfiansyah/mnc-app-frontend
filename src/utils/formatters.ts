// src/utils/formatters.ts
export const formatCurrency = (
  value: number | string,
  currency: string = "IDR",
  locale: string = "id-ID"
): string => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) {
    return "Rp0.00";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const toCurrencyValue = (value: number | string): number => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numberValue) ? 0 : numberValue;
};
