# 🚀 Codebase Explainer

A full-stack MERN web application that analyzes public GitHub repositories and generates AI-powered explanations of their structure, tech stack, and functionality.

## 📋 Features

- **GitHub Repository Analysis**: Paste any public GitHub repo URL to get instant AI analysis
- **Tech Stack Detection**: Automatically identifies languages, frameworks, databases, and APIs
- **Folder Structure Explanation**: Understand what each major folder does
- **Getting Started Guide**: AI-extracted setup instructions from README
- **File Browser**: Browse repository files with syntax highlighting
- **AI File Explanations**: Get explanations for individual code files
- **Analysis History**: Logged-in users can save and search their past analyses
- **Google OAuth**: Secure authentication via Google
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Backend
- **Node.js + Express.js**: API server
- **MongoDB + Mongoose**: Database for storing user data and analyses
- **Passport.js**: Google OAuth authentication
- **JWT**: Session management
- **Google Gemini API**: AI-powered code analysis
- **GitHub REST API**: Repository data fetching
- **Axios**: HTTP client

### Frontend
- **React 18**: UI framework
- **React Router**: Page navigation
- **Tailwind CSS**: Styling
- **Monaco Editor**: Code viewer with syntax highlighting
- **Lucide React**: Icons
- **Axios**: API communication

## 📁 Project Structure

```
codebase-explainer/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # OAuth & JWT strategies
│   ├── controllers/
│   │   └── analysisController.js  # Core analysis logic
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Analysis.js        # Analysis results schema
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   └── analysis.js        # Analysis endpoints
│   ├── utils/
│   │   ├── githubHelper.js    # GitHub API integration
│   │   └── geminiHelper.js    # Gemini API integration
│   ├── server.js              # Express app setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.js     # Auth hook
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Home page
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   └── Analysis.jsx   # Analysis details
│   │   ├── utils/
│   │   │   └── api.js         # API client
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .env.example               # Environment variables template
├── package.json               # Root npm package
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (for database)
- Google OAuth credentials
- Gemini API key
- GitHub token (optional, for higher rate limits)

### 1. Clone and Install

```bash
# Install all dependencies
npm run install-all
```

### 2. Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=mongodb+srv://...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GEMINI_API_KEY=...
# JWT_SECRET=your-secret-key
```

### 3. Get Your Credentials

#### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Copy your connection string

#### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Authorized redirect URI: `http://localhost:5000/auth/google/callback`)
5. Copy Client ID and Secret

#### Google Gemini API
1. Go to https://aistudio.google.com/app/apikey
2. Create an API key (free tier available)

### 4. Start Development Servers

```bash
# Terminal 1: Backend (runs on port 5000)
npm run backend

# Terminal 2: Frontend (runs on port 3000)
npm run frontend

# Or run both in one command:
npm run dev
```

### 5. Access the Application

- Open http://localhost:3000 in your browser
- Click "Sign In with Google"
- Authorize the application
- Paste a GitHub repo URL to analyze!

## 📖 Usage

### Analyzing a Repository

1. **Landing Page**: Click "Get Started" or sign in with Google
2. **Dashboard**: Paste a GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. **Analysis**: Wait for AI to analyze the repo
4. **View Results**: See tech stack, setup instructions, and folder structure
5. **Browse Files**: Click "Browse Repository Files" to explore code
6. **Explain Code**: Select any file and click "Explain this file" for detailed explanation

### Searching History

- Use the search box on the Dashboard to find past analyses
- Search by repository name, owner, or tech stack

## 🔌 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user (requires JWT)
- `POST /auth/logout` - Logout

### Analysis
- `POST /api/analysis/analyze` - Analyze a GitHub repo
- `GET /api/analysis` - Get user's analyses (with optional search)
- `GET /api/analysis/:id` - Get specific analysis
- `GET /api/analysis/:id/file?filePath=...` - Get file content
- `POST /api/analysis/:id/explain-file` - Get AI explanation for a file

## 🧠 How It Works

1. **GitHub URL Parsing**: Extract owner and repo name
2. **File Tree Fetching**: Get complete file structure using GitHub REST API
3. **Key File Analysis**: Fetch README, package.json, requirements.txt, main entry files
4. **AI Analysis**: Send structured data to Gemini API for intelligent analysis
5. **Data Storage**: Save results in MongoDB for future reference
6. **File Browsing**: Users can browse files and request explanations via Monaco Editor
7. **Individual File Explanation**: Get AI-powered explanation for any code file

## 🔒 Security Features

- **Google OAuth 2.0**: Secure authentication
- **JWT Tokens**: Stateless session management with expiration
- **MongoDB Encryption**: Secure database connection
- **Middleware Authentication**: All protected routes require valid JWT
- **CORS**: Cross-origin resource sharing configured
- **Public Repos Only**: Only analyzes public GitHub repositories

## 📊 Example Use Cases

- **Learning**: Understand how popular open-source projects are structured
- **Onboarding**: New team members can quickly understand codebase architecture
- **Documentation**: Generate plain English documentation automatically
- **Research**: Analyze multiple projects' tech stacks and patterns
- **Interview Prep**: Explore and understand diverse codebases

## 🐛 Troubleshooting

### "Invalid GitHub URL" Error
- Make sure the URL format is correct: `https://github.com/owner/repo`
- Ensure the repository is public

### "Failed to analyze repository" Error
- Check if your Gemini API key is valid
- Verify MongoDB connection in .env
- Check backend console for detailed error messages

### OAuth Redirect Not Working
- Verify `GOOGLE_CALLBACK_URL` matches your OAuth configuration
- Check that port 5000 is accessible
- Clear browser cookies and try again

### Rate Limiting
- Add a `GITHUB_TOKEN` to .env for higher GitHub API rate limits
- Gemini API has generous free tier; check quota if issues persist

## 🚀 Deployment

### Heroku (Backend)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=...
git push heroku main
```

### Vercel (Frontend)
```bash
cd frontend
npm run build
vercel --prod
```

Remember to update `FRONTEND_URL` in backend .env to your deployed frontend URL.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.
