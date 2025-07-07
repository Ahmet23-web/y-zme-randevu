import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Kullanıcıyı bul
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ 
        error: "Kullanıcı bulunamadı" 
      }, { status: 404 });
    }
    
    // Eğer zaten admin ise
    if (user.role === 'admin') {
      return NextResponse.json({ 
        error: "Admin kullanıcıları yükseltilemez" 
      }, { status: 400 });
    }
    
    // Kullanıcıyı eğitmen yap
    user.role = 'instructor';
    await user.save();
    
    return NextResponse.json({ 
      success: true,
      message: "Kullanıcı başarıyla eğitmen yapıldı",
      user: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username,
        phone: user.phone,
        age: user.age,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error("Kullanıcı yükseltme hatası:", error);
    return NextResponse.json({ 
      error: "Kullanıcı yükseltilirken hata oluştu",
      message: error.message 
    }, { status: 500 });
  }
} 