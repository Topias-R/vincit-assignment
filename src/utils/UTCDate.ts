type ExtractBySubString<
  T,
  S extends string
> = T extends `${string}${S}${string}` ? T : never;

type keys = keyof Date;

type UTCKeys = ExtractBySubString<keys, 'UTC'>;

const allowedNonUTCKeys = [
  'toISOString',
  'toString',
  'toDateString',
  'toTimeString',
  'toLocaleString',
  'toLocaleDateString',
  'toLocaleTimeString',
  'toJSON',
  'getTime',
  'setTime',
  'getTimezoneOffset',
  'valueOf'
] as const;

type AllowedNonUTCKeys = typeof allowedNonUTCKeys[number];

type KeysToOmit = Exclude<keys, UTCKeys | AllowedNonUTCKeys | symbol>;

export type UTC = Omit<Date, KeysToOmit>;

interface UTCConstructor extends DateConstructor {
  new (): UTC;
  new (value: number | string): UTC;
  new (
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number
  ): UTC;
}

// Creates a proxied date constructor that constructs a proxied date object.
// On construction with datetime components, components are first passed into Date.UTC.
// The returned date object disallows the access of non-UTC methods.
function UTCConstructorFactory(): UTCConstructor {
  function get(target: Date, prop: string | symbol, receiver: unknown) {
    if (
      typeof prop === 'symbol' ||
      prop.includes('UTC') ||
      (allowedNonUTCKeys as ReadonlyArray<string>).includes(prop)
    ) {
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    } else {
      return undefined;
    }
  }

  function construct(target: DateConstructor, argArray: unknown[]): UTC {
    const args =
      argArray.length <= 1
        ? argArray
        : [target.UTC(...(argArray as [number, number]))];

    const date = Reflect.construct(target, args);

    return new Proxy(date, { get });
  }

  return new Proxy(Date, { construct });
}

export const UTC = UTCConstructorFactory();
