
const icons = import.meta.glob('/src/sprites/UI/icons/*.png', { eager: true });
const iconUrlMap = Object.fromEntries(
  Object.entries(icons).map(([path, mod]) => {
    // Extract the filename without extension
    const match = path.match(/\/([^/]+)\.png$/);
    return match ? [match[1], mod.default] : [null, null];
  })
);

function IconButton({ iconName, children }){
    const iconUrl = iconUrlMap[iconName];
    
    return(
        <div className = "bg-gray-900/30 rounded-sm h-full flex flex-row justify-center items-center p-3 font-m6x11 gap-2 pointer-events-auto">
            {iconUrl && (
                <img 
                    src={iconUrl} 
                    alt={iconName}
                    className="w-8 h-8"
                    style={{ imageRendering: "pixelated" }}
                />
            )}
            {children}
        </div>
    );
}

export default IconButton;