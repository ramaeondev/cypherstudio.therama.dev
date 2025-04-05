
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileDropzone from '@/components/ui/FileDropzone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { decryptFile, downloadFile } from '@/utils/fileOperations';
import { FileText } from 'lucide-react';

interface DecryptionFormProps {
  iv: string;
  setIv: (iv: string) => void;
}

const DecryptionForm: React.FC<DecryptionFormProps> = ({ iv, setIv }) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
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
    const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    setProcessedFileName(baseName.endsWith('.encrypted') ? baseName.replace('.encrypted', '') : `${baseName}.decrypted`);
  };

  const handleDecrypt = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to decrypt",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password for decryption",
        variant: "destructive",
      });
      return;
    }

    if (!iv) {
      toast({
        title: "IV required",
        description: "Please enter the initialization vector (IV) used during encryption",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const decrypted = await decryptFile(file, password, iv, encryptionMode, originalFileType);
      downloadFile(decrypted, processedFileName);
      
      toast({
        title: "File decrypted successfully",
        description: "The decrypted file has been downloaded",
      });
      
      // Track file decryption for analytics
      if (window.gtag) {
        window.gtag('event', 'file_processed', {
          'tool_name': 'file_encryption',
          'action': 'decrypt',
          'file_type': file.type || 'unknown'
        });
      }
    } catch (error) {
      console.error("File decryption error:", error);
      toast({
        title: "Decryption Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password for decryption"
        />
      </div>
      
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
      
      <Button 
        onClick={handleDecrypt} 
        disabled={isProcessing || !file || !password || !iv}
        className="w-full"
      >
        {isProcessing ? 'Decrypting...' : 'Decrypt & Download'}
      </Button>
    </div>
  );
};

export default DecryptionForm;
