// navigationTypes.ts
export type TopLevelPage = "main" | "mainMenu" | "profile" | "settings";
export type MainMenuSubPage = "loginRegister" | "userPass_Login" | "userPass_Register";
export type ProfileSubPage = "settings" | "pets" | "friends";
export type SettingsSubPage = "volume" | "language";

export interface NavigationState {
  activePage: TopLevelPage;
  activeSubPage: MainMenuSubPage | ProfileSubPage | SettingsSubPage | null;
}
