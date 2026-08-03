import React from 'react';
import {
  Sparkles,
  Layers,
  Code,
  FileCheck2,
  CheckCircle,
  Lightbulb,
  Cpu,
  BarChart3,
  ListOrdered
} from 'lucide-react';
import { ProjectAnalysis } from '../types';

interface ProjectOverviewProps {
  analysis: ProjectAnalysis | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  filesCount: number;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  analysis,
  isAnalyzing,
  onAnalyze,
  filesCount
}) => {
  if (isAnalyzing) {
    return (
      <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-12 text-center shadow-sm">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-gray-100 mb-1">Analyzing Project Structure with Gemini 2.5</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Parsing code files, configurations, tech stack dependencies, and architecture patterns from Google Drive...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-8 text-center shadow-sm flex flex-col items-center justify-center">
        <Cpu className="w-10 h-10 text-blue-400 mb-3" />
        <h3 className="text-sm font-semibold text-gray-200 mb-1">Analyze Project with AI</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
          جهت تحلیل کامل هوشمند معماری، تک‌استک و ساختار فایل‌های این پروژه در گوگل درایو، روی دکمه زیر کلیک کنید.
        </p>
        <button
          onClick={onAnalyze}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-md shadow-md transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          Analyze Project with AI (تحلیل پروژه)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Project Summary */}
      <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Project Architecture Overview</span>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed font-normal mb-4">
          {analysis.summary}
        </p>

        {/* Tech Stack Badges */}
        <div>
          <span className="text-xs font-medium text-gray-400 block mb-2">Detected Tech Stack & Libraries:</span>
          <div className="flex flex-wrap gap-2">
            {analysis.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#141414] border border-[#262626] text-blue-400 font-mono text-xs rounded-md font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Architecture & File Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Architecture Breakdown */}
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#262626] pb-3">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">System Architecture & Design</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {analysis.architectureOverview}
          </p>
        </div>

        {/* File Composition Bar Chart / Breakdown */}
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#262626] pb-3">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">File Composition & Breakdown</h3>
          </div>

          <div className="space-y-3">
            {analysis.fileDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300">{item.type}</span>
                  <span className="text-gray-500">{item.count} files ({item.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-[#262626]">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Key Files Summary Table */}
      <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-[#262626] pb-3">
          <ListOrdered className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Core Modules & Key Files</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.keyFiles.map((kf, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#141414] border border-[#262626] rounded-md space-y-1"
            >
              <span className="font-mono text-xs font-bold text-blue-400 block truncate">
                {kf.name}
              </span>
              <p className="text-xs text-gray-400 leading-snug">{kf.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Code Quality Notes & Insights */}
      {analysis.codeQualityNotes && analysis.codeQualityNotes.length > 0 && (
        <div className="bg-[#0E0E0E] border border-[#262626] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#262626] pb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Architecture Insights & Recommendations</h3>
          </div>

          <ul className="space-y-2">
            {analysis.codeQualityNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
