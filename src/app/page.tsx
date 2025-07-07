"use client";

import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const initialState = { 
  name: "", 
  surname: "", 
  email: "", 
  phone: "", 
  username: "", 
  password: "",
  age: "",
  emergencyContact: {
    name: "",
    phone: "",
    relationship: ""
  },
  medicalInfo: {
    hasConditions: false,
    conditions: [],
    allergies: [],
    medications: []
  }
};

const initialLogin = { identifier: "", password: "" };

interface Course {
  _id: string;
  name: string;
  description: string;
  level: string;
  ageGroup: string;
  duration: number;
  maxStudents: number;
  price: number;
  instructor: {
    name: string;
    surname: string;
  };
}

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  phone: string;
  age: number;
  role: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
}

export default function Home() {
  const { user, login: authLogin, logout, isAuthenticated, isAdmin } = useAuth();
  
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [login, setLogin] = useState(initialLogin);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginPending, startLoginTransition] = useTransition();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'admin' | 'register' | 'login'>('home');

  // Kursları yükle
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (res.ok) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Kurslar yüklenirken hata:', err);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Kullanıcıları yükle (sadece admin için)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Kullanıcılar yüklenirken hata:', err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (activeTab === 'admin' && isAdmin) {
      fetchUsers();
    }
  }, [activeTab, isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: parseInt(value) || '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message || "Kayıt başarılı! En kısa sürede sizinle iletişime geçeceğiz.");
          setForm(initialState);
          // Kullanıcılar listesini yenile (sadece admin için)
          if (activeTab === 'admin' && isAdmin) {
            const usersRes = await fetch('/api/users');
            const usersData = await usersRes.json();
            if (usersRes.ok) {
              setUsers(usersData.users);
            }
          }
        } else {
          // Daha detaylı hata mesajları
          if (data.error?.fieldErrors) {
            const fieldErrors = Object.values(data.error.fieldErrors).flat();
            setError(fieldErrors.join(", "));
          } else if (data.error?.formErrors) {
            setError(data.error.formErrors.join(", "));
          } else if (data.error?.message) {
            setError(data.error.message);
          } else if (data.message) {
            setError(data.message);
          } else {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
          }
        }
      } catch (err) {
        setError("Sunucuya ulaşılamıyor. Lütfen tekrar deneyin.");
      }
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);
    setLoginError(null);
    startLoginTransition(async () => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(login),
        });
        const data = await res.json();
        if (res.ok) {
          setLoginMessage(`Hoş geldiniz, ${data.user.name} ${data.user.surname}!`);
          setLogin(initialLogin);
          // Auth context'e kullanıcıyı kaydet
          authLogin(data.user, data.token);
        } else {
          setLoginError(data.error || "Bir hata oluştu.");
        }
      } catch (err) {
        setLoginError("Sunucuya ulaşılamıyor. Lütfen tekrar deneyin.");
      }
    });
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Başlangıç';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return level;
    }
  };

  const getAgeGroupText = (ageGroup: string) => {
    switch (ageGroup) {
      case 'children': return 'Çocuk';
      case 'adults': return 'Yetişkin';
      case 'all': return 'Tüm Yaşlar';
      default: return ageGroup;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'Öğrenci';
      case 'instructor': return 'Eğitmen';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Admin Functions
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handlePromoteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı eğitmen yapmak istediğinizden emin misiniz?')) {
      try {
        const res = await fetch(`/api/users/${userId}/promote`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.ok) {
          // Kullanıcı listesini yenile
          const usersRes = await fetch('/api/users');
          const usersData = await usersRes.json();
          if (usersRes.ok) {
            setUsers(usersData.users);
          }
          alert('Kullanıcı başarıyla eğitmen yapıldı!');
        } else {
          alert('Bir hata oluştu!');
        }
      } catch (error) {
        alert('Bir hata oluştu!');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (res.ok) {
          // Kullanıcı listesini yenile
          setUsers(users.filter(u => u._id !== userId));
          alert('Kullanıcı başarıyla silindi!');
        } else {
          alert('Bir hata oluştu!');
        }
      } catch (error) {
        alert('Bir hata oluştu!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-900">Yüze Yüzme Kursu</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'home' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'courses' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                Kurslar
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'admin' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Admin Panel
                </button>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'register' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Kayıt Ol
                </button>
              )}
              {!isAuthenticated ? (
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'login' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Giriş Yap
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-blue-700">
                    Hoş geldiniz, {user?.name} {user?.surname}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ana Sayfa */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                      Yüzmeyi Öğrenin
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                      Uzman eğitmenler eşliğinde, güvenli ve eğlenceli bir ortamda
                    </p>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition"
                    >
                      Kurslarımızı İnceleyin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Özellikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Uzman Eğitmenler</h3>
                <p className="text-blue-700">Alanında deneyimli, sertifikalı eğitmen kadrosu ile güvenli eğitim.</p>
              </div>
              
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Esnek Programlar</h3>
                <p className="text-blue-700">Çocuk, yetişkin ve özel grup dersleri ile her yaşa uygun programlar.</p>
              </div>
              
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Hijyenik Havuzlar</h3>
                <p className="text-blue-700">Düzenli bakımlı, güvenli ve temiz havuzlar ile sağlıklı ortam.</p>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="bg-white/90 rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Neden Bizi Seçmelisiniz?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-blue-700">Mutlu Öğrenci</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">10+</div>
                  <div className="text-blue-700">Yıllık Deneyim</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-blue-700">Uzman Eğitmen</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">3</div>
                  <div className="text-blue-700">Modern Havuz</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kurslar */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Kurslarımız</h2>
              <p className="text-lg text-blue-700">Her seviyeye uygun yüzme kursları</p>
            </div>
            
            {isLoadingCourses ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-blue-700">Kurslar yükleniyor...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="bg-white/90 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">{course.name}</h3>
                      <p className="text-blue-700 mb-4">{course.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-blue-600 font-medium">Seviye:</span>
                          <span className="text-blue-900">{getLevelText(course.level)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600 font-medium">Yaş Grubu:</span>
                          <span className="text-blue-900">{getAgeGroupText(course.ageGroup)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600 font-medium">Süre:</span>
                          <span className="text-blue-900">{course.duration} dakika</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600 font-medium">Maksimum:</span>
                          <span className="text-blue-900">{course.maxStudents} öğrenci</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600 font-medium">Eğitmen:</span>
                          <span className="text-blue-900">{course.instructor.name} {course.instructor.surname}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">{course.price} ₺</span>
                        <button
                          onClick={() => setActiveTab('register')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Kayıt Ol
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Panel */}
        {activeTab === 'admin' && isAdmin && (
          <div className="space-y-8">
            {/* Admin Panel Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Admin Panel</h2>
              <p className="text-lg text-blue-700">Sistem yönetimi ve kullanıcı kontrolü</p>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                <div className="text-blue-700">Toplam Kullanıcı</div>
              </div>
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'student').length}</div>
                <div className="text-green-700">Öğrenci</div>
              </div>
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-600">{users.filter(u => u.role === 'instructor').length}</div>
                <div className="text-orange-700">Eğitmen</div>
              </div>
              <div className="bg-white/90 rounded-lg p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</div>
                <div className="text-red-700">Admin</div>
              </div>
            </div>

            {/* Users Management Section */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Kullanıcı Yönetimi</h3>
            </div>
            
            {isLoadingUsers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-blue-700">Kullanıcılar yükleniyor...</p>
              </div>
            ) : (
              <div className="bg-white/90 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Toplam {users.length} kullanıcı
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ad Soyad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email / Kullanıcı Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yaş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kayıt Tarihi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((tableUser) => (
                        <tr key={tableUser._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {tableUser.name.charAt(0)}{tableUser.surname.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {tableUser.name} {tableUser.surname}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{tableUser.email}</div>
                            <div className="text-sm text-gray-500">@{tableUser.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tableUser.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tableUser.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              tableUser.role === 'admin' 
                                ? 'bg-red-100 text-red-800'
                                : tableUser.role === 'instructor'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {getRoleText(tableUser.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(tableUser.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewUser(tableUser)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
                                title="Detayları Görüntüle"
                              >
                                👁️ Görüntüle
                              </button>
                              {tableUser.role !== 'admin' && (
                                <button
                                  onClick={() => handlePromoteUser(tableUser._id)}
                                  className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded"
                                  title="Eğitmen Yap"
                                >
                                  ⬆️ Yükselt
                                </button>
                              )}
                              {tableUser._id !== user?._id && (
                                <button
                                  onClick={() => handleDeleteUser(tableUser._id)}
                                  className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                                  title="Kullanıcıyı Sil"
                                >
                                  🗑️ Sil
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500">Henüz kayıtlı kullanıcı bulunmamaktadır.</div>
                  </div>
                )}
              </div>
            )}

            {/* User Detail Modal */}
            {showUserModal && selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Kullanıcı Detayları
                      </h3>
                      <button
                        onClick={() => setShowUserModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ad</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Soyad</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.surname}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                        <p className="mt-1 text-sm text-gray-900">@{selectedUser.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Yaş</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedUser.age}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <p className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedUser.role === 'admin' 
                              ? 'bg-red-100 text-red-800'
                              : selectedUser.role === 'instructor'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {getRoleText(selectedUser.role)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kayıt Tarihi</label>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                    </div>

                    {selectedUser.emergencyContact && (
                      <div className="border-t pt-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Acil Durum Kişisi</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedUser.emergencyContact.name || 'Belirtilmemiş'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Telefon</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedUser.emergencyContact.phone || 'Belirtilmemiş'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">İlişki</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedUser.emergencyContact.relationship || 'Belirtilmemiş'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kayıt Formu */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Kayıt Ol</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Adınız"
                    value={form.name}
                    onChange={handleChange}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    minLength={2}
                  />
                  <input
                    name="surname"
                    type="text"
                    placeholder="Soyadınız"
                    value={form.surname}
                    onChange={handleChange}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    minLength={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="email"
                    type="email"
                    placeholder="E-posta"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Telefon"
                    value={form.phone}
                    onChange={handleChange}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    minLength={10}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="username"
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={form.username}
                    onChange={handleChange}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    minLength={3}
                  />
                  <input
                    name="age"
                    type="number"
                    placeholder="Yaşınız"
                    value={form.age}
                    onChange={handleChange}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    min={3}
                    max={100}
                  />
                </div>
                
                <input
                  name="password"
                  type="password"
                  placeholder="Şifre"
                  value={form.password}
                  onChange={handleChange}
                  className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  required
                  minLength={6}
                />

                {/* Acil Durum Kişisi */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Acil Durum Kişisi (İsteğe Bağlı)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      name="emergencyContact.name"
                      type="text"
                      placeholder="Ad Soyad"
                      value={form.emergencyContact.name}
                      onChange={handleChange}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      name="emergencyContact.phone"
                      type="tel"
                      placeholder="Telefon"
                      value={form.emergencyContact.phone}
                      onChange={handleChange}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      name="emergencyContact.relationship"
                      type="text"
                      placeholder="İlişki (Anne, Baba, vb.)"
                      value={form.emergencyContact.relationship}
                      onChange={handleChange}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white rounded-lg px-8 py-3 font-semibold shadow hover:bg-blue-800 transition disabled:opacity-60"
                  disabled={isPending}
                >
                  {isPending ? "Kaydediliyor..." : "Kayıt Ol"}
                </button>
                
                {message && <div className="text-green-700 text-center mt-2">{message}</div>}
                {error && <div className="text-red-700 text-center mt-2">{error}</div>}
              </form>
            </div>
          </div>
        )}

        {/* Giriş Formu */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/90 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Giriş Yap</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  name="identifier"
                  type="text"
                  placeholder="Kullanıcı adı veya e-posta"
                  value={login.identifier}
                  onChange={handleLoginChange}
                  className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  required
                  minLength={3}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Şifre"
                  value={login.password}
                  onChange={handleLoginChange}
                  className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  required
                  minLength={6}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white rounded-lg px-8 py-3 font-semibold shadow hover:bg-blue-800 transition disabled:opacity-60"
                  disabled={isLoginPending}
                >
                  {isLoginPending ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </button>
                
                {loginMessage && <div className="text-green-700 text-center mt-2">{loginMessage}</div>}
                {loginError && <div className="text-red-700 text-center mt-2">{loginError}</div>}
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Yüze Yüzme Kursu</h3>
              <p className="text-blue-200">
                Uzman eğitmenler eşliğinde, her yaşa uygun yüzme eğitimleri.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <div className="space-y-2 text-blue-200">
                <p>📧 info@yuze.com</p>
                <p>📞 0 (555) 123 45 67</p>
                <p>📍 İstanbul, Türkiye</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white transition">Instagram</a>
                <a href="#" className="text-blue-200 hover:text-white transition">Facebook</a>
                <a href="#" className="text-blue-200 hover:text-white transition">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>© 2024 Yüze Yüzme Kursu. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
