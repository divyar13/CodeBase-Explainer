import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repoUrl: {
    type: String,
    required: true
  },
  repoName: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  summary: String,
  techStack: [String],
  folderExplanations: mongoose.Schema.Types.Mixed,
  gettingStarted: [String],
  observations: [String],
  fileTree: mongoose.Schema.Types.Mixed,
  readmeContent: String,
  packageJsonContent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Analysis', analysisSchema);
