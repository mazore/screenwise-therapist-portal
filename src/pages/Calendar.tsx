import React, { useState } from "react";
import { TherapyLayout } from "@/components/layout/TherapyLayout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { UserRound, CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { DayProps } from "react-day-picker";

interface CalendarPageProps {
  selectedClient?: string | null;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ selectedClient }) => {
  const [view, setView] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const appointments = [
    {
      id: 1,
      title: "Therapy Session",
      date: new Date(2025, 3, 18, 10, 0), // April 18, 2025, 10:00 AM
      type: "appointment",
    },
    {
      id: 2,
      title: "Follow-up",
      date: new Date(2025, 3, 20, 14, 30), // April 20, 2025, 2:30 PM
      type: "appointment",
    },
    {
      id: 3,
      title: "Initial Assessment",
      date: new Date(2025, 3, 22, 11, 0), // April 22, 2025, 11:00 AM
      type: "appointment",
    },
  ];
  
  const loggedSessions = [
    {
      date: new Date(2025, 3, 16), // April 16, 2025
      count: 3,
    },
    {
      date: new Date(2025, 3, 18), // April 18, 2025
      count: 2,
    },
    {
      date: new Date(2025, 3, 21), // April 21, 2025
      count: 4,
    },
  ];
  
  const mealLogs = [
    {
      id: 1,
      title: "Breakfast",
      date: new Date(2025, 3, 18, 8, 30), // April 18, 2025, 8:30 AM
      type: "meal",
    },
    {
      id: 2,
      title: "Lunch",
      date: new Date(2025, 3, 18, 12, 30), // April 18, 2025, 12:30 PM
      type: "meal",
    },
    {
      id: 3,
      title: "Snack",
      date: new Date(2025, 3, 18, 16, 0), // April 18, 2025, 4:00 PM
      type: "meal",
    },
    {
      id: 4,
      title: "Breakfast",
      date: new Date(2025, 3, 19, 8, 0), // April 19, 2025, 8:00 AM
      type: "meal",
    },
    {
      id: 5,
      title: "Lunch",
      date: new Date(2025, 3, 19, 13, 0), // April 19, 2025, 1:00 PM
      type: "meal",
    },
  ];

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const getSessionCountForDay = (date: Date) => {
    const session = loggedSessions.find(s => isSameDay(s.date, date));
    return session ? session.count : 0;
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(a => isSameDay(a.date, date));
  };

  const getMealLogsForDay = (date: Date) => {
    return mealLogs.filter(m => isSameDay(m.date, date));
  };

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const CustomDay = (props: DayProps) => {
    const { date, displayMonth, ...rest } = props;
    if (!date) return null;
    
    const hasAppointment = appointments.some(a => isSameDay(a.date, date));
    const sessionCount = getSessionCountForDay(date);
    
    return (
      <div className="relative w-full h-24 border border-gray-200">
        <div className="absolute top-2 left-2 font-medium">
          {format(date, 'd')}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {hasAppointment && (
            <div className="flex items-center">
              <div className="bg-purple-500 px-2 py-1 rounded text-xs text-white">Appt</div>
            </div>
          )}
          {sessionCount > 0 && (
            <div className="flex items-center">
              <div className="h-5 px-2 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                {sessionCount} logs
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <TherapyLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">View and manage client sessions and events</p>
          </div>
          <div className="mt-4 md:mt-0">
            <ToggleGroup type="single" value={view} onValueChange={(val) => val && setView(val as "month" | "week")}>
              <ToggleGroupItem value="month" aria-label="Month view">Month</ToggleGroupItem>
              <ToggleGroupItem value="week" aria-label="Week view">Week</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        {view === "month" ? (
          <div className="bg-white rounded-lg border p-6 max-w-[1200px] mx-auto">
            <CalendarComponent 
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="rounded-md border pointer-events-auto w-full"
              components={{
                Day: CustomDay
              }}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center text-lg font-semibold pb-4",
                caption_label: "text-lg font-semibold",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full h-10 font-medium text-sm border-b",
                row: "flex w-full mt-0",
                cell: "relative w-full p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-muted/50 rounded-none",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                nav: "space-x-1 flex items-center mb-4",
                nav_button: cn(
                  "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
              }}
            />
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-1.5"></div>
                <span>Appointments</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
                <span>Logged Sessions</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </span>
              <button 
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative" style={{ height: "600px" }}>
              {Array.from({ length: 12 }).map((_, i) => {
                const hour = i + 8; // Start from 8 AM
                return (
                  <div 
                    key={i} 
                    className="absolute w-full border-b" 
                    style={{ top: `${(i / 12) * 100}%`, height: `${100 / 12}%` }}
                  >
                    <div className="grid grid-cols-8 h-full">
                      <div className="border-r text-xs p-1 text-muted-foreground">
                        {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="border-r relative"></div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {appointments.map((appointment) => {
                const dayIndex = weekDays.findIndex(day => isSameDay(day, appointment.date));
                if (dayIndex === -1) return null;
                
                const hourFraction = appointment.date.getHours() - 8 + appointment.date.getMinutes() / 60;
                const topPosition = (hourFraction / 12) * 100;
                
                return (
                  <div 
                    key={appointment.id}
                    className="absolute rounded bg-purple-100 border border-purple-300 p-1 text-xs"
                    style={{ 
                      top: `${topPosition}%`, 
                      height: "5%",
                      left: `${(dayIndex + 1) * (100 / 8) + 0.5}%`, 
                      width: `${(100 / 8) - 1}%`,
                    }}
                  >
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-purple-600" />
                      <span className="font-medium text-purple-900 truncate">
                        {format(appointment.date, 'h:mm a')} - {appointment.title}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {mealLogs.map((meal) => {
                const dayIndex = weekDays.findIndex(day => isSameDay(day, meal.date));
                if (dayIndex === -1) return null;
                
                const hourFraction = meal.date.getHours() - 8 + meal.date.getMinutes() / 60;
                const topPosition = (hourFraction / 12) * 100;
                
                return (
                  <div 
                    key={meal.id}
                    className="absolute rounded bg-blue-100 border border-blue-300 p-1 text-xs"
                    style={{ 
                      top: `${topPosition}%`, 
                      height: "5%",
                      left: `${(dayIndex + 1) * (100 / 8) + 0.5}%`, 
                      width: `${(100 / 8) - 1}%`,
                    }}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-blue-900 truncate">
                        {format(meal.date, 'h:mm a')} - {meal.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {view === "month" && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
            
            <div className="space-y-4">
              {getAppointmentsForDay(selectedDate).length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Appointments</h3>
                  <div className="space-y-2">
                    {getAppointmentsForDay(selectedDate).map(appointment => (
                      <div key={appointment.id} className="p-3 bg-purple-50 border border-purple-200 rounded-md flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
                        <div>
                          <p className="font-medium">{appointment.title}</p>
                          <p className="text-sm text-muted-foreground">{format(appointment.date, 'h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getMealLogsForDay(selectedDate).length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Meal Logs</h3>
                  <div className="space-y-2">
                    {getMealLogsForDay(selectedDate).map(meal => (
                      <div key={meal.id} className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                        <div>
                          <p className="font-medium">{meal.title}</p>
                          <p className="text-sm text-muted-foreground">{format(meal.date, 'h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {getAppointmentsForDay(selectedDate).length === 0 && getMealLogsForDay(selectedDate).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No events scheduled for this day.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TherapyLayout>
  );
};

export default CalendarPage;
