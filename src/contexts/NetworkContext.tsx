"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NetworkService, NetworkStatus } from "@/services/network.service";

interface NetworkContextType {
  status: NetworkStatus;
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const networkService = new NetworkService();

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>({ connected: true });

  useEffect(() => {
    // Initial check
    networkService.getCurrentStatus().then(setStatus);

    // Subscribe to changes
    const unsubscribe = networkService.onStatusChange(setStatus);

    return unsubscribe;
  }, []);

  const value: NetworkContextType = {
    status,
    isOnline: status.connected,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
