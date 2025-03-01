import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TopLevelPage, MainMenuSubPage, ProfileSubPage, SettingsSubPage, NavigationState } from '../utils/NavigationTypes';

type ValidSubPage = MainMenuSubPage | ProfileSubPage | SettingsSubPage;

// Define the shape of the context value
interface AppContextType {
  navigation: NavigationState;
  navigateTo: (page: TopLevelPage, subPage?: ValidSubPage | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Centralize the navigation state here in the provider
  const [navigation, setNavigation] = useState<NavigationState>({
    activePage: "mainMenu",
    activeSubPage: "loginRegister",
  });

  // Function to update the navigation state
  const navigateTo = (page: TopLevelPage, subPage: ValidSubPage | null = null) => {
    setNavigation({ activePage: page, activeSubPage: subPage });
  };

  const contextValue: AppContextType = {
    navigation,
    navigateTo,
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
