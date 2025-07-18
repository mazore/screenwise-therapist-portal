/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode } from "react";

export type ClientData = any; // <-- replace with your real type
export type TherapistData = any; // <-- replace with your real type

interface ClientDataContextValue {
  clientData: ClientData | null;
  setClientData: React.Dispatch<React.SetStateAction<ClientData | null>>;
  therapistData: TherapistData | null; // <-- replace with your real type
  setTherapistData: React.Dispatch<React.SetStateAction<TherapistData | null>>;
  selectedClient: string | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<string | null>>;
  lastSyncedAt: number | null;
  lastSyncedNow: () => void;
  allClients: any | null; // Add this
  setAllClients: React.Dispatch<React.SetStateAction<any | null>>; // Add this
}

const ClientDataContext = createContext<ClientDataContextValue | undefined>(undefined);

export const ClientDataProvider = ({ children }: { children: ReactNode }) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [therapistData, setTherapistData] = useState(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(() => {
      return localStorage.getItem('selectedClient');
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [allClients, setAllClients] = useState<any | null>(null); // Add this

  return (
    <ClientDataContext.Provider value={{
      clientData, setClientData,
      therapistData, setTherapistData,
      selectedClient, setSelectedClient,
      lastSyncedAt, lastSyncedNow: () => {
        setLastSyncedAt(Date.now());
      },
      allClients, setAllClients // Provide these
    }}>
      {children}
    </ClientDataContext.Provider>
  );
};

export const useClientData = (): ClientDataContextValue => {
  const ctx = useContext(ClientDataContext);
  if (!ctx) throw new Error("useClientData must be used within ClientDataProvider");
  return ctx;
};

export const useTherapistData = () => {
  const { therapistData } = useClientData();
  return therapistData;
};
