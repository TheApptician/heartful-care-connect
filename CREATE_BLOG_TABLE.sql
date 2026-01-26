CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  category TEXT,
  status TEXT DEFAULT 'Published',
  views INTEGER DEFAULT 0,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read blog_posts" ON blog_posts;
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated insert blog_posts" ON blog_posts;
CREATE POLICY "Authenticated insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update blog_posts" ON blog_posts;
CREATE POLICY "Authenticated update blog_posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated delete blog_posts" ON blog_posts;
CREATE POLICY "Authenticated delete blog_posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');
