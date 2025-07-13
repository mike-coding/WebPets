import IconButton from "./IconButton";
import { useNavigationContext } from '../hooks/AppContext';


function HomeUI() {
    const { navigation, navigateTo } = useNavigationContext();

    const toggleShop = () => {
        if (navigation.activePage === "shop") {
            navigateTo("main", "default");
        } else {
            navigateTo("shop");
        }
    };

    const toggleInventory = () => {
        if (navigation.activePage === "inventory") {
            navigateTo("main", "default");
        } else {
            navigateTo("inventory");
        }
    };

    const togglePartyView = () => {
        if (navigation.activePage === "petSummary" && !navigation.activePetId) {
            navigateTo("main", "default");
        } else {
            navigateTo("petSummary", null, null); // Navigate to petSummary but with no activePetId
        }
    };

    return (
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
            <div className = "___bottom bar w-full h-[10vh] sm:h-[10vh] flex flex-row items-center justify-between p-2.5 gap-3 pointer-events-auto">
                <div className=" h-full flex flex-row justify-center items-center gap-2">
                <div onClick={togglePartyView}>
                    <IconButton iconName='PartyViewIcon'/>
                </div>
                <div onClick={toggleInventory}>
                    <IconButton iconName='Chest'/>
                </div>
                <div onClick={toggleShop}>
                    <IconButton iconName='shopIcon'/>
                </div>
                </div>
                <IconButton iconName='settingsIcon'/>
            </div>
        </div>
    );
}

export default HomeUI;