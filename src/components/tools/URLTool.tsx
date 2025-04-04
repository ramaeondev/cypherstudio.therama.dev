
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToolPanel from './ToolPanel';
import InputOutput from './InputOutput';
import { urlEncode, urlDecode } from '@/utils/encoding';
import { useToast } from "@/hooks/use-toast";

const URLTool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
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
      if (mode === 'encode') {
        setOutput(urlEncode(input));
      } else {
        setOutput(urlDecode(input));
      }
      
      // Track tool usage
      if (window.gtag) {
        window.gtag('event', 'tool_used', {
          'tool_name': 'url',
          'action': mode
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
      <h2 className="text-xl font-bold mb-4">URL Encoding/Decoding</h2>
      <p className="mb-4">
        URL encoding (also known as percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI) under certain circumstances.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">How URL Encoding Works</h3>
      <p className="mb-4">
        URL encoding replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits. URLs cannot contain spaces or certain other characters that are not part of the standard URL character set.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Common Encoded Characters</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-border px-4 py-2 text-left">Character</th>
              <th className="border border-border px-4 py-2 text-left">Encoded Form</th>
              <th className="border border-border px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-4 py-2">Space</td>
              <td className="border border-border px-4 py-2">%20</td>
              <td className="border border-border px-4 py-2">Space character</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2">&</td>
              <td className="border border-border px-4 py-2">%26</td>
              <td className="border border-border px-4 py-2">Ampersand</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2">+</td>
              <td className="border border-border px-4 py-2">%2B</td>
              <td className="border border-border px-4 py-2">Plus sign</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2">/</td>
              <td className="border border-border px-4 py-2">%2F</td>
              <td className="border border-border px-4 py-2">Forward slash</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2">?</td>
              <td className="border border-border px-4 py-2">%3F</td>
              <td className="border border-border px-4 py-2">Question mark</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2">#</td>
              <td className="border border-border px-4 py-2">%23</td>
              <td className="border border-border px-4 py-2">Hash/number sign</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Common Use Cases</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Encoding query parameters in URLs</li>
        <li>Submitting form data through GET and POST requests</li>
        <li>Encoding special characters in API requests</li>
        <li>Handling internationalized domain names</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Notes</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>In application/x-www-form-urlencoded forms, spaces are sometimes encoded as "+" instead of "%20"</li>
        <li>Different programming languages and frameworks may have slight variations in URL encoding implementation</li>
        <li>Double encoding (encoding an already encoded URL) can cause issues and should be avoided</li>
      </ul>
    </div>
  );

  return (
    <ToolPanel 
      title="URL Encoding & Decoding" 
      description="Encode and decode URL components"
      documentation={documentation}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'encode' | 'decode')} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={handleProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </Button>
        
        <InputOutput
          input={input}
          setInput={setInput}
          output={output}
          isProcessing={isProcessing}
          onClear={handleClear}
          inputLabel={mode === 'encode' ? "Text to Encode" : "Text to Decode"}
          outputLabel={mode === 'encode' ? "Encoded URL" : "Decoded URL"}
        />
      </div>
    </ToolPanel>
  );
};

export default URLTool;
