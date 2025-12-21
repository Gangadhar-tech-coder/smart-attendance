// Mock Data - Students
export const MOCK_STUDENT = {
  username: 'student',
  password: 'password123',
  rollNo: '20BCE1234',
  name: 'RAJESH KUMAR',
  department: 'Computer Science & Engineering',
  fatherName: 'SURESH KUMAR',
  motherName: 'LAKSHMI DEVI',
  aadhaar: '1234-5678-9012',
  parentMobile: '+91 98765 43210',
  photo: null
};

// Mock Data - Faculty
export const MOCK_FACULTY = {
  username: 'faculty',
  password: 'faculty123',
  name: 'Dr. Ramesh Kumar',
  employeeId: 'FAC2024001',
  department: 'Computer Science & Engineering',
  email: 'ramesh.kumar@mrec.ac.in',
  phone: '+91 98765 12345',
  photo: null
};

// Registered Users Database (Includes signup users)
export let REGISTERED_USERS: Record<string, any> = {
  'student': MOCK_STUDENT,
  'faculty': MOCK_FACULTY
};

// Active Attendance Session
export let ACTIVE_ATTENDANCE_SESSION: any = null;

// Add registered user function
export const registerUser = (userData: any) => {
  REGISTERED_USERS[userData.username] = userData;
};

// Set active attendance session
export const setActiveAttendanceSession = (session: any) => {
  ACTIVE_ATTENDANCE_SESSION = session;
  localStorage.setItem('activeAttendanceSession', JSON.stringify(session));
};

// Clear active attendance session
export const clearActiveAttendanceSession = () => {
  ACTIVE_ATTENDANCE_SESSION = null;
  localStorage.removeItem('activeAttendanceSession');
};

// Get active attendance session from storage
export const getActiveAttendanceSession = () => {
  const stored = localStorage.getItem('activeAttendanceSession');
  return stored ? JSON.parse(stored) : null;
};

// Student Courses
export const MOCK_COURSES = [
  { year: '2023-24', semester: 'I', code: 'C0511', name: 'Data Structures', faculty: 'Dr. Ramesh Kumar', attended: 45, total: 50 },
  { year: '2023-24', semester: 'I', code: 'C0512', name: 'Database Management Systems', faculty: 'Prof. Anita Sharma', attended: 38, total: 50 },
  { year: '2023-24', semester: 'I', code: 'C0513', name: 'Operating Systems', faculty: 'Dr. Vijay Singh', attended: 42, total: 50 },
  { year: '2023-24', semester: 'I', code: 'C0514', name: 'Computer Networks', faculty: 'Prof. Meena Reddy', attended: 40, total: 50 },
  { year: '2023-24', semester: 'I', code: 'C0515', name: 'Software Engineering', faculty: 'Dr. Prakash Rao', attended: 35, total: 50 }
];

// Monthly Attendance
export const MONTHLY_ATTENDANCE = [
  { month: 'Jan', percentage: 85 },
  { month: 'Feb', percentage: 78 },
  { month: 'Mar', percentage: 82 },
  { month: 'Apr', percentage: 88 },
  { month: 'May', percentage: 80 },
  { month: 'Jun', percentage: 75 },
  { month: 'Jul', percentage: 83 },
  { month: 'Aug', percentage: 86 },
  { month: 'Sep', percentage: 81 },
  { month: 'Oct', percentage: 84 },
  { month: 'Nov', percentage: 82 },
  { month: 'Dec', percentage: 79 }
];

// Faculty - Student Data by Course
export const MOCK_STUDENTS_DATA: Record<string, Array<{ rollNo: string; name: string; attended: number; total: number }>> = {
  'C0511': [
    { rollNo: '20BCE1234', name: 'RAJESH KUMAR', attended: 45, total: 50 },
    { rollNo: '20BCE1235', name: 'PRIYA SHARMA', attended: 48, total: 50 },
    { rollNo: '20BCE1236', name: 'AMIT PATEL', attended: 42, total: 50 },
    { rollNo: '20BCE1237', name: 'SNEHA REDDY', attended: 46, total: 50 },
    { rollNo: '20BCE1238', name: 'VIKRAM SINGH', attended: 40, total: 50 },
    { rollNo: '20BCE1239', name: 'ANITA VERMA', attended: 47, total: 50 },
    { rollNo: '20BCE1240', name: 'SURESH BABU', attended: 43, total: 50 },
    { rollNo: '20BCE1241', name: 'KAVYA NAIR', attended: 49, total: 50 }
  ],
  'C0512': [
    { rollNo: '20BCE1234', name: 'RAJESH KUMAR', attended: 38, total: 50 },
    { rollNo: '20BCE1235', name: 'PRIYA SHARMA', attended: 45, total: 50 },
    { rollNo: '20BCE1236', name: 'AMIT PATEL', attended: 40, total: 50 },
    { rollNo: '20BCE1237', name: 'SNEHA REDDY', attended: 42, total: 50 }
  ],
  'C0513': [
    { rollNo: '20BCE1234', name: 'RAJESH KUMAR', attended: 42, total: 50 },
    { rollNo: '20BCE1235', name: 'PRIYA SHARMA', attended: 44, total: 50 },
    { rollNo: '20BCE1236', name: 'AMIT PATEL', attended: 41, total: 50 }
  ]
};

// Course Names
export const COURSE_NAMES: Record<string, string> = {
  'C0511': 'Data Structures',
  'C0512': 'Database Management Systems',
  'C0513': 'Operating Systems'
};
