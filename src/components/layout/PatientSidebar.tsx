
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar,
  Home,
  BarChart3,
  ClipboardList,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  StickyNote
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const PatientSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [{
    title: "Logs Activity",
    icon: Home,
    href: "/logs"
  }, {
    title: "Charts and Graphs",
    icon: BarChart3,
    href: "/charts"
  }, {
    title: "Adjust Intervention",
    icon: ClipboardList,
    href: "/interventions"
  }, {
    title: "Calendar",
    icon: Calendar,
    href: "/calendar"
  }, {
    title: "Notes",
    icon: StickyNote,
    href: "/notes"
  }, {
    title: "Set Goals",
    icon: CalendarDays,
    href: "/goals"
  }, {
    title: "Manage Team",
    icon: Users,
    href: "/team"
  }, {
    title: "Client Profile",
    icon: FileText,
    href: "/client-profile"
  }];

  return <div className={cn("h-screen border-r bg-white transition-all duration-300 flex flex-col", collapsed ? "w-[70px]" : "w-[250px]")}>
      <div className="flex items-center h-16 px-4">
        {!collapsed && <h1 className="text-xl font-bold text-therapy-blue">Screenwise Eating</h1>}
        {collapsed && <div className="w-full flex justify-center">
            <span className="text-xl font-bold text-therapy-blue">SE</span>
          </div>}
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map(item => <Link key={item.title} to={item.href}>
              <Button variant={isActive(item.href) ? "secondary" : "ghost"} className={cn("w-full justify-start mb-1", isActive(item.href) ? "bg-therapy-lightBlue text-therapy-blue hover:bg-therapy-lightBlue" : "hover:bg-therapy-gray")}>
                <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </Button>
            </Link>)}
        </nav>
      </div>
      
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="w-full flex justify-center">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </div>;
};

