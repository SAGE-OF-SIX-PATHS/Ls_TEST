import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex'); // 32 bytes hex key from .env
if (KEY.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex chars)');

export function encrypt(text: string): { encryptedData: string; iv: string } {
          const iv = crypto.randomBytes(12);
          const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
          const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
          const tag = cipher.getAuthTag();

          // Store iv + encrypted + tag all as hex strings separated by ':'
          const encryptedData = Buffer.concat([encrypted, tag]).toString('hex');
          return {
                    encryptedData,
                    iv: iv.toString('hex'),
          };
}

export function decrypt(encryptedData: string, ivHex: string): string {
          const iv = Buffer.from(ivHex, 'hex');
          const encryptedBuffer = Buffer.from(encryptedData, 'hex');

          // Separate ciphertext and auth tag (last 16 bytes)
          const tag = encryptedBuffer.slice(encryptedBuffer.length - 16);
          const ciphertext = encryptedBuffer.slice(0, encryptedBuffer.length - 16);

          const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
          decipher.setAuthTag(tag);

          const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
          return decrypted.toString('utf8');
}
