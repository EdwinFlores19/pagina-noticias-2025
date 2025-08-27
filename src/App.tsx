import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Importa React y hooks esenciales para la gestión de estado, efectos secundarios y optimización.
import { 
  Search, // Icono de búsqueda.
  Menu, // Icono de menú (hamburguesa).
  X, // Icono de cierre (cruz).
  Clock, // Icono de reloj.
  User, // Icono de usuario.
  Calendar, // Icono de calendario.
  Share2, // Icono de compartir.
  Bookmark, // Icono de marcador/guardar.
  TrendingUp, // Icono de tendencia al alza.
  Globe, // Icono de globo terráqueo.
  ExternalLink, // Icono de enlace externo.
  ChevronUp, // Icono de flecha hacia arriba.
  Bell, // Icono de campana (notificaciones).
  Settings, // Icono de ajustes.
  Heart, // Icono de corazón (me gusta).
  MessageCircle, // Icono de burbuja de mensaje (comentarios).
  Eye, // Icono de ojo (vistas).
  ArrowUp, // Icono de flecha hacia arriba.
  Sun, // Icono de sol (modo claro).
  Moon, // Icono de luna (modo oscuro).
  Filter, // Icono de filtro.
  ChevronDown, // Icono de flecha hacia abajo.
  Home, // Icono de casa.
  Mail, // Icono de correo.
  Phone // Icono de teléfono.
} from 'lucide-react'; // Importa varios iconos de la librería Lucide para usar en la interfaz de usuario.

// ==========================================================================
// INTERFACES Y TIPOS
// ==========================================================================

// Define la estructura de un objeto de artículo de noticias.
interface NewsArticle {
  id: number; // Identificador único del artículo.
  title: string; // Título del artículo.
  summary: string; // Resumen breve del artículo.
  content: string; // Contenido completo del artículo.
  category: string; // Categoría a la que pertenece el artículo (ej. "Economía", "Deportes").
  author: string; // Autor del artículo.
  publishedAt: string; // Fecha y hora de publicación del artículo en formato ISO 8601.
  image: string; // URL de la imagen principal del artículo.
  featured: boolean; // Indica si el artículo es destacado.
  readTime: number; // Tiempo estimado de lectura en minutos.
  views?: number; // Número opcional de vistas del artículo.
  likes?: number; // Número opcional de "me gusta" del artículo.
  comments?: number; // Número opcional de comentarios del artículo.
  tags?: string[]; // Array opcional de etiquetas o palabras clave asociadas al artículo.
}

// Define la estructura de un objeto de datos meteorológicos.
interface WeatherData {
  city: string; // Ciudad para la que se muestra el clima.
  temperature: number; // Temperatura actual en grados Celsius.
  condition: string; // Descripción de la condición climática (ej. "Soleado", "Nublado").
  icon?: string; // URL o nombre del icono que representa la condición climática.
}

// Define un tipo de unión para las categorías de noticias permitidas.
type Category = "Portada" | "Internacional" | "Economía" | "Deportes" | "Sociedad" | "Ciencia" | "Cultura" | "Tecnología";

// ==========================================================================
// DATOS MOCK (simulando una API)
// ==========================================================================

// Array de objetos NewsArticle que simulan datos de noticias obtenidos de una API.
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

// Array de categorías de noticias disponibles.
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

// Objeto mock para datos meteorológicos.
const mockWeather: WeatherData = {
  city: "Madrid",
  temperature: 24,
  condition: "Soleado"
};

// ==========================================================================
// COMPONENTE PRINCIPAL DE TARJETA DE NOTICIAS (NewsCard)
// ==========================================================================

// Propiedades que acepta el componente NewsCard.
interface NewsCardProps {
  article: NewsArticle; // El objeto de artículo de noticias a mostrar.
  featured?: boolean; // Opcional: Si el artículo es destacado (por defecto false).
  onBookmark?: (id: number) => void; // Opcional: Función para manejar el guardado de un artículo.
  onShare?: (article: NewsArticle) => void; // Opcional: Función para manejar el compartir un artículo.
  onLike?: (id: number) => void; // Opcional: Función para manejar el "me gusta" de un artículo.
  isLiked?: boolean; // Opcional: Si el artículo ya ha recibido un "me gusta" del usuario.
  isBookmarked?: boolean; // Opcional: Si el artículo ya ha sido guardado por el usuario.
}

