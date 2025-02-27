import Button from "./Button";

function MainMenu ()
{
    return (
        <div className="w-full h-screen flex flex-col items-center">
            <div className="__versionDisplay w-full py-[0.75vh] px-4 font-m6x11 text-white text-2xl">v0.0.1 ALPHA</div>
            <div className="w-5/7 h-screen flex flex-col items-center py-[6vh]">
                <div className="TITLE_BLOCK___ flex flex-row gap-4 items-center items-end pb-32">
                    <div className="MAIN_TITLE__ font-m6x11 font-bold text-9xl text-white text-center pl-6">VIRTUAL<br/>VARMINTS</div>
                    <div className="MAIN_TITLE__ font-m6x11 font-bold text-2xl flex flex-col items-center text-gray-300 h-full justify-center pt-1">
                        <div></div>
                        <div></div>
                    </div>

                </div>
            <div className="BUTTONS___ flex flex-col gap-10">
            <Button name="START"/>
            <Button name="OPTIONS"/>
            </div>
            </div>
        </div>
    );
}

export default MainMenu