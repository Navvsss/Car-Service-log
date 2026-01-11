# Deploying to Vercel

This guide will help you deploy the Car Service Logbook application to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com))

## Steps to Deploy

### 1. Prepare Your Repository

1. Push your code to a GitHub repository
2. Make sure all files are committed and pushed

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Add New..." and select "Project"
3. Choose "Import Git Repository"
4. Select your repository containing the Car Service Logbook
5. Click "Import"

### 3. Configure the Project (Optional)

Vercel should automatically detect that this is a static project and configure it appropriately. If prompted for build settings:

- Framework Preset: None/Static
- Build Command: None
- Output Directory: . (root)
- Install Command: npm install

### 4. Deploy

1. Click "Deploy" to start the deployment process
2. Wait for the build to complete
3. Your application will be live at a URL like `https://your-project-name.vercel.app`

## Notes

- The application uses localStorage for data persistence, which works great for static deployments
- All data will be stored in the user's browser and will persist between visits
- Each user will have their own separate data stored in their browser
- No server-side database is required for basic functionality

## Custom Domain (Optional)

After successful deployment:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain if you have one

## Troubleshooting

If you encounter issues:

1. Make sure all files are properly committed to your repository
2. Verify that the `vercel.json` file is in the root of your repository
3. Check that the project builds successfully locally before deploying