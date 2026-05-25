const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// 3. RUTAS DE LA API (Organizadas)
const usuariosRoutes = require('./rutas/usuarios.rutas');
const packsRoutes = require('./rutas/packs.rutas');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/packs', packsRoutes); // <--- SOLO ESTA para los packs

// 4. Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});