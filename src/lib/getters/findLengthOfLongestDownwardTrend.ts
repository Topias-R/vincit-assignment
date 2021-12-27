import { NormalizedMarketChartRangeData } from '../api/marketChartRangeEndPoint';

export function findLengthOfLongestDownwardTrend(
  prices: NormalizedMarketChartRangeData['prices']
): number {
  if (prices.length < 2) throw new Error('Not enough datapoints.');

  // Group datapoints by Downward trend.
  // [[3, 2], [4], [5], [5, 1]]
  const trends = prices.reduce<NormalizedMarketChartRangeData['prices'][]>(
    (trends, curr) => {
      const lastTrend = trends.at(-1);
      const lastPointInLastTrend = lastTrend?.at(-1);
      if (!lastTrend || !lastPointInLastTrend) return [[curr]];
      return curr.price < lastPointInLastTrend.price
        ? [...trends.slice(0, -1), [...lastTrend, curr]]
        : [...trends, [curr]];
    },
    []
  );

  // Return the length of the longest group - 1 since a single day doesn't constitute a "trend".
  return Math.max(...trends.map((trend) => trend.length - 1));
}
