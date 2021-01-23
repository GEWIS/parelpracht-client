export function formatPrice(price: number): string {
  return (price / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPriceFull(price: number): string {
  return `€ ${formatPrice(price)}`;
}

export function formatPriceDiscount(price: number): string {
  if (price === 0) {
    return 'None';
  }
  return ` € ${formatPrice(price)}`;
}
