# LifeTrackr

LifeTrackr is a web application for managing personal tasks, chores, and purchases.

## Project Structure

```
LifeTrackr/
├── components/
│   ├── AddChoreForm.tsx
│   ├── AddPurchaseForm.tsx
│   ├── DarkModeToggle.tsx
│   ├── Layout.tsx
│   └── LoadingSpinner.tsx
├── hooks/
│   ├── useAddPurchaseForm.ts
│   └── useAuth.ts
├── pages/
│   ├── _app.tsx
│   ├── chores.tsx
│   ├── dashboard.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── purchases.tsx
│   └── signup.tsx
├── styles/
│   ├── Auth.module.css
│   ├── DarkModeToggle.module.css
│   ├── Dashboard.module.css
│   ├── Form.module.css
│   ├── Home.module.css
│   ├── LoadingSpinner.module.css
│   └── globals.css
├── types/
│   └── Purchase.ts
├── utils/
│   ├── errorHandler.ts
│   └── supabaseClient.ts
└── package.json
```

## Project Overview

LifeTrackr is a Next.js application that helps users manage their daily life by tracking chores and purchases. It uses Supabase for authentication and data storage.

### Key Features:
- User authentication (signup, login)
- Dashboard with overview of chores and purchases
- Chore management
- Purchase tracking
- Dark mode toggle

### Tech Stack:
- Next.js
- React
- TypeScript
- Supabase
- CSS Modules

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Supabase project and add the credentials to your environment
4. Run the development server: `npm run dev`

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

[Add your chosen license here]
