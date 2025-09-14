# Deployment Guide for At-Taqwa Foundation

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**: Set up MongoDB Atlas or use another MongoDB service
3. **Payment Gateway Accounts**: Set up accounts with SSLCommerz, bKash, and Nagad
4. **Image Hosting**: Set up ImgBB account for image uploads

## Environment Variables Setup in Vercel

**IMPORTANT**: You need to set up these environment variables in your Vercel dashboard, NOT in the code.

### Step-by-Step Setup:

1. **Go to your Vercel dashboard**
2. **Select your project** (at-taqwa)
3. **Go to Settings → Environment Variables**
4. **Add each variable** with the following names and values:

### Required Variables

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/at-taqwa` |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | `your-super-secret-key-here` |
| `NEXTAUTH_URL` | Your Vercel app URL | `https://your-app.vercel.app` |
| `IMGBB_API_KEY` | ImgBB API key for image uploads | `your-imgbb-api-key` |
| `SSLCZ_STORE_ID` | SSLCommerz store ID | `your-store-id` |
| `SSLCZ_STORE_PASSWD` | SSLCommerz store password | `your-store-password` |
| `SSLCZ_IS_SANDBOX` | SSLCommerz sandbox mode | `true` |
| `BKASH_USERNAME` | bKash username | `your-bkash-username` |
| `BKASH_PASSWORD` | bKash password | `your-bkash-password` |
| `BKASH_APP_KEY` | bKash app key | `your-bkash-app-key` |
| `BKASH_APP_SECRET` | bKash app secret | `your-bkash-app-secret` |
| `BKASH_SANDBOX` | bKash sandbox mode | `true` |
| `NAGAD_MERCHANT_ID` | Nagad merchant ID | `your-nagad-merchant-id` |
| `NAGAD_PG_PUBLIC_KEY` | Nagad public key | `your-nagad-public-key` |
| `NAGAD_MERCHANT_PRIVATE_KEY` | Nagad private key | `your-nagad-private-key` |
| `NAGAD_SANDBOX` | Nagad sandbox mode | `true` |

### Minimum Required for Basic Functionality:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Deployment Steps

### 1. Prepare Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Ensure all files are committed and pushed

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### 3. Configure Environment Variables

1. In your Vercel dashboard, go to your project
2. Navigate to Settings → Environment Variables
3. Add all the environment variables listed above
4. Make sure to set them for all environments (Production, Preview, Development)

### 4. Configure Domain (Optional)

1. In your Vercel dashboard, go to Settings → Domains
2. Add your custom domain if you have one
3. Configure DNS settings as instructed

## Post-Deployment Setup

### 1. Create Admin User

After deployment, you'll need to create an admin user. You can do this by:

1. Register a new user through the signup form
2. Manually update the user's role to "Admin" in your MongoDB database
3. Or create a script to seed an admin user

### 2. Test All Features

1. **Authentication**: Test login/logout functionality
2. **Donations**: Test donation flow (use sandbox mode)
3. **File Uploads**: Test profile photo uploads
4. **Email**: Ensure email functionality works
5. **Database**: Verify all database operations work

### 3. Configure Payment Gateways

1. Update payment gateway settings to production mode
2. Test payment flows thoroughly
3. Configure webhooks if needed

## Monitoring and Maintenance

### 1. Set up Monitoring

- Use Vercel Analytics for performance monitoring
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor database performance

### 2. Regular Backups

- Set up automated MongoDB backups
- Regular database maintenance
- Monitor storage usage

### 3. Security

- Regularly update dependencies
- Monitor for security vulnerabilities
- Use HTTPS (automatically provided by Vercel)
- Implement rate limiting for API endpoints

## Troubleshooting

### Common Issues

1. **Build Failures**: Check environment variables and dependencies
2. **Database Connection**: Verify MongoDB URI and network access
3. **Image Uploads**: Check ImgBB API key and quota
4. **Payment Issues**: Verify payment gateway credentials

### Support

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Next.js deployment guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

## Production Checklist

- [ ] All environment variables configured
- [ ] Database connection working
- [ ] Payment gateways configured (production mode)
- [ ] Image uploads working
- [ ] Email functionality working
- [ ] Admin user created
- [ ] SSL certificate active
- [ ] Performance monitoring set up
- [ ] Error tracking configured
- [ ] Backup strategy implemented
