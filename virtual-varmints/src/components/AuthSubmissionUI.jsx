import { useSubmitAuth } from "../utils/SubmitAuth";
import { useNavigationContext } from "../hooks/AppContext";
import Field from "./Field";
import { useState } from "react";
import Button from "./Button";
import LoadingIndicator from "./LoadingIndicator";

function AuthSubmissionUI() {
    const { navigation, navigateTo } = useNavigationContext();
    const isLogin = navigation.activeSubPage === "userPass_Login";
    const nextButtonName = isLogin ? "LOG IN" : "REGISTER";
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isRequesting, setIsRequesting] = useState(false);
    const [ authFeedback, setAuthFeedback] = useState("");
    const submitAuth = useSubmitAuth();
  
    return (
    isRequesting ? (
        <div className="REQUEST_LOADING____ w-full justify-center flex flex-col items-center gap-15 h-[40vh]">
            <LoadingIndicator/>
        </div>
    ):(
        <div className="USER_PASSWORD____ w-full justify-center flex flex-col items-center gap-5 h-[40vh]">
            <div className="USER_PASSWORD____ w-full justify-center flex flex-col items-center gap-8">
                <Field title="USER" value={userName} setValue={setUserName} />
                <Field title="PASS" hide={true} value={password} setValue={setPassword} />
            </div>
            <div className="h-[5vh] flex flex-row font-m6x11 text-3xl text-red-300 justify-center items-center tracking-wide transform transition hover:cursor-default select-none">
                {authFeedback}
            </div>
            <div className="NAVIGATION____ w-full justify-center items-center flex flex-row gap-8">
                <Button name="BACK" onClick={() => navigateTo("mainMenu", "loginRegister")} />
                <Button name={nextButtonName} onClick={() => { submitAuth(userName, password, isLogin, setIsRequesting, setAuthFeedback) }} />
            </div>
        </div>
    )
    );
}

export default AuthSubmissionUI