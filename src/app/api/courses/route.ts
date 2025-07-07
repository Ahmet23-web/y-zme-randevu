import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/lib/models";
import { courseSchema } from "@/lib/validations";

// Tüm kursları getir
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({ isActive: true })
      .populate('instructor', 'name surname')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Kurslar getirme hatası:", error);
    return NextResponse.json(
      { error: "Kurslarrs getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni kurs oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    
    const course = new Course({
      ...parsed.data,
      instructor: parsed.data.instructor || "65f1234567890abcdef12345" // Geçici instructor ID
    });
    
    await course.save();
    
    return NextResponse.json({ 
      success: true, 
      course: await course.populate('instructor', 'name surname')
    });
  } catch (error: any) {
    console.error("Kurs oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Kurs oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
} 