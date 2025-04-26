import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  postService, 
  likeService, 
  commentService, 
  followerService,
  PostWithDetails
} from '@/services/databaseService';

// Define the context type
interface FeedContextType {
  posts: PostWithDetails[];
  userPosts: PostWithDetails[];
  isLoading: boolean;
  error: string | null;
  createPost: (content: string, imageUrl?: string, tags?: string[]) => Promise<boolean>;
  likePost: (postId: string) => Promise<boolean>;
  unlikePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<boolean>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  following: string[];
  loadMorePosts: () => Promise<boolean>;
  refreshPosts: () => Promise<void>;
  feedFilter: 'all' | 'following';
  setFeedFilter: (filter: 'all' | 'following') => void;
}

// Create the context
const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Create the provider component
export function FeedProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [userPosts, setUserPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all');

  // Fetch posts when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      refreshPosts();
      fetchFollowing();
    }
  }, [currentUser, feedFilter]);

  // Fetch posts by the current user
  useEffect(() => {
    if (currentUser) {
      fetchUserPosts();
    }
  }, [currentUser]);

  // Fetch posts from the database
  const fetchPosts = async (pageNum = 1) => {
    if (!currentUser) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let fetchedPosts: PostWithDetails[];
      
      if (feedFilter === 'following' && following.length > 0) {
        // Fetch posts from users the current user is following
        // This is a simplified approach - in a real app, you'd have a backend endpoint for this
        const followingPosts = await Promise.all(
          following.map(userId => postService.getPostsByUserId(userId, pageNum))
        );
        
        // Flatten the array of arrays
        fetchedPosts = followingPosts.flat();
        
        // Sort by created_at
        fetchedPosts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        // Fetch all posts
        fetchedPosts = await postService.getPosts(pageNum, 10, currentUser.id);
      }
      
      if (pageNum === 1) {
        setPosts(fetchedPosts);
      } else {
        setPosts(prev => [...prev, ...fetchedPosts]);
      }
      
      setHasMore(fetchedPosts.length === 10);
      return true;
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts by the current user
  const fetchUserPosts = async () => {
    if (!currentUser) return;
    
    try {
      const fetchedPosts = await postService.getPostsByUserId(currentUser.id);
      setUserPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  // Fetch users that the current user is following
  const fetchFollowing = async () => {
    if (!currentUser) return;
    
    try {
      const followingIds = await followerService.getFollowing(currentUser.id);
      setFollowing(followingIds);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  // Create a new post
  const createPost = async (content: string, imageUrl?: string, tags?: string[]) => {
    if (!currentUser || !content.trim()) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newPost = await postService.createPost(
        {
          user_id: currentUser.id,
          content,
          image_url: imageUrl || null,
        },
        tags
      );
      
      if (newPost) {
        // Refresh posts to include the new one
        await refreshPosts();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Like a post
  const likePost = async (postId: string) => {
    if (!currentUser) return false;
    
    try {
      const success = await likeService.likePost(postId, currentUser.id);
      
      if (success) {
        // Update the posts state to reflect the like
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes_count: post.likes_count + 1,
                  user_has_liked: true
                } 
              : post
          )
        );
        
        // Also update userPosts if needed
        setUserPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes_count: post.likes_count + 1,
                  user_has_liked: true
                } 
              : post
          )
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  };

  // Unlike a post
  const unlikePost = async (postId: string) => {
    if (!currentUser) return false;
    
    try {
      const success = await likeService.unlikePost(postId, currentUser.id);
      
      if (success) {
        // Update the posts state to reflect the unlike
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes_count: Math.max(0, post.likes_count - 1),
                  user_has_liked: false
                } 
              : post
          )
        );
        
        // Also update userPosts if needed
        setUserPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes_count: Math.max(0, post.likes_count - 1),
                  user_has_liked: false
                } 
              : post
          )
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error unliking post:', error);
      return false;
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return false;
    
    try {
      const newComment = await commentService.addComment({
        post_id: postId,
        user_id: currentUser.id,
        content,
      });
      
      if (newComment) {
        // Update the posts state to reflect the new comment
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, comments_count: post.comments_count + 1 } 
              : post
          )
        );
        
        // Also update userPosts if needed
        setUserPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, comments_count: post.comments_count + 1 } 
              : post
          )
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  // Follow a user
  const followUser = async (userId: string) => {
    if (!currentUser) return false;
    
    try {
      const success = await followerService.followUser(currentUser.id, userId);
      
      if (success) {
        // Update the following state
        setFollowing(prev => [...prev, userId]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  };

  // Unfollow a user
  const unfollowUser = async (userId: string) => {
    if (!currentUser) return false;
    
    try {
      const success = await followerService.unfollowUser(currentUser.id, userId);
      
      if (success) {
        // Update the following state
        setFollowing(prev => prev.filter(id => id !== userId));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  };

  // Load more posts (pagination)
  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return false;
    
    const nextPage = page + 1;
    const success = await fetchPosts(nextPage);
    
    if (success) {
      setPage(nextPage);
    }
    
    return success;
  };

  // Refresh posts
  const refreshPosts = async () => {
    setPage(1);
    await fetchPosts(1);
    await fetchUserPosts();
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        userPosts,
        isLoading,
        error,
        createPost,
        likePost,
        unlikePost,
        addComment,
        followUser,
        unfollowUser,
        following,
        loadMorePosts,
        refreshPosts,
        feedFilter,
        setFeedFilter,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

// Custom hook to use the feed context
export function useFeed() {
  const context = useContext(FeedContext);
  
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  
  return context;
}