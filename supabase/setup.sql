-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  major TEXT,
  department TEXT,
  bio TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT role_fields_check CHECK (
    (role = 'student' AND major IS NOT NULL AND department IS NULL) OR
    (role = 'teacher' AND department IS NOT NULL AND major IS NULL)
  )
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create post_tags table
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create followers table
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" 
ON posts FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" 
ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON posts FOR DELETE USING (auth.uid() = user_id);

-- Post tags policies
CREATE POLICY "Post tags are viewable by everyone" 
ON post_tags FOR SELECT USING (true);

CREATE POLICY "Users can insert tags on their own posts" 
ON post_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
);

CREATE POLICY "Users can delete tags on their own posts" 
ON post_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" 
ON likes FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" 
ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON likes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON comments FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" 
ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON comments FOR DELETE USING (auth.uid() = user_id);

-- Followers policies
CREATE POLICY "Followers are viewable by everyone" 
ON followers FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
ON followers FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON followers FOR DELETE USING (auth.uid() = follower_id);

-- Create functions and triggers
-- Function to update the updated_at field
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at field on posts
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, avatar, role, major, department, join_date)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    CASE WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' 
         THEN COALESCE(NEW.raw_user_meta_data->>'major', 'Undeclared') 
         ELSE NULL 
    END,
    CASE WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'teacher' 
         THEN COALESCE(NEW.raw_user_meta_data->>'department', 'General') 
         ELSE NULL 
    END,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();