# GeoPlataforma - Servidor Node.js

Plataforma web de GeoPlataforma especializada en Ingeniería Acústica y Analítica Geoespacial.

## 🚀 Inicio Rápido

### Instalación

1. Instalar dependencias:
```bash
npm install
```

### Ejecutar Servidor

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
geoPlataforma/
├── public/              # Archivos estáticos
│   ├── css/            # Estilos
│   ├── html/           # Páginas HTML
│   ├── js/             # JavaScript
│   └── img_video/      # Imágenes y videos
├── server.js           # Servidor Node.js/Express
├── package.json        # Dependencias
└── vercel.json         # Configuración Vercel
```

## 🔧 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **HTML5/CSS3/JavaScript** - Frontend

## 📝 Notas

- Todas las rutas relativas se mantienen intactas
- El CSS y responsive no se han modificado
- El servidor sirve archivos estáticos desde `public/`

## 🌐 Despliegue

### Vercel
El proyecto está configurado para Vercel. Solo necesitas hacer push a tu repositorio.

### Otros Servidores
Asegúrate de que el servidor ejecute `npm start` o `node server.js` en el puerto configurado.

git add public/js/inicio/inicio.js public/js/nav.js public/js/scroll-top.js
git commit -m "perf: smooth scroll optimizations for home/navbar/scroll-top"
git push origin main
