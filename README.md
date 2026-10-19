# Nome

# 🧩 Nome — Proyecto en construcción

> Este proyecto está en desarrollo. Nació de una necesidad real: ayudar a una persona con TDA a organizar sus tareas y citas de manera más clara, visual y accesible. A la vez, me está sirviendo como espacio de aprendizaje mientras exploro nuevas tecnologías en desarrollo web.

---

![Captura de Nome 1](https://github.com/user-attachments/assets/c04985d5-97a3-4a26-b68e-aa673ed3fd4b)
![Captura de Nome 2](https://github.com/user-attachments/assets/14697f45-32f0-4d44-af4a-c60071f1f932)
![Captura de Nome 3](https://github.com/user-attachments/assets/5b433abd-3950-4aa6-b365-a7431175acff)
![Captura de Nome 4](https://github.com/user-attachments/assets/96fee3bb-4dd9-4d1c-8eee-0e0e22c31da9)
![Captura de Nome 5](https://github.com/user-attachments/assets/4a952055-4770-4fc8-9262-faecad46ea20)
![Captura de Nome 6](https://github.com/user-attachments/assets/a0373e77-ccb2-4f88-85be-bad34f0d6762)

*Estilos provisionales no definitivos.*

---

## 💡 ¿Qué es Nome?

**Nome** es una agenda escolar juvenil, pensada para adolescentes, que permite al usuario crear tareas tanto **por voz** como **manualmente**. Las tareas se procesan automáticamente para extraer **fecha, hora y texto limpio**, gracias a herramientas como **spaCy**, expresiones regulares y un motor de búsqueda de fechas (`searchDate`).

Por ejemplo, si dices:

> "Quedé con Marcos mañana a las seis y diez de la tarde en las canchas"

La app creará automáticamente:

- **Fecha:** mañana (14/9)
- **Hora:** 18:10
- **Texto limpio:** "Quedé con Marcos en las canchas"

Además, las tareas se pueden configurar con múltiples opciones: notificaciones, repeticiones, colores, recordatorios previos y avisos el día anterior, entre otras, para prevenir despistes.

## 🗂️ Organización de tareas

Nome clasifica las tareas automáticamente según **palabras clave**:

- **Citas**
  - `Citas`
  - `Médico`
  - `Otros`
- **Deberes**
  - `Deberes`
  - `Trabajos`
  - `Exámenes`

Cada tarea se guarda en el apartado correspondiente, y el sistema permite visualizar todas las tareas en:

- **Lista por tipo:** `Citas` o `Deberes`.
- **Calendario:** muestra las tareas no eliminadas con un sistema de puntos de colores:
  - Verde → todas las tareas del día están completas.
  - Rojo → hay tareas pendientes.

---

## ⏰ Notificaciones y recordatorios

- Cada tarea genera por defecto una **notificación 15 minutos antes** de su hora.
- Se pueden configurar:
  - Hora de la notificación.
  - Repetición (`una vez`, `diaria`, `lunes a viernes` o personalizada).
  - Tiempo previo al evento.
  - Recordatorio el día anterior.

---

## 🎒 Sección Mochilas / Planificación escolar y otros escenarios

- Los usuarios pueden configurar su **horario escolar**.
- La sección Mochilas genera automáticamente recordatorios diarios a las 20:00 mostrando los **ítems del día siguiente** mediante listas de verificación.
- Mochilas predeterminadas: `Clase`, `Gimnasio`, `Piscina` y `Playa`.
- Se pueden crear mochilas **personalizadas**, editando:
  - Color de la mochila.
  - Ítems de la lista.
  - Hora de notificación.
- Todos los ítems son marcables, editables y se pueden añadir o quitar según las necesidades.

---

## 🧠 Tutoriales y ayuda

- Sistema de tutoriales integrado en cada sección para guiar al usuario.
- Apartado de ayuda con manuales y guías dentro de la aplicación.

---

## ⚙️ Estado actual

- ✅ Creación de tareas por **voz y manualmente**.
- ✅ Extracción automática de fecha, hora y texto limpio.
- ✅ Clasificación automática en citas o deberes y subcategorías.
- ✅ Notificaciones configurables y recordatorios.
- ✅ Calendario visual de tareas.
- ✅ Sección Mochilas con ítems predeterminados y personalizables.
- ✅ Tutoriales guiados en la aplicación.
- ✅ Backend con FastAPI para la gestión de tareas y audios.
- ✅ Transcripción de voz mediante Vosk.
- ✅ Apartado de ayuda con manuales y guías.
- ✅ Modo claro y oscuro para la interfaz.

---

## 🔜 Próximamente / En desarrollo

- Mejorar el reconocimiento de expresiones naturales para que el usuario pueda hablar libremente.
- Reducir el tiempo de procesamiento.
- Explorar la integración con Google Home.

---

## 🛠️ Tecnología usada

- **Frontend:** React (Vite), JavaScript y Tailwind CSS.
- **Backend:** FastAPI y Python.
- **Persistencia:** localStorage.
- **Reconocimiento de voz:** Vosk.
- **Procesamiento del lenguaje:** spaCy y expresiones regulares.

---

## 🚀 Cómo descargar y ejecutar el proyecto

1. Descarga el proyecto desde GitHub mediante **Code → Download ZIP**, o clónalo con Git:

   ```bash
   git clone https://github.com/cuyssi/Nome.git
   ```

2. Si has descargado el ZIP, descomprímelo.

3. Encontrarás dos carpetas principales:

   - **[Frontend](./frontend/README.md)**: contiene la interfaz de usuario y las instrucciones de instalación y ejecución en local.
   - **[Backend](./backend/README.md)**: contiene el servidor y las instrucciones de instalación y configuración.

Consulta la documentación de cada apartado para configurar y ejecutar Nome en local.

---

*Este proyecto se comparte con fines educativos y personales 😉*
