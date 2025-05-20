import mongoose from 'mongoose';

const BankAccountSchema = new mongoose.Schema({
          firstName: { type: String, required: true },
          surname: { type: String, required: true },
          email: { type: String, required: true, unique: true },
          phoneNumber: { type: String, required: true },
          dateOfBirth: { type: Date, required: true },
          accountNumber: { type: String, required: true, unique: true, length: 10 }
}, { timestamps: true });

const BankAccount = mongoose.model('BankAccount', BankAccountSchema);
export default BankAccount;