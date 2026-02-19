const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for Gallery
const galleryUrl = process.env.GALLERY_SUPABASE_URL || process.env.SUPABASE_URL;
const galleryKey = process.env.GALLERY_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabase = galleryUrl && galleryKey ? createClient(galleryUrl, galleryKey) : null;

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      // If table doesn't exist, return empty array for now instead of error 500
      if (error.code === 'PGRST116' || error.message.includes('schema cache')) {
        return res.status(200).json([]);
      }
      return res.status(500).json({ error: 'Database error', message: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server error', message: 'An unexpected error occurred' });
  }
};
