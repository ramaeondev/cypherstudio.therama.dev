
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToolPanel from './ToolPanel';
import { Lock, Unlock } from 'lucide-react';
import FileEncryptionDocumentation from './file-encryption/FileEncryptionDocumentation';
import EncryptionForm from './file-encryption/EncryptionForm';
import DecryptionForm from './file-encryption/DecryptionForm';
import IVDisplay from './file-encryption/IVDisplay';

const FileEncryptionTool: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [iv, setIv] = useState('');

  const handleIvGenerated = (generatedIv: string) => {
    setIv(generatedIv);
  };

  const documentation = <FileEncryptionDocumentation />;

  return (
    <ToolPanel 
      title="File Encryption & Decryption" 
      description="Securely encrypt and decrypt files using AES encryption"
      documentation={documentation}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'encrypt' | 'decrypt')} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="encrypt" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              Decrypt
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="encrypt">
            <EncryptionForm onIvGenerated={handleIvGenerated} />
          </TabsContent>
          
          <TabsContent value="decrypt">
            <DecryptionForm iv={iv} setIv={setIv} />
          </TabsContent>
        </Tabs>
        
        {mode === 'encrypt' && <IVDisplay iv={iv} />}
      </div>
    </ToolPanel>
  );
};

export default FileEncryptionTool;
