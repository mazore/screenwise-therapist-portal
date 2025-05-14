
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardPlus, BarChart2, Target, CalendarDays, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickLinks = () => {
  const links = [
    {
      title: "Add Session Log",
      icon: <ClipboardPlus className="mr-2 h-4 w-4" />,
      href: "/add-session",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Charts",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
      href: "/charts",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Set Client Goals",
      icon: <Target className="mr-2 h-4 w-4" />,
      href: "/goals",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Adjust Intervention",
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      href: "/interventions",
      color: "bg-amber-500 hover:bg-amber-600"
    },
    {
      title: "Schedule Session",
      icon: <CalendarDays className="mr-2 h-4 w-4" />,
      href: "/schedule",
      color: "bg-rose-500 hover:bg-rose-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Button
              key={link.title}
              variant="default"
              className={`${link.color} text-white`}
              asChild
            >
              <Link to={link.href}>
                {link.icon}
                {link.title}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
