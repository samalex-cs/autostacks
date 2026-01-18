# AutoStack Frontend

Enterprise-grade Next.js 14 frontend for the AutoStack car marketplace platform.

## Tech Stack

- **Next.js 14** - App Router with Server & Client Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom yellow theme
- **Firebase Auth** - Email OTP / Magic Link authentication
- **Contentstack SDK** - Headless CMS integration
- **Lucide React** - Beautiful icons

## Features

- 🚗 Browse new and used cars
- 🔐 Secure passwordless authentication
- 📱 Fully responsive design
- ⚡ Server-side rendering for SEO
- 💛 Premium yellow-themed UI
- 📊 User dashboard with interests & test drives

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project with Email Link sign-in enabled
- Contentstack stack (optional)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id

# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Contentstack (optional)
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your-api-key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── cars/              # Car listing & details
│   │   ├── page.tsx       # Car listing
│   │   └── [carId]/       # Car details
│   ├── auth/              # Authentication
│   │   ├── login/         # Login page
│   │   └── callback/      # Magic link callback
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── Tabs.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CarCard.tsx
│   └── CarDetails.tsx
├── lib/                   # Library integrations
│   ├── firebase/         # Firebase SDK
│   │   ├── client.ts     # Firebase initialization
│   │   ├── auth.ts       # Authentication methods
│   │   ├── session.ts    # Session management
│   │   └── api.ts        # Backend API wrapper
│   └── contentstack/     # Contentstack SDK
│       ├── client.ts     # SDK initialization
│       └── queries.ts    # Content queries
├── styles/               # Additional styles
│   └── theme.css         # Theme variables
├── utils/                # Utilities
│   ├── validators.ts     # Form validation
│   └── formatters.ts     # Data formatting
└── public/               # Static assets
```

## Design System

### Color Palette

**Primary (Yellow):**
- `#FACC15` - Primary yellow
- `#EAB308` - Deep amber
- `#FDE047` - Soft bright yellow

**Navy Accents:**
- `#1E293B` - Navy gray
- `#334155` - Slate
- `#0F172A` - Deep navy

### Typography

- **Font Family:** Plus Jakarta Sans
- **Headings:** Font weight 600-700
- **Body:** Font weight 400-500

### Components

All components follow enterprise patterns:
- Accessible (ARIA labels, keyboard navigation)
- Responsive (mobile-first approach)
- Themeable (CSS variables)
- Animated (subtle micro-interactions)

## API Integration

The frontend communicates with the backend API for:
- User profile management
- Interest tracking
- Test drive bookings

All API calls automatically include Firebase ID tokens for authentication.

## Docker

### Build & Run

```bash
# Build Docker image
docker build -t autostack-frontend .

# Run container
docker run -p 3000:3000 autostack-frontend
```

### With Docker Compose

```bash
# From project root
docker-compose up --build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private - All rights reserved

