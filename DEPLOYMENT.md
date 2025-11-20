# Deployment Guide

## Issue Fixed
Fixed 404 error when generating images caused by hardcoded API URL that was either down or misconfigured.

## Solution
Changed the API configuration to use environment variables, allowing proper configuration for different environments (development, production).

## Deployment Steps

### For Vercel (Client Deployment)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new environment variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://image-generation-0g9d.onrender.com/api/`
   - **Environment**: Production (or all environments)
4. Redeploy your application

### For Render.com (Server Deployment)

1. Ensure your server is properly deployed and running
2. Verify the MongoDB connection string is correct
3. Add the `GOOGLE_API_KEY` environment variable in Render settings

### For Local Development

1. Copy `client/.env.example` to `client/.env`
2. Leave it as default (points to `http://localhost:8080/api/`)
3. Create `server/.env` with your `GOOGLE_API_KEY`
4. Run server: `cd server && npm start`
5. Run client: `cd client && npm start`

## Testing

After deployment:
1. Visit your Vercel URL
2. Navigate to "Create Post" page
3. Enter a prompt and click "Generate Image"
4. Verify the image generates successfully without 404 errors

## Troubleshooting

If you still see 404 errors:
1. Verify the backend URL is correct and accessible
2. Check that the backend is running
3. Verify CORS is properly configured on the server
4. Check browser console for exact error details
