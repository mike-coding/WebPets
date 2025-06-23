import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { TopLevelPage, ValidSubPage, NavigationState } from '../utils/NavigationTypes';
import React from 'react';

interface Pet {
  id: number;
  evolution_id: [number, number]; // [evolution_stage, evolution_line]
  name: string;
  level: number;
  xp: number;
  hunger: number;    // between 0 and 1
  happiness: number; // max 5
  abilities: string; // stored as a comma-separated string
}

interface Item {
  id: number;
  name: string;
  type: string; // string for now, anyway. Make this discrete later
  
}

export interface UserData {
  id: number;
  username: string;
  completed_tutorial: boolean;
  pets: Pet[];
}

interface AppState {
  navigation: NavigationState;
  userData: UserData | null;
  navigateTo: (page: TopLevelPage, subPage?: ValidSubPage | null) => void;
  setUserData: (userData: UserData | null) => void;
  updateUserData: (changes: Partial<UserData>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  navigation: { activePage: "mainMenu", activeSubPage: "loginRegister" },
  userData: null,
  navigateTo: (page, subPage = null) =>
    set({ navigation: { activePage: page, activeSubPage: subPage } }),
  setUserData: (userData) => {
    console.log("setUserData in Zustand", performance.now());
    set({ userData });
  },  updateUserData: (changes) => {
    const { userData } = get();
    if (!userData) return;
    const updatedUserData = { ...userData, ...changes };
    // Optionally perform an optimistic update:
    set({ userData: updatedUserData });

    // Use the current host's IP address but change port to 5000
    const currentHost = window.location.hostname;
    const apiUrl = `http://${currentHost}:5000/userdata/${userData.id}`;

    fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => res.json())
      .then((serverData) => set({ userData: serverData }))
      .catch((err) => {
        console.error("Error updating userData:", err);
        // Optionally revert the optimistic update here.
      });
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
  return React.useMemo(
    () => ({ userData, setUserData, updateUserData }),
    [userData, setUserData, updateUserData]
  );
};
