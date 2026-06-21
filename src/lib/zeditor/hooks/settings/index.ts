import { SettingContext } from "@/lib/zeditor/context/settings/SettingContext";
import { useContext } from "react";

export const useSettings = () => useContext(SettingContext)
