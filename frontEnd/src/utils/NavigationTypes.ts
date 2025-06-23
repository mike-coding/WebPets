// navigationTypes.ts
export type TopLevelPage = "main" | "mainMenu" | "profile" | "settings";
export type MainSubPage = "default" | "tutorial";
export type MainMenuSubPage = "loginRegister" | "userPass_Login" | "userPass_Register";
export type ProfileSubPage = "settings" | "pets" | "friends";
export type SettingsSubPage = "volume" | "language";
export type ValidSubPage = MainMenuSubPage | MainSubPage | ProfileSubPage | SettingsSubPage;


export interface NavigationState {
  activePage: TopLevelPage;
  activeSubPage: MainSubPage | MainMenuSubPage | ProfileSubPage | SettingsSubPage | null;
}
