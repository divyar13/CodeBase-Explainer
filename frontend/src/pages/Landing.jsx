import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Code2, Github, Zap, FolderOpen } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();

  React.useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Code2 size={20} className="text-indigo-400" />
          <span className="font-semibold tracking-tight">CodeBase Explainer</span>
        </div>
        <a
          href="http://localhost:5000/auth/google"
          className="px-4 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
        >
          Sign in
        </a>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-4 text-center">
       
         

        <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-b from-zinc-50 to-zinc-500 bg-clip-text text-transparent leading-tight tracking-tight">
          Understand Any<br />Codebase Instantly
        </h1>

        <p className="text-zinc-400 text-lg max-w-lg mb-10 leading-relaxed">
          Paste a GitHub URL and get an AI-powered breakdown — structure, tech stack, and how to get started.
        </p>

        <a
          href="http://localhost:5000/auth/google"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors mb-20 text-sm"
        >
          Get started free →
        </a>

        <div className="grid md:grid-cols-3 gap-3 max-w-2xl w-full fade-in">
          {[
            { icon: Github, title: 'Any Public Repo', desc: 'Paste any GitHub repository URL' },
            { icon: Zap, title: 'AI-Powered', desc: 'Instant insights via Gemini' },
            { icon: FolderOpen, title: 'Browse Files', desc: 'Explore and explain any file' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-left">
              <Icon size={18} className="text-indigo-400 mb-3" />
              <h3 className="font-medium text-zinc-200 mb-1 text-sm">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
