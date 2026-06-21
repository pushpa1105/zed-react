import { DEFAULT_SETTINGS, INITIAL_SETTINGS } from "@/lib/zeditor/constants";
import { SettingContext } from "@/lib/zeditor/context/settings/SettingContext";
import type { SettingName } from "@/lib/zeditor/types";
import { useCallback, useMemo, useState, type JSX, type ReactNode } from "react";

export const SettingsProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const [settings, setSettings] = useState(INITIAL_SETTINGS);

    const setOption = useCallback((setting: SettingName, value: boolean) => {
        setSettings(options => ({
            ...options,
            [setting]: value,
        }));
        setURLParam(setting, value);
    }, []);

    const contextValue = useMemo(() => {
        return { setOption, settings };
    }, [setOption, settings]);

    return <SettingContext.Provider value={contextValue}>{children}</SettingContext.Provider>;
};

function setURLParam(param: SettingName, value: null | boolean) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (value !== DEFAULT_SETTINGS[param]) {
        params.set(param, String(value));
    } else {
        params.delete(param);
    }
    url.search = params.toString();
    window.history.pushState(null, '', url.toString());
}
