import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TopLevelPage, ValidSubPage, NavigationState } from '../utils/NavigationTypes';


// Define types for the user data coming from the API
interface Varmint {
  id: number;
  name: string;
  level: number;
  type: string;
  abilities: string;
}

interface UserGameData {
  completed_tutorial: boolean;
  varmints: Varmint[];
}

export interface UserData {
  id: number;
  username: string;
  data: UserGameData;
}

// Define the shape of the context value
interface AppContextType {
  navigation: NavigationState;
  navigateTo: (page: TopLevelPage, subPage?: ValidSubPage | null) => void;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Navigation state
  const [navigation, setNavigation] = useState<NavigationState>({
    activePage: "mainMenu",
    activeSubPage: "loginRegister",
  });

  // Function to update navigation state
  const navigateTo = (page: TopLevelPage, subPage: ValidSubPage | null = null) => {
    setNavigation({ activePage: page, activeSubPage: subPage });
  };

  // Centralized state for user information from the API.
  // This state is expected to match the shape defined in the UserData interface.
  const [userData, setUserData] = useState<UserData | null>(null);

  const contextValue: AppContextType = {
    navigation,
    navigateTo,
    userData,
    setUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook for accessing navigation state and functions
export function useNavigationContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useNavigationContext must be used within an AppProvider");
  }
  return { navigation: context.navigation, navigateTo: context.navigateTo };
}

// Hook for accessing user data and its updater function
export function useUserDataContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useUserDataContext must be used within an AppProvider");
  }
  return { userData: context.userData, setUserData: context.setUserData };
}

