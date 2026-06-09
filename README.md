# Ferreteria Valdez - Unidad 1

Este proyecto es una pagina web de una ferreteria ficticia llamada Ferreteria Valdez. Se realizo como trabajo para la materia de Desarrollo Web Profesional. La idea principal del sitio es mostrar productos, permitir que el usuario se registre, inicie sesion, mande mensajes y pueda hacer una cotizacion de forma sencilla.

## Que incluye

- Pagina de inicio con informacion del negocio.
- Catalogo de productos con imagen, precio, descripcion y disponibilidad.
- Filtros por categoria, precio y busqueda.
- Paginas de ofertas, servicios, nosotros, ayuda, contacto y mapa del sitio.
- Formulario de contacto con captcha matematico.
- Registro, inicio de sesion y recuperacion de contrasena.
- Pagina 404 personalizada.
- Carrito de compras simulado.
- Boton de cotizacion por WhatsApp.

## Tecnologias usadas

- React
- Vite
- Tailwind CSS
- Node.js
- MongoDB Atlas
- Mongoose

## Persistencia

Los datos principales del proyecto ya se guardan en MongoDB Atlas:

- usuarios registrados
- mensajes de contacto
- productos

El archivo `data/products.json` se conserva como semilla de apoyo para cargar el catalogo inicial si la coleccion de productos esta vacia.

## Como instalar

```bash
npm install
```

## Archivo .env

Se necesita un archivo `.env` en la raiz del proyecto con una variable como esta:

```env
MONGODB_URI=tu_cadena_de_conexion
```

## Como ejecutarlo

Para iniciar el proyecto en modo normal:

```bash
npm run build
npm start
```

Despues abre esta direccion en tu navegador:

```text
http://localhost:3000
```

## Modo desarrollo

En una terminal:

```bash
npm run api
```

En otra terminal:

```bash
npm run dev
```

## Comprobar que todo esta bien

```bash
npm run build
npm run lint
```

## Autor

- Yahir Alejandro Valdez Lara
- 23040027
- 8 IDGS B
