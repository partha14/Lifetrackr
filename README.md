# LifeTrackr

LifeTrackr is a comprehensive web application designed to help users manage their daily lives by tracking chores, purchases, and personal tasks. Built with modern web technologies, it offers a user-friendly interface for efficient life management.

## Features

- **User Authentication**: Secure signup and login functionality.
- **Dashboard**: A central hub displaying an overview of chores and recent purchases.
- **Chore Management**: Add, view, and manage recurring and one-time chores.
- **Purchase Tracking**: Log and monitor your purchases, including warranty information.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: CSS Modules
- **Backend & Authentication**: Supabase
- **State Management**: React Hooks
- **Icons**: React Icons
- **Date Handling**: date-fns
- **Analytics**: Vercel Analytics

## Project Structure

```
LifeTrackr/
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages and API routes
├── public/             # Static files
├── styles/             # CSS modules and global styles
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
└── package.json        # Project dependencies and scripts
```

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lifetrackr.git
   cd lifetrackr
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the built application in production mode.
- `npm run lint`: Runs the linter to check for code quality issues.

## Contributing

We welcome contributions to LifeTrackr! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

Please ensure your code adheres to the existing style and passes all tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vercel](https://vercel.com/) for hosting and analytics

---

For any questions or support, please open an issue in the GitHub repository.
