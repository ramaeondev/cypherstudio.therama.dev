
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { FileDropzone } from '@/components/ui/FileDropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { encryptFile, decryptFile, downloadFile } from '@/utils/fileOperations';
import ToolPanel from './ToolPanel';
import { Lock, Unlock, FileText, FileArchive, Key } from 'lucide-react';

const FileEncryptionTool: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [iv, setIv] = useState('');
  const [encryptionMode, setEncryptionMode] = useState('CBC');
  const [originalFileType, setOriginalFileType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFileName, setProcessedFileName] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setOriginalFileType(uploadedFile.type || 'application/octet-stream');
    
    // Generate a processed file name
    const fileName = uploadedFile.name;
    const fileExt = fileName.includes('.') ? fileName.split('.').pop() : '';
    const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    
    if (mode === 'encrypt') {
      setProcessedFileName(`${baseName}.encrypted`);
    } else {
      setProcessedFileName(baseName.endsWith('.encrypted') ? baseName.replace('.encrypted', '') : `${baseName}.decrypted`);
      if (fileExt) {
        setProcessedFileName(prev => `${prev}.${fileExt}`);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to process",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password for encryption/decryption",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'decrypt' && !iv) {
      toast({
        title: "IV required",
        description: "Please enter the initialization vector (IV) used during encryption",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (mode === 'encrypt') {
        const result = await encryptFile(file, password, encryptionMode);
        downloadFile(result.encrypted, processedFileName);
        
        // Show the IV to the user
        toast({
          title: "File encrypted successfully",
          description: "Save this initialization vector (IV) to decrypt the file later: " + result.iv,
        });
        
        setIv(result.iv);
      } else {
        const decrypted = await decryptFile(file, password, iv, encryptionMode, originalFileType);
        downloadFile(decrypted, processedFileName);
        
        toast({
          title: "File decrypted successfully",
          description: "The decrypted file has been downloaded",
        });
      }
      
      // Track file encryption/decryption for analytics
      if (window.gtag) {
        window.gtag('event', 'file_processed', {
          'tool_name': 'file_encryption',
          'action': mode,
          'file_type': file.type || 'unknown'
        });
      }
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const documentation = (
    <div>
      <h2 className="text-xl font-bold mb-4">File Encryption</h2>
      <p className="mb-4">
        Securely encrypt and decrypt files using AES encryption. This tool processes files directly in your browser - 
        no data is sent to any server, ensuring your files remain private.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">How to use</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Select whether you want to encrypt or decrypt a file</li>
        <li>Enter a strong password (remember this password, as you'll need it to decrypt the file)</li>
        <li>Drop your file or click to select it</li>
        <li>For decryption, you'll also need to provide the initialization vector (IV) that was generated during encryption</li>
        <li>Click the Process button to encrypt/decrypt</li>
        <li>The processed file will be automatically downloaded</li>
      </ol>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Security Considerations</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Use a strong, unique password for each file you encrypt</li>
        <li>Store the initialization vector (IV) securely; you'll need it along with the password for decryption</li>
        <li>All processing happens in your browser - no data is uploaded to any server</li>
        <li>CBC mode provides better security than ECB mode</li>
      </ul>
      
      <div className="p-4 border border-yellow-500 rounded-md mt-6">
        <p className="text-yellow-400 text-sm">
          <strong>Note:</strong> This tool uses AES encryption with a key derived from your password. 
          If you lose your password or the IV, your encrypted file cannot be recovered.
        </p>
      </div>
    </div>
  );

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
        </Tabs>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for encryption/decryption"
            />
          </div>
          
          {mode === 'decrypt' && (
            <div className="space-y-2">
              <Label htmlFor="iv">Initialization Vector (IV)</Label>
              <Input 
                id="iv"
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                placeholder="Enter the IV provided during encryption"
              />
              <p className="text-xs text-muted-foreground">
                The IV is a unique value generated during encryption and required for decryption.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="mode">Encryption Mode</Label>
            <Select value={encryptionMode} onValueChange={setEncryptionMode}>
              <SelectTrigger id="mode" className="w-full">
                <SelectValue placeholder="Select encryption mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBC">CBC (Recommended)</SelectItem>
                <SelectItem value="CFB">CFB</SelectItem>
                <SelectItem value="OFB">OFB</SelectItem>
                <SelectItem value="CTR">CTR</SelectItem>
                <SelectItem value="ECB">ECB (Not recommended)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              CBC mode is recommended for most use cases. ECB mode is less secure.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>File</Label>
            <FileDropzone
              onFileUpload={handleFileUpload}
              accept="*"
              maxSize={50 * 1024 * 1024} // 50MB
            />
            {file && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleProcess} 
            disabled={isProcessing || !file || !password || (mode === 'decrypt' && !iv)}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : mode === 'encrypt' ? 'Encrypt & Download' : 'Decrypt & Download'}
          </Button>
        </div>
        
        {mode === 'encrypt' && iv && (
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
        )}
      </div>
    </ToolPanel>
  );
};

export default FileEncryptionTool;
