import React, { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { testApi } from '../utils/api';

const TesterForm = ({ onResult }) => {
    const [endpoint, setEndpoint] = useState('http://localhost:8000/api/voice-detect');
    const [apiKey, setApiKey] = useState('guvi-demo-key-123');
    const [audioUrl, setAudioUrl] = useState('');
    const [file, setFile] = useState(null);
    const [inputType, setInputType] = useState('url'); // 'url' or 'file'
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        onResult(null); // Clear previous result

        try {
            if (!endpoint || !apiKey) {
                throw new Error('Endpoint and API Key are required');
            }
            if (inputType === 'url' && !audioUrl) throw new Error('Audio URL is required');
            if (inputType === 'file' && !file) throw new Error('Please select a file');

            const source = inputType === 'file' ? file : audioUrl;
            const result = await testApi(endpoint, apiKey, source, language);
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

                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-400">Audio Source</label>

                    <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => setInputType('url')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${inputType === 'url' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Enter URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setInputType('file')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition ${inputType === 'file' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Upload File
                        </button>
                    </div>

                    {inputType === 'url' ? (
                        <div className="space-y-1">
                            <input
                                type="url"
                                value={audioUrl}
                                onChange={(e) => setAudioUrl(e.target.value)}
                                placeholder="https://example.com/sample.mp3"
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-200 placeholder-slate-600"
                            />
                            <p className="text-xs text-slate-500">The tester will fetch this audio and convert it to Base64.</p>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-colors bg-slate-900/30 text-center">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                </div>
                                <span className="text-sm font-medium text-slate-300">
                                    {file ? file.name : "Click to upload audio file"}
                                </span>
                                <span className="text-xs text-slate-500">MP3 or WAV files supported</span>
                            </label>
                        </div>
                    )}
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