// Componente funcional NewsCard para mostrar un artículo de noticias.
const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  featured = false, // Valor por defecto para la propiedad featured.
  onBookmark, 
  onShare,
  onLike,
  isLiked = false,
  isBookmarked = false
}) => {
  // Hook useCallback para memorizar la función de formateo de tiempo y evitar re-renderizados innecesarios.
  const formatTime = useCallback((dateString: string): string => {
    const date = new Date(dateString); // Crea un objeto Date a partir de la cadena de fecha.
    const now = new Date(); // Obtiene la fecha y hora actual.
    // Calcula la diferencia en horas entre la fecha de publicación y la actual.
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace menos de 1 hora"; // Si es menos de 1 hora, muestra un mensaje específico.
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`; // Si es menos de 24 horas, muestra "Hace X horas".
    // Si es más de 24 horas, formatea la fecha completa.
    return date.toLocaleDateString('es-ES', { // Formatea la fecha a un formato local español.
      day: '2-digit', // Día con dos dígitos.
      month: '2-digit', // Mes con dos dígitos.
      year: 'numeric' // Año completo.
    });
  }, []); // La función no tiene dependencias, por lo que solo se crea una vez.

  // Hook useCallback para memorizar la función de formateo de números (vistas, likes).
  const formatNumber = useCallback((num?: number): string => {
    if (!num) return '0'; // Si el número es nulo o indefinido, devuelve '0'.
    if (num < 1000) return num.toString(); // Si es menor de 1000, devuelve el número tal cual.
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`; // Si es menor de 1 millón, lo formatea a "X.XK".
    return `${(num / 1000000).toFixed(1)}M`; // Si es 1 millón o más, lo formatea a "X.XM".
  }, []); // La función no tiene dependencias, por lo que solo se crea una vez.

  return (
    // El elemento <article> representa un componente de contenido independiente.
    <article 
      className={`group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] ${ // Clases CSS para estilo y efectos de hover.
        featured // Aplica diferentes estilos si el artículo es destacado.
          ? 'col-span-full lg:col-span-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl border-2 border-blue-100' // Estilos para artículo destacado.
          : 'bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200' // Estilos para artículo normal.
      }`}
      role="article" // Rol ARIA para indicar que es un artículo.
      aria-labelledby={`article-title-${article.id}`} // Asocia el artículo con su título para accesibilidad.
    >
      {/* Contenedor de la imagen del artículo */}
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-48'}`}> {/* Altura diferente si es destacado. */}
        <img 
          src={article.image} // Fuente de la imagen.
          alt="" // Texto alternativo vacío (considerar añadir descripción si la imagen es crucial para el contenido).
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" // Clases CSS para la imagen y efecto de zoom al pasar el ratón.
          loading="lazy" // Carga perezosa de la imagen para mejorar el rendimiento.
          decoding="async" // Decodificación asíncrona de la imagen.
        />
        {/* Capa de degradado sobre la imagen para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Insignia de Categoría */}
        <div className="absolute top-4 left-4"> {/* Posiciona la insignia en la esquina superior izquierda. */}
          <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${ // Clases CSS para la insignia.
            article.category === 'Internacional' ? 'bg-blue-600/90' : // Color de fondo según la categoría.
            article.category === 'Economía' ? 'bg-green-600/90' :
            article.category === 'Deportes' ? 'bg-orange-600/90' :
            article.category === 'Sociedad' ? 'bg-purple-600/90' :
            article.category === 'Ciencia' ? 'bg-cyan-600/90' :
            article.category === 'Cultura' ? 'bg-pink-600/90' :
            article.category === 'Tecnología' ? 'bg-indigo-600/90' :
            'bg-gray-600/90'
          }`}>
            {article.category} {/* Muestra el nombre de la categoría. */}
          </span>
        </div>
        
        {/* Insignia de Destacado (solo si el artículo es destacado) */}
        {featured && ( // Renderiza solo si `featured` es true.
          <div className="absolute top-4 right-4"> {/* Posiciona la insignia en la esquina superior derecha. */}
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg"> {/* Clases CSS para la insignia de destacado. */}
              DESTACADO {/* Texto de la insignia. */}
            </span>
          </div>
        )}
        
        {/* Estadísticas del Artículo (Vistas) */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-white text-sm"> {/* Posiciona las estadísticas en la esquina inferior derecha. */}
          <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full"> {/* Contenedor para el icono y el número de vistas. */}
            <Eye size={12} /> {/* Icono de ojo. */}
            <span>{formatNumber(article.views)}</span> {/* Muestra el número de vistas formateado. */}
          </div>
        </div>
      </div>

      {/* Contenido textual del artículo */}
      <div className={`p-6 ${featured ? 'pb-8' : ''}`}> {/* Padding y padding inferior extra si es destacado. */}
        {/* Información del autor y fecha de publicación */}
        <div className="flex items-center justify-between mb-3"> {/* Usa flexbox para alinear autor y fecha. */}
          <div className="flex items-center space-x-2 text-sm text-gray-600"> {/* Contenedor para el autor. */}
            <User size={14} /> {/* Icono de usuario. */}
            <span>{article.author}</span> {/* Nombre del autor. */}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600"> {/* Contenedor para la fecha. */}
            <Clock size={14} /> {/* Icono de reloj. */}
            <span>{formatTime(article.publishedAt)}</span> {/* Fecha de publicación formateada. */}
          </div>
        </div>

        {/* Título del artículo */}
        <h2 
          id={`article-title-${article.id}`} // ID para accesibilidad.
          className={`font-bold text-gray-900 line-clamp-3 mb-3 group-hover:text-blue-600 transition-colors ${ // Clases CSS para el título.
            featured ? 'text-2xl lg:text-3xl leading-tight' : 'text-lg' // Tamaño de fuente diferente si es destacado.
          }`}
        >
          {article.title} {/* Muestra el título del artículo. */}
        </h2>

        {/* Resumen del artículo */}
        <p className={`text-gray-600 line-clamp-3 mb-4 ${featured ? 'text-lg leading-relaxed' : 'text-sm'}`}> {/* Clases CSS para el resumen. */}
          {article.summary} {/* Muestra el resumen del artículo. */}
        </p>

        {/* Etiquetas (Tags) del artículo */}
        {article.tags && article.tags.length > 0 && ( // Renderiza solo si hay etiquetas.
          <div className="flex flex-wrap gap-2 mb-4"> {/* Contenedor para las etiquetas. */}
            {article.tags.slice(0, 3).map((tag, index) => ( // Muestra un máximo de 3 etiquetas.
              <span
                key={index} // Clave única para cada etiqueta.
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" // Clases CSS para cada etiqueta.
              >
                #{tag} {/* Muestra la etiqueta con un prefijo #. */}
              </span>
            ))}
          </div>
        )}

        {/* Sección de acciones (tiempo de lectura, likes, guardar, compartir) */}
        <div className="flex items-center justify-between"> {/* Usa flexbox para alinear los elementos. */}
          <div className="flex items-center space-x-4"> {/* Contenedor para el tiempo de lectura. */}
            <div className="flex items-center space-x-1 text-sm text-gray-500"> {/* Contenedor para el icono y el texto. */}
              <Clock size={14} /> {/* Icono de reloj. */}
              <span>{article.readTime} min</span> {/* Muestra el tiempo de lectura. */}
            </div>
          </div>

          <div className="flex items-center space-x-2"> {/* Contenedor para los botones de acción. */}
            {/* Botón de "Me gusta" */}
            <button
              onClick={(e) => { // Manejador de clic.
                e.preventDefault(); // Previene el comportamiento por defecto del botón.
                onLike?.(article.id); // Llama a la función onLike si está definida.
              }}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${ // Clases CSS para el botón.
                isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50' // Estilos condicionales si ya le ha dado "me gusta".
              }`}
              title="Me gusta" // Título para accesibilidad.
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} /> {/* Icono de corazón, relleno si le ha dado "me gusta". */}
            </button>
            
            {/* Botón de "Guardar" (Bookmark) */}
            <button
              onClick={(e) => { // Manejador de clic.
                e.preventDefault(); // Previene el comportamiento por defecto del botón.
                onBookmark?.(article.id); // Llama a la función onBookmark si está definida.
              }}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${ // Clases CSS para el botón.
                isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50' // Estilos condicionales si ya está guardado.
              }`}
              title="Guardar" // Título para accesibilidad.
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} /> {/* Icono de marcador, relleno si está guardado. */}
            </button>
            
            {/* Botón de "Compartir" */}
            <button
              onClick={(e) => { // Manejador de clic.
                e.preventDefault(); // Previene el comportamiento por defecto del botón.
                onShare?.(article); // Llama a la función onShare si está definida.
              }}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 hover:scale-110" // Clases CSS para el botón.
              title="Compartir" // Título para accesibilidad.
            >
              <Share2 size={16} /> {/* Icono de compartir. */}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// ==========================================================================
// COMPONENTE DE BÚSQUEDA (SearchBar)
// ==========================================================================

// Propiedades que acepta el componente SearchBar.
interface SearchBarProps {
  searchTerm: string; // El término de búsqueda actual.
  onSearchChange: (term: string) => void; // Función para actualizar el término de búsqueda.
  onFocus?: () => void; // Opcional: Función que se ejecuta cuando el input recibe el foco.
  onBlur?: () => void; // Opcional: Función que se ejecuta cuando el input pierde el foco.
}

// Componente funcional SearchBar para la barra de búsqueda.
const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onFocus, 
  onBlur 
}) => {
  return (
    <div className="relative flex-1 max-w-2xl"> {/* Contenedor principal de la barra de búsqueda. */}
      <div className="relative"> {/* Contenedor para posicionar el icono. */}
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> {/* Icono de búsqueda posicionado dentro del input. */}
        <input
          type="search" // Tipo de input para búsqueda.
          placeholder="Buscar noticias, temas, autores..." // Texto de placeholder.
          value={searchTerm} // Valor actual del input, controlado por el estado.
          onChange={(e) => onSearchChange(e.target.value)} // Maneja los cambios en el input.
          onFocus={onFocus} // Maneja el evento de foco.
          onBlur={onBlur} // Maneja el evento de pérdida de foco.
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white/80 backdrop-blur-sm" // Clases CSS para estilo y efectos.
        />
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE DE NAVEGACIÓN (Navigation)
// ==========================================================================

// Propiedades que acepta el componente Navigation.
interface NavigationProps {
  activeCategory: Category; // La categoría actualmente activa.
  onCategoryChange: (category: Category) => void; // Función para cambiar la categoría activa.
  isMobile?: boolean; // Opcional: Si la navegación se muestra en modo móvil.
}

// Componente funcional Navigation para la barra de navegación por categorías.
const Navigation: React.FC<NavigationProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isMobile = false // Valor por defecto para la propiedad isMobile.
}) => {
  return (
    <nav className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-6'}`}> {/* Clases CSS condicionales para modo móvil/escritorio. */}
      {categories.map((category) => ( // Mapea el array de categorías para crear botones.
        <button
          key={category} // Clave única para cada botón.
          onClick={() => onCategoryChange(category)} // Maneja el clic para cambiar la categoría.
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${ // Clases CSS para el botón.
            activeCategory === category // Estilos condicionales si la categoría está activa.
              ? 'bg-blue-600 text-white shadow-lg transform scale-105' // Estilos para categoría activa.
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' // Estilos para categoría inactiva.
          }`}
        >
          {category} {/* Muestra el nombre de la categoría. */}
        </button>
      ))}
    </nav>
  );
};

// ==========================================================================
// COMPONENTE DE SIDEBAR (Sidebar)
// ==========================================================================

// Componente funcional Sidebar para la barra lateral.
const Sidebar: React.FC = () => {
  return (
    <aside className="space-y-6"> {/* Contenedor principal de la barra lateral. */}
      {/* Widget del Clima */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl"> {/* Contenedor del widget del clima. */}
        <h3 className="text-lg font-semibold mb-4 flex items-center"> {/* Título del widget. */}
          <Globe className="mr-2" size={20} /> {/* Icono de globo. */}
          Tiempo en {mockWeather.city} {/* Muestra la ciudad del clima. */}
        </h3>
        <div className="flex items-center justify-between"> {/* Contenedor para la temperatura y condición. */}
          <div>
            <div className="text-3xl font-bold">{mockWeather.temperature}°C</div> {/* Muestra la temperatura. */}
            <div className="text-sm opacity-90">{mockWeather.condition}</div> {/* Muestra la condición climática. */}
          </div>
          <Sun size={40} className="opacity-80" /> {/* Icono de sol. */}
        </div>
      </div>

      {/* Temas de Tendencia (Trending Topics) */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"> {/* Contenedor de temas de tendencia. */}
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900"> {/* Título de la sección. */}
          <TrendingUp className="mr-2" size={20} /> {/* Icono de tendencia. */}
          Trending {/* Texto del título. */}
        </h3>
        <div className="space-y-3"> {/* Contenedor para la lista de tendencias. */}
          {['Energías renovables', 'Cambio climático', 'Real Madrid', 'Vivienda', 'Alzheimer'].map((trend, index) => ( // Mapea las tendencias mock. */
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"> {/* Elemento individual de tendencia. */}
              <span className="text-sm text-gray-700">#{trend}</span> {/* Nombre de la tendencia. */}
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{Math.floor(Math.random() * 50) + 10}K</span> {/* Número aleatorio de menciones. */}
            </div>
          ))}
        </div>
      </div>

      {/* Suscripción a Newsletter */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl"> {/* Contenedor del formulario de newsletter. */}
        <h3 className="text-lg font-semibold mb-2">Newsletter</h3> {/* Título del newsletter. */}
        <p className="text-sm mb-4 opacity-90">Recibe las noticias más importantes directamente en tu email</p> {/* Descripción. */}
        <div className="flex flex-col space-y-2"> {/* Contenedor para el input y el botón. */}
          <input
            type="email" // Tipo de input para email.
            placeholder="tu@email.com" // Placeholder del input.
            className="px-3 py-2 rounded-lg text-gray-900 text-sm" // Clases CSS para el input.
          />
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"> {/* Botón de suscripción. */}
            Suscribirse {/* Texto del botón. */}
          </button>
        </div>
      </div>
    </aside>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN (App)
// ==========================================================================

// Componente funcional principal de la aplicación.
const App: React.FC = () => {
  // Estados de la aplicación utilizando el hook useState.
  const [activeCategory, setActiveCategory] = useState<Category>("Portada"); // Estado para la categoría de noticias activa.
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú móvil.
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set()); // Estado para los IDs de artículos a los que se les ha dado "me gusta".
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<number>>(new Set()); // Estado para los IDs de artículos guardados.
  const [showScrollToTop, setShowScrollToTop] = useState(false); // Estado para controlar la visibilidad del botón "volver arriba".
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para controlar el modo oscuro/claro.

  // Hook useMemo para memorizar el resultado del filtrado de noticias y evitar recálculos innecesarios.
  const filteredNews = useMemo(() => {
    // Filtra las noticias por categoría. Si la categoría es "Portada", muestra todas las noticias.
    let filtered = activeCategory === "Portada" ? mockNews : mockNews.filter(article => article.category === activeCategory);
    
    // Si hay un término de búsqueda, filtra las noticias por título, resumen, autor o etiquetas.
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Busca en el título.
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) || // Busca en el resumen.
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) || // Busca en el autor.
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) // Busca en las etiquetas.
      );
    }

    return filtered; // Devuelve las noticias filtradas.
  }, [activeCategory, searchTerm]); // Se recalcula cuando `activeCategory` o `searchTerm` cambian.

  // Hook useMemo para separar las noticias destacadas de las regulares.
  const { featuredNews, regularNews } = useMemo(() => {
    const featured = filteredNews.filter(article => article.featured); // Filtra las noticias destacadas.
    const regular = filteredNews.filter(article => !article.featured); // Filtra las noticias regulares.
    return { featuredNews: featured, regularNews: regular }; // Devuelve un objeto con ambos arrays.
  }, [filteredNews]); // Se recalcula cuando `filteredNews` cambia.

  // Hook useEffect para manejar el evento de scroll y mostrar/ocultar el botón "volver arriba".
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400); // Muestra el botón si el scroll es mayor a 400px.
    };

    window.addEventListener('scroll', handleScroll); // Añade el event listener para el scroll.
    return () => window.removeEventListener('scroll', handleScroll); // Limpia el event listener al desmontar el componente.
  }, []); // Se ejecuta una vez al montar el componente.

  // Handlers (funciones de manejo de eventos) utilizando useCallback para memorización.
  const handleLike = useCallback((id: number) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev); // Crea una nueva copia del Set de artículos con "me gusta".
      if (newSet.has(id)) { // Si el artículo ya tiene "me gusta"...
        newSet.delete(id); // ...lo elimina.
      } else { // Si no tiene "me gusta"...
        newSet.add(id); // ...lo añade.
      }
      return newSet; // Devuelve el nuevo Set.
    });
  }, []); // La función no tiene dependencias externas.

  const handleBookmark = useCallback((id: number) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev); // Crea una nueva copia del Set de artículos guardados.
      if (newSet.has(id)) { // Si el artículo ya está guardado...
        newSet.delete(id); // ...lo elimina.
      } else { // Si no está guardado...
        newSet.add(id); // ...lo añade.
      }
      return newSet; // Devuelve el nuevo Set.
    });
  }, []); // La función no tiene dependencias externas.

  const handleShare = useCallback((article: NewsArticle) => {
    if (navigator.share) { // Comprueba si la Web Share API está disponible.
      navigator.share({ // Utiliza la Web Share API para compartir el artículo.
        title: article.title, // Título a compartir.
        text: article.summary, // Texto/resumen a compartir.
        url: window.location.href, // URL a compartir (la URL actual de la página).
      });
    } else {
      // Fallback para navegadores sin Web Share API: copia el enlace al portapapeles.
      navigator.clipboard.writeText(`${article.title} - ${window.location.href}`); // Copia el título y la URL al portapapeles.
      alert('Enlace copiado al portapapeles'); // Muestra una alerta al usuario.
    }
  }, []); // La función no tiene dependencias externas.

  // Función para hacer scroll al inicio de la página.
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Realiza un scroll suave hasta la parte superior.
  };

  return (
    // Contenedor principal de la aplicación, con estilos condicionales para modo oscuro/claro.
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}> {/* Establece la altura mínima y el fondo según el modo. */}
      {/* Header de la aplicación */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200"> {/* Encabezado fijo en la parte superior con efectos de estilo. */}
        <div className="container mx-auto px-4"> {/* Contenedor para centrar el contenido del encabezado. */}
          <div className="flex items-center justify-between h-16"> {/* Contenedor flex para alinear elementos del encabezado. */}
            {/* Logo de la aplicación */}
            <div className="flex items-center space-x-4"> {/* Contenedor para el icono y el texto del logo. */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl"> {/* Estilo del icono del logo. */}
                <Globe size={24} /> {/* Icono de globo. */}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NewsPortal</h1> {/* Título principal del logo. */}
                <p className="text-xs text-gray-500">Tu fuente de información</p> {/* Subtítulo/eslogan del logo. */}
              </div>
            </div>

            {/* Barra de búsqueda para escritorio (oculta en móvil) */}
            <div className="hidden md:flex items-center space-x-4 flex-1 justify-center px-8"> {/* Contenedor de la barra de búsqueda. */}
              <SearchBar
                searchTerm={searchTerm} // Pasa el término de búsqueda actual.
                onSearchChange={setSearchTerm} // Pasa la función para actualizar el término de búsqueda.
              />
            </div>

            {/* Acciones de escritorio (ocultas en móvil) */}
            <div className="hidden md:flex items-center space-x-4"> {/* Contenedor para los botones de acción. */}
              {/* Botón para alternar modo oscuro/claro */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)} // Cambia el estado de `isDarkMode` al hacer clic.
                className="p-2 rounded-full hover:bg-gray-100 transition-colors" // Clases CSS para el botón.
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {/* Muestra el icono de sol o luna según el modo. */}
              </button>
              {/* Botón de notificaciones */}
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"> {/* Botón de notificaciones con indicador. */}
                <Bell size={20} /> {/* Icono de campana. */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> {/* Indicador de notificaciones pendientes. */}
              </button>
              {/* Botón de ajustes */}
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"> {/* Botón de ajustes. */}
                <Settings size={20} /> {/* Icono de ajustes. */}
              </button>
            </div>

            {/* Botón de menú móvil (visible solo en móvil) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Alterna la visibilidad del menú móvil.
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors" // Clases CSS para el botón.
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Muestra el icono de cierre o menú según el estado. */}
            </button>
          </div>

          {/* Navegación principal para escritorio (oculta en móvil) */}
          <div className="hidden md:block py-2"> {/* Contenedor de la navegación principal. */}
            <Navigation
              activeCategory={activeCategory} // Pasa la categoría activa.
              onCategoryChange={setActiveCategory} // Pasa la función para cambiar la categoría.
            />
          </div>
        </div>

        {/* Menú móvil (visible solo en móvil cuando está abierto) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg py-4 px-4"> {/* Contenedor del menú móvil. */}
            <div className="mb-4"> {/* Contenedor para la barra de búsqueda en móvil. */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFocus={() => setIsMobileMenuOpen(true)} // Mantiene el menú abierto al enfocar la búsqueda.
                onBlur={() => setIsMobileMenuOpen(false)} // Cierra el menú al perder el foco de la búsqueda.
              />
            </div>
            <Navigation
              activeCategory={activeCategory}
              onCategoryChange={(category) => {
                setActiveCategory(category);
                setIsMobileMenuOpen(false); // Cierra el menú móvil al seleccionar una categoría.
              }}
              isMobile // Indica que es la navegación móvil.
            />
            <div className="flex justify-around mt-4 border-t pt-4 border-gray-100"> {/* Contenedor para acciones adicionales en móvil. */}
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
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8"> {/* Contenedor principal del contenido. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Diseño de cuadrícula para el contenido principal. */}
          {/* Sección de noticias */}
          <section className="lg:col-span-2 space-y-8"> {/* Sección que ocupa 2 columnas en escritorio. */}
            {/* Noticias destacadas */}
            {featuredNews.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Cuadrícula para noticias destacadas. */}
                {featuredNews.map(article => (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    featured 
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                    onLike={handleLike}
                    isLiked={likedArticles.has(article.id)}
                    isBookmarked={bookmarkedArticles.has(article.id)}
                  />
                ))}
              </div>
            )}

            {/* Todas las noticias (o noticias regulares si hay destacadas) */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Últimas Noticias</h2> {/* Título de la sección de últimas noticias. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Cuadrícula para noticias regulares. */}
              {regularNews.map(article => (
                <NewsCard 
                  key={article.id} 
                  article={article} 
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onLike={handleLike}
                  isLiked={likedArticles.has(article.id)}
                  isBookmarked={bookmarkedArticles.has(article.id)}
                />
              ))}
            </div>

            {/* Mensaje si no hay noticias */}
            {filteredNews.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-lg">
                No se encontraron noticias para esta categoría o búsqueda.
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1"> {/* Barra lateral que ocupa 1 columna en escritorio. */}
            <Sidebar /> {/* Renderiza el componente Sidebar. */}
          </aside>
        </div>
      </main>

      {/* Botón de volver arriba */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop} // Llama a la función para hacer scroll al inicio.
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Clases CSS para el botón.
          title="Volver arriba" // Título para accesibilidad.
        >
          <ArrowUp size={24} /> {/* Icono de flecha hacia arriba. */}
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12"> {/* Pie de página de la aplicación. */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Diseño de cuadrícula para el contenido del pie de página. */}
          {/* Sección de información de la empresa */}
          <div>
            <h3 className="text-xl font-bold mb-4">NewsPortal</h3> {/* Título del pie de página. */}
            <p className="text-gray-400 text-sm mb-4">Tu fuente confiable de noticias y análisis profundos. Mantente informado, mantente adelante.</p> {/* Descripción. */}
            <div className="flex space-x-4"> {/* Iconos de redes sociales. */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Phone size={20} /></a>
            </div>
          </div>

          {/* Sección de enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3> {/* Título de la sección. */}
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>

          {/* Sección de categorías */}
          <div>
            <h3 className="text-xl font-bold mb-4">Categorías</h3> {/* Título de la sección. */}
            <ul className="space-y-2 text-sm">
              {categories.map(category => (
                <li key={category}><a href="#" className="text-gray-400 hover:text-white transition-colors">{category}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-8">
          © {new Date().getFullYear()} NewsPortal. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App; // Exporta el componente App como el componente principal de la aplicación.
