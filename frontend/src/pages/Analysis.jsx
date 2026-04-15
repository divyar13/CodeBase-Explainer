import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Code2, FileText, Folder, Loader, Sparkles, ChevronRight, Terminal } from 'lucide-react';

export default function Analysis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fileExplanation, setFileExplanation] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [error, setError] = useState('');
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await api.getAnalysis(id);
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to load analysis');
    }
  };

  const handleFileClick = async (filePath) => {
    setSelectedFile(filePath);
    setFileContent('');
    setFileExplanation('');
    setLoadingFile(true);
    try {
      const response = await api.getFileContent(id, filePath);
      setFileContent(response.data.content);
    } catch (err) {
      setError('Failed to load file');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleExplainFile = async () => {
    if (!selectedFile) return;
    setLoadingExplanation(true);
    try {
      const response = await api.explainFile(id, selectedFile);
      setFileExplanation(response.data.explanation);
    } catch (err) {
      setError('Failed to explain file');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const getLanguage = (filePath) => {
    const ext = filePath?.split('.').pop();
    const map = { js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript', py: 'python', css: 'css', html: 'html', json: 'json', md: 'markdown', sh: 'shell', yml: 'yaml', yaml: 'yaml' };
    return map[ext] || 'plaintext';
  };

  const getFileTree = (tree, depth = 0) => {
    const items = [];
    if (tree.files) {
      tree.files.forEach((file) => {
        items.push(
          <button
            key={file.path}
            onClick={() => handleFileClick(file.path)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs rounded-lg transition-colors ${
              selectedFile === file.path
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <FileText size={12} className="flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </button>
        );
      });
    }
    Object.entries(tree).forEach(([key, value]) => {
      if (key !== 'files' && typeof value === 'object') {
        items.push(
          <div key={key} className="mt-2">
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-zinc-600 uppercase tracking-wider">
              <Folder size={11} />
              {key}
            </div>
            <div className="pl-3 border-l border-zinc-800/50 ml-4">
              {getFileTree(value, depth + 1)}
            </div>
          </div>
        );
      }
    });
    return items;
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader className="animate-spin text-zinc-700" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-px h-4 bg-zinc-800" />
          <Code2 size={15} className="text-indigo-400" />
          <span className="font-medium text-zinc-200 text-sm">{analysis.owner}/{analysis.repoName}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 fade-in">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <p className="text-zinc-400 text-base mb-8 max-w-3xl leading-relaxed">{analysis.summary}</p>

        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {analysis.techStack?.map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={14} className="text-indigo-400" />
              <h2 className="font-semibold text-zinc-100 text-sm">Getting Started</h2>
            </div>
            <ol className="space-y-3">
              {analysis.gettingStarted?.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  <span className="text-zinc-400 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-violet-400" />
              <h2 className="font-semibold text-zinc-100 text-sm">Observations</h2>
            </div>
            <ul className="space-y-3">
              {analysis.observations?.map((obs, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <ChevronRight size={13} className="flex-shrink-0 mt-0.5 text-violet-500" />
                  <span className="text-zinc-400 leading-relaxed">{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {analysis.fileTree && (
          <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowFiles(!showFiles)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Folder size={15} className="text-zinc-500" />
                <span className="font-medium text-zinc-200 text-sm">Browse Repository Files</span>
              </div>
              <ChevronRight
                size={15}
                className={`text-zinc-600 transition-transform duration-200 ${showFiles ? 'rotate-90' : ''}`}
              />
            </button>

            {showFiles && (
              <div className="border-t border-zinc-800 flex" style={{ height: '480px' }}>
                <div className="w-52 border-r border-zinc-800 overflow-y-auto p-2 flex-shrink-0 bg-zinc-950/40">
                  {getFileTree(analysis.fileTree)}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  {selectedFile ? (
                    <>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-950/60">
                        <span className="text-xs font-mono text-zinc-500 truncate">{selectedFile}</span>
                        <button
                          onClick={handleExplainFile}
                          disabled={loadingExplanation}
                          className="flex items-center gap-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg text-xs font-medium transition-colors flex-shrink-0 ml-3"
                        >
                          {loadingExplanation ? <Loader size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          Explain
                        </button>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        {loadingFile ? (
                          <div className="h-full flex items-center justify-center">
                            <Loader className="animate-spin text-zinc-700" size={22} />
                          </div>
                        ) : (
                          <Editor
                            height="100%"
                            value={fileContent}
                            language={getLanguage(selectedFile)}
                            theme="vs-dark"
                            options={{
                              readOnly: true,
                              minimap: { enabled: false },
                              fontSize: 13,
                              lineNumbers: 'on',
                              scrollBeyondLastLine: false,
                              fontFamily: 'JetBrains Mono, Fira Code, monospace',
                            }}
                          />
                        )}
                      </div>

                      {fileExplanation && (
                        <div className="border-t border-zinc-800 p-4 bg-violet-500/5 max-h-40 overflow-y-auto">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-violet-400 mb-2">
                            <Sparkles size={11} />
                            AI Explanation
                          </div>
                          <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">{fileExplanation}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-700">
                      <FileText size={24} />
                      <p className="text-sm">Select a file to view its content</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Folder size={14} className="text-zinc-500" />
            <h2 className="font-semibold text-zinc-100 text-sm">Folder Structure</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(analysis.folderExplanations || {}).map(([folder, explanation]) => (
              <div key={folder} className="flex gap-4 text-sm">
                <code className="text-indigo-400 font-mono flex-shrink-0">{folder}/</code>
                <p className="text-zinc-500 leading-relaxed">{explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
