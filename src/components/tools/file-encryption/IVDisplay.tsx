
import React from 'react';
import { Key, AlertCircle } from 'lucide-react';

interface IVDisplayProps {
  iv: string;
  metadata?: string;
}

const IVDisplay: React.FC<IVDisplayProps> = ({ iv, metadata }) => {
  if (!iv) return null;
  
  return (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-md">
      <h3 className="text-sm font-medium flex items-center gap-2 text-yellow-400">
        <Key className="h-4 w-4" />
        Save this encryption information
      </h3>
      <p className="text-xs mt-1 text-yellow-200">
        You'll need this information to decrypt your file later. Store it securely along with your password.
      </p>
      
      <div className="mt-2 space-y-2">
        <div>
          <span className="text-xs font-semibold text-yellow-300">Initialization Vector (IV):</span>
          <code className="block p-2 bg-card text-xs rounded overflow-x-auto font-mono">
            {iv}
          </code>
        </div>
        
        {metadata && (
          <div>
            <span className="text-xs font-semibold text-yellow-300">File Metadata:</span>
            <code className="block p-2 bg-card text-xs rounded overflow-x-auto font-mono">
              {metadata}
            </code>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-start gap-2 text-xs text-yellow-200">
        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
        <p>
          Both the IV and metadata are required to properly decrypt your file and restore its original format.
        </p>
      </div>
    </div>
  );
};

export default IVDisplay;
