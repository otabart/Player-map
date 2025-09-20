import React from "react";
import { convertSharesToTTRUST, formatLargeNumber } from "../../utils/conversionUtils";
import RedeemConfig from "./RedeemConfig";
import RedeemSelector from "./RedeemSelector";
import { TripleBubble, AtomBubble, PositionBubble } from './index';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
    <span style={{ color: "#ffd429", fontWeight: 700, minWidth: 110 }}>
      {label}:
    </span>
    <span style={{ color: "#fff" }}>{value || "N/A"}</span>
  </div>
);

interface AtomImageProps {
  src?: string;
  alt?: string;
}

const AtomImage: React.FC<AtomImageProps> = ({ src, alt }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        marginRight: 10,
      }}
    />
  ) : null;

interface PositionCardProps {
  position: any;
  isSelected?: boolean;
  onSelect?: (positionId: string, selected: boolean) => void;
  onAmountChange?: (positionId: string, amount: number) => void;
  redeemAmount?: number;
}

const PositionCard: React.FC<PositionCardProps> = ({ position, isSelected = false, onSelect, onAmountChange, redeemAmount = 0 }) => {
  const shares = Number(position.shares || 0);
  const term = position.term;
  
  // Determine if this is For or Against based on vault type
  const hasDeposits = position.vault?.deposits && position.vault.deposits.length > 0;
  const hasRedemptions = position.vault?.redemptions && position.vault.redemptions.length > 0;
  const depositType = position.vault?.deposits?.[0]?.vault_type;
  const redemptionType = position.vault?.redemptions?.[0]?.vault_type;
  
  // Determine For/Against based on vault type and shares
  const isFor = shares > 0 && (depositType === "Triple" || depositType === "Atom" || redemptionType === "Triple" || redemptionType === "Atom");
  const isAgainst = shares > 0 && (depositType === "CounterTriple" || depositType === "CounterAtom" || redemptionType === "CounterTriple" || redemptionType === "CounterAtom");
  
  // Get the active term based on the position
  const isAtomActivity = !term?.triple; // If no triple, it's an atom activity
  const activeTerm = isAtomActivity ? term : (isFor ? term : term?.triple?.counter_term);
  const positionType = isFor ? "For" : "Against";
  
  // Get position description components for visual display
  const getPositionComponents = () => {
    if (activeTerm?.triple?.subject?.label && activeTerm?.triple?.predicate?.label && activeTerm?.triple?.object?.label) {
      // Triple position - return components for visual display
      return {
        type: 'triple',
        subject: activeTerm.triple.subject.label,
        predicate: activeTerm.triple.predicate.label,
        object: activeTerm.triple.object.label
      };
    } else if (activeTerm?.atom?.label) {
      // Atom position
      return {
        type: 'atom',
        label: activeTerm.atom.label
      };
    }
    return { type: 'unknown' };
  };
  
  // Convert shares to TTRUST percentage - use the correct term for calculation
  const calculationTerm = isAtomActivity ? term : (isFor ? term : term?.triple?.counter_term);
  
  const sharesTTRUST = convertSharesToTTRUST(shares, Number(calculationTerm?.total_assets || 0));
  const termShares = Number(calculationTerm?.total_assets || 0);
  
  // Determine the action type (deposit or redeem)
  const getActionType = () => {
    if (hasDeposits && hasRedemptions) {
      // This shouldn't happen, but if it does, prioritize based on shares
      return shares > 0 ? "Deposit" : "Redeem";
    } else if (hasDeposits) {
      return "Deposit";
    } else if (hasRedemptions) {
      return "Redeem";
    }
    return "Unknown";
  };

  // Determine if this is a redeem action
  const isRedeem = getActionType() === "Redeem";
  
  // Get the vault type from deposits or redemptions
  const getVaultType = () => {
    // Prioritize deposit type if available, otherwise redemption type
    if (hasDeposits && depositType) {
      return depositType;
    } else if (hasRedemptions && redemptionType) {
      return redemptionType;
    }
    return "Unknown";
  };

  return (
    <div
      style={{
        background: "#232326",
        borderRadius: 14,
        padding: "18px 24px",
        marginBottom: 18,
        boxShadow: "0 2px 12px rgba(0,0,0,0.13)",
        borderLeft: `6px solid ${isRedeem ? "#FFD700" : isFor ? "#006FE8" : "#FF9500"}`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      className="position-card"
    >
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 10 }}>
        <AtomImage src={position.account?.image} alt={position.account?.label} />
        <div style={{ flex: 1 }}>
          {/* Position avec bulles discrètes - sur une ligne */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: "#ffd429", fontWeight: 700, minWidth: 110 }}>
              Position:
            </span>
            {(() => {
              const positionComponents = getPositionComponents();
              if (positionComponents.type === 'triple') {
                return (
                  <TripleBubble
                    subject={positionComponents.subject}
                    predicate={positionComponents.predicate}
                    object={positionComponents.object}
                    fontSize="13px"
                  />
                );
              } else if (positionComponents.type === 'atom') {
                return (
                  <AtomBubble
                    label={positionComponents.label}
                    fontSize="13px"
                  />
                );
              } else {
                return <span style={{ color: '#fff', fontSize: '13px' }}>Unknown Position</span>;
              }
            })()}
          </div>

          {/* Action avec bulle For/Against - sur une ligne */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: "#ffd429", fontWeight: 700, minWidth: 110 }}>
              Action:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fff' }}>{getActionType()} {getVaultType()}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>-</span>
              <PositionBubble isFor={isFor} fontSize="12px" />
            </div>
          </div>

          <InfoRow label="Shares" value={sharesTTRUST} />
          <InfoRow label="Term Shares" value={termShares} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <RedeemSelector
            isSelected={isSelected}
            onSelect={onSelect || (() => {})}
            positionId={position.id}
          />
          
          {/* Interface de configuration qui apparaît à droite quand la checkbox est cochée */}
          {isSelected && onAmountChange && (
            <RedeemConfig
              positionId={position.id}
              shares={shares}
              redeemAmount={redeemAmount}
              onAmountChange={onAmountChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionCard;
