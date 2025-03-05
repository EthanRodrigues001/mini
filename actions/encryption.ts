"use server";

// This is a simple encryption/decryption implementation
// In a production environment, you should use a more secure method

// const ENCRYPTION_KEY =
//   process.env.ENCRYPTION_KEY || "your-secret-key-at-least-32-chars-long";

export async function encrypt(text: string): Promise<string> {
  // In a real implementation, you would use a proper encryption algorithm
  // This is just a simple base64 encoding for demonstration
  return Buffer.from(text).toString("base64");
}

export async function decrypt(encryptedText: string): Promise<string> {
  // In a real implementation, you would use a proper decryption algorithm
  // This is just a simple base64 decoding for demonstration
  return Buffer.from(encryptedText, "base64").toString();
}
