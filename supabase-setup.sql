-- Supabase SQL Setup for Blog Posts
-- Run this SQL in your Supabase SQL Editor

-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create an index on date for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read blog posts
CREATE POLICY "Anyone can read blog posts"
  ON blog_posts
  FOR SELECT
  USING (true);

-- Create a policy that allows authenticated users to insert blog posts
-- For now, we'll allow all operations. You can restrict this later based on your auth setup
CREATE POLICY "Allow all operations for now"
  ON blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
