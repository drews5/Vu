# Social Media Integration Guide

This guide explains how to update the social media feeds on the **Media** page (`src/pages/Media.tsx`).

## ⚠️ Important Coding Rule
- **The Inter font should NEVER be in all caps.** Ensure any text styled with `fontInter` or `font-family: Inter` uses standard sentence or title casing.

## 1. YouTube Video Feed

The YouTube section currently uses the **ICCA 2024 Set** as a featured video and several placeholders.

### How to Update:
1. Go to [Vocal U's YouTube Channel](https://www.youtube.com/@vocal-u/videos).
2. For the 8 most recent videos, copy the **Video ID** from the URL (the part after `watch?v=`).
3. Update the `youtubeVideos` array in `src/pages/Media.tsx`:

```javascript
const youtubeVideos = [
  {
    id: 'REAL_VIDEO_ID',
    title: 'Actual Video Title',
    thumbnail: 'https://img.youtube.com/vi/REAL_VIDEO_ID/maxresdefault.jpg', // Auto-generates thumbnail
    date: 'Month Year'
  },
  // ... repeat for 8 videos
];
```

## 2. Instagram Feed

The Instagram section currently uses a grid of placeholder images.

### Option A: Manual Updates (Current)
Update the `instagramPosts` array in `src/pages/Media.tsx` with links to recent posts:
1. Go to [Vocal U's Instagram](https://www.instagram.com/vocal_u).
2. Click on a post and copy its URL.
3. Replace the `imageUrl` with a direct link if possible, or use a descriptive placeholder.

### Option B: Automatic Feed (Recommended)
For a truly automatic feed that updates whenever you post on Instagram, use a service like **Behold.so**:
1. Sign up at [Behold.so](https://behold.so/) (Free tier available).
2. Connect the `@vocal_u` Instagram account.
3. Copy the **JavaScript Embed Code**.
4. In `src/pages/Media.tsx`, replace the `instagramPosts.map(...)` block with the embed code provided by Behold.

## 3. Spotify Integration

The Spotify button links to Vocal U's artist profile.
- **Current Link:** `https://open.spotify.com/artist/06RUXy6K6yW7M0j6sW7vR1`
- To update, simply change the `href` in the Spotify section of `Media.tsx`.

---
*Guide updated on Feb 16, 2026*
