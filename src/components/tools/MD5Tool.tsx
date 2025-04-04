
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ToolPanel from './ToolPanel';
import InputOutput from './InputOutput';
import { md5Hash } from '@/utils/hashing';
import { useToast } from "@/hooks/use-toast";

const MD5Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
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
      const result = md5Hash(input);
      
      if (result.success) {
        setOutput(result.hash);
      } else {
        toast({
          title: "Hashing Error",
          description: result.error || "Failed to generate hash",
          variant: "destructive",
        });
      }
      
      // Track tool usage
      if (window.gtag) {
        window.gtag('event', 'tool_used', {
          'tool_name': 'md5',
          'action': 'hash'
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
      <h2 className="text-xl font-bold mb-4">MD5 Hashing</h2>
      <p className="mb-4">
        MD5 (Message-Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value.
      </p>
      
      <div className="p-4 border border-red-500 rounded-md mt-2 mb-6">
        <p className="text-red-400 text-sm">
          <strong>Security Warning:</strong> MD5 is considered cryptographically broken and unsuitable for security purposes. 
          It should not be used for password storage, digital signatures, or any security-related functions. Use SHA-256 or stronger algorithms instead.
        </p>
      </div>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Common Uses of MD5</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>File integrity checking (checksums)</li>
        <li>Quickly identifying duplicate files</li>
        <li>Non-security related data indexing</li>
        <li>Legacy systems (for backward compatibility only)</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">MD5 Vulnerabilities</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Collision vulnerability:</strong> Different inputs can produce the same hash output</li>
        <li><strong>Preimage attacks:</strong> It's possible to generate files with a predetermined MD5 hash</li>
        <li><strong>Speed:</strong> MD5 is fast to compute, making brute force attacks easier</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Alternatives to MD5</h3>
      <p className="mb-2">For security-related applications, use these more secure hash functions:</p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>SHA-256 (Secure Hash Algorithm 256-bit)</li>
        <li>SHA-3</li>
        <li>BLAKE2</li>
        <li>bcrypt, scrypt, or Argon2 (for password hashing specifically)</li>
      </ul>
    </div>
  );

  return (
    <ToolPanel 
      title="MD5 Checksum" 
      description="Generate MD5 hash values from input data (not for security use)"
      documentation={documentation}
    >
      <div className="space-y-6">
        <div className="p-3 bg-amber-950/30 border border-amber-700/50 rounded-md">
          <p className="text-amber-400 text-sm font-medium">
            ⚠️ Warning: MD5 is not secure for passwords or cryptographic purposes. Use SHA-256 instead for security-sensitive applications.
          </p>
        </div>
        
        <Button onClick={handleProcess} disabled={isProcessing} variant="secondary">
          {isProcessing ? 'Processing...' : 'Generate MD5 Hash'}
        </Button>
        
        <InputOutput
          input={input}
          setInput={setInput}
          output={output}
          isProcessing={isProcessing}
          onClear={handleClear}
          inputLabel="Input Text"
          outputLabel="MD5 Output (128-bit)"
        />
      </div>
    </ToolPanel>
  );
};

export default MD5Tool;
