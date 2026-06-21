import { INITIAL_SETTINGS } from "@/lib/zeditor/constants/settings";
import type { SettingName } from "@/lib/zeditor/types";
import { createContext } from "react";

type SettingsContextShape = {
    setOption: (name: SettingName, value: boolean) => void;
    settings: Record<SettingName, boolean>;
};

export const SettingContext: React.Context<SettingsContextShape> = createContext({
    setOption: (name: SettingName, value: boolean) => {
        return;
    },
    settings: INITIAL_SETTINGS,
});