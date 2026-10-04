# Planora - Frontend Application

Planora is a modern, high-performance event management and discovery platform built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and TanStack React Query.

## 🔗 Project Links

- **Frontend Repository**: [https://github.com/MdShamim5669/Planora](https://github.com/MdShamim5669/Planora)
- **Backend Repository**: [https://github.com/MdShamim5669/Planora-Server](https://github.com/MdShamim5669/Planora-Server)
- **Live Deployed API**: [https://planora-server-vsyx.onrender.com](https://planora-server-vsyx.onrender.com)
- **Live API Health Check**: [https://planora-server-vsyx.onrender.com/api/v1/health](https://planora-server-vsyx.onrender.com/api/v1/health)

## 🚀 Key Features

- **Event Discovery & Exploration**: Filter events by category, date, price, and gathering type (Standard, Hybrid, Private, VIP).
- **Interactive UI/UX**: Motion animations, SplitText reveal effects, CountUp statistics, LineSidebar navigation, and BorderBeam interactive badges.
- **Dedicated Event Creation Studio**: Custom multi-step creation flow with gathering presets, participant limits, and instant fee calculation.
- **Participation & Ticketing**: Register for free events, join private approval-based sessions, and integrate with SSLCommerz payment flows.
- **Attendee Reviews & Ratings**: Post, edit (7-day window), and delete reviews with real-time aggregate star rating breakdowns.
- **Role-Based Portals**: Clean user dashboards for registrations, saved bookmarks, host management, and admin oversight.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Animation**: Framer Motion
- **State & Server Cache**: TanStack React Query
- **HTTP Client**: Axios with global JWT interceptors
- **Notifications**: React Hot Toast

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your API backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# Or live backend:
# NEXT_PUBLIC_API_URL=https://planora-server-vsyx.onrender.com/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Build for Production
```bash
npm run build
npm run start
```
