# Referencia Rapida - CurriculAI

## Comandos Esenciales

### Desarrollo Local

```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar frontend + backend simultaneamente
npm run dev

# Solo frontend (puerto 5173)
npm run dev:frontend

# Solo backend (puerto 3000)
npm run dev:backend
```

---

## Estructura de Archivos Clave

```
frontend/src/
  pages/
    Landing.jsx + .css            # Landing page publica
    Login.jsx + .css              # Login con Google
    Dashboard.jsx + .css          # Lista de CVs + ExportModal
    editor/
      ContactForm.jsx + .css      # Paso 1: Info personal + foto
      ExperienceForm.jsx + .css   # Paso 2: Experiencia laboral
      EducationForm.jsx + .css    # Paso 3: Educacion
      SkillsForm.jsx + .css       # Paso 4: Habilidades
      SummaryForm.jsx + .css      # Paso 5: Resumen profesional
      TemplateSelector.jsx + .css # Paso 6: 20 plantillas + colores
      PreviewForm.jsx + .css      # Paso 7: Vista previa
      PaymentForm.jsx + .css      # Paso 8: Checkout (mockup)
      ExportForm.jsx + .css       # Paso 9: Exportacion PDF
  components/
    common/
      ConfirmModal.jsx + .css     # Modal de confirmacion reutilizable
      ThemeToggle.jsx + .css      # Dark mode toggle
      CustomDatePicker.jsx + .css # Calendario en espanol
    editor/
      WizardProgress.jsx + .css   # Barra de progreso 9 pasos
      ResumePreview.jsx + .css    # Vista previa (20 plantillas)
      TemplateCard.jsx + .css     # Card en selector de plantillas
      LanguageSelector.jsx + .css # Selector de idioma
      ExperienceItem.jsx + .css   # Item de experiencia
      EducationItem.jsx + .css    # Item de educacion
      AIButton.jsx + .css         # Boton "Mejorar con IA"
      ImageCropModal.jsx + .css   # Modal para recortar foto
    dashboard/
      ExportModal.jsx + .css      # Modal exportacion desde Dashboard
  services/
    authService.js                # Auth con Google OAuth
    resumeService.js              # CRUD de curriculums
    pdfService.js                 # Upload/download PDFs
    aiService.js                  # Sugerencias IA + traducciones
  utils/
    constants.js                  # Textos en espanol
    colorPalettes.js              # Paletas de colores
    pdfGenerator.js               # Generacion PDF compartida
  hooks/
    useResumeWizard.js            # Estado del wizard
  contexts/
    ThemeContext.jsx               # Dark mode context

backend/src/
  server.js                       # Express server principal
  db/
    database.js                   # Config SQLite (WAL mode)
    migrations.js                 # Crear tablas
  models/
    User.js                       # Modelo usuario
    Resume.js                     # Modelo curriculum (JSON data)
    PDF.js                        # Modelo PDF (BLOB storage)
  routes/
    auth.js                       # Login/logout Google OAuth
    resumes.js                    # CRUD curriculums
    pdfs.js                       # PDF upload/download
    ai.js                         # Sugerencias IA + traducciones
    photos.js                     # Upload fotos de perfil
  services/
    groqService.js                # Groq API (llama-3.1-8b-instant)
  config/
    passport.js                   # Google OAuth config
  middleware/
    auth.js                       # requireAuth, optionalAuth
```

---

## Base de Datos

### Tablas

1. **users** - Usuarios autenticados con Google
   - `id`, `google_id`, `email`, `name`, `picture`

2. **resumes** - Curriculums (datos en JSON)
   - `id`, `user_id`, `title`, `data` (JSON), `template`

3. **pdfs** - PDFs exportados (BLOB)
   - `id`, `resume_id`, `user_id`, `filename`, `pdf_data` (BLOB), `file_size`

### Relaciones
- `users` 1→N `resumes` (CASCADE DELETE)
- `users` 1→N `pdfs` (CASCADE DELETE)
- `resumes` 1→N `pdfs` (CASCADE DELETE)

---

## Variables de Entorno

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./src/db/curriculai.db

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session
SESSION_SECRET=generar_con_crypto

# IA
GROQ_API_KEY=tu_groq_key

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

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

## Plantillas Disponibles (20)

### Con foto de perfil (8)
| Slug | Nombre |
|------|--------|
| `modern` | Moderno |
| `classic` | Clasico |
| `creative` | Creativo |
| `executive` | Ejecutivo |
| `elegant` | Elegante |
| `bold` | Bold |
| `compact` | Compacto |
| `corporate` | Corporativo |

