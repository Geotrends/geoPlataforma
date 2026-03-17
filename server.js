const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos SOLO desde subcarpetas específicas
// Esto evita que express.static intercepte las rutas HTML
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/img_video', express.static(path.join(__dirname, 'public', 'img_video')));
app.use('/cookies', express.static(path.join(__dirname, 'public', 'cookies')));
app.use('/proyectos/data', express.static(path.join(__dirname, 'public', 'html', 'proyectos', 'data')));

// Ruta principal - redirigir a index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Rutas para archivos HTML con extensión (ej: /nosotros.html, /ciudades.html)
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'public', 'html', `${page}.html`);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Rutas para páginas sin extensión .html (ej: /ciudades, /nosotros)
app.get('/:page', (req, res) => {
    const page = req.params.page;
    
    // Excluir rutas de archivos estáticos
    if (page === 'css' || page === 'js' || page === 'img_video') {
        return res.status(404).send('No encontrado');
    }
    
    const filePath = path.join(__dirname, 'public', 'html', `${page}.html`);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Página no encontrada');
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'public')}`);
});
