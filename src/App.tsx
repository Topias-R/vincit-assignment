import React, { useState } from 'react';
import { DateRangePicker } from './components/DateRangePicker';
import { useFetch } from './hooks/useFetch';
import { UTC } from './utils/UTCDate';

export function App(): JSX.Element {
  const [startDate, setStartDate] = useState(new UTC(2020, 2, 1));
  const [endDate, setEndDate] = useState(new UTC(2021, 7, 1));

  interface FetchData {
    prices: [timeStamp: number, price: number][];
    market_caps: [timeStamp: number, marketCap: number][];
    total_volumes: [timeStamp: number, volume: number][];
  }

  const [fetchData] = useFetch<FetchData>(
    'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?' +
      new URLSearchParams({
        vs_currency: 'eur',
        from: (startDate.getTime() / 1000).toFixed(0),
        to: (endDate.getTime() / 1000 + 3600).toFixed(0)
      }),
    [startDate, endDate]
  );

  // Takes a timestamp and returns the timestamp for 00:00:00:000 corresponding to the UTC date of the timestamp.
  function getUTCMidnight(timeStamp: number): number {
    return timeStamp - (timeStamp % 86400000);
  }

  // Takes data of varying granularity and returns only the datapoints closest to midnight for each present UTC date.
  function uniformalizeDataPoints(
    dataPoints: FetchData[keyof FetchData]
  ): FetchData[keyof FetchData] {
    const uniqueMidnights = [
      ...new Set(dataPoints.map(([timestamp]) => getUTCMidnight(timestamp)))
    ];

    const midnightDataPoints = uniqueMidnights.map((midnight) => {
      const dataPointsForDay = dataPoints.filter(
        ([timestamp]) => getUTCMidnight(timestamp) === midnight
      );

      const dataPointClosestToMidnight = dataPointsForDay.reduce(
        (closest, dataPoint) =>
          midnight - dataPoint[0] < midnight - closest[0] ? dataPoint : closest
      );

      return dataPointClosestToMidnight;
    });

    return midnightDataPoints;
  }

  interface NormalizedData {
    prices: { timeStamp: number; price: number }[];
    // marketCaps: { timeStamp: number; marketCap: number }[];
    totalVolumes: { timeStamp: number; totalVolume: number }[];
  }

  const normalizedData: NormalizedData = {
    prices: uniformalizeDataPoints(fetchData?.prices ?? []).map(
      ([timeStamp, price]) => ({
        timeStamp,
        price
      })
    ),
    // marketCaps: uniformalizeDataPoints(fetchData?.market_caps ?? []).map(
    //   ([timeStamp, marketCap]) => ({
    //     timeStamp,
    //     marketCap
    //   })
    // ),
    totalVolumes: uniformalizeDataPoints(fetchData?.total_volumes ?? []).map(
      ([timeStamp, totalVolume]) => ({
        timeStamp,
        totalVolume
      })
    )
  };

  function findLengthOfLongestDownWardTrend(
    prices: NormalizedData['prices']
  ): number | null {
    if (!prices.length) return null;

    // Group datapoints by downward trend.
    // [[3, 2], [4], [5], [5, 1]]
    const trends = prices.reduce<NormalizedData['prices'][]>((trends, curr) => {
      const lastTrend = trends.at(-1);
      const lastPointInLastTrend = lastTrend?.at(-1);
      if (!lastTrend || !lastPointInLastTrend) return [[curr]];
      return curr.price < lastPointInLastTrend.price
        ? [...trends.slice(0, -1), [...lastTrend, curr]]
        : [...trends, [curr]];
    }, []);

    // Return the length of the longest group - 1 since a single day doesn't constitute a "trend".
    return Math.max(...trends.map((trend) => trend.length - 1));
  }

  function findHighestTradingVolume(
    volumes: NormalizedData['totalVolumes']
  ): NormalizedData['totalVolumes'][number] | null {
    if (!volumes.length) return null;

    return volumes.reduce((highest, curr) =>
      curr.totalVolume > highest.totalVolume ? curr : highest
    );
  }

  function findHighestProfitTradingDatePair(prices: NormalizedData['prices']): {
    buyDate: NormalizedData['prices'][number];
    sellDate: NormalizedData['prices'][number];
  } | null {
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

  const information = {
    longestDownWardTrend: findLengthOfLongestDownWardTrend(
      normalizedData.prices
    ),
    highestTradingVolume: findHighestTradingVolume(normalizedData.totalVolumes),
    highestProfitTradingDatePair: findHighestProfitTradingDatePair(
      normalizedData.prices
    )
  };

  return (
    <>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      {information && (
        <>
          <h2>
            Longest downward trend: {information.longestDownWardTrend} days
          </h2>

          {information.highestTradingVolume && (
            <h2>
              Largest volume:{' '}
              {(
                Math.round(information.highestTradingVolume.totalVolume * 1e2) /
                1e2
              ).toLocaleString()}{' '}
              € on{' '}
              {new Date(
                information.highestTradingVolume.timeStamp
              ).toLocaleDateString()}
            </h2>
          )}

          {information.highestProfitTradingDatePair ? (
            <h2>
              To maximize profit:
              <br />
              Buy on{' '}
              {new Date(
                information.highestProfitTradingDatePair.buyDate.timeStamp
              ).toLocaleDateString()}{' '}
              at{' '}
              {(
                Math.round(
                  information.highestProfitTradingDatePair.buyDate.price * 1e2
                ) / 1e2
              ).toLocaleString()}{' '}
              €
              <br />
              Sell on{' '}
              {new Date(
                information.highestProfitTradingDatePair.sellDate.timeStamp
              ).toLocaleDateString()}{' '}
              at{' '}
              {(
                Math.round(
                  information.highestProfitTradingDatePair.sellDate.price * 1e2
                ) / 1e2
              ).toLocaleString()}{' '}
              €
            </h2>
          ) : (
            <h2>It is not possible to profit between these dates.</h2>
          )}
        </>
      )}
    </>
  );
}
