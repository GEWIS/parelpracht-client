export function formatPrice(price: number): string {
  const inCents = Number.isNaN(price) ? 0 : price / 100;
  return inCents.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPriceFull(price: number): string {
  return `€ ${formatPrice(price)}`;
}

export function formatPriceDiscount(price: number): string {
  if (price === 0 || Number.isNaN(price)) {
    return '';
  }
  return formatPriceFull(price);
}
