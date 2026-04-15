import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.warn('Running in development mode without persistence.');
  }
};
