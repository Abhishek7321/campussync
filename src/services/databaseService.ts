import { User } from '@/lib/constants';

// Profile types
export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  major: string | null;
  department: string | null;
  bio: string | null;
  join_date: string;
}

export type ProfileInsert = Omit<Profile, 'id'> & { id?: string };
export type ProfileUpdate = Partial<Profile>;

// Post types
export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export type PostInsert = Omit<Post, 'id' | 'created_at' | 'updated_at'> & { 
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type PostUpdate = Partial<Post>;

// Comment types
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export type CommentInsert = Omit<Comment, 'id' | 'created_at'> & { 
  id?: string;
  created_at?: string;
};

// Like types
export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export type LikeInsert = Omit<Like, 'id' | 'created_at'> & { 
  id?: string;
  created_at?: string;
};

// Tag types
export interface PostTag {
  id: string;
  post_id: string;
  tag: string;
}

export type PostTagInsert = Omit<PostTag, 'id'> & { id?: string };

// Follower types
export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export type FollowerInsert = Omit<Follower, 'id' | 'created_at'> & { 
  id?: string;
  created_at?: string;
};

// Extended post type with author, likes, comments, and tags
export interface PostWithDetails extends Post {
  author: Profile;
  likes_count: number;
  comments_count: number;
  user_has_liked?: boolean;
  tags: string[];
}

// Mock data storage
const mockProfiles: Record<string, Profile> = {};
const mockPosts: Record<string, Post> = {};
const mockComments: Record<string, Comment> = {};
const mockLikes: Record<string, Like> = {};
const mockTags: Record<string, PostTag> = {};
const mockFollowers: Record<string, Follower> = {};

// Helper function to generate UUID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Profile Service
export const profileService = {
  // Create a new profile
  async createProfile(profile: ProfileInsert): Promise<Profile | null> {
    try {
      const id = profile.id || generateId();
      const newProfile: Profile = {
        id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        role: profile.role,
        major: profile.major,
        department: profile.department,
        bio: profile.bio,
        join_date: profile.join_date || new Date().toISOString(),
      };
      
      mockProfiles[id] = newProfile;
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  },
  
  // Get a profile by ID
  async getProfileById(id: string): Promise<Profile | null> {
    try {
      return mockProfiles[id] || null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },
  
  // Update a profile
  async updateProfile(id: string, updates: ProfileUpdate): Promise<Profile | null> {
    try {
      const profile = mockProfiles[id];
      if (!profile) {
        return null;
      }
      
      const updatedProfile = {
        ...profile,
        ...updates,
      };
      
      mockProfiles[id] = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },
  
  // Convert profile to app User format
  profileToUser(profile: Profile): User {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: profile.role as 'student' | 'teacher',
      major: profile.role === 'student' ? profile.major || undefined : undefined,
      department: profile.role === 'teacher' ? profile.department || undefined : undefined,
    };
  }
};

// Post Service
export const postService = {
  // Create a new post
  async createPost(post: PostInsert, tags?: string[]): Promise<Post | null> {
    try {
      const id = generateId();
      const now = new Date().toISOString();
      
      const newPost: Post = {
        id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        created_at: now,
        updated_at: null,
      };
      
      mockPosts[id] = newPost;
      
      // If tags are provided, add them
      if (tags && tags.length > 0) {
        tags.forEach(tag => {
          const tagId = generateId();
          mockTags[tagId] = {
            id: tagId,
            post_id: id,
            tag: tag.toLowerCase().trim(),
          };
        });
      }
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },
  
  // Get posts with pagination
  async getPosts(page = 1, limit = 10, userId?: string): Promise<PostWithDetails[]> {
    try {
      // Get all posts and sort by created_at
      const posts = Object.values(mockPosts).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Apply pagination
      const offset = (page - 1) * limit;
      const paginatedPosts = posts.slice(offset, offset + limit);
      
      if (paginatedPosts.length === 0) {
        console.log('No posts found for page', page);
        return [];
      }
      
      // Get post IDs
      const postIds = paginatedPosts.map(post => post.id);
      
      // Count likes for each post
      const likesCount: Record<string, number> = {};
      Object.values(mockLikes).forEach(like => {
        if (postIds.includes(like.post_id)) {
          likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1;
        }
      });
      
      // Count comments for each post
      const commentsCount: Record<string, number> = {};
      Object.values(mockComments).forEach(comment => {
        if (postIds.includes(comment.post_id)) {
          commentsCount[comment.post_id] = (commentsCount[comment.post_id] || 0) + 1;
        }
      });
      
      // Get tags for each post
      const postTags: Record<string, string[]> = {};
      Object.values(mockTags).forEach(tag => {
        if (postIds.includes(tag.post_id)) {
          if (!postTags[tag.post_id]) {
            postTags[tag.post_id] = [];
          }
          postTags[tag.post_id].push(tag.tag);
        }
      });
      
      // Check if user has liked each post
      const userLikes: Record<string, boolean> = {};
      if (userId) {
        Object.values(mockLikes).forEach(like => {
          if (like.user_id === userId && postIds.includes(like.post_id)) {
            userLikes[like.post_id] = true;
          }
        });
      }
      
      // Combine all data
      const postsWithDetails: PostWithDetails[] = paginatedPosts.map(post => {
        const author = mockProfiles[post.user_id];
        
        if (!author) {
          console.error(`Author not found for post ${post.id}`);
          return null;
        }
        
        return {
          ...post,
          author,
          likes_count: likesCount[post.id] || 0,
          comments_count: commentsCount[post.id] || 0,
          user_has_liked: userLikes[post.id] || false,
          tags: postTags[post.id] || [],
        };
      }).filter(Boolean) as PostWithDetails[];
      
      return postsWithDetails;
    } catch (error) {
      console.error('Exception in getPosts:', error);
      return [];
    }
  },
  
  // Get posts by user ID
  async getPostsByUserId(userId: string, page = 1, limit = 10): Promise<PostWithDetails[]> {
    try {
      // Filter posts by user ID and sort by created_at
      const userPosts = Object.values(mockPosts)
        .filter(post => post.user_id === userId)
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      
      // Apply pagination
      const offset = (page - 1) * limit;
      const paginatedPosts = userPosts.slice(offset, offset + limit);
      
      if (paginatedPosts.length === 0) {
        console.log('No posts found for user', userId);
        return [];
      }
      
      // Get post IDs
      const postIds = paginatedPosts.map(post => post.id);
      
      // Count likes for each post
      const likesCount: Record<string, number> = {};
      Object.values(mockLikes).forEach(like => {
        if (postIds.includes(like.post_id)) {
          likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1;
        }
      });
      
      // Count comments for each post
      const commentsCount: Record<string, number> = {};
      Object.values(mockComments).forEach(comment => {
        if (postIds.includes(comment.post_id)) {
          commentsCount[comment.post_id] = (commentsCount[comment.post_id] || 0) + 1;
        }
      });
      
      // Get tags for each post
      const postTags: Record<string, string[]> = {};
      Object.values(mockTags).forEach(tag => {
        if (postIds.includes(tag.post_id)) {
          if (!postTags[tag.post_id]) {
            postTags[tag.post_id] = [];
          }
          postTags[tag.post_id].push(tag.tag);
        }
      });
      
      // Check if user has liked each post
      const userLikes: Record<string, boolean> = {};
      Object.values(mockLikes).forEach(like => {
        if (like.user_id === userId && postIds.includes(like.post_id)) {
          userLikes[like.post_id] = true;
        }
      });
      
      // Combine all data
      const postsWithDetails: PostWithDetails[] = paginatedPosts.map(post => {
        const author = mockProfiles[post.user_id];
        
        if (!author) {
          console.error(`Author not found for post ${post.id}`);
          return null;
        }
        
        return {
          ...post,
          author,
          likes_count: likesCount[post.id] || 0,
          comments_count: commentsCount[post.id] || 0,
          user_has_liked: userLikes[post.id] || false,
          tags: postTags[post.id] || [],
        };
      }).filter(Boolean) as PostWithDetails[];
      
      return postsWithDetails;
    } catch (error) {
      console.error('Exception in getPostsByUserId:', error);
      return [];
    }
  },
  
  // Get a single post with details
  async getPostById(postId: string, userId?: string): Promise<PostWithDetails | null> {
    try {
      const post = mockPosts[postId];
      
      if (!post) {
        console.error('Post not found:', postId);
        return null;
      }
      
      const author = mockProfiles[post.user_id];
      
      if (!author) {
        console.error('Author not found for post:', postId);
        return null;
      }
      
      // Count likes
      const likesCount = Object.values(mockLikes)
        .filter(like => like.post_id === postId)
        .length;
      
      // Count comments
      const commentsCount = Object.values(mockComments)
        .filter(comment => comment.post_id === postId)
        .length;
      
      // Get tags
      const tags = Object.values(mockTags)
        .filter(tag => tag.post_id === postId)
        .map(tag => tag.tag);
      
      // Check if user has liked the post
      let userHasLiked = false;
      if (userId) {
        userHasLiked = Object.values(mockLikes).some(
          like => like.post_id === postId && like.user_id === userId
        );
      }
      
      // Combine all data
      const postWithDetails: PostWithDetails = {
        ...post,
        author,
        likes_count: likesCount,
        comments_count: commentsCount,
        user_has_liked: userHasLiked,
        tags
      };
      
      return postWithDetails;
    } catch (error) {
      console.error('Error getting post by ID:', error);
      return null;
    }
  },
  
  // Update a post
  async updatePost(postId: string, updates: PostUpdate, tags?: string[]): Promise<Post | null> {
    try {
      const post = mockPosts[postId];
      
      if (!post) {
        console.error('Post not found:', postId);
        return null;
      }
      
      // Update the post
      const updatedPost: Post = {
        ...post,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      mockPosts[postId] = updatedPost;
      
      // If tags are provided, update them
      if (tags) {
        // First, delete existing tags
        Object.keys(mockTags).forEach(tagId => {
          if (mockTags[tagId].post_id === postId) {
            delete mockTags[tagId];
          }
        });
        
        // Then, add new tags if any
        if (tags.length > 0) {
          tags.forEach(tag => {
            const tagId = generateId();
            mockTags[tagId] = {
              id: tagId,
              post_id: postId,
              tag: tag.toLowerCase().trim(),
            };
          });
        }
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  },
  
  // Delete a post
  async deletePost(postId: string): Promise<boolean> {
    try {
      // Check if post exists
      if (!mockPosts[postId]) {
        console.error('Post not found:', postId);
        return false;
      }
      
      // Delete related records first (likes, comments, tags)
      Object.keys(mockLikes).forEach(likeId => {
        if (mockLikes[likeId].post_id === postId) {
          delete mockLikes[likeId];
        }
      });
      
      Object.keys(mockComments).forEach(commentId => {
        if (mockComments[commentId].post_id === postId) {
          delete mockComments[commentId];
        }
      });
      
      Object.keys(mockTags).forEach(tagId => {
        if (mockTags[tagId].post_id === postId) {
          delete mockTags[tagId];
        }
      });
      
      // Delete the post
      delete mockPosts[postId];
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }
};

// Like Service
export const likeService = {
  // Like a post
  async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      // Check if post exists
      if (!mockPosts[postId]) {
        console.error('Post not found:', postId);
        return false;
      }
      
      // Check if user exists
      if (!mockProfiles[userId]) {
        console.error('User not found:', userId);
        return false;
      }
      
      // Check if user already liked the post
      const existingLike = Object.values(mockLikes).find(
        like => like.post_id === postId && like.user_id === userId
      );
      
      // If already liked, return true
      if (existingLike) {
        return true;
      }
      
      // Add new like
      const likeId = generateId();
      mockLikes[likeId] = {
        id: likeId,
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString(),
      };
      
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  },
  
  // Unlike a post
  async unlikePost(postId: string, userId: string): Promise<boolean> {
    try {
      // Find the like to remove
      const likeToRemove = Object.entries(mockLikes).find(
        ([_, like]) => like.post_id === postId && like.user_id === userId
      );
      
      // If like exists, remove it
      if (likeToRemove) {
        const [likeId] = likeToRemove;
        delete mockLikes[likeId];
        return true;
      }
      
      // Like not found, but that's okay (idempotent operation)
      return true;
    } catch (error) {
      console.error('Error unliking post:', error);
      return false;
    }
  },
  
  // Get likes for a post
  async getPostLikes(postId: string): Promise<number> {
    try {
      return Object.values(mockLikes)
        .filter(like => like.post_id === postId)
        .length;
    } catch (error) {
      console.error('Error getting post likes:', error);
      return 0;
    }
  }
};

// Comment Service
export const commentService = {
  // Add a comment to a post
  async addComment(comment: CommentInsert): Promise<Comment | null> {
    try {
      // Check if post exists
      if (!mockPosts[comment.post_id]) {
        console.error('Post not found:', comment.post_id);
        return null;
      }
      
      // Check if user exists
      if (!mockProfiles[comment.user_id]) {
        console.error('User not found:', comment.user_id);
        return null;
      }
      
      // Create new comment
      const id = generateId();
      const newComment: Comment = {
        id,
        post_id: comment.post_id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at || new Date().toISOString(),
      };
      
      mockComments[id] = newComment;
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },
  
  // Get comments for a post
  async getPostComments(postId: string): Promise<Comment[]> {
    try {
      // Get comments for the post and sort by created_at
      return Object.values(mockComments)
        .filter(comment => comment.post_id === postId)
        .sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    } catch (error) {
      console.error('Error getting post comments:', error);
      return [];
    }
  },
  
  // Delete a comment
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      if (!mockComments[commentId]) {
        console.error('Comment not found:', commentId);
        return false;
      }
      
      delete mockComments[commentId];
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }
};

// Follower Service
export const followerService = {
  // Follow a user
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      // Check if users exist
      if (!mockProfiles[followerId]) {
        console.error('Follower not found:', followerId);
        return false;
      }
      
      if (!mockProfiles[followingId]) {
        console.error('User to follow not found:', followingId);
        return false;
      }
      
      // Check if already following
      const existingFollow = Object.values(mockFollowers).find(
        follow => follow.follower_id === followerId && follow.following_id === followingId
      );
      
      // If already following, return true
      if (existingFollow) {
        return true;
      }
      
      // Add new follow
      const id = generateId();
      mockFollowers[id] = {
        id,
        follower_id: followerId,
        following_id: followingId,
        created_at: new Date().toISOString(),
      };
      
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  },
  
  // Unfollow a user
  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      // Find the follow relationship to remove
      const followToRemove = Object.entries(mockFollowers).find(
        ([_, follow]) => follow.follower_id === followerId && follow.following_id === followingId
      );
      
      // If relationship exists, remove it
      if (followToRemove) {
        const [followId] = followToRemove;
        delete mockFollowers[followId];
        return true;
      }
      
      // Relationship not found, but that's okay (idempotent operation)
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  },
  
  // Get users that a user is following
  async getFollowing(userId: string): Promise<string[]> {
    try {
      return Object.values(mockFollowers)
        .filter(follow => follow.follower_id === userId)
        .map(follow => follow.following_id);
    } catch (error) {
      console.error('Error getting following:', error);
      return [];
    }
  },
  
  // Get users that follow a user
  async getFollowers(userId: string): Promise<string[]> {
    try {
      return Object.values(mockFollowers)
        .filter(follow => follow.following_id === userId)
        .map(follow => follow.follower_id);
    } catch (error) {
      console.error('Error getting followers:', error);
      return [];
    }
  },
  
  // Check if a user is following another user
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      return Object.values(mockFollowers).some(
        follow => follow.follower_id === followerId && follow.following_id === followingId
      );
    } catch (error) {
      console.error('Error checking if following:', error);
      return false;
    }
  }
};