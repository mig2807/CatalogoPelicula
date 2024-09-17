const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();  // Carga las variables de entorno

const app = express();
app.use(express.json());

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/catalogoPeliculas';  // Usa la variable de entorno o el nombre del servicio en Docker

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema y modelo de películas
const peliculaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    año: { type: Number, required: true },
    director: { type: String, required: true },
    duracion: { type: Number, required: true },
    calificacion: { type: Number, required: true }
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

// Rutas para operaciones CRUD
app.get('/peliculas', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener películas', error: err });
    }
});

app.get('/peliculas/:id', async (req, res) => {
    try {
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) return res.status(404).json({ message: 'Película no encontrada' });
        res.json(pelicula);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la película', error: err });
    }
});

app.post('/peliculas', async (req, res) => {
    try {
        const pelicula = new Pelicula(req.body);
        await pelicula.save();
        res.status(201).json(pelicula);
    } catch (err) {
        res.status(400).json({ message: 'Error al crear película', error: err });
    }
});

app.put('/peliculas/:id', async (req, res) => {
    try {
        const pelicula = await Pelicula.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pelicula) return res.status(404).json({ message: 'Película no encontrada' });
        res.json(pelicula);
    } catch (err) {
        res.status(400).json({ message: 'Error al actualizar película', error: err });
    }
});

app.delete('/peliculas/:id', async (req, res) => {
    try {
        const pelicula = await Pelicula.findByIdAndDelete(req.params.id);
        if (!pelicula) return res.status(404).json({ message: 'Película no encontrada' });
        res.json({ message: 'Película eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar película', error: err });
    }
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Exporta tanto la app como el servidor para las pruebas
module.exports = { app, server };
