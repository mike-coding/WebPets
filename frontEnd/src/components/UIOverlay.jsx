import React from 'react';
import { useNavigationContext } from '../hooks/AppContext';
import MainMenu from './MainMenu';
import TutorialUI from './TutorialUI';
import HomeUI from './HomeUI';
import PetSummary from './PetSummary';
import PartyView from './PartyView';
import InventoryUI from './InventoryUI';
import ShopUI from './ShopUI';
import EndlessRunner from './EndlessRunner_simple';

function UIOverlay() {
  const { navigation } = useNavigationContext();

  return (
    <>
      <div className="__versionDisplay absolute top-0 left-0 w-full pointer-events-none">
        <div className="absolute z-10 w-full py-[0.75vh] px-2 font-m6x11 text-white text-xl">
          v0.0.3 ALPHA
        </div>
      </div>        
      {navigation.activePage === "mainMenu" ? (
        <MainMenu/>
      ) : navigation.activePage === "main" && navigation.activeSubPage === "tutorial" ? (
        <TutorialUI />
      ) : navigation.activePage === "main" && navigation.activeSubPage === "default" ? (
        <HomeUI/>
      ) : navigation.activePage === "petSummary" ? (
        <>
          {navigation.activePetId ? <PetSummary/> : <PartyView/>}
          <HomeUI/>
        </>
      ) : navigation.activePage === "inventory" ? (
        <>
          <InventoryUI/>
          <HomeUI/>
        </>
      ) : navigation.activePage === "shop" ? (
        <>
          <ShopUI/>
          <HomeUI/>
        </>
      ) : navigation.activePage === "minigames" && navigation.activeSubPage === "endless_runner" ? (
        null
      ) : (
        <div>{navigation.activePage} {navigation.activeSubPage}</div>
      )
      }
    </>
  );
}

export default UIOverlay;

