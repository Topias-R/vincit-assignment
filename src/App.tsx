import React, { useMemo, useState } from 'react';
import { DateRangePicker } from './components/DateRangePicker';
import { InfoDisplay } from './components/InfoDisplay';
import { findHighestProfitTradingDatePair } from './lib/getters/findHighestProfitTradingDatePair';
import { findHighestTradingVolume } from './lib/getters/findHighestTradingVolume';
import { findLengthOfLongestDownwardTrend } from './lib/getters/findLengthOfLongestDownwardTrend';
import {
  marketChartRangeQuery,
  normalizeMarketChartRangeData,
  RawMarketChartRangeData
} from './lib/api/marketChartRangeEndPoint';
import { UTC } from './utils/UTCDate';
import styled from 'styled-components';
import { useFetch } from './hooks/useFetch';

const Container = styled.div`
  display: grid;
  justify-content: center;
`;

const ErrorDisplay = styled.h2`
  text-align: center;
  color: #b00020;
`;

const Price = styled.span`
  font-weight: bold;
  color: #85bb65;
`;

export function App(): JSX.Element {
  const [startDate, setStartDate] = useState<UTC | undefined>(
    new UTC(2020, 2, 1)
  );
  const [endDate, setEndDate] = useState<UTC | undefined>(new UTC(2021, 7, 1));

  const cryptoCurrency = 'bitcoin';
  const currency = 'eur';

  const [rawMarketChartRangeData, error] = useFetch<RawMarketChartRangeData>(
    startDate && endDate
      ? marketChartRangeQuery(
          cryptoCurrency,
          currency,
          startDate.getTime(),
          endDate.getTime() + 3600000
        )
      : null,
    useMemo(() => [startDate, endDate], [startDate, endDate])
  );

  const marketChartRangeData = useMemo(
    () =>
      rawMarketChartRangeData &&
      normalizeMarketChartRangeData(rawMarketChartRangeData),
    [rawMarketChartRangeData]
  );

  if (error) {
    return (
      <Container>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <ErrorDisplay>
          {error instanceof Error ? error.toString() : 'Something went wrong.'}
        </ErrorDisplay>
      </Container>
    );
  }

  if (!marketChartRangeData)
    return (
      <Container>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </Container>
    );

  const info = {
    longestDownwardTrend: findLengthOfLongestDownwardTrend(
      marketChartRangeData.prices
    ),
    highestTradingVolume: findHighestTradingVolume(
      marketChartRangeData.totalVolumes
    ),
    highestProfitTradingDatePair: findHighestProfitTradingDatePair(
      marketChartRangeData.prices
    )
  };

  const formatPrice = (price: number, currency: string): JSX.Element => (
    <Price>
      {price.toLocaleString(undefined, { style: 'currency', currency })}
    </Price>
  );

  const displayInfo = [
    {
      title: 'Longest downward trend',
      body: `${info.longestDownwardTrend} days`
    },
    {
      title: 'Highest trading volume',
      body: (
        <>
          {formatPrice(info.highestTradingVolume.totalVolume, currency)} on{' '}
          {info.highestTradingVolume.date.toLocaleDateString()}
        </>
      )
    },
    {
      title: 'Highest profit trading date pair',
      body: info.highestProfitTradingDatePair ? (
        <>
          <span>
            Buy on{' '}
            {info.highestProfitTradingDatePair.buyDate.date.toLocaleDateString()}{' '}
            at{' '}
            {formatPrice(
              info.highestProfitTradingDatePair.buyDate.price,
              currency
            )}
          </span>
          <br />
          <span>
            Sell on{' '}
            {info.highestProfitTradingDatePair.sellDate.date.toLocaleDateString()}{' '}
            at{' '}
            {formatPrice(
              info.highestProfitTradingDatePair.sellDate.price,
              currency
            )}
          </span>
        </>
      ) : (
        'It is impossible to profit between these dates.'
      )
    }
  ];

  return (
    <Container>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <InfoDisplay info={displayInfo} />
    </Container>
  );
}
