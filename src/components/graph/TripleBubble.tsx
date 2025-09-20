import React from 'react';

interface TripleBubbleProps {
  subject: string;
  predicate: string;
  object: string;
  fontSize?: string;
  showArrows?: boolean;
}

const TripleBubble: React.FC<TripleBubbleProps> = ({ 
  subject, 
  predicate, 
  object, 
  fontSize = '13px',
  showArrows = true 
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Sujet - seulement si non vide */}
      {subject && (
        <>
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            fontSize,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{ 
              width: '4px', 
              height: '4px', 
              borderRadius: '50%', 
              backgroundColor: '#FF9500'
            }} />
            {subject}
          </div>
          
          {showArrows && (
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>→</div>
          )}
        </>
      )}
      
      {/* Prédicat */}
      <div style={{
        padding: '4px 8px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        fontSize,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{ 
          width: '4px', 
          height: '4px', 
          borderRadius: '50%', 
          backgroundColor: '#006FE8'
        }} />
        {predicate}
      </div>
      
      {showArrows && (
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>→</div>
      )}
      
      {/* Objet */}
      <div style={{
        padding: '4px 8px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        fontSize,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{ 
          width: '4px', 
          height: '4px', 
          borderRadius: '50%', 
          backgroundColor: '#4CAF50'
        }} />
        {object}
      </div>
    </div>
  );
};

export default TripleBubble;
