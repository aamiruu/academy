import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Code2,
  Sparkles,
  Bot,
  ListTodo,
  AlertTriangle,
  HardDrive,
  RefreshCw,
  Radio,
  Globe,
  Wallet,
  PieChart,
  GitFork,
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  Coins
} from 'lucide-react';
import { Header } from './components/Header';
import { FolderInput } from './components/FolderInput';
import { FileTree } from './components/FileTree';
import { FileViewer } from './components/FileViewer';
import { ProjectOverview } from './components/ProjectOverview';
import { ProjectChat } from './components/ProjectChat';
import { FeaturePlanner } from './components/FeaturePlanner';
import { DriveFile, ProjectAnalysis, UserAuth, ChatMessage, FeatureTask } from './types';

// Phase 2 Enterprise Module Components
import { EnterpriseProvider, useEnterprise } from './context/EnterpriseContext';
import { LiveClassTranslator } from './components/LiveClassTranslator';
import { TeacherWhiteLabelPortal } from './components/TeacherWhiteLabelPortal';
import { WalletAndPackages } from './components/WalletAndPackages';
import { SharePoolDashboard } from './components/SharePoolDashboard';
import { ReferralTreeGraph } from './components/ReferralTreeGraph';
import { UserEnterpriseDashboard } from './components/UserEnterpriseDashboard';
import { GoftinoChatWidget } from './components/GoftinoChatWidget';
import { AdminEnterpriseConsole } from './components/AdminEnterpriseConsole';

const DEFAULT_FOLDER_ID = '1Lmpdb-9-Z7xLjRF84hNxDsJxd0jOFYUh';

