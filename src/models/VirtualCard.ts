// src/models/VirtualCard.ts
import mongoose from 'mongoose';

const VirtualCardSchema = new mongoose.Schema({
          cardNumberEncrypted: { type: String, required: true },
          cardIV: { type: String, required: true },
          cvvEncrypted: { type: String, required: true },
          cvvIV: { type: String, required: true },
          expiryEncrypted: { type: String, required: true },
          expiryIV: { type: String, required: true },
          accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true }
}, { timestamps: true });

const VirtualCard = mongoose.model('VirtualCard', VirtualCardSchema);
export default VirtualCard;
