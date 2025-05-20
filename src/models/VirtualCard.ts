import mongoose, { Schema, Document } from 'mongoose';

export interface IVirtualCard extends Document {
          cardNumber: string;
          cvv: string;
          expiryDate: string;
          accountId: mongoose.Types.ObjectId;
}

const VirtualCardSchema: Schema = new Schema({
          cardNumber: { type: String, required: true, unique: true },
          cvv: { type: String, required: true },
          expiryDate: { type: String, required: true },
          accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true }
});

const VirtualCard = mongoose.model<IVirtualCard>('VirtualCard', VirtualCardSchema);
export default VirtualCard;
