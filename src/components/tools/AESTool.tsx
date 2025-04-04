
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import ToolPanel from './ToolPanel';
import InputOutput from './InputOutput';
import { aesEncrypt, aesDecrypt } from '@/utils/crypto';
import { useToast } from "@/hooks/use-toast";

const AESTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [mode, setMode] = useState('CBC');
  const [operation, setOperation] = useState('encrypt');
  const [autoGenIv, setAutoGenIv] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-generate IV when enabled
    if (autoGenIv && operation === 'encrypt') {
      const randomIv = Array.from({ length: 16 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      setIv(randomIv);
    }
  }, [autoGenIv, operation]);

  const handleProcess = () => {
    if (!input) {
      toast({
        title: "Input required",
        description: "Please enter text to process",
        variant: "destructive",
      });
      return;
    }

    if (!key) {
      toast({
        title: "Key required",
        description: "Please enter an encryption key",
        variant: "destructive",
      });
      return;
    }

    if (operation === 'decrypt' && !iv) {
      toast({
        title: "IV required",
        description: "Please enter an initialization vector for decryption",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      if (operation === 'encrypt') {
        const result = aesEncrypt(input, key, mode, autoGenIv ? undefined : iv);
        if (result.success) {
          setOutput(JSON.stringify({
            ciphertext: result.ciphertext,
            iv: result.iv,
            mode: mode
          }, null, 2));
        } else {
          toast({
            title: "Encryption Error",
            description: result.error || "Failed to encrypt the data",
            variant: "destructive",
          });
        }
      } else { // decrypt
        try {
          // Try to parse the input as JSON if it's in our format
          let ciphertext = input;
          let ivToUse = iv;
          let modeToUse = mode;
          
          try {
            const jsonInput = JSON.parse(input);
            if (jsonInput.ciphertext && jsonInput.iv) {
              ciphertext = jsonInput.ciphertext;
              ivToUse = jsonInput.iv;
              if (jsonInput.mode) modeToUse = jsonInput.mode;
            }
          } catch (e) {
            // Not JSON, use as-is
          }
          
          const result = aesDecrypt(ciphertext, key, modeToUse, ivToUse);
          if (result.success) {
            setOutput(result.plaintext);
          } else {
            toast({
              title: "Decryption Error",
              description: result.error || "Failed to decrypt the data",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Decryption Error",
            description: error instanceof Error ? error.message : "Unknown error occurred",
            variant: "destructive",
          });
        }
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
      <h2 className="text-xl font-bold mb-4">AES Encryption</h2>
      <p className="mb-4">
        The Advanced Encryption Standard (AES) is a symmetric encryption algorithm widely used to secure sensitive data. 
        This tool provides AES encryption and decryption capabilities with various block cipher modes.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Features</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Encryption Modes</strong>: CBC (default), CFB, CTR, OFB, ECB (not recommended for sensitive data)</li>
        <li><strong>Key Size</strong>: Use any length key - internally processed as 128, 192, or 256 bits</li>
        <li><strong>IV Generation</strong>: Automatic or manual initialization vector</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">How to Use</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Enter the text you want to encrypt/decrypt in the input field</li>
        <li>Provide a secure encryption key</li>
        <li>Choose the operation mode (encrypt or decrypt)</li>
        <li>Select a block cipher mode from the dropdown</li>
        <li>For decryption, ensure you have the correct IV</li>
      </ol>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Security Notes</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>The encryption happens entirely in your browser - no data is sent to a server</li>
        <li>Always use a strong, unpredictable key for sensitive data</li>
        <li>ECB mode should be avoided for most use cases as it doesn't provide sufficient diffusion</li>
        <li>Store your encryption keys securely and never embed them in public code</li>
      </ul>
    </div>
  );

  return (
    <ToolPanel 
      title="AES Encryption/Decryption" 
      description="Encrypt or decrypt data using the Advanced Encryption Standard"
      documentation={documentation}
    >
      <div className="space-y-6">
        <Tabs value={operation} onValueChange={setOperation}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="key">Encryption Key</Label>
            <Input 
              id="key"
              value={key} 
              onChange={(e) => setKey(e.target.value)} 
              placeholder="Enter encryption key" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mode">Block Cipher Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBC">CBC</SelectItem>
                <SelectItem value="CFB">CFB</SelectItem>
                <SelectItem value="CTR">CTR</SelectItem>
                <SelectItem value="OFB">OFB</SelectItem>
                <SelectItem value="ECB">ECB (Not Recommended)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {operation === 'encrypt' ? (
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-iv"
              checked={autoGenIv}
              onCheckedChange={setAutoGenIv}
            />
            <Label htmlFor="auto-iv">Automatically generate IV</Label>
          </div>
        ) : null}
        
        {(!autoGenIv || operation === 'decrypt') && (
          <div className="space-y-2">
            <Label htmlFor="iv">Initialization Vector (IV) - Hex Format</Label>
            <Input 
              id="iv"
              value={iv} 
              onChange={(e) => setIv(e.target.value)} 
              placeholder="Enter IV in hex format" 
            />
          </div>
        )}
        
        <Button onClick={handleProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : operation === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </Button>
        
        <InputOutput
          input={input}
          setInput={setInput}
          output={output}
          isProcessing={isProcessing}
          onClear={handleClear}
          inputLabel={operation === 'encrypt' ? 'Plain Text' : 'Cipher Text'}
          outputLabel={operation === 'encrypt' ? 'Cipher Text' : 'Plain Text'}
        />
      </div>
    </ToolPanel>
  );
};

export default AESTool;
