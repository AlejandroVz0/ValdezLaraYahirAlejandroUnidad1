import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.dirname(url.fileURLToPath(import.meta.url));
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const MONGODB_URI = process.env.MONGODB_URI || '';

const jsonPath = (name) => path.join(DATA_DIR, name);

function readJson(name, fallback) {
  try {
    return JSON.parse(fs.readFileSync(jsonPath(name), 'utf8'));
  } catch {
    return fallback;
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      try {
        if ((req.headers['content-type'] || '').includes('application/json')) {
          resolve(JSON.parse(body || '{}'));
        } else {
          resolve(Object.fromEntries(new URLSearchParams(body)));
        }
      } catch {
        resolve({});
      }
    });
  });
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function repairText(value) {
  if (typeof value !== 'string') return value;

  const replacements = [
    ['Ã¡', 'á'],
    ['Ã©', 'é'],
    ['Ã­', 'í'],
    ['Ã³', 'ó'],
    ['Ãº', 'ú'],
    ['Ã', 'Á'],
    ['Ã‰', 'É'],
    ['Ã', 'Í'],
    ['Ã“', 'Ó'],
    ['Ãš', 'Ú'],
    ['Ã±', 'ñ'],
    ['Ã‘', 'Ñ'],
    ['Ã¼', 'ü'],
    ['Ãœ', 'Ü'],
    ['Â¿', '¿'],
    ['Â¡', '¡'],
    ['Â³', '³'],
  ];

  return replacements.reduce((current, [broken, fixed]) => current.split(broken).join(fixed), value);
}

function sanitizeProduct(product) {
  return {
    ...product,
    name: repairText(product.name),
    brand: repairText(product.brand),
    description: repairText(product.description),
    category: repairText(product.category),
  };
}

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    isOffer: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

async function connectDatabase() {
  if (!MONGODB_URI) {
    throw new Error('Falta la variable MONGODB_URI en tu entorno.');
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: 'ferreteria_valdez',
  });

  const existingProducts = await Product.countDocuments();
  if (existingProducts === 0) {
    const seedProducts = readJson('products.json', []);
    if (Array.isArray(seedProducts) && seedProducts.length > 0) {
      await Product.insertMany(seedProducts, { ordered: false });
    }
  }
}

async function handleProducts(res, parsed) {
  const { query, category, minPrice, maxPrice, available, offer } = parsed.query;
  const filters = {};

  if (category) filters.category = new RegExp(`^${String(category)}$`, 'i');
  if (available === 'true') filters.stock = { $gt: 0 };
  if (available === 'false') filters.stock = { $lte: 0 };
  if (offer === 'true') filters.isOffer = true;

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice && !Number.isNaN(Number(minPrice))) filters.price.$gte = Number(minPrice);
    if (maxPrice && !Number.isNaN(Number(maxPrice))) filters.price.$lte = Number(maxPrice);
  }

  let products = await Product.find(filters).lean();

  if (query) {
    const q = normalize(query);
    products = products.filter((p) =>
      normalize(p.name).includes(q) ||
      normalize(p.brand).includes(q) ||
      normalize(p.description).includes(q) ||
      normalize(p.category).includes(q)
    );
  }

  sendJson(res, 200, products.map(sanitizeProduct));
}

