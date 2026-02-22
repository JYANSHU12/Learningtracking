import { useState, useEffect } from 'react';
import { goalService } from '../../services/goalService';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiFilter } from 'react-icons/hi';

const GoalModal = ({ goal, onClose, onSave }) => {
  const [form, setForm] = useState(goal || {
    title: '', description: '', subject: '', targetDate: '', progress: 0, status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (goal) {
        await goalService.updateGoal(goal._id, form);
        toast.success('Goal updated!');
      } else {
        await goalService.createGoal(form);
        toast.success('Goal created!');
      }
      onSave();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input-field" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field" rows="3" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Subject *</label>
              <input className="input-field" value={form.subject}
                onChange={e => setForm({...form, subject: e.target.value})} required />
            </div>
            <div>
              <label className="label">Target Date *</label>
              <input type="date" className="input-field" value={form.targetDate?.split('T')[0] || ''}
                onChange={e => setForm({...form, targetDate: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Progress ({form.progress}%)</label>
              <input type="range" min="0" max="100" value={form.progress}
                onChange={e => setForm({...form, progress: Number(e.target.value)})}
                className="w-full accent-primary-500" />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals({ search, status: statusFilter, page, limit: 8 });
      setGoals(res.data.data);
      setPagination({ total: res.data.total, pages: res.data.pages });
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchGoals(); }, [search, statusFilter, page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      toast.success('Goal deleted');
      fetchGoals();
    } catch (err) {}
  };

  const statusConfig = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Learning Goals</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total || 0} total goals</p>
        </div>
        <button onClick={() => { setEditGoal(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <HiPlus className="w-5 h-5" />New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input className="input-field pl-10" placeholder="Search goals..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input-field sm:w-40" value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500" /></div>
      ) : goals.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-lg mb-2">No goals found</p>
          <p className="text-sm">Create your first learning goal to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map(goal => (
            <div key={goal._id} className="card group hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusConfig[goal.status]}`}>
                  {goal.status}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditGoal(goal); setShowModal(true); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(goal._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
              <p className="text-sm text-primary-500 font-medium mb-1">{goal.subject}</p>
              {goal.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{goal.description}</p>}
              
              <div className="mt-auto pt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progress</span><span className="font-semibold text-gray-700 dark:text-gray-300">{goal.progress}%</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i+1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                ${page === i+1 ? 'bg-primary-500 text-white' : 'btn-secondary'}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <GoalModal goal={editGoal} onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchGoals(); }} />
      )}
    </div>
  );
}
