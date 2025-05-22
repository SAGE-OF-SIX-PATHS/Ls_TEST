import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

if (KEY.length !== 32) {
          console.error('❌ ENCRYPTION_KEY is invalid:', process.env.ENCRYPTION_KEY);
          throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex chars)');
}

/**
 * Encrypts a given text string using AES-256-GCM.
 * @param text The string to encrypt.
 * @returns Encrypted data and the IV used, both in hex format.
 */
export function encrypt(text: string): { encryptedData: string; iv: string } {
          try {
                    const iv = crypto.randomBytes(12); // GCM IV should be 12 bytes
                    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
                    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
                    const tag = cipher.getAuthTag();

                    const encryptedData = Buffer.concat([encrypted, tag]).toString('hex');

                    console.log('🔐 Encrypting...');
                    console.log('➡️ Text:', text);
                    console.log('➡️ IV (hex):', iv.toString('hex'));
                    console.log('➡️ Auth Tag:', tag.toString('hex'));
                    console.log('✅ Encrypted Data:', encryptedData);

                    return {
                              encryptedData,
                              iv: iv.toString('hex'),
                    };
          } catch (err) {
                    console.error('❌ Error during encryption:', err);
                    throw err;
          }
}

/**
 * Decrypts a previously encrypted string using AES-256-GCM.
 * @param encryptedData Hex string containing the ciphertext + tag.
 * @param ivHex Hex string representation of the 12-byte IV.
 * @returns The original decrypted plaintext string.
 */
export function decrypt(encryptedData: string, ivHex: string): string {
          try {
                    console.log('🔓 Decrypting...');
                    console.log('➡️ IV (hex):', ivHex);
                    console.log('➡️ Encrypted Data (hex):', encryptedData);

                    if (!ivHex || typeof ivHex !== 'string' || ivHex.length !== 24) {
                              throw new Error(`Invalid IV passed to decrypt(). Expected 24 hex chars (12 bytes), got "${ivHex}"`);
                    }

                    const iv = Buffer.from(ivHex, 'hex');
                    const encryptedBuffer = Buffer.from(encryptedData, 'hex');

                    if (encryptedBuffer.length < 17) {
                              throw new Error(`Encrypted buffer too short to contain tag. Got ${encryptedBuffer.length} bytes`);
                    }

                    const tag = encryptedBuffer.slice(encryptedBuffer.length - 16);
                    const ciphertext = encryptedBuffer.slice(0, encryptedBuffer.length - 16);

                    console.log('➡️ Ciphertext Length:', ciphertext.length);
                    console.log('➡️ Auth Tag:', tag.toString('hex'));

                    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
                    decipher.setAuthTag(tag);

                    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
                    const result = decrypted.toString('utf8');

                    console.log('✅ Decrypted Result:', result);
                    return result;
          } catch (err) {
                    console.error('❌ Error during decryption:', err);
                    throw err;
          }
}
