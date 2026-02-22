import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import Goals from './pages/student/Goals';
import StudySessions from './pages/student/StudySessions';
import Analytics from './pages/student/Analytics';
import StudentFeedback from './pages/student/Feedback';

// Tutor pages
import TutorDashboard from './pages/tutor/Dashboard';
import TutorStudents from './pages/tutor/Students';
import TutorFeedback from './pages/tutor/Feedback';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';

const StudentLayout = () => (
  <ProtectedRoute roles={['student']}>
    <Layout />
  </ProtectedRoute>
);

const TutorLayout = () => (
  <ProtectedRoute roles={['tutor']}>
    <Layout />
  </ProtectedRoute>
);

const AdminLayout = () => (
  <ProtectedRoute roles={['admin']}>
    <Layout />
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-4">🚫</p>
                <h1 className="text-2xl font-bold text-slate-800">Unauthorized</h1>
                <p className="text-slate-500 mt-2">You don't have permission to access this page.</p>
              </div>
            </div>
          } />

          {/* Student routes */}
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/goals" element={<Goals />} />
            <Route path="/student/study-sessions" element={<StudySessions />} />
            <Route path="/student/analytics" element={<Analytics />} />
            <Route path="/student/feedback" element={<StudentFeedback />} />
          </Route>

          {/* Tutor routes */}
          <Route element={<TutorLayout />}>
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/students" element={<TutorStudents />} />
            <Route path="/tutor/feedback" element={<TutorFeedback />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;