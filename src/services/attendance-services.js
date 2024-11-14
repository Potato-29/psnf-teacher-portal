import supabase from "@/config/supabase-client";

export const getAttendanceRecordByClass = async (classId) => {
  const { error, data } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("class_id", classId);
  if (error) {
    console.log(error);
    throw new Error(JSON.stringify(error));
  }
  return data;
};
