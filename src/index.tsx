import React from "react";
import PlayerMapHome from "./PlayerMapHome";
import RegistrationForm from "./RegistrationForm";
import GraphComponent from "./GraphComponent";

const PlayerMap = () => {
  return (
    <>
      <GraphComponent />
      <PlayerMapHome />
      <RegistrationForm
        isOpen={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};

export { PlayerMapHome, RegistrationForm, GraphComponent };

export default PlayerMapHome;
