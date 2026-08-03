import React, { useState } from 'react';
import {
  GitFork,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Settings,
  CheckCircle2,
  Share2,
  Award,
  Network
} from 'lucide-react';
import { useEnterprise } from '../context/EnterpriseContext';
import { ReferralNode, ReferralCommissionLevel } from '../types';

export const ReferralTreeGraph: React.FC = () => {
  const { referralTree, referralLevels, updateReferralLevels, t } = useEnterprise();
  
  const [levelInputs, setLevelInputs] = useState<ReferralCommissionLevel[]>(referralLevels);
  const [expandedNodes, setExpandedNodes] = useState<{ [id: string]: boolean }>({ 'node-root': true, 'node-1': true });

  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleSaveLevels = (e: React.FormEvent) => {
    e.preventDefault();
    updateReferralLevels(levelInputs);
    alert('درصدهای پورسانت شبکه زیرمجموعه‌گیری با موفقیت ذخیره شدند.');
  };

  const handleAddLevel = () => {
    const nextLvl = levelInputs.length + 1;
    setLevelInputs((prev) => [...prev, { levelNumber: nextLvl, commissionPercentage: 1 }]);
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: ReferralNode) => {
    const isExpanded = expandedNodes[node.id] ?? false;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-2">
        
        {/* Node Card Box */}
        <div className="bg-[#181818] border border-[#2c2c2c] hover:border-blue-500/50 rounded-xl p-4 transition-all shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {hasChildren && (
                <button
                  onClick={() => toggleNodeExpand(node.id)}
                  className="p-1 bg-[#222] hover:bg-[#333] text-gray-300 rounded border border-[#333]"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 dir-rtl:rotate-180" />}
                </button>
              )}
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                L{node.level}
              </div>
              <div>
                <span className="font-bold text-white text-xs block">{node.userName}</span>
                <span className="text-[10px] text-gray-400 font-mono">{node.userEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="bg-[#222] text-gray-300 px-2.5 py-1 rounded border border-[#333] font-mono">
                مستقیم: {node.directCount} نفر
              </span>
              <span className="bg-blue-950/50 text-blue-300 px-2.5 py-1 rounded border border-blue-800/40 font-mono">
                کل شبکه: {node.totalNetworkCount} نفر
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#262626] text-[11px] text-gray-400">
            <div>
              خرید شخصی: <b className="text-emerald-400 font-mono">{node.personalVolumeToman.toLocaleString()} تومان</b>
            </div>
            <div>
              حجم کل فروش شبکه: <b className="text-amber-300 font-mono">{node.networkVolumeToman.toLocaleString()} تومان</b>
            </div>
          </div>
        </div>

        {/* Child Subtree Recursive Render */}
        {hasChildren && isExpanded && (
          <div className="pr-6 border-r-2 border-blue-500/30 space-y-2 pt-1">
            {node.children!.map((child) => renderTreeNode(child))}
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>سیستم بازاریابی شبکه‌ای و پورسانت چندسطحی (Referral Network)</span>
            </h2>
            <p className="text-xs text-gray-400">
              ارتباط والد و فرزندی نامحدود کاربران، محاسبه خودکار پورسانت و واریز مستقیم به کیف پول نقدی
            </p>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#333] px-4 py-2.5 rounded-lg flex items-center gap-3 text-xs font-mono">
          <span className="text-gray-400">کد دعوت اختصاصی شما:</span>
          <span className="text-amber-300 font-bold bg-[#101010] px-2.5 py-1 rounded border border-[#333]">
            REF-USR1001
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Tree Graph UI */}
        <div className="lg:col-span-7 bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-400" />
              <span>نمودار درختی شبکه زیرمجموعه‌ها (Tree Graph)</span>
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              تعداد سطوح فعال: {referralLevels.length} سطح
            </span>
          </div>

          <div className="space-y-4">
            {renderTreeNode(referralTree)}
          </div>
        </div>

        {/* Right Column: Dynamic Commission Levels Config */}
        <div className="lg:col-span-5 bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>تنظیمات سطوح پورسانت (Admin Rules)</span>
            </h3>
            <button
              type="button"
              onClick={handleAddLevel}
              className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-gray-200 text-[11px] rounded border border-[#333]"
            >
              + افزودن سطح جدید
            </button>
          </div>

          <form onSubmit={handleSaveLevels} className="space-y-3">
            {levelInputs.map((lvl, index) => (
              <div key={lvl.levelNumber} className="flex items-center justify-between bg-[#181818] p-3 rounded-lg border border-[#2a2a2a]">
                <span className="font-semibold text-gray-200">سطح {lvl.levelNumber} (Level {lvl.levelNumber}):</span>
                <div className="flex items-center dir-ltr">
                  <input
                    type="number"
                    value={lvl.commissionPercentage}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setLevelInputs((prev) =>
                        prev.map((item) => (item.levelNumber === lvl.levelNumber ? { ...item, commissionPercentage: val } : item))
                      );
                    }}
                    className="w-20 bg-[#101010] border border-[#333] p-1.5 text-white font-mono rounded-l text-center font-bold"
                  />
                  <span className="bg-[#222] border border-l-0 border-[#333] px-2.5 py-1.5 text-gray-400 rounded-r font-bold">%</span>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>بروزرسانی جدول درصدهای شبکه</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
