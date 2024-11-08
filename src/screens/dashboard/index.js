"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Dashboard() {
  const { user } = useAuth();
  console.log(user);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-2">
          <Card>
            <CardContent className="flex flex-col p-2">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {user?.first_name} {user?.last_name}
              </h1>
              <p>Class: {user?.class?.toUpperCase()}</p>
            </CardContent>
          </Card>
        </div>
        <nav className="mt-4">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "attendance" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("attendance")}
          >
            <Users className="mr-2 h-4 w-4" />
            Attendance
          </Button>
          <Button
            variant={activeTab === "reports" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("reports")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Report Cards
          </Button>
          <Button
            variant={activeTab === "courses" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </Button>
        </nav>
        <div className="absolute bottom-4 left-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === "dashboard" && (
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
                  <p className="text-xs text-muted-foreground">
                    -2% from last week
                  </p>
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
                      <li className="text-xs">
                        Nov 15 - Parent-Teacher Meeting
                      </li>
                      <li className="text-xs">Nov 20 - Science Fair</li>
                      <li className="text-xs">Nov 25 - Sports Day</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Attendance Tracker</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mark Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="class">Select Class</Label>
                      <Select>
                        <SelectTrigger id="class">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class-1">Class 1</SelectItem>
                          <SelectItem value="class-2">Class 2</SelectItem>
                          <SelectItem value="class-3">Class 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/*Removed Calendar Component here*/}
                    <Button>Mark Attendance</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Students:</span>
                      <span className="font-bold">30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Present:</span>
                      <span className="font-bold text-green-600">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absent:</span>
                      <span className="font-bold text-red-600">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendance Rate:</span>
                      <span className="font-bold">93.33%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Generate Report Cards</h2>
            <Card>
              <CardHeader>
                <CardTitle>Report Card Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="student">Select Student</Label>
                    <Select>
                      <SelectTrigger id="student">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student-1">John Doe</SelectItem>
                        <SelectItem value="student-2">Jane Smith</SelectItem>
                        <SelectItem value="student-3">Mike Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="term">Select Term</Label>
                    <Select>
                      <SelectTrigger id="term">
                        <SelectValue placeholder="Select a term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="term-1">Term 1</SelectItem>
                        <SelectItem value="term-2">Term 2</SelectItem>
                        <SelectItem value="term-3">Term 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Generate Report Card</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "courses" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Course Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="course-name">Course Name</Label>
                    <Input id="course-name" placeholder="Enter course name" />
                  </div>
                  <div>
                    <Label htmlFor="course-code">Course Code</Label>
                    <Input id="course-code" placeholder="Enter course code" />
                  </div>
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      placeholder="Enter instructor name"
                    />
                  </div>
                  <Button>Add Course</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
