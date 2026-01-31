# CurriculAI 📄✨

Aplicación web React para crear y mejorar currículums con IA, completamente en español.

## 🚀 Stack Tecnológico

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: SQLite
- **Autenticación**: Google OAuth 2.0
- **IA**: Groq API (Llama models)
- **Exportación PDF**: jsPDF + html2canvas
- **Deployment**: Docker + Docker Compose

## ✨ Características

- ✅ **Landing page profesional** con diseño moderno
- ✅ **Mobile-first responsive design** - optimizado para móvil
- ✅ **Modelo de pricing simple**: $1 por CV exportado (sin suscripciones)
- ✅ Login con Google OAuth
- ✅ Crear/Editar currículum con formularios
- ✅ Sugerencias de IA para mejoras
- ✅ Exportar y guardar PDFs en base de datos
- ✅ Múltiples plantillas (Moderno, Clásico, Minimalista)
- ✅ Gestionar múltiples currículums por usuario
- ✅ Dockerización para deployment fácil en VPS
- 🔄 **Próximamente**: Integración de pagos con Stripe
- 📱 **Opcional**: Conversión a PWA/App móvil

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Google Cloud (para OAuth)
- Cuenta de Groq (para API de IA)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/curriculai.git
cd curriculai
```

### 2. Instalar dependencias

```bash
npm run install:all
```

### 3. Configurar variables de entorno

#### Backend (`backend/.env`)

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` y añade:

**Google OAuth:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Copia Client ID y Client Secret a `.env`

**Groq API:**
1. Ve a [Groq Console](https://console.groq.com/)
2. Crea una cuenta
3. Genera una API Key
4. Copia la key a `.env`

#### Frontend (`frontend/.env`)

Copia el archivo de ejemplo:

```bash
cp frontend/.env.example frontend/.env
```

Ya está configurado por defecto para desarrollo local.

## 🚀 Desarrollo

### Ejecutar ambos servidores simultáneamente

```bash
npm run dev
```

Esto levantará:
- Frontend en [http://localhost:5173](http://localhost:5173)
- Backend en [http://localhost:3000](http://localhost:3000)

### Ejecutar servidores por separado

**Frontend:**
```bash
npm run dev:frontend
```

**Backend:**
```bash
npm run dev:backend
```

## 💰 Modelo de Negocio

**Precio simple**: **$1 USD por currículum exportado**

### ¿Qué incluye?
- ✅ Edición ilimitada (gratis hasta exportar)
- ✅ Sugerencias de IA ilimitadas
- ✅ Todas las plantillas disponibles
- ✅ Guardado en la nube
- ✅ Descarga ilimitada del PDF
- ✅ Sin suscripciones mensuales
- ✅ Sin cargos ocultos

**Solo pagas $1 cuando estés 100% satisfecho y listo para exportar tu CV.**

Ver más detalles en [PRICING_AND_MOBILE.md](docs/PRICING_AND_MOBILE.md)

---

## 📁 Estructura del Proyecto

```
CurriculAI/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── backend/           # API Node.js
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   └── package.json
├── shared/            # Código compartido
│   └── types.js
└── package.json       # Scripts del workspace
```

## 🔒 Configuración de Google OAuth (Detallado)

1. **Crear proyecto en Google Cloud Console:**
   - Ve a https://console.cloud.google.com/
   - Click en "Select a project" → "New Project"
   - Nombre: "CurriculAI"
   - Click "Create"

2. **Habilitar Google+ API:**
   - En el menú lateral: "APIs & Services" → "Library"
   - Busca "Google+ API"
   - Click "Enable"

3. **Configurar pantalla de consentimiento OAuth:**
   - "APIs & Services" → "OAuth consent screen"
   - User Type: "External"
   - App name: "CurriculAI"
   - User support email: tu email
   - Developer contact: tu email
   - Click "Save and Continue"
   - Scopes: Click "Save and Continue" (sin añadir scopes adicionales)
   - Test users: Añade tu email de Google
   - Click "Save and Continue"

4. **Crear credenciales OAuth:**
   - "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "CurriculAI Local Development"
   - Authorized JavaScript origins:
     - `http://localhost:5173`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
   - Click "Create"
   - Copia **Client ID** y **Client Secret**

5. **Añadir credenciales al .env:**
   ```env
   GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret-aqui
   ```

## 🤖 Configuración de Groq API

1. Ve a https://console.groq.com/
2. Crea una cuenta (gratis)
3. Click en "API Keys" en el menú lateral
4. Click "Create API Key"
5. Dale un nombre (ej: "CurriculAI Development")
6. Copia la key generada
7. Añade al `.env`:
   ```env
   GROQ_API_KEY=gsk_tu-key-aqui
   ```

**Límites gratuitos:**
- 14,400 peticiones/día
- Suficiente para desarrollo y MVP

## 🧪 Verificación

Para verificar que todo está configurado correctamente:

1. **Backend:**
   ```bash
   curl http://localhost:3000/health
   ```
   Debería responder: `{"status":"ok","message":"CurriculAI Backend funcionando correctamente"}`

2. **Frontend:**
   Abre http://localhost:5173 en tu navegador

## 🐳 Docker (Deployment)

Ver documentación de deployment en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 📝 Scripts Disponibles

- `npm run dev` - Ejecutar frontend + backend simultáneamente
- `npm run dev:frontend` - Solo frontend
- `npm run dev:backend` - Solo backend
- `npm run install:all` - Instalar todas las dependencias

## 📚 Documentación

Este proyecto incluye documentación completa y detallada:

- **[📋 PLAN.md](docs/PLAN.md)** - Plan completo de implementación (todas las fases)
- **[🚀 DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Guía de deployment en VPS
- **[⚡ QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Referencia rápida de comandos y estructura
- **[📊 STATUS.md](docs/STATUS.md)** - Estado actual del proyecto (actualizado continuamente)
- **[💰 PRICING_AND_MOBILE.md](docs/PRICING_AND_MOBILE.md)** - Modelo de negocio, Stripe y estrategia mobile

## 🗺️ Roadmap

### ✅ Fase 1: Setup del Proyecto - COMPLETADA
- [x] Configuración inicial
- [x] Frontend con Vite
- [x] Backend con Express
- [x] Variables de entorno
- [x] Documentación completa

### ⏳ Fase 2: Base de Datos y Autenticación
- [ ] Configurar SQLite
- [ ] Modelos de base de datos
- [ ] Google OAuth setup
- [ ] Rutas de autenticación

### 📋 Fases 3-8
- Fase 3: CRUD de Currículums
- Fase 4-5: UI del Editor y Plantillas
- Fase 6: Exportación de PDFs
- Fase 7-8: Integración IA con Groq

### 💳 Fase 9: Integración de Pagos (NUEVA)
- [ ] Configurar Stripe
- [ ] Implementar checkout de $1
- [ ] Webhook de confirmación
- [ ] Testing de pagos

### 🚀 Fases 10-11
- Fase 10: Pulido y Testing
- Fase 11: Dockerización

### 📱 Fases Opcionales
- **Fase 12**: PWA Conversion
- **Fase 13**: React Native App

Ver el [plan completo](docs/PLAN.md) y [pricing/mobile](docs/PRICING_AND_MOBILE.md) para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC License

## 🙏 Agradecimientos

- [Groq](https://groq.com/) por la API de IA gratuita
- [Vite](https://vitejs.dev/) por el increíble dev experience
- [React](https://react.dev/) por el framework

---

**¿Necesitas ayuda?** Abre un issue en GitHub o contacta al equipo de desarrollo.
