
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, toggleSidebar }) => {
  return (
    <header className="border-b border-border bg-card p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold neon-glow">Cyber</span>
          <span className="text-xl font-bold accent-glow">Studio</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
