import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  HiHome, HiFlag, HiClock, HiChartBar, HiChat, HiUsers, HiChartPie, 
  HiSun, HiMoon, HiLogout, HiMenuAlt2, HiX 
} from 'react-icons/hi';
import { useState } from 'react';

const navLinks = {
  student: [
    { to: '/student/dashboard', icon: HiHome, label: 'Dashboard' },
    { to: '/student/goals', icon: HiFlag, label: 'Goals' },
   { to: '/student/study-sessions', icon: HiClock, label: 'Study Sessions' },
    { to: '/student/analytics', icon: HiChartBar, label: 'Analytics' },
    { to: '/student/feedback', icon: HiChat, label: 'Feedback' }
  ],
  tutor: [
    { to: '/tutor/dashboard', icon: HiUsers, label: 'Students' }
  ],
  admin: [
    { to: '/admin/dashboard', icon: HiChartPie, label: 'Analytics' },
    { to: '/admin/users', icon: HiUsers, label: 'Users' }
  ]
};

export default function Layout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = navLinks[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = { student: 'bg-blue-500', tutor: 'bg-green-500', admin: 'bg-purple-500' };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">L</div>
            <div>
              <h1 className="font-display font-bold text-gray-900 dark:text-white text-sm">Learning</h1>
              <p className="text-xs text-gray-400">Progress Tracker</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 mx-3 mt-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${roleColors[user?.role]} flex items-center justify-center text-white font-bold text-sm`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
            {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
            <HiLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          <span className="font-display font-semibold text-gray-900 dark:text-white">Learning Tracker</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
