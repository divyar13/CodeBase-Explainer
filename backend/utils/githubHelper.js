import axios from 'axios';

const GITHUB_API = 'https://api.github.com';
const headers = process.env.GITHUB_TOKEN
  ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
  : {};

export const parseGitHubUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/\s.]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2] };
};

export const getFileTree = async (owner, repo) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      { headers }
    );
    return response.data.tree || [];
  } catch (error) {
    console.error('Error fetching file tree:', error.message);
    throw new Error('Failed to fetch file tree from GitHub');
  }
};

export const getFileContent = async (owner, repo, path) => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    if (response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error.message);
    return null;
  }
};

export const getKeyFiles = async (owner, repo, fileTree) => {
  const keyFiles = {
    readme: null,
    packageJson: null,
    requirementsTxt: null,
    mainEntry: null
  };

  const files = fileTree.filter(item => item.type === 'blob');

  const readmeFile = files.find(f => f.path.match(/^readme\.md$/i));
  if (readmeFile) {
    keyFiles.readme = await getFileContent(owner, repo, readmeFile.path);
  }

  const pkgFile = files.find(f => f.path === 'package.json');
  if (pkgFile) {
    keyFiles.packageJson = await getFileContent(owner, repo, pkgFile.path);
  }

  const reqFile = files.find(f => f.path === 'requirements.txt');
  if (reqFile) {
    keyFiles.requirementsTxt = await getFileContent(owner, repo, reqFile.path);
  }

  const entryFiles = ['index.js', 'app.js', 'main.js', 'src/index.js', 'src/main.js', 'main.py', 'app/main.py'];
  for (const entryPath of entryFiles) {
    const file = files.find(f => f.path === entryPath);
    if (file) {
      keyFiles.mainEntry = await getFileContent(owner, repo, file.path);
      break;
    }
  }

  return keyFiles;
};

export const buildFileTreeStructure = (files) => {
  const tree = {};

  files.forEach(file => {
    const parts = file.path.split('/');
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        if (!current.files) current.files = [];
        current.files.push({
          name: part,
          path: file.path,
          type: 'file'
        });
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }
  });

  return tree;
};
