import { Currency } from '../types';
import { CURRENCIES } from '../data/tours';

export function formatPrice(amountInQar: number, currency: Currency = 'QAR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.QAR;
  const converted = amountInQar * config.rateAgainstQar;

  if (currency === 'QAR') {
    return `${Math.round(converted).toLocaleString()} ﷼`;
  } else if (currency === 'USD') {
    return `$${Math.round(converted).toLocaleString()}`;
  } else if (currency === 'EUR') {
    return `€${Math.round(converted).toLocaleString()}`;
  } else if (currency === 'GBP') {
    return `£${Math.round(converted).toLocaleString()}`;
  }
  return `${Math.round(converted)} ${currency}`;
}

export function formatPriceWithUsdSecondary(amountInQar: number, currency: Currency = 'QAR'): { primary: string; secondary: string } {
  const primary = formatPrice(amountInQar, currency);
  const usdAmount = Math.round(amountInQar * CURRENCIES.USD.rateAgainstQar);
  const secondary = currency === 'USD' ? `${amountInQar} QAR` : `($${usdAmount})`;
  return { primary, secondary };
}
