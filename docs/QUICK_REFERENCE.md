# Referencia Rápida - CurriculAI

## 🚀 Comandos Esenciales

### Desarrollo Local

```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar frontend + backend simultáneamente
npm run dev

# Solo frontend (puerto 5173)
npm run dev:frontend

# Solo backend (puerto 3000)
npm run dev:backend
```

### Docker

```bash
# Build y start (desarrollo)
docker-compose -f docker/docker-compose.yml up -d --build

# Build y start (producción)
docker-compose -f docker/docker-compose.prod.yml up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

---

## 📁 Estructura de Archivos Clave

```
├── frontend/src/
│   ├── pages/
│   │   ├── Login.jsx              # Página de login
│   │   ├── Dashboard.jsx          # Lista de currículums
│   │   └── Editor.jsx             # Editor principal
│   ├── components/
│   │   ├── resume/                # Componentes de formulario
│   │   └── templates/             # Plantillas de CV
│   ├── services/
│   │   ├── authService.js         # Autenticación
│   │   ├── resumeService.js       # CRUD currículums
│   │   ├── aiService.js           # Sugerencias IA
│   │   └── pdfService.js          # Exportar PDF
│   └── utils/
│       └── constants.js           # Textos en español
│
├── backend/src/
│   ├── routes/
│   │   ├── auth.js                # Login/logout
│   │   ├── resumes.js             # CRUD endpoints
│   │   ├── pdfs.js                # PDF upload/download
│   │   └── ai.js                  # IA sugerencias
│   ├── models/
│   │   ├── User.js                # Modelo usuario
│   │   ├── Resume.js              # Modelo currículum
│   │   └── PDF.js                 # Modelo PDF
│   ├── db/
│   │   ├── database.js            # Config SQLite
│   │   └── migrations.js          # Crear tablas
│   ├── config/
│   │   └── passport.js            # Google OAuth
│   └── services/
│       ├── groqService.js         # Groq API
│       └── pdfService.js          # Guardar PDFs
│
└── shared/
    └── types.js                   # Esquema de datos
```

---

## 🗄️ Estructura de Base de Datos

### Tablas

1. **users** - Usuarios autenticados
   - `id`, `google_id`, `email`, `name`, `picture`

2. **resumes** - Currículums
   - `id`, `user_id`, `title`, `data` (JSON), `template`

3. **pdfs** - PDFs exportados
   - `id`, `resume_id`, `user_id`, `filename`, `pdf_data` (BLOB)

### Relaciones

- `users` 1→N `resumes` (CASCADE DELETE)
- `users` 1→N `pdfs` (CASCADE DELETE)
- `resumes` 1→N `pdfs` (CASCADE DELETE)

---

## 🔐 Variables de Entorno

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

## 🔌 Endpoints de la API

### Autenticación

```
GET  /api/auth/google          # Iniciar login con Google
GET  /api/auth/google/callback # Callback de Google
POST /api/auth/logout          # Cerrar sesión
GET  /api/auth/me              # Usuario actual
```

### Currículums (requiere auth)

```
POST   /api/resumes            # Crear currículum
GET    /api/resumes            # Listar currículums del usuario
GET    /api/resumes/:id        # Obtener currículum
PUT    /api/resumes/:id        # Actualizar currículum
DELETE /api/resumes/:id        # Eliminar currículum
```

### PDFs (requiere auth)

```
POST /api/pdfs/upload               # Subir PDF
GET  /api/pdfs/:id/download         # Descargar PDF
GET  /api/pdfs/resume/:resumeId     # Listar PDFs de un CV
```

### IA (requiere auth)

```
POST /api/ai/suggestions       # Obtener sugerencias de IA
```

### Sistema

```
GET /health                    # Health check
```

---

## 🎨 Plantillas Disponibles

1. **modern** - Moderno
   - Diseño limpio con colores
   - Layout de dos columnas
   - Ideal para tecnología

2. **classic** - Clásico
   - Formato tradicional
   - Una columna
   - Perfecto para sectores formales

3. **minimal** - Minimalista
   - Estilo minimalista
   - Mucho espacio en blanco
   - Fuentes sans-serif

---

## 🤖 Groq API

### Configuración

```javascript
// Modelo
llama-3.1-8b-instant

