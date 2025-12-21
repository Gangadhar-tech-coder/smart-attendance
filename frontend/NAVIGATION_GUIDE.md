# Quick Navigation Guide

## 🎯 Finding What You Need

### **Where to change UI?**
→ Look in `components/` folder based on user type:
- Student UI: `components/student/`
- Faculty UI: `components/faculty/`
- Shared UI: `components/charts/`

### **Where to change logic?**
→ Look in `hooks/` based on what you're changing:
- Login logic: `hooks/useAuth.ts`
- Student features: `hooks/useStudentState.ts`
- Faculty features: `hooks/useFacultyState.ts`

### **Where to add utility functions?**
→ `utils/attendanceUtils.ts` for calculations and helpers

### **Where to change mock data?**
→ `data/mockData.ts` for students, courses, and attendance info

### **Where to change page structure?**
→ `pages/` folder:
- `LoginPage.tsx` - Login screen
- `StudentDashboard.tsx` - Student main layout
- `FacultyDashboard.tsx` - Faculty main layout

### **Main entry point?**
→ `App.tsx` - Routes between login and dashboards

---

## 🔍 Common Tasks

### Task: Add a new course
**File**: `src/data/mockData.ts`
```typescript
// Add to MOCK_COURSES array
{ year: '2023-24', semester: 'I', code: 'C0516', name: 'Web Development', ... }

// Add to MOCK_STUDENTS_DATA
'C0516': [ { rollNo: '20BCE...', name: '...', attended: 45, total: 50 }, ... ]

// Add to COURSE_NAMES
'C0516': 'Web Development'
```

### Task: Change student profile fields
**File**: `src/components/student/StudentProfile.tsx`
```typescript
// Modify the table rows to show different fields
```

### Task: Add a new calculation (e.g., streak)
**File**: `src/utils/attendanceUtils.ts`
```typescript
export const calculateStreak = (attendance) => { ... }
```

### Task: Change chart colors
**File**: `src/components/charts/StudentChart.tsx` or `MonthlyChart.tsx`
```typescript
// Modify backgroundColor: '#007bff' (blue) to any hex color
```

### Task: Add new sidebar option
**File**: `src/pages/StudentDashboard.tsx` or `FacultyDashboard.tsx`
```typescript
<div onClick={() => onViewChange('newView')} ...>
  <Icon size={18} />
  New Option
</div>

// Then add rendering logic:
{currentView === 'newView' && <NewComponent />}
```

### Task: Connect to real backend
**File**: `src/hooks/useStudentState.ts` and `useFacultyState.ts`
```typescript
// Replace MOCK_COURSES with API call:
const [courses, setCourses] = useState([]);
useEffect(() => {
  fetch('/api/courses').then(data => setCourses(data));
}, []);
```

---

## 📦 Import Paths Reference

```typescript
// Components
import { StudentProfile } from './components/student/StudentProfile';
import { FacultyProfile } from './components/faculty/FacultyProfile';
import { MonthlyChart } from './components/charts/MonthlyChart';
import { StudentChart } from './components/charts/StudentChart';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useStudentState } from './hooks/useStudentState';
import { useFacultyState } from './hooks/useFacultyState';

// Data
import { MOCK_STUDENT, MOCK_FACULTY, MOCK_COURSES } from './data/mockData';

// Utils
import { calculateOverallAttendance, getTopFaculty } from './utils/attendanceUtils';
```

---

## 🧬 Component Props Patterns

### Student Components
```typescript
// StudentProfile - No props needed
<StudentProfile />

// StudentCourses - Takes data and callbacks
<StudentCourses 
  courses={student.courses}
  attendanceRecords={student.attendanceRecords}
  onStartCamera={student.startCamera}
/>

// CameraModal - Full control props
<CameraModal
  isActive={student.cameraActive}
  selectedCourse={student.selectedCourse}
  videoRef={student.videoRef}
  onCapture={handleCaptureAttendance}
  onCancel={student.stopCamera}
/>
```

