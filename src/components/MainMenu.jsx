import Button from "./Button";
import Field from "./Field";
import { useState } from "react";
import { useNavigationContext } from "../hooks/AppContext";
import SubmitAuth from "../utils/SubmitAuth";

function MainMenu() {
  const { navigation, navigateTo } = useNavigationContext();
  return (
    <div className="w-full h-screen flex flex-col items-center">
        <div className="__versionDisplay w-full">
            <div className="absolute z-10 w-full py-[0.75vh] px-4 font-m6x11 text-white text-2xl">
            v0.0.1 ALPHA
            </div>
            <div className="w-full py-[0.75vh] px-4 font-m6x11 text-white-500 opacity-60 text-2xl pl-4.5 pt-2.5">
            v0.0.1 ALPHA
            </div>
        </div>
        {navigation.activePage === "mainMenu" ? (
            <div className="w-5/7 h-[80vh] flex flex-col items-center py-[10vh] my-[4vh] backdrop-blur-xs backdrop-brightness-150 backdrop-contrast-60 shadow-xl rounded-sm">
                <div className="TITLE_BLOCK___ flex flex-row gap-4 items-start h-[40vh]">
                <div className="MAIN_TITLE__ absolute z-10 font-m6x11 font-bold text-9xl text-white text-center pl-5 pb-2 tracking-wide">
                    VIRTUAL<br />VARMINTS
                </div>
                <div className="MAIN_TITLE__ font-m6x11 font-bold text-9xl text-white-200 opacity-60 text-center pl-6 tracking-wide">
                    VIRTUAL<br />VARMINTS
                </div>
                </div>
                {navigation.activeSubPage === "loginRegister" ? (<LoginRegister/>) : (<UsernamePassword/>)}
            </div>
        ):(
            <div></div>
        )}

    </div>
  );
}

export default MainMenu;

function LoginRegister() {
  const { navigation, navigateTo } = useNavigationContext();
    return (
    <div className="LOGIN_REGISTER____ w-full justify-center flex flex-row gap-20 h-[40vh] items-center">
        <Button name="REGISTER" onClick={() => navigateTo("mainMenu","userPass_Register")}/>
        <Button name="LOG IN" onClick={() => navigateTo("mainMenu","userPass_Login")}/>
    </div>
    );
}

function UsernamePassword() {
    const { navigation, navigateTo } = useNavigationContext();
    const isLogin = navigation.activeSubPage === "userPass_Login";
    const nextButtonName = isLogin ? "LOG IN" : "REGISTER";
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
  
    return (
      <div className="USER_PASSWORD____ w-full justify-center flex flex-col items-center gap-15 h-[40vh]">
        <div className="USER_PASSWORD____ w-full justify-center flex flex-col items-center gap-8">
          <Field title="USER" value={userName} setValue={setUserName} />
          <Field title="PASS" hide={true} value={password} setValue={setPassword} />
        </div>
        <div className="NAVIGATION____ w-full justify-center items-center flex flex-row gap-8">
          <Button name="BACK" onClick={() => navigateTo("mainMenu", "loginRegister")} />
          <Button name={nextButtonName} onClick={() => { SubmitAuth(userName, password, isLogin, navigateTo) }} />
        </div>
      </div>
    );
  }
