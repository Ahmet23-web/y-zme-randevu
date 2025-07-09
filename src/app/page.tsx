'use client';

import React, { useState, useTransition, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  fullName?: string;
  phone?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: User;
  schedule: string;
  price: number;
  maxStudents: number;
  currentStudents: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface Enrollment {
  _id: string;
  user: User;
  course: Course;
  enrollmentDate: string;
  status: string;
}

// Carousel component'i
const ImageCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadError, setImageLoadError] = useState<{[key: number]: boolean}>({});
  
  const images = [
    {
      src: '/swimming-1.jpg',
      alt: 'Çocuk yüzme dersi',
      title: 'Profesyonel Yüzme Eğitimi',
      description: 'Uzman eğitmenlerimizle güvenli yüzme öğrenin'
    },
    {
      src: '/swimming-2.jpg', 
      alt: 'Havuzda çocuk aktivitesi',
      title: 'Güvenli Öğrenme Ortamı',
      description: 'Temiz ve güvenli havuzlarımızda yüzme keyfi'
    },
    {
      src: '/swimming-3.jpg',
      alt: 'Çocukların havuzda eğlencesi',
      title: 'Eğlenceli Yüzme Dersleri',
      description: 'Oyun odaklı yüzme eğitimi ile öğrenin'
    },
    {
      src: '/swimming-4.jpg',
      alt: 'Çocuk yüzme havuzu',
      title: 'Modern Tesisler',
      description: 'En son teknoloji ile donatılmış tesislerimiz'
    },
    {
      src: '/swimming-5.jpg',
      alt: 'Yetişkin yüzme dersi',
      title: 'Yetişkin Yüzme Kursları',
      description: 'Her yaşta yüzme öğrenebilirsiniz'
    },
    {
      src: '/swimming-6.jpg',
      alt: 'Grup yüzme antrenmanı',
      title: 'Grup Antrenmanları',
      description: 'Arkadaşlarınızla birlikte yüzme keyfi'
    },
    {
      src: '/swimming-7.jpg',
      alt: 'Su sporları aktiviteleri',
      title: 'Su Sporları',
      description: 'Yüzmenin ötesinde su sporları deneyimi'
    },
    {
      src: '/swimming-8.jpg',
      alt: 'Çocuk havuz eğlencesi',
      title: 'Çocuk Aktiviteleri',
      description: 'Çocuklar için özel tasarlanmış etkinlikler'
    }
  ];

  // Otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageError = (index: number) => {
    setImageLoadError(prev => ({...prev, [index]: true}));
  };

  return (
    <div className="relative w-full h-[600px] mb-16 rounded-3xl overflow-hidden shadow-2xl">
      {/* Resimler */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {!imageLoadError[index] ? (
              <>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                  style={{ 
                    filter: 'brightness(0.8)',
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-20 h-20 mx-auto mb-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-lg">Yüzme Akademisi</p>
                </div>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-6">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                  {image.title}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8 font-light">
                  {image.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Kurslara Katıl
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                    Daha Fazla Bilgi
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm z-40 group"
        aria-label="Önceki resim"
      >
        <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm z-40 group"
        aria-label="Sonraki resim"
      >
        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`${index + 1}. resme git`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Güvenli Eğitim",
      description: "Sertifikalı eğitmenlerimiz ile güvenli öğrenme ortamı"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      title: "Kişisel Eğitim",
      description: "Her yaş grubuna özel bireysel ve grup dersleri"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      title: "Modern Tesis",
      description: "En son teknoloji ile donatılmış havuz ve ekipmanlar"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: "Sertifikalı Program",
      description: "Uluslararası standartlarda sertifikasyon programları"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Neden Bizi Seçmelisiniz?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profesyonel kadromuz ve modern tesislerimizle en kaliteli yüzme eğitimini sunuyoruz
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
            >
              <div className="text-blue-600 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection: React.FC = () => {
  const stats = [
    { number: "500+", label: "Mutlu Öğrenci" },
    { number: "15+", label: "Deneyimli Eğitmen" },
    { number: "8", label: "Farklı Seviye" },
    { number: "5", label: "Yıllık Deneyim" }
  ];

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-lg text-blue-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section Component
const ContactSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            İletişim
          </h2>
          <p className="text-xl text-gray-600">
            Bizimle iletişime geçin ve yüzme serüveninize başlayın
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
            <div className="text-blue-600 mb-4 flex justify-center">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adres</h3>
            <p className="text-gray-600">
              Atatürk Mahallesi<br />
              Yüzme Havuzu Sokağı No:1<br />
              Elazığ, Türkiye
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
            <div className="text-blue-600 mb-4 flex justify-center">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Telefon</h3>
            <p className="text-gray-600">
              +90 424 123 45 67<br />
              +90 535 123 45 67
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
            <div className="text-blue-600 mb-4 flex justify-center">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">E-posta</h3>
            <p className="text-gray-600">
              info@yuzmekursu.com<br />
              kayit@yuzmekursu.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [showCourses, setShowCourses] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    instructors: 0,
    admins: 0
  });

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Kurslar alınamadı:', err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/enrollments');
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Kayıtlar alınamadı:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        
        const totalUsers = data.users.length;
        const students = data.users.filter((u: User) => u.role === 'student').length;
        const instructors = data.users.filter((u: User) => u.role === 'instructor').length;
        const admins = data.users.filter((u: User) => u.role === 'admin').length;
        
        setStats({ totalUsers, students, instructors, admins });
      }
    } catch (error) {
      console.error('Kullanıcılar alınamadı:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
        setSelectedUser(null);
        alert('Kullanıcı başarıyla silindi');
      } else {
        const error = await response.json();
        alert(`Hata: ${error.message}`);
      }
    } catch (error) {
      console.error('Kullanıcı silinemedi:', error);
      alert('Kullanıcı silinemedi');
    }
  };

  const promoteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/promote`, {
        method: 'PUT',
      });

      if (response.ok) {
        await fetchUsers();
        const updatedUser = users.find(u => u._id === userId);
        if (updatedUser) {
          setSelectedUser({...updatedUser, role: 'instructor'});
        }
        alert('Kullanıcı başarıyla eğitmen olarak yükseltildi');
      } else {
        const error = await response.json();
        alert(`Hata: ${error.message}`);
      }
    } catch (error) {
      console.error('Kullanıcı yükseltilemedi:', error);
      alert('Kullanıcı yükseltilemedi');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">
                🏊‍♀️ Yüzme Akademisi
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => startTransition(() => {
                  setShowCourses(!showCourses);
                  if (!showCourses) fetchCourses();
                })}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Kurslar
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={() => startTransition(() => {
                    setShowEnrollments(!showEnrollments);
                    if (!showEnrollments) fetchEnrollments();
                  })}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Kayıtlarım
                </button>
              )}
              
              {isAdmin && (
                <button
                  onClick={() => startTransition(() => {
                    setShowAdminPanel(!showAdminPanel);
                    if (!showAdminPanel) fetchUsers();
                  })}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Admin Panel
                </button>
              )}
              
              <div className="text-sm text-gray-600">
                {isAuthenticated ? (
                  <span>Hoş geldin, <strong>{user?.username}</strong>!</span>
                ) : (
                  <span>Giriş yapmamışsınız</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <ImageCarousel />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Yüzme Akademisi</h3>
              <p className="text-gray-300 leading-relaxed">
                Profesyonel yüzme eğitimi ile hayallerinizi gerçeğe dönüştürün.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Hizmetler</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Çocuk Yüzme Kursları</li>
                <li>Yetişkin Eğitimleri</li>
                <li>Özel Dersler</li>
                <li>Yarışma Hazırlığı</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Seviyeler</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Başlangıç</li>
                <li>Orta Seviye</li>
                <li>İleri Seviye</li>
                <li>Profesyonel</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <div className="space-y-2 text-gray-300">
                <p>📍 Elazığ, Türkiye</p>
                <p>📞 +90 424 123 45 67</p>
                <p>✉️ info@yuzmekursu.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Yüzme Akademisi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Courses Modal */}
      {showCourses && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Kurslarımız</h2>
                <button
                  onClick={() => setShowCourses(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isPending ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Kurslar yükleniyor...</p>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-3">{course.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Eğitmen:</strong> {course.instructor.fullName || course.instructor.username}</p>
                        <p><strong>Program:</strong> {course.schedule}</p>
                        <p><strong>Seviye:</strong> {course.level}</p>
                        <p><strong>Fiyat:</strong> ₺{course.price}</p>
                        <p><strong>Kontenjan:</strong> {course.currentStudents}/{course.maxStudents}</p>
                      </div>
                      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                        Kayıt Ol
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  Henüz kurs bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enrollments Modal */}
      {showEnrollments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Kayıtlarım</h2>
                <button
                  onClick={() => setShowEnrollments(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isPending ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Kayıtlar yükleniyor...</p>
                </div>
              ) : enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{enrollment.course.title}</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Eğitmen:</strong> {enrollment.course.instructor.fullName || enrollment.course.instructor.username}</p>
                          <p><strong>Program:</strong> {enrollment.course.schedule}</p>
                          <p><strong>Seviye:</strong> {enrollment.course.level}</p>
                        </div>
                        <div>
                          <p><strong>Kayıt Tarihi:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString('tr-TR')}</p>
                          <p><strong>Durum:</strong> <span className="text-green-600 font-semibold">{enrollment.status}</span></p>
                          <p><strong>Fiyat:</strong> ₺{enrollment.course.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  Henüz kursa kayıt olmamışsınız.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.students}</div>
                  <div className="text-sm text-gray-600">Öğrenci</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.instructors}</div>
                  <div className="text-sm text-gray-600">Eğitmen</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
                  <div className="text-sm text-gray-600">Admin</div>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-gray-600 font-semibold">Kullanıcı Adı</th>
                      <th className="p-4 text-left text-gray-600 font-semibold">E-posta</th>
                      <th className="p-4 text-left text-gray-600 font-semibold">Rol</th>
                      <th className="p-4 text-left text-gray-600 font-semibold">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">{user.username}</td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'instructor' ? 'bg-purple-100 text-purple-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              Görüntüle
                            </button>
                            {user.role === 'student' && (
                              <button
                                onClick={() => promoteUser(user._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                              >
                                Yükselt
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Kullanıcı Detayları</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Kullanıcı Adı</label>
                <p className="text-gray-800">{selectedUser.username}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">E-posta</label>
                <p className="text-gray-800">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Rol</label>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                  selectedUser.role === 'instructor' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedUser.role === 'admin' ? 'Admin' : selectedUser.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'}
                </span>
              </div>
              {selectedUser.fullName && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Ad Soyad</label>
                  <p className="text-gray-800">{selectedUser.fullName}</p>
                </div>
              )}
              {selectedUser.phone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Telefon</label>
                  <p className="text-gray-800">{selectedUser.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
