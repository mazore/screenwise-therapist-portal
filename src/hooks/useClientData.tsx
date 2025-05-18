import React, { createContext, useContext, useState, ReactNode } from "react";

export type ClientData = any; // <-- replace with your real type

interface ClientDataContextValue {
  clientData: ClientData | null;
  setClientData: React.Dispatch<React.SetStateAction<ClientData | null>>;
}

const ClientDataContext = createContext<ClientDataContextValue | undefined>(undefined);

export const ClientDataProvider = ({ children }: { children: ReactNode }) => {
  const [clientData, setClientData] = useState<ClientData | null>(null);

  return (
    <ClientDataContext.Provider value={{ clientData, setClientData }}>
      {children}
    </ClientDataContext.Provider>
  );
};

export const useClientData = (): ClientDataContextValue => {
  const ctx = useContext(ClientDataContext);
  if (!ctx) throw new Error("useClientData must be used within ClientDataProvider");
  return ctx;
};
