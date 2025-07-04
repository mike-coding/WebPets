import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { TopLevelPage, ValidSubPage, NavigationState } from '../utils/NavigationTypes';
import React from 'react';

// Verbose flag for debug logging
const VERBOSE_DEBUG = false;

export interface Pet {
  id: number;
  evolution_id: [number, number]; // [evolution_stage, evolution_line]
  name: string;
  level: number;
  xp: number;
  hunger: number;    // between 0 and 1
  happiness: number; // between 0 and 1
  abilities: string; // stored as a comma-separated string
  createdAt: number; // timestamp in milliseconds
  lastUpdate: number; // timestamp in milliseconds for degradation tracking
}

export interface HomeObject {
  id: number;
  user_data_id: number;
  type: string; // Type of home object (e.g., 'decor', 'temporary', etc.)
  object_id: number; // ID of the specific object in the catalog
  x: number; // X position in the game world
  y: number; // Y position in the game world
}

export interface Item {
  id: number;
  name: string;
  type: string; // string for now, anyway. Make this discrete later
}

export interface InventoryItem {
  id: number;
  user_data_id: number;
  item_id: number;
  quantity: number;
}

export interface MinigameState {
  endlessRunner: {
    isGameStarted: boolean;
    isGameOver: boolean;
    isPaused: boolean;
    currentLane: number;
    score: number;
    coinsCollected: number;
  };
}

export interface UserData {
  id: number;
  username: string;
  completed_tutorial: boolean;
  money: number;
  pets: Pet[];
  home_objects: HomeObject[];
  inventory: InventoryItem[];
}

interface AppState {
  navigation: NavigationState;
  userData: UserData | null;
  minigames: MinigameState;
  navigateTo: (page: TopLevelPage, subPage?: ValidSubPage | null, activePetId?: number | null) => void;
  setUserData: (userData: UserData | null) => void;
  updateUserData: (changes: Partial<UserData>) => void;
  deleteHomeObject: (homeObjectId: number) => void;
  updateEndlessRunnerState: (changes: Partial<MinigameState['endlessRunner']>) => void;
  resetEndlessRunner: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  navigation: { activePage: "mainMenu", activeSubPage: "loginRegister", activePetId: null },
  userData: null,
  minigames: {
    endlessRunner: {
      isGameStarted: false,
      isGameOver: false,
      isPaused: false,
      currentLane: 1,
      score: 0,
      coinsCollected: 0,
    },
  },
  navigateTo: (page, subPage = null, activePetId = null) =>
    set({ navigation: { activePage: page, activeSubPage: subPage, activePetId: activePetId } }),
  setUserData: (userData) => {
    if (VERBOSE_DEBUG) console.log("setUserData in Zustand", performance.now());
    set({ userData });
  },  
  updateUserData: (changes) => {
    const { userData } = get();
    if (!userData) {
      console.error("❌ updateUserData called but userData is null!");
      return;
    }
    
    if (!userData.id) {
      console.error("❌ userData exists but id is missing:", userData);
      return;
    }
    
    const updatedUserData = { ...userData, ...changes };
    
    if (VERBOSE_DEBUG) {
      console.log("🔄 OPTIMISTIC UPDATE - Before:", userData);
      console.log("🔄 OPTIMISTIC UPDATE - Changes:", changes);
      console.log("🔄 OPTIMISTIC UPDATE - After:", updatedUserData);
      console.log("🔄 USER ID FOR REQUEST:", userData.id);
    }
    
    // Optionally perform an optimistic update:
    set({ userData: updatedUserData });

    // Use the current host's IP address but change port to 5000
    const currentHost = window.location.hostname;
    const apiUrl = `http://${currentHost}:5000/userdata/${userData.id}`;

    if (VERBOSE_DEBUG) {
      console.log("📤 SENDING TO SERVER:", JSON.stringify(updatedUserData, null, 2));
    }

    fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => res.json())
      .then((serverData) => {
        if (VERBOSE_DEBUG) {
          console.log("📥 SERVER RESPONSE:", serverData);
        }
        set({ userData: serverData });
        if (VERBOSE_DEBUG) console.log("✅ STATE UPDATED WITH SERVER DATA");
      })
      .catch((err) => {
        console.error("Error updating userData:", err);
        // Optionally revert the optimistic update here.
      });
  },
  deleteHomeObject: (homeObjectId) => {
    const { userData } = get();
    if (!userData) {
      console.error("❌ deleteHomeObject called but userData is null!");
      return;
    }
    
    if (VERBOSE_DEBUG) console.log(`🗑️ Deleting home object ${homeObjectId}`);
    
    // Optimistic update: remove from local state immediately
    const updatedHomeObjects = userData.home_objects.filter(obj => obj.id !== homeObjectId);
    const updatedUserData = { ...userData, home_objects: updatedHomeObjects };
    set({ userData: updatedUserData });
    
    // Send DELETE request to backend
    const currentHost = window.location.hostname;
    const apiUrl = `http://${currentHost}:5000/homeobject/${homeObjectId}`;
    
    fetch(apiUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        if (VERBOSE_DEBUG) console.log("✅ Home object deleted successfully:", result);
      })
      .catch((err) => {
        console.error("❌ Error deleting home object:", err);
        // Revert optimistic update on error
        set({ userData });
      });
  },
  updateEndlessRunnerState: (changes) => {
    const { minigames } = get();
    const updatedEndlessRunner = { ...minigames.endlessRunner, ...changes };
    const updatedMinigames = { ...minigames, endlessRunner: updatedEndlessRunner };
    set({ minigames: updatedMinigames });
  },
  resetEndlessRunner: () => {
    const { minigames } = get();
    const resetEndlessRunner = {
      isGameStarted: false,
      isGameOver: false,
      isPaused: false,
      currentLane: 1,
      score: 0,
      coinsCollected: 0,
    };
    const updatedMinigames = { ...minigames, endlessRunner: resetEndlessRunner };
    set({ minigames: updatedMinigames });
  },
}));

const typedUseAppStore = useAppStore as <T>(selector: (state: AppState) => T, equalityFn?: (a: T, b: T) => boolean) => T;

export const useNavigationContext = () => {
  const navigation = typedUseAppStore((state) => state.navigation, shallow);
  const navigateTo = typedUseAppStore((state) => state.navigateTo, shallow);
  return React.useMemo(() => ({ navigation, navigateTo }), [navigation, navigateTo]);
};

export const useUserDataContext = () => {
  const userData = typedUseAppStore((state) => state.userData, shallow);
  const setUserData = typedUseAppStore((state) => state.setUserData, shallow);
  const updateUserData = typedUseAppStore((state) => state.updateUserData, shallow);
  const deleteHomeObject = typedUseAppStore((state) => state.deleteHomeObject, shallow);
  return React.useMemo(
    () => ({ userData, setUserData, updateUserData, deleteHomeObject }),
    [userData, setUserData, updateUserData, deleteHomeObject]
  );
};