async function handleApi(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (req.method === 'GET' && pathname === '/api/products') {
    await handleProducts(res, parsed);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/register') {
    const data = await parseBody(req);
    const { name, email, phone, password } = data;

    if (!name || !email || !phone || !password) {
      sendJson(res, 400, { success: false, message: 'Faltan campos obligatorios' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(String(email))) {
      sendJson(res, 400, { success: false, message: 'Correo invalido' });
      return;
    }
    if (!/^\d{7,15}$/.test(String(phone))) {
      sendJson(res, 400, { success: false, message: 'Telefono invalido' });
      return;
    }
    if (String(password).length < 8) {
      sendJson(res, 400, { success: false, message: 'La contrasena debe tener al menos 8 caracteres' });
      return;
    }

    const existingUser = await User.findOne({ email: new RegExp(`^${String(email)}$`, 'i') }).lean();
    if (existingUser) {
      sendJson(res, 400, { success: false, message: 'El correo ya esta registrado' });
      return;
    }

    const user = await User.create({ name, email, phone, password });
    sendJson(res, 200, { success: true, message: 'Registro exitoso', name: user.name });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    const data = await parseBody(req);
    const user = await User.findOne({
      email: new RegExp(`^${String(data.email || '')}$`, 'i'),
      password: String(data.password || ''),
    }).lean();

    if (!user) {
      sendJson(res, 401, { success: false, message: 'Usuario o contrasena incorrectos' });
      return;
    }

    sendJson(res, 200, { success: true, message: 'Inicio de sesion correcto', name: user.name });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/contact') {
    const data = await parseBody(req);
    const { name, email, phone, message } = data;

    if (!name || !email || !message) {
      sendJson(res, 400, { success: false, message: 'Faltan campos obligatorios' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(String(email))) {
      sendJson(res, 400, { success: false, message: 'Correo invalido' });
      return;
    }
    if (phone && !/^\d{7,15}$/.test(String(phone))) {
      sendJson(res, 400, { success: false, message: 'Telefono invalido' });
      return;
    }

    await Message.create({ name, email, phone: phone || '', message });
    sendJson(res, 200, { success: true, message: 'Mensaje enviado' });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/recover') {
    const data = await parseBody(req);
    const { email, phone, newPassword } = data;

    if (!/^\S+@\S+\.\S+$/.test(String(email || ''))) {
      sendJson(res, 400, { success: false, message: 'Correo invalido' });
      return;
    }

    if (!/^\d{7,15}$/.test(String(phone || ''))) {
      sendJson(res, 400, { success: false, message: 'Telefono invalido' });
      return;
    }

    const user = await User.findOne({
      email: new RegExp(`^${String(email)}$`, 'i'),
      phone: String(phone || ''),
    });
    if (!user) {
      sendJson(res, 404, { success: false, message: 'No encontramos una cuenta con ese correo y telefono' });
      return;
    }

    if (!newPassword) {
      sendJson(res, 200, {
        success: true,
        message: 'Datos verificados. Ahora puedes crear una nueva contrasena.',
      });
      return;
    }

    if (String(newPassword).length < 8) {
      sendJson(res, 400, { success: false, message: 'La contrasena debe tener al menos 8 caracteres' });
      return;
    }

    user.password = String(newPassword);
    await user.save();
    sendJson(res, 200, {
      success: true,
      message: 'Contrasena actualizada correctamente. Ya puedes iniciar sesion.',
    });
    return;
  }

  sendJson(res, 404, { success: false, message: 'Endpoint no encontrado' });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
  }[ext] || 'application/octet-stream';
}

function serveFile(res, filePath, status = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { success: false, message: 'Archivo no encontrado' });
      return;
    }
    res.writeHead(status, { 'Content-Type': contentType(filePath) });
    res.end(data);
  });
}

const knownRoutes = new Set(['/', '/products', '/categories', '/offers', '/services', '/about', '/help', '/contact', '/buzon', '/login', '/register', '/recover', '/sitemap', '/404']);

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname || '/');

  if (pathname.startsWith('/api/')) {
    try {
      await handleApi(req, res);
    } catch (error) {
      console.error('Error API:', error);
      sendJson(res, 500, { success: false, message: 'Error interno del servidor' });
    }
    return;
  }

  const publicPath = path.join(PUBLIC_DIR, pathname.replace(/^\//, ''));
  if (pathname.startsWith('/images/') && fs.existsSync(publicPath)) {
    serveFile(res, publicPath);
    return;
  }

  const distPath = path.join(DIST_DIR, pathname.replace(/^\//, ''));
  if (pathname !== '/' && fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
    serveFile(res, distPath);
    return;
  }

  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    serveFile(res, indexPath, knownRoutes.has(pathname) && pathname !== '/404' ? 200 : 404);
    return;
  }

  res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('La aplicacion React aun no esta compilada. Ejecuta npm install y npm run build antes de npm start.');
});

async function startServer() {
  try {
    await connectDatabase();
    server.listen(PORT, () => {
      console.log(`Servidor Ferreteria Valdez en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la conexion con MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
