# 🏠 RealEstate Pro - Modern Real Estate Web Application

A full-featured, modern, and responsive Real Estate Web Application built with Next.js 14 and Node.js/Express.

## 🚀 Features

### Frontend
- ✅ Modern & Attractive UI with Tailwind CSS
- ✅ Fully Responsive Design (Mobile, Tablet, Desktop)
- ✅ Fast-loading, SEO-optimized pages with Next.js 14 App Router
- ✅ Advanced Property Search & Filtering
- ✅ Interactive Google Maps Integration
- ✅ User Authentication (Login/Register/Forgot Password)
- ✅ Property Favorites & Saved Searches
- ✅ Contact & Inquiry System
- ✅ Image Gallery with Lightbox
- ✅ Form Validation with React Hook Form & Zod

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB Database with Mongoose
- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (Admin, Agent, User)
- ✅ Image Upload with Multer & Cloudinary
- ✅ Email Notifications with Nodemailer
- ✅ Rate Limiting & Security Features (Helmet, CORS)
- ✅ Data Seeding for Development

### Admin Dashboard
- ✅ Property Management (CRUD)
- ✅ User Management
- ✅ Agent Management
- ✅ Inquiry Management
- ✅ Analytics & Statistics

### Agent Dashboard
- ✅ Manage Own Listings
- ✅ View Inquiries
- ✅ Performance Metrics

## 📁 Project Structure

```
real-estate/
├── frontend/                 # Next.js 14 Frontend
│   ├── app/                  # App Router Pages
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── properties/       # Property pages
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact page
│   │   └── agents/           # Agents page
│   ├── components/           # Reusable Components
│   │   ├── home/             # Homepage components
│   │   ├── property/         # Property components
│   │   └── common/           # Common components
│   ├── lib/                  # Utilities & Helpers
│   ├── context/              # React Context Providers
│   └── public/               # Static Assets
│
├── backend/                  # Node.js/Express Backend
│   ├── config/               # Database Configuration
│   ├── controllers/          # Route Controllers
│   ├── middleware/           # Express Middleware
│   ├── models/               # Mongoose Models
│   ├── routes/               # API Routes
│   ├── utils/                # Utility Functions
│   └── seeder.js             # Database Seeder
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form + Zod
- **Maps:** Google Maps API / Leaflet
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Validation:** Joi
- **Email:** Nodemailer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realestate
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Agent/Admin)
- `PUT /api/properties/:id` - Update property (Owner/Admin)
- `DELETE /api/properties/:id` - Delete property (Owner/Admin)
- `GET /api/properties/featured` - Get featured properties

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get all inquiries (Admin/Agent)
- `PUT /api/inquiries/:id` - Update inquiry status

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

## 🔐 User Roles

1. **User** - Browse properties, save favorites, submit inquiries
2. **Agent** - All user features + manage own listings
3. **Admin** - Full access to all features and management

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Color Scheme

- Primary: #2563eb (Blue)
- Secondary: #1e40af (Dark Blue)
- Accent: #f59e0b (Amber)
- Success: #10b981 (Green)
- Error: #ef4444 (Red)

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

Built with ❤️ for RealEstate Pro
