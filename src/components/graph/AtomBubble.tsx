import React from 'react';

interface AtomBubbleProps {
  label: string;
  fontSize?: string;
}

const AtomBubble: React.FC<AtomBubbleProps> = ({ label, fontSize = '13px' }) => {
  return (
    <div style={{
      padding: '4px 8px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      fontSize,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      <div style={{ 
        width: '4px', 
        height: '4px', 
        borderRadius: '50%', 
        backgroundColor: '#9C27B0'
      }} />
      {label}
    </div>
  );
};

export default AtomBubble;

