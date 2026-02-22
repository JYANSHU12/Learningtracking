import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { HiSearch, HiTrash, HiBan, HiCheck } from 'react-icons/hi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search, role: roleFilter, limit: 50 });
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleToggleBlock = async (id) => {
    try {
      const res = await adminService.toggleBlock(id);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {}
  };

  const roleColors = {
    student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    tutor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total users</p>
        </div>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input className="input-field pl-10" placeholder="Search users..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-36" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['User', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg
                        ${user.isBlocked ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== 'admin' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleToggleBlock(user._id)}
                            className={`p-2 rounded-lg transition-colors ${user.isBlocked ? 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500' : 'hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500'}`}
                            title={user.isBlocked ? 'Unblock' : 'Block'}>
                            {user.isBlocked ? <HiCheck className="w-4 h-4" /> : <HiBan className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
