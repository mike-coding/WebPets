import Button from "./Button";

function MainMenu ()
{
    return (
        <div className="w-full h-screen flex flex-col items-center">
            <div className= "__versionDisplay w-full">
                <div className="absolute z-10 w-full py-[0.75vh] px-4 font-m6x11 text-white text-2xl">v0.0.1 ALPHA</div>
                <div className="w-full py-[0.75vh] px-4 font-m6x11 text-white-500 opacity-60 text-2xl pl-4.5 pt-2.5">v0.0.1 ALPHA</div>
            </div>
            <div className="w-5/7 flex flex-col items-center py-[10vh] my-[7vh] backdrop-blur-xs backdrop-brightness-85 shadow-xl rounded-sm">
                <div className="TITLE_BLOCK___ flex flex-row gap-4 items-center items-end pb-18">
                    <div className="MAIN_TITLE__ absolute z-10 font-m6x11 font-bold text-9xl text-white text-center pl-5 pb-2 tracking-wide">VIRTUAL<br/>VARMINTS</div>
                    <div className="MAIN_TITLE__ font-m6x11 font-bold text-9xl text-white-200 opacity-60 text-center pl-6 tracking-wide">VIRTUAL<br/>VARMINTS</div>
                </div>
            <div className="BUTTONS___ flex flex-col gap-20">
            <Button name="START"/>
            <Button name="OPTIONS"/>
            </div>
            </div>
        </div>
    );
}

export default MainMenu