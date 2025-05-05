import React from "react";
import PlayerMapHome from "./PlayerMapHome";
import RegistrationForm from "./RegistrationForm";
import PlayerMapGraph from "./PlayerMapGraph";
import GraphComponent from "./GraphComponent";

const PlayerMap = () => {
  return (
    <>
      <PlayerMapGraph />
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

export { PlayerMapHome, RegistrationForm, PlayerMapGraph, GraphComponent };

export default PlayerMapHome;
