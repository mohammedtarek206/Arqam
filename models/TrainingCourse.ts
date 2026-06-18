import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainingCourse extends Document {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  thumbnail?: string;
  duration: string;
  studyMode: 'Online' | 'Offline' | 'Both';
  category: 'programming' | 'graphic' | 'languages' | 'networks' | 'ai' | 'business';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingCourseSchema: Schema = new Schema(
  {
    titleAr: { type: String, required: true },
    titleEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: String, required: true },
    studyMode: { type: String, enum: ['Online', 'Offline', 'Both'], default: 'Offline' },
    category: {
      type: String,
      enum: ['programming', 'graphic', 'languages', 'networks', 'ai', 'business'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TrainingCourse || mongoose.model<ITrainingCourse>('TrainingCourse', TrainingCourseSchema);
