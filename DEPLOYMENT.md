# AstroPlay - Deployment Guide

## Vercel Deployment

This React application is optimized for deployment on Vercel with proper routing configuration.

### Prerequisites

1. **Node.js 18+** installed on your machine
2. **Vercel account** (free tier available)
3. **Git repository** connected to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hadeed711/astroplay)

### Manual Deployment Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Build the project locally** (optional test)
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect it's a Vite React app
   - Use these build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

### Configuration Files

The following files ensure proper deployment:

#### `vercel.json`
- **Rewrites all routes** to `index.html` for SPA routing
- **Fixes page refresh** 404 errors
- **CORS headers** for API routes (if needed)
- **Function configuration** for serverless functions

#### `vite.config.js`
- **Production optimizations** with code splitting
- **Asset bundling** for better performance
- **Chunk splitting** for faster loading

### Environment Variables

If you need environment variables, add them in Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variables like:
   ```
   VITE_API_URL=your_api_url
   VITE_APP_TITLE=AstroPlay
   ```

### Build Optimization

The app includes several optimizations:

- **Code splitting** by vendor, router, and UI libraries
- **Tree shaking** to remove unused code
- **Asset optimization** with Vite's built-in features
- **Lazy loading** of components where possible

### Routing Configuration

- **Client-side routing** with React Router
- **Catch-all route** (`*`) redirects to home page
- **Vercel rewrites** ensure all routes serve the SPA
- **No 404 errors** on page refresh

### Performance Features

- **Preloaded models** for smooth 3D interactions
- **Optimized images** in WebP format where possible
- **Chunked JavaScript** for faster initial load
- **CSS optimization** with Tailwind CSS purging

### Troubleshooting

#### Common Issues:

1. **404 on page refresh**
   - ✅ Fixed with `vercel.json` rewrites
   - ✅ Catch-all route in React Router

2. **Build errors**
   - Check Node.js version (18+ required)
   - Run `npm install` to update dependencies
   - Clear cache: `npm run build --force`

3. **Large bundle size**
   - ✅ Code splitting implemented
   - ✅ Dynamic imports for heavy components
   - ✅ Asset optimization enabled

4. **Slow loading**
   - ✅ Preloading of critical resources
   - ✅ Lazy loading of non-critical components
   - ✅ CDN optimization through Vercel

### Monitoring

After deployment, monitor your app:

- **Vercel Analytics** for performance metrics
- **Console errors** in browser dev tools
- **Core Web Vitals** for user experience
- **Bundle analyzer** for optimization opportunities

### Custom Domain (Optional)

To use a custom domain:

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Security Headers

The app includes basic security headers:
- CORS configuration for API routes
- Content Security Policy (recommended to add)
- HTTPS enforcement (automatic with Vercel)

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Support

For deployment issues:
- Check Vercel documentation
- Review build logs in Vercel dashboard
- Test locally with `npm run build && npm run preview`

---

**Live Demo**: [Your Vercel URL will appear here after deployment]

**Last Updated**: September 2025
