export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateTotalPrice = (basePrice: number, guests: number, discount?: number): number => {
  const subtotal = basePrice * guests;
  if (discount) {
    return subtotal - discount;
  }
  return subtotal;
};

export const calculateDiscount = (price: number, discountPercentage: number): number => {
  return (price * discountPercentage) / 100;
};

/**
 * Format price breakdown for booking display
 */
export const formatPriceBreakdown = (basePrice: number, guests: number) => {
  const subtotal = basePrice * guests;
  
  return {
    basePrice: formatPrice(basePrice),
    subtotal: formatPrice(subtotal),
    total: formatPrice(subtotal)
  };
};

export const parsePriceFromString = (priceString: string): number => {
  // Remove currency symbols and parse as number
  return parseFloat(priceString.replace(/[$,]/g, ''));
}; 