import { useLocalStorage } from "./use-local-storage";

export type AppSettings = {
  timeFormat: "12h" | "24h";
  weekStart: "sunday" | "monday";
  soundEnabled: boolean;
  privacyBlur: boolean;
  notificationsEnabled: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  timeFormat: "12h",
  weekStart: "sunday",
  soundEnabled: true,
  privacyBlur: false,
  notificationsEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>("petal-settings", DEFAULT_SETTINGS);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, setSettings, updateSetting };
}
