import { useState, useEffect } from 'react';
import { feedbackService } from '../../services/feedbackService';
import toast from 'react-hot-toast';
import { HiUsers, HiStar, HiClock, HiFlag } from 'react-icons/hi';

const FeedbackModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState({ comment: '', rating: 5 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackService.createFeedback({ studentId: student._id, ...form });
      toast.success('Feedback submitted!');
      onSave();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
            Feedback for {student.name}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(r => (
                <button key={r} type="button" onClick={() => setForm({...form, rating: r})}>
                  <HiStar className={`w-8 h-8 transition-colors ${r <= form.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Comment *</label>
            <textarea className="input-field" rows="4" placeholder="Write your feedback..."
              value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatsModal = ({ student, stats, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">{student.name} Stats</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: HiClock, label: 'Total Hours', value: Math.round(stats.totalStudyMinutes/60), suffix: 'h', color: 'bg-blue-500' },
            { icon: HiFlag, label: 'Goals', value: stats.totalGoals, suffix: '', color: 'bg-green-500' },
            { icon: HiFlag, label: 'Completed', value: stats.completedGoals, suffix: '', color: 'bg-purple-500' },
            { icon: HiStar, label: 'Sessions', value: stats.recentSessions?.length || 0, suffix: '', color: 'bg-amber-500' }
          ].map(({ icon: Icon, label, value, suffix, color }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}<span className="text-sm text-gray-400">{suffix}</span></p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
        {stats.recentSessions?.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Recent Sessions</h3>
            <div className="space-y-2">
              {stats.recentSessions.slice(0,5).map(s => (
                <div key={s._id} className="flex justify-between text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-gray-700 dark:text-gray-300">{s.subject}</span>
                  <span className="text-primary-500 font-medium">{s.duration}min</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function TutorDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [statsModal, setStatsModal] = useState(null);
  const [studentStats, setStudentStats] = useState(null);

  useEffect(() => {
    feedbackService.getStudents().then(res => {
      setStudents(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const viewStats = async (student) => {
    try {
      const res = await feedbackService.getStudentStats(student._id);
      setStudentStats(res.data.data);
      setStatsModal(student);
    } catch (err) {}
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Students</h1>
        <p className="text-gray-500 text-sm mt-1">{students.length} students enrolled</p>
      </div>

      {students.length === 0 ? (
        <div className="card text-center py-12">
          <HiUsers className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
          <p className="text-gray-400">No students assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {students.map(student => {
            const daysSinceActivity = student.lastActivity
              ? Math.floor((Date.now() - new Date(student.lastActivity)) / (1000*60*60*24))
              : null;

            return (
              <div key={student._id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                    <p className="text-sm text-gray-400">{student.email}</p>
                  </div>
                </div>
                {daysSinceActivity !== null && (
                  <div className={`text-xs px-2.5 py-1 rounded-lg inline-flex items-center gap-1 mb-4
                    ${daysSinceActivity >= 3 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${daysSinceActivity >= 3 ? 'bg-red-500' : 'bg-green-500'}`} />
                    {daysSinceActivity === 0 ? 'Active today' : `${daysSinceActivity}d since activity`}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => viewStats(student)} className="btn-secondary flex-1 text-sm py-2">View Stats</button>
                  <button onClick={() => setFeedbackModal(student)} className="btn-primary flex-1 text-sm py-2">Add Feedback</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {feedbackModal && (
        <FeedbackModal student={feedbackModal} onClose={() => setFeedbackModal(null)}
          onSave={() => setFeedbackModal(null)} />
      )}

      {statsModal && studentStats && (
        <StatsModal student={statsModal} stats={studentStats} onClose={() => { setStatsModal(null); setStudentStats(null); }} />
      )}
    </div>
  );
}
