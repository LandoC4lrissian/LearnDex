"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Context
const AppContext = createContext({ activeSection: "", handleSectionChange: (section: string) => {} });

// Context Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("swap");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <AppContext.Provider value={{ activeSection, handleSectionChange }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for using AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
