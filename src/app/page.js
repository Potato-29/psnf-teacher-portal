import { Dashboard } from "@/screens/dashboard";
import { getUserFromRequest } from "@/utils/get-user";
import { getStudentsByClass } from "@/services/student-services";
import { getAttendanceRecordByClass } from "@/services/attendance-services";

export default async function Home({ req }) {
  const { user } = await getUserFromRequest(req);
  const result = await getStudentsByClass(user.class);
  let studentsArr = [];
  if (result) {
    studentsArr = result.map((item) => ({
      name: item.first_name + " " + item.last_name,
      ...item,
    }));
  }

  const attendance = await getAttendanceRecordByClass(user.class);
  let attendanceArr = [];
  if (attendance) {
    attendanceArr = attendance.map((item) => ({
      ...item,
    }));
  }

  return <Dashboard students={studentsArr} attendance={attendanceArr} />;
}
