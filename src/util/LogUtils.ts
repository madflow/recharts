/* eslint no-console: 0 */
const isDev = process.env.NODE_ENV !== 'production';

export const warn = (condition: boolean, format: string, ...args: any[]) => {
  if (isDev && typeof console !== 'undefined' && console.warn) {
    if (format === undefined) {
      console.warn('LogUtils requires an error message argument');
    }

    if (!condition) {
      if (format === undefined) {
        console.warn(
          'Minified exception occurred; use the non-minified dev environment ' +
            'for the full error message and additional helpful warnings.',
        );
      } else {
        let argIndex = 0;

        console.warn(format.replace(/%s/g, () => args[argIndex++]));
      }
    }
  }
};

// Adapted from tiny-invariant v1.3.3 (MIT); see LICENSE.
// Babel replaces dotted NODE_ENV access with the build format (commonjs or es6).
// The template key defers that replacement to the consumer's bundler or runtime.
// eslint-disable-next-line dot-notation -- Retain the computed key until after Babel's define pass.
const isProduction = process.env[`NODE_ENV`] === 'production';
const prefix = 'Invariant failed';

export function invariant(condition: unknown, message?: string | (() => string)): asserts condition {
  if (condition) return;
  if (isProduction) throw new Error(prefix);

  const detail = typeof message === 'function' ? message() : message;
  throw new Error(detail ? `${prefix}: ${detail}` : prefix);
}
