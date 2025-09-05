# Pocket Legal & Budget

> Your rights and budget, at your fingertips.

A Base MiniApp that provides quick access to legal rights information and helps users track their subscriptions and daily budgets. Built for the Base ecosystem with Farcaster integration.

## 🚀 Features

### ✅ Core Features (Implemented)
- **Legal Rights Cards**: Instantly accessible guides on user rights during police stops and tenant-related issues
- **Subscription Tracker**: Simple interface to log recurring subscription costs with monthly overview
- **Daily Budget Buddy**: Tool for users to manually log daily expenses and track against budget
- **Interactive Dashboard**: Visual representation of spending habits with charts and analytics
- **Farcaster Authentication**: User login and profile management via Farcaster/Neynar API
- **Responsive Design**: Mobile-first design optimized for Base MiniApp experience

### 🔄 In Development
- **AI-Enhanced Legal Guidance**: OpenAI integration for personalized legal advice
- **Micro-transaction Payments**: Base blockchain integration for premium feature unlocks
- **Share & Save Functionality**: Social features for legal guides
- **Premium Content**: Advanced legal templates and automated insights

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Farcaster via Neynar API
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Blockchain**: Base (Ethereum L2)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-0661.git
   cd -app-development-0661
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_NEYNAR_API_KEY`: Your Neynar API key for Farcaster integration
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key

4. **Set up Supabase database**
   ```bash
   # Run the migration to create tables
   # Copy the SQL from supabase/migrations/001_initial_schema.sql
   # and run it in your Supabase SQL editor
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

### Database Schema

The application uses a PostgreSQL database with the following main tables:

- **users**: Farcaster user profiles and preferences
- **subscriptions**: User subscription tracking
- **daily_expenses**: Daily expense logging
- **legal_guides**: Legal content and guides
- **user_interactions**: Guide views, saves, and shares
- **premium_unlocks**: Premium feature access tracking

### API Integration

1. **Farcaster/Neynar**: User authentication and social features
2. **Supabase**: Database operations and real-time updates
3. **OpenAI**: AI-powered legal guidance and budget insights
4. **Base Network**: Blockchain transactions for premium features

### Fallback Strategy

The app gracefully degrades when APIs are unavailable:
- **No Supabase**: Falls back to localStorage
- **No Neynar**: Uses demo authentication
- **No OpenAI**: Shows static content with upgrade prompts

## 🎯 User Flows

### Legal Awareness Access
1. User opens app
2. User selects 'Know Your Rights' category
3. App displays relevant Legal Rights Card
4. User can save or share the card information

### Subscription Tracking
1. User navigates to 'Budget' section
2. User selects 'Subscription Tracker'
3. User taps 'Add Subscription'
4. User inputs subscription details
5. App displays monthly subscription summary

### Daily Budgeting
1. User navigates to 'Budget' section
2. User selects 'Daily Budget Buddy'
3. User inputs daily expenses
4. App visualizes spending against budget
5. User can view historical spending

## 💰 Business Model

### Micro-transactions
- **Free Tier**: Basic legal info and manual budget entry
- **Premium Unlock**: $0.50 - $1.00 for advanced features
- **Subscription**: $2.99/month for automated tracking and AI insights

### Premium Features
- AI-powered legal advice
- Advanced budget analytics
- Automated subscription tracking
- Premium legal templates
- Priority customer support

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── Dashboard.jsx   # Analytics dashboard
│   ├── LegalGuides.jsx # Legal rights cards
│   ├── BudgetTracker.jsx # Budget management
│   └── AuthButton.jsx  # Authentication UI
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hooks
├── lib/                # API clients
│   ├── supabase.js     # Supabase client
│   ├── neynar.js       # Farcaster/Neynar client
│   └── openai.js       # OpenAI client
├── services/           # Business logic
│   └── database.js     # Database operations
└── App.jsx             # Main app component
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | No* |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | No* |
| `VITE_NEYNAR_API_KEY` | Neynar API key | No* |
| `VITE_OPENAI_API_KEY` | OpenAI API key | No* |
| `VITE_BASE_CHAIN_ID` | Base network chain ID | No |
| `VITE_BASE_RPC_URL` | Base network RPC URL | No |

*Not required for development - app will use fallbacks

## 🚀 Deployment

### Base MiniApp Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider**
   - Vercel (recommended)
   - Netlify
   - Base hosting

3. **Configure environment variables** in your hosting provider

4. **Set up domain and SSL**

5. **Register as Base MiniApp** following Base ecosystem guidelines

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API keys secured
- [ ] SSL certificate installed
- [ ] Performance optimized
- [ ] Error monitoring setup
- [ ] Analytics configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Community**: Join the Base ecosystem Discord for general support

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] Basic UI/UX implementation
- [x] Legal guides system
- [x] Budget tracking functionality
- [x] Farcaster authentication
- [x] Database integration

### Phase 2: Enhanced Features 🔄
- [ ] AI-powered legal guidance
- [ ] Premium payment system
- [ ] Social sharing features
- [ ] Advanced analytics

### Phase 3: Scale & Optimize 📋
- [ ] Performance optimization
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced legal content

---

**Built with ❤️ for the Base ecosystem**
