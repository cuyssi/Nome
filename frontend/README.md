# 🧩 Nome — Proyecto en construcción

> Este proyecto está en desarrollo. Nació de una necesidad real: ayudar a una persona con TDA a organizar sus tareas y citas de manera más clara, visual y accesible. A la vez, me está sirviendo como espacio de aprendizaje mientras exploro nuevas tecnologías en desarrollo web.

---

## 💡 ¿Qué es Nome?

**Nome** es una agenda que permite almacenar tareas por voz y guardar las transcripciones como texto. Las clasifica automáticamente por tipo (`deberes`, `trabajo`, `citas`, `médico`) y las muestra con colores y etiquetas para facilitar su identificación. Está pensada para ofrecer una forma intuitiva de gestionar un día a día sin agobios.

Mi idea es automatizar recordatorios, tanto rutinarios como puntuales, que puedan llegar directamente al móvil.

---

## ⚙️ Estructura

nome/
├── frontend/   → interfaz visual
├── backend/    → API y lógica de transcripción
├── README.md
├── .gitignore


## ⚙️ Estado actual

- ✅ Sistema básico de transcripciones guardadas en localStorage  
- ✅ Clasificación automática por palabras clave  
- ✅ Visualización por pestañas (`deberes`, `trabajo`, `citas`, `médico`)  
- ✅ Personalización de colores por categoría 

---

### 🔜 Próximamente / En desarrollo

- Mejora en el reconocimiento de expresiones naturales, contemplando varios patrones para ingresar una cita (`"quedé con..."`, `"tengo una cita con..."`). Lo ideal sería poder hablar libremente sin pensar en una fórmula concreta.
- Optimización en cómo se muestra cada tarea. Actualmente se hace una limpieza del texto para no repetir la hora y la fecha, pero esto provoca que tareas como `"ejercicios 1 y 2"` se omitan. Estoy pensando en implementar un renderizado condicional (¡se admiten ideas! 😉).
- Automatizaciones: recordatorios previos a las citas que se envíen al móvil.
- Planificación escolar: posibilidad de ingresar el horario y que, el día anterior, se reciba un aviso al móvil para preparar la mochila con las asignaturas correspondientes mediante una lista con checkbox. Llevar esto a otros escenarios (mochilas) como gimnasio, piscina, playa..

---

## 🛠️ Tecnología usada

- React (con Vite)
- JavaScript
- TailwindCSS
- localStorage para persistencia local
- FastAPI (para backend)
- Whisper (para transcripción por voz)

---

## 🚀 Cómo ejecutar el proyecto (modo local)

### Frontend
cd frontend
npm install
npm run dev

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Este proyecto se comparte con fines educativos y personales 😉