// Límites gratuitos
14,400 peticiones/día
```

### Tipos de Sugerencias

1. **improveSummary** - Mejorar resumen profesional
2. **improveExperience** - Mejorar experiencia laboral
3. **suggestSkills** - Sugerir habilidades faltantes

---

## 📝 Flujo de Trabajo

### 1. Usuario se registra
```
Login.jsx → Google OAuth → Callback → Dashboard.jsx
```

### 2. Crear currículum
```
Dashboard → "Crear nuevo" → Editor.jsx → Formularios
```

### 3. Editar secciones
```
Editor → PersonalInfo/Experience/Education/Skills → Auto-save
```

### 4. Mejorar con IA
```
Editor → "Mejorar con IA" → Groq API → Modal sugerencias → Aplicar
```

### 5. Exportar PDF
```
Editor → "Exportar a PDF" → html2canvas + jsPDF → Descarga local + Upload a DB
```

---

## 🐛 Debugging

### Ver logs del backend

```bash
# Desarrollo
cd backend
npm run dev

# Docker
docker logs curriculai-backend-1 -f
```

### Ver logs del frontend

```bash
# Desarrollo
cd frontend
npm run dev

# Navegador
F12 → Console
```

### Verificar base de datos

```bash
# Acceder a SQLite
sqlite3 backend/src/db/curriculai.db

# Comandos útiles
.tables                    # Listar tablas
.schema users             # Ver esquema
SELECT * FROM users;      # Query
.quit                     # Salir
```

### Probar endpoints

```bash
# Health check
curl http://localhost:3000/health

# Con autenticación (requiere cookies)
curl -H "Cookie: connect.sid=..." http://localhost:3000/api/resumes
```

---

## ⚡ Tips de Performance

1. **Auto-guardado**: Debounce de 500ms
2. **Formularios**: react-hook-form (minimal re-renders)
3. **Imágenes**: Lazy loading
4. **Bundle**: Code splitting con React.lazy()
5. **Base de datos**: Índices en columnas frecuentes

---

## 🔒 Seguridad

### Checklist

- [x] API keys en .env
- [x] CORS configurado
- [x] Rate limiting (100 req/15min)
- [x] Helmet.js habilitado
- [x] Validación de inputs (Zod)
- [x] Sesiones con httpOnly cookies
- [ ] HTTPS en producción
- [ ] Backups automáticos

---

## 📊 Monitoreo

### Métricas importantes

```bash
# Uso de recursos Docker
docker stats

# Tamaño de base de datos
ls -lh backend/src/db/curriculai.db

# Número de usuarios
sqlite3 backend/src/db/curriculai.db "SELECT COUNT(*) FROM users;"

# Número de currículums
sqlite3 backend/src/db/curriculai.db "SELECT COUNT(*) FROM resumes;"
```

---

## 🆘 Problemas Comunes

### Backend no arranca

**Causa**: Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Frontend no arranca

**Causa**: Puerto 5173 en uso
```bash
# Cambiar puerto en vite.config.js
server: { port: 5174 }
```

### Google OAuth no funciona

**Verificar**:
1. GOOGLE_CLIENT_ID correcto
2. Callback URL coincide
3. Dominio autorizado en Google Console

### Base de datos bloqueada

```bash
# Reiniciar backend
npm run dev

# O eliminar lock file
rm backend/src/db/curriculai.db-wal
rm backend/src/db/curriculai.db-shm
```

---

## 📚 Recursos Útiles

### Documentación

- [Plan Completo](./PLAN.md)
- [Guía de Deployment](./DEPLOYMENT.md)
- [README Principal](../README.md)

### APIs Externas

- [Google Cloud Console](https://console.cloud.google.com/)
- [Groq Console](https://console.groq.com/)

### Herramientas

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com/) - Probar API
- [DB Browser for SQLite](https://sqlitebrowser.org/) - Ver base de datos

---

## 🎯 Checklist de Fase Actual

### Fase 1: Setup ✅ COMPLETADA

- [x] package.json configurado
- [x] Frontend con Vite creado
- [x] Backend con Express creado
- [x] Dependencias instaladas
- [x] .env configurados
- [x] .gitignore creado
- [x] Estructura de carpetas
- [x] README.md creado
- [x] Documentación creada

### Fase 2: Base de Datos y Auth ⏳ SIGUIENTE

- [ ] Configurar SQLite
- [ ] Crear migraciones
- [ ] Modelos User, Resume, PDF
- [ ] Configurar Passport.js
- [ ] Rutas de autenticación
- [ ] Obtener credenciales Google OAuth
- [ ] Probar login

**Próximo paso**: Obtener credenciales de Google OAuth y Groq API

---

**Última actualización**: Fase 1 completada
