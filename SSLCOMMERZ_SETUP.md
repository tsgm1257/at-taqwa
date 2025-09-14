# SSLCommerz Development Integration Guide

This guide will help you set up SSLCommerz payment gateway for development and testing.

## Prerequisites

1. **SSLCommerz Account**: Sign up at [SSLCommerz](https://sslcommerz.com/)
2. **Development Store**: Create a test store in SSLCommerz dashboard
3. **Environment Variables**: Configure the required environment variables

## Environment Variables Setup

Add these environment variables to your `.env.local` file:

```bash
# SSLCommerz Configuration
SSLCZ_STORE_ID=your_store_id_here
SSLCZ_STORE_PASSWD=your_store_password_here
SSLCZ_IS_SANDBOX=true

# Other required variables
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Getting SSLCommerz Credentials

### 1. Create SSLCommerz Account
- Visit [SSLCommerz](https://sslcommerz.com/)
- Sign up for a developer account
- Complete the verification process

### 2. Create Test Store
- Login to SSLCommerz dashboard
- Go to "Store Management" → "Create Store"
- Fill in the required information:
  - Store Name: "At-Taqwa Foundation (Test)"
  - Store Type: "E-commerce"
  - Business Type: "Non-profit/Charity"
  - Website URL: `http://localhost:3000` (for development)

### 3. Get Store Credentials
After store creation, you'll get:
- **Store ID**: Your unique store identifier
- **Store Password**: Your store password
- **API Credentials**: For integration

## Development Configuration

### 1. Sandbox Mode
For development, always use sandbox mode:
```bash
SSLCZ_IS_SANDBOX=true
```

### 2. Test Cards
SSLCommerz provides test card numbers for development:

**Successful Payment:**
- Card Number: `4111111111111111`
- Expiry: Any future date
- CVV: Any 3 digits

**Failed Payment:**
- Card Number: `4000000000000002`
- Expiry: Any future date
- CVV: Any 3 digits

## Testing the Integration

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Donation Flow
1. Navigate to `/donate` or any project page
2. Select "SSLCommerz" as payment method
3. Enter amount (minimum 1 BDT)
4. Click "Donate Now"
5. You'll be redirected to SSLCommerz payment page
6. Use test card details to complete payment

### 3. Test Different Scenarios
- **Successful Payment**: Use test card `4111111111111111`
- **Failed Payment**: Use test card `4000000000000002`
- **Cancelled Payment**: Click cancel on payment page

## API Endpoints

The integration includes these callback endpoints:

- **Success**: `/api/donations/success` - Handles successful payments
- **Failure**: `/api/donations/fail` - Handles failed payments
- **Cancel**: `/api/donations/cancel` - Handles cancelled payments
- **IPN**: `/api/donations/ipn` - Instant Payment Notification

## User Pages

- **Success Page**: `/donations/success` - Shows payment success
- **Failed Page**: `/donations/failed` - Shows payment failure
- **Cancelled Page**: `/donations/cancelled` - Shows payment cancellation

## Database Updates

The integration automatically:
1. Creates donation records with "initiated" status
2. Updates status to "succeeded" on successful payment
3. Updates status to "failed" on failed/cancelled payment
4. Stores payment details in the `meta` field
5. Updates project raised amounts for project donations

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use different credentials for production
- Rotate credentials regularly

### 2. Payment Validation
- All payments are validated using SSLCommerz validation API
- Transaction IDs are verified before updating donation status
- IPN (Instant Payment Notification) ensures real-time updates

### 3. Error Handling
- Graceful fallback for payment gateway failures
- Comprehensive error logging
- User-friendly error messages

## Production Deployment

### 1. SSLCommerz Production Setup
- Create production store in SSLCommerz
- Complete merchant verification
- Get production credentials

### 2. Environment Variables
```bash
SSLCZ_STORE_ID=your_production_store_id
SSLCZ_STORE_PASSWD=your_production_store_password
SSLCZ_IS_SANDBOX=false
NEXTAUTH_URL=https://your-domain.com
```

### 3. SSL Certificate
- Ensure your domain has valid SSL certificate
- SSLCommerz requires HTTPS for production

## Troubleshooting

### Common Issues

1. **"Missing MONGODB_URI" Error**
   - Ensure MongoDB connection string is correct
   - Check if MongoDB service is running

2. **"Payment initiation failed"**
   - Verify SSLCommerz credentials
   - Check if store is active
   - Ensure sandbox mode is enabled for development

3. **Callback URL Issues**
   - Verify NEXTAUTH_URL is set correctly
   - Check if callback URLs are accessible
   - Ensure proper SSL certificate for production

### Debug Mode
Enable debug logging by adding to your environment:
```bash
DEBUG=sslcommerz:*
```

## Support

- **SSLCommerz Support**: [support.sslcommerz.com](https://support.sslcommerz.com)
- **Documentation**: [developer.sslcommerz.com](https://developer.sslcommerz.com)
- **API Reference**: [developer.sslcommerz.com/api](https://developer.sslcommerz.com/api)

## Next Steps

1. Set up your SSLCommerz account and get credentials
2. Configure environment variables
3. Test the integration with test cards
4. Deploy to production with production credentials
5. Monitor payment transactions and handle any issues

The integration is now ready for development and testing! 🚀
