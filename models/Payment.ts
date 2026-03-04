import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    track: mongoose.Types.ObjectId;
    amount: number;
    method: 'Vodafone Cash' | 'InstaPay' | 'Visa';
    status: 'pending' | 'approved' | 'rejected';
    proofImage: string; // Base64 or URL
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        track: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
        amount: { type: Number, required: true },
        method: {
            type: String,
            enum: ['Vodafone Cash', 'InstaPay', 'Visa'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        proofImage: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
