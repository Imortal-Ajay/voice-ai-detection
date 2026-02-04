import React, { useState } from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import TesterForm from './components/TesterForm';
import ResponseViewer from './components/ResponseViewer';

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 selection:bg-blue-500/30">

      {/* Navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Endpoint Tester
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck size={14} />
              AI Voice Detection
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Zap size={14} />
              Latency Check
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Validate Your API
          </h1>
          <p className="text-slate-400 text-lg">
            Test your AI-Generated Voice Detection endpoint before final evaluation.
            Ensure your API handles authentication, audio processing, and response formatting correctly.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <TesterForm onResult={setResult} />
          {result ? (
            <ResponseViewer result={result} />
          ) : (
            <div className="hidden lg:flex h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl items-center justify-center text-slate-600 bg-slate-900/30">
              <div className="text-center">
                <Activity size={48} className="mx-auto mb-4 opacity-20" />
                <p>Run a test to see results here</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-20 py-8 text-center text-slate-600 text-sm">
        <p>© 2026 Endpoint Validation Tool. Built for AI Voice Detection Challenge.</p>
      </footer>
    </div>
  );
}

export default App;
