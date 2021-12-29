import { DependencyList, useEffect, useState } from 'react';

// Returns json and accepts same arguments as the native Fetch API.
// Pass a dependencylist as the second or third argument.
// Pass null into first argument to skip fetching.
// Options and dependencies need to be wrapped in useMemo or the hook will rerun unnecessarily.
export function useFetch<T>(
  url: RequestInfo | null,
  deps?: DependencyList
): [T | undefined, unknown];
export function useFetch<T>(
  url: RequestInfo | null,
  options: RequestInit,
  deps?: DependencyList
): [T | undefined, unknown];
export function useFetch<T>(
  url: RequestInfo | null,
  optionsOrDeps?: RequestInit | DependencyList,
  deps?: DependencyList
): [T | undefined, unknown] {
  const [response, setResponse] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      if (typeof url !== 'string') return;
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
    })();
  }, [url, optionsOrDeps, deps]);

  return [response, error];
}
