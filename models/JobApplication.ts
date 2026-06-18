import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  fullName: string;
  phone: string;
  email: string;
  college: string;
  studyYear: string;
  specialization: string;
  governorate: string;
  jobId?: mongoose.Types.ObjectId;
  jobTitle: string;
  cvUrl?: string; // URL path to the uploaded resume
  notes?: string;
  status: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    college: { type: String, required: true },
    studyYear: { type: String, required: true },
    specialization: { type: String, required: true },
    governorate: { type: String, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    jobTitle: { type: String, required: true },
    cvUrl: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'interview', 'accepted', 'rejected'],
      default: 'new',
    },
  },
  {
    timestamps: true,
    collection: 'job_applications',
  }
);

if (mongoose.models.JobApplication) {
  delete mongoose.models.JobApplication;
}

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
