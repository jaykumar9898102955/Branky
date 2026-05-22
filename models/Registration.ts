import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IRegistration extends Document {
  studentName: string
  parentName: string
  phone: string
  email: string
  age: string
  program: string
  city: string
  source: string
  message?: string
  status: 'new' | 'reviewed' | 'confirmed' | 'waitlist'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<IRegistration>({
  studentName: { type: String, required: true, trim: true },
  parentName:  { type: String, required: true, trim: true },
  phone:       { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  age:         { type: String, required: true },
  program:     { type: String, required: true },
  city:        { type: String, required: true },
  source:      { type: String, default: 'Website' },
  message:     { type: String, default: '' },
  status:      { type: String, enum: ['new','reviewed','confirmed','waitlist'], default: 'new' },
  notes:       { type: String, default: '' },
}, { timestamps: true })

const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', schema)

export default Registration
