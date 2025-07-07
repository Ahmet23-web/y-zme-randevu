import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Kullanıcıyı bul ve sil
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({ 
        error: "Kullanıcı bulunamadı" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Kullanıcı başarıyla silindi"
    });
  } catch (error: any) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json({ 
      error: "Kullanıcı silinirken hata oluştu",
      message: error.message 
    }, { status: 500 });
  }
} 