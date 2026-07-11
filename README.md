# DubLaunch 🚀

**The ProductHunt for UW students** - Discover and share amazing student projects from the University of Washington community.

## 🌟 Features

- **Project Discovery**: Browse and discover innovative projects by UW students
- **Project Launching**: Submit your own projects with images, descriptions, and links
- **Voting System**: Upvote your favorite projects to help them rise in rankings
- **Community Forums**: Engage in discussions across different categories
- **Leaderboard**: See the top-performing projects (unlocked with 5+ projects)
- **User Profiles**: Showcase your work and connect with other Huskies
- **Search**: Find projects and users across the platform
- **Comments**: Engage with projects through comments and replies

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel
- **Authentication**: Supabase Auth with email verification
- **UI Components**: Lucide React icons, React Hot Toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DubLaunch.git
   cd DubLaunch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url
   DIRECT_URL=your_direct_url
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the database setup scripts (see Database Setup section)
   - Configure Row Level Security policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

This project uses Supabase PostgreSQL. You'll need to:

1. Create tables for users, projects, votes, comments, and forums
2. Set up Row Level Security (RLS) policies
3. Configure authentication settings
4. Set up real-time subscriptions (optional)

**Note**: Database setup scripts live in `sql/` (gitignored for security). See `sql/README.md` for setup order. Contact the maintainers for database setup instructions.

## 🏗️ Project Structure

```
DubLaunch/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── forums/            # Forum system
│   ├── launch/            # Project submission
│   ├── profile/           # User profiles
│   ├── discover/          # Project discovery
│   ├── leaderboard/       # Rankings
│   ├── search/            # Search functionality
│   └── ...
├── components/            # Reusable UI components
├── docs/                  # Project documentation
│   ├── setup/             # Environment & auth setup guides
│   ├── features/          # Feature implementation docs
│   └── fixes/             # Bug fix notes & patches
├── lib/                   # Utility functions and configurations
│   ├── supabase/          # Supabase client setup
│   └── utils/             # Helper functions
├── public/                # Static assets
├── sql/                   # Database scripts (local only, gitignored)
│   ├── schema/            # Table definitions
│   ├── migrations/        # Schema changes
│   ├── policies/          # RLS & auth policies
│   ├── fixes/             # Data repair scripts
│   └── debug/             # Diagnostic queries
└── ...
```

## 🔐 Security

This repository is configured for public use with:
- Environment variables properly excluded
- Sensitive database files ignored
- No hardcoded credentials or API keys
- Secure authentication implementation

## 🎨 UI/UX Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **UW Branding**: Official UW colors and styling
- **Dark/Light Mode**: Adaptive design elements
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Environment Variables

Required environment variables for production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

## 🤝 Contributing

We welcome contributions from the UW community! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐕 About

Built by Huskies, for Huskies. DubLaunch celebrates the innovative spirit of the University of Washington community and provides a platform for students to showcase their amazing work.

## 📞 Support

- **Email**: support@dublaunch.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/DubLaunch/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/DubLaunch/wiki)

## 🏆 Roadmap

- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Project collaboration features
- [ ] Mobile app development
- [ ] Integration with UW systems

---

**Go Dawgs! 🐕**