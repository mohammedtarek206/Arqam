import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail?: string;
    track: mongoose.Types.ObjectId;
    instructor: mongoose.Types.ObjectId;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
    isFree: boolean;
    duration?: string;
    modulesCount?: number;
    benefits?: string[];
    certificationText?: string;
    certificationImage?: string;
    outline?: string;
    whatYouWillLearn?: string;
    audienceProfile?: string;
    prerequisites?: string;
    passingGrade: number; // For certificate
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String },
        track: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        price: { type: Number, default: 0 },
        isFree: { type: Boolean, default: false },
        duration: { type: String, default: '' },
        modulesCount: { type: Number, default: 0 },
        benefits: { type: [String], default: [] },
        certificationText: { type: String, default: '' },
        certificationImage: { type: String, default: '' },
        outline: { type: String, default: '' },
        whatYouWillLearn: { type: String, default: '' },
        audienceProfile: { type: String, default: '' },
        prerequisites: { type: String, default: '' },
        passingGrade: { type: Number, default: 70 },
        isActive: { type: Boolean, default: false }, // Requires admin approval or set by instructor
    },
    {
        timestamps: true,
    }
);

// Clear the model from cache to ensure schema updates are applied in development
if (mongoose.models.Course) {
    delete mongoose.models.Course;
}

export default mongoose.model<ICourse>('Course', CourseSchema);
