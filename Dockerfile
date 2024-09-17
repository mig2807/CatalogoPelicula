# Usar una imagen base de Node.js 18
FROM node:18

# Crear el directorio de la aplicación
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias, incluidas las de desarrollo
RUN npm install

# Copiar todo el código fuente al contenedor
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar las pruebas
CMD ["npm", "run", "test"]
