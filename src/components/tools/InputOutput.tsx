
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Trash, Upload, Download } from 'lucide-react';
import FileDropzone from '@/components/ui/FileDropzone';
import { useToast } from "@/hooks/use-toast";

interface InputOutputProps {
  input: string;
  setInput: (value: string) => void;
  output: string;
  isProcessing: boolean;
  onClear: () => void;
  onProcessFile?: (file: File) => void;
  inputLabel?: string;
  outputLabel?: string;
}

const InputOutput: React.FC<InputOutputProps> = ({
  input,
  setInput,
  output,
  isProcessing,
  onClear,
  onProcessFile,
  inputLabel = 'Input',
  outputLabel = 'Output'
}) => {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setIsCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "The output has been copied to your clipboard.",
        duration: 3000,
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const handleFileUpload = (file: File) => {
    if (onProcessFile) {
      onProcessFile(file);
      setShowFileUpload(false);
    } else {
      // Read as text if no specific handler
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setInput(e.target.result as string);
          setShowFileUpload(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: "The output has been downloaded as a text file.",
      duration: 3000,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">{inputLabel}</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowFileUpload(!showFileUpload)}
              title="Upload file"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClear}
              disabled={!input}
              title="Clear input"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showFileUpload ? (
          <FileDropzone onFileUpload={handleFileUpload} />
        ) : (
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to process..."
            className="flex-1 min-h-[200px] font-mono"
          />
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">{outputLabel}</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCopyOutput}
              disabled={!output}
              title="Copy to clipboard"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={downloadOutput}
              disabled={!output}
              title="Download output"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Textarea
          value={output}
          readOnly
          placeholder="Output will appear here..."
          className={`flex-1 min-h-[200px] font-mono ${isProcessing ? 'animate-pulse' : ''}`}
        />
      </div>
    </div>
  );
};

export default InputOutput;
