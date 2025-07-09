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

// Navigation Menu Items
const navigationItems = [
  { id: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { id: 'about', label: 'Hakkımızda', icon: 'ℹ️' },
  { id: 'courses', label: 'Kurslar', icon: '🏊‍♀️' },
  { id: 'services', label: 'Hizmetler', icon: '🎯' },
  { id: 'contact', label: 'İletişim', icon: '📞' }
];

// Course Categories
const courseCategories = [
  {
    id: 'children',
    title: 'Çocuk Kursları',
    description: '6-14 yaş arası çocuklar için özel tasarlanmış kurslar',
    icon: '👶',
    courses: [
      {
        name: 'Çocuk Başlangıç',
        instructor: 'Sıla Çilingir',
        level: 'Acemi',
        duration: '45 dk',
        price: 800,
        description: 'Su korkusunu yenme ve temel yüzme teknikleri'
      },
      {
        name: 'Çocuk İleri Seviye',
        instructor: 'Nisanur Dağ',
        level: 'İleri',
        duration: '60 dk',
        price: 1000,
        description: 'Tüm yüzme stilleri ve teknik geliştirme'
      }
    ]
  },
  {
    id: 'adult',
    title: 'Yetişkin Kursları',
    description: '18+ yaş grubu için profesyonel yüzme eğitimi',
    icon: '🧑‍🦳',
    courses: [
      {
        name: 'Yetişkin Başlangıç',
        instructor: 'Sıla Çilingir',
        level: 'Acemi',
        duration: '60 dk',
        price: 1200,
        description: 'Sıfırdan yüzme öğrenme programı'
      },
      {
        name: 'Yetişkin İleri',
        instructor: 'Nisanur Dağ',
        level: 'İleri',
        duration: '75 dk',
        price: 1500,
        description: 'Teknik geliştirme ve performans artırma'
      }
    ]
  },
  {
    id: 'professional',
    title: 'Profesyonel Kursları',
    description: 'Yarışma ve profesyonel antrenman programları',
    icon: '🏆',
    courses: [
      {
        name: 'Yarışma Hazırlık',
        instructor: 'Nisanur Dağ',
        level: 'Profesyonel',
        duration: '90 dk',
        price: 2000,
        description: 'Yarışma teknikleri ve kondisyon geliştirme'
      },
      {
        name: 'Antrenör Yetiştirme',
        instructor: 'Sıla Çilingir',
        level: 'Profesyonel',
        duration: '120 dk',
        price: 2500,
        description: 'Yüzme antrenörlüğü sertifika programı'
      }
    ]
  }
];

// Services Data
const services = [
  {
    title: 'Bireysel Dersler',
    description: 'Kişisel ihtiyaçlarınıza özel birebir eğitim',
    icon: '👤',
    features: ['Özel program', 'Hızlı gelişim', 'Esnek saatler']
  },
  {
    title: 'Grup Dersleri',
    description: 'Sosyal ortamda arkadaşlarınızla birlikte öğrenin',
    icon: '👥',
    features: ['Sosyal aktivite', 'Uygun fiyat', 'Motivasyon']
  },
  {
    title: 'Su Aerobiği',
    description: 'Suda fitness ve egzersiz programları',
    icon: '💪',
    features: ['Kardio antrenman', 'Kas geliştirme', 'Rehabilitasyon']
  },
  {
    title: 'Yarışma Hazırlığı',
    description: 'Profesyonel yarışmalara özel hazırlık',
    icon: '🥇',
    features: ['Teknik analiz', 'Kondisyon', 'Mental hazırlık']
  }
];

// Carousel component'i
const ImageCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadError, setImageLoadError] = useState<{[key: number]: boolean}>({});
  
  const images = [
    {
      src: '/swimming-1.jpg',
      alt: 'Çocuk yüzme dersi',
      title: 'Ata Yüzme Akademisi',
      description: 'Profesyonel eğitmenlerimizle güvenli yüzme öğrenin'
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
                  <p className="text-lg">Ata Yüzme Akademisi</p>
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

export default function Home() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    phone: '',
    age: ''
  });
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Giriş başarılı!');
        setShowLoginModal(false);
        setLoginData({ identifier: '', password: '' });
        // Reload the page to update auth context
        window.location.reload();
      } else {
        alert(`Giriş hatası: ${data.message}`);
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Giriş sırasında bir hata oluştu');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...registerData,
        age: parseInt(registerData.age) || 0
      };
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setShowRegisterModal(false);
        setRegisterData({
          username: '',
          email: '',
          password: '',
          name: '',
          surname: '',
          phone: '',
          age: ''
        });
        setShowLoginModal(true);
      } else {
        alert(`Kayıt hatası: ${data.message}`);
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında bir hata oluştu');
    }
  };

  const handleLogout = () => {
    // Clear any local storage or cookies if used
    localStorage.removeItem('authToken');
    alert('Çıkış yapıldı!');
    window.location.reload();
  };

  // Render different sections based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return (
          <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Hakkımızda
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                     Ata Yüzme Akademisi olarak, 2019 yılından bu yana Elazığ&apos;da kaliteli yüzme eğitimi sunuyoruz.
                </p>
              </div>
              
                             <div className="space-y-12">
                 {/* Misyon */}
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                   <div>
                     <h3 className="text-2xl font-bold text-gray-800 mb-6">Misyonumuz</h3>
                     <p className="text-gray-600 mb-6 leading-relaxed">
                       Her yaştan öğrencimize güvenli, eğlenceli ve profesyonel yüzme eğitimi sunarak, 
                       su sporları sevgisini aşılamak ve toplumun yüzme bilinci kazanmasına katkıda bulunmak.
                     </p>
                     <p className="text-gray-600 leading-relaxed">
                       Uzman eğitmen kadromuz ve modern tesislerimizle, öğrencilerimizin hem fiziksel 
                       hem de mental gelişimine destek oluyoruz.
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                       <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                       <div className="text-gray-600">Mezun Öğrenci</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                       <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                       <div className="text-gray-600">Yıl Deneyim</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                       <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                       <div className="text-gray-600">Uzman Eğitmen</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                       <div className="text-3xl font-bold text-blue-600 mb-2">%100</div>
                       <div className="text-gray-600">Memnuniyet</div>
                     </div>
                   </div>
                 </div>

                 {/* Eğitmenlerimiz */}
                 <div>
                   <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Uzman Eğitmenlerimiz</h3>
                   <div className="grid md:grid-cols-2 gap-8">
                     {/* Nisanur Dağ */}
                     <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                       <div className="text-center mb-6">
                         <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-2xl">👩‍🏫</span>
                         </div>
                         <h4 className="text-xl font-bold text-gray-800 mb-2">Nisanur Dağ</h4>
                         <p className="text-blue-600 font-semibold">İleri Seviye & Yarışma Uzmanı</p>
                       </div>
                       <div className="space-y-3 text-gray-600">
                         <p className="leading-relaxed">
                           <strong className="text-gray-800">Eğitim:</strong> Fırat Üniversitesi Beden Eğitimi ve Spor Yüksekokulu mezunu
                         </p>
                         <p className="leading-relaxed">
                           <strong className="text-gray-800">Deneyim:</strong> Çorum&apos;da 5 yıl yüzme eğitmenliği yaparak birçok öğrencisinin başarılı dereceler kazanmasını sağladı
                         </p>
                         <p className="leading-relaxed">
                           <strong className="text-gray-800">Uzmanlık:</strong> İleri seviye teknikleri, yarışma hazırlığı ve performans geliştirme
                         </p>
                       </div>
                     </div>

                     {/* Sıla Çilingir */}
                     <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                       <div className="text-center mb-6">
                         <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-2xl">👩‍🏫</span>
                         </div>
                         <h4 className="text-xl font-bold text-gray-800 mb-2">Sıla Çilingir</h4>
                         <p className="text-purple-600 font-semibold">Başlangıç & Çocuk Eğitimi Uzmanı</p>
                       </div>
                       <div className="space-y-3 text-gray-600">
                         <p className="leading-relaxed">
                           <strong className="text-gray-800">Eğitim:</strong> Fırat Üniversitesi Beden Eğitimi ve Spor Yüksekokulu mezunu
                         </p>
                         <p className="leading-relaxed">
                           <strong className="text-gray-800">Deneyim:</strong> Elazığ&apos;da 10 sene boyunca başarılı yüzme eğitimleri vererek yüzlerce öğrenciyi yetiştirdi
                         </p>
                         <p className="leading-relaxed">
                           <strong className="text-gray-800">Uzmanlık:</strong> Başlangıç seviye eğitimi, çocuk yüzme programları ve temel teknik öğretimi
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </section>
        );

      case 'courses':
        return (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Kurslarımız
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Her yaş grubu ve seviye için özel tasarlanmış kurslarımızla yüzme öğrenin
                </p>
              </div>

              <div className="space-y-16">
                {courseCategories.map((category) => (
                  <div key={category.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8">
                    <div className="text-center mb-12">
                      <div className="text-6xl mb-4">{category.icon}</div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">{category.title}</h3>
                      <p className="text-lg text-gray-600">{category.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {category.courses.map((course, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className="flex justify-between items-start mb-6">
                            <h4 className="text-xl font-bold text-gray-800">{course.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              course.level === 'Acemi' ? 'bg-green-100 text-green-800' :
                              course.level === 'İleri' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {course.level}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-6">{course.description}</p>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                              <span className="text-gray-600">👩‍🏫 Eğitmen:</span>
                              <span className="font-semibold text-gray-800">{course.instructor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">⏱️ Süre:</span>
                              <span className="font-semibold text-gray-800">{course.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">💰 Fiyat:</span>
                              <span className="font-semibold text-green-600">₺{course.price}</span>
                            </div>
                          </div>

                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-300">
                            Kayıt Ol
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Hizmetlerimiz
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Size en uygun yüzme programını seçin ve hedeflerinize ulaşın
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                    <div className="text-4xl mb-6">{service.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center justify-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300">
                      Detaylı Bilgi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
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
                    info@atayuzmekursu.com<br />
                    kayit@atayuzmekursu.com
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <>
            {/* Hero Carousel */}
            <ImageCarousel />

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    Neden Ata Yüzme Akademisi?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Profesyonel kadromuz ve modern tesislerimizle en kaliteli yüzme eğitimini sunuyoruz
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
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
                  ].map((feature, index) => (
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

            {/* Stats Section */}
            <section className="py-20 bg-blue-600 text-white">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  {[
                    { number: "500+", label: "Mutlu Öğrenci" },
                    { number: "2", label: "Uzman Eğitmen" },
                    { number: "8", label: "Farklı Seviye" },
                    { number: "5", label: "Yıllık Deneyim" }
                  ].map((stat, index) => (
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 
                onClick={() => setActiveSection('home')}
                className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
              >
                🏊‍♀️ Ata Yüzme Akademisi
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🔑 Giriş Yap
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    📝 Kayıt Ol
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => startTransition(() => {
                      fetchEnrollments();
                    })}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    📋 Kayıtlarım
                  </button>
                  
                  {isAdmin && (
                    <button
                      onClick={() => startTransition(() => {
                        fetchUsers();
                      })}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      ⚙️ Admin Panel
                    </button>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    Hoş geldin, <strong>{user?.username}</strong>!
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🚪 Çıkış
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {renderSection()}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Ata Yüzme Akademisi</h3>
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
                <li>Acemi</li>
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
                <p>✉️ info@atayuzmekursu.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Ata Yüzme Akademisi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">🔑 Giriş Yap</h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Kullanıcı Adı / E-posta
                </label>
                <input
                  type="text"
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kullanıcı adı veya e-posta adresinizi giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Şifrenizi giriniz"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Giriş Yap
              </button>
              
              <div className="text-center">
                <span className="text-gray-600">Hesabınız yok mu? </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Kayıt Ol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">📝 Kayıt Ol</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kullanıcı adınızı giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E-posta adresinizi giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Şifre *
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Şifrenizi giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Ad *
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adınızı giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Soyad *
                </label>
                <input
                  type="text"
                  value={registerData.surname}
                  onChange={(e) => setRegisterData({...registerData, surname: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Soyadınızı giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Telefon numaranızı giriniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Yaş *
                </label>
                <input
                  type="number"
                  value={registerData.age}
                  onChange={(e) => setRegisterData({...registerData, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Yaşınızı giriniz"
                  min="3"
                  max="100"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Kayıt Ol
              </button>
              
              <div className="text-center">
                <span className="text-gray-600">Zaten hesabınız var mı? </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing admin panels and modals can remain... */}
    </div>
  );
}
