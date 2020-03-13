import isNil from 'lodash/isNil';

/**
 * Takes a string input and parse the numeric value from it.
 * To be used for formatting numeric input fields.
 *
 * @param val - String value
 * @param defaultValue - Default numeric value to return when no match 
 * @param maxValue
 */
export const formatInt = (val: string, defaultValue?: number, maxValue?: number) => {
  const numericMatch = val.trim().match(/[0-9]+/);
  if (!numericMatch) {
    return defaultValue;
  }

  const numericVal = parseInt(numericMatch[0], 10);
  return isNil(maxValue) ? numericVal : Math.min(maxValue, numericVal);
};