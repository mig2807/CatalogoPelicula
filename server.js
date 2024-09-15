const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://mongodb:27017/catalogoPeliculas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Esquema y modelo de películas
const peliculaSchema = new mongoose.Schema({
    nombre: String,
    categoria: String,
    año: Number,
    director: String,
    duracion: Number,
    calificacion: Number
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

// Rutas para operaciones CRUD
app.get('/peliculas', async (req, res) => {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
});

app.get('/peliculas/:id', async (req, res) => {
    const pelicula = await Pelicula.findById(req.params.id);
    res.json(pelicula);
});

app.post('/peliculas', async (req, res) => {
    const pelicula = new Pelicula(req.body);
    await pelicula.save();
    res.json(pelicula);
});

app.put('/peliculas/:id', async (req, res) => {
    const pelicula = await Pelicula.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pelicula);
});

app.delete('/peliculas/:id', async (req, res) => {
    await Pelicula.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pelicula eliminada' });
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
