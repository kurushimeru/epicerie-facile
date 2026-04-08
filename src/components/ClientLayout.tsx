"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AppProvider, useAppContext } from "@/context/app-context";
import { Header } from "@/components/Header";
import { GeolocationModal } from "@/components/GeolocationModal";
import { Toaster } from "@/components/ui/sonner";

function LayoutInner({ children }: { children: ReactNode }) {
  const {
    searchTags, setSearchTags,
    postalCode, setPostalCode,
    radius, setRadius,
    hasAccount,
    bumpLocationVersion,
  } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTags={searchTags}
        onSearchTagsChange={setSearchTags}
        postalCode={postalCode}
        onPostalCodeChange={setPostalCode}
        radius={radius}
        onRadiusChange={setRadius}
        hasAccount={hasAccount}
      />
      <GeolocationModal onLocationReceived={bumpLocationVersion} />
      {children}
      <Toaster />
    </div>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppProvider>
        <LayoutInner>{children}</LayoutInner>
      </AppProvider>
    </ThemeProvider>
  );
}
