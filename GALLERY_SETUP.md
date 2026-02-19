
# Gallery Setup Guide for Just For Kidz

To enable the dynamic gallery, follow these two simple steps:

## Step 1: Create the Database Table

Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/yrazkccgcfurdjhjpyhv/sql/new) and run the following SQL command:

```sql
-- Create the gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" 
ON public.gallery_images FOR SELECT 
USING (true);

-- Create policy to allow service role full access (for your management script)
CREATE POLICY "Allow service role full access" 
ON public.gallery_images FOR ALL 
USING (auth.role() = 'service_role');
```

## Step 2: Add Sample Data

You can add images via the Supabase Table Editor or run this SQL to add initial placeholder images:

```sql
INSERT INTO public.gallery_images (url, title, description)
VALUES 
('A Day in the Life_ Children at School.jpg', 'Joyful Learning', 'Our students engaged in collaborative classroom activities.'),
('magic-tricks.jpg', 'Creative Wonders', 'Exploring the magic of science and art through hands-on experiments.'),
('Free vector online community _ Premium AI-generated image.jpg', 'Strong Community', 'Building friendships and social skills in a safe environment.'),
('hero-bg.jpg', 'Modern Facilities', 'Well-equipped learning spaces designed for safety and exploration.');
```

## How it Works
1.  **Backend**: The file `api/gallery.js` connects to Supabase using your `SERVICE_KEY` and serves the data at `/api/gallery`.
2.  **Frontend**: `website-gallery-integration.js` fetches this data and builds the UI.
3.  **Styling**: `gallery-styles.css` ensures a premium, kid-friendly look with smooth animations and responsive grid.

The gallery is now visible on your homepage just above the Impact section!
