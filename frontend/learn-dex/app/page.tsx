"use client";
import React, { useState } from "react";
import { useAppContext } from "./components/AppContext";
import Swap from "./components/Swap";
import Pools from "./components/Pools";
import CreateToken from "./components/CreateToken";
import Documentation from "./components/Documentation";

export default function Home() {
  const { activeSection } = useAppContext();

  const renderComponent = () => {
    switch (activeSection) {
      case "swap":
        return <Swap />;
      case "pools":
        return <Pools />;
      case "create-token":
        return <CreateToken />;
      case "documentation":
        return <Documentation />;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="mt-20">{renderComponent()}</div>
    </main>
  );
}
