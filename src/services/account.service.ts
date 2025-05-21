// src/services/account.service.ts
import BankAccount from '../models/BankAccount';
import VirtualCard from '../models/VirtualCard';
import { encryptFields, decryptFields, SensitiveFields, EncryptedFields } from './encryption.service';
import { generateUniqueAccountNumber } from '../utils/generateAccountNumber';

interface CreateAccountData {
          firstName: string;
          surname: string;
          email: string;
          phoneNumber: string;
          dateOfBirth: string;
}

export async function createAccountService(data: CreateAccountData) {
          // Generate account number
          const accountNumber = await generateUniqueAccountNumber();

          // Generate card data
          const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
          const cvv = String(Math.floor(100 + Math.random() * 900));
          const expiry = new Date();
          expiry.setFullYear(expiry.getFullYear() + 3);
          const expiryDate = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${expiry.getFullYear().toString().slice(-2)}`;

          // Compose all sensitive fields
          const sensitiveData: SensitiveFields = {
                    cardNumber,
                    cvv,
                    expiryDate,
                    phoneNumber: data.phoneNumber,
                    dateOfBirth: data.dateOfBirth,
          };

          // Encrypt all sensitive data
          const encryptedData: EncryptedFields = encryptFields(sensitiveData);

          // Save bank account
          const newAccount = new BankAccount({
                    firstName: data.firstName,
                    surname: data.surname,
                    email: data.email,
                    accountNumber,
                    phoneEncrypted: encryptedData.phone.encryptedData,
                    phoneIV: encryptedData.phone.iv,
                    dobEncrypted: encryptedData.dob.encryptedData,
                    dobIV: encryptedData.dob.iv,
          });

          const savedAccount = await newAccount.save();

          // Save virtual card
          const newCard = new VirtualCard({
                    accountId: savedAccount._id,
                    cardNumberEncrypted: encryptedData.card.encryptedData,
                    cardIV: encryptedData.card.iv,
                    cvvEncrypted: encryptedData.cvv.encryptedData,
                    cvvIV: encryptedData.cvv.iv,
                    expiryEncrypted: encryptedData.expiry.encryptedData,
                    expiryIV: encryptedData.expiry.iv,
          });

          await newCard.save();

          // For testing, decrypt and return the original sensitive fields
          const decrypted = decryptFields({
                    cardNumberEncrypted: encryptedData.card.encryptedData,
                    cardIV: encryptedData.card.iv,
                    cvvEncrypted: encryptedData.cvv.encryptedData,
                    cvvIV: encryptedData.cvv.iv,
                    expiryEncrypted: encryptedData.expiry.encryptedData,
                    expiryIV: encryptedData.expiry.iv,
                    phoneEncrypted: encryptedData.phone.encryptedData,
                    phoneIV: encryptedData.phone.iv,
                    dobEncrypted: encryptedData.dob.encryptedData,
                    dobIV: encryptedData.dob.iv,
          });

          return {
                    account: savedAccount,
                    virtualCard: {
                              cardNumber: decrypted.cardNumber,
                              cvv: decrypted.cvv,
                              expiryDate: decrypted.expiryDate,
                    },
                    decrypted,
          };
}
