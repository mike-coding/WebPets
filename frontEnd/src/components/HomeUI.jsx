import IconButton from "./IconButton";


function HomeUI() {
    return (
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
            <div className = "___bottom bar w-full h-[10vh] sm:h-[10vh] flex flex-row items-center justify-between p-2.5 gap-3 pointer-events-auto">
                <div className=" h-full flex flex-row justify-center items-center gap-2">
                <IconButton iconName='PartyViewIcon'/>
                <IconButton iconName='Chest'/>
                <IconButton iconName='shopIcon'/>
                </div>
                <IconButton iconName='settingsIcon'/>
            </div>
        </div>
    );
}

export default HomeUI;