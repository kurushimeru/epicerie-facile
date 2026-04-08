"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { storage } from "@/utils/localStorage";

interface AppContextValue {
  searchTags: string[];
  setSearchTags: (tags: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  radius: number;
  setRadius: (r: number) => void;
  hasAccount: boolean;
  refreshAccount: () => void;
  locationVersion: number;
  bumpLocationVersion: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchTags, setSearchTagsState] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [postalCode, setPostalCodeState] = useState("");
  const [radius, setRadiusState] = useState(10);
  const [hasAccount, setHasAccount] = useState(false);
  const [locationVersion, setLocationVersion] = useState(0);

  useEffect(() => {
    setSearchTagsState(storage.getSearchTags());
    setPostalCodeState(storage.getPostalCode());
    setRadiusState(storage.getRadius());
    setHasAccount(storage.getUserAccount() !== null);
  }, []);

  const setSearchTags = useCallback((tags: string[]) => {
    setSearchTagsState(tags);
    storage.setSearchTags(tags);
  }, []);

  const setPostalCode = useCallback((code: string) => {
    setPostalCodeState(code);
    storage.setPostalCode(code);
  }, []);

  const setRadius = useCallback((r: number) => {
    setRadiusState(r);
    storage.setRadius(r);
  }, []);

  const refreshAccount = useCallback(() => {
    setHasAccount(storage.getUserAccount() !== null);
  }, []);

  const bumpLocationVersion = useCallback(() => {
    setLocationVersion((v) => v + 1);
  }, []);

  return (
    <AppContext.Provider
      value={{
        searchTags, setSearchTags,
        selectedCategories, setSelectedCategories,
        postalCode, setPostalCode,
        radius, setRadius,
        hasAccount, refreshAccount,
        locationVersion, bumpLocationVersion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
