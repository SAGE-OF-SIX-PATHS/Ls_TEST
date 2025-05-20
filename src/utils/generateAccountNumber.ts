import BankAccount from '../models/BankAccount';

export const generateUniqueAccountNumber = async (): Promise<string> => {
          let unique = false;
          let accountNumber = '';

          while (!unique) {
                    // Generate random 10-digit number
                    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

                    // Check if it already exists in DB, I did this to avoid same account numbers in my DB
                    const existing = await BankAccount.findOne({ accountNumber });
                    if (!existing) unique = true;
          }

          return accountNumber;
};
