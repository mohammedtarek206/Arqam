import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  requirementsAr: string[];
  requirementsEn: string[];
  category: 'programming' | 'graphic' | 'languages' | 'networks' | 'ai' | 'business' | 'other';
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance';
  locationAr: string;
  locationEn: string;
  salary?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    titleAr: { type: String, required: true },
    titleEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    requirementsAr: { type: [String], default: [] },
    requirementsEn: { type: [String], default: [] },
    category: {
      type: String,
      enum: ['programming', 'graphic', 'languages', 'networks', 'ai', 'business', 'other'],
      default: 'other',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Freelance'],
      default: 'Full-time',
    },
    locationAr: { type: String, default: 'عن بعد' },
    locationEn: { type: String, default: 'Remote' },
    salary: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
