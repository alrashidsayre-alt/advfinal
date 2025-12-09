import { useState, useEffect } from 'react';

export default function CreateWorkout({ onSuccess }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [formData, setFormData] = useState({
    session_date: new Date().toISOString().split('T')[0],
    duration_minutes: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      if (response.ok) {
        setExercises(data.exercises);
      }
    } catch (error) {
      console.error('Failed to load exercises');
    }
  };

  const addExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      { exercise_id: '', sets: '', reps: '', weight: '', notes: '' }
    ]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  };

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          exercises: selectedExercises.filter(ex => ex.exercise_id)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Workout created successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setMessage(data.error || 'Failed to create workout');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getExerciseName = (id) => {
    const exercise = exercises.find(ex => ex.id == id);
    return exercise ? exercise.name : '';
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Create New Workout</h2>
        <p className="text-gray-400">Log your training session step by step</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-red-500' : 'text-gray-600'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 1 ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600'}`}>
            1
          </div>
          <span className="font-semibold hidden sm:inline">Details</span>
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-red-500' : 'text-gray-600'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 2 ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600'}`}>
            2
          </div>
          <span className="font-semibold hidden sm:inline">Exercises</span>
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
        <div className={`flex items-center gap-3 ${step >= 3 ? 'text-red-500' : 'text-gray-600'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 3 ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600'}`}>
            3
          </div>
          <span className="font-semibold hidden sm:inline">Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📝</span> Workout Details
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  📅 Workout Date
                </label>
                <input
                  type="date"
                  value={formData.session_date}
                  onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white text-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  ⏱️ Duration (minutes) - Optional
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  min="0"
                  max="600"
                  placeholder="e.g., 60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  💭 Session Notes - Optional
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  rows="4"
                  placeholder="How did you feel? Any achievements? PRs?"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-8 bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-orange-400 transition-all shadow-lg transform hover:scale-[1.02]"
            >
              Next: Add Exercises →
            </button>
          </div>
        )}

        {/* Step 2: Add Exercises */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">💪</span> Add Exercises
                </h3>
                <button
                  type="button"
                  onClick={addExercise}
                  className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-emerald-400 transition-all font-bold shadow-lg flex items-center gap-2"
                >
                  <span className="text-xl">+</span> Add Exercise
                </button>
              </div>

              {selectedExercises.length === 0 ? (
                <div className="text-center py-12 bg-gray-900 rounded-xl border-2 border-dashed border-gray-700">
                  <p className="text-6xl mb-4">🏋️</p>
                  <p className="text-gray-400 text-lg">No exercises added yet</p>
                  <p className="text-gray-500 mt-2">Click "Add Exercise" to start building your workout</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedExercises.map((ex, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-xl border-2 border-gray-700 hover:border-red-500/50 transition">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="text-red-500 hover:text-red-400 font-bold text-xl"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-4">
                        <select
                          value={ex.exercise_id}
                          onChange={(e) => updateExercise(index, 'exercise_id', e.target.value)}
                          className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white text-lg focus:ring-2 focus:ring-red-500"
                          required
                        >
                          <option value="">🎯 Select Exercise</option>
                          {exercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>
                              {exercise.name} - {exercise.muscle_group}
                            </option>
                          ))}
                        </select>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-2">Sets</label>
                            <input
                              type="number"
                              placeholder="3"
                              value={ex.sets}
                              onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white text-center text-lg font-bold placeholder-gray-600 focus:ring-2 focus:ring-red-500"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-2">Reps</label>
                            <input
                              type="number"
                              placeholder="10"
                              value={ex.reps}
                              onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white text-center text-lg font-bold placeholder-gray-600 focus:ring-2 focus:ring-red-500"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-2">Weight (kg)</label>
                            <input
                              type="number"
                              placeholder="50"
                              value={ex.weight}
                              onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                              className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white text-center text-lg font-bold placeholder-gray-600 focus:ring-2 focus:ring-red-500"
                              step="0.5"
                              min="0"
                            />
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Exercise notes (optional)"
                          value={ex.notes}
                          onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                          className="w-full px-4 py-3 bg-black border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all border-2 border-gray-700"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={selectedExercises.length === 0}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Review Workout →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">✅</span> Review Your Workout
              </h3>

              <div className="space-y-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-bold text-red-500 mb-4">Session Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-lg font-semibold">
                        {new Date(formData.session_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {formData.duration_minutes && (
                      <div>
                        <p className="text-gray-400 text-sm">Duration</p>
                        <p className="text-lg font-semibold">{formData.duration_minutes} minutes</p>
                      </div>
                    )}
                  </div>
                  {formData.notes && (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm">Notes</p>
                      <p className="text-white italic mt-1">"{formData.notes}"</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-bold text-red-500 mb-4">Exercises ({selectedExercises.length})</h4>
                  <div className="space-y-3">
                    {selectedExercises.map((ex, index) => (
                      <div key={index} className="bg-black rounded-lg p-4 border border-gray-700">
                        <div className="flex items-start gap-3">
                          <span className="bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-lg">{getExerciseName(ex.exercise_id)}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              {ex.sets && <span className="text-red-400 font-semibold">{ex.sets} sets</span>}
                              {ex.reps && <span className="text-orange-400 font-semibold">{ex.reps} reps</span>}
                              {ex.weight && <span className="text-green-400 font-semibold">{ex.weight} kg</span>}
                            </div>
                            {ex.notes && <p className="text-gray-400 text-sm mt-2 italic">{ex.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-center ${
                message.includes('success') 
                  ? 'bg-green-900/30 border border-green-500 text-green-400' 
                  : 'bg-red-900/30 border border-red-500 text-red-400'
              }`}>
                {message.includes('success') ? '✅' : '⚠️'} {message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all border-2 border-gray-700"
              >
                ← Edit Exercises
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-[1.02]"
              >
                {loading ? '⏳ Saving...' : '🔥 Save Workout'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}