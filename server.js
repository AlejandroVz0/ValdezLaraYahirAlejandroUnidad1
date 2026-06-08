import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.dirname(url.fileURLToPath(import.meta.url));
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const jsonPath = (name) => path.join(DATA_DIR, name);

function readJson(name, fallback) {
  try {
    const value = JSON.parse(fs.readFileSync(jsonPath(name), 'utf8'));
    return Array.isArray(fallback) && !Array.isArray(value) ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeJson(name, value) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(jsonPath(name), JSON.stringify(value, null, 2), 'utf8');
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

function handleProducts(req, res, parsed) {
  let products = readJson('products.json', []);
  const { query, category, minPrice, maxPrice, available, offer } = parsed.query;

  if (query) {
    const q = normalize(query);
    products = products.filter((p) =>
      normalize(p.name).includes(q) ||
      normalize(p.brand).includes(q) ||
      normalize(p.description).includes(q) ||
      normalize(p.category).includes(q)
    );
  }
  if (category) products = products.filter((p) => normalize(p.category) === normalize(category));
  if (minPrice && !Number.isNaN(Number(minPrice))) products = products.filter((p) => Number(p.price) >= Number(minPrice));
  if (maxPrice && !Number.isNaN(Number(maxPrice))) products = products.filter((p) => Number(p.price) <= Number(maxPrice));
  if (available === 'true') products = products.filter((p) => Number(p.stock || 0) > 0);
  if (available === 'false') products = products.filter((p) => Number(p.stock || 0) <= 0);
  if (offer === 'true') products = products.filter((p) => Boolean(p.isOffer));

  sendJson(res, 200, products);
}

async function handleApi(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (req.method === 'GET' && pathname === '/api/products') {
    handleProducts(req, res, parsed);
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
      sendJson(res, 400, { success: false, message: 'Correo inválido' });
      return;
    }
    if (!/^\d{7,15}$/.test(String(phone))) {
      sendJson(res, 400, { success: false, message: 'Teléfono inválido' });
      return;
    }
    if (String(password).length < 8) {
      sendJson(res, 400, { success: false, message: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    const users = readJson('users.json', []);
    if (users.some((u) => normalize(u.email) === normalize(email))) {
      sendJson(res, 400, { success: false, message: 'El correo ya est? registrado' });
      return;
    }
    const user = { id: Date.now(), name, email, phone, password };
    users.push(user);
    writeJson('users.json', users);
    sendJson(res, 200, { success: true, message: 'Registro exitoso', name: user.name });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    const data = await parseBody(req);
    const users = readJson('users.json', []);
    const user = users.find((u) => normalize(u.email) === normalize(data.email) && u.password === data.password);
    if (!user) {
      sendJson(res, 401, { success: false, message: 'Usuario o contraseña incorrectos' });
      return;
    }
    sendJson(res, 200, { success: true, message: 'Inicio de sesión correcto', name: user.name });
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
      sendJson(res, 400, { success: false, message: 'Correo inválido' });
      return;
    }
    if (phone && !/^\d{7,15}$/.test(String(phone))) {
      sendJson(res, 400, { success: false, message: 'Teléfono inválido' });
      return;
    }
    const messages = readJson('messages.json', []);
    messages.push({ id: Date.now(), name, email, phone: phone || '', message });
    writeJson('messages.json', messages);
    sendJson(res, 200, { success: true, message: 'Mensaje enviado' });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/recover') {
    const data = await parseBody(req);
    if (!/^\S+@\S+\.\S+$/.test(String(data.email || ''))) {
      sendJson(res, 400, { success: false, message: 'Correo inválido' });
      return;
    }
    const users = readJson('users.json', []);
    const exists = users.some((u) => normalize(u.email) === normalize(data.email));
    if (!exists) {
      sendJson(res, 404, { success: false, message: 'Correo no encontrado' });
      return;
    }
    sendJson(res, 200, { success: true, message: 'Se ha enviado un correo para restablecer la contraseña (simulado)' });
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
    '.ico': 'image/x-icon'
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

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname || '/');

  if (pathname.startsWith('/api/')) {
    handleApi(req, res);
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
  res.end('La aplicación React aún no está compilada. Ejecuta npm install y npm run build antes de npm start.');
});

server.listen(PORT, () => {
  console.log(`Servidor Ferretería Valdez en http://localhost:${PORT}`);
});
