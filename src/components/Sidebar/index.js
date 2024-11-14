"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  BookOpen,
  CopyCheck,
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

  // Hide sidebar on login page
  if (pathname === "/login") {
    return null;
  }

  const routes = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Class", path: "/class", icon: Users },
    { name: "Attendance", path: "/attendance", icon: CopyCheck },
    { name: "Report Card", path: "/report-card", icon: FileText },
    { name: "Courses", path: "/courses", icon: BookOpen },
  ];

  return (
    <aside
      className={`w-64 px-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
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
        {routes.map((route, index) => (
          <Button
            key={index}
            variant={pathname === route.path ? "secondary" : "ghost"}
            className="w-full justify-start my-1"
            onClick={() => router.push(route.path)}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.name}
          </Button>
        ))}
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
