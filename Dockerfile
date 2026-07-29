FROM node:22-alpine

WORKDIR /app

# 1. Copiamos ÚNICAMENTE los archivos de definición de dependencias
# (Es crítico que package-lock.json exista en la raíz de tu proyecto local)
COPY package.json package-lock.json ./

# 2. Ejecutamos npm ci para una instalación exacta y ultra rápida
RUN npm ci

# 3. Copiamos el resto del código fuente a la imagen
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Arrancamos Vite asegurando la escucha en 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]