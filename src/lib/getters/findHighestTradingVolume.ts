import { NormalizedMarketChartRangeData } from '../api/marketChartRangeEndPoint';

export function findHighestTradingVolume(
  volumes: NormalizedMarketChartRangeData['totalVolumes']
): NormalizedMarketChartRangeData['totalVolumes'][number] | null {
  if (!volumes.length) return null;

  return volumes.reduce((highest, curr) =>
    curr.totalVolume > highest.totalVolume ? curr : highest
  );
}
