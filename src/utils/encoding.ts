
// Base64 Encoding
export const base64Encode = (text: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    console.error('Base64 Encoding Error:', error);
    throw error;
  }
};

// Base64 Decoding
export const base64Decode = (encoded: string): string => {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch (error) {
    console.error('Base64 Decoding Error:', error);
    throw error;
  }
};

// URL Encoding
export const urlEncode = (text: string): string => {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    console.error('URL Encoding Error:', error);
    throw error;
  }
};

// URL Decoding
export const urlDecode = (encoded: string): string => {
  try {
    return decodeURIComponent(encoded);
  } catch (error) {
    console.error('URL Decoding Error:', error);
    throw error;
  }
};

// Hex Encoding
export const hexEncode = (text: string): string => {
  try {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const hexValue = charCode.toString(16);
      hex += (hexValue.length === 1 ? '0' : '') + hexValue;
    }
    return hex;
  } catch (error) {
    console.error('Hex Encoding Error:', error);
    throw error;
  }
};

// Hex Decoding
export const hexDecode = (hex: string): string => {
  try {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const hexChar = hex.substr(i, 2);
      const charCode = parseInt(hexChar, 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  } catch (error) {
    console.error('Hex Decoding Error:', error);
    throw error;
  }
};

// Binary Encoding
export const binaryEncode = (text: string): string => {
  try {
    return text.split('').map(char => {
      const binary = char.charCodeAt(0).toString(2);
      return '0'.repeat(8 - binary.length) + binary;
    }).join(' ');
  } catch (error) {
    console.error('Binary Encoding Error:', error);
    throw error;
  }
};

// Binary Decoding
export const binaryDecode = (binary: string): string => {
  try {
    return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
  } catch (error) {
    console.error('Binary Decoding Error:', error);
    throw error;
  }
};
