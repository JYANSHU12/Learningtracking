import { useState, useEffect } from 'react';
import { studyService } from '../../services/studyService';
import { useTimer } from '../../hooks/useTimer';
import toast from 'react-hot-toast';
import { HiPlay, HiPause, HiRefresh, HiPlus } from 'react-icons/hi';

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science', 'JavaScript', 'React', 'Node.js', 'Python', 'Data Science', 'Other'];

export default function StudySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManualLog, setShowManualLog] = useState(false);
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [manualForm, setManualForm] = useState({ subject: '', duration: '', date: new Date().toISOString().split('T')[0], notes: '' });
  const { isRunning, elapsed, start, pause, reset, formatTime } = useTimer();

  const fetchSessions = async () => {
    try {
      const res = await studyService.getSessions({ limit: 20 });
      setSessions(res.data.data);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const saveTimerSession = async () => {
    if (elapsed < 60) { toast.error('Session must be at least 1 minute'); return; }
    if (!subject) { toast.error('Select a subject first'); return; }
    try {
      await studyService.createSession({ subject, duration: Math.floor(elapsed / 60), notes, date: new Date().toISOString() });
      toast.success('Session saved!');
      reset();
      setSubject('');
      setNotes('');
      fetchSessions();
    } catch (err) {}
  };

  const saveManualSession = async (e) => {
    e.preventDefault();
    try {
      await studyService.createSession(manualForm);
      toast.success('Session logged!');
      setShowManualLog(false);
      setManualForm({ subject: '', duration: '', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchSessions();
    } catch (err) {}
  };

  const formatDuration = (mins) => {
    if (mins >= 60) return `${Math.floor(mins/60)}h ${mins%60}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Study Sessions</h1>
          <p className="text-gray-500 text-sm mt-1">Track your study time</p>
        </div>
        <button onClick={() => setShowManualLog(!showManualLog)} className="btn-secondary flex items-center gap-2">
          <HiPlus className="w-5 h-5" />Manual Log
        </button>
      </div>

      {/* Timer Card */}
      <div className="card">
        <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-6">Study Timer</h2>
        <div className="text-center mb-6">
          <div className={`text-6xl font-display font-bold tracking-wider transition-colors
            ${isRunning ? 'text-primary-500' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(elapsed)}
          </div>
          {isRunning && <div className="flex justify-center mt-3"><span className="flex items-center gap-1.5 text-sm text-green-500 font-medium"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Recording</span></div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="label">Subject *</label>
            <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes (optional)</label>
            <input className="input-field" placeholder="What did you study?"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <button onClick={start} className="btn-primary flex items-center gap-2 px-8">
              <HiPlay className="w-5 h-5" />{elapsed > 0 ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button onClick={pause} className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-8 py-2 rounded-xl flex items-center gap-2 transition-all">
              <HiPause className="w-5 h-5" />Pause
            </button>
          )}
          {elapsed > 0 && (
            <>
              <button onClick={saveTimerSession} className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-xl transition-all">
                Save Session
              </button>
              <button onClick={reset} className="btn-secondary flex items-center gap-2">
                <HiRefresh className="w-5 h-5" />Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Manual Log Form */}
      {showManualLog && (
        <div className="card border-2 border-primary-100 dark:border-primary-900/30">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Log Manual Session</h2>
          <form onSubmit={saveManualSession} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Subject *</label>
              <select className="input-field" value={manualForm.subject}
                onChange={e => setManualForm({...manualForm, subject: e.target.value})} required>
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Duration (minutes) *</label>
              <input type="number" min="1" className="input-field" placeholder="e.g. 45"
                value={manualForm.duration} onChange={e => setManualForm({...manualForm, duration: e.target.value})} required />
            </div>
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input-field" value={manualForm.date}
                onChange={e => setManualForm({...manualForm, date: e.target.value})} required />
            </div>
            <div>
              <label className="label">Notes</label>
              <input className="input-field" placeholder="Optional notes"
                value={manualForm.notes} onChange={e => setManualForm({...manualForm, notes: e.target.value})} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowManualLog(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Log Session</button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="card">
        <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Recent Sessions</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" /></div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No sessions logged yet. Start studying!</p>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{s.subject}</p>
                    <p className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary-500">{formatDuration(s.duration)}</p>
                  {s.notes && <p className="text-xs text-gray-400 max-w-xs truncate">{s.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
