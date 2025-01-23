# Usa la imagen base de Node.js
FROM node:18

RUN npm install -g @vue/cli

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY ./ ./

# Instala las dependencias del proyecto
RUN npm install

# Expone el puerto en el que correrá el servidor (ajusta según tu configuración)
EXPOSE 5473

# Comando para iniciar el servidor
CMD ["npm", "run", "dev"]