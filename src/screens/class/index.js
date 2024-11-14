"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Calendar,
  FileText,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { getStudentsByClass } from "@/services/student-services";
import { toast } from "@/hooks/use-toast";

export default function Classroom() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", grade: "" });
  const addStudent = (e) => {
    e.preventDefault();
    setStudents([
      ...students,
      { ...newStudent, id: students.length + 1, attendance: "N/A" },
    ]);
    setNewStudent({ name: "", grade: "" });
  };

  const getStudents = useCallback(async () => {
    console.log("helo");
    try {
      const result = await getStudentsByClass(user.class);
      if (result) {
        setStudents(result);
      }
    } catch (error) {
      toast({
        title: "Failed to get students",
        description: "Please try again later",
      });
    }
  }, [user]);
  console.log(user);
  useEffect(() => {
    if (user) {
      getStudents();
    }
  }, [getStudents, user]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Classroom Module</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Assignments
          </Button>
          <Button variant="outline">
            <Book className="mr-2 h-4 w-4" /> Grades
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students" className="pl-8 w-64" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={addStudent} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={newStudent.grade}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, grade: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit">Add Student</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.first_name + student.last_name}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.attendance}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="hover:!bg-red-400 hover:!text-white transition-all !duration-150">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
