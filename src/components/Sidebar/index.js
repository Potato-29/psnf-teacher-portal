"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  return (
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
          variant={pathname === "/dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => router.push("dashboard")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={pathname === "/attendance" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => router.push("/attendance")}
        >
          <Users className="mr-2 h-4 w-4" />
          Attendance
        </Button>
        <Button
          variant={pathname === "/reports" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => router.push("reports")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Report Cards
        </Button>
        <Button
          variant={pathname === "/courses" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => router.push("courses")}
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
  );
}
