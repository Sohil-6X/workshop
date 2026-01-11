import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

interface Dish {
  id: number;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
  category: string;
}

const DISHES: Dish[] = [
  { 
    id: 1, 
    nameEn: "Egyptian Foul", 
    nameAr: "فول مصري", 
    price: 8.50, 
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600", 
    category: "Breakfast" 
  },
  { 
    id: 2, 
    nameEn: "Egyptian Ta'ameya", 
    nameAr: "طعمية مصري", 
    price: 7.00, 
    image: "https://images.unsplash.com/photo-1593001874117-c99c5edbb097?auto=format&fit=crop&w=600", 
    category: "Breakfast" 
  },
  { 
    id: 3, 
    nameEn: "Sudanese Gorassa", 
    nameAr: "قراصة سودانية", 
    price: 15.00, 
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600", 
    category: "Main" 
  },
  { 
    id: 4, 
    nameEn: "Sudanese Asida", 
    nameAr: "عصيدة سودانية", 
    price: 12.50, 
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600", 
    category: "Main" 
  },
  { 
    id: 5, 
    nameEn: "Palestinian Musakhan", 
    nameAr: "مسخن فلسطينية", 
    price: 28.00, 
    image: "https://images.unsplash.com/photo-1626700051175-656a433b1140?auto=format&fit=crop&w=600", 
    category: "Main" 
  },
  { 
    id: 6, 
    nameEn: "Classic Shawarma", 
    nameAr: "شاورما", 
    price: 14.00, 
    image: "https://images.unsplash.com/photo-1633383718081-22ac93e3dbf1?auto=format&fit=crop&w=600", 
    category: "Main" 
  },
  { 
    id: 7, 
    nameEn: "Kunafa", 
    nameAr: "كنافة", 
    price: 10.00, 
    image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600", 
    category: "Dessert" 
  },
  { 
    id: 8, 
    nameEn: "Basbousa", 
    nameAr: "بسبوسة", 
    price: 9.00, 
    image: "https://images.unsplash.com/photo-1590401882046-60824b232677?auto=format&fit=crop&w=600", 
    category: "Dessert" 
  },
];

const App = () => {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [cart, setCart] = useState<number[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.body.className = `${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} ${lang === 'ar' ? 'rtl' : 'ltr'} transition-colors duration-300`;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [theme, lang]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id]);
    if (introAudioRef.current && introAudioRef.current.paused) {
        introAudioRef.current.play().catch(e => console.log("Auto-play blocked"));
    }
  };

  const t = {
    title: lang === 'en' ? 'Zero Tamatamaya' : 'زيرو طماطماية',
    slogan: lang === 'en' ? 'Freshness in every bite' : 'نضارة في كل لقمة',
    addToCart: lang === 'en' ? 'Add to Cart' : 'أضف إلى السلة',
    askAi: lang === 'en' ? 'Ask our Chef' : 'اسأل الطباخ',
    cart: lang === 'en' ? 'Cart' : 'السلة',
    aiPlaceholder: lang === 'en' ? 'What should I eat today?' : 'ماذا يجب أن آكل اليوم؟',
    currency: 'RM',
  };

  const askChef = async () => {
    setIsTyping(true);
    setIsAiOpen(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the head chef of "Zero Tamatamaya". Recommend a dish from this list: ${JSON.stringify(DISHES)}. Keep it short and answer in ${lang === 'en' ? 'English' : 'Arabic'}. Mention the RM currency.`,
      });
      setAiResponse(response.text || "Sorry, I'm busy in the kitchen!");
    } catch (error) {
      setAiResponse("Kitchen error!");
    }
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen pb-32">
      <audio ref={introAudioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-all">
        <div>
          <h1 className="text-2xl font-bold text-[#FF6347]">{t.title}</h1>
          <p className="text-[10px] uppercase tracking-wider opacity-60 font-semibold">{t.slogan}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            onClick={toggleLang}
            className="px-4 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="p-6 text-center max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FF6347] to-[#e54b2d] rounded-3xl p-10 text-white shadow-2xl mb-12">
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-6 drop-shadow-md">
              {lang === 'en' ? 'Taste the Heritage' : 'تذوق التراث'}
            </h2>
            <button 
              onClick={askChef}
              className="bg-white text-[#FF6347] px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <span className="text-xl">👨‍🍳</span> {t.askAi}
            </button>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {isAiOpen && (
          <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500 text-start">
            <div className="flex items-center gap-2 mb-3">
               <span className="w-2 h-2 rounded-full bg-[#FF6347] animate-pulse"></span>
               <p className="font-bold text-[#FF6347] text-sm tracking-wide uppercase">
                 {lang === 'en' ? 'Chef\'s Recommendation' : 'توصية الشيف'}
               </p>
            </div>
            <p className="text-lg leading-relaxed font-medium">
              {isTyping ? <span className="opacity-50 italic">Looking for the perfect spice...</span> : aiResponse}
            </p>
          </div>
        )}
      </section>

      {/* Dish Grid */}
      <main className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {DISHES.map(dish => (
          <div key={dish.id} className="group dish-card bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={dish.image} 
                alt={lang === 'en' ? dish.nameEn : dish.nameAr} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[#FF6347] font-bold px-3 py-1 rounded-full shadow-lg text-sm">
                {t.currency} {dish.price.toFixed(2)}
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-xl mb-4 group-hover:text-[#FF6347] transition-colors">
                {lang === 'en' ? dish.nameEn : dish.nameAr}
              </h3>
              <button 
                onClick={() => addToCart(dish.id)}
                className="w-full font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl hover:bg-[#FF6347] dark:hover:bg-[#FF6347] hover:text-white dark:hover:text-white transition-all transform active:scale-95 shadow-md"
              >
                {t.addToCart}
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Floating Action Cart */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50">
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex justify-between items-center border border-white/10 dark:border-black/5 backdrop-blur-md">
          <div className="flex items-center gap-4 px-2">
            <div className="relative">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6347] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce ring-2 ring-slate-900 dark:ring-white">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase opacity-60 font-bold tracking-widest">{t.cart}</span>
              <span className="font-bold text-lg leading-none">
                {cart.length > 0 ? `${t.currency} ${(cart.reduce((acc, id) => acc + (DISHES.find(d => d.id === id)?.price || 0), 0)).toFixed(2)}` : `${t.currency} 0.00`}
              </span>
            </div>
          </div>
          <button className="bg-[#FF6347] text-white px-8 py-3 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg active:scale-95">
            {lang === 'en' ? 'Checkout' : 'اتمام الطلب'}
          </button>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}