# Frontend - Teknologi Modern dan Edukasi

Modern news platform frontend built with React + TypeScript + Vite.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  ├── components/     # Reusable React components
  ├── pages/          # Page components
  ├── services/       # API services
  ├── hooks/          # Custom React hooks
  ├── types/          # TypeScript type definitions
  ├── styles/         # CSS and Tailwind config
  ├── App.tsx         # Main app component
  └── main.tsx        # Entry point
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_API_URL=http://localhost:8000/api
```

## Features

- Modern, responsive design with Tailwind CSS
- Type-safe API integration with TypeScript
- Client-side routing with React Router
- Comprehensive article browsing and search
- User authentication and profiles
- Comment system
- Saved articles functionality
- Newsletter subscription

## Technologies

- React 18
- TypeScript 5
- Vite 5
- React Router 6
- Axios for HTTP requests
- Tailwind CSS for styling
