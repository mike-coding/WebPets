import React from 'react';
import Button from "./Button";
import { useNavigationContext } from "../hooks/AppContext";
import AuthSubmissionUI from "./AuthSubmissionUI";

function MainMenu() {
  const { navigation } = useNavigationContext();  return (
    <div className="w-6/7 sm:w-5/7 h-[80vh] flex flex-col items-center backdrop-blur-xs backdrop-brightness-130 backdrop-contrast-80 shadow-xl rounded-sm px-4 sm:px-0 pointer-events-auto">
      <div className="TITLE_BLOCK___ flex flex-row gap-2 sm:gap-4 items-center sm:items-end justify-center h-1/3 w-full select-none">        <div className="MAIN_TITLE__ absolute z-10 font-m6x11 font-bold text-4xl sm:text-7xl lg:text-9xl text-white text-center pl-2 sm:pl-5 pb-1 sm:pb-2 tracking-wide">
          VIRTUAL VARMINTS
        </div>        
        <div className="MAIN_TITLE__ font-m6x11 font-bold text-4xl sm:text-7xl lg:text-9xl text-white-200 opacity-60 text-center pl-3 sm:pl-6 tracking-wide">
          VIRTUAL VARMINTS
        </div>
      </div>
      <div className="SUBPAGE_CONTENT___ h-2/3 w-full flex items-start justify-center">
        {navigation.activeSubPage === "loginRegister" ? (<LoginRegister />) : (<AuthSubmissionUI />)}
      </div>
    </div>
  );
}

export default MainMenu;

function LoginRegister() {
  const { navigateTo } = useNavigationContext();
  return (
    <div className="LOGIN_REGISTER____ w-full h-full justify-start sm:justify-center pt-15 sm:pt-0 flex flex-col sm:flex-row gap-8 sm:gap-20 items-center">
      <Button name="REGISTER" onClick={() => navigateTo("mainMenu", "userPass_Register")} />
      <Button name="LOG IN" onClick={() => navigateTo("mainMenu", "userPass_Login")} />
    </div>
  );
}

