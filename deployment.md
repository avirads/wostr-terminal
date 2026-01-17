# Deployment Guide

## Overview

This application is a Worldwide Network Explorer that allows users to search IP addresses, AS numbers, organizations, and domains. It uses Turso (libSQL) as the database and is hosted on GitHub Pages.

## Prerequisites

- GitHub account
- Turso account (free tier is sufficient)
- Node.js (optional, for local development)

## Quick Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin master
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **Deploy from a branch**
     - Branch: **master** (or main)
     - Folder: **/(root)**
   - Click **Save**
   - Wait 1-2 minutes for deployment

3. **Access Your App**
   - URL: `https://yourusername.github.io/wostr-terminal/`

### Option 2: Manual Deployment

```bash
npm install -g gh-pages
gh-pages -d .
```

## Turso Database Setup

### Creating a New Database

1. **Sign up at [Turso.tech](https://turso.tech)**
   - Use GitHub authentication for quick access
   - Free tier includes 1GB storage and 1 billion row reads/month

2. **Create Database**
   - Click "Create Database"
   - Name: `ip-to-asn-db`
   - Select region closest to your users (e.g., `aws-ap-south-1` for Asia)

3. **Get Connection Details**
   - Click your database → **Connection**
   - Copy the **libSQL URL** (format: `libsql://your-db.turso.io`)
   - Generate an **Authentication Token** and copy it

### Importing Data

1. **Clone the repository and install dependencies:**
   ```bash
   npm install @libsql/client
   ```

2. **Set environment variable:**
   ```bash
   export TURSO_AUTH_TOKEN="your-auth-token-here"
   ```

3. **Run the import script:**
   ```bash
   node push-db.js
   ```

   This will push all 1.25M+ records to your Turso database.

### Updating the Connection URL

Edit `app.js` and update the `TURSO_DB_URL` constant:

```javascript
const TURSO_DB_URL = 'libsql://your-db-name.turso.io';
```

## Local Development

### Running Locally

1. **Start a local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # OR using Node.js
   npx serve .
   ```

2. **Access at:** `http://localhost:8000`

### Database Updates

When the IP-to-ASN database is updated:

1. Download the latest database from [ip-address-databases](https://github.com/iplocate/ip-address-databases)
2. Replace `ip-to-asn.db` locally
3. Run `git lfs pull` to download the large file
4. Push to Turso:
   ```bash
   TURSO_AUTH_TOKEN="your-token" node push-db.js
   ```

## File Structure

```
wostr-terminal/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment config
├── .gitignore
├── .netlify/                   # Netlify config (optional)
├── FEATURES.html               # Features documentation
├── index.html                  # Main application
├── app.js                      # Application logic
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
├── leaflet.css                 # Map styles
├── leaflet.js                  # Map library
├── jszip.min.js                # ZIP file generation
├── push-db.js                  # Database import script
├── package.json
└── README.md
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla JavaScript |
| Database | Turso (libSQL/SQLite) |
| Maps | Leaflet.js |
| File Generation | JSZip |
| Hosting | GitHub Pages |
| Data Source | iplocate.io |

## Troubleshooting

### CORS Errors

Turso's libSQL protocol includes built-in CORS support. If you encounter CORS issues:
1. Ensure you're using the libSQL URL (not HTTP)
2. Check that your Turso database allows external connections

### Database Connection Failed

1. Verify your Turso authentication token is valid
2. Check the database URL is correct
3. Ensure the database has been created in your Turso dashboard

### Large File Issues

The database is stored in Turso, so no large file uploads are needed. The browser queries the database directly over HTTPS.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_AUTH_TOKEN` | Turso database authentication token | Yes (for import only) |
| `TURSO_DB_URL` | Turso database libSQL URL | No (hardcoded in app.js) |

## Security Notes

- The Turso authentication token is only needed for database imports
- The application uses read-only queries to the database
- No sensitive data is stored in the repository
- All database credentials should use GitHub Secrets for CI/CD

## Support

- Data provided by: [iplocate.io](https://iplocate.io)
- Database hosting: [Turso](https://turso.tech)
- Application issues: Open a GitHub issue
