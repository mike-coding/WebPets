// navigationTypes.ts

export type TopLevelPage = "main" | "mainMenu" | "profile" | "settings" | "petSummary" | "inventory" | "shop" | "minigames";
export type MainSubPage = "default" | "tutorial";
export type MainMenuSubPage = "loginRegister" | "userPass_Login" | "userPass_Register";
export type PetSummarySubPage = "main";
export type ProfileSubPage = "settings" | "friends";
export type SettingsSubPage = "volume" | "language";
export type MinigamesSubPage = "endless_runner";
export type ValidSubPage = MainMenuSubPage | MainSubPage | ProfileSubPage | SettingsSubPage | MinigamesSubPage;


export interface NavigationState {
  activePage: TopLevelPage;
  activeSubPage: MainSubPage | MainMenuSubPage | ProfileSubPage | SettingsSubPage | MinigamesSubPage | null;
  activePetId: number | null;
}
