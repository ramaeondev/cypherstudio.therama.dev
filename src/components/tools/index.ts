
import AESTool from './AESTool';
import RSATool from './RSATool';
import Base64Tool from './Base64Tool';
import URLTool from './URLTool';
import HashingTool from './HashingTool';
import MD5Tool from './MD5Tool';
import FileEncryptionTool from './FileEncryptionTool';

// Map tool IDs to their components
export const tools = {
  aes: AESTool,
  rsa: RSATool,
  base64: Base64Tool,
  url: URLTool,
  sha: HashingTool,
  md5: MD5Tool,
  fileEncryption: FileEncryptionTool
};

export type ToolId = keyof typeof tools;
