import React, { useState } from 'react';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import IconButton from './IconButton';

function ShopUI() {
    const { navigateTo } = useNavigationContext();
    const { userData } = useUserDataContext();
    const [selectedCategory, setSelectedCategory] = useState('items');

    const shopItems = {
        items: [
            { id: 1, name: 'Basic Food', price: 10, description: 'Keeps your pet happy', icon: '🍎' },
            { id: 2, name: 'Premium Food', price: 25, description: 'Luxury pet nutrition', icon: '🥩' },
            { id: 3, name: 'Toy Ball', price: 15, description: 'Entertainment for your pet', icon: '⚽' },
            { id: 4, name: 'Grooming Kit', price: 30, description: 'Keep your pet clean', icon: '🧼' },
        ],
        decorations: [
            { id: 5, name: 'Flower Bed', price: 50, description: 'Beautiful garden decoration', icon: '🌸' },
            { id: 6, name: 'Water Fountain', price: 100, description: 'Elegant water feature', icon: '⛲' },
            { id: 7, name: 'Garden Gnome', price: 35, description: 'Quirky lawn ornament', icon: '🎭' },
            { id: 8, name: 'Wooden Bench', price: 75, description: 'Comfortable seating', icon: '🪑' },
        ]
    };

    const handlePurchase = (item) => {
        if (userData.money >= item.price) {
            // TODO: Implement purchase logic
            console.log(`Purchasing ${item.name} for ${item.price} coins`);
        } else {
            console.log('Not enough money!');
        }
    };

    const closeShop = () => {
        navigateTo("main", "default");
    };

    return (
        <div className="w-full h-full flex flex-col justify-center pointer-events-auto p-4 text-white font-m6x11 bg-black/40">
            <div className="bg-gray-300/10 rounded-lg p-4 backdrop-blur-xs backdrop-brightness-140 shadow-xl">
                {/* Header */}
                <div className="flex flex-row justify-between items-center mb-4">
                    <div className="text-4xl text-gray-100/90 flex flex-row pt-3">
                        Shop
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-lg text-yellow-400 bg-gray-900/30 px-3 py-2 rounded-sm shadow-md">
                            💰 {userData?.money || 0}
                        </div>
                        <div onClick={closeShop}>
                            <IconButton iconName='exitIcon' withEffects={false} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full gap-2 flex flex-col items-center justify-center">
                    <div className="w-full h-1.5 bg-gray-100/60 rounded-xs"/>
                    <div className="Spacer h-0.25"/>

                    {/* Category Tabs */}
                    <div className="flex flex-row w-full items-center justify-center gap-2 mb-4">
                        <div
                            onClick={() => setSelectedCategory('items')}
                            className={`flex flex-row w-1/2 items-center justify-center rounded-sm h-full shadow-md transition-colors cursor-pointer ${
                                selectedCategory === 'items' 
                                    ? 'bg-blue-400/80 text-white' 
                                    : 'bg-gray-900/30 text-gray-300/80 hover:bg-gray-900/40'
                            }`}
                        >
                            <div className="text-lg py-2">ITEMS</div>
                        </div>
                        <div
                            onClick={() => setSelectedCategory('decorations')}
                            className={`flex flex-row w-1/2 items-center justify-center rounded-sm h-full shadow-md transition-colors cursor-pointer ${
                                selectedCategory === 'decorations' 
                                    ? 'bg-blue-400/80 text-white' 
                                    : 'bg-gray-900/30 text-gray-300/80 hover:bg-gray-900/40'
                            }`}
                        >
                            <div className="text-lg py-2">DECORATIONS</div>
                        </div>
                    </div>

                    {/* Shop Items Grid */}
                    <div className="w-full max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {shopItems[selectedCategory].map(item => (
                                <div 
                                    key={item.id} 
                                    className="bg-gray-900/30 rounded-sm p-3 backdrop-blur-xs shadow-md hover:bg-gray-800/40 transition-colors"
                                >
                                    {/* Item Icon */}
                                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-sm flex items-center justify-center">
                                        <span className="text-2xl">
                                            {item.icon}
                                        </span>
                                    </div>
                                    
                                    {/* Item Name */}
                                    <div className="text-sm text-center mb-1 truncate text-gray-100/90">
                                        {item.name}
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="text-xs text-center mb-2 text-gray-300/60">
                                        {item.description}
                                    </div>
                                    
                                    {/* Price and Buy Button */}
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm text-center text-yellow-400">
                                            💰 {item.price}
                                        </div>
                                        <div
                                            onClick={() => handlePurchase(item)}
                                            className={`px-2 py-1 rounded-sm text-sm transition-colors shadow-md text-center ${
                                                userData?.money >= item.price
                                                    ? 'bg-green-500/80 hover:bg-green-500/90 text-white cursor-pointer'
                                                    : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {userData?.money >= item.price ? 'BUY' : 'TOO POOR'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-black/20 text-sm text-gray-300/60 text-center py-2 rounded-md mt-4">
                    Play minigames to earn more coins!
                </div>
            </div>
        </div>
    );
}

export default ShopUI;
