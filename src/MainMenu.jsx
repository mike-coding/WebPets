import Button from "./Button";

function MainMenu ()
{
    return (
        <div className="w-5/7 h-screen flex flex-col items-center py-[12vh]">
            <div className="TITLE_BLOCK___ flex flex-row gap-4 items-center items-end pb-32">
                <div className="MAIN_TITLE__ font-mono font-bold text-7xl text-black">Virtual Varmints</div>
                <div className="MAIN_TITLE__ font-mono font-bold text-lg flex flex-col items-center text-gray-400 h-full justify-center pt-1">
                    <div>Alpha</div>
                    <div>v0.0.1 </div>
                </div>

            </div>
        <div className="BUTTONS___ flex flex-col gap-10">
        <Button name="Start"/>
        <Button name="Options"/>
        </div>
        </div>
    );
}

export default MainMenu