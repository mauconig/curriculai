# Plan de Implementación Completo - CurriculAI

## 📋 Índice

1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Esquema de Base de Datos](#esquema-de-base-de-datos)
4. [Fases de Implementación](#fases-de-implementación)
5. [Archivos Críticos](#archivos-críticos)
6. [Checklist de Verificación](#checklist-de-verificación)
7. [Decisiones Técnicas](#decisiones-técnicas)

---

## Resumen del Proyecto

**CurriculAI** es una aplicación web React para crear y mejorar currículums con IA, completamente en español.

### Características MVP

1. ✅ Login con Google OAuth
2. ✅ Crear/Editar currículum con formularios
3. ✅ Sugerencias de IA para mejoras
4. ✅ Exportar y guardar PDFs en base de datos
5. ✅ Múltiples plantillas (Moderno, Clásico, Minimalista)
6. ✅ Gestionar múltiples currículums por usuario
7. ✅ Dockerización para deployment fácil en VPS

### Tiempo Estimado

- **MVP completo**: 12-14 días
- **Con Docker y deployment**: +2 días más
- **Total**: 14-16 días

---

## Stack Tecnológico

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Forms**: react-hook-form + Zod
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF + html2canvas
- **Notifications**: react-hot-toast
- **Icons**: lucide-react
- **Date Formatting**: date-fns (español)
- **IDs**: nanoid

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Database**: SQLite (better-sqlite3)
- **Authentication**: Passport.js + Google OAuth 2.0
- **Sessions**: express-session
- **Security**: Helmet + express-rate-limit + CORS
- **File Upload**: Multer
- **AI API**: Groq (Llama 3.1)

### Deployment
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (reverse proxy)
- **VPS**: Cualquier proveedor Linux

---

## Esquema de Base de Datos

### Tabla: users

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

**Descripción**: Almacena información de usuarios autenticados con Google.

### Tabla: resumes

```sql
CREATE TABLE resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT DEFAULT 'Mi Currículum',
  data TEXT NOT NULL,              -- JSON con estructura completa
  template TEXT DEFAULT 'modern',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Descripción**: Almacena currículums. El campo `data` contiene el JSON completo con toda la información del CV.

### Tabla: pdfs

```sql
CREATE TABLE pdfs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resume_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  pdf_data BLOB NOT NULL,          -- PDF almacenado como blob
  file_size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Descripción**: Almacena PDFs generados como BLOBs. Permite historial de versiones.

### Estructura del JSON de Currículum

```javascript
{
  id: Number,              // ID único (autoincrement de DB)
  userId: Number,          // ID del usuario propietario
  title: String,           // Título del currículum
  createdAt: Date,
  updatedAt: Date,

  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,      // "Madrid, España"
    linkedin: String,      // Opcional
    website: String,       // Opcional
    summary: String        // Resumen profesional
  },

  experience: [
    {
      id: String,
      company: String,
      position: String,
      location: String,
      startDate: String,   // "2020-01"
      endDate: String,     // "2022-12" o "Presente"
      current: Boolean,
      description: String,
      achievements: [String]
    }
  ],

  education: [
    {
      id: String,
      institution: String,
      degree: String,       // "Licenciatura en Ingeniería"
      field: String,        // "Informática"
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String
    }
  ],

  skills: [
    {
      id: String,
      category: String,     // "Técnicas", "Idiomas", "Blandas"
      items: [String]       // ["React", "Node.js"]
    }
  ],

  template: String,         // "modern", "classic", "minimal"
  language: "es"
}
```

---

## Fases de Implementación

### ✅ Fase 1: Setup del Proyecto (DÍA 1) - COMPLETADA

**Tareas:**
1. ✅ Inicializar root package.json con workspaces
2. ✅ Crear frontend con Vite + React
3. ✅ Crear backend con Express
4. ✅ Instalar todas las dependencias
5. ✅ Configurar archivos .env
6. ✅ Crear .gitignore
7. ✅ Crear estructura de carpetas

**Verificación:**
- ✅ Backend responde en http://localhost:3000/health
- ✅ Frontend carga en http://localhost:5173

**Archivos creados:**
- `package.json` (root)
- `frontend/` (completo con Vite)
- `backend/src/server.js`
- `backend/.env` y `backend/.env.example`
- `frontend/.env` y `frontend/.env.example`
- `.gitignore`
- `shared/types.js`
- `README.md`

---

### ✅ Fase 2: Base de Datos y Autenticación (DÍA 2-3) - COMPLETADA

**Objetivo**: Configurar SQLite y Google OAuth para autenticación de usuarios.

**Archivos a crear:**

1. **`backend/src/db/database.js`** - Configuración SQLite
   ```javascript
   import Database from 'better-sqlite3';

   const dbPath = process.env.DATABASE_PATH || './src/db/curriculai.db';
   const db = new Database(dbPath);
   db.pragma('foreign_keys = ON');

   export default db;
   ```

2. **`backend/src/db/migrations.js`** - Crear tablas
   - Tabla `users`
   - Tabla `resumes`
   - Tabla `pdfs`

3. **`backend/src/models/User.js`** - Modelo de usuario
   - `findById(id)`
   - `findOrCreate(userData)`
   - `updateLastLogin(id)`

4. **`backend/src/models/Resume.js`** - Modelo de currículum
   - `create(userId, data)`
   - `findByUser(userId)`
   - `findById(id)`
   - `update(id, data)`
   - `delete(id)`

5. **`backend/src/models/PDF.js`** - Modelo de PDF
   - `create(userId, resumeId, pdfData)`
   - `findByResumeAndUser(resumeId, userId)`
   - `findByIdAndUser(id, userId)`
   - `delete(id)`

6. **`backend/src/config/passport.js`** - Configuración Google OAuth
   - Estrategia de Google
   - Serialización/deserialización de usuario

7. **`backend/src/routes/auth.js`** - Rutas de autenticación
   - `GET /api/auth/google` - Iniciar login
   - `GET /api/auth/google/callback` - Callback de Google
   - `POST /api/auth/logout` - Cerrar sesión
   - `GET /api/auth/me` - Verificar sesión actual

8. **`backend/src/middleware/auth.js`** - Middleware de autenticación
   ```javascript
   export const requireAuth = (req, res, next) => {
     if (req.isAuthenticated()) {
       return next();
     }
     res.status(401).json({ error: 'No autenticado' });
   };
   ```

9. **Actualizar `backend/src/server.js`**
   - Añadir express-session
   - Inicializar Passport
   - Ejecutar migraciones al inicio
   - Añadir rutas de autenticación

**Tareas:**
1. ✅ Configurar SQLite y crear archivo de base de datos
2. ✅ Implementar migraciones
3. ✅ Crear modelos User, Resume, PDF
4. ✅ Obtener credenciales de Google OAuth
5. ✅ Configurar Passport.js
6. ✅ Crear rutas de autenticación
7. ✅ Probar login con Google en localhost
8. ✅ Corregir alineación de botones en Dashboard
9. ✅ Inicializar Git y subir a GitHub

**Verificación:**
- [x] Base de datos `curriculai.db` creada
- [x] Tablas creadas correctamente
- [x] Login con Google funciona
- [x] Callback redirige correctamente
- [x] Sesión persiste después de refrescar
- [x] Logout funciona
- [x] Dashboard con botones perfectamente alineados
- [x] Repositorio en GitHub: https://github.com/mauconig/curriculai

---

### 🔄 Fase 3: Editor de Currículum Multi-Paso (DÍA 2-5)

**Objetivo**: Crear un wizard paso a paso para crear currículums con asistencia de IA.

**Flujo del Wizard (8 pasos):**
1. **Contacto** - Información básica + foto opcional
2. **Experiencia** - Experiencia laboral con IA
3. **Educación** - Formación académica
4. **Habilidades** - Skills técnicas y blandas
5. **Resumen** - Resumen profesional con IA
6. **Plantilla** - Selección de diseño del CV
7. **Preview** - Vista previa final y edición
8. **Pago** - Pagar $1 USD para exportar PDF

**Modelo de Negocio:**
- Currículum se guarda como BORRADOR durante todo el proceso
- Solo se marca como COMPLETADO después del pago
- Pago único de $1 USD por CV exportado
- Sin suscripciones ni membresías

**Cada paso incluye:**
- Formulario con validación
- Botón "Mejorar con IA" para profesionalizar el contenido
- Navegación siguiente/anterior
- Auto-guardado de progreso
- Indicador de paso actual

**Archivos a crear:**

### Parte 1: Formulario de Contacto ⏳

1. **`frontend/src/pages/editor/ContactForm.jsx`**
   - Campos: nombre, apellido, email, teléfono, ubicación
   - Campo opcional: foto de perfil
   - Upload de imagen
   - Botón "Mejorar con IA" para sugerencias de ubicación/presentación
   - Validación con Zod

2. **`frontend/src/services/resumeService.js`** - API client
   - `createResume(data)` - Crear nuevo CV
   - `getResumes()` - Listar CVs del usuario
   - `getResume(id)` - Obtener CV específico
   - `updateResume(id, data)` - Actualizar CV
   - `deleteResume(id)` - Eliminar CV
   - `uploadPhoto(file)` - Subir foto de perfil

3. **`frontend/src/components/editor/WizardProgress.jsx`**
   - Indicador visual de pasos
   - Muestra paso actual
   - Navegación entre pasos completados

4. **`frontend/src/components/editor/AIButton.jsx`**
   - Botón reutilizable "Mejorar con IA"
   - Loading state
   - Integración con backend AI

5. **`frontend/src/hooks/useResumeWizard.js`**
   - Gestión de estado del wizard
   - Navegación entre pasos
   - Auto-guardado con debounce
   - Validación por paso

6. **`frontend/src/utils/constants.js`** - Textos en español
   - Labels de formularios
   - Mensajes de validación
   - Textos de ayuda
   - Pasos del wizard

### Parte 2: Formulario de Experiencia ⏳

7. **`frontend/src/pages/editor/ExperienceForm.jsx`**
   - Array dinámico de experiencias
   - Campos: empresa, puesto, ubicación, fechas, descripción
   - Checkbox "Trabajo actual"
   - Botón "Mejorar con IA" por experiencia
   - Añadir/eliminar experiencias

### Parte 3: Formulario de Educación ⏳

8. **`frontend/src/pages/editor/EducationForm.jsx`**
   - Array dinámico de estudios
   - Campos: institución, título, campo, ubicación, fechas
   - Checkbox "Estudiando actualmente"
   - Botón "Mejorar con IA" por estudio

### Parte 4: Formulario de Habilidades ⏳

9. **`frontend/src/pages/editor/SkillsForm.jsx`**
   - Categorías de habilidades
   - Input de tags/chips
   - Botón "Sugerir habilidades con IA"
   - Arrastrar y soltar para ordenar

### Parte 5: Formulario de Resumen ⏳

10. **`frontend/src/pages/editor/SummaryForm.jsx`**
    - Textarea para resumen profesional
    - Contador de caracteres
    - Botón "Generar con IA" basado en datos previos
    - Sugerencias de mejora

### Parte 6: Preview y Finalización ⏳

11. **`frontend/src/pages/editor/PreviewStep.jsx`**
    - Vista previa del CV completo
    - Selector de plantilla
    - Botón "Guardar CV"
    - Botón "Exportar PDF"
    - Editar cualquier sección

**Backend Updates:**

12. **`backend/src/routes/photos.js`** - Upload de fotos
    - `POST /api/photos/upload` - Subir foto
    - Resize y optimización con sharp
    - Guardar en filesystem o DB

13. **`backend/src/services/aiService.js`** - Servicios de IA
    - `improveSummary(text)` - Mejorar resumen
    - `improveExperience(experience)` - Mejorar experiencia
    - `improveEducation(education)` - Mejorar educación
    - `suggestSkills(profile)` - Sugerir habilidades

**Verificación Fase 3:**
- [ ] Wizard de 6 pasos funciona
- [ ] Navegación entre pasos
- [ ] Validación en cada paso
- [ ] Auto-guardado funciona
- [ ] Upload de foto funciona
- [ ] Botón "Mejorar con IA" en cada paso
- [ ] Vista previa muestra datos correctos
- [ ] Puedo guardar CV completo
- [ ] Puedo editar CV guardado

---

### 🔄 Fase 4: UI del Editor (DÍA 5-6)

**Objetivo**: Crear la interfaz de usuario para editar currículums.

**Archivos a crear:**

1. **`frontend/src/pages/Login.jsx`** - Página de login
   - Botón "Continuar con Google"
   - Branding de CurriculAI
   - Redirección automática si ya está autenticado

2. **`frontend/src/pages/Dashboard.jsx`** - Dashboard principal
   - Lista de currículums del usuario
   - Botón "Crear nuevo currículum"
   - Cards con preview de cada CV
   - Botones editar/eliminar

3. **`frontend/src/pages/Editor.jsx`** - Editor de currículum
   - Tabs o secciones para cada parte
   - Vista previa en tiempo real
   - Auto-guardado
   - Botones de acción

4. **`frontend/src/components/resume/PersonalInfo.jsx`**
   - Formulario de información personal
   - Validación con Zod

5. **`frontend/src/components/resume/Experience.jsx`**
   - Array dinámico de experiencias
   - Añadir/eliminar entradas
   - useFieldArray de react-hook-form

6. **`frontend/src/components/resume/Education.jsx`**
   - Array dinámico de formación académica
   - Similar a Experience

7. **`frontend/src/components/resume/Skills.jsx`**
   - Array de categorías de habilidades
   - Inputs de tags o chips

8. **`frontend/src/hooks/useResume.js`** - Hook personalizado
   - Gestionar estado del currículum
   - Auto-guardado con debounce
   - Sincronización con backend

**Verificación:**
- [ ] Puedo hacer login con Google
- [ ] Dashboard muestra mis currículums
- [ ] Puedo crear nuevo currículum
- [ ] Formularios se llenan correctamente
- [ ] Auto-guardado funciona (cada 500ms)
- [ ] Validación funciona
- [ ] Puedo añadir/eliminar experiencias
- [ ] Puedo añadir/eliminar formación
- [ ] Puedo añadir/eliminar habilidades

---

### 🔄 Fase 5: Vista Previa y Plantillas (DÍA 7)

**Objetivo**: Crear plantillas visuales para el currículum.

**Archivos a crear:**

1. **`frontend/src/components/resume/ResumePreview.jsx`**
   - Contenedor de vista previa
   - Selector de plantilla
   - Renderiza template seleccionado

2. **`frontend/src/components/templates/ModernTemplate.jsx`**
   - Diseño moderno con colores
   - Layout de dos columnas
   - CSS modular

3. **`frontend/src/components/templates/ClassicTemplate.jsx`**
   - Diseño tradicional
   - Una columna
   - Fuentes serif

4. **`frontend/src/components/templates/MinimalTemplate.jsx`**
   - Diseño minimalista
   - Mucho espacio en blanco
   - Fuentes sans-serif

5. **`frontend/src/components/templates/index.js`**
   - Registro de plantillas
   - Metadata de cada template

**Estilos CSS:**
- Cada plantilla tiene su propio archivo CSS
- Optimizado para impresión (A4)
- Responsive para vista previa

**Verificación:**
- [ ] Vista previa muestra currículum en tiempo real
- [ ] Puedo cambiar entre 3 plantillas
- [ ] Cambios en formulario se reflejan inmediatamente
- [ ] Caracteres españoles se ven correctamente
- [ ] Layout responsive funciona

---

### 🔄 Fase 6: Exportación y Guardado de PDFs (DÍA 8)

**Objetivo**: Generar PDFs y guardarlos en la base de datos.

**Archivos a crear:**

1. **`frontend/src/services/pdfService.js`**
   - `generateAndSavePDF(resumeData, templateName)`
   - `downloadPDF(pdfId)`
   - Usa jsPDF + html2canvas

2. **`backend/src/services/pdfService.js`**
   - `savePDF(userId, resumeId, file)`
   - `getPDF(pdfId, userId)`
   - `listPDFs(userId, resumeId)`

3. **`backend/src/routes/pdfs.js`**
   - `POST /api/pdfs/upload` - Subir PDF
   - `GET /api/pdfs/:id/download` - Descargar PDF
   - `GET /api/pdfs/resume/:resumeId` - Listar PDFs de un CV

**Flujo de exportación:**
1. Usuario clickea "Exportar a PDF"
2. Frontend genera PDF con html2canvas + jsPDF
3. PDF se descarga localmente
4. Simultáneamente se sube al backend
5. Backend guarda BLOB en base de datos
6. Frontend muestra confirmación

**Verificación:**
- [ ] Puedo exportar PDF con plantilla Moderno
- [ ] Puedo exportar PDF con plantilla Clásico
- [ ] Puedo exportar PDF con plantilla Minimalista
- [ ] PDF se descarga localmente
- [ ] PDF se guarda en base de datos
- [ ] Puedo ver historial de PDFs
- [ ] Puedo descargar PDF guardado
- [ ] Caracteres españoles se ven en PDF

---

### 🔄 Fase 7: Backend Groq API (DÍA 9)

**Objetivo**: Integrar Groq API para sugerencias de IA.

**Archivos a crear:**

1. **`backend/src/services/groqService.js`**
   - `getAISuggestions(resumeSection, type)`
   - Configuración de Groq API
   - Llamadas HTTP

2. **`backend/src/utils/prompts.js`**
   - `improveSummary(currentSummary)`
   - `improveExperience(experience)`
   - `suggestSkills(currentSkills, experience)`
   - Prompts en español optimizados

3. **`backend/src/routes/ai.js`**
   - `POST /api/ai/suggestions` - Obtener sugerencias
   - Protegido con `requireAuth`
   - Rate limiting

4. **`backend/src/middleware/cors.js`**
   - Configuración CORS
   - Permitir credenciales

**Configuración Groq:**
- API Key en `.env`
- Modelo: `llama-3.1-8b-instant`
- Temperature: 0.7
- Max tokens: 500

**Verificación:**
- [ ] Endpoint `/api/ai/suggestions` funciona
- [ ] Requiere autenticación
- [ ] Devuelve sugerencias en español
- [ ] Rate limiting funciona
- [ ] Manejo de errores correcto

---

### 🔄 Fase 8: UI de Sugerencias de IA (DÍA 10)

**Objetivo**: Interfaz para mostrar y aplicar sugerencias de IA.

**Archivos a crear:**

1. **`frontend/src/services/aiService.js`**
   - `getSuggestions(section, type)`
   - Cliente HTTP para backend

2. **`frontend/src/hooks/useAISuggestions.js`**
   - `fetchSuggestions(section, type)`
   - Estado de loading
   - Manejo de errores

3. **`frontend/src/components/common/AISuggestionsModal.jsx`**
   - Modal con sugerencias
   - Botones "Aplicar" / "Descartar"
   - Loading state

**Integración:**
- Botón "Mejorar con IA" en cada sección
- Modal se abre al clickear
- Muestra sugerencias formateadas
- Al aplicar, actualiza formulario

**Verificación:**
- [ ] Botón "Mejorar con IA" aparece en secciones
- [ ] Click muestra loading spinner
- [ ] Sugerencias aparecen en modal
- [ ] Puedo aplicar sugerencia
- [ ] Puedo descartar sugerencia
- [ ] Formulario se actualiza al aplicar
- [ ] Toast de confirmación aparece

---

### 🔄 Fase 9: Pulido y Testing (DÍA 11)

**Objetivo**: Mejorar UX y hacer testing manual completo.

**Tareas:**
1. Mejorar diseño visual (CSS)
2. Añadir iconos (lucide-react)
3. Mejorar UX (validación, feedback)
4. Responsive design (móvil/tablet)
5. Testing manual de flujo completo
6. Actualizar README con instrucciones finales

**Mejoras UX:**
- Animaciones de transición
- Loading skeletons
- Estados vacíos (empty states)
- Mensajes de error claros
- Confirmaciones antes de eliminar

**Verificación:**
- [ ] Flujo completo funciona sin errores
- [ ] Responsive en móvil (320px+)
- [ ] Responsive en tablet (768px+)
- [ ] No hay errores en consola
- [ ] Navegación intuitiva

---

### 🔄 Fase 10: Dockerización (DÍA 12-13) - FASE FINAL

**Objetivo**: Containerizar la aplicación para deployment.

**Archivos a crear:**

1. **`Dockerfile`** (root) - Frontend build
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app/frontend
   COPY frontend/package*.json ./
   RUN npm ci
   COPY frontend/ ./
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/frontend/dist /usr/share/nginx/html
   COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **`backend/Dockerfile`** - Backend container
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   RUN apk add --no-cache python3 make g++
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN mkdir -p /app/data
   EXPOSE 3000
   CMD ["node", "src/server.js"]
   ```

3. **`docker/docker-compose.yml`** - Desarrollo
4. **`docker/docker-compose.prod.yml`** - Producción
5. **`docker/nginx.conf`** - Reverse proxy
6. **`.dockerignore`** - Excluir archivos

**Scripts Docker:**
- `docker:build` - Construir imágenes
- `docker:up` - Levantar contenedores
- `docker:down` - Bajar contenedores
- `docker:logs` - Ver logs
- `docker:backup` - Backup de DB

**Verificación:**
- [ ] `docker-compose build` funciona
- [ ] `docker-compose up` levanta todo
- [ ] Frontend accesible en http://localhost
- [ ] Backend responde
- [ ] Login con Google funciona
- [ ] Base de datos persiste (volumen)
- [ ] Health check funciona

---

## Archivos Críticos (Por Prioridad)

### Alta Prioridad (Bloquean todo)

1. ✅ `package.json` (root)
2. ✅ `backend/src/server.js`
3. ✅ `shared/types.js`
4. ✅ `backend/src/db/database.js`
5. ✅ `backend/src/db/migrations.js`
6. ✅ `backend/src/config/passport.js`
7. ✅ `backend/src/middleware/auth.js`
8. ✅ `backend/src/models/User.js`
9. ✅ `backend/src/models/Resume.js`
10. ✅ `backend/src/models/PDF.js`

### Media Prioridad (Features principales)

11. ✅ `frontend/src/pages/Login.jsx`
12. ✅ `frontend/src/pages/Dashboard.jsx`
13. ⏳ `frontend/src/pages/Editor.jsx`
14. ✅ `frontend/src/services/authService.js`
15. ⏳ `frontend/src/services/resumeService.js`
16. ⏳ `frontend/src/components/templates/ModernTemplate.jsx`
17. ⏳ `frontend/src/services/pdfService.js`
18. ⏳ `backend/src/services/groqService.js`
19. ⏳ `backend/src/utils/prompts.js`
20. ⏳ `backend/src/routes/pdfs.js`

### Baja Prioridad (Deployment)

21. ⏳ `Dockerfile`
22. ⏳ `backend/Dockerfile`
23. ⏳ `docker/docker-compose.yml`
24. ⏳ `docker/docker-compose.prod.yml`
25. ⏳ `docker/nginx.conf`

---

## Checklist de Verificación End-to-End

### Setup
- [x] `npm run install:all` funciona
- [x] Frontend arranca en http://localhost:5173
- [x] Backend arranca en http://localhost:3000
- [ ] Variables de entorno configuradas (Google OAuth + Groq)
- [ ] Base de datos SQLite creada

### Autenticación
- [ ] Página de login se muestra
- [ ] Botón "Continuar con Google" funciona
- [ ] Redirección a Google OAuth
- [ ] Callback exitoso, usuario creado en DB
- [ ] Sesión persiste después de refrescar
- [ ] Dashboard se muestra después de login
- [ ] Logout funciona correctamente
- [ ] Rutas protegidas redirigen a login

### Gestión de Currículums
- [ ] Dashboard muestra lista vacía inicialmente
- [ ] Botón "Crear nuevo currículum" funciona
- [ ] Se crea currículum en DB
- [ ] Puedo editar currículum existente
- [ ] Puedo crear múltiples currículums
- [ ] Puedo eliminar currículum
- [ ] Solo veo mis currículums

### Editor
- [ ] Llenar información personal
- [ ] Añadir experiencia laboral (múltiples)
- [ ] Añadir formación académica
- [ ] Añadir habilidades categorizadas
- [ ] Auto-guardado funciona
- [ ] Refrescar mantiene datos
- [ ] Validación funciona

### Vista Previa y Plantillas
- [ ] Vista previa en tiempo real
- [ ] Cambiar a plantilla Moderno
- [ ] Cambiar a plantilla Clásico
- [ ] Cambiar a plantilla Minimalista
- [ ] Cambios se reflejan inmediatamente

### Exportación PDF
- [ ] Exportar con plantilla Moderno
- [ ] Exportar con plantilla Clásico
- [ ] Exportar con plantilla Minimalista
- [ ] Caracteres españoles correctos
- [ ] PDF se descarga localmente
- [ ] PDF se guarda en DB
- [ ] Historial de PDFs funciona
- [ ] Descargar PDF guardado funciona

### Sugerencias de IA
- [ ] Clickear "Mejorar con IA" en resumen
- [ ] Loading spinner aparece
- [ ] Sugerencias en español
- [ ] Aplicar sugerencia funciona
- [ ] Descartar sugerencia funciona
- [ ] Funciona para experiencia
- [ ] Funciona para educación
- [ ] Manejo de errores correcto

### UX y Responsive
- [ ] Chrome funciona
- [ ] Firefox funciona
- [ ] Edge funciona
- [ ] Responsive móvil (320px+)
- [ ] Responsive tablet (768px+)
- [ ] Notificaciones toast funcionan
- [ ] No hay errores en consola

### Docker y Deployment
- [ ] `docker-compose build` funciona
- [ ] `docker-compose up` levanta todo
- [ ] Frontend accesible en http://localhost
- [ ] Backend responde
- [ ] Login con Google funciona en Docker
- [ ] Volumen SQLite persiste datos
- [ ] Health check funciona
- [ ] Logs accesibles
- [ ] Backup de DB funciona

---

## Decisiones Técnicas

### ¿Por qué Vite en vez de Create React App?
- ⚡ Más rápido (HMR instantáneo)
- 🎯 Configuración más simple
- 📦 Bundle más pequeño
- ✨ Mejor experiencia de desarrollo

### ¿Por qué react-hook-form en vez de Formik?
- 🚀 Mejor performance (menos re-renders)
- 📝 API más simple
- 🎯 Mejor con TypeScript
- 📦 Más ligero (9KB vs 35KB)

### ¿Por qué Groq en vez de OpenAI?
- 💰 Gratis (14,400 peticiones/día)
- ⚡ Más rápido (optimizado para velocidad)
- 🇪🇸 Llama tiene excelente soporte español
- 🎓 API compatible con OpenAI

### ¿Por qué SQLite en vez de PostgreSQL/MySQL?
- 🎯 Simplicidad (no requiere servidor)
- 📦 Archivo único, fácil de respaldar
- ⚡ Más rápido para apps pequeñas-medianas
- 🔧 Cero configuración en VPS
- 💰 Sin costos de hosting de DB
- 🐳 Fácil de dockerizar

### ¿Por qué better-sqlite3 en vez de sqlite3?
- ⚡ Síncrono = más rápido y simple
- 🎯 API más limpia
- 📦 Mejor performance
- 🔧 Menos problemas con async/await

### ¿Por qué Google OAuth en vez de email/password?
- 🔐 Más seguro (Google maneja autenticación)
- ⚡ Más rápido (sin formularios de registro)
- 👤 Menos fricción (usuarios ya tienen Google)
- 🎯 Sin gestionar passwords/resets
- ✅ Verificación de email automática

### ¿Por qué Docker en vez de deployment manual?
- 📦 Entorno consistente (dev = producción)
- 🚀 Deployment rápido (docker-compose up)
- 🔧 Fácil rollback (images versionadas)
- 🐳 Portabilidad (funciona en cualquier VPS)
- 📊 Fácil escalar (añadir replicas)

---

## Próximos Pasos (v2.0)

### Características ya incluidas en MVP
- ✅ Múltiples currículums por usuario
- ✅ Cuentas de usuario (Google OAuth)
- ✅ Sincronización cloud (SQLite)
- ✅ Historial de PDFs
- ✅ Dockerización

### Nuevas features v2.0
1. **Más plantillas** - 5-10 diseños adicionales
2. **Cartas de presentación** - Generar cover letters con IA
3. **Análisis de ofertas** - Comparar CV con job descriptions
4. **Historial de versiones** - Ver cambios anteriores
5. **Importar LinkedIn** - Auto-fill desde perfil
6. **Optimización ATS** - Verificar compatibilidad
7. **Compartir currículum** - Link público temporal
8. **Colaboración** - Compartir con mentores
9. **Estadísticas** - Visualizaciones/exportaciones
10. **Temas personalizados** - Colores y fuentes

### Mejoras Técnicas v2.0
- Migrar a TypeScript
- Tests unitarios (Jest + React Testing Library)
- Tests E2E (Playwright)
- CI/CD pipeline (GitHub Actions)
- PWA (modo offline con service workers)
- Internacionalización (inglés, portugués)
- Migrar a PostgreSQL (si crece mucho)
- Redis para caché de sugerencias
- WebSockets para colaboración en tiempo real
- S3/CloudStorage para PDFs (si crece mucho)

---

## Notas Importantes

### Seguridad
- ✅ API keys en `.env`, nunca en código
- ✅ Rate limiting (100 peticiones/15min)
- ✅ Helmet.js para security headers
- ✅ CORS restringido a frontend domain
- ✅ Validación de inputs (Zod)
- ✅ React previene XSS por defecto
- ✅ HTTPS en producción

### Performance
- ✅ Auto-guardado con debounce (500ms)
- ✅ React.memo para componentes pesados
- ✅ Lazy loading de rutas
- ✅ Bundle size optimizado con Vite
- ✅ SQLite indexado correctamente

### Internacionalización (Español)
- ✅ Todo el texto en español neutro
- ✅ Formato de fechas: "enero 2020"
- ✅ Verbos de acción: Desarrollé, Implementé, Lideré
- ✅ Terminología: "Currículum", "Experiencia Laboral"

---

## Recursos

### APIs
- **Google OAuth**: https://console.cloud.google.com/
- **Groq API**: https://console.groq.com/

### Documentación
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Express**: https://expressjs.com/
- **better-sqlite3**: https://github.com/WiseLibs/better-sqlite3
- **Passport.js**: https://www.passportjs.org/
- **react-hook-form**: https://react-hook-form.com/

### Herramientas
- **Docker**: https://www.docker.com/
- **Node.js**: https://nodejs.org/

---

**Última actualización**: Fase 2 completada (Día 1)
**Próxima fase**: Fase 3 - CRUD de Currículums
**Repositorio**: https://github.com/mauconig/curriculai
