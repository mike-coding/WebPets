import React from 'react';
import { useNavigationContext, useUserDataContext } from '../hooks/AppContext';
import IconButton from './IconButton';

// Utility function to calculate pet age
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

function PartyView() {
  const { navigateTo } = useNavigationContext();
  const { userData } = useUserDataContext();

  const goBack = () => {
    navigateTo("main", "default");
  };

  const viewPet = (petId) => {
    navigateTo("petSummary", null, petId);
  };

  const pets = userData?.pets || [];

  return (
    <div className="w-full h-full flex flex-col justify-center pointer-events-auto p-4 text-white font-m6x11">
      <div className="bg-gray-300/10 rounded-lg p-4 backdrop-blur-xs shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-4xl text-gray-100/90 pt-3">
            Pets
          </div>
          <div onClick={goBack}>
            <IconButton iconName='exitIcon' withEffects={false} />
          </div>
        </div>

        {/* Content */}
        <div className="w-full gap-2 flex flex-col items-center justify-center">
          <div className="w-full h-1.5 bg-gray-100/60 rounded-xs"/>
          <div className="Spacer h-0.25"/>
          
          {pets.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-8 text-center">
              <div className="text-lg text-gray-300/80 mb-2">No Pets</div>
              <div className="text-sm text-gray-300/60">
                Hatch an egg to get your first pet!
              </div>
            </div>
          ) : (
            <div className="w-full max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pets.map((pet) => (
                    <div key={pet.id} onClick={() => viewPet(pet.id)} className="bg-gray-900/30 rounded-md flex flex-row w-full">
                    <div className="relative">
                      <img 
                            src={`/src/sprites/pets/${pet.evolution_id[0]}/${pet.evolution_id[1]}/F_0.png`}
                            alt={pet.name}
                            className="h-25 w-25 bg-gray-700/50 rounded-l-md"
                            style={{ imageRendering: "pixelated" }}
                            onError={(e) => {e.target.style.display = 'none';}}
                      />
                      <div className="absolute top-1 left-1 bg-gray-800/80 text-lg px-2.5 rounded text-gray-100">
                        {pet.level}
                      </div>
                    </div>
                    <div className="flex items-center p-3">
                      {/* Pet Info */}
                      <div className="flex-1 w-full h-full">
                        {/* Name */}
                        <div className="mb-2">
                          <div className="text-3xl font-bold truncate">
                            {pet.name || 'Unnamed Pet'}
                          </div>
                        </div>
                        
                        {/* Age and Dex ID */}
                        <div className="flex justify-between items-center text-sm text-gray-300/80">
                          <div>
                            {calculateAge(pet.createdAt)}
                          </div>
                          <div>
                            #{pet.evolution_id[1]}-{pet.evolution_id[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartyView;