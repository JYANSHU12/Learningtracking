import { useEffect, useState } from 'react';
import { analyticsService } from '../../services';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAdminAnalytics()
      .then(({ data }) => setData(data.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );

  const completionRate = data?.totalGoals > 0 
    ? Math.round((data.completedGoals / data.totalGoals) * 100) 
    : 0;

  const barData = {
    labels: data?.platformMonthly?.map(m => `${m.month} ${m.year}`) || [],
    datasets: [{
      label: 'Study Hours',
      data: data?.platformMonthly?.map(m => m.hours) || [],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 8
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">Platform Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: data?.totalUsers || 0, icon: '👥' },
          { label: 'Total Sessions', value: data?.totalSessions || 0, icon: '📚' },
          { label: 'Total Goals', value: data?.totalGoals || 0, icon: '🎯' },
          { label: 'Goal Completion Rate', value: `${completionRate}%`, icon: '✅' }
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-display font-bold text-2xl text-primary-600 dark:text-primary-400">{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">User Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Students', value: data?.totalStudents, total: data?.totalUsers, color: 'bg-blue-500' },
              { label: 'Tutors', value: data?.totalTutors, total: data?.totalUsers, color: 'bg-emerald-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>{item.label}</span>
                  <span>{item.value} ({item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Goals Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Completed Goals', value: data?.completedGoals, total: data?.totalGoals, color: 'bg-emerald-500' },
              { label: 'Active Goals', value: (data?.totalGoals || 0) - (data?.completedGoals || 0), total: data?.totalGoals, color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>{item.label}</span>
                  <span>{item.value} ({item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data?.platformMonthly?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Monthly Platform Study Hours</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }} />
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
