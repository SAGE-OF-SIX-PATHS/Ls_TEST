// src/services/encryption.service.ts
import { encrypt, decrypt } from '../utils/encryptor.util';

export interface SensitiveFields {
          cardNumber: string;
          cvv: string;
          expiryDate: string;
          phoneNumber: string;
          dateOfBirth: string;
}

export interface EncryptedField {
          encryptedData: string;
          iv: string;
}

export interface EncryptedFields {
          card: EncryptedField;
          cvv: EncryptedField;
          expiry: EncryptedField;
          phone: EncryptedField;
          dob: EncryptedField;
}

export function encryptFields(data: SensitiveFields): EncryptedFields {
          return {
                    card: encrypt(data.cardNumber),
                    cvv: encrypt(data.cvv),
                    expiry: encrypt(data.expiryDate),
                    phone: encrypt(data.phoneNumber),
                    dob: encrypt(data.dateOfBirth),
          };
}

export interface EncryptedInput {
          cardNumberEncrypted: string;
          cardIV: string;
          cvvEncrypted: string;
          cvvIV: string;
          expiryEncrypted: string;
          expiryIV: string;
          phoneEncrypted: string;
          phoneIV: string;
          dobEncrypted: string;
          dobIV: string;
}

/**
 * Decrypts encrypted sensitive fields using their corresponding IVs.
 * Includes verbose logs and safely skips missing/invalid inputs.
 */
export function decryptFields(data: EncryptedInput): SensitiveFields {
          console.log('\n🔓 [decryptFields] Starting decryption process...');

          const result: Partial<SensitiveFields> = {};

          if (data.cardNumberEncrypted && data.cardIV) {
                    console.log('[decryptFields] Decrypting card number...');
                    result.cardNumber = decrypt(data.cardNumberEncrypted, data.cardIV);
          } else {
                    result.cardNumber = '';
                    console.warn('[decryptFields] Skipping card number: Missing encrypted data or IV.');
          }

          if (data.cvvEncrypted && data.cvvIV) {
                    console.log('[decryptFields] Decrypting CVV...');
                    result.cvv = decrypt(data.cvvEncrypted, data.cvvIV);
          } else {
                    result.cvv = '';
                    console.warn('[decryptFields] Skipping CVV: Missing encrypted data or IV.');
          }

          if (data.expiryEncrypted && data.expiryIV) {
                    console.log('[decryptFields] Decrypting expiry date...');
                    result.expiryDate = decrypt(data.expiryEncrypted, data.expiryIV);
          } else {
                    result.expiryDate = '';
                    console.warn('[decryptFields] Skipping expiry date: Missing encrypted data or IV.');
          }

          if (data.phoneEncrypted && data.phoneIV) {
                    console.log('[decryptFields] Decrypting phone number...');
                    result.phoneNumber = decrypt(data.phoneEncrypted, data.phoneIV);
          } else {
                    result.phoneNumber = '';
                    console.warn('[decryptFields] Skipping phone number: Missing encrypted data or IV.');
          }

          if (data.dobEncrypted && data.dobIV) {
                    console.log('[decryptFields] Decrypting date of birth...');
                    result.dateOfBirth = decrypt(data.dobEncrypted, data.dobIV);
          } else {
                    result.dateOfBirth = '';
                    console.warn('[decryptFields] Skipping date of birth: Missing encrypted data or IV.');
          }

          console.log('✅ [decryptFields] Finished decryption:', result);

          return result as SensitiveFields;
}
