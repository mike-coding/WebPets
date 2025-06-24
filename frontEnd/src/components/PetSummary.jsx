import React, { useState, useEffect } from 'react';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import IconButton from './IconButton';

function PetSummary() {
  const { navigation, navigateTo } = useNavigationContext();
  const { userData, updatePetData } = useUserDataContext();
  
  // Get the current pet data from the main pets array using the ID
  const pet = userData?.pets.find(p => p.id === navigation.activePetId);
  const [petName, setPetName] = useState(pet?.name || '');
  
  // Update local state when pet data changes
  useEffect(() => {
    if (pet) {
      setPetName(pet.name);
    }
  }, [pet?.name]);
  
  const goBack = () => {
    navigateTo("main", "default");
  };

  const handleNameChange = (newName) => {
    setPetName(newName);
    if (pet && pet.id !== undefined) {
      updatePetData(pet.id, { name: newName });
    }
  };

  if (!pet) {
    goBack();
    return null;
  }  return (
    <div className="w-full h-full flex flex-col justify-center pointer-events-auto p-4 text-white font-m6x11">
      <div className="bg-gray-900/30 rounded-lg p-4 space-y-3">        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={petName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="text-white font-m6x11 text-2xl bg-transparent border-b border-gray-600 focus:border-white outline-none transition-colors duration-200"
            maxLength={20}
          />
          <div onClick={goBack}>
            <IconButton iconName='exitIcon'/>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Level</div>
              <div className="text-lg">{pet.level}</div>
            </div>
              <div>
              <div className="text-sm text-gray-400">XP</div>
              <div className="text-lg mb-1">{pet.xp}/100</div>
              <div className="w-full bg-gray-800/50 rounded-sm h-4">
                <div 
                  className="bg-blue-500 h-2 rounded-sm transition-all duration-300" 
                  style={{ width: `${Math.min((pet.xp / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400">Hunger</div>
              <div className="text-lg mb-1">{Math.round(pet.hunger * 100)}%</div>
              <div className="w-full bg-gray-800/50 rounded-sm h-4">
                <div 
                  className="bg-green-500 h-4 rounded-sm transition-all duration-300" 
                  style={{ width: `${Math.round(pet.hunger * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400">Happiness</div>
              <div className="text-lg">{pet.happiness}/5</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-400">Evolution</div>
            <div className="text-lg">{pet.evolution_id[0]}-{pet.evolution_id[1]}</div>
          </div>          
          {pet.abilities && (
            <div className="mt-4">
              <div className="text-sm text-gray-400">Abilities</div>
              <div className="text-lg">{pet.abilities}</div>
            </div>
          )}
        </div>
    </div>
  );
}

export default PetSummary;
