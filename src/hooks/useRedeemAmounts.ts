import { useState } from 'react';

export const useRedeemAmounts = () => {
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(new Set());
  const [redeemAmounts, setRedeemAmounts] = useState<Record<string, number>>({});

  const handlePositionSelect = (positionId: string, selected: boolean) => {
    setSelectedPositions(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(positionId);
      } else {
        newSet.delete(positionId);
        // Annuler la configuration quand on décoche
        setRedeemAmounts(prevAmounts => {
          const newAmounts = { ...prevAmounts };
          delete newAmounts[positionId];
          return newAmounts;
        });
      }
      return newSet;
    });
  };

  const handleAmountChange = (positionId: string, amount: number) => {
    setRedeemAmounts(prev => ({
      ...prev,
      [positionId]: amount
    }));
  };

  const clearSelection = () => {
    setSelectedPositions(new Set());
    setRedeemAmounts({});
  };

  return {
    selectedPositions,
    redeemAmounts,
    handlePositionSelect,
    handleAmountChange,
    clearSelection
  };
};
