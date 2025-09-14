# At-Taqwa Foundation

A comprehensive web platform for a youth-led charity organization, designed to streamline financial contributions, track monthly fees, and keep the community updated on ongoing charity initiatives.

## Features

### User Management

- **Three-tier role system**: Admin, Member, User
- **Membership application workflow** with admin approval
- **Secure authentication** using NextAuth.js
- **Role-based dashboards** with tailored features

### Donation Management

- **Multiple payment methods**: SSLCommerz, bKash, Nagad, Cash
- **Donation types**: General, Zakat, Sadaqah
- **Recurring donations** support
- **Real-time tracking** and history
- **Project-specific donations**

### Monthly Fees System

- **Automated fee generation** for Members and Admins
- **Payment status tracking**: Unpaid, Partial, Paid, Waived
- **Visual analytics** with charts and reports
- **Admin fee management** with bulk operations

### Projects & Campaigns

- **Fundraising campaigns** with progress tracking
- **Project categories**: Relief, Education, Community Development
- **Real-time progress bars** and statistics
- **Public project visibility** with donation integration

### Announcements & Events

- **Community announcements** with visibility controls
- **Event management** with calendar integration
- **Marquee display** for important notices
- **Event registration** and attendee tracking

### Financial Reports

- **Monthly financial reports** with income/expense breakdown
- **Transparent reporting** with public access
- **Visual analytics** using charts and graphs
- **Export capabilities** for record keeping

### User Experience

- **Dark/Light theme** toggle
- **Multilingual support** (English & বাংলা)
- **Responsive design** for all devices
- **Modern UI/UX** with smooth animations

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/at-taqwa.git
   cd at-taqwa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   MONGODB_URI=mongodb://localhost:27017/at-taqwa
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   IMGBB_API_KEY=your-imgbb-api-key
   # ... other variables
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
at-taqwa/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── member/            # Member dashboard pages
│   │   ├── user/              # User dashboard pages
│   │   └── ...                # Public pages
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Utility functions and configurations
│   ├── models/                # MongoDB/Mongoose models
│   ├── types/                 # TypeScript type definitions
│   └── i18n/                  # Internationalization files
├── public/                    # Static assets
├── vercel.json               # Vercel deployment configuration
└── next.config.ts            # Next.js configuration
```

## Technology Stack

### **Frontend**

- **Next.js 15.5.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### **Backend**

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication solution
- **bcrypt** - Password hashing

### **Payment Integration**

- **SSLCommerz** - Payment gateway
- **bKash** - Mobile financial service
- **Nagad** - Digital payment platform

### **Deployment**

- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database
- **ImgBB** - Image hosting service

## User Roles & Permissions

### **Admin**

- Full system access and management
- User and member management
- Financial report generation
- Project and campaign management
- Announcement and event creation
- Fee management and tracking

### **Member**

- Access to member dashboard
- Monthly fee tracking and payment
- Donation history and statistics
- Project viewing and donations
- Profile management
- Event participation

### **User**

- Basic account access
- Donation capabilities
- Project viewing
- Profile management
- Membership application

## UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark/Light Theme** - User preference support
- **Multilingual** - English and বাংলা support
- **Accessibility** - ARIA labels and semantic HTML
- **Animations** - Smooth transitions and micro-interactions
- **Loading States** - Skeleton screens and progress indicators

## Security Features

- **Authentication** - Secure login with NextAuth.js
- **Authorization** - Role-based access control
- **Data Validation** - Zod schema validation
- **Password Hashing** - bcrypt encryption
- **HTTPS** - Secure data transmission
- **Input Sanitization** - XSS protection

## Analytics & Reporting

- **Donation Analytics** - Visual charts and statistics
- **Fee Tracking** - Payment status and history
- **Financial Reports** - Monthly income/expense reports
- **User Statistics** - Member and user analytics
- **Project Progress** - Real-time campaign tracking

---

**by Tanzeem Siddique**
