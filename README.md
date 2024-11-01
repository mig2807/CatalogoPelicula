# Catálogo de Películas

Este proyecto contiene una API para gestionar un catálogo de películas, utilizando MongoDB como base de datos. La aplicación se ejecuta dentro de contenedores Docker.

## Instrucciones para ejecutar el proyecto

### Opción 1: Usando `docker pull` y `docker run`

1. Realiza un `pull` de la imagen del API desde Docker Hub:

   ```bash
   docker pull jhonca7/catalogopelicula:latest

Inicia un contenedor de MongoDB:

docker run -d --name mongodb -p 27017:27017 mongo:7.0

Inicia el contenedor del API y conéctalo a MongoDB:
docker run -d -p 3000:3000 --name catalogo_api --env MONGO_URI=mongodb://host.docker.internal:27017/catalogoPeliculas jhonca7/catalogopelicula:latest

Opción 2: Usando docker-compose
Descarga el archivo docker-compose.yml en tu dispositivo desde el siguiente enlace:

Descargar docker-compose.yml <!-- Asegúrate de actualizar este enlace con la ruta correcta al archivo -->

Ejecuta el siguiente comando para levantar los servicios:
docker-compose up -d


Este comando iniciará tanto MongoDB como el API en contenedores separados, utilizando las configuraciones especificadas en el archivo docker-compose.yml.

Puertos
El API está disponible en el puerto 3000.
MongoDB está disponible en el puerto 27017.
Requisitos previos
Tener Docker instalado en tu máquina.
Opcionalmente, tener docker-compose instalado si deseas usar la segunda opción.