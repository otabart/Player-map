import React from 'react';

interface PaginationInfoProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
      Showing {startItem}-{endItem} of {totalItems}
    </div>
  );
};

export default PaginationInfo;
