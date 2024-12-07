// utils/cryptoUtils.js
import CryptoJS from "crypto-js";

// Derive encryption key from user password and user ID
export const deriveEncryptionKey = (userPassword, userId) => {
  const salt = CryptoJS.enc.Utf8.parse(userId || "default-salt");

  return CryptoJS.PBKDF2(userPassword, salt, {
    keySize: 256 / 32, // 256-bit key size
    iterations: 1000,
    hasher: CryptoJS.algo.SHA256,
  });
};

// Encrypt the note content using AES encryption
export const encryptNoteContent = (noteContent, userPassword, userId) => {
  // Validate inputs
  if (!noteContent) {
    throw new Error("Note content is required");
  }
  if (!userPassword) {
    throw new Error("User password is required");
  }
  if (!userId) {
    throw new Error("User ID or email is required");
  }

  const encryptionKey = deriveEncryptionKey(userPassword, userId);
  const iv = CryptoJS.lib.WordArray.random(128 / 8); // Generate a random IV\\

  // Encrypt the note content
  const encrypted = CryptoJS.AES.encrypt(noteContent, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Return the encrypted content and IV as base64 strings
  return {
    encryptedContent: encrypted.toString(), // Return the ciphertext as a base64 string
    salt: CryptoJS.enc.Base64.stringify(iv), // Return the IV (salt) as a base64 string
    iv: iv,
  };
};

// Decrypt the note content using AES decryption
export const decryptNoteContent = (
  encryptedContent,
  userPassword,
  userId,
  ivBase64
) => {
  // Validate inputs
  if (!encryptedContent) {
    throw new Error("Encrypted content is required");
  }

  if (!userPassword) {
    throw new Error("User password is required");
  }

  if (!userId) {
    throw new Error("User ID or email is required");
  }

  if (!ivBase64) {
    throw new Error("IV (Initialization Vector) is required");
  }

  // Derive encryption key using user password and user ID
  const encryptionKey = deriveEncryptionKey(userPassword, userId);

  // Parse the IV from its base64 string representation
  const iv = CryptoJS.enc.Base64.parse(ivBase64);

  // Decrypt the encrypted content using the derived key and IV
  const decryptedBytes = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encryptedContent) },
    encryptionKey,
    {
      iv: iv, // IV is required for CBC mode
      mode: CryptoJS.mode.CBC, // CBC mode
      padding: CryptoJS.pad.Pkcs7, // PKCS7 padding
    }
  );

  // Convert the decrypted bytes to a UTF-8 string
  const decryptedContent = decryptedBytes.toString(CryptoJS.enc.Utf8);

  // Check if decryption was successful
  if (!decryptedContent) {
    throw new Error("Decryption failed: empty content");
  }

  return decryptedContent; // Return the decrypted content
};
