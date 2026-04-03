# Noble Homoeopathy - Vercel Deployment Guide

## Quick Start s

### Option 1: Deploy via Git (Recommended)

1. **Initialize Git Repository**
   ```bash
   cd noblehomeo-vercel
   git init
   git add .
   git commit -m "Initial commit: Noble Homoeopathy website"
   ```

2. **Push to GitHub**
   - Create a new repository on [GitHub](https://github.com/new)
   - Name it `noblehomeo` (or similar)
   - Follow GitHub's instructions to push your code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/noblehomeo.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Log in with GitHub
   - Click "New Project"
   - Select your `noblehomeo` repository
   - Click "Deploy"
   - Your site will be live in seconds!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd noblehomeo-vercel
   vercel
   ```

3. **Follow the prompts** and your site will be live!

### Option 3: Drag & Drop (Easiest)

1. Go to [vercel.com](https://vercel.com/new/static)
2. Drag and drop the `noblehomeo-vercel` folder
3. Done! Your site is live.

---

## What's Included

- **index.html** - Your complete website with all styling and functionality
- **vercel.json** - Vercel configuration
- **.gitignore** - Git ignore rules

## Features

- ✅ Fully responsive design
- ✅ All external resources (CDN hosted)
- ✅ SEO optimized with meta tags
- ✅ Font Awesome icons
- ✅ Google Fonts integration
- ✅ Fancybox image gallery

## Custom Domain

After deployment, you can add a custom domain:

1. Go to your Vercel Project Settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Support

For issues or questions:
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create an issue in your repository

---

**Your site is ready to deploy! Choose your preferred method above.** 🚀
