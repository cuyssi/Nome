# Nome
# 🧩 Nome — Proyecto en construcción

> Este proyecto está en desarrollo. Nació de una necesidad real: ayudar a una persona con TDA a organizar sus tareas y citas de manera más clara, visual y accesible. A la vez, me está sirviendo como espacio de aprendizaje mientras exploro nuevas tecnologías en desarrollo web.

---
<img width="164" height="585" alt="image" src="https://github.com/user-attachments/assets/c04985d5-97a3-4a26-b68e-aa673ed3fd4b" />
<img width="161" height="585" alt="image" src="https://github.com/user-attachments/assets/14697f45-32f0-4d44-af4a-c60071f1f932" />
<img width="166" height="585" alt="image" src="https://github.com/user-attachments/assets/5b433abd-3950-4aa6-b365-a7431175acff" />
<img width="164" height="589" alt="image" src="https://github.com/user-attachments/assets/96fee3bb-4dd9-4d1c-8eee-0e0e22c31da9" />
<img width="166" height="585" alt="image" src="https://github.com/user-attachments/assets/4a952055-4770-4fc8-9262-faecad46ea20" />
<img width="162" height="586" alt="image" src="https://github.com/user-attachments/assets/a0373e77-ccb2-4f88-85be-bad34f0d6762" />








 *Estilos provisionales no definitivos

---
## 💡 ¿Qué es Nome?

**Nome** es una agenda escolar juvenil, pensada para adolescentes, que permite al usuario crear tareas tanto **por voz** como **manualmente**. Las tareas se procesan automáticamente para extraer **fecha, hora y texto limpio**, gracias a herramientas como **Spacy**, **regex** y un motor de búsqueda de fechas (`searchDate`).  

Por ejemplo, si dices:  
> "Quedé con Marcos mañana a las seis y diez de la tarde en las canchas"  

La app creará automáticamente:  
- **Fecha:** mañana (14/9)  
- **Hora:** 18:10  
- **Texto limpio:** "Quedé con Marcos en las canchas"

Además, las tareas se pueden configurar con múltiples opciones: notificaciones, repeticiones, colores, recordatorios previos, avisos el día anterior, etc...Para que prevenir despistes.




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
- **Lista por tipo** (`Citas` o `Deberes`)  
- **Calendario:** donde se muestran las tareas no eliminadas con un sistema de puntos de colores:
  - Verde → todas las tareas del día completas  
  - Rojo → tareas pendientes  

---

## ⏰ Notificaciones y recordatorios

- Cada tarea genera por defecto una **notificación 15 minutos antes** de su hora.  
- Se pueden configurar:  
  - Hora de la notificación  
  - Repetición (`una vez`, `diaria`, `lunes a viernes`, personalizada)  
  - Tiempo previo al evento  
  - Recordatorio el día anterior  

---

## 🎒 Sección Mochilas / Planificación escolar y otros escenarios

- Los usuarios pueden configurar su **horario escolar**.  
- La sección Mochilas genera automáticamente recordatorios diarios a las 20:00 mostrando los **items del día siguiente** con checklists.  
- Mochilas predeterminadas: `Clase`, `Gimnasio`, `Piscina`, `Playa`.  
- Se pueden crear mochilas **personalizadas**, editando:  
  - Color de la mochila  
  - Items de la lista  
  - Hora de notificación  
- Todos los items son **marcables**, editables y se pueden añadir/quitar según necesidad.  

---

## 🧠 Tutoriales y ayuda

- Sistema de tutoriales integrado en cada sección para guiar al usuario.

---

## ⚙️ Estado actual

- ✅ Creación de tareas por **voz** y **manual**  
- ✅ Extracción automática de **fecha, hora y texto limpio**  
- ✅ Clasificación automática en citas o deberes y subcategorías  
- ✅ Notificaciones configurables y recordatorios  
- ✅ Calendario visual de tareas  
- ✅ Sección Mochilas con items predeterminados y personalizables  
- ✅ Tutoriales guiados en la app  
- ✅ Backend con FastAPI para gestión de tareas y audios  
- ✅ Transcripción de voz mediante **Vosk**  

---

## 🔜 Próximamente / En desarrollo

- Mejora en el reconocimiento de expresiones naturales, para que el usuario pueda hablar libremente.
- Mejora en el tiempo de procesamiento.
- Apartado de ayuda para que el usuario pueda consultar manuales y guías dentro de la app.  
- Asistencia mediante **Google Home**.  
- Modo **claro/oscuro** para la interfaz. 
- Automatizaciones de recordatorios avanzadas.  

---

## 🛠️ Tecnología usada

- **Frontend:** React (Vite), JavaScript, TailwindCSS  
- **Backend:** FastAPI, Python  
- **Persistencia:** localStorage  
- **Reconocimiento de voz:** Vosk  
- **Procesamiento de lenguaje:** Spacy, regex  

---

## 🚀 Cómo ejecutar el proyecto (modo local)

### Frontend
```bash
cd frontend
npm install
npm run dev

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Este proyecto se comparte con fines educativos y personales 😉
