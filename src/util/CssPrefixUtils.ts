const PREFIX_LIST = ['Webkit', 'Moz', 'O', 'ms'];

export const generatePrefixStyle = (name: string, value: string) => {
  if (!name) {
    return undefined;
  }

  const camelName = name.replace(/(\w)/, v => v.toUpperCase());
  const result: Record<string, string> = PREFIX_LIST.reduce(
    (res, entry) => ({
      ...res,
      [entry + camelName]: value,
    }),
    {},
  );

  result[name] = value;

  return result;
};

// Adapted from clsx v2.1.1 (MIT); see LICENSE.
export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];

function toClassName(value: ClassValue): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);

  let result = '';
  if (Array.isArray(value)) {
    const { length } = value;
    for (let index = 0; index < length; index++) {
      if (value[index]) {
        const className = toClassName(value[index]);
        if (className) result = result ? `${result} ${className}` : className;
      }
    }
  } else if (value != null && typeof value === 'object') {
    // clsx includes inherited enumerable keys, not just own keys.
    for (const key in value) {
      if (value[key]) result = result ? `${result} ${key}` : key;
    }
  }
  return result;
}

export function clsx(...inputs: ClassValue[]): string {
  let result = '';
  for (const input of inputs) {
    if (input) {
      const className = toClassName(input);
      if (className) result = result ? `${result} ${className}` : className;
    }
  }
  return result;
}
