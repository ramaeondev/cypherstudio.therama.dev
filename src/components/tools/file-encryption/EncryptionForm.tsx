
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileDropzone from '@/components/ui/FileDropzone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { encryptFile } from '@/utils/fileOperations';
import { downloadFile } from '@/utils/fileOperations';
import { FileText } from 'lucide-react';

interface EncryptionFormProps {
  onIvGenerated: (iv: string) => void;
}

const EncryptionForm: React.FC<EncryptionFormProps> = ({ onIvGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [encryptionMode, setEncryptionMode] = useState('CBC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFileName, setProcessedFileName] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    
    // Generate a processed file name
    const fileName = uploadedFile.name;
    const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    setProcessedFileName(`${baseName}.encrypted`);
  };

  const handleEncrypt = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to encrypt",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password for encryption",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await encryptFile(file, password, encryptionMode);
      downloadFile(result.encrypted, processedFileName);
      
      // Show the IV to the user
      toast({
        title: "File encrypted successfully",
        description: "Save the initialization vector (IV) to decrypt the file later",
      });
      
      onIvGenerated(result.iv);
      
      // Track file encryption for analytics
      if (window.gtag) {
        window.gtag('event', 'file_processed', {
          'tool_name': 'file_encryption',
          'action': 'encrypt',
          'file_type': file.type || 'unknown'
        });
      }
    } catch (error) {
      console.error("File encryption error:", error);
      toast({
        title: "Encryption Error",
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
          placeholder="Enter password for encryption"
        />
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
      
      <Button 
        onClick={handleEncrypt} 
        disabled={isProcessing || !file || !password}
        className="w-full"
      >
        {isProcessing ? 'Encrypting...' : 'Encrypt & Download'}
      </Button>
    </div>
  );
};

export default EncryptionForm;
