import React from 'react';
import { CheckCircle2, XCircle, Clock, Code2 } from 'lucide-react';
import clsx from 'clsx';

const ResponseViewer = ({ result }) => {
    if (!result) return null;

    const isSuccess = result.success;
    const { prediction, confidence, explanation } = result.data || {};

    const getConfidenceColor = (conf) => {
        if (conf >= 0.8) return "bg-red-500";
        if (conf >= 0.5) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">2</span>
                Test Results
            </h2>

            <div className="flex-1 space-y-6">
                {/* Status Card */}
                <div className={clsx(
                    "p-4 rounded-xl border flex items-center justify-between",
                    isSuccess
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-red-500/10 border-red-500/20"
                )}>
                    <div className="flex items-center gap-3">
                        {isSuccess ? (
                            <CheckCircle2 className="text-emerald-400" size={24} />
                        ) : (
                            <XCircle className="text-red-400" size={24} />
                        )}
                        <div>
                            <p className={clsx("font-semibold", isSuccess ? "text-emerald-400" : "text-red-400")}>
                                {isSuccess ? "Request Successful" : "Request Failed"}
                            </p>
                            <p className="text-slate-400 text-sm">Status Code: {result.status}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        <Clock size={14} />
                        <span className="text-sm font-mono">{result.latency}ms</span>
                    </div>
                </div>

                {/* Analysis Result */}
                {isSuccess && prediction && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Prediction</span>
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-bold border",
                                prediction === "AI_GENERATED"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-green-500/10 text-green-400 border-green-500/20"
                            )}>
                                {prediction}
                            </span>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Confidence</span>
                                <span className="text-slate-200 font-mono">{(confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={clsx("h-full transition-all duration-500", getConfidenceColor(confidence))}
                                    style={{ width: `${confidence * 100}%` }}
                                />
                            </div>
                        </div>

                        {explanation && (
                            <div className="pt-2 border-t border-slate-800/50">
                                <span className="text-slate-400 text-sm block mb-1">Explanation</span>
                                <p className="text-slate-300 text-sm leading-relaxed">{explanation}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* JSON Response */}
                <div className="space-y-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Code2 size={16} /> JSON Response
                        </label>
                        <span className="text-xs text-slate-600 bg-slate-900 px-2 py-1 rounded">application/json</span>
                    </div>
                    <div className="relative flex-1 group">
                        <pre className="w-full h-full min-h-[200px] p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm font-mono text-slate-300 overflow-auto custom-scrollbar">
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                        <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition px-2 py-1 bg-slate-800 text-xs rounded border border-slate-700 hover:bg-slate-700 text-slate-300"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponseViewer;
