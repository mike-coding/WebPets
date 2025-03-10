import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TopLevelPage, ValidSubPage, NavigationState } from '../utils/NavigationTypes';

interface Varmint {
  id: number;
  name: string;
  level: number;
  type: string;
  abilities: string;
}

// Consolidated interface.
export interface UserData {
  id: number;
  username: string;
  completed_tutorial: boolean;
  varmints: Varmint[];
}

interface AppContextType {
  navigation: NavigationState;
  navigateTo: (page: TopLevelPage, subPage?: ValidSubPage | null) => void;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  updateUserData: (changes: Partial<UserData>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationState>({
    activePage: "mainMenu",
    activeSubPage: "loginRegister",
  });

  const navigateTo = (page: TopLevelPage, subPage: ValidSubPage | null = null) => {
    setNavigation({ activePage: page, activeSubPage: subPage });
  };

  const [userData, setUserData] = useState<UserData | null>(null);

  const updateUserData = (changes: Partial<UserData>) => {
    if (!userData) return;
    // Merge changes into userData optimistically.
    const updatedUserData = { ...userData, ...changes };
    setUserData(updatedUserData);

    // Send the changes to the API.
    fetch(`http://localhost:5000/userdata/${userData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => res.json())
      .then((serverData) => {
        // Update context with server response.
        setUserData(serverData);
      })
      .catch((err) => {
        console.error("Error updating userData:", err);
        // Optionally revert the optimistic update here.
      });
  };

  const contextValue: AppContextType = {
    navigation,
    navigateTo,
    userData,
    setUserData,
    updateUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export function useNavigationContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useNavigationContext must be used within an AppProvider");
  }
  return { navigation: context.navigation, navigateTo: context.navigateTo };
}

export function useUserDataContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useUserDataContext must be used within an AppProvider");
  }
  return {
    userData: context.userData,
    setUserData: context.setUserData,
    updateUserData: context.updateUserData,
  };
}



