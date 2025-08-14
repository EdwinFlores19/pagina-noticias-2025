import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  Globe, 
  ExternalLink,
  ChevronUp,
  Bell,
  Settings,
  Heart,
  MessageCircle,
  Eye,
  ArrowUp,
  Sun,
  Moon,
  Filter,
  ChevronDown,
  Home,
  Mail,
  Phone
} from 'lucide-react';

// ==========================================================================
// INTERFACES Y TIPOS
// ==========================================================================

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  featured: boolean;
  readTime: number;
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
}

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon?: string;
}

type Category = "Portada" | "Internacional" | "Economía" | "Deportes" | "Sociedad" | "Ciencia" | "Cultura" | "Tecnología";

// ==========================================================================
// DATOS MOCK (simulando una API)
// ==========================================================================

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "España alcanza un nuevo récord en energías renovables durante el primer trimestre de 2025",
    summary: "El país ha logrado que el 65% de su energía provenga de fuentes renovables, superando las expectativas del gobierno y estableciendo un nuevo estándar europeo.",
    content: "En un hito histórico para la transición energética española, el país ha alcanzado un nuevo récord en la producción de energías renovables durante el primer trimestre de 2025. Según datos del Ministerio para la Transición Ecológica, el 65% de la electricidad consumida provino de fuentes limpias, un incremento del 12% respecto al mismo período del año anterior.",
    category: "Economía",
    author: "María González",
    publishedAt: "2025-08-14T08:30:00Z",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
    featured: true,
    readTime: 4,
    views: 15420,
    likes: 892,
    comments: 156,
    tags: ["energía", "renovables", "medio ambiente", "economía verde"]
  },
  {
    id: 2,
    title: "La Unión Europea anuncia nuevas medidas para combatir el cambio climático",
    summary: "Bruselas presenta un paquete de reformas que incluye incentivos para vehículos eléctricos y penalizaciones a emisiones industriales, con el objetivo de alcanzar la neutralidad climática para 2050.",
    content: "La Comisión Europea ha dado a conocer hoy un ambicioso paquete de medidas para acelerar la lucha contra el cambio climático, incluyendo nuevos incentivos fiscales para la compra de vehículos eléctricos y restricciones más estrictas para las industrias más contaminantes.",
    category: "Internacional",
    author: "Carlos Ruiz",
    publishedAt: "2025-08-14T07:15:00Z",
    image: "https://images.unsplash.com/photo-1569163139394-de44cb5c9f65?w=800&h=400&fit=crop",
    featured: false,
    readTime: 6,
    views: 8934,
    likes: 445,
    comments: 78,
    tags: ["unión europea", "cambio climático", "política ambiental"]
  },
  {
    id: 3,
    title: "El Real Madrid se prepara para el clásico del próximo fin de semana",
    summary: "Ancelotti confía en recuperar a varios jugadores lesionados para el encuentro más esperado de la temporada contra el FC Barcelona en el Santiago Bernabéu.",
    content: "Con la vista puesta en el clásico del próximo sábado, Carlo Ancelotti trabaja contrarreloj para recuperar a sus jugadores clave. La enfermería madridista ha visto reducirse considerablemente en los últimos días.",
    category: "Deportes",
    author: "Luis Martín",
    publishedAt: "2025-08-14T06:45:00Z",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    featured: false,
    readTime: 3,
    views: 12678,
    likes: 1205,
    comments: 234,
    tags: ["real madrid", "barcelona", "clásico", "la liga"]
  },
  {
    id: 4,
    title: "Nueva ley de vivienda: qué cambios trae para inquilinos y propietarios",
    summary: "El gobierno aprueba modificaciones que buscan regular el mercado del alquiler y facilitar el acceso a la vivienda, estableciendo límites de precios en zonas tensionadas.",
    content: "La nueva normativa introduce importantes cambios en el mercado inmobiliario español, incluyendo la regulación de precios de alquiler en áreas metropolitanas y nuevas protecciones para inquilinos.",
    category: "Sociedad",
    author: "Ana López",
    publishedAt: "2025-08-14T05:20:00Z",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    featured: false,
    readTime: 5,
    views: 6789,
    likes: 324,
    comments: 167,
    tags: ["vivienda", "alquiler", "legislación", "inmobiliario"]
  },
  {
    id: 5,
    title: "Avance científico español en el tratamiento del Alzheimer muestra resultados prometedores",
    summary: "Investigadores del CSIC desarrollan un nuevo fármaco que ralentiza significativamente la progresión de la enfermedad en fase II de ensayos clínicos.",
    content: "Un equipo de investigadores españoles del CSIC ha logrado un importante avance en el tratamiento del Alzheimer con un nuevo medicamento que ha mostrado resultados excepcionales en la fase II de ensayos clínicos.",
    category: "Ciencia",
    author: "Dr. Patricia Vega",
    publishedAt: "2025-08-14T04:10:00Z",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    featured: false,
    readTime: 7,
    views: 9456,
    likes: 567,
    comments: 89,
    tags: ["alzheimer", "investigación", "csic", "medicina"]
  },
  {
    id: 6,
    title: "El precio del petróleo se estabiliza tras las turbulencias de la semana pasada",
    summary: "Los mercados internacionales muestran signos de recuperación después de la volatilidad registrada, con el Brent situándose en 78 dólares por barril.",
    content: "Los precios del crudo han encontrado cierta estabilidad después de una semana marcada por la incertidumbre geopolítica. El Brent se sitúa en torno a los 78 dólares por barril.",
    category: "Economía",
    author: "Roberto Silva",
    publishedAt: "2025-08-14T03:30:00Z",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    featured: false,
    readTime: 4,
    views: 5234,
    likes: 198,
    comments: 45,
    tags: ["petróleo", "mercados", "energía", "economía global"]
  },
  {
    id: 7,
    title: "Festival Internacional de Cine de San Sebastián anuncia su programación",
    summary: "La 73ª edición del prestigioso festival incluirá 200 películas de 50 países, con especial énfasis en el cine iberoamericano y las nuevas tecnologías.",
    content: "El Festival Internacional de Cine de San Sebastián ha presentado hoy la programación de su 73ª edición, que se celebrará del 20 al 28 de septiembre.",
    category: "Cultura",
    author: "Carmen Delgado",
    publishedAt: "2025-08-14T02:15:00Z",
    image: "https://images.unsplash.com/photo-1489599731041-e399b91e8849?w=800&h=400&fit=crop",
    featured: false,
    readTime: 3,
    views: 3456,
    likes: 234,
    comments: 56,
    tags: ["cine", "festival", "san sebastián", "cultura"]
  },
  {
    id: 8,
    title: "Nueva tecnología 6G promete revolucionar las comunicaciones móviles",
    summary: "España se posiciona como líder europeo en el desarrollo de la sexta generación de telefonía móvil, con velocidades hasta 100 veces superiores al 5G actual.",
    content: "Empresas españolas en colaboración con universidades europeas han logrado importantes avances en el desarrollo de la tecnología 6G, prometiendo velocidades de transmisión revolucionarias.",
    category: "Tecnología",
    author: "Miguel Hernández",
    publishedAt: "2025-08-14T01:45:00Z",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    featured: false,
    readTime: 5,
    views: 7890,
    likes: 445,
    comments: 123,
    tags: ["6g", "tecnología", "telecomunicaciones", "innovación"]
  }
];

