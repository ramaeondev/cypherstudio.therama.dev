
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AESTool from '@/components/tools/AESTool';
import Base64Tool from '@/components/tools/Base64Tool';
import HashingTool from '@/components/tools/HashingTool';

const Index: React.FC = () => {
  const [activeTool, setActiveTool] = useState('aes');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Set sidebar open by default on desktop
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Render the active tool
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'aes':
        return <AESTool />;
      case 'base64':
        return <Base64Tool />;
      case 'sha':
      case 'md5':
        return <HashingTool />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Cyber Studio</h2>
            <p className="text-center mb-6">
              Select a tool from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : 'light'}`}>
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 cybergrid">
          <div className="w-full max-w-5xl mx-auto">
            {renderActiveTool()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
