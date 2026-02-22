import { useState, useEffect } from 'react';
import { studyService } from '../../services/studyService';
import { goalService } from '../../services/goalService';
import { generatePDFReport } from '../../utils/pdfGenerator';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { HiDownload } from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6', '#3b82f6'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [goals, setGoals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, goalsRes, sessionsRes] = await Promise.all([
          studyService.getAnalytics(),
          goalService.getGoals({ limit: 100 }),
          studyService.getSessions({ limit: 100 })
        ]);
        setAnalytics(analyticsRes.data.data);
        setGoals(goalsRes.data.data);
        setSessions(sessionsRes.data.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500" />
    </div>
  );

  const weeklyChartData = {
    labels: analytics?.weeklyData?.map(d => DAYS[d._id - 1] || d._id) || [],
    datasets: [{
      label: 'Study Minutes',
      data: analytics?.weeklyData?.map(d => d.totalMinutes) || [],
      backgroundColor: 'rgba(99,102,241,0.8)',
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  const monthlyChartData = {
    labels: analytics?.monthlyData?.map(d => d._id?.slice(5)) || [],
    datasets: [{
      label: 'Minutes Studied',
      data: analytics?.monthlyData?.map(d => d.totalMinutes) || [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4
    }]
  };

  const subjectChartData = {
    labels: analytics?.subjectData?.map(d => d._id) || [],
    datasets: [{
      data: analytics?.subjectData?.map(d => d.totalMinutes) || [],
      backgroundColor: COLORS,
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.raw} minutes` } } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } }
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '65%',
    plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 8 } } }
  };

  const handleDownloadPDF = () => {
    generatePDFReport(goals, sessions, analytics || {});
    toast?.success('Generating PDF...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Your learning insights</p>
        </div>
        <button onClick={handleDownloadPDF} className="btn-primary flex items-center gap-2">
          <HiDownload className="w-5 h-5" />Download PDF
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: Math.round(sessions.reduce((a,s) => a+s.duration, 0)/60), suffix: 'hrs' },
          { label: 'Sessions', value: sessions.length, suffix: '' },
          { label: 'Active Goals', value: goals.filter(g => g.status === 'active').length, suffix: '' },
          { label: 'Avg Progress', value: goals.length ? Math.round(goals.reduce((a,g) => a+g.progress,0)/goals.length) : 0, suffix: '%' }
        ].map(({ label, value, suffix }) => (
          <div key={label} className="card text-center">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-3xl font-display font-bold text-primary-500 mt-1">{value}<span className="text-base text-gray-400 ml-1">{suffix}</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <div className="card">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Weekly Study Time</h2>
          {analytics?.weeklyData?.length > 0
            ? <Bar data={weeklyChartData} options={chartOptions} />
            : <div className="flex items-center justify-center h-48 text-gray-400">No data for this week</div>
          }
        </div>

        {/* Subject Doughnut */}
        <div className="card">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Subject Distribution</h2>
          {analytics?.subjectData?.length > 0
            ? <div className="max-w-xs mx-auto"><Doughnut data={subjectChartData} options={doughnutOptions} /></div>
            : <div className="flex items-center justify-center h-48 text-gray-400">No study sessions yet</div>
          }
        </div>
      </div>

      {/* Monthly Line Chart */}
      <div className="card">
        <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">30-Day Progress Trend</h2>
        {analytics?.monthlyData?.length > 0
          ? <Line data={monthlyChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, tooltip: { callbacks: { label: ctx => `${ctx.raw} min` } } } }} />
          : <div className="flex items-center justify-center h-48 text-gray-400">No data for the past 30 days</div>
        }
      </div>
    </div>
  );
}
