const request = require('supertest');
const { app, server } = require('../server');  // Importa tanto la app como el server
const mongoose = require('mongoose');

// Aumenta el tiempo de espera global para Jest a 20 segundos (20000 ms)
jest.setTimeout(20000);

// Conexión a la base de datos antes de las pruebas
beforeAll(async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            const url = process.env.MONGO_URI || 'mongodb://mongodb:27017/catalogoPeliculasTest';
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos en beforeAll:', error);
        throw error;
    }
});

// Cierra la conexión a la base de datos y el servidor después de las pruebas
afterAll(async () => {
    try {
        await mongoose.connection.close();
        server.close();  // Cierra el servidor después de las pruebas
    } catch (error) {
        console.error('Error al cerrar la base de datos o el servidor en afterAll:', error);
    }
});

describe('API CRUD Tests for Peliculas', () => {
    let movieId;

    // Test para obtener todas las películas (GET /peliculas)
    it('Debe obtener una lista de películas (GET /peliculas)', async () => {
        try {
            const res = await request(app).get('/peliculas');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        } catch (error) {
            console.error('Error en el test para obtener todas las películas:', error);
            throw error;
        }
    }, 20000);  // Tiempo de espera individual

    // Test para crear una nueva película (POST /peliculas)
    it('Debe crear una nueva película (POST /peliculas)', async () => {
        try {
            const newMovie = {
                nombre: 'Inception',
                categoria: 'Ciencia ficción',
                año: 2010,
                director: 'Christopher Nolan',
                duracion: 148,
                calificacion: 9.0
            };

            const res = await request(app).post('/peliculas').send(newMovie);
            expect(res.statusCode).toEqual(201);  // Cambiado a 201, ya que es el código correcto para "created"
            expect(res.body).toHaveProperty('_id');
            movieId = res.body._id;  // Guarda el ID de la película creada para las pruebas posteriores
        } catch (error) {
            console.error('Error en el test para crear una nueva película:', error);
            throw error;
        }
    }, 20000);

    // Test para obtener una película por su ID (GET /peliculas/:id)
    it('Debe obtener una película por su ID (GET /peliculas/:id)', async () => {
        try {
            const res = await request(app).get(`/peliculas/${movieId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('_id', movieId);
        } catch (error) {
            console.error('Error en el test para obtener una película por su ID:', error);
            throw error;
        }
    }, 20000);

    // Test para actualizar una película (PUT /peliculas/:id)
    it('Debe actualizar una película existente (PUT /peliculas/:id)', async () => {
        try {
            const updatedMovie = {
                nombre: 'Inception (Updated)',
                categoria: 'Ciencia ficción',
                año: 2010,
                director: 'Christopher Nolan',
                duracion: 148,
                calificacion: 9.5
            };

            const res = await request(app).put(`/peliculas/${movieId}`).send(updatedMovie);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('nombre', 'Inception (Updated)');
        } catch (error) {
            console.error('Error en el test para actualizar una película:', error);
            throw error;
        }
    }, 20000);

    // Test para eliminar una película (DELETE /peliculas/:id)
    it('Debe eliminar una película existente (DELETE /peliculas/:id)', async () => {
        try {
            const res = await request(app).delete(`/peliculas/${movieId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Película eliminada');  // Ajuste de "Pelicula" a "Película"
        } catch (error) {
            console.error('Error en el test para eliminar una película:', error);
            throw error;
        }
    }, 20000);

});
