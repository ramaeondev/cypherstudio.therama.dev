
import CryptoJS from 'crypto-js';

export interface HashResult {
  hash: string;
  success: boolean;
  error?: string;
}

// SHA-1 Hashing
export const sha1Hash = (text: string): HashResult => {
  try {
    const hash = CryptoJS.SHA1(text).toString();
    return { hash, success: true };
  } catch (error) {
    console.error('SHA-1 Hashing Error:', error);
    return {
      hash: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// SHA-256 Hashing
export const sha256Hash = (text: string): HashResult => {
  try {
    const hash = CryptoJS.SHA256(text).toString();
    return { hash, success: true };
  } catch (error) {
    console.error('SHA-256 Hashing Error:', error);
    return {
      hash: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// SHA-512 Hashing
export const sha512Hash = (text: string): HashResult => {
  try {
    const hash = CryptoJS.SHA512(text).toString();
    return { hash, success: true };
  } catch (error) {
    console.error('SHA-512 Hashing Error:', error);
    return {
      hash: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// MD5 Hashing
export const md5Hash = (text: string): HashResult => {
  try {
    const hash = CryptoJS.MD5(text).toString();
    return { hash, success: true };
  } catch (error) {
    console.error('MD5 Hashing Error:', error);
    return {
      hash: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// HMAC SHA-256 Hashing
export const hmacSha256 = (text: string, key: string): HashResult => {
  try {
    const hash = CryptoJS.HmacSHA256(text, key).toString();
    return { hash, success: true };
  } catch (error) {
    console.error('HMAC SHA-256 Error:', error);
    return {
      hash: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
