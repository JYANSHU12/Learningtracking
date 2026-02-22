import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const routes = { student: '/student/dashboard', tutor: '/tutor/dashboard', admin: '/admin/dashboard' };
      navigate(routes[res.data.user.role]);
    } catch (err) {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/30">L</div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your learning account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input-field" placeholder="Your password"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Test Credentials:</p>
            <p>Student: student@tracker.com / student123</p>
            <p>Tutor: tutor@tracker.com / tutor123</p>
            <p>Admin: admin@tracker.com / admin123</p>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
