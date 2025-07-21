import React from 'react';

const CommentList = ({ comments }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Comments ({comments.length})
    </h3>
    
    {comments.length === 0 ? (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No comments yet. Be the first to comment!
      </div>
    ) : (
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment._id} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <img 
              src={comment.author.profilePicture || 'https://via.placeholder.com/40'} 
              alt={comment.author.name} 
              className="w-10 h-10 rounded-full object-cover border shadow dark:border-gray-600"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author.name}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CommentList; 