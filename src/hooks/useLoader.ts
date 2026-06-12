import { LoaderContext } from "@/context/loader/LoaderContext";
import { useContext } from "react";

export const useLoader = () => useContext(LoaderContext)