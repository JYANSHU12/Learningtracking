import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { HiUsers, HiFlag, HiClock, HiBan } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card">
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics().then(res => {
      setData(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500" />
    </div>
  );

  const activityChart = {
    labels: data?.dailyActivity?.map(d => d._id?.slice(5)) || [],
    datasets: [{
      label: 'Study Minutes',
      data: data?.dailyActivity?.map(d => d.totalMinutes) || [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1'
    }]
  };

  const subjectChart = {
    labels: data?.topSubjects?.map(s => s._id) || [],
    datasets: [{
      label: 'Minutes',
      data: data?.topSubjects?.map(s => s.totalMinutes) || [],
      backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of all platform activity</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={HiUsers} label="Total Users" value={data?.stats?.totalUsers || 0} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={HiFlag} label="Total Goals" value={data?.stats?.totalGoals || 0} color="text-green-500" bg="bg-green-50 dark:bg-green-900/20" />
        <StatCard icon={HiClock} label="Study Sessions" value={data?.stats?.totalSessions || 0} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard icon={HiBan} label="Blocked Users" value={data?.stats?.blockedUsers || 0} color="text-red-500" bg="bg-red-50 dark:bg-red-900/20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Students', value: data?.stats?.totalStudents || 0, bg: 'bg-blue-500' },
          { label: 'Tutors', value: data?.stats?.totalTutors || 0, bg: 'bg-green-500' },
          { label: 'Admins', value: (data?.stats?.totalUsers || 0) - (data?.stats?.totalStudents || 0) - (data?.stats?.totalTutors || 0), bg: 'bg-purple-500' }
        ].map(({ label, value, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-white font-bold`}>{value}</div>
            <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Platform Activity (30 Days)</h2>
          {data?.dailyActivity?.length > 0
            ? <Line data={activityChart} options={chartOptions} />
            : <div className="flex items-center justify-center h-48 text-gray-400">No activity data</div>
          }
        </div>
        <div className="card">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Top Subjects</h2>
          {data?.topSubjects?.length > 0
            ? <Bar data={subjectChart} options={chartOptions} />
            : <div className="flex items-center justify-center h-48 text-gray-400">No data</div>
          }
        </div>
      </div>
    </div>
  );
}
