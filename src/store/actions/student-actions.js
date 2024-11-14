export const saveStudentsByClass = (set, data) => {
  set((state) => ({ students: data }));
};
