import React from 'react';

interface AtomDetailsSectionProps {
  atomDetails: any;
  connections: {
    follows: any[];
    followers: any[];
  };
  walletAddress?: string;
}

const AtomDetailsSection: React.FC<AtomDetailsSectionProps> = ({ 
  atomDetails, 
  connections, 
  walletAddress 
}) => {
  if (!atomDetails) return null;

  return (
    <>
      <p><strong>{atomDetails.label || "Not defined"} local</strong></p>
      
      {/* Section Connections - Données réelles */}
      <div style={{ 
        marginBottom: '10px',
        fontSize: '12px'
      }}>
        <p>Following: {connections.followers.length} - Followers: {connections.follows.length}</p>
      </div>
      
      <p><strong>ID :</strong> {
        atomDetails.value?.person?.description ||
        atomDetails.value?.organization?.description ||
        atomDetails.value?.thing?.description ||
        atomDetails.value?.book?.description ||
        "No description available"
      }</p>
    </>
  );
};

export default AtomDetailsSection;
