// Mock data for development purposes
const mockPosts = [
  {
    id: '1',
    content: 'Just finished my final project for CS401! #ComputerScience #StudentLife',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    author: {
      id: '101',
      name: 'Alex Johnson',
      avatar: '/avatars/alex.jpg'
    },
    likes: 24,
    comments: 5
  },
  {
    id: '2',
    content: 'Looking for study partners for the upcoming calculus exam. Anyone interested?',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    author: {
      id: '102',
      name: 'Jamie Smith',
      avatar: '/avatars/jamie.jpg'
    },
    likes: 15,
    comments: 8
  },
  {
    id: '3',
    content: 'Campus event this weekend! Free food and music at the quad starting at 7PM Friday.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: '103',
      name: 'Taylor Williams',
      avatar: '/avatars/taylor.jpg'
    },
    likes: 56,
    comments: 12
  }
];

// API service functions
export const fetchFollowedUsersPosts = async () => {
  // In a real app, this would be an API call
  // For now, we'll simulate a network request with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 800);
  });
};

export const likePost = async (postId: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

export const addComment = async (postId: string, comment: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        postId,
        content: comment,
        createdAt: new Date().toISOString(),
        author: {
          id: 'current-user',
          name: 'Current User',
          avatar: '/avatars/default.jpg'
        }
      });
    }, 300);
  });
};

export const fetchUserProfile = async (userId: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: userId === '101' ? 'Alex Johnson' : 'Unknown User',
        bio: 'Computer Science student, class of 2025',
        followers: 142,
        following: 98,
        posts: userId === '101' ? mockPosts.filter(post => post.author.id === userId) : []
      });
    }, 500);
  });
};