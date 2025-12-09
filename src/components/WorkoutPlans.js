import { useState, useEffect } from 'react';

export default function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showPublic, setShowPublic] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [showPublic]);

  useEffect(() => {
    if (selectedPlan) {
      fetchComments(selectedPlan.id);
    }
  }, [selectedPlan]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/plans?public=${showPublic}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setPlans(data.plans);
    } catch (error) {
      console.error('Failed to load plans');
    }
  };

  const fetchComments = async (planId) => {
    try {
      const response = await fetch(`/api/comments?plan_id=${planId}`);
      const data = await response.json();
      if (response.ok) setComments(data.comments);
    } catch (error) {
      console.error('Failed to load comments');
    }
  };

  const createPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowCreate(false);
        setFormData({ name: '', description: '', is_public: false });
        fetchPlans();
      }
    } catch (error) {
      console.error('Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workout_plan_id: selectedPlan.id,
          comment_text: newComment
        })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments(selectedPlan.id);
      }
    } catch (error) {
      console.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-white">Workout Plans</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPublic(!showPublic)}
            className={`px-5 py-2 rounded-lg transition-all font-semibold ${
              showPublic 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' 
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            {showPublic ? '🌍 Public Plans' : '👤 My Plans'}
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-500 hover:to-emerald-400 transition-all font-semibold shadow-lg"
          >
            {showCreate ? '✕ Cancel' : '+ New Plan'}
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">Create Workout Plan</h3>
          <form onSubmit={createPlan} className="space-y-4">
            <input
              type="text"
              placeholder="Plan Name (e.g., Full Body Strength)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500"
              required
            />
            <textarea
              placeholder="Description (goals, focus areas, etc.)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500"
              rows="3"
            />
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="w-5 h-5 accent-red-500"
              />
              <span className="text-gray-300 group-hover:text-white transition">Make this plan public (others can view and comment)</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-lg hover:from-red-500 hover:to-orange-400 disabled:opacity-50 font-bold transition-all shadow-lg"
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 hover:shadow-2xl hover:shadow-red-900/20 transition-all border border-gray-700 hover:border-red-500/50 cursor-pointer group"
            onClick={() => setSelectedPlan(plan)}
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition">{plan.name}</h3>
            <p className="text-sm text-gray-400 mb-3">by <span className="text-red-500 font-semibold">{plan.username}</span></p>
            {plan.description && (
              <p className="text-gray-300 mb-4 line-clamp-2">{plan.description}</p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-gray-900 text-gray-400 px-3 py-1 rounded-full">💬 {plan.comment_count} comments</span>
              {plan.is_public && <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">Public</span>}
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-gray-300 text-xl">No plans found</p>
          <p className="text-gray-500 mt-2">Create your first workout plan!</p>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
             onClick={() => setSelectedPlan(null)}>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedPlan.name}</h3>
                <p className="text-gray-400">by <span className="text-red-500 font-semibold">{selectedPlan.username}</span></p>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)} 
                className="text-gray-400 hover:text-white text-3xl leading-none transition"
              >
                ✕
              </button>
            </div>

            {selectedPlan.description && (
              <p className="text-gray-300 mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">{selectedPlan.description}</p>
            )}

            <div className="border-t border-gray-700 pt-6">
              <h4 className="font-bold text-xl text-white mb-4">💬 Comments ({comments.length})</h4>
              <form onSubmit={addComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 mb-3"
                  rows="2"
                />
                <button type="submit" className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-red-500 hover:to-orange-400 font-semibold transition-all shadow-lg">
                  Post Comment
                </button>
              </form>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      {comment.profile_picture ? (
                        <img src={comment.profile_picture} alt="" className="w-8 h-8 rounded-full border-2 border-red-500" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {comment.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-white">{comment.username}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 ml-11">{comment.comment_text}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}