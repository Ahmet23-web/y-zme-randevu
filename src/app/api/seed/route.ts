import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User, Course, Schedule, Pool } from "@/lib/models";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Mevcut verileri temizle
    await User.deleteMany({});
    await Course.deleteMany({});
    await Schedule.deleteMany({});
    await Pool.deleteMany({});

    // Örnek kullanıcılar oluştur
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    // Admin kullanıcısı
    const admin = new User({
      name: "Admin",
      surname: "Yönetici",
      email: "admin@yuze.com",
      phone: "05559999999",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      age: 30
    });

    await admin.save();
    
    // Eğitmen kullanıcıları
    const instructor1 = new User({
      name: "Nisanur",
      surname: "Dağ",
      email: "nisanur@yuze.com",
      phone: "05551234567",
      username: "nisanur_dag",
      password: hashedPassword,
      role: "instructor",
      age: 28
    });

    await instructor1.save();

    const instructor2 = new User({
      name: "Sıla",
      surname: "Çilingir",
      email: "sila@yuze.com",
      phone: "05557654321",
      username: "sila_cilingir",
      password: hashedPassword,
      role: "instructor",
      age: 26
    });

    await instructor2.save();

    // Örnek havuz oluştur
    const pool = new Pool({
      name: "Ana Havuz",
      description: "25 metre uzunluğunda, 6 şeritli olimpik havuz",
      length: 25,
      width: 12,
      depth: 2,
      temperature: 28,
      capacity: 50
    });

    await pool.save();

    // Örnek kurslar oluştur
    const courses = [
      {
        name: "Çocuk Yüzme Kursu (Başlangıç)",
        description: "6-12 yaş arası çocuklar için temel yüzme eğitimi. Su korkusunu yenme, temel yüzme teknikleri ve güvenlik kuralları öğretilir.",
        level: "beginner",
        ageGroup: "children",
        duration: 45,
        maxStudents: 8,
        price: 800,
        instructor: instructor1._id
      },
      {
        name: "Yetişkin Yüzme Kursu (Başlangıç)",
        description: "Yetişkinler için sıfırdan yüzme öğrenme. Su korkusunu yenme, temel yüzme stilleri ve güvenlik eğitimi.",
        level: "beginner",
        ageGroup: "adults",
        duration: 60,
        maxStudents: 6,
        price: 1000,
        instructor: instructor2._id
      },
      {
        name: "İleri Seviye Yüzme",
        description: "Temel yüzme bilgisi olanlar için ileri teknikler. Serbest, kurbağalama, sırtüstü ve kelebek stilleri.",
        level: "advanced",
        ageGroup: "all",
        duration: 90,
        maxStudents: 10,
        price: 1200,
        instructor: instructor1._id
      },
      {
        name: "Yüzme Performans Geliştirme",
        description: "Yüzme performansını artırmak isteyenler için özel program. Hız, dayanıklılık ve teknik geliştirme.",
        level: "intermediate",
        ageGroup: "adults",
        duration: 75,
        maxStudents: 8,
        price: 1100,
        instructor: instructor2._id
      }
    ];

    const savedCourses = [];
    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
      savedCourses.push(course);
    }

    // Örnek programlar oluştur
    const schedules = [
      {
        course: savedCourses[0]._id, // Çocuk kursu
        dayOfWeek: 1, // Pazartesi
        startTime: "16:00",
        endTime: "16:45",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31")
      },
      {
        course: savedCourses[0]._id, // Çocuk kursu
        dayOfWeek: 3, // Çarşamba
        startTime: "16:00",
        endTime: "16:45",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31")
      },
      {
        course: savedCourses[1]._id, // Yetişkin kursu
        dayOfWeek: 2, // Salı
        startTime: "19:00",
        endTime: "20:00",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31")
      },
      {
        course: savedCourses[1]._id, // Yetişkin kursu
        dayOfWeek: 4, // Perşembe
        startTime: "19:00",
        endTime: "20:00",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31")
      },
      {
        course: savedCourses[2]._id, // İleri seviye
        dayOfWeek: 5, // Cuma
        startTime: "18:00",
        endTime: "19:30",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31")
      },
      {
        course: savedCourses[3]._id, // Performans
        dayOfWeek: 6, // Cumartesi
        startTime: "10:00",
        endTime: "11:15",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31")
      }
    ];

    for (const scheduleData of schedules) {
      const schedule = new Schedule(scheduleData);
      await schedule.save();
    }

    return NextResponse.json({ 
      success: true, 
      message: "Örnek veriler başarıyla eklendi",
      data: {
        admin: admin._id,
        instructor1: instructor1._id,
        instructor2: instructor2._id,
        pool: pool._id,
        courses: savedCourses.length,
        schedules: schedules.length
      }
    });

  } catch (error: any) {
    console.error("Seed hatası:", error);
    return NextResponse.json({ 
      error: "Örnek veriler eklenirken bir hata oluştu" 
    }, { status: 500 });
  }
} 