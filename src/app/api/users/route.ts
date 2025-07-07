import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    
    // Şifreyi hariç tutarak kullanıcıları getir
    const users = await User.find({}, { 
      password: 0 // Şifreyi döndürme
    }).sort({ createdAt: -1 }); // En yeni kayıtlar önce
    
    return NextResponse.json({ 
      success: true,
      users,
      count: users.length
    });
  } catch (error: any) {
    console.error("Kullanıcılar getirme hatası:", error);
    return NextResponse.json({ 
      error: "Kullanıcılar getirilirken hata oluştu",
      message: error.message 
    }, { status: 500 });
  }
} 