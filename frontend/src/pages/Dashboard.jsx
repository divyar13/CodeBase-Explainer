import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { Code2, LogOut, Search, Loader, Github, ArrowRight, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await api.getAnalysisList(searchTerm);
      setAnalyses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) { setError('Please enter a repository URL'); return; }
    setAnalyzing(true);
    setError('');
    try {
      const response = await api.analyzeRepo(repoUrl);
      setRepoUrl('');
      await fetchAnalyses();
      navigate(`/analysis/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchAnalyses(e.target.value);
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-indigo-400" />
            <span className="font-semibold tracking-tight">CodeBase</span>
          </div>
          <div className="flex items-center gap-3">
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" />
            )}
            <span className="text-sm text-zinc-500 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-zinc-50 mb-1 tracking-tight">Analyze a Repository</h1>
          <p className="text-zinc-500 text-sm mb-6">Paste any public GitHub repository URL to get started</p>

          <form onSubmit={handleAnalyze} className="flex gap-2">
            <div className="flex-1 relative">
              <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                disabled={analyzing}
              />
            </div>
            <button
              type="submit"
              disabled={analyzing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {analyzing ? <Loader size={13} className="animate-spin" /> : <ArrowRight size={13} />}
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        <div className="fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-widest">History</h2>
          </div>

          <div className="relative mb-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search repositories..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="animate-spin text-zinc-700" size={22} />
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
              <Github size={28} className="mx-auto text-zinc-800 mb-3" />
              <p className="text-zinc-600 text-sm">No analyses yet. Paste a repo URL above to start.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map((analysis) => (
                <div
                  key={analysis._id}
                  onClick={() => navigate(`/analysis/${analysis._id}`)}
                  className="group p-4 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Github size={13} className="text-zinc-600 flex-shrink-0" />
                        <h3 className="font-medium text-zinc-100 truncate text-sm">
                          {analysis.owner}/{analysis.repoName}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-500 mb-3 line-clamp-1 pl-5">{analysis.summary}</p>
                      <div className="flex flex-wrap gap-1.5 pl-5">
                        {analysis.techStack?.slice(0, 5).map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700/50 text-zinc-400 rounded-md text-xs">
                            {tech}
                          </span>
                        ))}
                        {analysis.techStack?.length > 5 && (
                          <span className="px-2 py-0.5 text-zinc-600 text-xs">+{analysis.techStack.length - 5} more</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
                      <div className="flex items-center gap-1 text-xs text-zinc-700">
                        <Clock size={10} />
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                      <ArrowRight size={13} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
