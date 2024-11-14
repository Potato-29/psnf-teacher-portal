"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  BarChart,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  Search,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getAttendanceRecordByClass } from "@/services/attendance-services";
import { getStudentsByClass } from "@/services/student-services";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import supabase from "@/config/supabase-client";
import useStore from "@/store/useStore";

export function Dashboard({ students }) {
  const { user } = useAuth();
  const { setStudents } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [tempAttendance, setTempAttendance] = useState({});

  useEffect(() => {
    if (students) {
      setStudents(students);
    }
  }, []);

  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = () => {
    setIsDialogOpen(false);
    setTempAttendance({});
  };

  const getAttendanceRecord = async () => {
    const result = await getAttendanceRecordByClass(user.class);
    if (result) {
      const newAttendance = result.reduce((acc, record) => {
        const dateKey = record.date;
        if (!acc[dateKey]) {
          acc[dateKey] = {};
        }
        acc[dateKey][record.user_id] = record.status;
        return acc;
      }, {});

      setAttendance(newAttendance);
    }
  };

  // const getAllStudentsByClass = async () => {
  //   const result = await getStudentsByClass(user.class);
  //   if (result) {
  //     let studentsArr = [];
  //     result.map((item) => {
  //       studentsArr.push({
  //         name: item.first_name + item.last_name,
  //         ...item,
  //       });
  //     });
  //     setStudents(studentsArr);
  //   }
  // };

  const handleSaveAttendance = () => {
    if (selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");

      // Check if all students are marked
      const allMarked = students.every(
        (student) =>
          tempAttendance[student.id] === "present" ||
          tempAttendance[student.id] === "absent"
      );

      if (!allMarked) {
        toast({
          variant: "destructive",
          title: "Incomplete",
          description: "Please mark all students before saving.",
          status: "warning",
        });
        return; // Exit if not all students are marked
      }

      const existingAttendance = attendance[dateKey];
      setAttendance((prev) => ({
        ...prev,
        [dateKey]: tempAttendance,
      }));
      const isExisting = !!existingAttendance;
      updateAttendanceInDB(dateKey, tempAttendance, isExisting);
      setIsDialogOpen(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setTempAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };
  const updateAttendanceInDB = async (dateKey, attendanceData, isExisting) => {
    const records = Object.entries(attendanceData).map(([userId, status]) => ({
      date: dateKey,
      user_id: userId,
      status: status,
      class_id: user.class,
    }));
    try {
      if (isExisting) {
        for (const record of records) {
          const { error } = await supabase
            .from("attendance_records")
            .update({ status: record.status })
            .eq("date", record.date)
            .eq("class_id", record.class_id)
            .eq("user_id", record.user_id);

          if (error) {
            console.error("Error updating attendance:", error);
            toast({
              title: "Error",
              description: "Failed to update attendance. Please try again.",
              status: "error",
            });
            return; // Exit if any update fails
          }
        }
        console.log("Attendance updated successfully");
        toast({
          title: "Success",
          description: "Attendance updated successfully.",
          status: "success",
        });
      } else {
        const { error } = await supabase
          .from("attendance_records")
          .insert(records);

        if (error) {
          console.error("Error inserting attendance:", error);
          toast({
            title: "Error",
            description: "Failed to insert attendance. Please try again.",
            status: "error",
          });
        } else {
          console.log("Attendance inserted successfully");
          toast({
            title: "Success",
            description: "Attendance inserted successfully.",
            status: "success",
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
      });
    }
  };

  const handleDialog = (date = new Date()) => {
    if (date) {
      setSelectedDate(date);
      const dateKey = format(date, "yyyy-MM-dd");
      setTempAttendance(attendance[dateKey] || {});
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    if (user) {
      // getAllStudentsByClass();
      getAttendanceRecord();
    }
  }, [user]);

  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedDate(undefined);
      setTempAttendance({});
    }
  }, [isDialogOpen]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-100">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-50">
              1,234
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-200">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-100">
              Average Attendance
            </CardTitle>
            <BarChart className="h-4 w-4 text-green-600 dark:text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-50">
              92%
            </div>
            <p className="text-xs text-green-600 dark:text-green-200">
              -2% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-100">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-50">
              3
            </div>
            <ul className="mt-2 space-y-1">
              <li className="text-xs text-purple-600 dark:text-purple-200">
                Nov 15 - Parent-Teacher Meeting
              </li>
              <li className="text-xs text-purple-600 dark:text-purple-200">
                Nov 20 - Science Fair
              </li>
              <li className="text-xs text-purple-600 dark:text-purple-200">
                Nov 25 - Sports Day
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Bell className="mr-2 h-5 w-5 text-yellow-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-sm">New student enrollment: Sarah Johnson</li>
              <li className="text-sm">Upcoming staff meeting on Nov 18</li>
              <li className="text-sm">
                Report cards due for submission by Nov 30
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-sm">9:00 AM - Morning Assembly</li>
              <li className="text-sm">11:30 AM - Department Heads Meeting</li>
              <li className="text-sm">
                2:00 PM - Parent-Teacher Conference (Grade 5)
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-green-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => handleDialog()}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="h-6 w-6 mb-2" />
                Take Attendance
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <FileText className="h-6 w-6 mb-2" />
                Create Report
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <BookOpen className="h-6 w-6 mb-2" />
                Add Course
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Event
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={!!selectedDate}
          onOpenChange={(open) => !open && setIsDialogOpen(false)}
        >
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>
                Attendance for{" "}
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredStudents?.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <span>{student.name}</span>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full w-10 h-10",
                        tempAttendance[student.id] === "present" &&
                          "bg-green-500 text-white hover:bg-green-600  hover:text-white"
                      )}
                      onClick={() =>
                        handleAttendanceChange(student.id, "present")
                      }
                    >
                      P
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full w-10 h-10",
                        tempAttendance[student.id] === "absent" &&
                          "bg-red-500 text-white hover:bg-red-600  hover:text-white"
                      )}
                      onClick={() =>
                        handleAttendanceChange(student.id, "absent")
                      }
                    >
                      A
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveAttendance}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
