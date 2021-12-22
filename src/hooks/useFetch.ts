import { DependencyList, useEffect, useState } from 'react';

export function useFetch<T>(
  url: RequestInfo,
  deps?: DependencyList
): [T | undefined, unknown];
export function useFetch<T>(
  url: RequestInfo,
  options?: RequestInit,
  deps?: DependencyList
): [T | undefined, unknown];
export function useFetch<T>(
  url: RequestInfo,
  optionsOrDeps?: RequestInit | DependencyList,
  deps?: DependencyList
): [T | undefined, unknown] {
  const [response, setResponse] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();

  useEffect(
    () => {
      const fetchJSON = async () => {
        try {
          const res = await fetch(
            url,
            Array.isArray(optionsOrDeps)
              ? undefined
              : (optionsOrDeps as RequestInit) // Assertion is necessary because the typeguard does not work correctly on readonly arrays due to a bug in TypeScript.
          );
          const json = await res.json();
          setResponse(json);
        } catch (err) {
          setError(err);
        }
      };

      fetchJSON();
    },
    Array.isArray(optionsOrDeps) ? optionsOrDeps : deps || []
  );

  return [response, error];
}
