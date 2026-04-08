# OrganicTrace Backend API

Backend API for OrganicTrace - Organic Skincare Traceability Platform

## Features

- 🔐 JWT Authentication
- 👥 Role-based Access Control (Supplier, Admin)
- 🌿 Ingredient Batch Management
- 📜 Certificate Management
- 🏭 Product Batch Creation
- 📱 QR Code Generation & Verification
- 🛒 E-commerce Orders
- 📊 Analytics & Reporting
- 🔗 Blockchain Traceability

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **File Upload:** Multer
- **Email:** Nodemailer
- **QR Codes:** qrcode package

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 9.0.0

## Installation

1. Clone the repository
2. Install dependencies:
```bash
   npm install
```

3. Create `.env` file from `.env.example`
4. Update environment variables with your values

## Running the Server

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## API Documentation

API Version: v1
Base URL: `http://localhost:5000/api/v1`

### Health Check
```
GET /health
```

### Authentication
- `POST /api/v1/auth/register` - Register new supplier
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

(More routes will be documented as we build them)

## Project Structure
```
organictrace-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Express app
├── uploads/             # File uploads
├── tests/               # Test files
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json
```

## Environment Variables

See `.env.example` for all required environment variables.

## Testing
```bash
npm test
```

## License

MIT