### Faculty Components
```typescript
// FacultyProfile - No props
<FacultyProfile />

// FacultyAttendance - Data + Callbacks
<FacultyAttendance
  courseCode={faculty.courseCode}
  courseError={faculty.courseError}
  selectedFacultyCourse={faculty.selectedFacultyCourse}
  facultyStudents={faculty.facultyStudents}
  onCourseCodeChange={faculty.setCourseCode}
  onSubmit={handleFacultyCourseSubmit}
  onViewStatistics={() => onViewChange('statistics')}
/>

// FacultyStatistics - Display + Filter
<FacultyStatistics
  selectedFacultyCourse={faculty.selectedFacultyCourse}
  facultyStudents={faculty.facultyStudents}
  monthlyData={faculty.monthlyData}
  searchQuery={faculty.searchQuery}
  onSearchChange={faculty.setSearchQuery}
/>
```

---

## 🎯 State Management Overview

### Login State (`useAuth`)
```
username → handleLogin() → isLoggedIn, userType, loginError
```

### Student State (`useStudentState`)
```
cameras → startCamera() → cameraActive, selectedCourse
         → captureAttendance() → attendanceRecords, courses
         
courses → calculateOverallAttendance()
```

### Faculty State (`useFacultyState`)
```
courseCode → handleCourseSubmit() → selectedFacultyCourse, facultyStudents, monthlyData, courseError
                                   → generateMonthlyData()

searchQuery → filterStudents()
```

---

## 🔗 Event Flow Examples

### Student Takes Attendance
```
User clicks "Take Attendance" button
  ↓
onStartCamera(course) called
  ↓
student.startCamera(course) in useStudentState
  ↓
navigator.mediaDevices.getUserMedia() request
  ↓
Camera stream attached to videoRef
  ↓
CameraModal displayed
  ↓
User clicks "Capture"
  ↓
handleCaptureAttendance() calls student.captureAttendance()
  ↓
updateCourses() + setAttendanceRecords()
  ↓
Display "✓ Marked" badge
```

### Faculty Submits Course Code
```
User enters course code "C0511"
  ↓
onCourseCodeChange() updates faculty.courseCode
  ↓
User clicks "Submit" or presses Enter
  ↓
handleFacultyCourseSubmit() calls faculty.handleCourseSubmit()
  ↓
Look up MOCK_STUDENTS_DATA[code]
  ↓
generateMonthlyData(students)
  ↓
Update state: selectedFacultyCourse, facultyStudents, monthlyData
  ↓
Switch view to 'statistics'
  ↓
Render FacultyStatistics with charts and table
```

---

## 📊 File Size Reference

- **App.tsx**: 97 lines
- **Pages**: ~350 lines total (LoginPage, StudentDashboard, FacultyDashboard)
- **Components**: ~400 lines total (6 files)
- **Hooks**: ~200 lines total (3 files)
- **Data**: ~60 lines (mockData.ts)
- **Utils**: ~35 lines (attendanceUtils.ts)

**Total: ~1,150 lines** (vs 1,237 in original, but now much more organized!)

---

## ✅ Code Quality Checklist

Before making changes:
- [ ] Is this UI? → Put in `components/`
- [ ] Is this state management? → Put in `hooks/`
- [ ] Is this calculation? → Put in `utils/`
- [ ] Is this data? → Put in `data/`
- [ ] Is this a full screen? → Put in `pages/`
- [ ] Can other components reuse this? → Make it a separate component

---

## 🚨 Common Mistakes to Avoid

1. **Don't mix logic and UI**
   - ❌ `const [data, setData] = useState()` in UI component
   - ✅ Put in a custom hook instead

2. **Don't create deeply nested components**
   - ❌ `components/student/profile/header/avatar/`
   - ✅ Keep at most 2-3 levels deep

3. **Don't hardcode values**
   - ❌ `const colors = { primary: '#003366' }`
   - ✅ Use `src/utils/constants.ts` or inline with clear variable names

4. **Don't import from up multiple levels**
   - ❌ `import from '../../../../data/mockData'`
   - ✅ Keep imports to 2-3 levels max, adjust folder structure if needed

5. **Don't pass props more than 3 levels deep**
   - ❌ Component A → B → C → D (prop drilling)
   - ✅ Use Context API or custom hooks instead

