
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Settings from '@/components/layout/Settings';
import AESTool from '@/components/tools/AESTool';
import Base64Tool from '@/components/tools/Base64Tool';
import HashingTool from '@/components/tools/HashingTool';
import RSATool from '@/components/tools/RSATool';
import URLTool from '@/components/tools/URLTool';
import MD5Tool from '@/components/tools/MD5Tool';
import FileEncryptionTool from '@/components/tools/FileEncryptionTool';

const Index: React.FC = () => {
  const [activeTool, setActiveTool] = useState('aes');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Set sidebar open by default on desktop
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('dark-mode', String(!isDarkMode));
    
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
  
  // Toggle settings panel
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Set dark mode from localStorage or default
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('dark-mode');
    if (storedDarkMode !== null) {
      const isDark = storedDarkMode === 'true';
      setIsDarkMode(isDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Initialize analytics if enabled
  useEffect(() => {
    if (localStorage.getItem('analytics-enabled') === 'true') {
      // This is a placeholder for actual analytics initialization
      // In a real app, you'd set up Google Analytics or similar
      window.gtag = function(...args) {
        console.log('Analytics:', ...args);
      };
      
      // Track page view
      window.gtag('event', 'page_view', {
        page_title: 'Cypher Studio',
        page_location: window.location.href,
      });
    }
  }, []);

  // Render the active tool
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'aes':
        return <AESTool />;
      case 'rsa':
        return <RSATool />;
      case 'base64':
        return <Base64Tool />;
      case 'url':
        return <URLTool />;
      case 'sha':
        return <HashingTool />;
      case 'md5':
        return <MD5Tool />;
      case 'fileEncryption':
        return <FileEncryptionTool />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Cypher Studio</h2>
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
          openSettings={toggleSettings}
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 cybergrid">
          <div className="w-full max-w-5xl mx-auto">
            {renderActiveTool()}
          </div>
        </main>
      </div>
      
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={toggleSettings}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  );
};

export default Index;
