import React from 'react';

interface PositionBubbleProps {
  isFor: boolean;
  count?: number;
  fontSize?: string;
  showCount?: boolean;
}

const PositionBubble: React.FC<PositionBubbleProps> = ({ 
  isFor, 
  count, 
  fontSize = '12px',
  showCount = false 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '6px',
      backgroundColor: isFor ? 'rgba(0, 111, 232, 0.2)' : 'rgba(255, 149, 0, 0.2)',
      border: `1px solid ${isFor ? 'rgba(0, 111, 232, 0.3)' : 'rgba(255, 149, 0, 0.3)'}`
    }}>
      <div style={{ 
        width: '0', 
        height: '0', 
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderBottom: isFor ? '6px solid #006FE8' : 'none',
        borderTop: isFor ? 'none' : '6px solid #FF9500'
      }} />
      <span style={{ 
        fontSize, 
        color: isFor ? '#006FE8' : '#FF9500', 
        fontWeight: '600' 
      }}>
        {showCount && count !== undefined ? count : (isFor ? 'For' : 'Against')}
      </span>
    </div>
  );
};

export default PositionBubble;

