import React, { useState, useEffect } from "react";
import { Home, BarChart3, Target, RefreshCw, Users, UserRound, Settings, User, Building, Search, Menu, Calendar,
// Add this import
StickyNote // Add this import
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClientData } from "@/hooks/useClientData";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { API_URL } from "@/lib/constants";
import ErrorBoundary from "@/lib/errorBoundary";

interface TherapyLayoutProps {
  children: React.ReactNode;
}
export const TherapyLayout = ({
  children
}: TherapyLayoutProps) => {
  // Backend connection stuff
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();
  const {
    clientData, setClientData,
    therapistData, setTherapistData,
    selectedClient, setSelectedClient,
    lastSyncedAt, lastSyncedNow
  } = useClientData();

  const [, forceUpdate] = useState<number>(0);
  useEffect(() => {  // incrementing a dummy state causes the component to re-render
    const id = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 60_000);  // every 60 seconds
    return () => clearInterval(id);
  }, []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadTherapistData = () => {
      instance.acquireTokenSilent({scopes: ['openid', 'profile'], account: accounts[0]})
        .then((tokenResponse) => {
          return fetch(API_URL + 'get_therapist_data', {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + tokenResponse.idToken},
          })
        })
        .then((apiResponse) => apiResponse.json())
        .then((data) => {
          // console.log("Got therapist data", data);
          setTherapistData(data.therapistData);
          setLoading(false);
        })
        .catch((error) => {
          instance.acquireTokenRedirect({scopes: ['openid', 'profile']});
          console.error('There was a problem with the fetch operation:', error);
        });
    };
    loadTherapistData();
  }, [accounts, instance, setTherapistData]); // Runs on refresh

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (selectedClient && therapistData) {
      console.log('debug1', selectedClient, therapistData);
      localStorage.setItem('selectedClient', selectedClient);
      fetch(API_URL + 'get_therapist_client', {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + accounts[0].idToken},
        body: JSON.stringify({
          clientProfile: selectedClient,
          clientUserId: therapistData.clients[selectedClient].userId,
        })
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("Got client data", data);
          setClientData(data);
          lastSyncedNow();
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      localStorage.removeItem('selectedClient');
      setClientData(null);
    }
  }, [selectedClient, accounts, setClientData, therapistData]); // Runs on changing selectedClient
  // const childrenWithProps = React.Children.map(children, child => {
  //   if (React.isValidElement(child)) {
  //     return React.cloneElement(child, {
  //       selectedClient
  //     } as Partial<unknown>);
  //   }
  //   return child;
  // });
  const clientTools = [{
    title: "Logs Activity",
    icon: Home,
    href: "/logs"
  },
  // {
  //   title: "Charts and Graphs",
  //   icon: BarChart3,
  //   href: "/charts"
  // },
  // {
  //   title: "Set Goals",
  //   icon: Target,
  //   href: "/goals"
  // },
  {
    title: "Adjust Intervention",
    icon: RefreshCw,
    href: "/interventions"
  },
  // {
  //   title: "Calendar",
  //   icon: Calendar,
  //   href: "/calendar"
  // },
  // {
  //   title: "Notes",
  //   icon: StickyNote,
  //   href: "/notes"
  // },
  // {
  //   title: "Manage Team",
  //   icon: Users,
  //   href: "/team"
  // },
  // {
  //   title: "Client Profile",
  //   icon: UserRound,
  //   href: "/client-profile"
  // }
  ];
  const generalSettings = [
  //   {
  //   title: "Therapist Profile",
  //   icon: User,
  //   href: "/therapist-profile"
  // },
  {
    title: "Manage Clients",
    icon: Users,
    href: "/clients"
  },
  // {
  //   title: "Clinic Settings",
  //   icon: Building,
  //   href: "/clinic-settings"
  // }
  ];
  const isCurrentPath = (path: string) => window.location.pathname === path;
  const isClientSpecificPage = () => {
    const clientSpecificRoutes = ['/logs', '/charts', '/goals', '/interventions', '/team', '/client-profile'];
    return clientSpecificRoutes.includes(window.location.pathname);
  };

  return <div className="flex h-screen w-full overflow-hidden">
      <div className={cn("h-screen border-r bg-white transition-all duration-300 flex flex-col", collapsed ? "w-[70px]" : "w-[250px]")}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!collapsed && <h1 className="text-lg font-bold text-therapy-blue">ScreenwiseEating</h1>}
          {collapsed && <div className="w-full flex justify-center">
              <span className="text-xl font-bold text-therapy-blue">SE</span>
            </div>}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {/* <div className="px-3">
              <Link to="/dashboard">
                <Button variant="ghost" className={cn("w-full justify-start", isCurrentPath("/dashboard") && "bg-muted font-medium")}>
                  <Home className={cn("h-5 w-5", collapsed && "mx-auto", isCurrentPath("/dashboard") && "text-primary")} />
                  {!collapsed && <span className="ml-2">Home Dashboard</span>}
                </Button>
              </Link>
            </div> */}

            <div className="px-4">
              {!collapsed && <h3 className="mb-2 text-sm font-medium text-muted-foreground">Client Tools</h3>}
              <nav className="space-y-1">
                {clientTools.map(item => <TooltipProvider key={item.title} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={item.href}>
                          <Button variant="ghost" className={cn("w-full justify-start", isCurrentPath(item.href) && "bg-muted font-medium")}>
                            <item.icon className={cn("h-5 w-5", collapsed && "mx-auto", isCurrentPath(item.href) && "text-primary")} />
                            {!collapsed && <span className="ml-2">{item.title}</span>}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>)}
              </nav>
            </div>

            <Separator className="my-2" />

            <div className="px-4">
              {!collapsed && <h3 className="mb-2 text-sm font-medium text-muted-foreground">General Settings</h3>}
              <nav className="space-y-1">
                {generalSettings.map(item => <TooltipProvider key={item.title} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={item.href}>
                          <Button variant="ghost" className={cn("w-full justify-start", isCurrentPath(item.href) && "bg-muted font-medium")}>
                            <item.icon className={cn("h-5 w-5", collapsed && "mx-auto", isCurrentPath(item.href) && "text-primary")} />
                            {!collapsed && <span className="ml-2">{item.title}</span>}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>)}
              </nav>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="w-full flex justify-center">
            {collapsed ? <MenuRight className="h-5 w-5" /> : <MenuLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={selectedClient || "no-client"} onValueChange={value => setSelectedClient(value === "no-client" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <UserRound className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select client" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-client">No client selected</SelectItem>
                  {therapistData && Object.keys(therapistData.clients).map(
                    (clientName) => <SelectItem key={clientName} value={clientName}>
                      {clientName}
                    </SelectItem>)
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">

              </div>

              {lastSyncedAt && <div className="text-xs text-muted-foreground hidden md:block">
                Last synced: {formatDistanceToNow(new Date(lastSyncedAt), { addSuffix: true })}
              </div>}
              <Button
                variant="ghost"
                onClick={() => {
                  instance.logoutRedirect();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>
        <ErrorBoundary>
        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          {loading ? <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-therapy-blue"></div>
          </div> :
          (isClientSpecificPage() && !selectedClient ? <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 max-w-md">
                <UserRound className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No client selected</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please select a client from the dropdown above to view their information.
                </p>
              </div>
            </div> : children)}
        </main>
        </ErrorBoundary>
      </div>
    </div>;
};
const MenuLeft = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 6-6 6 6 6" />
  </svg>;
const MenuRight = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 6 6 6-6 6" />
  </svg>;
