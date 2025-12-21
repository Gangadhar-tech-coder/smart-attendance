# Attendance Management System - Refactored Structure

## Project Overview
Your attendance management system has been completely refactored from a single 1200+ line `App.tsx` file into a modular, organized structure with clear separation of concerns.

---

## 📁 Project Structure

```
frontend/src/
│
├── App.tsx                          # Main app component (97 lines) - Orchestrates routing
│
├── pages/                           # Page-level components (full screen views)
│   ├── LoginPage.tsx               # Login form component
│   ├── StudentDashboard.tsx        # Student main view with sidebar
│   └── FacultyDashboard.tsx        # Faculty main view with sidebar
│
├── components/                      # Reusable components
│   ├── charts/
│   │   ├── MonthlyChart.tsx        # Bar chart for monthly attendance
│   │   └── StudentChart.tsx        # Bar chart for student attendance
│   │
│   ├── student/
│   │   ├── StudentProfile.tsx      # Student profile view
│   │   ├── StudentCourses.tsx      # Student courses & attendance table
│   │   └── CameraModal.tsx         # Camera capture modal
│   │
│   └── faculty/
│       ├── FacultyProfile.tsx      # Faculty profile view
│       ├── FacultyAttendance.tsx   # Course lookup & submission
│       └── FacultyStatistics.tsx   # Statistics with charts & student table
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts                  # Authentication state & login logic
│   ├── useStudentState.ts          # Student state (courses, camera, attendance)
│   └── useFacultyState.ts          # Faculty state (courses, students, monthly data)
│
├── data/                            # Static data & constants
│   └── mockData.ts                 # Mock students, faculty, courses, attendance data
│
└── utils/                           # Utility functions
    └── attendanceUtils.ts          # Attendance calculations & filtering helpers
```

---

## 🎯 File Breakdown

### **App.tsx** (97 lines)
Main application component that orchestrates:
- Authentication flow
- Role-based view rendering (Student/Faculty)
- Camera modal display
- State management delegation to custom hooks
- Event handlers for capture and logout

### **Pages/**

#### **LoginPage.tsx**
- Login form UI component
- Handles username/password input
- Shows demo credentials info

#### **StudentDashboard.tsx**
- Student main interface with sidebar
- Renders different views: Profile, Courses, Dashboard
- Integrates StudentProfile, StudentCourses components
- Shows monthly attendance chart

#### **FacultyDashboard.tsx**
- Faculty main interface with sidebar
- Renders: Profile, Attendance (course lookup), Statistics
- Integrates FacultyProfile, FacultyAttendance, FacultyStatistics

### **Components/charts/**

#### **MonthlyChart.tsx**
- Reusable bar chart component
- Displays 12 months of attendance percentages
- Shows "No data available" when empty
- Styled with borders and percentage labels

#### **StudentChart.tsx**
- Bar chart showing individual student attendance
- Color-coded: Green (≥75%), Red (<75%)
- Displays roll numbers below each bar
- Handles scrolling for large datasets

### **Components/student/**

#### **StudentProfile.tsx**
- Shows student details in table format
- Displays: Name, Father, Mother, Aadhaar, Mobile
- Shows student photo placeholder
- Clean bordered layout

#### **StudentCourses.tsx**
- Table with all courses
- Shows: Code, Name, Faculty, Attendance, Action button
- "Take Attendance" button triggers camera
- "✓ Marked" badge for completed attendance
- Footer cards with overall stats and faculty rankings

#### **CameraModal.tsx**
- Full-screen modal overlay
- Video element for camera stream
- Capture and Cancel buttons
- Displays course code in header

### **Components/faculty/**

#### **FacultyProfile.tsx**
- Table showing faculty details
- Displays: Name, Employee ID, Department, Email, Phone

#### **FacultyAttendance.tsx**
- Course code input field
- Submit button and error messages
- Green success box showing selected course & student count
- "View Statistics" button

#### **FacultyStatistics.tsx**
- Two-column layout: Student Chart + Monthly Chart
- Student details searchable table with:
  - Roll Number, Name, Attended/Total, Percentage, Status badge