const categories: Category[] = [
  "Portada", 
  "Internacional", 
  "Economía", 
  "Deportes", 
  "Sociedad", 
  "Ciencia", 
  "Cultura", 
  "Tecnología"
];

const mockWeather: WeatherData = {
  city: "Madrid",
  temperature: 24,
  condition: "Soleado"
};

// ==========================================================================
// COMPONENTE PRINCIPAL DE TARJETA DE NOTICIAS
// ==========================================================================

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
  onBookmark?: (id: number) => void;
  onShare?: (article: NewsArticle) => void;
  onLike?: (id: number) => void;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  featured = false, 
  onBookmark, 
  onShare,
  onLike,
  isLiked = false,
  isBookmarked = false
}) => {
  const formatTime = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const formatNumber = useCallback((num?: number): string => {
    if (!num) return '0';
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  }, []);

  return (
    <article 
      className={`group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] ${
        featured 
          ? 'col-span-full lg:col-span-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl border-2 border-blue-100' 
          : 'bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200'
      }`}
      role="article"
      aria-labelledby={`article-title-${article.id}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-48'}`}>
        <img 
          src={article.image} 
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
            article.category === 'Internacional' ? 'bg-blue-600/90' :
            article.category === 'Economía' ? 'bg-green-600/90' :
            article.category === 'Deportes' ? 'bg-orange-600/90' :
            article.category === 'Sociedad' ? 'bg-purple-600/90' :
            article.category === 'Ciencia' ? 'bg-cyan-600/90' :
            article.category === 'Cultura' ? 'bg-pink-600/90' :
            article.category === 'Tecnología' ? 'bg-indigo-600/90' :
            'bg-gray-600/90'
          }`}>
            {article.category}
          </span>
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
              DESTACADO
            </span>
          </div>
        )}
        
        {/* Article Stats */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-white text-sm">
          <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
            <Eye size={12} />
            <span>{formatNumber(article.views)}</span>
          </div>
        </div>
      </div>

      <div className={`p-6 ${featured ? 'pb-8' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User size={14} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>{formatTime(article.publishedAt)}</span>
          </div>
        </div>

        <h2 
          id={`article-title-${article.id}`}
          className={`font-bold text-gray-900 line-clamp-3 mb-3 group-hover:text-blue-600 transition-colors ${
            featured ? 'text-2xl lg:text-3xl leading-tight' : 'text-lg'
          }`}
        >
          {article.title}
        </h2>

        <p className={`text-gray-600 line-clamp-3 mb-4 ${featured ? 'text-lg leading-relaxed' : 'text-sm'}`}>
          {article.summary}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>{article.readTime} min</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike?.(article.id);
              }}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title="Me gusta"
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.(article.id);
              }}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
              }`}
              title="Guardar"
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                onShare?.(article);
              }}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
              title="Compartir"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// ==========================================================================
// COMPONENTE DE BÚSQUEDA
// ==========================================================================

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onFocus, 
  onBlur 
}) => {
  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="search"
          placeholder="Buscar noticias, temas, autores..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white/80 backdrop-blur-sm"
        />
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE NAVEGACIÓN
// ==========================================================================

interface NavigationProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isMobile = false 
}) => {
  return (
    <nav className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-6'}`}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
            activeCategory === category
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
};

