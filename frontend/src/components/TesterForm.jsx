import React, { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { testApi } from '../utils/api';

const TesterForm = ({ onResult }) => {
    const [endpoint, setEndpoint] = useState('http://localhost:8000/api/voice-detect');
    const [apiKey, setApiKey] = useState('guvi-demo-key-123');
    const [audioUrl, setAudioUrl] = useState('');
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        onResult(null); // Clear previous result

        try {
            if (!endpoint || !apiKey || !audioUrl) {
                throw new Error('All fields are required');
            }

            const result = await testApi(endpoint, apiKey, audioUrl, language);
            onResult(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">1</span>
                Configure Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-400">API Endpoint URL</label>
                    <input
                        type="url"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        placeholder="http://localhost:8000/api/voice-detect"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-200 placeholder-slate-600"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-400">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-200"
                        >
                            <option value="en">English (en)</option>
                            <option value="ta">Tamil (ta)</option>
                            <option value="hi">Hindi (hi)</option>
                            <option value="ml">Malayalam (ml)</option>
                            <option value="te">Telugu (te)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-400">API Key</label>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-200 placeholder-slate-600 font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-400">Audio File URL (MP3/WAV)</label>
                    <input
                        type="url"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        placeholder="https://example.com/sample.mp3"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-200 placeholder-slate-600"
                    />
                    <p className="text-xs text-slate-500">The tester will fetch this audio and convert it to Base64.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Testing Endpoint...
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            Test Endpoint
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TesterForm;