function EnterpriseAppContent() {
  const { t, userRole, dir } = useEnterprise();

  const [auth, setAuth] = useState<UserAuth>({ isAuthenticated: false });
  const [folderId, setFolderId] = useState<string>(DEFAULT_FOLDER_ID);
  const [rootName, setRootName] = useState<string>('Google Drive Project');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Expanded Active Tab for Phase 1 + Phase 2
  const [activeTab, setActiveTab] = useState<
    | 'explorer'
    | 'analysis'
    | 'assistant'
    | 'liveClass'
    | 'teacherWhiteLabel'
    | 'walletAndPackages'
    | 'sharePool'
    | 'referralTree'
    | 'userDashboard'
    | 'goftinoChat'
    | 'adminPanel'
  >('userDashboard');

  // AI Analysis state
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Feature planner tasks state
  const [tasks, setTasks] = useState<FeatureTask[]>([
    {
      id: '1',
      title: 'اتصال کامل لینک پروژه گوگل درایو',
      description: 'خواندن کامل تمام فایل‌ها و زیرپوشه‌ها از گوگل درایو کاربر',
      status: 'completed',
      priority: 'High',
      suggestedFiles: ['server.ts', 'src/App.tsx'],
      createdAt: new Date().toLocaleDateString()
    },
    {
      id: '2',
      title: 'پیاده‌سازی کامل ۱۰ ماژول فاز دوم Enterprise',
      description: 'سیستم چندزبانه، کلاس آنلاین AI، وایتبل اساتید، کیف پول دوتایی، استخر سود، پکیج‌ها، شبکه ارجاع، داشبورد و گفتینو',
      status: 'completed',
      priority: 'High',
      suggestedFiles: ['src/context/EnterpriseContext.tsx', 'src/components/*'],
      createdAt: new Date().toLocaleDateString()
    }
  ]);

  // Handle OAuth Popup Messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const { data } = event.data;
        setAuth({
          isAuthenticated: true,
          userEmail: data.userEmail,
          userName: data.userName,
          userPicture: data.userPicture,
          accessToken: data.accessToken
        });
        setErrorMessage(null);
        fetchDriveFiles(folderId, data.accessToken);
      } else if (event.data?.type === 'OAUTH_ERROR') {
        setErrorMessage(`OAuth Authentication Failed: ${event.data.error}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [folderId]);

  // Fetch Drive Files
  const fetchDriveFiles = async (targetFolderId: string = folderId, token?: string) => {
    setIsLoadingFiles(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/drive/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: targetFolderId,
          accessToken: token || auth.accessToken,
          recursive: true
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load files from Google Drive');
      }

      setFolderId(data.folderId);
      setRootName(data.rootName || 'Project Folder');
      setFiles(data.files || []);

      if (data.notice && !auth.isAuthenticated) {
        setErrorMessage(data.notice);
      }

      // Auto select first code/text file
      if (data.files && data.files.length > 0) {
        const firstFile = findFirstFile(data.files);
        if (firstFile) {
          handleSelectFile(firstFile, token || auth.accessToken);
        }
      }
    } catch (err: any) {
      console.error('Fetch Drive Files error:', err);
      setErrorMessage(err.message || 'Error connecting to Google Drive');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Helper to find first non-folder file
  const findFirstFile = (itemList: DriveFile[]): DriveFile | null => {
    for (const item of itemList) {
      if (!item.isFolder) return item;
      if (item.children) {
        const child = findFirstFile(item.children);
        if (child) return child;
      }
    }
    return null;
  };

  // Select and fetch single file content
  const handleSelectFile = async (file: DriveFile, token?: string) => {
    setSelectedFile(file);
    if (file.isFolder) return;

    setIsLoadingContent(true);
    setFileContent(null);

    try {
      const res = await fetch('/api/drive/file-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: file.id,
          mimeType: file.mimeType,
          accessToken: token || auth.accessToken
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFileContent(data.content || '');
      } else {
        setFileContent(`// Error fetching file content: ${data.error}`);
      }
    } catch (err: any) {
      setFileContent(`// Error loading file: ${err.message}`);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Load initial files on mount
  useEffect(() => {
    fetchDriveFiles(DEFAULT_FOLDER_ID);
  }, []);

  // Initiate Google OAuth Login Flow
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();
      if (data.url) {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        window.open(data.url, 'Google OAuth', `width=${width},height=${height},left=${left},top=${top}`);
      }
    } catch (err: any) {
      setErrorMessage('Could not initialize Google OAuth process.');
    }
  };

  // Trigger Gemini Project Analysis
  const handleAnalyzeProject = async () => {
    setIsAnalyzing(true);
    try {
      const sampleFiles = selectedFile && fileContent ? [{ name: selectedFile.name, content: fileContent.slice(0, 3000) }] : [];

      const res = await fetch('/api/drive/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTree: files,
          fileContents: sampleFiles
        })
      });

      const data = await res.json();
      if (res.ok && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to analyze project');
      }
    } catch (err: any) {
      setErrorMessage(`Analysis Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Send message to Gemini Assistant
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsSendingChat(true);

    try {
      const context = selectedFile && fileContent ? [{ name: selectedFile.name, content: fileContent.slice(0, 4000) }] : [];

      const res = await fetch('/api/drive/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          projectSummary: analysis?.summary || rootName,
          fileContext: context,
          chatHistory: chatMessages
        })
      });

      const data = await res.json();

      if (res.ok && data.responseText) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'No response from AI assistant');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `خطا در دریافت پاسخ: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleAddTask = (taskData: Omit<FeatureTask, 'id' | 'createdAt'>) => {
    const newTask: FeatureTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString()
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (id: string, status: FeatureTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans antialiased" dir={dir}>
      
      {/* Top Header */}
      <Header
        auth={auth}
        onLoginClick={handleLogin}
        onRefresh={() => fetchDriveFiles(folderId)}
        onAnalyzeClick={() => {
          setActiveTab('analysis');
          if (!analysis && !isAnalyzing) handleAnalyzeProject();
        }}
        isLoading={isLoadingFiles}
        folderName={rootName}
        filesCount={files.length}
      />

      {/* Target Drive Folder Search Bar */}
      <FolderInput
        onLoadFolder={(urlOrId) => fetchDriveFiles(urlOrId)}
        isLoading={isLoadingFiles}
        currentFolderId={folderId}
      />

      {/* Primary Navigation Bar (Phase 1 + Phase 2 Modules) */}
      <div className="bg-[#0E0E0E] border-b border-[#262626] px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max gap-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs font-semibold">
            
            {/* Phase 2: User Dashboard */}
            <button
              onClick={() => setActiveTab('userDashboard')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'userDashboard'
                  ? 'bg-blue-600 text-white shadow font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-300" />
              <span>{t('userDashboard')}</span>
            </button>

            {/* Phase 2: Wallet & Share Packages */}
            <button
              onClick={() => setActiveTab('walletAndPackages')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'walletAndPackages'
                  ? 'bg-blue-600 text-white shadow font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-blue-300" />
              <span>{t('walletAndPackages')}</span>
            </button>

            {/* Phase 2: Share Pool */}
            <button
              onClick={() => setActiveTab('sharePool')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'sharePool'
                  ? 'bg-amber-600 text-white shadow font-bold'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-[#141414]'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>{t('sharePool')}</span>
            </button>

            {/* Phase 2: Referral Tree */}
            <button
              onClick={() => setActiveTab('referralTree')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'referralTree'
                  ? 'bg-blue-600 text-white shadow font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('referralTree')}</span>
            </button>

            {/* Phase 2: Live Class Subtitles */}
            <button
              onClick={() => setActiveTab('liveClass')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'liveClass'
                  ? 'bg-blue-600 text-white shadow font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{t('liveClass')}</span>
            </button>

            {/* Phase 2: Teacher White Label */}
            <button
              onClick={() => setActiveTab('teacherWhiteLabel')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'teacherWhiteLabel'
                  ? 'bg-blue-600 text-white shadow font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('teacherWhiteLabel')}</span>
            </button>

            {/* Phase 2: Goftino Live Chat */}
            <button
              onClick={() => setActiveTab('goftinoChat')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'goftinoChat'
                  ? 'bg-emerald-600 text-white shadow font-bold'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-[#141414]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('goftinoChat')}</span>
            </button>

            {/* Phase 2: Admin Panel */}
            <button
              onClick={() => setActiveTab('adminPanel')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'adminPanel'
                  ? 'bg-rose-600 text-white shadow font-bold'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-[#141414] border border-rose-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('adminPanel')}</span>
            </button>

            {/* Phase 1: Workspace Files */}
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'explorer'
                  ? 'bg-[#222] text-white border border-[#333]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>فایل‌های پروژه</span>
            </button>

            {/* Phase 1: AI Project Analysis */}
            <button
              onClick={() => {
                setActiveTab('analysis');
                if (!analysis && !isAnalyzing) handleAnalyzeProject();
              }}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-[#222] text-blue-300 border border-[#333] font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#141414]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>تحلیل AI</span>
            </button>

          </div>
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-[#141414] border border-rose-800/80 text-rose-200 text-xs rounded-lg p-3.5 flex items-start justify-between shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Google Drive Notice</span>
                <p>{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* MODULE 8: USER DASHBOARD */}
        {activeTab === 'userDashboard' && <UserEnterpriseDashboard />}

        {/* MODULE 4 & 6: WALLET AND PACKAGES */}
        {activeTab === 'walletAndPackages' && <WalletAndPackages />}

        {/* MODULE 5: SHARE POOL */}
        {activeTab === 'sharePool' && <SharePoolDashboard />}

        {/* MODULE 7: REFERRAL TREE GRAPH */}
        {activeTab === 'referralTree' && <ReferralTreeGraph />}

        {/* MODULE 2: LIVE CLASS REALTIME TRANSLATION */}
        {activeTab === 'liveClass' && <LiveClassTranslator />}

        {/* MODULE 3: TEACHER WHITE LABEL */}
        {activeTab === 'teacherWhiteLabel' && <TeacherWhiteLabelPortal />}

        {/* MODULE 9: GOFTINO CHAT */}
        {activeTab === 'goftinoChat' && <GoftinoChatWidget />}

        {/* MODULE 10: ADMIN PANEL */}
        {activeTab === 'adminPanel' && <AdminEnterpriseConsole />}

        {/* PHASE 1: CODE EXPLORER & FILE READER */}
        {activeTab === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
            <div className="lg:col-span-4 h-full">
              <FileTree
                files={files}
                selectedFileId={selectedFile?.id}
                onSelectFile={(f) => handleSelectFile(f)}
                rootName={rootName}
              />
            </div>
            <div className="lg:col-span-8 h-full">
              <FileViewer
                file={selectedFile}
                fileContent={fileContent}
                isLoadingContent={isLoadingContent}
              />
            </div>
          </div>
        )}

        {/* PHASE 1: AI ARCHITECTURE BREAKDOWN */}
        {activeTab === 'analysis' && (
          <ProjectOverview
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyzeProject}
            filesCount={files.length}
          />
        )}

        {/* PHASE 1: AI ASSISTANT & ROADMAP */}
        {activeTab === 'assistant' && (
          <div className="space-y-8">
            <ProjectChat
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              isSending={isSendingChat}
              selectedFileName={selectedFile?.name}
            />

            <FeaturePlanner
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              suggestedFeatures={analysis?.suggestedFeatures}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0E0E0E] border-t border-[#262626] py-3 px-4 text-center text-xs text-gray-500">
        Enterprise SaaS Platform • Powered by Clean Architecture & Gemini 3.6 AI Engine
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <EnterpriseProvider>
      <EnterpriseAppContent />
    </EnterpriseProvider>
  );
}