### Sin foto de perfil (8)
| Slug | Nombre |
|------|--------|
| `minimal` | Minimalista |
| `modern-text` | Moderno Texto |
| `classic-text` | Clasico Texto |
| `elegant-text` | Elegante Texto |
| `bold-text` | Bold Texto |
| `compact-text` | Compacto Texto |
| `corporate-text` | Corporativo Texto |
| `creative-text` | Creativo Texto |

### ATS - Optimizados para sistemas de tracking (4)
| Slug | Nombre |
|------|--------|
| `ats-standard` | ATS Estandar |
| `ats-professional` | ATS Profesional |
| `ats-simple` | ATS Simple |
| `ats-executive` | ATS Ejecutivo |

### Sistema de colores
- Paletas definidas en `colorPalettes.js`
- CSS variables: `--cv-primary`, `--cv-secondary`, `--cv-primary-light`
- Se aplican via `getPaletteStyle(paletteName, template)`

---

## Groq API (IA)

### Configuracion
- Modelo: `llama-3.1-8b-instant`
- Limites gratuitos: 14,400 peticiones/dia

### Funcionalidades
1. **Sugerencias** - Mejorar/generar resumen profesional, experiencia, habilidades
2. **Traducciones** - Traducir CV completo a otro idioma
   - Cache en `resumeData.translations[langCode]`
   - No re-traduce si ya existe cache

---

## Flujo de Trabajo

### 1. Usuario se registra
```
Landing.jsx → Login.jsx → Google OAuth → Dashboard.jsx
```

### 2. Crear curriculum
```
Dashboard → "Crear nuevo" → Wizard 9 pasos → Auto-guardado
```

### 3. Wizard de edicion
```
Contacto → Experiencia → Educacion → Habilidades → Resumen →
Plantilla → Preview → Pago → Exportacion
```

### 4. Mejorar con IA
```
SummaryForm → "Mejorar con IA" → Groq API → Texto mejorado
```

### 5. Exportar PDF (desde Editor)
```
ExportForm → Elegir idioma + tamano → html-to-image + jsPDF → Descarga + Server save
```

### 6. Exportar PDF (desde Dashboard)
```
Dashboard → Click boton descarga → ExportModal → Elegir idioma + tamano → PDF
```

---

## PDF Generation

### Flujo tecnico
1. `<ResumePreview>` se renderiza off-screen (`left: -9999px`)
2. Algoritmo de smart page breaks aplica spacers (margin-top)
3. `html-to-image` captura como canvas (pixelRatio: 4 = ~300 DPI)
4. jsPDF construye PDF con clipping por pagina
5. Spacers se remueven despues de la captura

### API (pdfGenerator.js)
```javascript
import { generatePDF, downloadGeneratedPDF, getPDFBase64 } from '../utils/pdfGenerator';

const { pdf, totalPages } = await generatePDF(containerEl, {
  pageSize: 'a4',     // 'a4' | 'letter'
  scale: 4,           // pixelRatio (default 4)
  breathingRoom: 80   // px extra al inicio de nueva pagina
});

downloadGeneratedPDF(pdf, 'MiCV.pdf');        // descarga local
const base64 = getPDFBase64(pdf);              // para guardar en servidor
```

---

## Debugging

### Ver logs del backend
```bash
cd backend && npm run dev
```

### Ver logs del frontend
```bash
cd frontend && npm run dev
# Navegador: F12 → Console
```

### Verificar base de datos
```bash
sqlite3 backend/src/db/curriculai.db
.tables
.schema resumes
SELECT * FROM users;
.quit
```

### Build del frontend
```bash
cd frontend && npx vite build
```

---

## Seguridad

- [x] API keys en .env
- [x] CORS configurado (solo frontend domain)
- [x] Rate limiting (100 req/15min)
- [x] Helmet.js habilitado
- [x] Validacion de inputs (Zod)
- [x] Sesiones con httpOnly cookies
- [ ] HTTPS en produccion
- [ ] Backups automaticos

---

## Problemas Comunes

### Backend no arranca
**Causa**: Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Frontend no arranca
**Causa**: Puerto 5173 en uso
```bash
# Cambiar puerto en vite.config.js
server: { port: 5174 }
```

### Google OAuth no funciona
1. Verificar GOOGLE_CLIENT_ID correcto en .env
2. Callback URL coincide con Google Console
3. Dominio autorizado en Google Console

### PDF borroso
- Verificar que se usa `html-to-image` (no html2canvas)
- Aumentar `scale` en pdfGenerator (default: 4)

---

## Enlaces

- [Plan Completo](./plan.md)
- [Estado del Proyecto](./status.md)
- [Guia de Deployment](./DEPLOYMENT.md)
- [README Principal](../README.md)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Groq Console](https://console.groq.com/)
- [Repositorio GitHub](https://github.com/mauconig/curriculai)

---

**Ultima actualizacion**: 6 de Febrero 2026
