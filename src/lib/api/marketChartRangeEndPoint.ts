import { UTC } from '../../utils/UTCDate';
import { getUTCMidnight } from '../../utils/getUTCMidnight';

export interface RawMarketChartRangeData {
  prices: [timeStamp: number, price: number][];
  market_caps: [timeStamp: number, marketCap: number][];
  total_volumes: [timeStamp: number, volume: number][];
}

export function marketChartRangeQuery(
  cryptoCurrency: string,
  vsCurrency: string,
  from: number,
  to: number
): string {
  return (
    `https://api.coingecko.com/api/v3/coins/${cryptoCurrency}/market_chart/range?` +
    new URLSearchParams({
      vs_currency: vsCurrency,
      // The API accepts UNIX timestamps in seconds-format, while JavaScript works with milliseconds.
      from: Math.floor(from / 1000).toString(),
      to: Math.floor(to / 1000).toString()
    })
  );
}

// Takes data of varying granularity and returns only the datapoints closest to midnight for each present UTC date.
function uniformalizeDataPoints(
  dataPoints: RawMarketChartRangeData[keyof RawMarketChartRangeData]
): RawMarketChartRangeData[keyof RawMarketChartRangeData] {
  const uniqueMidnights = [
    ...new Set(dataPoints.map(([timestamp]) => getUTCMidnight(timestamp)))
  ];

  const midnightDataPoints = uniqueMidnights.map((midnight) => {
    const dataPointsForDay = dataPoints.filter(
      ([timestamp]) => getUTCMidnight(timestamp) === midnight
    );

    const dataPointClosestToMidnight = dataPointsForDay.reduce(
      (closest, dataPoint) =>
        dataPoint[0] - midnight < closest[0] - midnight ? dataPoint : closest
    );

    return dataPointClosestToMidnight;
  });

  return midnightDataPoints;
}

export interface NormalizedMarketChartRangeData {
  prices: { date: UTC; price: number }[];
  marketCaps: { date: UTC; marketCap: number }[];
  totalVolumes: { date: UTC; totalVolume: number }[];
}

export function normalizeMarketChartRangeData(
  data: RawMarketChartRangeData
): NormalizedMarketChartRangeData {
  const prices = uniformalizeDataPoints(data.prices).map(
    ([timeStamp, price]) => ({
      date: new UTC(timeStamp),
      price
    })
  );

  const marketCaps = uniformalizeDataPoints(data.market_caps).map(
    ([timeStamp, marketCap]) => ({
      date: new UTC(timeStamp),
      marketCap
    })
  );

  const totalVolumes = uniformalizeDataPoints(data.total_volumes).map(
    ([timeStamp, totalVolume]) => ({
      date: new UTC(timeStamp),
      totalVolume
    })
  );

  return { prices, marketCaps, totalVolumes };
}
