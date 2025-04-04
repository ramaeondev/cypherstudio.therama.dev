
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ToolPanel from './ToolPanel';
import InputOutput from './InputOutput';
import { sha1Hash, sha256Hash, sha512Hash, md5Hash } from '@/utils/hashing';
import { useToast } from "@/hooks/use-toast";

const HashingTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [hashType, setHashType] = useState('sha256');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = () => {
    if (!input) {
      toast({
        title: "Input required",
        description: "Please enter text to hash",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      let result;
      
      switch (hashType) {
        case 'md5':
          result = md5Hash(input);
          break;
        case 'sha1':
          result = sha1Hash(input);
          break;
        case 'sha256':
          result = sha256Hash(input);
          break;
        case 'sha512':
          result = sha512Hash(input);
          break;
        default:
          result = sha256Hash(input);
      }
      
      if (result.success) {
        setOutput(result.hash);
      } else {
        toast({
          title: "Hashing Error",
          description: result.error || "Failed to generate hash",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const documentation = (
    <div>
      <h2 className="text-xl font-bold mb-4">Cryptographic Hashing</h2>
      <p className="mb-4">
        Cryptographic hashing functions transform data of arbitrary size into a fixed-size string.
        The same input will always produce the same output, but it's practically impossible to reverse the process.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Available Algorithms</h3>
      
      <h4 className="font-semibold mt-4 mb-1">MD5</h4>
      <p className="mb-2 text-sm">
        <span className="text-warning">Not secure for cryptographic purposes.</span> Produces a 128-bit (16-byte) hash value.
        Primarily used for checksums and non-security applications.
      </p>
      
      <h4 className="font-semibold mt-4 mb-1">SHA-1</h4>
      <p className="mb-2 text-sm">
        <span className="text-warning">No longer considered secure for cryptographic purposes.</span> Produces a 160-bit (20-byte) hash value.
        Similar to MD5, it's still sometimes used for integrity checking.
      </p>
      
      <h4 className="font-semibold mt-4 mb-1">SHA-256</h4>
      <p className="mb-2 text-sm">
        Part of the SHA-2 family. Produces a 256-bit (32-byte) hash value.
        Widely used in security applications, including SSL certificates, digital signatures, and blockchain technologies.
      </p>
      
      <h4 className="font-semibold mt-4 mb-1">SHA-512</h4>
      <p className="mb-2 text-sm">
        Also part of the SHA-2 family. Produces a 512-bit (64-byte) hash value.
        Offers even more security than SHA-256 and is recommended for applications requiring the highest security.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Common Uses</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Password storage (with proper salting)</li>
        <li>Data integrity verification</li>
        <li>Digital signatures</li>
        <li>File checksums</li>
        <li>Blockchain/cryptocurrency implementations</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Security Considerations</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>MD5 and SHA-1 are considered cryptographically broken and should not be used for security purposes</li>
        <li>For password hashing, use specialized algorithms like bcrypt, scrypt, or Argon2 instead</li>
        <li>Hashing alone is not encryption - data is not hidden, just transformed</li>
        <li>Always salt password hashes to protect against rainbow table attacks</li>
      </ul>
    </div>
  );

  return (
    <ToolPanel 
      title="Cryptographic Hashing" 
      description="Generate secure hash values from input data"
      documentation={documentation}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="hash-algorithm">Hash Algorithm</Label>
          <RadioGroup 
            id="hash-algorithm" 
            value={hashType} 
            onValueChange={setHashType} 
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="md5" id="md5" />
              <Label htmlFor="md5" className="cursor-pointer">MD5</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sha1" id="sha1" />
              <Label htmlFor="sha1" className="cursor-pointer">SHA-1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sha256" id="sha256" />
              <Label htmlFor="sha256" className="cursor-pointer">SHA-256</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sha512" id="sha512" />
              <Label htmlFor="sha512" className="cursor-pointer">SHA-512</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button onClick={handleProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Generate Hash'}
        </Button>
        
        <InputOutput
          input={input}
          setInput={setInput}
          output={output}
          isProcessing={isProcessing}
          onClear={handleClear}
          inputLabel="Input Text"
          outputLabel="Hash Output"
        />
      </div>
    </ToolPanel>
  );
};

export default HashingTool;
