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

export function decryptFields(data: EncryptedInput): SensitiveFields {
          return {
                    cardNumber: decrypt(data.cardNumberEncrypted, data.cardIV),
                    cvv: decrypt(data.cvvEncrypted, data.cvvIV),
                    expiryDate: decrypt(data.expiryEncrypted, data.expiryIV),
                    phoneNumber: decrypt(data.phoneEncrypted, data.phoneIV),
                    dateOfBirth: decrypt(data.dobEncrypted, data.dobIV),
          };
}
