import BankAccount from '../models/BankAccount';
export const generateUniqueAccountNumber = async (): Promise<string> => {
  let unique = false;
  let accountNumber = '';
  let attempts = 0;
  const maxAttempts = 10000;

  while (!unique && attempts < maxAttempts) {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const existing = await BankAccount.findOne({ accountNumber });
    if (!existing) unique = true;

    attempts++;
  }

  if (!unique) {
    throw new Error('Failed to generate a unique account number after max attempts');
  }

  return accountNumber;
};
