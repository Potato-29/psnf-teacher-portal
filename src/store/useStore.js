import { create } from "zustand";

const useStore = create((set) => ({
  students: [],
  monthlyAttendance: [],

  setStudents: (newStudents) => set({ students: newStudents }),
}));

export default useStore;
