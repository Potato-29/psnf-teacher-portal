const { default: supabase } = require("@/config/supabase-client");

export const getAllStudents = async () => {
  const { error, data } = await supabase.from("students").select("*");
  if (data) {
    return data;
  }
  if (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getStudentsByClass = async (classId) => {
  const { error, data } = await supabase
    .from("students")
    .select("*")
    .eq("class", classId);
  if (data) {
    return data;
  }
  if (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const addNewStudent = async (student) => {
  const { error, data } = await supabase
    .from("students")
    .insert([student])
    .select();
  if (data) {
    return data;
  }
  if (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const deleteStudent = async (id) => {
  const { error, data } = await supabase.from("students").delete().eq("id", id);
  if (data === null) {
    return true;
  }
  if (error) {
    console.log(error);
    throw new Error(error);
  }
};
