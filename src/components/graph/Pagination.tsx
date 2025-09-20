import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Bouton Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            background: currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: currentPage === 1 ? 'rgba(255, 255, 255, 0.4)' : '#fff',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }
          }}
        >
          ←
        </button>

        {/* Numéros de page avec ellipses */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(() => {
            const getVisiblePages = () => {
              const pages = [];
              
              // Toujours afficher la première page
              pages.push(1);
              
              // Si on est loin du début, ajouter "..."
              if (currentPage > 3) {
                pages.push('...');
              }
              
              // Pages autour de la page courante
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);
              
              for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                  pages.push(i);
                }
              }
              
              // Si on est loin de la fin, ajouter "..."
              if (currentPage < totalPages - 2) {
                pages.push('...');
              }
              
              // Toujours afficher la dernière page (si plus d'une page)
              if (totalPages > 1) {
                pages.push(totalPages);
              }
              
              return pages;
            };
            
            const visiblePages = getVisiblePages();
            
            return visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      padding: '6px 4px',
                      fontSize: '12px',
                    }}
                  >
                    ...
                  </span>
                );
              }
              
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  style={{
                    background: page === currentPage ? '#ffd32a' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: page === currentPage ? '#18181b' : '#fff',
                    padding: '6px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    minWidth: '32px',
                    transition: 'all 0.2s',
                    fontWeight: page === currentPage ? '600' : '400',
                  }}
                  onMouseEnter={(e) => {
                    if (page !== currentPage) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page !== currentPage) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {page}
                </button>
              );
            });
          })()}
        </div>

        {/* Bouton Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: currentPage === totalPages ? 'rgba(255, 255, 255, 0.4)' : '#fff',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }
          }}
        >
          →
        </button>
    </div>
  );
};

export default Pagination;
