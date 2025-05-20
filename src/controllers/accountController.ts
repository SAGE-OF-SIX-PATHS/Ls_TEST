import { Request, Response } from 'express';
import BankAccount from '../models/BankAccount';
import { generateUniqueAccountNumber } from '../utils/generateAccountNumber';

export const createAccount = async (req: Request, res: Response): Promise<void> => {
          try {
                    const { firstName, surname, email, phoneNumber, dateOfBirth } = req.body;

                    if (!firstName || !surname || !email || !phoneNumber || !dateOfBirth) {
                               res.status(400).json({ error: 'All fields are required.' });
                    }

                    const accountNumber = await generateUniqueAccountNumber();

                    const newAccount = new BankAccount({
                              firstName,
                              surname,
                              email,
                              phoneNumber,
                              dateOfBirth,
                              accountNumber,
                    });

                    await newAccount.save();

                    res.status(201).json({
                              message: 'Account created successfully!',
                              account: {
                                        firstName,
                                        surname,
                                        email,
                                        phoneNumber,
                                        dateOfBirth,
                                        accountNumber, // this is the generated account number i generated from the function in utils, so dont be surprised its herebut not in d req.body
                              }
                    });
          } catch (error) {
                    console.error('Error creating account:', error);
                    res.status(500).json({ error: 'Server error' });
          }
};
