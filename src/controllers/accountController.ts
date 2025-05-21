import { Request, Response } from 'express';
import BankAccount from '../models/BankAccount';
import VirtualCard from '../models/VirtualCard';
import { generateUniqueAccountNumber } from '../utils/generateAccountNumber';
import { encryptFields, decryptFields, SensitiveFields } from '../services/encryption.service';

// Card details generator
const generateCardDetails = () => {
        const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
        const cvv = String(Math.floor(100 + Math.random() * 900));
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 3);
        const expiryDate = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${expiry.getFullYear().toString().slice(-2)}`;
        return { cardNumber, cvv, expiryDate };
};

export const createAccount = async (req: Request, res: Response): Promise<void> => {
        try {
                console.log('[createAccount] Received request body:', req.body);

                const { firstName, surname, email, phoneNumber, dateOfBirth } = req.body;

                if (!firstName || !surname || !email || !phoneNumber || !dateOfBirth) {
                        console.error('[createAccount] Validation error: Missing required fields.');
                        res.status(400).json({ error: 'All fields are required.' });
                        return;
                }

                console.log('[createAccount] Generating unique account number...');
                const accountNumber = await generateUniqueAccountNumber();
                console.log('[createAccount] Generated account number:', accountNumber);

                console.log('[createAccount] Generating card details...');
                const { cardNumber, cvv, expiryDate } = generateCardDetails();
                console.log('[createAccount] Generated card details:', { cardNumber, cvv, expiryDate });

                const sensitiveData: SensitiveFields = {
                        cardNumber,
                        cvv,
                        expiryDate,
                        phoneNumber,
                        dateOfBirth,
                };

                console.log('[createAccount] Encrypting sensitive data...');
                const encryptedData = encryptFields(sensitiveData);
                console.log('[createAccount] Encrypted data:', encryptedData);

                console.log('[createAccount] Creating new BankAccount document...');
                const newAccount = new BankAccount({
                        firstName,
                        surname,
                        email,
                        accountNumber,
                        phoneEncrypted: encryptedData.phone.encryptedData,
                        phoneIV: encryptedData.phone.iv,
                        dobEncrypted: encryptedData.dob.encryptedData,
                        dobIV: encryptedData.dob.iv,
                });

                const savedAccount = await newAccount.save();
                console.log('[createAccount] BankAccount saved:', savedAccount._id);

                try {
                        const {
                                card: { encryptedData: cardEncrypted, iv: cardIV },
                                cvv: { encryptedData: cvvEncrypted, iv: cvvIV },
                                expiry: { encryptedData: expiryEncrypted, iv: expiryIV },
                        } = encryptedData;

                        if (!cardEncrypted || !cardIV || !cvvEncrypted || !cvvIV || !expiryEncrypted || !expiryIV) {
                                console.error('[createAccount] Missing one or more encrypted card fields', encryptedData);
                                res.status(500).json({ error: 'Encryption failed. Missing card fields.' });
                                return;
                        }

                        console.log('[createAccount] Creating new VirtualCard document...');
                        const newCard = new VirtualCard({
                                accountId: savedAccount._id,
                                cardNumberEncrypted: cardEncrypted,
                                cardIV,
                                cvvEncrypted: cvvEncrypted,
                                cvvIV,
                                expiryEncrypted: expiryEncrypted,
                                expiryIV,
                        });

                        await newCard.save();
                        console.log('[createAccount] VirtualCard saved');
                } catch (cardError) {
                        console.error('[createAccount] Error saving VirtualCard:', cardError);
                        res.status(500).json({ error: 'Error saving virtual card data' });
                        return;
                }

                console.log('[createAccount] Decrypting sensitive data for API response...');
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

                console.log('[createAccount] Decrypted sensitive data:', decrypted);

                res.status(201).json({
                        message: 'Account created successfully! ✅ Your virtual card is ready! 💳',
                        account: savedAccount,
                        virtualCard: {
                                cardNumber: decrypted.cardNumber,
                                cvv: decrypted.cvv,
                                expiryDate: decrypted.expiryDate,
                        },
                        decryptedSensitiveData: decrypted, // for testing only, remove in prod!
                });
        } catch (error) {
                console.error('[createAccount] Error creating account:', error);
                res.status(500).json({ error: 'Server error' });
        }
};
