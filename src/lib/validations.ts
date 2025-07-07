import { z } from "zod";

// Kullanıcı kayıt şeması
export const userRegistrationSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı").trim(),
  surname: z.string().min(2, "Soyisim en az 2 karakter olmalı").trim(),
  email: z.string().email("Geçerli bir e-posta girin").trim(),
  phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalı").trim(),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı").trim(),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  age: z.number().min(3, "Yaş en az 3 olmalı").max(100, "Yaş en fazla 100 olmalı"),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional()
  }).optional(),
  medicalInfo: z.object({
    hasConditions: z.boolean().default(false),
    conditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional()
  }).optional()
});

// Giriş şeması
export const loginSchema = z.object({
  identifier: z.string().min(3, "Kullanıcı adı/e-posta en az 3 karakter olmalı"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı")
});

// Kurs oluşturma şeması
export const courseSchema = z.object({
  name: z.string().min(3, "Kurs adı en az 3 karakter olmalı"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  ageGroup: z.enum(["children", "adults", "all"]),
  duration: z.number().min(30, "Süre en az 30 dakika olmalı").max(180, "Süre en fazla 180 dakika olmalı"),
  maxStudents: z.number().min(1, "Maksimum öğrenci sayısı en az 1 olmalı").max(20, "Maksimum öğrenci sayısı en fazla 20 olmalı"),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  instructor: z.string().optional()
});

// Program oluşturma şeması
export const scheduleSchema = z.object({
  course: z.string().min(1, "Kurs seçimi zorunlu"),
  dayOfWeek: z.number().min(0, "Gün 0-6 arasında olmalı").max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Geçerli saat formatı girin (HH:MM)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Geçerli saat formatı girin (HH:MM)"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
});

// Kayıt şeması
export const enrollmentSchema = z.object({
  course: z.string().min(1, "Kurs seçimi zorunlu"),
  schedule: z.string().min(1, "Program seçimi zorunlu"),
  notes: z.string().optional()
});

// Havuz şeması
export const poolSchema = z.object({
  name: z.string().min(2, "Havuz adı en az 2 karakter olmalı"),
  description: z.string().optional(),
  length: z.number().min(10, "Uzunluk en az 10 metre olmalı"),
  width: z.number().min(5, "Genişlik en az 5 metre olmalı"),
  depth: z.number().min(0.5, "Derinlik en az 0.5 metre olmalı"),
  temperature: z.number().min(20, "Sıcaklık en az 20°C olmalı").max(32, "Sıcaklık en fazla 32°C olmalı"),
  capacity: z.number().min(1, "Kapasite en az 1 olmalı")
}); 