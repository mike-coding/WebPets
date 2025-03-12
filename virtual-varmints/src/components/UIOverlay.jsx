import React from 'react';
import { useNavigationContext } from '../hooks/AppContext';
import MainMenu from './MainMenu';
import Button from './Button';
import TutorialUI from './TutorialUI';

const UIOverlay = () => {
  const { navigation, navigateTo } = useNavigationContext();

  if (navigation.activePage === "mainMenu") {
    return <MainMenu />;
  } else if (navigation.activePage === "main" && navigation.activeSubPage==="tutorial"){
    return (
        <TutorialUI/>
    );
  } else {
    return (<></>);
  }
};

export default UIOverlay;
