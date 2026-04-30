import Analysis from '../models/Analysis.js';
import {
  parseGitHubUrl,
  getFileTree,
  getKeyFiles,
  buildFileTreeStructure
} from '../utils/githubHelper.js';
import { analyzeRepository } from '../utils/geminiHelper.js';

export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;
    const userId = req.user.id;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    const { owner, repo } = parseGitHubUrl(repoUrl);

    const fileTree = await getFileTree(owner, repo);

    const keyFiles = await getKeyFiles(owner, repo, fileTree);

    const structuredTree = buildFileTreeStructure(fileTree);

    const analysisResult = await analyzeRepository(
      keyFiles.readme,
      keyFiles.packageJson,
      structuredTree
    );

    const analysis = new Analysis({
      user: userId,
      repoUrl,
      repoName: repo,
      owner,
      summary: analysisResult.summary,
      techStack: analysisResult.techStack,
      folderExplanations: analysisResult.folderExplanations,
      gettingStarted: analysisResult.gettingStarted,
      observations: analysisResult.observations,
      fileTree: structuredTree,
      readmeContent: keyFiles.readme,
      packageJsonContent: keyFiles.packageJson
    });

    await analysis.save();

    res.json({
      id: analysis._id,
      ...analysisResult,
      repoName: repo,
      owner
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getAnalysisList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;

    let query = { user: userId };

    if (search) {
      query.$or = [
        { repoName: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } },
        { techStack: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .select('-readmeContent -packageJsonContent -fileTree');

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ _id: id, user: userId });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFileContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { filePath } = req.query;
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ _id: id, user: userId });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const { getFileContent: fetchFile } = await import('../utils/githubHelper.js');
    const content = await fetchFile(analysis.owner, analysis.repoName, filePath);

    if (!content) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ content, filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const explainFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { filePath } = req.body;
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ _id: id, user: userId });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const { getFileContent: fetchFile } = await import('../utils/githubHelper.js');
    const fileContent = await fetchFile(analysis.owner, analysis.repoName, filePath);

    if (!fileContent) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are a code expert. Explain this code file in plain English, focusing on what it does and how it works. Keep it concise and avoid unnecessary jargon.

File path: ${filePath}

Code:
\`\`\`
${fileContent}
\`\`\`

Provide a clear, concise explanation.`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.json({ explanation, filePath, content: fileContent });
  } catch (error) {
    console.error('File explanation error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
