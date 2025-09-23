import React, { useState } from 'react';
import Modal from './Modal';
import Pagination from './Pagination';
import { TripleBubble, PositionBubble } from './index';

interface ClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: any[];
}

const ClaimsModal: React.FC<ClaimsModalProps> = ({ isOpen, onClose, activities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  const handleClose = () => {
    onClose();
    setCurrentPage(1); // Reset à la page 1 quand on ferme
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`All Claims (${activities.length})`}
    >
      <div style={{ padding: '0' }}>
        <div style={{ padding: '16px 24px 16px' }}>
          {currentActivities.map((claim) => (
            <div
              key={claim.term_id}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '12px',
                }}
              >
                {/* Triple linéaire : predicate → object */}
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
                  <TripleBubble
                    subject=""
                    predicate={claim.predicate.label}
                    object={claim.object.label}
                    fontSize="12px"
                    showArrows={false}
                  />
                </div>

                {/* Positions For/Against */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PositionBubble 
                    isFor={true} 
                    count={claim.term?.positions_aggregate?.aggregate?.count || 0}
                    fontSize="12px"
                    showCount={true}
                  />
                  <PositionBubble 
                    isFor={false} 
                    count={claim.counter_term?.positions_aggregate?.aggregate?.count || 0}
                    fontSize="12px"
                    showCount={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={activities.length}
        />
      </div>
    </Modal>
  );
};

export default ClaimsModal;
