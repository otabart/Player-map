import React, { useState } from "react";
import {
  useMainnetAtomById,
  useMainnetAtomByLabel,
  useTestnetAtomById,
  useTestnetAtomByLabel,
  Network,
} from "./hooks/useAtomData";

interface GraphComponentProps {
  walletConnected?: any;
  walletAddress?: string;
  wagmiConfig?: any;
  walletHooks?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

// Fonction pour tester directement l'API GraphQL (peut être déplacée dans utilities)
const testGraphQLAPI = async (
  network: "mainnet" | "testnet",
  id?: number,
  label?: string
) => {
  // Déterminer l'URL de l'API en fonction du réseau
  const apiUrl =
    network === "testnet"
      ? "https://dev.base-sepolia.intuition-api.com/v1/graphql"
      : "https://prod.base.intuition-api.com/v1/graphql";

  // Préparer la requête GraphQL
  let query = "";
  let variables = {};

  if (id !== undefined) {
    // Requête pour obtenir un atome par ID
    query = `
      query GetAtomById($id: numeric!) {
        atom(id: $id) {
          id
          label
          type
          data
          emoji
          image
          creator_id
          creator {
            id
            label
          }
          value {
            id
          }
          block_number
          block_timestamp
          transaction_hash
        }
      }
    `;
    variables = { id };
  } else if (label !== undefined) {
    // Requête pour obtenir un atome par label
    query = `
      query GetAtomByLabel($label: String!) {
        atoms(where: { label: { _eq: $label } }, limit: 1) {
          id
          label
          type
          data
          emoji
          image
          creator_id
          creator {
            id
            label
          }
          value {
            id
          }
          block_number
          block_timestamp
          transaction_hash
        }
      }
    `;
    variables = { label };
  } else {
    throw new Error("Vous devez spécifier un ID ou un label");
  }

  // Exécuter la requête GraphQL
  try {
    console.log(`Envoi de requête à ${apiUrl} (${network})`, {
      query,
      variables,
    });
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    console.log(`Réponse de ${network}:`, data);
    return data;
  } catch (error) {
    console.error(`Erreur lors de la requête ${network}:`, error);
    throw error;
  }
};

const GraphComponent: React.FC<GraphComponentProps> = ({ walletAddress }) => {
  const [mainnetId, setMainnetId] = useState(3);
  const [testnetId, setTestnetId] = useState(1);
  const [mainnetLabel, setMainnetLabel] = useState("has tag");
  const [testnetLabel, setTestnetLabel] = useState("has tag");
  const [directTestResult, setDirectTestResult] = useState<any>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);

  // Hooks mainnet
  const {
    data: mainnetAtomByIdData,
    loading: mainnetIdLoading,
    error: mainnetIdError,
  } = useMainnetAtomById(mainnetId);

  const {
    data: mainnetAtomByLabelData,
    loading: mainnetLabelLoading,
    error: mainnetLabelError,
  } = useMainnetAtomByLabel(mainnetLabel);

  // Hooks testnet
  const {
    data: testnetAtomByIdData,
    loading: testnetIdLoading,
    error: testnetIdError,
  } = useTestnetAtomById(testnetId);

  const {
    data: testnetAtomByLabelData,
    loading: testnetLabelLoading,
    error: testnetLabelError,
  } = useTestnetAtomByLabel(testnetLabel);

  const isLoading =
    mainnetIdLoading ||
    mainnetLabelLoading ||
    testnetIdLoading ||
    testnetLabelLoading;

  const handleRefresh = () => {
    // Forcer le rechargement en modifiant un état, ce qui redéclenche les hooks
    setMainnetId((prev) => prev);
    setTestnetId((prev) => prev);
    setMainnetLabel((prev) => prev);
    setTestnetLabel((prev) => prev);
  };

  // Fonction pour tester directement l'API GraphQL
  const handleDirectTest = async (
    network: "mainnet" | "testnet",
    useId: boolean
  ) => {
    setIsTestLoading(true);
    try {
      let result;
      if (useId) {
        // Utiliser l'ID
        const id = network === "mainnet" ? mainnetId : testnetId;
        result = await testGraphQLAPI(network, id);
      } else {
        // Utiliser le label
        const label = network === "mainnet" ? mainnetLabel : testnetLabel;
        result = await testGraphQLAPI(network, undefined, label);
      }
      setDirectTestResult(result);
    } catch (error) {
      console.error("Erreur lors du test direct:", error);
      setDirectTestResult({ error: String(error) });
    } finally {
      setIsTestLoading(false);
    }
  };

