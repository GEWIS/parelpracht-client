export function formatPrice(price: number): string {
  return (price / 100).toFixed(2);
}

export function formatPriceFull(price: number): string {
  return `€ ${formatPrice(price)}`;
}

export function formatContactName(fName: string, mName: string, lName: string): string {
  let contactName: string = '';
  if (mName == null) {
    contactName = `${fName}, ${lName}`;
  } else {
    contactName = `${fName}, ${mName}, ${lName}`;
  }
  return contactName;
}
