import { NormalizedMarketChartRangeData } from '../api/marketChartRangeEndPoint';

export function findHighestTradingVolume(
  volumes: NormalizedMarketChartRangeData['totalVolumes']
): NormalizedMarketChartRangeData['totalVolumes'][number] {
  if (volumes.length < 2) throw new Error('Not enough datapoints.');

  return volumes.reduce((highest, curr) =>
    curr.totalVolume > highest.totalVolume ? curr : highest
  );
}
