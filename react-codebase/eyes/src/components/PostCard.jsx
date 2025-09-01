import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical, 
  MapPin,
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onShare,
  POST_CATEGORIES = []
}) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (onLike) {
      onLike(post._id);
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post._id);
    } else {
      setShowComments(!showComments);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post._id);
    } else {
      // Default share behavior
      const postUrl = `${window.location.origin}/post/${post._id}`;
      navigator.clipboard.writeText(postUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      // Handle comment submission
      console.log('Comment submitted:', commentText);
      setCommentText('');
      toast.success('Comment posted!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = POST_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (categoryId) => {
    const category = POST_CATEGORIES.find(c => c.id === categoryId);
    return category?.label || 'General';
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.author?.avatar || post.author?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'}
              alt={post.author?.fullName || post.author?.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {post.author?.fullName || post.author?.username}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{post.neighborhood}, {post.city}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 space-y-4">
        <div>
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </div>
        
        {post.images && post.images.length > 0 && (
          <div className="rounded-xl overflow-hidden bg-gray-50">
            <img 
              src={post.images[0]} 
              alt="Post content" 
              className="w-full h-80 object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-500 hover:bg-red-50"
            >
              <Heart className={`h-5 w-5 ${post.isLiked ? 'text-red-500 fill-current' : ''}`} />
              <span className="font-medium">{post.likes?.length || 0}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleComment}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.comments?.length || 0}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="text-gray-600 hover:text-green-500 hover:bg-green-50"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3">
                    <img
                      src={comment.author?.avatar || comment.author?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                      alt={comment.author?.fullName || comment.author?.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {comment.author?.fullName || comment.author?.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
              <img
                src="https://randomuser.me/api/portraits/lego/1.jpg"
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={!commentText.trim()}
                className="h-8 w-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
