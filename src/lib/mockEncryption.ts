// Mock homomorphic encryption utilities
// In a real implementation, this would use lattigo compiled to WASM

// Generate a fake "encrypted" value that looks like real ciphertext
export const mockEncrypt = (value: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const baseHash = btoa(String(value * 12345 + 67890));
  let result = '';
  
  // Generate a long random-looking string
  for (let i = 0; i < 64; i++) {
    const charIndex = (value * (i + 1) * 7 + i * 13) % chars.length;
    result += chars[charIndex];
  }
  
  return `CKKS::${baseHash.slice(0, 8)}::${result}`;
};

// Mock "homomorphic addition" - just store the sum secretly
export const mockHomomorphicAdd = (encrypted1: string, encrypted2: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = 'HE_SUM::';
  
  // Generate deterministic but random-looking output
  for (let i = 0; i < 72; i++) {
    const combined = encrypted1.charCodeAt(i % encrypted1.length) + 
                     encrypted2.charCodeAt(i % encrypted2.length);
    result += chars[combined % chars.length];
  }
  
  return result;
};

// Mock decryption - returns the "real" value
export const mockDecrypt = (encrypted: string, privateKey: string, originalSum: number): number | null => {
  // Simulate key validation
  if (!privateKey || privateKey.length < 8) {
    return null;
  }
  
  // Simple key check (in demo, any key >= 8 chars works)
  const isValidKey = privateKey.includes('key') || 
                     privateKey.includes('secret') || 
                     privateKey.length >= 16;
  
  if (!isValidKey && privateKey !== 'demo') {
    return null;
  }
  
  return originalSum;
};

// Generate a mock key pair
export const generateMockKeyPair = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let publicKey = 'pk_';
  let privateKey = 'sk_secret_';
  
  for (let i = 0; i < 32; i++) {
    publicKey += chars[Math.floor(Math.random() * chars.length)];
    privateKey += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return { publicKey, privateKey };
};
