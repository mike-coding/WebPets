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
        <div className="REQUEST_LOADING____ w-full justify-center flex flex-col items-center gap-15 h-full">
            <LoadingIndicator/>
        </div>
    ):(
        <div className="USER_PASSWORD____ w-full justify-center flex flex-col items-center gap-4 sm:gap-5 h-full py-4 pointer-events-auto">
            <div className="USER_PASSWORD____ w-full justify-center flex flex-col items-center gap-6 sm:gap-8">
                <Field title="USER" value={userName} setValue={setUserName} />
                <Field title="PASS" hide={true} value={password} setValue={setPassword} />
            </div>
            <div className="h-auto min-h-[48px] sm:h-[5vh] flex flex-row font-m6x11 text-xl sm:text-2xl lg:text-3xl text-red-300 justify-center items-center tracking-wide transform transition hover:cursor-default select-none px-4 text-center">
                {authFeedback}
            </div>
            <div className="NAVIGATION____ w-full justify-center items-center flex flex-col sm:flex-row gap-4 sm:gap-8">
                <Button name="BACK" onClick={() => navigateTo("mainMenu", "loginRegister")} />
                <Button name={nextButtonName} onClick={() => { submitAuth(userName, password, isLogin, setIsRequesting, setAuthFeedback) }} />
            </div>
        </div>
    )
    );
}

export default AuthSubmissionUI