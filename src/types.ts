export type Page = 'home' | 'products' | 'categories' | 'offers' | 'services' | 'about' | 'help' | 'login' | 'register' | 'recover' | 'sitemap' | 'error404' | 'contact';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  isOffer?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SitemapItem {
  name: string;
  targetView: Page;
}

export interface SitemapGroup {
  title: string;
  icon: string;
  items: SitemapItem[];
}

export interface CategoryDetail {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  isLarge?: boolean;
  color?: string;
}

export const CATEGORIES: CategoryDetail[] = [
  { id: '1', name: 'Herramientas Manuales', iconName: 'hammer', description: 'Herramientas de mano de alta duración', color: '#ff8c00' },
  { id: '2', name: 'Herramientas Eléctricas', iconName: 'handyman', description: 'Taladros, esmeriles, sierras y equipos de poder', isLarge: true, color: '#ff8c00' },
  { id: '3', name: 'Plomería', iconName: 'plumbing', description: 'Tuberías, conexiones y refacciones para agua', color: '#333333' },
  { id: '4', name: 'Electricidad', iconName: 'bolt', description: 'Cables, interruptores y equipo de control', color: '#333333' },
  { id: '5', name: 'Pintura', iconName: 'format_paint', description: 'Brochas, rodillos y recubrimientos', color: '#333333' },
  { id: '6', name: 'Construcción', iconName: 'construction', description: 'Materiales pesados, andamios y equipo industrial', isLarge: true, color: '#333333' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Taladro Percutor Inalámbrico 20V Max',
    brand: 'DeWalt',
    description: 'Incluye 2 baterías de litio y cargador rápido. Ideal para concreto y mampostería profesional.',
    price: 3450,
    originalPrice: 4100,
    category: 'Herramientas Eléctricas',
    image: '/assets/products/prod-01.png',
    stock: 15,
    isOffer: true,
  },
  {
    id: 'prod-02',
    name: 'Esmeriladora Angular 4-1/2" 840W',
    brand: 'Makita',
    description: 'Motor de alta resistencia al calor. Diseño compacto y ligero para trabajo continuo industrial.',
    price: 1299,
    originalPrice: 1550,
    category: 'Herramientas Eléctricas',
    image: '/assets/products/prod-02.png',
    stock: 8,
  },
  {
    id: 'prod-03',
    name: 'Sierra Circular 7-1/4" 1500W',
    brand: 'Bosch',
    description: 'Corte preciso y potente. Base de aluminio resistente. Incluye disco de carburo de 24 dientes.',
    price: 2850,
    category: 'Herramientas Eléctricas',
    image: '/assets/products/prod-03.png',
    stock: 0,
  },
  {
    id: 'prod-04',
    name: 'Juego de Brocas y Puntas 100 Piezas',
    brand: 'Truper',
    description: 'Estuche de uso rudo con brocas para metal (HSS), madera, mampostería y un set de puntas magnéticas para destornillador.',
    price: 545,
    category: 'Herramientas Manuales',
    image: '/assets/products/prod-04.png',
    stock: 42,
  },
  {
    id: 'prod-05',
    name: 'Lijadora Roto-Orbital 5" 3A',
    brand: 'Milwaukee',
    description: 'Extracción eficiente de polvo. Control electrónico de velocidad variable para acabados ultra suaves en cualquier madera.',
    price: 1890,
    category: 'Herramientas Eléctricas',
    image: '/assets/products/prod-05.png',
    stock: 10,
  },
  {
    id: 'prod-06',
    name: 'Soldadora Inversora 130A 110V/220V',
    brand: 'Lincoln Electric',
    description: 'Bi-voltaje automático, súper portátil y ligera. Diseñada para electrodos revestidos de herrería ligera y reparaciones rápidas.',
    price: 4200,
    category: 'Herramientas Eléctricas',
    image: '/assets/products/prod-06.png',
    stock: 4,
  },
  {
    id: 'prod-07',
    name: 'Nivel Láser de Líneas Cruzadas Verde',
    brand: 'Stabila',
    description: 'Diodo de alta visibilidad autonivelante de líneas verdes cruzadas. Incluye soporte multiusos y estuche de protección contra impactos.',
    price: 3150,
    category: 'Electricidad',
    image: '/assets/products/prod-07.png',
    stock: 2,
  },
  {
    id: 'prod-08',
    name: 'Pistola de Calor 1800W 2 Temperaturas',
    brand: 'Stanley',
    description: 'Soporte integrado para enfriamiento rápido. Ideal para remover pintura, aflojar tuercas apretadas o moldear plásticos.',
    price: 850,
    originalPrice: 990,
    category: 'Herramientas Eléctricas',
    image: '/assets/products/prod-08.png',
    stock: 14,
    isOffer: true,
  },
  // Plumbing Products
  {
    id: 'prod-09',
    name: 'Llave Stillson de 14" Profesional',
    brand: 'Truper',
    description: 'Cuerpo de hierro fundido dúctil de alta resistencia con quijadas forjadas y endurecidas por inducción.',
    price: 380,
    category: 'Plomería',
    image: '/assets/products/prod-09.png',
    stock: 18,
  },
  {
    id: 'prod-10',
    name: 'Cople de Cobre 1/2" (Paquete de 10)',
    brand: 'Iusa',
    description: 'Uniones soldables cobre a cobre de alta resistencia hidráulica para fluidos domésticos e industriales.',
    price: 95,
    category: 'Plomería',
    image: '/assets/products/prod-10.png',
    stock: 50,
  },
  // Electricity Products
  {
    id: 'prod-11',
    name: 'Pinza Amperimétrica Digital Profesional',
    brand: 'Fluke',
    description: 'Medición precisa de corrientes de CA y CC, voltaje de seguridad para electricistas industriales.',
    price: 2450,
    originalPrice: 2800,
    category: 'Electricidad',
    image: '/assets/products/prod-11.png',
    stock: 5,
    isOffer: true,
  },
  {
    id: 'prod-12',
    name: 'Cinta Aislante Súper 33+ Profesional',
    brand: '3M',
    description: 'Cinta de vinilo elástica de grado premium que ofrece excelente protección dieléctrica y resistencia climática.',
    price: 85,
    category: 'Electricidad',
    image: '/assets/products/prod-12.png',
    stock: 120,
  },
  // Paint Products
  {
    id: 'prod-13',
    name: 'Cubeta Pintura Vinílica Blanca 19L',
    brand: 'Comex',
    description: 'Pintura vinil-acrílica de gran cubrimiento, ideal para interiores y exteriores. Excelente resistencia al lavado.',
    price: 1850,
    category: 'Pintura',
    image: '/assets/products/prod-13.png',
    stock: 12,
  },
  {
    id: 'prod-14',
    name: 'Kit de Rodón y Rodillo de Microfibra',
    brand: 'Comex',
    description: 'Maneral ergonómico reforzado y repuesto de microfibra antiderrames para acabados lisos impecables.',
    price: 195,
    category: 'Pintura',
    image: '/assets/products/prod-14.png',
    stock: 30,
  },
  // Construction Products
  {
    id: 'prod-15',
    name: 'Carretilla de Escucha 5.5 ft³ de Chapa',
    brand: 'Truper',
    description: 'Llanta neumática premium de alta tracción y bastidor de tubo de acero reforzado con soportes frontales.',
    price: 1150,
    category: 'Construcción',
    image: '/assets/products/prod-15.png',
    stock: 6,
  },
  {
    id: 'prod-16',
    name: 'Arnés de Carga de 3 Argollas Cómodo',
    brand: 'Urrea',
    description: 'Arnés anticaídas con correas acolchadas en hombros y piernas. Certificación oficial contra accidentes de altura.',
    price: 980,
    originalPrice: 1100,
    category: 'Construcción',
    image: '/assets/products/prod-16.png',
    stock: 12,
    isOffer: true,
  },
];

