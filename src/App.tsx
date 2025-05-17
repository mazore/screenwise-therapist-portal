import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Charts from "./pages/Charts";
import NotFound from "./pages/NotFound";
import AdjustIntervention from "./pages/AdjustIntervention";
import Dashboard from "./pages/Dashboard";
import LogsActivity from "./pages/LogsActivity";
import SessionLogs from "./pages/SessionLogs";
import Calendar from "./pages/Calendar";
import Notes from "./pages/Notes";
import Goals from "./pages/Goals";
import ManageTeam from "./pages/ManageTeam";

import { PublicClientApplication } from "@azure/msal-browser";
import Login from "./pages/Login";
import { msalConfig } from './lib/msalConfig';
import { useMsal, MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";

const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();

// const ProfileContent = () => {
//     const { instance, accounts } = useMsal();
//     // const [graphData, setGraphData] = React.useState(null);

//     function RequestProfileData() {
//         // Silently acquires an access token which is then attached to a request for MS Graph data
//         instance
//             .acquireTokenSilent({
//                 scopes: ['openid', 'profile'],//["https://graph.microsoft.com/User.Read"],
//                 account: accounts[0],
//             })
//             .then((response) => {
//                 console.log('response', response);
//                 // callMsGraph(response.accessToken).then((response) => setGraphData(response));
//             });
//     }

//     // console.log("graphData", graphData);

//     return (
//         <>
//             <h5 className="profileContent">Welcome {accounts[0].name}</h5>
//             {/* {false ? (
//                 // <ProfileData graphData={graphData} />
//                 <p>Profile data loaded</p>
//             ) : ( */}
//                 {/* // <Button variant="secondary" onClick={RequestProfileData}> */}
//                   <button
//                     className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                     onClick={RequestProfileData}
//                   >
//                     Request Profile
//                   </button>
//             {/* )} */}
//         </>
//     );
// };

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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
            <Route path="/clients" element={<NotFound />} />
            <Route path="/clinic-settings" element={<NotFound />} />
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
  // return (
  //   <MsalProvider instance={msalInstance}>
  // <PageLayout>
  //   <div className="App">
  //         <AuthenticatedTemplate>
  //             <ProfileContent />
  //         </AuthenticatedTemplate>

  //         <UnauthenticatedTemplate>
  //             <h5 className="card-title">Please sign-in to see your profile information.</h5>
  //         </UnauthenticatedTemplate>
  //     </div>;
  //   </PageLayout>
  // </MsalProvider>;
  return (
    <MsalProvider instance={msalInstance}>
      <MainApp />
    </MsalProvider>
  );
};

export default App;
