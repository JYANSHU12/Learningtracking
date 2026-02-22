import { useEffect, useState } from 'react';
import { feedbackService } from '../../services';
import toast from 'react-hot-toast';

const StudentFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackService.getAll()
      .then(({ data }) => setFeedback(data.data))
      .catch(() => toast.error('Failed to load feedback'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">Tutor Feedback</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{feedback.length} feedback received</p>
      </div>

      {feedback.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-slate-500 dark:text-slate-400">No feedback yet. Keep studying!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map(fb => (
            <div key={fb._id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                    {fb.tutorId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{fb.tutorId?.name}</p>
                    <p className="text-xs text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < fb.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}>★</span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{fb.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentFeedback;
