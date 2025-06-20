import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Charts from "./pages/Charts";
import NotFound from "./pages/NotFound";
import AdjustIntervention from "./pages/AdjustIntervention";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import LogsActivity from "./pages/LogsActivity";
import SessionLogs from "./pages/SessionLogs";
import Calendar from "./pages/Calendar";
import Notes from "./pages/Notes";
import Goals from "./pages/Goals";
import ManageTeam from "./pages/ManageTeam";
import DeepLinkFallback from "./pages/DeepLinkFallback";

import { PublicClientApplication } from "@azure/msal-browser";
import Login from "./pages/Login";
import { msalConfig } from './lib/msalConfig';
import { useMsal, MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { ClientDataProvider } from '@/hooks/useClientData';

const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();

const MainApp = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  console.log("isAuthenticated", isAuthenticated);

  return <QueryClientProvider client={queryClient}>
    <AuthenticatedTemplate>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/logs" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logs" element={<SessionLogs />} />
            <Route path="/logs-activity" element={<LogsActivity />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/interventions" element={<AdjustIntervention />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/team" element={<ManageTeam />} />
            <Route path="/client-profile" element={<NotFound />} />
            <Route path="/therapist-profile" element={<NotFound />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clinic-settings" element={<NotFound />} />
            <Route path="/deep-link" element={<DeepLinkFallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthenticatedTemplate>
    <UnauthenticatedTemplate>
      <Login />
    </UnauthenticatedTemplate>
  </QueryClientProvider>
}

const App = () => {
  return (
    <ClientDataProvider>
      <MsalProvider instance={msalInstance}>
        <MainApp />
      </MsalProvider>
    </ClientDataProvider>
  );
};

export default App;
