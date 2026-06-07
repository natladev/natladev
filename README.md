# natladev.com

My personal website showcasing my work as an iOS developer and AI researcher.

## 📋 What's Included

- **About Section**: Overview of my background, skills, and experience
- **Work & Interests**: Current projects and focus areas
- **Social Links**: Direct connections to GitHub, LinkedIn, and Twitter
- **Responsive Design**: Works beautifully on all devices
- **Dark Theme**: Modern, clean aesthetic

## 🚀 Deployment

### Option 1: Deploy to GitHub Pages (Recommended)

1. Create a new GitHub repository named `natladev-website`
2. Push this code to the repository:
   ```bash
   git remote add origin https://github.com/NatAndDev/natladev-website.git
   git branch -M main
   git push -u origin main
   ```

3. Go to GitHub repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click Save

4. GitHub will automatically deploy and provide a URL

### Step 2: Connect Your GoDaddy Domain

1. In GitHub Pages settings, add your custom domain: `natladev.com`
2. GitHub will prompt you to verify the domain

3. Go to your GoDaddy domain settings:
   - Navigate to: Domains → natladev.com → DNS
   - Click "Manage DNS"

4. Update DNS Records:
   - **Add these A records** (delete old ones if they exist):
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     
     Type: A
     Name: @
     Value: 185.199.109.153
     
     Type: A
     Name: @
     Value: 185.199.110.153
     
     Type: A
     Name: @
     Value: 185.199.111.153
     ```

   - **Add CNAME for www**:
     ```
     Type: CNAME
     Name: www
     Value: NatAndDev.github.io
     ```

5. Wait 24-48 hours for DNS propagation (often faster)
6. Go back to GitHub Pages settings and enable "Enforce HTTPS"

## 📝 Editing Content

Edit `index.html` to update:
- About section content
- Skills and tags
- Work/project descriptions
- Social media links

Edit `style.css` to customize:
- Colors (modify `:root` variables)
- Fonts and typography
- Spacing and layout

## 🎨 Customization

### Colors
Update the CSS variables in `style.css`:
```css
:root {
    --primary: #0f172a;
    --accent: #3b82f6;
    --text: #f1f5f9;
    /* ... */
}
```

### Dark/Light Mode
Currently using dark theme. To add light mode, extend the CSS with a media query:
```css
@media (prefers-color-scheme: light) {
    /* light theme colors */
}
```

## 📱 Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ SEO optimized meta tags
- ✅ Smooth scrolling navigation
- ✅ Intersection Observer animations
- ✅ Optimized performance (no external dependencies)
- ✅ Accessibility-friendly HTML structure

## 🔗 Links

- **GitHub**: https://github.com/NatAndDev
- **LinkedIn**: https://linkedin.com/in/natalia-andrzejewski
- **Twitter**: https://twitter.com/NatEinDev

---

Built with HTML, CSS, and vanilla JavaScript. Hosted on GitHub Pages.
