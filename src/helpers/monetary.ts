export function formatPrice(price: number): string {
  return (price / 100).toFixed(2);
}

export function formatPriceFull(price: number): string {
  return `€ ${formatPrice(price)}`;
}
