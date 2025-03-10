import React from 'react';
import Button from "./Button";
import { useNavigationContext } from "../hooks/AppContext";
import EggCard from './EggCard';

function TutorialUI() {
  const { navigation, navigateTo } = useNavigationContext();
  return (
    <div className="w-5/7 h-[80vh] flex flex-col items-center py-[5vh] my-[4vh] backdrop-blur-xs backdrop-brightness-150 backdrop-contrast-60 shadow-xl rounded-sm">
      <div className="TITLE_BLOCK___ flex flex-row gap-4 items-center h-[15vh] select-none">
        <div className="MAIN_TITLE__ font-m6x11 font-bold text-7xl text-white text-center pl-5 pb-2 tracking-wide">
          Welcome! Select your starting egg.
        </div>

      </div>
      <div className="w-full flex flex-col justify-center items-center h-[90vh] gap-30">
        <div className="EGG_CARD_ROW___ flex flex-row justify-around w-full px-[15vh]">
            <EggCard id="0" hoverTip="Mineral Egg"/>
            <EggCard id="1" hoverTip="Seed Egg"/>
            <EggCard id="2" hoverTip="Beast Egg"/>
        </div>
        <Button name="BACK" onClick={() => navigateTo("mainMenu", "loginRegister")} />
      </div>
    </div>
  );
}

export default TutorialUI;