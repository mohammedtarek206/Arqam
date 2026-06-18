import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainingRegistration extends Document {
  fullName: string;
  phone: string;
  email?: string;
  college: string;
  studyYear: string;
  governorate: string;
  notes?: string;
  courseName: string;
  courseId?: mongoose.Types.ObjectId;
  status: 'new' | 'contacted' | 'registered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const TrainingRegistrationSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    college: { type: String, required: true },
    studyYear: { type: String, required: true },
    governorate: { type: String, required: true },
    notes: { type: String },
    courseName: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'TrainingCourse' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'registered', 'cancelled'],
      default: 'new',
    },
  },
  {
    timestamps: true,
    collection: 'course_registrations',
  }
);

export default mongoose.models.TrainingRegistration || mongoose.model<ITrainingRegistration>('TrainingRegistration', TrainingRegistrationSchema);
