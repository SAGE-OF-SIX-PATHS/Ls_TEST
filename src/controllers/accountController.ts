import { Request, Response } from 'express';
import BankAccount from '../models/BankAccount';
import { generateUniqueAccountNumber } from '../utils/generateAccountNumber';
import VirtualCard from '../models/VirtualCard';

//Function that I use for card control, declared first irrespective of the task sequence by learnable so that it can be used in the createAccount function
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
                    const { firstName, surname, email, phoneNumber, dateOfBirth } = req.body;

                    if (!firstName || !surname || !email || !phoneNumber || !dateOfBirth) {
                               res.status(400).json({ error: 'All fields are required.' });
                    }

                    const accountNumber = await generateUniqueAccountNumber();
                    //my API request body, incase testing on postman without API doc.
                    const newAccount = new BankAccount({
                              firstName,
                              surname,
                              email,
                              phoneNumber,
                              dateOfBirth,
                              accountNumber,
                    });

                    const savedAccount = await newAccount.save();

                    const { cardNumber, cvv, expiryDate } = generateCardDetails(); //store the card function

                    const newCard = new VirtualCard({
                              cardNumber,
                              cvv,
                              expiryDate,
                              accountId: savedAccount._id,
                    });

                            await newCard.save();

                    res.status(201).json({
                              message: 'Account created successfully! \n Your virtual card is ready',
                              account: savedAccount,
                              virtualCard: {
                                        cardNumber,
                                        cvv,
                                        expiryDate,
                                      },
                    });
          } catch (error) {
                    console.error('Error creating account:', error);
                    res.status(500).json({ error: 'Server error' });
          }
};
