import { NormalizedMarketChartRangeData } from '../api/marketChartRangeEndPoint';

export function findHighestProfitTradingDatePair(
  prices: NormalizedMarketChartRangeData['prices']
): {
  buyDate: NormalizedMarketChartRangeData['prices'][number];
  sellDate: NormalizedMarketChartRangeData['prices'][number];
} | null {
  if (prices.length < 2) throw new Error('Not enough datapoints.');

  // For each day, find every later day with a higher price.
  const candidates = prices.flatMap((buyDate, idx, arr) =>
    arr
      .slice(idx)
      .filter((sellDate) => sellDate.price > buyDate.price)
      .map((sellDate) => ({ buyDate, sellDate }))
  );

  if (!candidates.length) return null;

  // Find the daypair with the highest price difference.
  return candidates.reduce((highest, curr) =>
    curr.sellDate.price - curr.buyDate.price >
    highest.sellDate.price - highest.buyDate.price
      ? curr
      : highest
  );
}
