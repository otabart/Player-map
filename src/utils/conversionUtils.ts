// Utility functions for data conversion

/**
 * Convert shares to TTRUST percentage based on total market cap
 * @param shares - Number of shares
 * @param totalMarketCap - Total market cap
 * @returns Formatted percentage string
 */
export const convertSharesToTTRUST = (shares: number, totalMarketCap: number): string => {
  if (!shares || !totalMarketCap || totalMarketCap === 0) {
    return '0.00%';
  }

  // Convert to numbers
  const sharesNum = Number(shares);
  const marketCapNum = Number(totalMarketCap);

  // Calculate raw percentage
  const rawPercentage = (sharesNum / marketCapNum) * 100;

  // If percentage is very small (< 0.01%), try to find a scale factor
  if (rawPercentage < 0.01 && rawPercentage > 0) {
    const sharesStr = sharesNum.toString();
    const marketCapStr = marketCapNum.toString();

    // If there's a significant difference in length, try scaling
    const lengthDiff = marketCapStr.length - sharesStr.length;

    if (lengthDiff > 5) {
      // Scale up shares to match market cap scale
      const scaleFactor = Math.pow(10, lengthDiff);
      const normalizedShares = sharesNum * scaleFactor;
      const normalizedPercentage = (normalizedShares / marketCapNum) * 100;

      // If the normalized percentage is reasonable (between 0.01% and 100%)
      if (normalizedPercentage >= 0.01 && normalizedPercentage <= 100) {
        return `${normalizedPercentage.toFixed(2)}%`;
      }
    }
  }

  // If percentage is > 100%, it's likely a unit mismatch
  if (rawPercentage > 100) {
    return `${rawPercentage.toFixed(2)}% ⚠️`;
  }

  // Return the percentage, but ensure it's at least 0.01% if it's not zero
  if (rawPercentage > 0 && rawPercentage < 0.01) {
    return '< 0.01%';
  }

  return `${rawPercentage.toFixed(2)}%`;
};

/**
 * Format large numbers with appropriate units
 * @param value - Numeric value to format
 * @returns Formatted string
 */
export const formatLargeNumber = (value: number): string => {
  if (!value || value === 0) {
    return '0';
  }

  if (value >= 1e18) {
    return `${(value / 1e18).toFixed(2)}T`;
  } else if (value >= 1e15) {
    return `${(value / 1e15).toFixed(2)}P`;
  } else if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }

  return value.toFixed(2);
};

