import { useState, useEffect } from 'react';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image_url: '' });
  const [uploading, setUploading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'community');

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setNewPost({ ...newPost, image_url: data.url });
      }
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.content.trim()) {
      alert('Please write something!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        setNewPost({ content: '', image_url: '' });
        setShowCreatePost(false);
        fetchPosts();
      }
    } catch (error) {
      alert('Failed to create post');
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/community/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ post_id: postId })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes_count: p.likes_count + (data.liked ? 1 : -1) }
            : p
        ));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const viewComments = async (post) => {
    setSelectedPost(post);
    try {
      const response = await fetch(`/api/community/comments?post_id=${post.id}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments');
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post_id: selectedPost.id,
          comment_text: newComment
        })
      });

      if (response.ok) {
        setNewComment('');
        viewComments(selectedPost);
        setPosts(posts.map(p => 
          p.id === selectedPost.id 
            ? { ...p, comment_count: p.comment_count + 1 }
            : p
        ));
      }
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        <p className="mt-4 text-gray-400 text-lg">Loading community...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">💬 Community</h2>
            <p className="text-white/90 text-lg">Share your fitness journey with others</p>
          </div>
          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
          >
            {showCreatePost ? '✕ Cancel' : '➕ New Post'}
          </button>
        </div>
      </div>

      {/* Create Post */}
      {showCreatePost && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">Create a Post</h3>
          
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="Share your thoughts, progress, or motivation..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 mb-4"
            rows="4"
          />

          {newPost.image_url && (
            <div className="mb-4 relative">
              <img src={newPost.image_url} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              <button
                onClick={() => setNewPost({ ...newPost, image_url: '' })}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <label className="flex-1 bg-gray-900 border border-gray-700 text-gray-400 px-4 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer text-center">
              {uploading ? '⏳ Uploading...' : '📷 Add Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button
              onClick={createPost}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-500 hover:to-pink-500 transition shadow-lg"
            >
              📤 Post
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-6xl mb-4">🌟</p>
            <p className="text-gray-400 text-xl">No posts yet</p>
            <p className="text-gray-500 mt-2">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {post.profile_picture ? (
                      <img src={post.profile_picture} alt={post.username} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                        {post.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-bold">{post.username}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {currentUser?.id === post.user_id && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 hover:text-red-400 p-2"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-white text-lg mb-4 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <img src={post.image_url} alt="Post" className="w-full max-h-96 object-cover" />
              )}

              {/* Post Actions */}
              <div className="p-6 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">❤️</span>
                    <span className="font-semibold">{post.likes_count}</span>
                  </button>

                  <button
                    onClick={() => viewComments(post)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition"
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-semibold">{post.comment_count}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comments Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">💬 Comments</h3>
              <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-white text-3xl">✕</button>
            </div>

            {/* Add Comment */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 mb-3"
                rows="2"
              />
              <button
                onClick={addComment}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:from-purple-500 hover:to-pink-500 transition"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start gap-3">
                      {comment.profile_picture ? (
                        <img src={comment.profile_picture} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          {comment.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{comment.username}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.comment_text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}