# Yüze Yüzme Kursu Web Sitesi

Modern ve kullanıcı dostu yüzme kursu yönetim sistemi. Next.js 15, TypeScript, Tailwind CSS ve MongoDB kullanılarak geliştirilmiştir.

## 🏊‍♂️ Özellikler

### Kullanıcı Yönetimi
- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Rol tabanlı yetkilendirme (Öğrenci, Eğitmen, Admin)
- ✅ Güvenli şifre hashleme (bcrypt)
- ✅ Acil durum kişisi bilgileri
- ✅ Sağlık bilgileri takibi

### Kurs Yönetimi
- ✅ Kurs oluşturma ve düzenleme
- ✅ Seviye bazlı kurslar (Başlangıç, Orta, İleri)
- ✅ Yaş grubu filtreleme (Çocuk, Yetişkin, Tüm Yaşlar)
- ✅ Eğitmen atama
- ✅ Kapasite yönetimi

### Program Yönetimi
- ✅ Haftalık ders programları
- ✅ Esnek saat seçenekleri
- ✅ Tarih aralığı belirleme
- ✅ Aktif/pasif program durumu

### Kayıt Sistemi
- ✅ Online kurs kayıtları
- ✅ Ödeme durumu takibi
- ✅ Kayıt durumu yönetimi
- ✅ Çakışma kontrolü

### Havuz Yönetimi
- ✅ Havuz bilgileri
- ✅ Kapasite ve boyut bilgileri
- ✅ Sıcaklık takibi
- ✅ Bakım programları

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Authentication**: bcryptjs
- **Development**: ESLint, Turbopack

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- MongoDB veritabanı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd yuze-randevu
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın**
`.env.local` dosyası oluşturun:
```env
MONGODB_URI=mongodb://localhost:27017/yuze
# veya MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yuze
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Örnek verileri ekleyin** (İsteğe bağlı)
```bash
curl -X POST http://localhost:3000/api/seed
```

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── courses/           # Kurs yönetimi
│   │   ├── enrollments/       # Kayıt yönetimi
│   │   ├── login/             # Giriş API
│   │   ├── register/          # Kayıt API
│   │   └── seed/              # Örnek veriler
│   ├── globals.css            # Global stiller
│   ├── layout.tsx             # Ana layout
│   └── page.tsx               # Ana sayfa
├── lib/
│   ├── db.ts                  # MongoDB bağlantısı
│   ├── models.ts              # Mongoose modelleri
│   └── validations.ts         # Zod şemaları
└── components/                # React bileşenleri (gelecek)
```

## 🗄️ Veritabanı Modelleri

### User (Kullanıcı)
- Temel bilgiler (ad, soyad, email, telefon)
- Rol (öğrenci, eğitmen, admin)
- Acil durum kişisi bilgileri
- Sağlık bilgileri

### Course (Kurs)
- Kurs adı ve açıklaması
- Seviye ve yaş grubu
- Süre ve kapasite
- Fiyat ve eğitmen

### Schedule (Program)
- Kurs referansı
- Gün ve saat bilgileri
- Tarih aralığı
- Aktiflik durumu

### Enrollment (Kayıt)
- Öğrenci ve kurs referansları
- Kayıt durumu
- Ödeme bilgileri
- Notlar

### Pool (Havuz)
- Havuz bilgileri
- Boyut ve kapasite
- Sıcaklık
- Bakım programı

## 🔐 Güvenlik

- **Şifre Hashleme**: bcryptjs ile güvenli şifre saklama
- **Input Validation**: Zod ile kapsamlı veri doğrulama
- **SQL Injection Koruması**: Mongoose ODM kullanımı
- **XSS Koruması**: Next.js built-in korumaları

## 📱 Responsive Tasarım

- Mobile-first yaklaşım
- Tailwind CSS ile responsive grid
- Modern ve kullanıcı dostu arayüz
- Accessibility standartlarına uygun

## 🚀 Deployment

### Vercel (Önerilen)
1. GitHub'a projeyi push edin
2. Vercel'de yeni proje oluşturun
3. MongoDB Atlas bağlantısını ekleyin
4. Environment variables'ları ayarlayın

### Diğer Platformlar
- Netlify
- Railway
- Heroku
- AWS

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Model tanımlayın (`src/lib/models.ts`)
2. Validation şeması ekleyin (`src/lib/validations.ts`)
3. API route oluşturun (`src/app/api/`)
4. Frontend bileşenini geliştirin

### Test Etme
```bash
# Linting
npm run lint

# Build test
npm run build

# Production test
npm start
```

## 📞 İletişim

- **Email**: info@yuze.com
- **Telefon**: 0 (555) 123 45 67
- **Adres**: İstanbul, Türkiye

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Temel kullanıcı yönetimi
- ✅ Kurs ve program yönetimi
- ✅ Kayıt sistemi
- ✅ Modern UI/UX tasarımı
- ✅ MongoDB entegrasyonu
- ✅ Responsive tasarım

---

**Yüze Yüzme Kursu** - Sağlıklı, güvenli ve eğlenceli yüzme eğitimi için modern çözümler.
