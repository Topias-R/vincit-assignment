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
import { Price } from './components/Price';
import capitalize from './utils/capitalize';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-auto-rows: max-content;
  overflow: auto;
  justify-content: safe center;
`;

const ErrorDisplay = styled.h2`
  text-align: center;
  color: #b00020;
`;

export function App(): JSX.Element {
  const [startDate, setStartDate] = useState<UTC | undefined>();
  const [endDate, setEndDate] = useState<UTC | undefined>();

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

  if (!marketChartRangeData || !startDate || !endDate)
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

  const firstDate = marketChartRangeData.prices[0]?.date.toLocaleDateString();
  const lastDate = marketChartRangeData.prices
    .at(-1)
    ?.date.toLocaleDateString();

  const displayInfo = [
    {
      title: `${capitalize(cryptoCurrency)} data between`,
      body: firstDate && lastDate ? `${firstDate} - ${lastDate}` : 'No data.'
    },
    {
      title: 'Longest downward trend',
      body: info.longestDownwardTrend
        ? `${info.longestDownwardTrend} days`
        : 'No trends.'
    },
    {
      title: 'Highest trading volume',
      body: info.highestTradingVolume ? (
        <>
          <Price
            value={info.highestTradingVolume.totalVolume}
            currency={currency}
          />{' '}
          on {info.highestTradingVolume.date.toLocaleDateString()}
        </>
      ) : (
        'No highest volume.'
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
            <Price
              value={info.highestProfitTradingDatePair.buyDate.price}
              currency={currency}
            />
          </span>
          <br />
          <span>
            Sell on{' '}
            {info.highestProfitTradingDatePair.sellDate.date.toLocaleDateString()}{' '}
            at{' '}
            <Price
              value={info.highestProfitTradingDatePair.sellDate.price}
              currency={currency}
            />
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
