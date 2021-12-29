import React, { useMemo, useState } from 'react';
import { DateRangePicker } from './components/DateRangePicker';
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
import { capitalize } from './utils/capitalize';
import { Info } from './components/Info';
import { ErrorDisplay } from './components/ErrorDisplay';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-auto-rows: min-content;
  overflow: auto;
  justify-content: safe center;
`;

export function App(): JSX.Element {
  const [startDate, setStartDate] = useState<UTC | undefined>();
  const [endDate, setEndDate] = useState<UTC | undefined>();

  const cryptoCurrency = 'bitcoin';
  const vsCurrency = 'eur';

  const [rawMarketChartRangeData, error] = useFetch<RawMarketChartRangeData>(
    startDate && endDate
      ? marketChartRangeQuery(
          cryptoCurrency,
          vsCurrency,
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

  return (
    <Container>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <ErrorDisplay error={error} />
      {marketChartRangeData && (
        <>
          <Info
            title={`${capitalize(cryptoCurrency)} data between`}
            values={[
              marketChartRangeData.prices.at(0),
              marketChartRangeData.prices.at(-1)
            ]}
            render={([firstDate, lastDate]) =>
              `${firstDate.date.toLocaleDateString()} - ${lastDate.date.toLocaleDateString()}`
            }
            fallback={'No data.'}
          />
          <Info
            title={'Longest downward trend'}
            values={[
              findLengthOfLongestDownwardTrend(marketChartRangeData.prices)
            ]}
            render={([trend]) => `${trend} days`}
            fallback={'No trends.'}
          />
          <Info
            title={'Highest trading volume'}
            values={[
              findHighestTradingVolume(marketChartRangeData.totalVolumes)
            ]}
            render={([volume]) => (
              <>
                <Price value={volume.totalVolume} currency={vsCurrency} /> on{' '}
                {volume.date.toLocaleDateString()}
              </>
            )}
            fallback={'No highest volume.'}
          />
          <Info
            title={'Highest profit trading date pair'}
            values={[
              findHighestProfitTradingDatePair(marketChartRangeData.prices)
            ]}
            render={([datePair]) => (
              <>
                <span>
                  Buy on {datePair.buyDate.date.toLocaleDateString()} at{' '}
                  <Price value={datePair.buyDate.price} currency={vsCurrency} />
                </span>
                <br />
                <span>
                  Sell on {datePair.sellDate.date.toLocaleDateString()} at{' '}
                  <Price
                    value={datePair.sellDate.price}
                    currency={vsCurrency}
                  />
                </span>
              </>
            )}
            fallback={'It is impossible to profit between these dates.'}
          />
        </>
      )}
    </Container>
  );
}
