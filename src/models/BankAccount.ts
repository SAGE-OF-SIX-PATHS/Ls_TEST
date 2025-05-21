// src/models/BankAccount.ts
import mongoose from 'mongoose';

const BankAccountSchema = new mongoose.Schema({
          firstName: { type: String, required: true },
          surname: { type: String, required: true },
          email: { type: String, required: true, unique: true },
          accountNumber: { type: String, required: true, unique: true },
          phoneEncrypted: { type: String, required: true },
          phoneIV: { type: String, required: true },
          dobEncrypted: { type: String, required: true },
          dobIV: { type: String, required: true },
}, { timestamps: true });

const BankAccount = mongoose.model('BankAccount', BankAccountSchema);
export default BankAccount;
