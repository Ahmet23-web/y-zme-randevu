import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { userRegistrationSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Gelen veri:', body);
    
    const parsed = userRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      console.log('Validation hatası:', parsed.error.flatten());
      return NextResponse.json({ 
        error: parsed.error.flatten(),
        message: "Form verilerinde hata var. Lütfen tüm alanları doğru şekilde doldurun."
      }, { status: 400 });
    }
    
    await connectDB();
    
    // Aynı kullanıcı adı veya e-posta ile kayıt var mı kontrol et
    const exists = await User.findOne({ 
      $or: [ 
        { email: parsed.data.email }, 
        { username: parsed.data.username } 
      ] 
    });
    
    if (exists) {
      return NextResponse.json({ 
        error: { message: "Bu e-posta veya kullanıcı adı zaten kayıtlı." } 
      }, { status: 400 });
    }
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    
    // Acil durum kişisi bilgilerini kontrol et
    const emergencyContact = parsed.data.emergencyContact && 
      parsed.data.emergencyContact.name && 
      parsed.data.emergencyContact.phone && 
      parsed.data.emergencyContact.relationship 
      ? parsed.data.emergencyContact 
      : undefined;
    
    const user = new User({ 
      ...parsed.data, 
      password: hashedPassword,
      role: 'student',
      emergencyContact: emergencyContact
    });
    
    await user.save();
    console.log('Kaydedilen kullanıcı:', user);
    
    return NextResponse.json({ 
      success: true,
      message: "Kayıt başarılı! En kısa sürede sizinle iletişime geçeceğiz.",
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error("API Hatası:", err);
    return NextResponse.json({ 
      error: err.message || JSON.stringify(err) || "Bir hata oluştu",
      message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin."
    }, { status: 500 });
  }
} 