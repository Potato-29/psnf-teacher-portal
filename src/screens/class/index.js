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
import {
  addNewStudent,
  deleteStudent,
  getStudentsByClass,
} from "@/services/student-services";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

export default function Classroom() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      age: "",
    },
  });
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addStudent = async (body) => {
    try {
      let payload = {
        ...body,
        class: user.class,
        class_name: user.className.toUpperCase(),
        created_at: new Date(),
      };
      const result = await addNewStudent(payload);
      if (result) {
        setStudents([...students, result[0]]);
        reset();
        setIsModalOpen(false);
        toast({
          duration: 700,
          variant: "success",
          title: "Success",
          description: "Student added successfully",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        duration: 700,
        variant: "destructive",
        title: "Failed to add student",
        description: "Please try again later",
      });
    }
  };

  const removeStudent = async (id) => {
    try {
      const result = await deleteStudent(id);
      if (result) {
        toast({
          duration: 700,
          variant: "success",
          title: "Success",
          description: "Student removed successfully",
        });
        setStudents(students.filter((student) => student.id !== id));
      }
    } catch (error) {
      console.error(error);
      toast({
        duration: 700,
        variant: "destructive",
        title: "Failed to remove student",
        description: "Please try again later",
      });
    }
  };

  const getStudents = useCallback(async () => {
    try {
      const result = await getStudentsByClass(user.class);
      if (result) {
        setStudents(result);
      }
    } catch (error) {
      toast({
        duration: 700,
        variant: "destructive",
        title: "Failed to get students",
        description: "Please try again later",
      });
    }
  }, [user]);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
    reset();
  };

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
        <Dialog open={isModalOpen} onOpenChange={handleModal}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(addStudent)} className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input {...register("first_name", { required: true })} />
                {errors.first_name && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input {...register("last_name", { required: true })} />
                {errors.last_name && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div>
                <Label htmlFor="age">Email</Label>
                <Input
                  {...register("email", { required: true })}
                  type="email"
                />
                {errors.email && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input {...register("age", { required: true })} />
                {errors.age && (
                  <span className="text-red-500">This field is required</span>
                )}
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
              <TableHead>Class</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  {student.first_name + " " + student.last_name}
                </TableCell>
                <TableCell>{student.class_name}</TableCell>
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
                      <DropdownMenuItem
                        onClick={() => removeStudent(student.id)}
                        className="hover:!bg-red-400 hover:!text-white transition-all !duration-150"
                      >
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
