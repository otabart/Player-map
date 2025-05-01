import React from 'react';
import PlayerMapHome from './PlayerMapHome';
import RegistrationForm from './RegistationForm';
import GraphComponent from './GraphComponent';

const PlayerMap = () => {
    return (
        <>
            <GraphComponent />
            <PlayerMapHome />
            <RegistrationForm />
        </>
    );
};

export default PlayerMap;
export { PlayerMapHome, RegistrationForm, GraphComponent };