import { useEffect, useState } from 'react';
import { usersService } from '../../services';
import toast from 'react-hot-toast';
import TutorFeedback from './Feedback';

const TutorStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    usersService.getStudents()
      .then(({ data }) => setStudents(data.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const viewStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const { data } = await usersService.getStudentDetail(student._id);
      setStudentDetail(data.data);
    } catch {
      toast.error('Failed to load student details');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100">My Students</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-1 card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">{students.length} Students</h3>
          <div className="space-y-2">
            {students.map(s => (
              <button
                key={s._id}
                onClick={() => viewStudent(s)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedStudent?._id === s._id
                    ? 'bg-primary-50 dark:bg-primary-900/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold text-sm shrink-0">
                  {s.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{s.name}</p>
                  <p className="text-xs text-slate-400 truncate">{s.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Student Detail */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="card p-12 text-center text-slate-400">
              <p className="text-4xl mb-3">👆</p>
              <p>Select a student to view their progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold text-lg">
                      {selectedStudent.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{selectedStudent.name}</h3>
                      <p className="text-sm text-slate-400">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    className="btn-primary text-sm"
                  >
                    + Add Feedback
                  </button>
                </div>

                {studentDetail && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Goals', value: studentDetail.stats.totalGoals },
                      { label: 'Completed', value: studentDetail.stats.completedGoals },
                      { label: 'Study Hours', value: studentDetail.stats.totalStudyHours },
                      { label: 'Total Minutes', value: studentDetail.stats.totalStudyMinutes }
                    ].map(stat => (
                      <div key={stat.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                        <div className="font-bold text-lg text-primary-600 dark:text-primary-400">{stat.value}</div>
                        <div className="text-xs text-slate-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {showFeedbackForm && (
                <TutorFeedback studentId={selectedStudent._id} onSaved={() => setShowFeedbackForm(false)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorStudents;
