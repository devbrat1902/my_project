---
description: How to set up the gallery database table in Supabase
---

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **`yrazkccgcfurdjhjpyhv`** (just-for-kidz-leads)

### Step 2: Open SQL Editor
1. In the left-hand sidebar, click on the **SQL Editor** icon (square with `>_` symbol).
2. Click **"+ New Query"** or the **"New Query"** button at the top.

### Step 3: Run the Setup SQL
1. Copy the following code block:
```sql
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.gallery_images FOR SELECT 
USING (true);

-- Insert sample data
INSERT INTO public.gallery_images (url, title, description)
VALUES 
('magic-tricks.jpg', 'Creative Learning', 'Hands-on magic and science activities.'),
('A Day in the Life_ Children at School.jpg', 'School Moments', 'Captured memories of daily school life.');
```
2. Paste it into the SQL Editor.
3. Click the **Run** button (or press `Ctrl + Enter`).

### Step 4: Add Your Own Uploaded Image
1. Go to the **Table Editor** (grid icon in sidebar).
2. Click on the **`gallery_images`** table.
3. Click **"Insert"** -> **"Insert row"**.
4. In the `url` field, paste the **direct URL** of the image you uploaded to storage.
5. In the `title` field, give it a name (e.g., "Our Playground").
6. Click **Save**.

### Step 5: Verify on Website
1. Go to [http://localhost:3000/home.html](http://localhost:3000/home.html).
2. Scroll to the gallery section to see your images live.
