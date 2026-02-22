import { useState, useEffect } from 'react';
import { feedbackService } from '../../services/feedbackService';
import { HiStar } from 'react-icons/hi';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackService.getFeedback().then(res => {
      setFeedback(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Tutor Feedback</h1>
        <p className="text-gray-500 text-sm mt-1">{feedback.length} feedback received</p>
      </div>

      {feedback.length === 0 ? (
        <div className="card text-center py-12">
          <HiStar className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
          <h3 className="text-gray-400 font-medium">No feedback yet</h3>
          <p className="text-gray-400 text-sm mt-1">Your tutor hasn't left any feedback yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.map(fb => (
            <div key={fb._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{fb.tutorId?.name}</p>
                  <p className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                  <span className="ml-1 text-sm font-bold text-amber-500">{fb.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{fb.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