// ==========================================================================
// COMPONENTE DE SIDEBAR
// ==========================================================================

const Sidebar: React.FC = () => {
  return (
    <aside className="space-y-6">
      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="mr-2" size={20} />
          Tiempo en {mockWeather.city}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{mockWeather.temperature}°C</div>
            <div className="text-sm opacity-90">{mockWeather.condition}</div>
          </div>
          <Sun size={40} className="opacity-80" />
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
          <TrendingUp className="mr-2" size={20} />
          Trending
        </h3>
        <div className="space-y-3">
          {['Energías renovables', 'Cambio climático', 'Real Madrid', 'Vivienda', 'Alzheimer'].map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm text-gray-700">#{trend}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{Math.floor(Math.random() * 50) + 10}K</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
        <p className="text-sm mb-4 opacity-90">Recibe las noticias más importantes directamente en tu email</p>
        <div className="flex flex-col space-y-2">
          <input
            type="email"
            placeholder="tu@email.com"
            className="px-3 py-2 rounded-lg text-gray-900 text-sm"
          />
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            Suscribirse
          </button>
        </div>
      </div>
    </aside>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ==========================================================================

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Portada");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<number>>(new Set());
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filtrar noticias según categoría y término de búsqueda
  const filteredNews = useMemo(() => {
    let filtered = activeCategory === "Portada" ? mockNews : mockNews.filter(article => article.category === activeCategory);
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  // Separar noticias destacadas de las regulares
  const { featuredNews, regularNews } = useMemo(() => {
    const featured = filteredNews.filter(article => article.featured);
    const regular = filteredNews.filter(article => !article.featured);
    return { featuredNews: featured, regularNews: regular };
  }, [filteredNews]);

  // Manejar scroll para mostrar botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const handleLike = useCallback((id: number) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleBookmark = useCallback((id: number) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleShare = useCallback((article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
      alert('Enlace copiado al portapapeles');
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl">
                <Globe size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NewsPortal</h1>
                <p className="text-xs text-gray-500">Tu fuente de información</p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center space-x-4 flex-1 justify-center px-8">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Settings size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>