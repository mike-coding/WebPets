import React from 'react';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import IconButton from './IconButton';

function InventoryUI() {
  const { navigateTo } = useNavigationContext();
  const { userData } = useUserDataContext();

  const closeInventory = () => {
    navigateTo("main", "default");
  };

  const inventory = userData?.inventory || [];
  
  // Robust money access - only show 'uhh' if userData is null/undefined
  const credits = userData ? (userData.money ?? 0) : '<ERROR>';

  return (
    <div className="w-full h-full flex flex-col justify-center pointer-events-auto p-4 text-white font-m6x11 bg-black/40">
      <div className="bg-gray-300/10 rounded-lg p-4 backdrop-blur-xs backdrop-brightness-140 shadow-xl">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="text-4xl text-gray-100/90 flex flex-row pt-3">
            Inventory
          </div>
          <div onClick={closeInventory}>
            <IconButton iconName='exitIcon' withEffects={false} />
          </div>
        </div>

        {/* Content */}
        <div className="w-full gap-2 flex flex-col items-center justify-center">
          <div className="w-full h-1.5 bg-gray-100/60 rounded-xs"/>
          <div className="Spacer h-0.25"/>
          
          {inventory.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-8 text-center">
              <div className="text-lg text-gray-300/80 mb-2">Empty Inventory</div>
              <div className="text-sm text-gray-300/60">
                Broke ass! 😂
              </div>
            </div>
          ) : (
            <div className="w-full max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {inventory.map((inventoryItem) => (
                  <div 
                    key={inventoryItem.id} 
                    className="bg-gray-900/30 rounded-sm p-3 backdrop-blur-xs shadow-md hover:bg-gray-800/40 transition-colors"
                  >
                    {/* Item Icon Placeholder */}
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-sm flex items-center justify-center">
                      <span className="font-m6x11 text-white/50 text-xs">
                        {inventoryItem.item?.category?.slice(0, 3).toUpperCase() || 'ITM'}
                      </span>
                    </div>
                    
                    {/* Item Name */}
                    <div className="text-sm text-center mb-1 truncate">
                      {inventoryItem.item?.name || 'Unknown Item'}
                    </div>
                    
                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300/80">
                        x{inventoryItem.quantity}
                      </span>
                      {inventoryItem.item?.price && (
                        <span className="text-yellow-400">
                          ${inventoryItem.item.price}
                        </span>
                      )}
                    </div>
                    
                    {/* Category */}
                    {inventoryItem.item?.category && (
                      <div className="mt-1 text-xs text-gray-300/60 text-center capitalize">
                        {inventoryItem.item.category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/20 text-lg text-gray-100/90 text-right pr-4 py-1.5 rounded-md">
          Credits: {credits}
        </div>
      </div>
    </div>
  );
}

export default InventoryUI;
