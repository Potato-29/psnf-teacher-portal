"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users } from "lucide-react";

export function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">-2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      className="rounded-md border w-full"
                      components={{
                        DayContent: (props) => {
                          const events = [
                            {
                              date: new Date(2024, 10, 15),
                              title: "Parent-Teacher Meeting",
                            },
                            {
                              date: new Date(2024, 10, 20),
                              title: "Science Fair",
                            },
                            {
                              date: new Date(2024, 10, 25),
                              title: "Sports Day",
                            },
                          ];
                          const hasEvent = events.some(
                            (event) =>
                              event.date.getDate() === props.date.getDate() &&
                              event.date.getMonth() === props.date.getMonth() &&
                              event.date.getFullYear() ===
                                props.date.getFullYear()
                          );
                          return (
                            <div className="relative flex h-8 w-8 items-center justify-center p-0">
                              <div className="absolute inset-0 flex items-center justify-center">
                                {props.date.getDate()}
                              </div>
                              {hasEvent && (
                                <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"></div>
                              )}
                            </div>
                          );
                        },
                      }}
                    />
                  </div> */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold">Upcoming:</h4>
              <ul className="mt-2 space-y-1">
                <li className="text-xs">Nov 15 - Parent-Teacher Meeting</li>
                <li className="text-xs">Nov 20 - Science Fair</li>
                <li className="text-xs">Nov 25 - Sports Day</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
