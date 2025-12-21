// Student Attendance Utilities

export const calculateOverallAttendance = (courses: any[]) => {
  const totalAttended = courses.reduce((sum: number, c) => sum + c.attended, 0);
  const totalClasses = courses.reduce((sum: number, c) => sum + c.total, 0);
  return Math.round((totalAttended / totalClasses) * 100);
};

export const getTopFaculty = (courses: any[]) => {
  return [...courses]
    .sort((a, b) => b.attended - a.attended)
    .slice(0, 3);
};

// Faculty Attendance Utilities

export const calculateFacultyCourseAttendance = (facultyStudents: any[]) => {
  if (facultyStudents.length === 0) return 0;
  const totalAttended = facultyStudents.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = facultyStudents.reduce((sum, s) => sum + s.total, 0);
  return Math.round((totalAttended / totalClasses) * 100);
};

export const generateMonthlyData = (students: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const avg = students.reduce((sum: number, s) => sum + (s.attended / s.total), 0) / students.length;
  
  return months.map(month => ({
    month,
    percentage: Math.max(0, Math.min(100, Math.round((avg + (Math.random() - 0.5) * 0.2) * 100)))
  }));
};

export const filterStudents = (students: any[], searchQuery: string) => {
  return students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const getAttendanceStatus = (percentage: number) => {
  return percentage >= 75 ? 'GOOD' : 'LOW';
};

export const generateDynamicMonthlyData = (courses: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const overallPercentage = calculateOverallAttendance(courses);
  
  return months.map((month, index) => ({
    month,
    percentage: Math.max(0, Math.min(100, Math.round(overallPercentage + (Math.random() - 0.5) * 10)))
  }));
};
