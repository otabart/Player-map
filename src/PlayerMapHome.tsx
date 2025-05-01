import React from "react";
import IntuitionLogo from "./assets/img/logo.svg";

const PlayerMapHome: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#101020",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <img
        src={IntuitionLogo}
        alt="Intuition Logo"
        style={{ width: "300px", marginBottom: "20px" }}
      />
      <h1 style={{ fontSize: "2.5em", margin: "0" }}>INTUITION</h1>
      <h2 style={{ fontSize: "1.5em", margin: "0" }}>
        BOSS FIGHTERS COMMUNITY PLAYER MAP
      </h2>
      <p>
        At first, there was nothing. And then, suddenly, the whole community
        appeared!
      </p>
      <p>
        Everything of which the Boss Fighters community would one day be
        composed, would be born in an instant.
      </p>
      <p>A single species of condensed matter, exploding in a vast universe.</p>
      <p>
        Although energy would neither be created nor destroyed, the interaction
        between these newly-created atoms would continue to create something
        beautiful...
      </p>
      <p>
        What had been separate would become whole again. And what would be
        created in the process would be even more beautiful than what came
        before...
      </p>
      <p>Our story begins with the atom. The cornerstone of our ecosystem.</p>
      <p>And our "atoms" start with you!</p>
      <p>
        Every contribution will help build our ecosystem and make it healthy...
      </p>
      <div
        style={{
          border: "1px solid #fff",
          borderRadius: "10px",
          padding: "10px",
          marginTop: "20px",
          display: "inline-block",
        }}
      >
        <p>
          Claims in Intuition, also referred to as "Triples" structured in
          Semantic Triple format:
        </p>
        <p>
          [Subject] ⇒ [Predicate] ⇒ [Object] (For example, a Triple could be:
          [SciFi] [is] [Strong Boss])
        </p>
        <p>This keeps our attestations tidy!</p>
      </div>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ffcc00",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          fontSize: "1em",
        }}
      >
        CREATE YOUR PLAYER
      </button>
    </div>
  );
};

export default PlayerMapHome;
