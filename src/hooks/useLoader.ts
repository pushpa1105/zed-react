import { LoaderContext } from "@/context/loader.tsx/LoaderContext";
import { useContext } from "react";

export const useLoader = () => useContext(LoaderContext)