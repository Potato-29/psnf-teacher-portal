"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import supabase from "@/config/supabase-client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { getAttendanceRecordByClass } from "@/services/attendance-services";
import { getStudentsByClass } from "@/services/student-services";

export function AttendanceTrackerComponent() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);
  const [tempAttendance, setTempAttendance] = useState({});

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      const dateKey = format(date, "yyyy-MM-dd");
      setTempAttendance(attendance[dateKey] || {});
      setIsDialogOpen(true);
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

  const handleSave = () => {
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
      updateAttendanceInDB(dateKey, tempAttendance, existingAttendance);
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setTempAttendance({});
  };

  const getAttendanceStats = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayAttendance = attendance[dateKey] || {};
    const presentCount = Object.values(dayAttendance).filter(
      (status) => status === "present"
    ).length;
    const absentCount = Object.values(dayAttendance).filter(
      (status) => status === "absent"
    ).length;
    return { presentCount, absentCount };
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedDate(undefined);
      setTempAttendance({});
    }
  }, [isDialogOpen]);

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

  const getAllStudentsByClass = async () => {
    const result = await getStudentsByClass(user.class);
    if (result) {
      let studentsArr = [];
      result.map((item) => {
        studentsArr.push({
          name: item.first_name + " " + item.last_name,
          ...item,
        });
      });
      setStudents(studentsArr);
    }
  };

  useEffect(() => {
    if (user) {
      getAllStudentsByClass();
      getAttendanceRecord();
    }
  }, [user]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Attendance Tracker</h1>
      <div className="mb-4 w-full bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          className="rounded-md border shadow w-full"
          classNames={{
            months:
              "w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "w-full space-y-4",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell:
              "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
            row: "flex w-full mt-2 gap-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:rounded-md w-full h-24",
            day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            day_today:
              "border-2 border-blue-300 rounded-md text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          modifiers={{
            marked: (date) => {
              const dateKey = format(date, "yyyy-MM-dd");
              return !!attendance[dateKey];
            },
            disabled: (date) => {
              return date > new Date(); // Disable dates after today
            },
          }}
          modifiersClassNames={{
            marked: "bg-blue-100",
            disabled: "text-muted-foreground opacity-50 cursor-not-allowed", // Add styles for disabled dates
          }}
          components={{
            DayContent: ({ date }) => {
              const { presentCount, absentCount } = getAttendanceStats(date);
              return (
                <div className="w-full h-full flex flex-col justify-between p-1">
                  <span className="text-base">{format(date, "d")}</span>
                  {(presentCount > 0 || absentCount > 0) && (
                    <div className="text-xs mt-1">
                      <span className="text-green-600">{presentCount}</span>
                      {" / "}
                      <span className="text-red-600">{absentCount}</span>
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </div>
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
            {filteredStudents.map((student) => (
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
                    onClick={() => handleAttendanceChange(student.id, "absent")}
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
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
