# 🗺️ Local Guide Platform

A full-stack platform connecting travelers with passionate local experts who offer authentic, personalized experiences. Travelers can discover unique tours, book guides securely, and explore destinations like a true local — while guides can monetize their knowledge and host meaningful experiences.

---

## 🌐 Live Demo

| Service                    | URL                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend (Live)**        | [https://local-guide-frontend-rho.vercel.app/](https://local-guide-frontend-rho.vercel.app/)   |
| **Backend (API Base URL)** | [https://local-guide-backend-0p6e.onrender.com](https://local-guide-backend-0p6e.onrender.com) |

---

## 🔐 Test Accounts (Sample Credentials)

Use the following accounts for testing the platform:

| Role        | Email                  | Password      |
| ----------- | ---------------------- | ------------- |
| **Admin**   | `admin@admin.com`      | `admin123`    |
| **Tourist** | `tourist4@example.com` | `password123` |
| **Guide**   | `guide@example.com`    | `password123` |

---

## 🚀 Project Overview

Local Guide Platform empowers locals to share their city’s hidden gems, culture, and stories through tours and experiences. Travelers can search, filter, and book guides that match their interests — whether for food walks, adventure trips, cultural tours, or photography sessions.

The platform democratizes travel guiding, making tourism more authentic and community-driven.

---

## 🎯 Objectives

- Connect travelers with local guides.
- Allow guides to create and manage tour listings.
- Provide tourists with booking and review capabilities.
- Ensure trust through profiles, verification, and ratings.
- Integrate secure payments for bookings.
- Deliver a modern and engaging user experience.

---

## ⭐ Features

### 👥 User Authentication & Roles

- Email/Password registration & login
- **Roles**: Tourist, Guide, Admin
- JWT-based authentication
- Secure password hashing

### 🧑‍💼 User Profiles (CRUD)

- Common: Name, Profile Picture, Bio, Languages
- Guide: Expertise, Daily Rate
- Tourist: Travel Preferences

### 🗺️ Tour Listings (CRUD)

- Title, Description, Itinerary
- Tour Fee, Duration, Meeting Point, Max Group Size
- Image upload via Cloudinary/ImgBB
- Guide-managed editing & deactivation

### 🔍 Search & Filtering

- City
- Language
- Category
- Price Range

### 📅 Booking Workflow

- Travelers request dates
- Guides accept/decline
- Status: **Pending → Confirmed → Completed/Cancelled**

### ⭐ Review System

- Tourists can review guides after the tour

### 💳 Payments

- Stripe
- Secure booking checkout

---

## 🛠️ Tech Stack

### **Frontend**

- Next.js
- TailwindCSS
- ShadCN

### **Backend**

- Node.js
- Express.js
- MongoDB
- JWT, bcrypt
- Cloudinary

### **DevOps**

- Vercel (Frontend)
- Render (Backend)
- Optional CI/CD

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sadia492/local-guide-frontend.git
cd local-guide-platform
```

### 2️⃣ Install dependencies

**Frontend**

```bash
cd frontend
npm install
```

**Backend**

```bash
cd backend
npm install
```

### 3️⃣ Run development servers

**Frontend**

```bash
npm run dev
```

**Backend**

```bash
npm run start:dev
```

---

## 🔑 Environment Variables

### **Backend (.env example)**

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
STRIPE_SECRET_KEY=...
```

### **Frontend (.env.local)**

```
NEXT_PUBLIC_API_URL=https://local-guide-backend-0p6e.onrender.com
NEXT_PUBLIC_CLOUDINARY_KEY=...
```

---

## 📡 API Overview

| Method | Endpoint                | Description     |
| ------ | ----------------------- | --------------- |
| POST   | `/api/auth/register`    | Register user   |
| POST   | `/api/auth/login`       | Login user      |
| GET    | `/api/users/:id`        | Get profile     |
| PATCH  | `/api/users/:id`        | Update profile  |
| GET    | `/api/listings`         | Search listings |
| POST   | `/api/listings`         | Create listing  |
| PATCH  | `/api/listings/:id`     | Edit listing    |
| DELETE | `/api/listings/:id`     | Delete listing  |
| POST   | `/api/bookings`         | Request booking |
| PATCH  | `/api/bookings/:id`     | Accept / Reject |
| POST   | `/api/reviews`          | Add review      |
| POST   | `/api/payments/booking` | Process payment |

---

## 🖥️ Frontend Architecture

### Key Pages

- `/` — Landing page
- `/explore` — Search + filters
- `/tours/[id]` — Tour details
- `/dashboard` — Guide/Tourist/Admin panels
- `/profile/[id]` — User public profile

### Components

- Role-based Navbar
- Listing Cards
- Booking Widget
- Review Section
- Photo Gallery

---

## 🧩 Backend Architecture

Modules:

- **Users** — auth, profiles, roles
- **Listings** — tour CRUD
- **Bookings** — workflow & status
- **Reviews** — feedback & rating
- **Payments** — secure processing

Middleware:

- Auth
- Role-based access
- Validation
- Error handling

---

## ▶️ Usage Guide

### 🔹 As a Tourist

- Create an account
- Search for tours
- Request bookings
- Pay for confirmed tours
- Leave reviews

### 🔹 As a Guide

- Set up a professional profile
- Create tour listings
- Manage booking requests
- Host tours
- Receive payments

### 🔹 As an Admin

- Manage users
- Manage listings
- Monitor bookings

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

---

## 📜 License

Licensed under the **MIT License**.
