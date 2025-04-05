
import React from 'react';
import { Key } from 'lucide-react';

interface IVDisplayProps {
  iv: string;
}

const IVDisplay: React.FC<IVDisplayProps> = ({ iv }) => {
  if (!iv) return null;
  
  return (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-md">
      <h3 className="text-sm font-medium flex items-center gap-2 text-yellow-400">
        <Key className="h-4 w-4" />
        Save this Initialization Vector (IV)
      </h3>
      <p className="text-xs mt-1 text-yellow-200">
        You'll need this IV to decrypt your file later. Store it securely along with your password.
      </p>
      <code className="block mt-2 p-2 bg-card text-xs rounded overflow-x-auto font-mono">
        {iv}
      </code>
    </div>
  );
};

export default IVDisplay;
