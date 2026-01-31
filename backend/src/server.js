import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport.js';
import { runMigrations } from './db/migrations.js';
import authRoutes from './routes/auth.js';
import resumesRoutes from './routes/resumes.js';

// Cargar variables de entorno
dotenv.config();

// Ejecutar migraciones de base de datos
console.log('\n🔧 Inicializando base de datos...');
runMigrations();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones (debe ir antes de Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'curriculai-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CurriculAI Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({
    message: '¡Bienvenido a CurriculAI API!',
    version: '1.0.0'
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de currículums
app.use('/api/resumes', resumesRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    message: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor CurriculAI corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check disponible en http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
