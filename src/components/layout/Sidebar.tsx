
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  FileText, 
  Code, 
  Hash, 
  RefreshCw, 
  FileKey,
  Keyboard,
  FileArchive,
  Settings,
  Link
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  openSettings: () => void;
}

type ToolCategory = {
  name: string;
  tools: {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
  }[];
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTool, setActiveTool, openSettings }) => {
  const toolCategories: ToolCategory[] = [
    {
      name: "Encryption & Decryption",
      tools: [
        { 
          id: "aes", 
          name: "AES", 
          icon: <Lock className="h-4 w-4" />, 
          description: "Advanced Encryption Standard" 
        },
        { 
          id: "rsa", 
          name: "RSA", 
          icon: <KeyRound className="h-4 w-4" />, 
          description: "RSA Public Key Cryptography" 
        },
      ]
    },
    {
      name: "Encoding & Decoding",
      tools: [
        { 
          id: "base64", 
          name: "Base64", 
          icon: <FileText className="h-4 w-4" />, 
          description: "Base64 Encoding/Decoding" 
        },
        { 
          id: "url", 
          name: "URL", 
          icon: <Link className="h-4 w-4" />, 
          description: "URL Encoding/Decoding" 
        },
      ]
    },
    {
      name: "Hashing",
      tools: [
        { 
          id: "sha", 
          name: "SHA", 
          icon: <Hash className="h-4 w-4" />, 
          description: "Secure Hash Algorithms" 
        },
        { 
          id: "md5", 
          name: "MD5", 
          icon: <RefreshCw className="h-4 w-4" />, 
          description: "MD5 Message Digest" 
        },
      ]
    }
  ];

  const handleToolSelect = (toolId: string) => {
    setActiveTool(toolId);
    
    // Track tool selection for analytics
    if (window.gtag) {
      window.gtag('event', 'tool_selected', {
        'tool_name': toolId
      });
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out md:sticky md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-center mb-6 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold neon-glow">Cyber</span>
            <span className="text-xl font-bold accent-glow">Studio</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {toolCategories.map((category) => (
            <div key={category.name} className="mb-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {category.name}
              </h3>
              <div className="space-y-1">
                {category.tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left ${
                      activeTool === tool.id ? "" : "hover:bg-secondary/50"
                    }`}
                    onClick={() => handleToolSelect(tool.id)}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={openSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
