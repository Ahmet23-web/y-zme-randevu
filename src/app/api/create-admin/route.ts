import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Admin kullanıcısı varsa çık
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin kullanıcısı zaten mevcut",
        admin: {
          name: existingAdmin.name,
          surname: existingAdmin.surname,
          username: existingAdmin.username,
          role: existingAdmin.role
        }
      });
    }

    // Yeni admin oluştur
    const hashedPassword = await bcrypt.hash("123456", 10);
    
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

    return NextResponse.json({ 
      success: true,
      message: "Admin kullanıcısı başarıyla oluşturuldu",
      admin: {
        name: admin.name,
        surname: admin.surname,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error("Admin oluşturma hatası:", error);
    return NextResponse.json({ 
      error: "Admin oluşturulurken hata oluştu",
      message: error.message 
    }, { status: 500 });
  }
} 