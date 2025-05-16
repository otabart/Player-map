import { VoteItem, VoteDirection } from "../types/vote";

/**
 * Calculates the total number of transactions needed for the current vote selection
 * @param voteItems Array of vote items
 * @returns Number of transactions
 */
export const calculateNumberOfTransactions = (voteItems: VoteItem[]): number => {
  return voteItems.filter(item => item.units > 0).length;
};

/**
 * Calculates the total units selected across all vote items
 * @param voteItems Array of vote items
 * @returns Total units
 */
export const calculateTotalUnits = (voteItems: VoteItem[]): number => {
  return voteItems.reduce((sum, item) => sum + item.units, 0);
};

/**
 * Calculates the total ETH cost based on number of units
 * @param units Number of units
 * @returns Total ETH cost as a string with 3 decimal places
 */
export const calculateEthCost = (units: number): string => {
  return (units * 0.00025).toFixed(5);
};

/**
 * Calculates the estimated gas cost for a set of transactions
 * @param transactionCount Number of transactions
 * @returns Estimated gas cost as a string with 4 decimal places
 */
export const calculateGasCost = (transactionCount: number): string => {
  return (transactionCount * 0.0000004).toFixed(7);
};

/**
 * Reset all vote items to zero units and no direction
 * @param voteItems Array of vote items
 * @returns New array with reset vote items
 */
export const resetVoteItems = (voteItems: VoteItem[]): VoteItem[] => {
  return voteItems.map(item => ({
    ...item,
    units: 0,
    direction: VoteDirection.None,
  }));
}; 