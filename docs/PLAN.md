# Plan de Implementacion - CurriculAI

## Resumen del Proyecto

**CurriculAI** es una aplicacion web React para crear y mejorar curriculums con IA, completamente en espanol.

### Caracteristicas MVP

1. Login con Google OAuth
2. Crear/Editar curriculum con wizard de 9 pasos
3. 20 plantillas de CV (con foto, sin foto, ATS) + paletas de colores
4. Sugerencias de IA (Groq API - llama-3.1-8b-instant)
5. Traduccion de CV a multiples idiomas con cache
6. Exportar PDF con html-to-image + jsPDF (smart page breaks)
7. ExportModal en Dashboard (exportar sin navegar al editor)
8. Guardar PDFs en base de datos
9. Gestionar multiples curriculums por usuario
10. Pagos con Stripe ($1 por CV) - pendiente
11. Dockerizacion para deployment - pendiente

---

## Stack Tecnologico

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Forms**: react-hook-form + Zod
- **HTTP Client**: Axios
- **PDF Generation**: html-to-image (toCanvas) + jsPDF
- **Notifications**: react-hot-toast
- **Icons**: @hugeicons/react + @hugeicons/core-free-icons
- **Image Crop**: react-image-crop

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Database**: SQLite (better-sqlite3)
- **Authentication**: Passport.js + Google OAuth 2.0
- **Sessions**: express-session
- **Security**: Helmet + express-rate-limit + CORS
- **File Upload**: Multer
- **AI API**: Groq (Llama 3.1 8B Instant)

### Deployment (Pendiente)
- Docker + Docker Compose
- Nginx (reverse proxy)

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

### Tabla: resumes
```sql
CREATE TABLE resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT DEFAULT 'Mi Curriculum',
  data TEXT NOT NULL,              -- JSON con estructura completa
  template TEXT DEFAULT 'modern',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabla: pdfs
```sql
CREATE TABLE pdfs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resume_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  pdf_data BLOB NOT NULL,
  file_size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Estructura del JSON de Curriculum

```javascript
{
  personalInfo: {
    firstName, lastName, email, phone, location,
    linkedin, website, photo  // base64 o URL
  },
  summary: "Resumen profesional...",
  experience: [{
    id, company, position, location,
    startDate, endDate, current, description, achievements
  }],
  education: [{
    id, institution, degree, field, location,
    startDate, endDate, current, description
  }],
  skills: [{
    id, category, items: ["skill1", "skill2"]
    // Categorias: Tecnicas, Idiomas, Herramientas
  }],
  colorPalette: "default",  // nombre de paleta de colorPalettes.js
  translations: {
    en: { summary, experience, education, skills, translatedAt },
    fr: { ... }
  }
}
```

---

## Fases de Implementacion

### Fase 1: Setup del Proyecto - COMPLETADA

- Vite + React frontend, Express backend
- Landing page, Login page
- Estructura de carpetas, .env, .gitignore

### Fase 2: Base de Datos y Autenticacion - COMPLETADA

- SQLite con WAL mode
- Modelos User, Resume, PDF
- Google OAuth con Passport.js
- Rutas de auth + middleware requireAuth

### Fase 3: Editor Multi-Paso - COMPLETADA

**Wizard de 9 pasos:**
1. ContactForm - Info personal + foto con crop (ImageCropModal)
2. ExperienceForm - Experiencia laboral (ExperienceItem)
3. EducationForm - Formacion academica (EducationItem)
4. SkillsForm - Habilidades por categorias (chips/tags)
5. SummaryForm - Resumen profesional + botones IA
6. TemplateSelector - 20 plantillas + paletas de colores
7. PreviewForm - Vista previa con selector A4/Carta + watermark
8. PaymentForm - Checkout UI (pendiente Stripe)
9. ExportForm - Generacion PDF + descarga + guardado

**Hook**: `useResumeWizard.js` gestiona estado, navegacion, auto-guardado con debounce.

### Fase 4: UI del Editor - COMPLETADA

- Dark mode (ThemeContext + ThemeToggle)
- CustomDatePicker con calendario en espanol
- WizardProgress con navegacion de 9 pasos
- ConfirmModal reutilizable
- Responsive design

### Fase 5: Vista Previa y Plantillas - COMPLETADA

**20 plantillas en ResumePreview.jsx:**

Con foto (8): modern, classic, creative, executive, elegant, bold, compact, corporate
Sin foto (8): minimal, modern-text, classic-text, elegant-text, bold-text, compact-text, corporate-text, creative-text
ATS (4): ats-standard, ats-professional, ats-simple, ats-executive

**Sistema de colores:**
- Paletas en `colorPalettes.js`
- CSS variables: `--cv-primary`, `--cv-secondary`, `--cv-primary-light`
- Cada plantilla respeta las variables de color

**Componentes:**
- `ResumePreview.jsx` - Renderiza cualquiera de las 20 plantillas
- `TemplateCard.jsx` - Card de preview en el selector

### Fase 6: Exportacion PDF - COMPLETADA

**Utilidad compartida**: `pdfGenerator.js`
- `generatePDF(containerEl, { pageSize, scale, breathingRoom })` → `{ pdf, totalPages }`
- `downloadGeneratedPDF(pdf, fileName)` → descarga local
- `getPDFBase64(pdf)` → base64 para guardar en servidor

