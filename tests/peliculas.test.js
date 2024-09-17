const request = require('supertest');
const { app, server } = require('../server');  // Importa tanto la app como el server
const mongoose = require('mongoose');

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        const url = 'mongodb://mongodb:27017/catalogoPeliculasTest';
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();  // Cierra el servidor después de las pruebas
});

describe('API CRUD Tests for Peliculas', () => {
    let movieId;

    // Test para obtener todas las películas (GET /peliculas)
    it('Debe obtener una lista de películas (GET /peliculas)', async () => {
        const res = await request(app).get('/peliculas');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    // Test para crear una nueva película (POST /peliculas)
    it('Debe crear una nueva película (POST /peliculas)', async () => {
        const newMovie = {
            nombre: 'Inception',
            categoria: 'Ciencia ficción',
            año: 2010,
            director: 'Christopher Nolan',
            duracion: 148,
            calificacion: 9.0
        };

        const res = await request(app).post('/peliculas').send(newMovie);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        movieId = res.body._id;  // Guarda el ID de la película creada para las pruebas posteriores
    });

    // Test para obtener una película por su ID (GET /peliculas/:id)
    it('Debe obtener una película por su ID (GET /peliculas/:id)', async () => {
        const res = await request(app).get(`/peliculas/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', movieId);
    });

    // Test para actualizar una película (PUT /peliculas/:id)
    it('Debe actualizar una película existente (PUT /peliculas/:id)', async () => {
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
    });

    // Test para eliminar una película (DELETE /peliculas/:id)
    it('Debe eliminar una película existente (DELETE /peliculas/:id)', async () => {
        const res = await request(app).delete(`/peliculas/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Pelicula eliminada');
    });
});
