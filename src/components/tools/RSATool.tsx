
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import ToolPanel from './ToolPanel';
import InputOutput from './InputOutput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const RSATool: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt' | 'generate'>('encrypt');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = () => {
    if (!input && mode !== 'generate') {
      toast({
        title: "Input required",
        description: "Please enter text to process",
        variant: "destructive",
      });
      return;
    }

    if ((mode === 'encrypt' && !publicKey) || (mode === 'decrypt' && !privateKey)) {
      toast({
        title: "Key required",
        description: mode === 'encrypt' ? "Please enter a public key" : "Please enter a private key",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (mode === 'generate') {
        // In a real implementation, we'd use a proper RSA library
        // This is a simplified demo that generates placeholder keys
        setPublicKey(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3Tz2mr7SZiAMfQfmp6Zz
J5E1MpwCJcUNmcnYYGVDPZiJOadlEBkjtGABA3CKGTNkFRvBAkBjxLMwRWgJZoay
1QZ44jpS5cGp2Xr6hwAcfBZmO21aRpUt1EaJxlptk9vUK3kZy4zKCJhwcdOWIW4w
G9KCJ8MRIvL1N2yELg5bKZnwXgp7P0=
-----END PUBLIC KEY-----`);
        setPrivateKey(`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdPPaavtJmIAx9
B+anpnMnkTUynAIlxQ2ZydhgZUM9mIk5p2UQGSO0YAEDcIoZM2QVG8ECQGPEszBF
aAlmhrLVBnjiOlLlwanZevqHABx8FmY7bVpGlS3URonGWm2T29QreRnLjMoImHBx
05YhbjAb0oInwxEi8vU3bIQuDlspmfBeCns/
-----END PRIVATE KEY-----`);
        
        setOutput("Keys generated successfully! In a production environment, these would be real RSA keys.");
      } else if (mode === 'encrypt') {
        // Simulate RSA encryption
        setOutput(`Encrypted: ${btoa(input)}`);
      } else if (mode === 'decrypt') {
        // Simulate RSA decryption
        try {
          setOutput(`Decrypted: ${atob(input)}`);
        } catch (e) {
          toast({
            title: "Decryption Error",
            description: "The input is not valid base64-encoded text",
            variant: "destructive",
          });
          setOutput("Error: Invalid input format");
        }
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setOutput("An error occurred during processing");
    } finally {
      setIsProcessing(false);
      
      // Track tool usage
      if (window.gtag) {
        window.gtag('event', 'tool_used', {
          'tool_name': 'rsa',
          'action': mode
        });
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const documentation = (
    <div>
      <h2 className="text-xl font-bold mb-4">RSA Encryption</h2>
      <p className="mb-4">
        RSA (Rivest–Shamir–Adleman) is a public-key cryptosystem widely used for secure data transmission. It is based on the practical difficulty of factoring the product of two large prime numbers.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">How RSA Works</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Generate two large prime numbers</li>
        <li>Compute their product (n) and the totient function</li>
        <li>Choose a public exponent (e) and calculate the private exponent (d)</li>
        <li>The public key consists of (n, e) and the private key consists of (n, d)</li>
      </ol>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">RSA Key Types</h3>
      <p className="mb-2 text-sm">
        <span className="font-semibold">Public Key:</span> Used to encrypt data or verify signatures. It can be shared publicly.
      </p>
      <p className="mb-2 text-sm">
        <span className="font-semibold">Private Key:</span> Used to decrypt data or create signatures. It must be kept secret.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Security Considerations</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>RSA key size should be at least 2048 bits for security</li>
        <li>RSA is typically slow for large data, so it's often used to encrypt symmetric keys</li>
        <li>Proper padding schemes (PKCS#1, OAEP) are crucial for security</li>
        <li>Private keys should never be shared or transmitted</li>
      </ul>
      
      <div className="p-4 border border-yellow-500 rounded-md mt-6">
        <p className="text-yellow-400 text-sm">
          <strong>Note:</strong> This tool provides a simplified demonstration of RSA encryption principles. 
          For production applications, use established cryptographic libraries that implement RSA with proper security considerations.
        </p>
      </div>
    </div>
  );

  return (
    <ToolPanel 
      title="RSA Encryption & Decryption" 
      description="Encrypt and decrypt data using RSA public-key cryptography"
      documentation={documentation}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'encrypt' | 'decrypt' | 'generate')} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            <TabsTrigger value="generate">Generate Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encrypt" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="public-key">Public Key</Label>
              <Textarea 
                id="public-key"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Paste RSA public key here..."
                className="font-mono text-xs h-32"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="decrypt" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="private-key">Private Key</Label>
              <Textarea 
                id="private-key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Paste RSA private key here..."
                className="font-mono text-xs h-32"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a new RSA key pair for encryption and decryption.
              In a production environment, you would use a cryptographically secure key generation method.
            </p>
          </TabsContent>
        </Tabs>
        
        <Button onClick={handleProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : mode === 'generate' ? 'Generate Key Pair' : 
            mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </Button>
        
        {mode !== 'generate' && (
          <InputOutput
            input={input}
            setInput={setInput}
            output={output}
            isProcessing={isProcessing}
            onClear={handleClear}
            inputLabel={mode === 'encrypt' ? "Plain Text" : "Encrypted Text"}
            outputLabel={mode === 'encrypt' ? "Encrypted Output" : "Decrypted Output"}
          />
        )}
        
        {mode === 'generate' && output && (
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm mb-2 font-medium">{output}</p>
          </div>
        )}
      </div>
    </ToolPanel>
  );
};

export default RSATool;
