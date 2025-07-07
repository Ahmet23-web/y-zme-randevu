import mongoose from "mongoose";

// Kullanıcı Modeli
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  age: { type: Number, required: true },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalInfo: {
    hasConditions: { type: Boolean, default: false },
    conditions: [String],
    allergies: [String],
    medications: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Kurs Modeli
export const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  ageGroup: { type: String, enum: ['children', 'adults', 'all'], required: true },
  duration: { type: Number, required: true }, // dakika cinsinden
  maxStudents: { type: Number, required: true },
  price: { type: Number, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ders Programı Modeli
export const ScheduleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dayOfWeek: { type: Number, required: true }, // 0-6 (Pazar-Cumartesi)
  startTime: { type: String, required: true }, // "14:30" formatında
  endTime: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Kayıt Modeli
export const EnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  enrollmentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentAmount: { type: Number, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ders Kaydı Modeli
export const LessonSchema = new mongoose.Schema({
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  date: { type: Date, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// Havuz Modeli
export const PoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  length: { type: Number, required: true }, // metre cinsinden
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  temperature: { type: Number, required: true }, // Celsius
  capacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  maintenanceSchedule: String,
  createdAt: { type: Date, default: Date.now }
});

// Model export'ları
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
export const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
export const Pool = mongoose.models.Pool || mongoose.model('Pool', PoolSchema); 