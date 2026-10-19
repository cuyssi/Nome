# ⚙️ Nome — Backend

Este directorio contiene el servidor de **Nome**, desarrollado con **Python y FastAPI**.

El backend proporciona la API que utiliza el frontend y se encarga de las funcionalidades que necesitan procesamiento en el servidor, como la gestión de tareas y el procesamiento de audio mediante reconocimiento de voz.

## 🛠️ Tecnologías

- Python
- FastAPI
- Uvicorn
- spaCy
- Vosk para el reconocimiento de voz
- Expresiones regulares para el procesamiento de texto
- `dateparser` y utilidades auxiliares para el tratamiento de fechas y horas
- `pywebpush` para las notificaciones push

## 📋 Requisitos previos

Necesitas tener instalado:

- **Python 3.11**, recomendado para este proyecto.
- **pip**, el gestor de paquetes de Python.

Comprueba la instalación con:

```bash
python --version
pip --version
```

Si tu sistema no reconoce el comando `python`, prueba con `py` en Windows.

## 🚀 Instalación y configuración

### 1. Accede al directorio del backend

Desde la carpeta raíz del proyecto:

```bash
cd backend
```

### 2. Crea un entorno virtual

En Windows:

```bash
py -3.11 -m venv .venv
```

Actívalo desde PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

O desde Git Bash:

```bash
source .venv/Scripts/activate
```

En Linux o macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instala las dependencias

Con el entorno virtual activado:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Genera las claves VAPID

Nome utiliza claves VAPID para autenticar el servidor que envía las notificaciones push.

Con el entorno virtual activado y situado en la carpeta `backend/`, ejecuta:

```bash
vapid --gen
```

Este comando genera dos archivos:

- `private_key.pem`: clave privada utilizada por el backend.
- `public_key.pem`: clave pública asociada a la clave privada.

**Importante:** no compartas la clave privada ni la subas a GitHub. Cada instalación debe proteger sus propias credenciales.

Para obtener la clave pública en el formato que necesita el frontend, ejecuta:

```bash
vapid --applicationServerKey
```

Copia el valor que devuelve el comando. Lo utilizarás como `VAPID_PUBLIC_KEY`.

### 5. Configura las variables de entorno

Crea un archivo `.env` dentro de `backend/`.

Si el proyecto incluye un archivo `.env.example`, puedes utilizarlo como plantilla.

Configura las variables con los valores generados:

```env
VAPID_PUBLIC_KEY=PEGA_AQUI_LA_CLAVE_PUBLICA
VAPID_PRIVATE_KEY=private_key.pem
```

Sustituye `PEGA_AQUI_LA_CLAVE_PUBLICA` por el valor obtenido en el paso anterior.

La ruta `private_key.pem` debe corresponder al archivo generado y estar disponible desde el directorio de ejecución del backend.

No subas el archivo `.env` ni la clave privada al repositorio.

### 6. Inicia el servidor

Desde el directorio `backend/`, con el entorno virtual activado:

```bash
uvicorn main:app --reload
```

Si el servidor se inicia correctamente, normalmente podrás acceder a la API en:

http://127.0.0.1:8000

FastAPI también ofrece documentación interactiva de los endpoints en:

http://127.0.0.1:8000/docs

## 🎙️ Reconocimiento de voz

Nome utiliza **Vosk** para transcribir audio en español.

El modelo de reconocimiento se utiliza desde el backend. Si no está disponible automáticamente, comprueba la configuración y la ubicación del modelo de Vosk que espera la aplicación.

## 🧠 Procesamiento del lenguaje

El backend combina herramientas de procesamiento de texto para interpretar las tareas introducidas por el usuario, incluyendo:

- Extracción de fechas y horas.
- Limpieza del texto reconocido.
- Clasificación y tratamiento de la información de las tareas.

Entre las herramientas utilizadas se encuentran spaCy y expresiones regulares.

## 🔗 Conexión con el frontend

El frontend debe utilizar la dirección del backend mediante la variable `VITE_API_URL` de su archivo `.env`.

La clave pública VAPID también debe estar disponible para el frontend en el formato que espera la aplicación.

Este README contiene las instrucciones para el backend. Para configurar y arrancar la interfaz, consulta el [README del frontend](../frontend/README.md).

## 📝 Notas

- Activa el entorno virtual antes de ejecutar el servidor.
- No subas archivos `.env`, claves privadas ni otros secretos al repositorio.
- La clave pública y la privada deben pertenecer al mismo par.
- Si generas un nuevo par de claves, tendrás que actualizar la configuración del frontend y revisar las suscripciones push existentes.
- Las notificaciones push pueden requerir HTTPS cuando se prueban fuera de `localhost`.

---

*Nome es un proyecto personal en desarrollo, creado con fines educativos.*