  // Rendu du composant de test direct des API GraphQL
  const renderDirectTestSection = () => (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #6a6a9a",
        borderRadius: "5px",
        backgroundColor: "#1a1a2e",
      }}
    >
      <h3>Test Direct des API GraphQL</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button
          onClick={() => handleDirectTest("mainnet", true)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#FFD32A",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={isTestLoading}
        >
          Tester Mainnet (ID: {mainnetId})
        </button>
        <button
          onClick={() => handleDirectTest("mainnet", false)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#FFD32A",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={isTestLoading}
        >
          Tester Mainnet (Label: {mainnetLabel})
        </button>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button
          onClick={() => handleDirectTest("testnet", true)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={isTestLoading}
        >
          Tester Testnet (ID: {testnetId})
        </button>
        <button
          onClick={() => handleDirectTest("testnet", false)}
          style={{
            padding: "8px 15px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={isTestLoading}
        >
          Tester Testnet (Label: {testnetLabel})
        </button>
      </div>

      {isTestLoading && <p>Test en cours...</p>}

      {directTestResult && (
        <div>
          <h4>Résultats du test direct:</h4>
          <pre
            style={{
              backgroundColor: "#0a0a15",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "200px",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(directTestResult, null, 2)}
          </pre>
        </div>
      )}

      <p style={{ marginTop: "10px", fontSize: "0.8em", color: "#aaa" }}>
        Ces boutons testent directement les API GraphQL sans passer par les
        hooks. Les résultats complets de la requête apparaîtront ici et dans la
        console du navigateur.
      </p>
    </div>
  );

  // Rendu de la section mainnet
  const renderMainnetSection = () => (
    <div
      style={{
        flex: "1 1 400px",
        border: "1px solid #FFD32A",
        padding: "15px",
        borderRadius: "5px",
        backgroundColor: "#151525",
      }}
    >
      <h2 style={{ color: "#FFD32A" }}>Mainnet</h2>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>ID à rechercher:</label>
        <input
          type="number"
          value={mainnetId}
          onChange={(e) => setMainnetId(Number(e.target.value))}
          style={{
            padding: "5px 10px",
            backgroundColor: "#1e1e30",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: "4px",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>Label à rechercher:</label>
        <input
          type="text"
          value={mainnetLabel}
          onChange={(e) => setMainnetLabel(e.target.value)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#1e1e30",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: "4px",
          }}
        />
      </div>

      {mainnetIdLoading ? (
        <p>Chargement des données mainnet par ID...</p>
      ) : mainnetIdError ? (
        <p>Erreur mainnet (ID): {mainnetIdError}</p>
      ) : (
        <>
          <h3>Atome par ID ({mainnetId})</h3>
          {mainnetAtomByIdData && mainnetAtomByIdData.atom ? (
            <div>
              <pre>
                id : {JSON.stringify(mainnetAtomByIdData.atom.id, null, 2)}
              </pre>
              <pre>
                label :{" "}
                {JSON.stringify(mainnetAtomByIdData.atom.label, null, 2)}
              </pre>
              <pre>
                creator :{" "}
                {JSON.stringify(mainnetAtomByIdData.atom.creator, null, 2)}
              </pre>
            </div>
          ) : (
            <p>Aucun atome trouvé avec cet ID sur mainnet</p>
          )}
        </>
      )}

      {mainnetLabelLoading ? (
        <p>Chargement des données mainnet par label...</p>
      ) : mainnetLabelError ? (
        <p>Erreur mainnet (Label): {mainnetLabelError}</p>
      ) : (
        <>
          <h3>Atome par Label ({mainnetLabel})</h3>
          {mainnetAtomByLabelData ? (
            <div>
              <pre>
                id : {JSON.stringify(mainnetAtomByLabelData.id, null, 2)}
              </pre>
              <pre>
                label : {JSON.stringify(mainnetAtomByLabelData.label, null, 2)}
              </pre>
              <pre>
                creator :{" "}
                {JSON.stringify(mainnetAtomByLabelData.creator, null, 2)}
              </pre>
            </div>
          ) : (
            <p>Aucun atome trouvé avec ce label sur mainnet</p>
          )}
        </>
      )}
    </div>
  );

  // Rendu de la section testnet
  const renderTestnetSection = () => (
    <div
      style={{
        flex: "1 1 400px",
        border: "1px solid #4CAF50",
        padding: "15px",
        borderRadius: "5px",
        backgroundColor: "#151525",
      }}
    >
      <h2 style={{ color: "#4CAF50" }}>Testnet</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>ID à rechercher:</label>
        <input
          type="number"
          value={testnetId}
          onChange={(e) => setTestnetId(Number(e.target.value))}
          style={{
            padding: "5px 10px",
            backgroundColor: "#1e1e30",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: "4px",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>Label à rechercher:</label>
        <input
          type="text"
          value={testnetLabel}
          onChange={(e) => setTestnetLabel(e.target.value)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#1e1e30",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: "4px",
          }}
        />
      </div>

      {testnetIdLoading ? (
        <p>Chargement des données testnet par ID...</p>
      ) : testnetIdError ? (
        <div>
          <p>Erreur testnet (ID): {testnetIdError}</p>
          <p style={{ fontSize: "0.8em", color: "#aaa" }}>
            Note: L'API du testnet pourrait avoir un schéma différent ou
            nécessiter une authentification.
          </p>
        </div>
      ) : (
        <>
          <h3>Atome par ID ({testnetId})</h3>
          {testnetAtomByIdData && testnetAtomByIdData.atom ? (
            <div>
              <div
                style={{
                  backgroundColor: "#202035",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8em",
                    color: "#4CAF50",
                    margin: "0 0 5px 0",
                  }}
                >
                  Réseau: testnet
                </p>
                <pre>
                  id : {JSON.stringify(testnetAtomByIdData.atom.id, null, 2)}
                </pre>
                <pre>
                  label :{" "}
                  {JSON.stringify(testnetAtomByIdData.atom.label, null, 2)}
                </pre>
                <pre>
                  type :{" "}
                  {JSON.stringify(testnetAtomByIdData.atom.type, null, 2)}
                </pre>
                <pre>
                  data :{" "}
                  {JSON.stringify(testnetAtomByIdData.atom.data, null, 2)}
                </pre>
                <pre>
                  emoji :{" "}
                  {JSON.stringify(testnetAtomByIdData.atom.emoji, null, 2)}
                </pre>
                <pre>
                  image :{" "}
                  {JSON.stringify(testnetAtomByIdData.atom.image, null, 2)}
                </pre>
                <pre>
                  creator :{" "}
                  {JSON.stringify(testnetAtomByIdData.atom.creator, null, 2)}
                </pre>
              </div>
              <button
                onClick={() => {
                  console.log(
                    "Données complètes testnet by ID:",
                    testnetAtomByIdData
                  );
                }}
                style={{
                  padding: "4px 10px",
                  backgroundColor: "#202035",
                  color: "#aaa",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8em",
                }}
              >
                Log complet dans la console
              </button>
            </div>
          ) : (
            <p>Aucun atome trouvé avec cet ID sur testnet</p>
          )}
        </>
      )}

      {testnetLabelLoading ? (
        <p>Chargement des données testnet par label...</p>
      ) : testnetLabelError ? (
        <div>
          <p>Erreur testnet (Label): {testnetLabelError}</p>
          <p style={{ fontSize: "0.8em", color: "#aaa" }}>
            Note: L'API du testnet pourrait avoir un schéma différent ou
            nécessiter une authentification.
          </p>
        </div>
      ) : (
        <>
          <h3>Atome par Label ({testnetLabel})</h3>
          {testnetAtomByLabelData ? (
            <div>
              <pre>
                id : {JSON.stringify(testnetAtomByLabelData.id, null, 2)}
              </pre>
              <pre>
                label : {JSON.stringify(testnetAtomByLabelData.label, null, 2)}
              </pre>
              <pre>
                creator :{" "}
                {JSON.stringify(testnetAtomByLabelData.creator, null, 2)}
              </pre>
            </div>
          ) : (
            <p>Aucun atome trouvé avec ce label sur testnet</p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "15px",
        border: "1px solid #333",
        borderRadius: "5px",
        backgroundColor: "#101020",
      }}
    >
      <h2>Player Map Data</h2>

      <div style={{ marginBottom: "10px" }}>
        <h3>Wallet Address: {walletAddress || "Non connecté"}</h3>
        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 15px",
            backgroundColor: "#2e2e40",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Rafraîchir les données
        </button>
      </div>

      {/* Test direct des API GraphQL */}
      {renderDirectTestSection()}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* MAINNET DATA */}
        {renderMainnetSection()}

        {/* TESTNET DATA */}
        {renderTestnetSection()}
      </div>
    </div>
  );
};

export default GraphComponent;