export const SITEMAP_GROUPS: SitemapGroup[] = [
  {
    title: 'Main Sections',
    icon: 'store',
    items: [
      { name: 'Home', targetView: 'home' },
      { name: 'Products', targetView: 'products' },
      { name: 'Categories', targetView: 'categories' },
      { name: 'Offers', targetView: 'offers' },
      { name: 'Services', targetView: 'services' },
      { name: 'About Us', targetView: 'about' },
      { name: 'Contact', targetView: 'contact' },
    ],
  },
  {
    title: 'User Account',
    icon: 'account_circle',
    items: [
      { name: 'Login', targetView: 'login' },
      { name: 'Register', targetView: 'register' },
      { name: 'Password Recovery', targetView: 'recover' },
    ],
  },
  {
    title: 'Help & Support',
    icon: 'help',
    items: [
      { name: 'Help Center', targetView: 'help' },
      { name: 'FAQ', targetView: 'help' },
      { name: 'Sitemap', targetView: 'sitemap' },
      { name: 'Message Box (Contact)', targetView: 'contact' },
    ],
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: '¿Dónde están ubicados física y geográficamente?',
    answer: 'Nuestra tienda de Ferretería Valdez está ubicada orgullosamente en Ramos Arizpe, Coahuila, México. Desde 2010 equipamos y asesoramos los proyectos de construcción más importantes de la región.',
  },
  {
    question: '¿Cuentan con servicio a domicilio o fletes?',
    answer: 'Sí, contamos con fletes para materiales pesados de construcción y entregas directas a domicilio para herramientas o consumibles dentro de Ramos Arizpe y zonas circundantes de Saltillo.',
  },
  {
    question: '¿Cómo puedo ponerme en contacto directo para cotizaciones?',
    answer: 'Puedes usar los botones "WhatsApp" de cada producto para enviarnos un chat pre-configurado de inmediato, o visitarnos en nuestra sucursal. También puedes enviarnos un mensaje desde nuestro buzón de contacto.',
  },
  {
    question: '¿Cuáles son las políticas de devolución y garantía?',
    answer: 'Todos nuestros productos cuentan con garantía directa del fabricante (Bosch, DeWalt, Makita, Truper, etc.). Si tienes un desperfecto, puedes acudir a tienda con tu boleto de compra para validar el cambio físico o canalización con centros autorizados de servicio técnico.',
  },
  {
    question: '¿Hacen facturación de mis compras por internet o tienda física?',
    answer: 'Sí, emitimos facturas de validez oficial mexicana (CFDI). Al momento de realizar tu compra en nuestra sucursal o contactarnos por medios digitales, nos proporcionas tus datos fiscales RFC y te enviaremos la factura al instante.',
  },
];
