import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { goalService } from '../../services/goalService';
import { studyService } from '../../services/studyService';
import { feedbackService } from '../../services/feedbackService';
import { HiFlag, HiClock, HiStar, HiTrendingUp, HiPlus } from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, color, suffix = '' }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">
          {value}<span className="text-base font-normal text-gray-400 ml-1">{suffix}</span>
        </p>
      </div>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ goals: [], sessions: [], feedback: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, sessionsRes, feedbackRes] = await Promise.all([
          goalService.getGoals({ limit: 5 }),
          studyService.getSessions({ limit: 30 }),
          feedbackService.getFeedback()
        ]);
        setStats({
          goals: goalsRes.data.data,
          sessions: sessionsRes.data.data,
          feedback: feedbackRes.data.data
        });
      } catch (err) { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const totalMinutes = stats.sessions.reduce((acc, s) => acc + s.duration, 0);
  const activeGoals = stats.goals.filter(g => g.status === 'active').length;
  const completedGoals = stats.goals.filter(g => g.status === 'completed').length;
  const avgRating = stats.feedback.length
    ? (stats.feedback.reduce((acc, f) => acc + f.rating, 0) / stats.feedback.length).toFixed(1)
    : 'N/A';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Good morning, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your learning overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={HiFlag} label="Active Goals" value={activeGoals} color="bg-blue-500" />
        <StatCard icon={HiClock} label="Study Time" value={Math.round(totalMinutes/60)} suffix="hrs" color="bg-green-500" />
        <StatCard icon={HiTrendingUp} label="Goals Completed" value={completedGoals} color="bg-purple-500" />
        <StatCard icon={HiStar} label="Avg Rating" value={avgRating} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Goals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">Recent Goals</h2>
            <Link to="/student/goals" className="text-primary-500 text-sm font-medium hover:text-primary-600">View all →</Link>
          </div>
          {stats.goals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <HiFlag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No goals yet</p>
              <Link to="/student/goals" className="btn-primary inline-block mt-3 text-sm">
                <HiPlus className="inline w-4 h-4 mr-1" />Create Goal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.goals.slice(0, 4).map(goal => (
                <div key={goal._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{goal.title}</p>
                    <p className="text-xs text-gray-400">{goal.subject}</p>
                    <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg
                    ${goal.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {goal.progress}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Feedback */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">Tutor Feedback</h2>
            <Link to="/student/feedback" className="text-primary-500 text-sm font-medium hover:text-primary-600">View all →</Link>
          </div>
          {stats.feedback.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <HiStar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No feedback yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.feedback.slice(0, 3).map(fb => (
                <div key={fb._id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{fb.tutorId?.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{fb.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
