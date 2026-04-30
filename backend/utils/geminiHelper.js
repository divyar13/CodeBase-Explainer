import { GoogleGenerativeAI } from '@google/generative-ai';

export const buildAnalysisPrompt = (readmeContent, packageJsonContent, fileTree) => {
  return `You are a senior software engineer. Analyze this GitHub repository and provide:
1. One sentence summary of what this project does
2. Tech stack (languages, frameworks, databases, third-party APIs) - list as array
3. Folder structure explanation object with main folders as keys
4. How to get started locally - array of step-by-step instructions
5. 2-3 interesting observations about the codebase

Here is the data:

README:
${readmeContent || 'No README found'}

package.json:
${packageJsonContent || 'No package.json found'}

File tree structure:
${JSON.stringify(fileTree || {}, null, 2)}

Respond ONLY in valid JSON format with these exact keys:
{
  "summary": "string",
  "techStack": ["tech1", "tech2"],
  "folderExplanations": {"folder": "explanation"},
  "gettingStarted": ["step1", "step2"],
  "observations": ["observation1", "observation2"]
}`;
};

export const analyzeRepository = async (readmeContent, packageJsonContent, fileTree) => {
  try {
    const prompt = buildAnalysisPrompt(readmeContent, packageJsonContent, fileTree);

    const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || '').trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing with Gemini:', error.message);
    throw new Error(`Failed to analyze repository with AI: ${error.message}`);
  }
};
