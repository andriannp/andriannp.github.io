const fs = require('fs');
const path = require('path');

async function updateInstagramData() {
  const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
  const IG_USER_ID = process.env.IG_USER_ID;

  if (!IG_ACCESS_TOKEN || !IG_USER_ID) {
    console.error('Error: IG_ACCESS_TOKEN and IG_USER_ID environment variables are required.');
    process.exit(1);
  }

  try {
    console.log('Fetching Instagram profile data...');
    const profileUrl = `https://graph.facebook.com/v20.0/${IG_USER_ID}?fields=id,username,name,biography,profile_picture_url,followers_count,media_count,website&access_token=${IG_ACCESS_TOKEN}`;
    const profileRes = await fetch(profileUrl);
    if (!profileRes.ok) {
      const err = await profileRes.json();
      throw new Error(`Profile fetch failed: ${JSON.stringify(err)}`);
    }
    const profileData = await profileRes.json();

    console.log('Fetching Instagram media data...');
    const mediaUrl = `https://graph.facebook.com/v20.0/${IG_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${IG_ACCESS_TOKEN}&limit=100`;
    const mediaRes = await fetch(mediaUrl);
    if (!mediaRes.ok) {
      const err = await mediaRes.json();
      throw new Error(`Media fetch failed: ${JSON.stringify(err)}`);
    }
    const mediaData = await mediaRes.json();

    const posts = [];
    const reels = [];

    if (mediaData.data && Array.isArray(mediaData.data)) {
      for (const item of mediaData.data) {
        // Group by media_type: IMAGE/CAROUSEL_ALBUM go to posts, VIDEO goes to reels
        if (item.media_type === 'VIDEO') {
          reels.push(item);
        } else {
          posts.push(item);
        }
      }
    }

    const outputData = {
      profile: {
        id: profileData.id,
        username: profileData.username,
        name: profileData.name,
        biography: profileData.biography || '',
        profile_picture_url: profileData.profile_picture_url || '',
        followers_count: profileData.followers_count || 0,
        media_count: profileData.media_count || 0,
        website: profileData.website || ''
      },
      posts: posts,
      reels: reels,
      updated_at: new Date().toISOString()
    };

    const dataDir = path.join(__dirname, '..', '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'instagram.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`Successfully updated Instagram data. Written to: ${outputPath}`);
  } catch (error) {
    console.error('Error updating Instagram data:', error);
    process.exit(1);
  }
}

updateInstagramData();
