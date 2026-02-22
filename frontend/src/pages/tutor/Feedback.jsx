import { useState } from 'react';
import { feedbackService, usersService } from '../../services';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const TutorFeedback = ({ studentId: propStudentId, onSaved }) => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: propStudentId || '', comment: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  useEffect(() => {
    if (!propStudentId) {
      usersService.getStudents().then(({ data }) => setStudents(data.data));
    }
    feedbackService.getAll().then(({ data }) => setMyFeedbacks(data.data));
  }, [propStudentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await feedbackService.create(form);
      toast.success('Feedback submitted!');
      setForm({ studentId: propStudentId || '', comment: '', rating: 5 });
      if (onSaved) onSaved();
      feedbackService.getAll().then(({ data }) => setMyFeedbacks(data.data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!propStudentId && (
        <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">Give Feedback</h1>
      )}

      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
          {propStudentId ? 'Add Feedback' : 'New Feedback'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!propStudentId && (
            <div>
              <label className="label">Select Student</label>
              <select className="input" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required>
                <option value="">-- Select a student --</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({...form, rating: r})}
                  className={`text-2xl transition-transform hover:scale-110 ${r <= form.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea className="input" rows={4} value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} required placeholder="Write your feedback..." />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            {onSaved && <button type="button" className="btn-secondary" onClick={onSaved}>Cancel</button>}
          </div>
        </form>
      </div>

      {!propStudentId && myFeedbacks.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">My Feedback History</h3>
          <div className="space-y-3">
            {myFeedbacks.map(fb => (
              <div key={fb._id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{fb.studentId?.name}</p>
                  <div className="text-yellow-400 text-sm">{'★'.repeat(fb.rating)}</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorFeedback;
