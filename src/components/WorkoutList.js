import { useState, useEffect } from 'react';

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setWorkouts(data.sessions);
      } else {
        setError(data.error || 'Failed to load workouts');
      }
    } catch (error) {
      setError('An error occurred while loading workouts');
    } finally {
      setLoading(false);
    }
  };

  const viewWorkoutDetails = async (workoutId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/workouts/${workoutId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error loading workout: ${errorData.error || 'Unknown error'}`);
        setWorkoutDetails([]);
        setSelectedWorkout(workouts.find(w => w.id === workoutId));
        return;
      }
      
      const data = await response.json();
      setWorkoutDetails(data.exercises || []);
      setSelectedWorkout(workouts.find(w => w.id === workoutId));
    } catch (error) {
      alert(`Error: ${error.message}`);
      setWorkoutDetails([]);
      setSelectedWorkout(workouts.find(w => w.id === workoutId));
    }
  };

  const deleteWorkout = async (workoutId, e) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return;
    }

    setDeleting(workoutId);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setWorkouts(workouts.filter(w => w.id !== workoutId));
      } else {
        const data = await response.json();
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred while deleting the workout');
    } finally {
      setDeleting(null);
    }
  };

  const getFilteredWorkouts = () => {
    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return workouts.filter(w => new Date(w.session_date) >= weekAgo);
    }
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return workouts.filter(w => new Date(w.session_date) >= monthAgo);
    }
    return workouts;
  };

  const filteredWorkouts = getFilteredWorkouts();

  const getTotalStats = () => {
    const total = filteredWorkouts.length;
    const totalMinutes = filteredWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0);
    const avgDuration = total > 0 ? Math.round(totalMinutes / total) : 0;
    
    return { total, totalMinutes, avgDuration };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        <p className="mt-4 text-gray-400 text-lg">Loading workouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-400 p-6 rounded-lg">
        ⚠️ {error}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 shadow-2xl">
          <div className="text-8xl mb-6 animate-pulse">💪</div>
          <h3 className="text-3xl font-bold text-white mb-3">No Workouts Yet!</h3>
          <p className="text-gray-400 text-lg mb-6">Your fitness journey starts here</p>
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-bold inline-block">
            Click "New Workout" to begin tracking
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Training Log</h2>
            <p className="text-white/90 text-lg">Track your progress and crush your goals</p>
          </div>
          
          <div className="flex gap-2 bg-white/20 backdrop-blur p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                filter === 'all' 
                  ? 'bg-white text-red-600 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                filter === 'month' 
                  ? 'bg-white text-red-600 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                filter === 'week' 
                  ? 'bg-white text-red-600 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Total Workouts</p>
              <p className="text-4xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium mb-1">Total Time</p>
              <p className="text-4xl font-bold text-white">{stats.totalMinutes}</p>
              <p className="text-purple-200 text-xs">minutes</p>
            </div>
            <div className="text-5xl">⏱️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium mb-1">Avg Duration</p>
              <p className="text-4xl font-bold text-white">{stats.avgDuration}</p>
              <p className="text-green-200 text-xs">minutes</p>
            </div>
            <div className="text-5xl">📈</div>
          </div>
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-lg">No workouts found for this period</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <div 
              key={workout.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 hover:border-red-500/50 transition-all group cursor-pointer overflow-hidden"
              onClick={() => viewWorkoutDetails(workout.id)}
            >
              <div className="flex items-center gap-4 p-6">
                {/* Date Badge */}
                <div className="flex-shrink-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl p-4 text-center min-w-[80px] shadow-lg">
                  <p className="text-white text-3xl font-bold leading-none">
                    {new Date(workout.session_date).getDate()}
                  </p>
                  <p className="text-white/90 text-xs mt-1 uppercase">
                    {new Date(workout.session_date).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition">
                    {workout.plan_name || '🏋️ Custom Workout'}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-lg">📅</span>
                      <span className="font-medium">
                        {new Date(workout.session_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {workout.duration_minutes && (
                      <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full">
                        <span className="text-orange-500 text-lg">⏱️</span>
                        <span className="text-white font-bold">{workout.duration_minutes}</span>
                        <span className="text-gray-400 text-sm">min</span>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-1 rounded-full">
                      <span className="text-white text-sm font-bold">✓ COMPLETED</span>
                    </div>
                  </div>

                  {workout.notes && (
                    <div className="mt-3 bg-gray-900 rounded-lg p-3 border border-gray-700">
                      <p className="text-gray-300 italic text-sm">"{workout.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-col gap-2">
                  <button
                    onClick={(e) => deleteWorkout(workout.id, e)}
                    disabled={deleting === workout.id}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-all disabled:opacity-50 shadow-lg"
                    title="Delete workout"
                  >
                    {deleting === workout.id ? '⏳' : '🗑️'}
                  </button>
                  
                  <div className="text-gray-500 text-2xl">
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWorkout && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedWorkout(null)}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto border-2 border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-700">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-lg p-3">
                    <span className="text-3xl">💪</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{selectedWorkout.plan_name || 'Workout Session'}</h3>
                    <p className="text-gray-400 text-lg">
                      {new Date(selectedWorkout.session_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWorkout(null)}
                className="text-gray-400 hover:text-white text-4xl leading-none transition bg-gray-900 rounded-lg p-2 hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {selectedWorkout.duration_minutes && (
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-5 border border-purple-700/50">
                  <p className="text-purple-300 text-sm mb-1">Total Duration</p>
                  <p className="text-3xl font-bold text-white">{selectedWorkout.duration_minutes} <span className="text-lg text-purple-300">min</span></p>
                </div>
              )}
              
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-5 border border-blue-700/50">
                <p className="text-blue-300 text-sm mb-1">Exercises</p>
                <p className="text-3xl font-bold text-white">{workoutDetails.length} <span className="text-lg text-blue-300">total</span></p>
              </div>
            </div>

            {selectedWorkout.notes && (
              <div className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wider">Session Notes</p>
                <p className="text-white text-lg italic">"{selectedWorkout.notes}"</p>
              </div>
            )}

            <div>
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🏋️</span> Exercise Details
              </h4>
              
              {workoutDetails.length > 0 ? (
                <div className="space-y-3">
                  {workoutDetails.map((exercise, index) => (
                    <div key={index} className="bg-gray-900 rounded-xl p-5 border border-gray-700 hover:border-red-500/50 transition">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="text-xl font-bold text-white mb-3">{exercise.exercise_name}</h5>
                          
                          <div className="grid grid-cols-3 gap-4">
                            {exercise.sets > 0 && (
                              <div className="bg-black/50 rounded-lg p-3 text-center border border-gray-700">
                                <p className="text-gray-400 text-xs mb-1">Sets</p>
                                <p className="text-2xl font-bold text-red-500">{exercise.sets}</p>
                              </div>
                            )}
                            {exercise.reps > 0 && (
                              <div className="bg-black/50 rounded-lg p-3 text-center border border-gray-700">
                                <p className="text-gray-400 text-xs mb-1">Reps</p>
                                <p className="text-2xl font-bold text-orange-500">{exercise.reps}</p>
                              </div>
                            )}
                            {exercise.weight && (
                              <div className="bg-black/50 rounded-lg p-3 text-center border border-gray-700">
                                <p className="text-gray-400 text-xs mb-1">Weight</p>
                                <p className="text-2xl font-bold text-green-500">{exercise.weight} <span className="text-sm">kg</span></p>
                              </div>
                            )}
                          </div>
                          
                          {exercise.notes && (
                            <p className="text-gray-400 text-sm mt-3 italic bg-black/30 p-2 rounded">💬 {exercise.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-700">
                  <p className="text-gray-500 text-lg">No exercise details recorded</p>
                  <p className="text-gray-600 text-sm mt-2">This workout was completed without logging specific exercises</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}