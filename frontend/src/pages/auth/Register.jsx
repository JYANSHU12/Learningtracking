import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register(form);
      login(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      const routes = { student: '/student/dashboard', tutor: '/tutor/dashboard' };
      navigate(routes[res.data.user.role]);
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/30">L</div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-gray-500 mt-2">Start your learning journey</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input-field" placeholder="Your full name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'tutor'].map(role => (
                  <button key={role} type="button"
                    onClick={() => setForm({...form, role})}
                    className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition-all duration-200
                      ${form.role === role ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
