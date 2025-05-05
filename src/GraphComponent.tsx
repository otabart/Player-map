import React from "react";
import { useAtomById, useAtomByLabel } from "./hooks/useAtomData";

const GraphComponent: React.FC = () => {
  // Utiliser l'ID 20078 comme dans votre exemple
  const {
    data: atomByIdData,
    loading: idLoading,
    error: idError,
  } = useAtomById(3);

  //   Utiliser le label "0xDdffF342CE2547338B0F689aA3eC86893340FBdf" comme demandé
  const {
    data: atomByLabelData,
    loading: labelLoading,
    error: labelError,
  } = useAtomByLabel("Rumble Racing Star");

  if (idLoading) return <div>Chargement des données...</div>;
  if (idError)
    return <div>Erreur lors de la récupération par ID: {idError}</div>;
  if (labelError)
    return <div>Erreur lors de la récupération par label: {labelError}</div>;

  return (
    <div>
      <h2>Atome par ID</h2>
      {atomByIdData && atomByIdData.atom ? (
        <div>
          <pre>id : {JSON.stringify(atomByIdData.atom.id, null, 2)}</pre>
          <pre>label : {JSON.stringify(atomByIdData.atom.label, null, 2)}</pre>
          <pre>
            creator : {JSON.stringify(atomByIdData.atom.creator, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Aucun atome trouvé avec cet ID</p>
      )}

      <h2>Atome par Label</h2>
      {atomByLabelData ? (
        <div>
          <pre>id : {JSON.stringify(atomByLabelData.id, null, 2)}</pre>
          <pre>label : {JSON.stringify(atomByLabelData.label, null, 2)}</pre>
          <pre>
            creator : {JSON.stringify(atomByLabelData.creator, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Aucun atome trouvé avec ce label</p>
      )}
    </div>
  );
};

export default GraphComponent;