**Algoritmo de page breaks:**
1. Query `.preview-item, .preview-skill-group` (bloques atomicos)
2. Calcular si un item cruza el borde de pagina
3. Si es el primer item de una seccion, mover la seccion entera
4. Aplicar spacers (margin-top) para empujar items a la siguiente pagina
5. Capturar con `html-to-image` (toCanvas, pixelRatio: 4)
6. Remover spacers
7. Construir PDF con jsPDF (clip por pagina)

**ExportModal en Dashboard:**
- Modal para exportar desde Dashboard sin navegar al editor
- Incluye: LanguageSelector, page size toggle, download button
- Hidden ResumePreview off-screen para captura
- Quick download de PDFs existentes del servidor

**Backend:**
- `POST /api/pdfs` - Guardar PDF (base64 → BLOB)
- `GET /api/pdfs/:id/download` - Descargar PDF
- `GET /api/pdfs/resume/:resumeId` - Listar PDFs de un resume

### Fase 7: Backend Groq API - COMPLETADA

- `groqService.js` - Wrapper de Groq API
- Modelo: `llama-3.1-8b-instant`
- Endpoints:
  - `POST /api/ai/suggestions` - Mejorar/generar texto
  - `POST /api/ai/translate` - Traducir CV a otro idioma
- Rate limiting aplicado
- Prompts optimizados en espanol

### Fase 8: UI Sugerencias IA + Traducciones - COMPLETADA

- AIButton.jsx con loading state
- aiService.js: `getSuggestions()`, `translateResume()`
- LanguageSelector con idiomas disponibles
- Cache de traducciones: `resumeData.translations[langCode]`
- Traducciones persistidas en servidor via `resumeService.updateResume()`
- Disponible en ExportForm y ExportModal

### Fase 9: Pagos con Stripe - EN PROGRESO (30%)

**Completado:**
- UI de checkout (PaymentForm.jsx)
- Seleccion de metodo de pago
- Resumen del pedido ($1 USD)

**Pendiente:**
- Integracion con Stripe API
- Stripe Checkout Session
- Webhook para confirmacion de pago
- Campo "paid" en modelo Resume
- Condicionar exportacion a pago completado

### Fase 10: Pulido y Testing - PENDIENTE

- Testing manual end-to-end
- Responsive testing (movil/tablet)
- Manejo de errores mejorado
- Animaciones y transiciones
- Loading skeletons
- Empty states

### Fase 11: Dockerizacion - PENDIENTE

- Dockerfile frontend (build + Nginx)
- Dockerfile backend (Node.js + SQLite)
- docker-compose.yml (dev)
- docker-compose.prod.yml (produccion)
- nginx.conf (reverse proxy)
- Health checks, volumenes, backups

---

## Decisiones Tecnicas

### html-to-image vs html2canvas
- html2canvas generaba PDFs borrosos (re-renderiza en canvas pixel a pixel)
- html-to-image usa SVG foreignObject (mantiene texto como vectores)
- Resultado: PDFs mucho mas nitidos con html-to-image

### Groq vs OpenAI
- Gratis (14,400 peticiones/dia)
- Mas rapido (optimizado para velocidad)
- Llama tiene buen soporte en espanol
- API compatible con OpenAI

### SQLite vs PostgreSQL
- Simplicidad (no requiere servidor)
- Archivo unico, facil de respaldar
- Suficiente para apps pequenas-medianas
- Cero configuracion en VPS

### Google OAuth vs email/password
- Mas seguro (Google maneja autenticacion)
- Menos friccion (sin formularios de registro)
- Verificacion de email automatica

### pdfGenerator.js como utilidad compartida
- Evita duplicacion de ~250 lineas entre ExportForm y ExportModal
- Un solo lugar para mantener el algoritmo de page breaks
- Parametros configurables (pageSize, scale, breathingRoom)

---

## Endpoints de la API

### Autenticacion
```
GET  /api/auth/google          # Iniciar login con Google
GET  /api/auth/google/callback # Callback de Google
POST /api/auth/logout          # Cerrar sesion
GET  /api/auth/status          # Usuario actual
```

### Curriculums (requiere auth)
```
POST   /api/resumes            # Crear curriculum
GET    /api/resumes            # Listar curriculums del usuario
GET    /api/resumes/:id        # Obtener curriculum
PUT    /api/resumes/:id        # Actualizar curriculum
DELETE /api/resumes/:id        # Eliminar curriculum
```

### PDFs (requiere auth)
```
POST /api/pdfs                 # Guardar PDF (base64)
GET  /api/pdfs/:id/download    # Descargar PDF
GET  /api/pdfs/resume/:resumeId# Listar PDFs de un CV
```

### IA (requiere auth)
```
POST /api/ai/suggestions       # Sugerencias de IA
POST /api/ai/translate         # Traducir CV
```

### Fotos (requiere auth)
```
POST /api/photos/upload        # Subir foto de perfil
```

### Sistema
```
GET /health                    # Health check
```

---

## Proximos Pasos

1. **Integrar Stripe** - Pagos reales de $1 por CV
2. **Pulido y Testing** - UX, responsive, manejo de errores
3. **Dockerizacion** - Containers para deployment en VPS

## Features v2.0 (Post-MVP)

- Cartas de presentacion con IA
- Analisis de ofertas (comparar CV con job descriptions)
- Importar desde LinkedIn
- Compartir curriculum (link publico temporal)
- Estadisticas de visualizaciones
- PWA (modo offline)
- Internacionalizacion completa de la UI

---

**Ultima actualizacion**: 6 de Febrero 2026
**Estado actual**: Fases 1-8 completadas (90% MVP)
**Proxima tarea**: Integracion Stripe para pagos
**Repositorio**: https://github.com/mauconig/curriculai
