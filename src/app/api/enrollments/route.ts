import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Enrollment, Course, Schedule } from "@/lib/models";
import { enrollmentSchema } from "@/lib/validations";

// Kullanıcının kayıtlarını getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    
    if (!studentId) {
      return NextResponse.json(
        { error: "Öğrenci ID'si gerekli" },
        { status: 400 }
      );
    }

    await connectDB();
    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course')
      .populate('schedule')
      .sort({ enrollmentDate: -1 });
    
    return NextResponse.json({ enrollments });
  } catch (error: any) {
    console.error("Kayıtlar getirme hatası:", error);
    return NextResponse.json(
      { error: "Kayıtlar getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni kayıt oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enrollmentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Kurs ve program bilgilerini al
    const course = await Course.findById(parsed.data.course);
    const schedule = await Schedule.findById(parsed.data.schedule);
    
    if (!course || !schedule) {
      return NextResponse.json(
        { error: "Kurs veya program bulunamadı" },
        { status: 404 }
      );
    }

    // Aynı kursa zaten kayıtlı mı kontrol et
    const existingEnrollment = await Enrollment.findOne({
      student: body.studentId,
      course: parsed.data.course,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Bu kursa zaten kayıtlısınız" },
        { status: 400 }
      );
    }

    // Program kapasitesini kontrol et
    const currentEnrollments = await Enrollment.countDocuments({
      schedule: parsed.data.schedule,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (currentEnrollments >= course.maxStudents) {
      return NextResponse.json(
        { error: "Bu program dolu" },
        { status: 400 }
      );
    }

    const enrollment = new Enrollment({
      student: body.studentId,
      course: parsed.data.course,
      schedule: parsed.data.schedule,
      paymentAmount: course.price,
      notes: parsed.data.notes
    });
    
    await enrollment.save();
    
    return NextResponse.json({ 
      success: true, 
      enrollment: await enrollment.populate(['course', 'schedule'])
    });
  } catch (error: any) {
    console.error("Kayıt oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Kayıt oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 