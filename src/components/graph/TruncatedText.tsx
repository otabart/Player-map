import React from 'react';

interface TruncatedTextProps {
  text: string;
  maxLength: number;
  className?: string;
  style?: React.CSSProperties;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  maxLength, 
  className, 
  style 
}) => {
  const truncatedText = text.length <= maxLength 
    ? text 
    : text.slice(0, maxLength) + "...";
    
  return (
    <span className={className} style={style}>
      {truncatedText}
    </span>
  );
};

export default TruncatedText;
