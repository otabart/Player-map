import React from "react";

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
    <span style={{ color: "#ffd32a", fontWeight: 700, minWidth: 110 }}>
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

interface ValueBlockProps {
  value?: any;
}

const ValueBlock: React.FC<ValueBlockProps> = ({ value }) => {
  if (!value) return null;
  const { person, thing, organization } = value;
  return (
    <div style={{ marginTop: 6, marginBottom: 6 }}>
      {person && (
        <div style={{ color: "#ffd32a" }}>
          <b>Person:</b> {person.name} <br />
          <span style={{ color: "#fff" }}>{person.description}</span>
          {person.url && (
            <>
              <br />
              <a
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffd32a" }}
              >
                {person.url}
              </a>
            </>
          )}
        </div>
      )}
      {thing && (
        <div style={{ color: "#ffd32a" }}>
          <b>Thing:</b> {thing.name} <br />
          <span style={{ color: "#fff" }}>{thing.description}</span>
          {thing.url && (
            <>
              <br />
              <a
                href={thing.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffd32a" }}
              >
                {thing.url}
              </a>
            </>
          )}
        </div>
      )}
      {organization && (
        <div style={{ color: "#ffd32a" }}>
          <b>Organization:</b> {organization.name} <br />
          <span style={{ color: "#fff" }}>{organization.description}</span>
          {organization.url && (
            <>
              <br />
              <a
                href={organization.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffd32a" }}
              >
                {organization.url}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface ActivityCardProps {
  position: any;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ position }) => {
  // Structure simple comme dans playermap-graph original
  const vaultShares = Number(position.term?.total_market_cap || 0);
  const shares = Number(position.shares || 0);
  const account = position.account;
  const term = position.term;

  return (
    <div
      style={{
        background: "#232326",
        borderRadius: 14,
        padding: "18px 24px",
        marginBottom: 18,
        boxShadow: "0 2px 12px rgba(0,0,0,0.13)",
        borderLeft: `6px solid #ffd32a`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      className="activity-card"
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <AtomImage src={account?.image} alt={account?.label} />
        <div>
          <InfoRow label="Account" value={account?.label || account?.id} />
          <InfoRow label="Type" value={account?.type} />
        </div>
      </div>
      <InfoRow label="Position ID" value={position.id} />
      <InfoRow label="Shares" value={shares} />
      <InfoRow label="Term Shares" value={vaultShares} />
      <InfoRow label="Term ID" value={term?.term_id} />
    </div>
  );
};

export default ActivityCard;
