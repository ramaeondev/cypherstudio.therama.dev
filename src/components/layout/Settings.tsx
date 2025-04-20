
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, isDarkMode, toggleDarkMode }) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(
    localStorage.getItem('analytics-enabled') === 'true'
  );
  const [localStorageEnabled, setLocalStorageEnabled] = useState<boolean>(
    localStorage.getItem('storage-enabled') !== 'false'
  );
  const [clipboardAccess, setClipboardAccess] = useState<boolean>(
    localStorage.getItem('clipboard-access') !== 'false'
  );
  const { toast } = useToast();

  const handleAnalyticsToggle = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    localStorage.setItem('analytics-enabled', String(enabled));
    
    // Initialize or remove Google Analytics based on user preference
    if (enabled) {
      // This would normally initialize GA, here we're just simulating
      window.gtag = window.gtag || function(){};
      toast({
        title: "Analytics Enabled",
        description: "Usage data will help us improve the application"
      });
    } else {
      // This would normally disable GA tracking
      toast({
        title: "Analytics Disabled",
        description: "We respect your privacy preference"
      });
    }
  };

  const handleStorageToggle = (enabled: boolean) => {
    setLocalStorageEnabled(enabled);
    localStorage.setItem('storage-enabled', String(enabled));
    
    if (!enabled) {
      // Clear stored data except settings
      const settingsKeys = ['dark-mode', 'analytics-enabled', 'storage-enabled', 'clipboard-access'];
      Object.keys(localStorage).forEach(key => {
        if (!settingsKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      toast({
        title: "Local Storage Cleared",
        description: "Your saved data has been removed from this device"
      });
    } else {
      toast({
        title: "Local Storage Enabled",
        description: "Your preferences will be saved between sessions"
      });
    }
  };

  const handleClipboardToggle = (enabled: boolean) => {
    setClipboardAccess(enabled);
    localStorage.setItem('clipboard-access', String(enabled));
    
    toast({
      title: enabled ? "Clipboard Access Enabled" : "Clipboard Access Disabled",
      description: enabled ? "Copy buttons will work automatically" : "Copy buttons are now disabled"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <Card className="fixed z-50 w-full max-w-md max-h-[85vh] overflow-auto border rounded-lg shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 md:w-full">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Configure your preferences for the application
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Appearance</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Privacy & Data</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Usage Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous usage data collection
                </p>
              </div>
              <Switch 
                id="analytics" 
                checked={analyticsEnabled}
                onCheckedChange={handleAnalyticsToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="storage">Local Storage</Label>
                <p className="text-sm text-muted-foreground">
                  Save your preferences between sessions
                </p>
              </div>
              <Switch 
                id="storage" 
                checked={localStorageEnabled}
                onCheckedChange={handleStorageToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="clipboard">Clipboard Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow copy to clipboard functionality
                </p>
              </div>
              <Switch 
                id="clipboard" 
                checked={clipboardAccess}
                onCheckedChange={handleClipboardToggle}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">About</h3>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                <span className="font-semibold">Cypher Studio</span> - Version 1.0.0
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                A cryptographic toolkit for developers. All processing happens locally in your browser.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
