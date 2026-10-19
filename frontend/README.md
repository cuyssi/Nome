# 🖥️ Nome — Frontend

Este directorio contiene la interfaz de usuario de **Nome**, una agenda escolar juvenil que permite organizar tareas y citas mediante voz o introducción manual.

El frontend está desarrollado con **React, Vite y JavaScript**, y se comunica con el backend para gestionar las tareas y las funcionalidades que requieren el servidor.

## 🛠️ Tecnologías

- React
- JavaScript
- Vite
- Tailwind CSS
- Zustand para la gestión del estado
- Axios para las peticiones HTTP
- React Router para la navegación
- Vite PWA para las funcionalidades de aplicación web progresiva

## 📋 Requisitos previos

Antes de empezar, necesitas tener instalado:

- **Node.js**, preferiblemente una versión LTS compatible con las dependencias del proyecto.
- **npm**, incluido con Node.js.

Puedes comprobar que están instalados ejecutando:

```bash
node -v
npm -v
```

Si no los tienes, puedes descargarlos desde la web oficial:

https://nodejs.org/

## 🚀 Instalación y ejecución

### 1. Accede al directorio del frontend

Desde la carpeta raíz del proyecto:

```bash
cd frontend
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura la conexión con el backend

Si el proyecto incluye un archivo `.env.example`, utilízalo como plantilla para crear un archivo llamado `.env` dentro de la carpeta `frontend/`.

Configura la dirección del backend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Esta variable indica la dirección del backend que utilizará el frontend durante el desarrollo local.

Si ejecutas el backend en otra dirección o puerto, tendrás que adaptar este valor.

### 4. Inicia el servidor de desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local desde la que puedes abrir la aplicación. Normalmente será:

http://localhost:5173

Mantén abierta la terminal mientras utilizas la aplicación.

## 🔗 Conexión con el backend

El frontend necesita que el backend esté en funcionamiento para utilizar las funcionalidades que dependen del servidor, como la gestión de tareas mediante la API y el procesamiento de audio.

Asegúrate de iniciar también el backend siguiendo las instrucciones de `../backend/README.md`.

## 🧪 Otros comandos

Los comandos disponibles dependen de los scripts definidos en `package.json`. Los habituales en este proyecto son:

```bash
npm run dev
npm run build
npm run preview
```

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la versión de producción.
- `npm run preview`: permite previsualizar la compilación de producción.

## 📝 Notas

- El archivo `.env` contiene configuración local y no debe subirse al repositorio.
- La dirección `VITE_API_URL` debe coincidir con la dirección en la que se ejecuta el backend.
- Asegúrate de iniciar también el backend siguiendo las instrucciones del [README del backend](../backend/README.md).

---

*Nome es un proyecto personal en desarrollo, creado con fines educativos.*
