import { useState } from 'react';
import { REGISTERED_USERS, registerUser } from '../data/mockData';

export interface SignupData {
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty';
  photo: string | null;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'faculty' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user exists in registered users
    const user = Object.values(REGISTERED_USERS).find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      setIsLoggedIn(true);
      setUserType(user.type || (user.rollNo ? 'student' : 'faculty'));
      setCurrentUser(user);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleSignup = (signupData: SignupData) => {
    if (!signupData.firstName || !signupData.lastName) {
      setSignupError('Please enter first and last name');
      return;
    }
    if (!signupData.photo) {
      setSignupError('Please capture your photo');
      return;
    }

    // Generate unique username locally (used if backend not available)
    const baseUsername = (signupData.firstName + signupData.lastName).toLowerCase().replace(/\s+/g, '');
    let newUsername = baseUsername;
    let counter = 1;
    while (REGISTERED_USERS[newUsername]) {
      newUsername = baseUsername + counter;
      counter++;
    }

    const password = 'password123';

    // Try to send signup to backend '/signup/' endpoint (Django view expects multipart/form-data)
    (async () => {
      try {
        const form = new FormData();
        form.append('username', newUsername);
        form.append('password', password);
        form.append('role', signupData.role === 'student' ? 'STUDENT' : 'FACULTY');
        form.append('first_name', signupData.firstName);
        form.append('last_name', signupData.lastName);
        form.append('department', (signupData as any).department || 'CSE');

        // profile image: convert base64 to Blob
        const res = await fetch(signupData.photo!);
        const blob = await res.blob();
        // Keep filename simple
        const ext = blob.type.split('/').pop() || 'jpg';
        form.append('profile_image', blob, `${newUsername}_profile.${ext}`);

        // live scan still as base64 string expected by backend
        form.append('live_image_data', signupData.photo!);

        const resp = await fetch('/signup/', {
          method: 'POST',
          body: form,
          credentials: 'include'
        });

        if (resp.ok) {
          // Backend created and logged-in the user (view performs login+redirect).
          // Try to follow redirect or refresh app state.
          setSignupError('');
          setShowSignup(false);
          setUsername(newUsername);
          setPassword(password);
          alert(`Account created! Username: ${newUsername}, Password: ${password}`);
        } else {
          // Fallback to local registration if backend returns error
          const text = await resp.text();
          console.warn('Signup backend error:', text);
          fallbackLocalRegister();
        }
      } catch (err) {
        console.warn('Backend signup failed, falling back to local register.', err);
        fallbackLocalRegister();
      }
    })();

    function fallbackLocalRegister() {
      const newUser: any = {
        username: newUsername,
        password: password, // Default password for new users
        name: `${signupData.firstName.toUpperCase()} ${signupData.lastName.toUpperCase()}`,
        photo: signupData.photo,
        type: signupData.role,
        department: 'Computer Science & Engineering'
      };

      if (signupData.role === 'student') {
        newUser.rollNo = '20BCE' + Math.floor(1000 + Math.random() * 9000);
        newUser.fatherName = '';
        newUser.motherName = '';
        newUser.parentMobile = '';
      } else {
        newUser.employeeId = 'FAC' + Math.floor(1000 + Math.random() * 9000);
        newUser.email = newUsername + '@mrec.ac.in';
        newUser.phone = '';
      }

      registerUser(newUser);
      setSignupError('');
      setShowSignup(false);
      setUsername(newUsername);
      setPassword(password);
      alert(`Account created locally! Username: ${newUsername}, Password: ${password}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    userType,
    setUserType,
    username,
    setUsername,
    password,
    setPassword,
    loginError,
    setLoginError,
    currentUser,
    setCurrentUser,
    showSignup,
    setShowSignup,
    signupError,
    setSignupError,
    handleLogin,
    handleSignup,
    handleLogout
  };
};