- Summary showing enrolled students & overall attendance

### **Hooks/**

#### **useAuth.ts**
```typescript
Returns:
- isLoggedIn, userType (student|faculty|null)
- username, password, loginError
- handleLogin(), handleLogout()
```

#### **useStudentState.ts**
```typescript
Returns:
- courses, cameraActive, selectedCourse
- attendanceRecords, currentView
- videoRef, streamRef
- startCamera(), captureAttendance(), stopCamera()
```

#### **useFacultyState.ts**
```typescript
Returns:
- courseCode, selectedFacultyCourse
- facultyStudents, monthlyData, searchQuery, courseError
- currentView
- handleCourseSubmit(), reset()
```

### **Data/**

#### **mockData.ts**
Contains:
- `MOCK_STUDENT` - Demo student credentials & profile
- `MOCK_FACULTY` - Demo faculty credentials & profile
- `MOCK_COURSES` - 5 courses with attendance data
- `MONTHLY_ATTENDANCE` - 12 months of percentages
- `MOCK_STUDENTS_DATA` - Students by course code (C0511, C0512, C0513)
- `COURSE_NAMES` - Course code to name mapping

### **Utils/**

#### **attendanceUtils.ts**
Utility functions:
- `calculateOverallAttendance(courses)` - Overall attendance %
- `getTopFaculty(courses)` - Top 3 faculty by attendance
- `calculateFacultyCourseAttendance(students)` - Course attendance %
- `generateMonthlyData(students)` - Create monthly stats
- `filterStudents(students, query)` - Search students
- `getAttendanceStatus(percentage)` - "GOOD" or "LOW"

---

## 🔄 Data Flow

```
Login
  ↓
useAuth.handleLogin()
  ↓
Student or Faculty Dashboard
  ↓
Student Path:
  - StudentDashboard
    - StudentProfile (profile view)
    - StudentCourses (table with camera action)
      - CameraModal (video capture)
        - startCamera() → videoRef
        - captureAttendance() → update state
      
Faculty Path:
  - FacultyDashboard
    - FacultyProfile (profile view)
    - FacultyAttendance (course lookup)
      - handleCourseSubmit() → generateMonthlyData()
    - FacultyStatistics (charts & table)
      - StudentChart + MonthlyChart
      - Filtered student list
```

---

## 🎨 Component Communication

**Props-based**: All components receive data as props and callbacks for actions.

Example:
```typescript
<StudentCourses 
  courses={student.courses}
  attendanceRecords={student.attendanceRecords}
  onStartCamera={student.startCamera}
/>
```

---

## 📊 Benefits of Refactoring

| Aspect | Before | After |
|--------|--------|-------|
| Main file size | 1,237 lines | 97 lines |
| Single Component | Single massive component | Composable modules |
| Reusability | Hard to reuse logic | Charts, utils, hooks reusable |
| Testability | Hard to test | Each component independently testable |
| Maintainability | Difficult to find/change code | Clear file organization |
| Scalability | Adding features = big edits | Add new files in appropriate folders |
| Team Collaboration | Conflicts likely | Multiple developers can work in parallel |

---

## 🚀 Demo Credentials

**Student:**
- Username: `student`
- Password: `password123`

**Faculty:**
- Username: `faculty`
- Password: `faculty123`

---

## 📝 Available Course Codes

For faculty attendance lookup:
- `C0511` - Data Structures (8 students)
- `C0512` - Database Management Systems (4 students)
- `C0513` - Operating Systems (3 students)

---

## 🔧 Next Steps

To extend this structure:

1. **Add a Reports page**: Create `pages/Reports.tsx`
2. **Add Admin panel**: Create `pages/AdminDashboard.tsx` with `components/admin/`
3. **Backend integration**: Replace mock data with API calls in hooks
4. **Testing**: Each component/hook can be tested independently
5. **Styling**: Move inline styles to CSS files in each component folder
6. **State management**: Could upgrade to Context API or Redux if needed

