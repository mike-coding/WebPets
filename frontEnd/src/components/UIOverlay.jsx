import React from 'react';
import { useNavigationContext } from '../hooks/AppContext';
import MainMenu from './MainMenu';
import TutorialUI from './TutorialUI';

const UIOverlay = () => {
  const { navigation } = useNavigationContext();

  return (
    <>
      <div className="__versionDisplay absolute top-0 left-0 w-full pointer-events-none">
        <div className="absolute z-10 w-full py-[0.75vh] px-4 font-m6x11 text-white text-2xl">
          v0.0.1 ALPHA
        </div>
        <div className="w-full py-[0.75vh] px-4 font-m6x11 text-white-500 opacity-60 text-2xl pl-4.5 pt-2.5">
          v0.0.1 ALPHA
        </div>
      </div>
      {navigation.activePage === "mainMenu" ? (
        <MainMenu />
      ) : navigation.activePage === "main" && navigation.activeSubPage === "tutorial" ? (
        <TutorialUI />
      ) : (
        <></>
      )}
    </>
  );
};

export default UIOverlay;

