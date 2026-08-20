# Google OAuth Setup Guide

## Overview
This guide will help you set up Google OAuth login for CollegeMart.

## Prerequisites
- Google Cloud Console account
- A project in Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "CollegeMart")
5. Click "CREATE"

## Step 2: Set Up OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** for User type
3. Click **CREATE**
4. Fill in the form:
   - **App name**: CollegeMart
   - **User support email**: your-email@college.edu
   - **Developer contact information**: your-email@college.edu
5. Click **SAVE AND CONTINUE**
6. On **Scopes** page, click **SAVE AND CONTINUE** (default scopes are fine)
7. On **Test users** page, add your test email addresses
8. Click **SAVE AND CONTINUE**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Web application**
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://localhost:3002`
   - Your production domain (e.g., `https://collegemart.com`)

5. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://localhost:3002`
   - Your production domain

6. Click **CREATE**
7. Copy your **Client ID**

## Step 4: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Google Client ID to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_from_step_3
   ```

3. Update other environment variables as needed:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=collegemart
   ```

## Step 5: Update Frontend Google Client ID

The frontend needs the same Google Client ID. In `src/App.jsx`, replace:
```jsx
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
```

With your actual Client ID from Step 3.

## Step 6: Test Google Login

1. Start the development server:
   ```bash
   npm run dev:full
   ```

2. Open the app in your browser: `http://localhost:3001`

3. Click on **Login** button

4. You should see a "Continue with Google" button

5. Click it and test the login flow

## Troubleshooting

### "Invalid Client ID" Error
- Make sure `GOOGLE_CLIENT_ID` is set correctly in `.env`
- Verify Client ID is copied from Google Console without extra spaces

### "Redirect URI mismatch" Error
- Add your current localhost port to **Authorized redirect URIs** in Google Console
- Wait a few minutes for changes to take effect

### "CORS Error"
- Make sure `CORS_ORIGIN` in `.env` includes your frontend URL
- Restart the server after changing `.env`

### Google Login Button Not Showing
- Make sure `GoogleOAuthProvider` is properly wrapping the app in `App.jsx`
- Check browser console for errors
- Verify Google Client ID is set in `App.jsx`

## Production Deployment

When deploying to production:

1. Get a new Google Client ID for your production domain
2. Add production domain to **Authorized JavaScript origins** and **Authorized redirect URIs**
3. Update `.env` with production Google Client ID
4. Update `App.jsx` with production Client ID or use environment variable
5. Redeploy the application

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [@react-oauth/google Documentation](https://github.com/react-oauth/react-oauth.google)
