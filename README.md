````markdown
# 🏋️ GymFinder Frontend

> A modern, responsive web application built with **Next.js 15** for discovering, comparing, and joining nearby gyms based on distance, pricing, amenities, and verified reviews.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

GymFinder is a modern fitness marketplace inspired by platforms like **Goibibo**, **Booking.com**, and **Airbnb**, allowing users to discover, compare, and purchase gym memberships online.

The frontend provides a fast, responsive, and user-friendly experience powered by **Next.js 15**, **React 19**, and **TypeScript**.

---

## ✨ Features

### 🔍 Discover Gyms

- Search gyms by location
- Nearby gyms using geolocation
- Interactive map view
- Compare multiple gyms
- View gym details
- Featured gyms
- Popular gyms

---

### 🎯 Smart Filters

- Distance
- Membership Price
- Ratings
- Open Now
- Amenities
- Parking
- Swimming Pool
- CrossFit
- Yoga
- Female Trainer
- Personal Trainer
- Air Conditioning
- Sauna
- Steam
- Verified Gym

---

### 👤 Customer Features

- User Registration
- Login
- Google Authentication
- Profile Management
- Favorite Gyms
- Membership History
- Online Checkout
- Payment Status
- Notifications

---

### 🏢 Gym Owner Dashboard

- Dashboard
- Manage Gym Profile
- Membership Plans
- Gallery Management
- Reviews
- Analytics
- Revenue Overview

---

### 🛠 Admin Dashboard

- User Management
- Gym Approval
- Analytics
- Revenue Dashboard
- Review Moderation
- Coupons
- Cities
- Amenities

---

## 🛠 Tech Stack

### Framework

- Next.js 15 (App Router)
- React 19
- TypeScript

### UI

- Tailwind CSS
- ShadCN UI
- Framer Motion
- Lucide Icons

### Forms

- React Hook Form
- Zod Validation

### State Management

- Zustand

### Data Fetching

- TanStack Query
- Axios

### Maps

- React Leaflet
- OpenStreetMap

### Charts

- Chart.js

### Notifications

- React Hot Toast

---

## 📂 Project Structure

```text
src
├── app
├── components
│   ├── common
│   ├── layout
│   ├── ui
│   ├── gym
│   ├── booking
│   └── dashboard
├── hooks
├── services
├── store
├── lib
├── types
├── constants
├── utils
├── providers
├── styles
└── middleware.ts

public

tests
```

---

## 🏗 Architecture

```text
Pages (App Router)
        │
        ▼
Components
        │
        ▼
Hooks
        │
        ▼
Services
        │
        ▼
API Layer
        │
        ▼
Laravel Backend
```

---

## 📱 Pages

### Public

- Home
- Search
- Gym Listing
- Gym Details
- Compare Gyms
- About
- Contact

### Customer

- Login
- Register
- Dashboard
- Favorites
- Memberships
- Checkout
- Payment Success
- Payment Failed
- Notifications
- Profile

### Gym Owner

- Dashboard
- My Gym
- Plans
- Reviews
- Analytics
- Gallery

### Admin

- Dashboard
- Users
- Gyms
- Reviews
- Coupons
- Amenities
- Cities
- Reports

---

## 🚀 Getting Started

### Requirements

- Node.js 20+
- npm / pnpm / yarn
- Laravel Backend Running

---

### Installation

Clone repository

```bash
git clone https://github.com/yourusername/gymfinder-frontend.git
```

Move inside project

```bash
cd gymfinder-frontend
```

Install dependencies

```bash
npm install
```

Create environment file

```bash
cp .env.example .env.local
```

Run development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## ⚙ Environment Variables

Example

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

NEXT_PUBLIC_MAP_PROVIDER=osm

NEXT_PUBLIC_RAZORPAY_KEY=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

---

## 🌐 API Integration

The frontend communicates with the Laravel REST API.

Example

```http
GET /api/v1/gyms

GET /api/v1/gyms/{id}

POST /api/v1/auth/login

POST /api/v1/bookings
```

---

## 🎨 UI Features

- Fully Responsive
- Mobile First
- Dark Mode
- Skeleton Loaders
- Infinite Scrolling
- Image Optimization
- Animated Transitions
- Lazy Loading
- Accessible Components

---

## 📍 Maps

Powered by

- OpenStreetMap
- React Leaflet
- Nominatim

Features

- Nearby Gyms
- User Location
- Gym Markers
- Distance Display
- Directions

---

## 💳 Payments

Integrated with

- Razorpay

Supports

- Membership Checkout
- Payment Success
- Payment Failure
- Order Summary

---

## 🧪 Testing

Run tests

```bash
npm test
```

Build production

```bash
npm run build
```

Lint

```bash
npm run lint
```

---

## 🚀 Deployment

Recommended platforms

- Vercel
- Netlify
- AWS Amplify

Backend

- Laravel
- Docker
- Nginx

---

## 📋 Roadmap

- [x] Authentication
- [x] Gym Discovery
- [x] Smart Filters
- [x] Interactive Maps
- [x] Membership Checkout
- [x] Favorites
- [x] Reviews
- [ ] AI Gym Recommendation
- [ ] AI Search
- [ ] AI Review Summary
- [ ] Progressive Web App (PWA)
- [ ] Mobile Applications

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository

```bash
git checkout -b feature/new-feature
```

2. Commit changes

```bash
git commit -m "Add new feature"
```

3. Push branch

```bash
git push origin feature/new-feature
```

4. Open a Pull Request

---

## 📄 License

Licensed under the MIT License.

---

## 👨‍💻 Author

**Kartik Upadhayay**

Full Stack Developer

Laravel • React • Next.js • TypeScript • MySQL

---

⭐ If you like this project, consider giving it a star.
````
