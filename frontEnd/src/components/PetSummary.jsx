import React, { useState, useEffect } from 'react';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import IconButton from './IconButton';

// Utility function to calculate pet age in the requested format
const calculateAge = (createdAt) => {
  if (!createdAt) return '0m';
  
  const now = Date.now();
  const ageMs = now - createdAt;
  const ageMinutes = Math.floor(ageMs / (1000 * 60));
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  
  if (ageMinutes < 60) {
    return `${ageMinutes}m`;
  } else if (ageHours < 24) {
    return `${ageHours}h`;
  } else {
    return `${ageDays}d`;
  }
};

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
    // Only update local state immediately, save to DB on blur
  };

  const handleNameBlur = () => {
    if (pet && pet.id !== undefined && petName !== pet.name) {
      updatePetData(pet.id, { name: petName });
    }
  };

  if (!pet) {
    goBack();
    return null;
  }  return (
    <div className="w-full h-full flex flex-col justify-center pointer-events-auto p-4 text-white font-m6x11 ">
      <div className="bg-gray-300/10 rounded-lg p-4 backdrop-blur-xs shadow-xl">        
        <div className="flex justify-between items-center mb-4">          
          <input
            type="text"
            value={petName}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            className="text-white font-m6x11 text-2xl bg-gray-900/30 px-3 py-2.5 pt-3 rounded-sm border-gray-600 outline-none transition-colors duration-200 shadow-md"
            maxLength={20}
          />
          <div onClick={goBack}>
            <IconButton iconName='exitIcon' withEffects={false} />
          </div>
        </div>
          <div className="grid grid-rows gap-4">
          {/* Level and XP Row */}
          <div className="flex flex-row w-full items-center justify-center gap-2">
            <div className="flex flex-row w-1/4 items-center justify-center px-5 bg-gray-900/30 rounded-sm h-full shadow-md">
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                <div className="text-lg text-gray-300/80 h-full flex flex-row items-center h-full">LVL</div>
                <div className="text-lg bg-gray-900/30 px-3 rounded-sm flex flex-row items-center my-2">{pet.level}</div>
              </div>
            </div>
            <div className="w-3/4 pl-2 h-full flex flex-row items-center">
              <div className="w-full bg-gray-900/30 rounded-sm h-full flex px-2 flex-row justify-start items-center gap-2 shadow-md">
                <div className="text-lg text-gray-300/80">XP</div>
                <div className="flex flex-row items-center bg-gray-900/20 rounded-sm w-full">
                  <div 
                    className="bg-blue-400/80 rounded-sm transition-all duration-300" 
                    style={{ width: `${Math.min((pet.xp+2 / 100) * 100, 100)}%` }}
                  >
                    <div className="text-lg pl-2 flex flex-row items-center h-full">{pet.xp}/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution and Age Row */}
          <div className="flex flex-row w-full items-center justify-center gap-2">
            <div className="flex flex-row w-1/2 items-center justify-center px-5 bg-gray-900/30 rounded-sm h-full shadow-md">
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                <div className="text-lg text-gray-300/80 h-full flex flex-row items-center h-full">EVOL</div>
                <div className="text-lg bg-gray-900/30 px-3 rounded-sm flex flex-row items-center my-2">{pet.evolution_id[0]}-{pet.evolution_id[1]}</div>
              </div>
            </div>
            <div className="flex flex-row w-1/2 items-center justify-center px-5 bg-gray-900/30 rounded-sm h-full shadow-md">
              <div className="flex flex-row gap-2 items-center justify-center h-full">
                <div className="text-lg text-gray-300/80 h-full flex flex-row items-center h-full">AGE</div>
                <div className="text-lg bg-gray-900/30 px-3 rounded-sm flex flex-row items-center my-2">{calculateAge(pet.createdAt)}</div>
              </div>
            </div>
          </div>          
          {/* Hunger Row */}
          <div className="w-full flex h-full flex-row items-center">
            <div className="w-full bg-gray-900/30 rounded-sm h-full flex p-2 flex-row justify-start items-center gap-2 shadow-md">
              <div className="text-lg text-gray-300/80">HUNGER</div>
              <div className="flex flex-row items-center bg-gray-900/20 rounded-sm w-full">
                <div 
                  className="bg-green-500/80 rounded-sm transition-all duration-300" 
                  style={{ width: `${Math.round(pet.hunger * 100)}%` }}
                >
                  <div className="text-lg pl-2 flex flex-row items-center h-full">{Math.round(pet.hunger * 100)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Happiness Row */}
          <div className="w-full flex flex-row items-center">
            <div className="w-full bg-gray-900/30 rounded-sm h-full flex p-2 flex-row justify-start items-center gap-2 shadow-md">
              <div className="text-lg text-gray-300/80">HAPPY</div>
              <div className="flex flex-row items-center bg-gray-900/20 rounded-sm w-full">
                <div 
                  className="bg-yellow-500/80 rounded-sm transition-all duration-300" 
                  style={{ width: `${Math.round(pet.happiness * 100)}%` }}
                >
                  <div className="text-lg pl-2 flex flex-row items-center h-full">{Math.round(pet.happiness * 100)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Abilities Row */}
          {pet.abilities && pet.abilities.length > 0 && (
            <div className="w-full flex flex-col items-start px-4 py-3 bg-gray-900/30 rounded-sm shadow-md">
              <div className="text-sm text-gray-300/80 uppercase tracking-wide mb-2">Abilities</div>
              <div className="text-lg">{Array.isArray(pet.abilities) ? pet.abilities.join(", ") : pet.abilities}</div>
            </div>
          )}
        </div>
        </div>
    </div>
  );
}

export default PetSummary;
