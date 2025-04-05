
import CryptoJS from 'crypto-js';
import { aesEncrypt, aesDecrypt } from './crypto';

// Function to read file as ArrayBuffer
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// Function to read file as text
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

// Function to read file as DataURL
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as DataURL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

// Function to convert ArrayBuffer to WordArray (for CryptoJS)
export const arrayBufferToWordArray = (ab: ArrayBuffer): CryptoJS.lib.WordArray => {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    a.push(
      (i8a[i] << 24) |
      (i8a[i + 1] << 16) |
      (i8a[i + 2] << 8) |
      i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
};

// Function to convert WordArray to Uint8Array
export const wordArrayToUint8Array = (wordArray: CryptoJS.lib.WordArray): Uint8Array => {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  
  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    u8[i] = byte;
  }
  
  return u8;
};

// Function to download file
export const downloadFile = (data: Blob | string, filename: string): void => {
  const blob = typeof data === 'string' ? new Blob([data]) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

// Extract file extension from a filename
export const getFileExtension = (filename: string): string => {
  return filename.includes('.') ? filename.split('.').pop() || '' : '';
};

// File encryption using AES
export const encryptFile = async (
  file: File,
  password: string,
  mode: string = 'CBC'
): Promise<{ encrypted: Blob; iv: string; metadata: string }> => {
  try {
    // Read file as array buffer
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // Convert array buffer to word array for CryptoJS
    const wordArray = arrayBufferToWordArray(arrayBuffer);
    
    // Store the original file extension and mimetype
    const fileExtension = getFileExtension(file.name);
    const fileMimeType = file.type;
    const metadata = JSON.stringify({
      ext: fileExtension,
      type: fileMimeType
    });
    
    // Base64 encode the metadata for storage
    const encodedMetadata = btoa(metadata);
    
    // Encrypt the file content
    const result = aesEncrypt(wordArray.toString(CryptoJS.enc.Base64), password, mode);
    
    if (!result.success) {
      throw new Error(result.error || 'Encryption failed');
    }
    
    // Create a blob from the encrypted string
    const encryptedBlob = new Blob([result.ciphertext], { type: 'application/octet-stream' });
    
    return {
      encrypted: encryptedBlob,
      iv: result.iv,
      metadata: encodedMetadata
    };
  } catch (error) {
    console.error('File encryption error:', error);
    throw error;
  }
};

// File decryption using AES
export const decryptFile = async (
  file: File,
  password: string,
  iv: string,
  mode: string = 'CBC',
  metadata?: string
): Promise<Blob> => {
  try {
    // Read encrypted file as text
    const encryptedText = await readFileAsText(file);
    
    // Decrypt the file content
    const result = aesDecrypt(encryptedText, password, mode, iv);
    
    if (!result.success) {
      throw new Error(result.error || 'Decryption failed');
    }
    
    // Parse metadata if provided
    let mimeType = 'application/octet-stream';
    
    if (metadata) {
      try {
        const decodedMetadata = JSON.parse(atob(metadata));
        if (decodedMetadata.type) {
          mimeType = decodedMetadata.type;
        }
      } catch (e) {
        console.warn('Failed to parse file metadata, using default mime type');
      }
    }
    
    // Convert the decrypted base64 string back to blob
    const binaryString = atob(result.plaintext);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create a blob from the decrypted array
    return new Blob([bytes], { type: mimeType });
  } catch (error) {
    console.error('File decryption error:', error);
    throw error;
  }
};
