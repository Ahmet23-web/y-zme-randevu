import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: parsed.error.flatten() 
      }, { status: 400 });
    }

    const { identifier, password } = parsed.data;
    
    await connectDB();
    
    const user = await User.findOne({ 
      $or: [ 
        { email: identifier }, 
        { username: identifier } 
      ] 
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: "Kullanıcı bulunamadı." 
      }, { status: 400 });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ 
        error: "Şifre hatalı." 
      }, { status: 400 });
    }
    
    // Basit bir token oluştur (gerçek uygulamada JWT kullanılmalı)
    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

    return NextResponse.json({ 
      success: true,
      message: "Giriş başarılı",
      token,
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
  } catch (err: any) {
    console.error("Login API Hatası:", err);
    return NextResponse.json({ 
      error: err.message || JSON.stringify(err) || "Bir hata oluştu" 
    }, { status: 500 });
  }
} 