import React, { useState } from 'react';
import PostCard from '../components/post-card';
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useFeed } from "@/contexts/FeedContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { formatDate, getRelativeTime, truncateText } from "@/lib/utils";
import { Bell, BookOpen, Calendar, Image, Link, MessageSquare, ThumbsUp, UserPlus, Loader2, RefreshCw } from "lucide-react";

// Trending topics based on post tags
const TRENDING_TOPICS = [
  { name: 'research', count: 45 },
  { name: 'midterms', count: 38 },
  { name: 'campuslife', count: 32 },
  { name: 'studygroups', count: 29 },
  { name: 'internships', count: 24 },
];

// Upcoming events
const UPCOMING_EVENTS = [
  { 
    id: 'e1', 
    title: 'Career Fair', 
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
    location: 'Student Center'
  },
  { 
    id: 'e2', 
    title: 'Hackathon', 
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    location: 'Engineering Building'
  },
];

const FeedPage = () => {
  const { currentUser } = useAuth();
  const { 
    posts, 
    createPost, 
    isLoading,
    error,
    following,
    feedFilter,
    setFeedFilter,
    loadMorePosts,
    refreshPosts
  } = useFeed();
  
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postTags, setPostTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle post submission
  const handlePostSubmit = async () => {
    if (!postContent.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const tags = postTags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const success = await createPost(
        postContent, 
        postImage || undefined, 
        tags.length > 0 ? tags : undefined
      );
      
      if (success) {
        setPostContent('');
        setPostImage('');
        setPostTags('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar - Trending and Navigation */}
        <div className="hidden md:block md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {TRENDING_TOPICS.map(topic => (
                  <div key={topic.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">#{topic.name}</span>
                    <Badge variant="outline">{topic.count} posts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {UPCOMING_EVENTS.map(event => (
                  <div key={event.id} className="flex gap-3">
                    <div className="min-w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-primary text-xs font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-primary text-sm font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <a href="/events" className="text-sm text-primary hover:underline">View all events</a>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content - Feed */}
        <div className="col-span-1 md:col-span-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <Input
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="flex-1"
                  />
                </div>
                
                {/* Optional image URL input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={postImage}
                    onChange={e => setPostImage(e.target.value)}
                    placeholder="Image URL (optional)"
                    className="flex-1 text-sm"
                  />
                </div>
                
                {/* Tags input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={postTags}
                    onChange={e => setPostTags(e.target.value)}
                    placeholder="Tags (comma separated, optional)"
                    className="flex-1 text-sm"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                      <Image className="h-4 w-4" />
                      <span>Photo</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                      <Link className="h-4 w-4" />
                      <span>Link</span>
                    </Button>
                  </div>
                  <Button
                    onClick={handlePostSubmit}
                    disabled={!postContent.trim() || isSubmitting}
                    className="px-4 py-2 rounded"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Filters */}
          <div className="mb-4 flex justify-between items-center">
            <Tabs 
              defaultValue={feedFilter} 
              className="w-full"
              onValueChange={(value) => setFeedFilter(value as 'all' | 'following')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Refresh Button */}
          <div className="mb-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refreshPosts()}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {error && (
              <Card className="bg-destructive/10 border-destructive">
                <CardContent className="py-4">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}
            
            {!error && posts.length === 0 && !isLoading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-2">No posts to display</p>
                  <p className="text-sm text-muted-foreground">
                    {feedFilter === 'following' 
                      ? "Follow more users to see their posts here" 
                      : "Be the first to create a post!"}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {!isLoading && posts.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => loadMorePosts()}
                  className="w-full max-w-md"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Who to Follow */}
        <div className="hidden md:block md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Who to Follow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* This would be populated with suggested users */}
              <div className="text-sm text-muted-foreground">
                Suggestions will appear here based on your interests and connections.
              </div>
            </CardContent>
          </Card>
          
          {currentUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{currentUser.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-muted rounded-md p-2">
                    <p className="text-lg font-semibold">{following.length}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <p className="text-lg font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/profile">View Profile</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FeedPage;