// Takes a timestamp and returns the timestamp for 00:00:00:000 corresponding to the UTC date of the timestamp.
export function getUTCMidnight(timeStamp: number): number {
  return timeStamp - (timeStamp % 86400000);
}
