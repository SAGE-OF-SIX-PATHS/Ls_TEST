import { Request, Response } from 'express';
import BankAccount from '../models/BankAccount';
import VirtualCard from '../models/VirtualCard';
import { generateUniqueAccountNumber } from '../utils/generateAccountNumber';
import { encryptFields, decryptFields, SensitiveFields } from '../services/encryption.service';

// 🔢 Generate random card details (card number, CVV, expiry date)
const generateCardDetails = () => {
        const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
        const cvv = String(Math.floor(100 + Math.random() * 900));
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 3);
        const expiryDate = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${expiry.getFullYear().toString().slice(-2)}`;
        return { cardNumber, cvv, expiryDate };
};

// 🧾 Create a new bank account with encrypted sensitive info
export const createAccount = async (req: Request, res: Response): Promise<void> => {
        try {
                console.log('[createAccount] Received request body:', req.body);
                const { firstName, surname, email, phoneNumber, dateOfBirth } = req.body;

                // ✅ Step 1: Validate input
                if (!firstName || !surname || !email || !phoneNumber || !dateOfBirth) {
                        console.error('[createAccount] Missing required fields');
                        res.status(400).json({ error: 'All fields are required.' });
                        return;
                }

                // ✅ Step 2: Check if account with email already exists
                const existing = await BankAccount.findOne({ email });
                if (existing) {
                        console.warn('[createAccount] Account already exists for email:', email);
                        res.status(409).json({ error: `Account already exists for this email. ${email}` });
                        return;
                }

                // 🔢 Step 3: Generate a unique 10-digit account number
                const accountNumber = await generateUniqueAccountNumber();
                console.log('[createAccount] Generated account number:', accountNumber);

                // 💳 Step 4: Generate virtual card details
                const { cardNumber, cvv, expiryDate } = generateCardDetails();

                // 🔐 Step 5: Encrypt sensitive data
                const sensitiveData: SensitiveFields = { cardNumber, cvv, expiryDate, phoneNumber, dateOfBirth };
                const encryptedData = encryptFields(sensitiveData);
                console.log('[createAccount] Encrypted data successfully');

                // 💾 Step 6: Create and save BankAccount document
                const newAccount = new BankAccount({
                        firstName,
                        surname,
                        email,
                        accountNumber,
                        phoneEncrypted: encryptedData.phone.encryptedData,
                        phoneIV: encryptedData.phone.iv,
                        dobEncrypted: encryptedData.dob.encryptedData,
                        dobIV: encryptedData.dob.iv,
                        iv: encryptedData.card.iv, // optional reference field
                });

                const savedAccount = await newAccount.save();
                console.log('[createAccount] BankAccount saved:', savedAccount._id);

                // 💾 Step 7: Create and save VirtualCard document linked to the account
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
                console.log('[createAccount] VirtualCard saved:', newCard._id);

                // 🔓 Step 8: Decrypt data just for return demo (remove in production!)
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

                console.log('[createAccount] Decrypted for response:', decrypted);

                // 📤 Step 9: Return success response with account and virtual card
                res.status(201).json({
                        message: 'Account created successfully! ✅ Your virtual card is ready! 💳',
                        account: savedAccount,
                        virtualCard: {
                                cardNumber: decrypted.cardNumber,
                                cvv: decrypted.cvv,
                                expiryDate: decrypted.expiryDate,
                        },
                        decryptedSensitiveData: decrypted, // ⚠️ For dev/testing only. Remove in production!
                });
        } catch (error) {
                console.error('[createAccount] Error:', error);
                res.status(500).json({ error: 'Server error' });
        }
};

// 📥 Fetch all accounts and return them with decrypted info
export const getAllAccounts = async (req: Request, res: Response) => {
        try {
                console.log('🔍 Fetching all accounts...');
                const accounts = await BankAccount.find();
                console.log(`✅ Found ${accounts.length} accounts`);

                const decryptedAccounts = await Promise.all(
                        accounts.map(async (account, index) => {
                                try {
                                        console.log(`➡️ Decrypting account #${index + 1} - ID: ${account._id}`);

                                        // 🔓 Decrypt phone and DOB from BankAccount
                                        const decryptedAccount = decryptFields({
                                                cardNumberEncrypted: '', cardIV: '',
                                                cvvEncrypted: '', cvvIV: '',
                                                expiryEncrypted: '', expiryIV: '',
                                                phoneEncrypted: account.phoneEncrypted,
                                                phoneIV: account.phoneIV,
                                                dobEncrypted: account.dobEncrypted,
                                                dobIV: account.dobIV,
                                        });

                                        // 🔍 Try to find matching VirtualCard for the account
                                        const virtualCard = await VirtualCard.findOne({ accountId: account._id });
                                        let virtualCardData = null;

                                        if (virtualCard) {
                                                console.log(`🔍 Found VirtualCard for account #${index + 1}`);

                                                // 🔓 Decrypt card data from VirtualCard
                                                const decryptedCard = decryptFields({
                                                        cardNumberEncrypted: virtualCard.cardNumberEncrypted,
                                                        cardIV: virtualCard.cardIV,
                                                        cvvEncrypted: virtualCard.cvvEncrypted,
                                                        cvvIV: virtualCard.cvvIV,
                                                        expiryEncrypted: virtualCard.expiryEncrypted,
                                                        expiryIV: virtualCard.expiryIV,
                                                        phoneEncrypted: '', phoneIV: '',
                                                        dobEncrypted: '', dobIV: '',
                                                });

                                                virtualCardData = {
                                                        cardNumber: decryptedCard.cardNumber,
                                                        cvv: decryptedCard.cvv,
                                                        expiryDate: decryptedCard.expiryDate,
                                                };
                                        } else {
                                                console.log(`⚠️ No VirtualCard for account #${index + 1}`);
                                        }

                                        return {
                                                _id: account._id,
                                                fullname: `${account.firstName} ${account.surname}`,
                                                email: account.email,
                                                accountNumber: account.accountNumber,
                                                phoneNumber: decryptedAccount.phoneNumber,
                                                dateOfBirth: decryptedAccount.dateOfBirth,
                                                virtualCard: virtualCardData,
                                                encryptedCard: {
                                                        phoneEncrypted: account.phoneEncrypted,
                                                        phoneIV: account.phoneIV,
                                                        dobEncrypted: account.dobEncrypted,
                                                        dobIV: account.dobIV,
                                                        cardNumberEncrypted: virtualCard?.cardNumberEncrypted,
                                                        cardIV: virtualCard?.cardIV,
                                                        cvvEncrypted: virtualCard?.cvvEncrypted,
                                                        cvvIV: virtualCard?.cvvIV,
                                                        expiryEncrypted: virtualCard?.expiryEncrypted,
                                                        expiryIV: virtualCard?.expiryIV,
                                                }
                                        };
                                } catch (err) {
                                        console.error(`❌ Error decrypting account #${index + 1}:`, err);
                                        return { error: `Failed to process account with ID: ${account._id}` };
                                }
                        })
                );

                console.log('🎉 All accounts processed');
                res.status(200).json(decryptedAccounts);
        } catch (error) {
                console.error('💥 Error fetching accounts:', error);
                res.status(500).json({ message: 'Internal server error' });
        }
};
