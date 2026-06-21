import type { DEFAULT_SETTINGS, INITIAL_SETTINGS } from "@/lib/zeditor/constants/settings";

export type SettingName = keyof typeof DEFAULT_SETTINGS;

export type Settings = typeof INITIAL_SETTINGS;