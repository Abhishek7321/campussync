import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Heart, MessageSquare, Share, Send, MoreHorizontal, UserPlus, UserMinus } from 'lucide-react';
import { PostWithDetails } from '@/services/databaseService';
import { useFeed } from '@/contexts/FeedContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export interface PostCardProps {
  post: PostWithDetails;
  className?: string;
  showFollowButton?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, className, showFollowButton = true }) => {
  const { currentUser } = useAuth();
  const { likePost, unlikePost, addComment, followUser, unfollowUser, following } = useFeed();
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const isFollowing = following.includes(post.author.id);
  const isOwnPost = currentUser?.id === post.author.id;
  
  const handleLikeToggle = async () => {
    if (!currentUser) return;
    
    if (post.user_has_liked) {
      await unlikePost(post.id);
    } else {
      await likePost(post.id);
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comment.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      const success = await addComment(post.id, comment);
      if (success) {
        setComment('');
        setShowComments(true);
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleFollowToggle = async () => {
    if (!currentUser || isOwnPost) return;
    
    if (isFollowing) {
      await unfollowUser(post.author.id);
    } else {
      await followUser(post.author.id);
    }
  };
  
  const formattedDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  return (
    <Card className={`mb-4 w-full ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{post.author.name}</h3>
              <span className="text-xs text-muted-foreground capitalize">
                • {post.author.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showFollowButton && !isOwnPost && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleFollowToggle}
              className="flex items-center gap-1"
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:inline-block">Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:inline-block">Follow</span>
                </>
              )}
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="whitespace-pre-line">{post.content}</p>
        
        {post.image_url && (
          <div className="mt-2 rounded-md overflow-hidden">
            <img 
              src={post.image_url} 
              alt="Post attachment" 
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col border-t pt-4">
        <div className="flex justify-between w-full mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleLikeToggle}
          >
            <Heart 
              className={`h-4 w-4 ${post.user_has_liked ? 'fill-red-500 text-red-500' : ''}`} 
            />
            <span>{post.likes_count}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments_count}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
        
        {showComments && (
          <div className="w-full mt-2 space-y-2">
            {/* Comments would be loaded and displayed here */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
              <Input
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!comment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;