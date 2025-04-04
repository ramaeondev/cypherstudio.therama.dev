
import CryptoJS from 'crypto-js';

// AES Encryption
export const aesEncrypt = (text: string, key: string, mode: string = 'CBC', iv?: string) => {
  try {
    const keyObj = CryptoJS.enc.Utf8.parse(key);
    const ivObj = iv ? CryptoJS.enc.Utf8.parse(iv) : CryptoJS.lib.WordArray.random(16);
    
    let options: CryptoJS.CipherOption = {
      iv: ivObj,
      padding: CryptoJS.pad.Pkcs7,
      mode: getCryptoMode(mode)
    };
    
    const encrypted = CryptoJS.AES.encrypt(text, keyObj, options);
    
    return {
      ciphertext: encrypted.toString(),
      iv: CryptoJS.enc.Hex.stringify(ivObj),
      success: true
    };
  } catch (error) {
    console.error('AES Encryption Error:', error);
    return {
      ciphertext: '',
      iv: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// AES Decryption
export const aesDecrypt = (ciphertext: string, key: string, mode: string = 'CBC', iv: string) => {
  try {
    const keyObj = CryptoJS.enc.Utf8.parse(key);
    const ivObj = CryptoJS.enc.Hex.parse(iv);
    
    let options: CryptoJS.CipherOption = {
      iv: ivObj,
      padding: CryptoJS.pad.Pkcs7,
      mode: getCryptoMode(mode)
    };
    
    const decrypted = CryptoJS.AES.decrypt(ciphertext, keyObj, options);
    
    return {
      plaintext: decrypted.toString(CryptoJS.enc.Utf8),
      success: true
    };
  } catch (error) {
    console.error('AES Decryption Error:', error);
    return {
      plaintext: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// RSA functions would typically require a more complex library
// This is a placeholder for a proper RSA implementation
export const rsaEncrypt = (text: string, publicKey: string) => {
  // Placeholder for actual RSA encryption
  return {
    ciphertext: `RSA encryption not fully implemented. Would encrypt: ${text}`,
    success: true
  };
};

export const rsaDecrypt = (ciphertext: string, privateKey: string) => {
  // Placeholder for actual RSA decryption
  return {
    plaintext: `RSA decryption not fully implemented. Would decrypt: ${ciphertext}`,
    success: true
  };
};

// Helper to get CryptoJS mode
function getCryptoMode(mode: string): any {
  switch (mode.toUpperCase()) {
    case 'CBC':
      return CryptoJS.mode.CBC;
    case 'CFB':
      return CryptoJS.mode.CFB;
    case 'CTR':
      return CryptoJS.mode.CTR;
    case 'OFB':
      return CryptoJS.mode.OFB;
    case 'ECB':
      return CryptoJS.mode.ECB;
    default:
      return CryptoJS.mode.CBC;
  }
}
