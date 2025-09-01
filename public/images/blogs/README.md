# Blog Images

This folder contains images for blog posts. Each blog post can have a featured image that will be displayed on both the blog listing page and the individual blog post page.

## Image Placement

For each blog post, place the image file in this folder using the path specified in the blog data:

### Current Blog Posts:
- `space-news-2024.jpg` - Latest Space Discoveries: What 2024 Has Revealed
- `climate-change-space.webp` - Earth's Climate Crisis: Understanding Our Changing Planet
- `future-mars-missions.jpg` - Future Mars exploration missions (ready for content)
- `exoplanet-atmospheres.jpg` - Exoplanet atmosphere studies (ready for content)
- `asteroid-mining.jpg` - Asteroid mining prospects (ready for content)
- `space-weather.webp` - Space weather impacts (ready for content)

## Image Requirements

- **Format**: JPG, PNG, or WebP (WebP recommended for smaller file sizes)
- **Size**: Recommended 1200x600 pixels (2:1 aspect ratio)
- **File size**: Keep under 500KB for optimal loading (WebP helps achieve this)
- **Naming**: Use descriptive names that match the blog post ID or title

## Fallback Behavior

If an image is not found, the pages will show:
- **Blog listing page**: A colored gradient with an emoji and the file path where the image should be placed
- **Blog post page**: A larger gradient with detailed path information
- **Recent posts sidebar**: Small emoji thumbnails

## Adding New Blog Images

1. Save your image in this folder
2. Update the `image` field in `/src/data/blogs.js` with the path: `/images/blogs/your-image.jpg`
3. The image will automatically appear on both the blog listing and individual post pages

Example blog entry:
```javascript
{
  id: 'my-new-post',
  title: 'My New Space Post',
  // ... other fields
  image: '/images/blogs/my-new-post.jpg', // Add this line
  // ... rest of the blog data
}
```
