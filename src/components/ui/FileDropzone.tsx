
import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileUpload,
  accept = '*',
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        validateAndUploadFile(file);
      }
    },
    [onFileUpload, accept, maxSize]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        validateAndUploadFile(file);
      }
    },
    [onFileUpload, accept, maxSize]
  );

  const validateAndUploadFile = (file: File) => {
    // Check file type if accept is specified
    if (accept !== '*') {
      const fileType = file.type;
      const acceptedTypes = accept.split(',').map(type => type.trim());
      if (!acceptedTypes.some(type => fileType.match(type))) {
        setError(`File type not accepted. Please upload ${accept}`);
        return;
      }
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    onFileUpload(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 hover:bg-secondary/20'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileInputChange}
        accept={accept}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Drag & drop file here, or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSize / (1024 * 1024)}MB
        </p>
        {error && <p className="text-destructive text-xs mt-2">{error}</p>}
      </label>
    </div>
  );
};

export default FileDropzone;
