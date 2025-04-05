
import React from 'react';

const FileEncryptionDocumentation: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">File Encryption</h2>
      <p className="mb-4">
        Securely encrypt and decrypt files using AES encryption. This tool processes files directly in your browser - 
        no data is sent to any server, ensuring your files remain private.
      </p>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">How to use</h3>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li>Select whether you want to encrypt or decrypt a file</li>
        <li>Enter a strong password (remember this password, as you'll need it to decrypt the file)</li>
        <li>Drop your file or click to select it</li>
        <li>For decryption, you'll also need to provide the initialization vector (IV) that was generated during encryption</li>
        <li>Click the Process button to encrypt/decrypt</li>
        <li>The processed file will be automatically downloaded</li>
      </ol>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Security Considerations</h3>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Use a strong, unique password for each file you encrypt</li>
        <li>Store the initialization vector (IV) securely; you'll need it along with the password for decryption</li>
        <li>All processing happens in your browser - no data is uploaded to any server</li>
        <li>CBC mode provides better security than ECB mode</li>
      </ul>
      
      <div className="p-4 border border-yellow-500 rounded-md mt-6">
        <p className="text-yellow-400 text-sm">
          <strong>Note:</strong> This tool uses AES encryption with a key derived from your password. 
          If you lose your password or the IV, your encrypted file cannot be recovered.
        </p>
      </div>
    </div>
  );
};

export default FileEncryptionDocumentation;
