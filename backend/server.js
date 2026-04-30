import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';

async function startServer() {
  await import('./config/passport.js');

  const app = express();

  const dbConnected = await connectDB();

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(o => o.trim());
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  };

  if (dbConnected) {
    const store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
    store.on('error', (err) => console.warn('⚠️  Session store error:', err.message));
    sessionConfig.store = store;
  }

  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', authRoutes);
  app.use('/api/analysis', analysisRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});
