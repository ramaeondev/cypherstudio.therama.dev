
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToolPanel from './ToolPanel';
import InputOutput from './InputOutput';
import { base64Encode, base64Decode } from '@/utils/encoding';
import { useToast } from "@/hooks/use-toast";

const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('encode');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = () => {
    if (!input) {
      toast({
        title: "Input required",
        description: "Please enter text to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      if (operation === 'encode') {
        const result = base64Encode(input);
        setOutput(result);
      } else {
        const result = base64Decode(input);
        setOutput(result);
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to process the data. Make sure the input is valid.",
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
      <h2 className="text-xl font-bold mb-4">Base64 Encoding</h2>
      <p className="mb-4">
        Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
        It's commonly used for encoding binary data that needs to be stored and transferred over media that are designed to deal with text.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Common Uses</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Encoding binary data in JSON strings</li>
        <li>Embedding image data directly in HTML/CSS</li>
        <li>Email attachments (MIME)</li>
        <li>Storing complex data in URLs</li>
        <li>Representing binary data in XML documents</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">How to Use</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Select 'Encode' to convert text to Base64</li>
        <li>Select 'Decode' to convert Base64 back to text</li>
        <li>Enter the input text in the appropriate field</li>
        <li>Click the process button</li>
      </ol>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Technical Details</h3>
      <p className="mb-4">
        Base64 encoding increases the data size by approximately 33% (4 bytes for every 3 bytes of data).
        The alphabet used in Base64 consists of upper and lowercase letters A–Z, a–z, the numerals 0–9, and the symbols "+" and "/".
        The "=" symbol is used for padding at the end.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Limitations</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Not suitable for encryption (it's encoding, not encryption)</li>
        <li>Increases data size by ~33%</li>
        <li>Some characters (like "+" and "/") may need additional URL encoding in certain contexts</li>
      </ul>
    </div>
  );

  return (
    <ToolPanel 
      title="Base64 Encoding/Decoding" 
      description="Convert between plain text and Base64 encoded format"
      documentation={documentation}
    >
      <div className="space-y-6">
        <Tabs value={operation} onValueChange={setOperation}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : operation === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </Button>
        
        <InputOutput
          input={input}
          setInput={setInput}
          output={output}
          isProcessing={isProcessing}
          onClear={handleClear}
          inputLabel={operation === 'encode' ? 'Plain Text' : 'Base64 Text'}
          outputLabel={operation === 'encode' ? 'Base64 Text' : 'Plain Text'}
        />
      </div>
    </ToolPanel>
  );
};

export default Base64Tool;
