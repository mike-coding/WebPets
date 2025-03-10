import React from 'react';
import Button from "./Button";
import { useNavigationContext } from "../hooks/AppContext";
import AuthSubmissionUI from "./AuthSubmissionUI";

function MainMenu() {
  const { navigation } = useNavigationContext();
  return (
    <div className="w-5/7 h-[80vh] flex flex-col items-center py-[10vh] my-[4vh] backdrop-blur-xs backdrop-brightness-150 backdrop-contrast-60 shadow-xl rounded-sm">
      <div className="TITLE_BLOCK___ flex flex-row gap-4 items-center h-[20vh] select-none">
        <div className="MAIN_TITLE__ absolute z-10 font-m6x11 font-bold text-9xl text-white text-center pl-5 pb-2 tracking-wide">
          VIRTUAL VARMINTS
        </div>
        <div className="MAIN_TITLE__ font-m6x11 font-bold text-9xl text-white-200 opacity-60 text-center pl-6 tracking-wide">
          VIRTUAL VARMINTS
        </div>
      </div>
      {navigation.activeSubPage === "loginRegister" ? (<LoginRegister />) : (<AuthSubmissionUI />)}
    </div>
  );
}

export default MainMenu;

function LoginRegister() {
  const { navigateTo } = useNavigationContext();
  return (
    <div className="LOGIN_REGISTER____ w-full justify-center flex flex-row gap-20 h-[40vh] items-center">
      <Button name="REGISTER" onClick={() => navigateTo("mainMenu", "userPass_Register")} />
      <Button name="LOG IN" onClick={() => navigateTo("mainMenu", "userPass_Login")} />
    </div>
  );
}

