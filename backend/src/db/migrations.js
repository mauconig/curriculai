import db from './database.js';

/**
 * Ejecutar todas las migraciones necesarias para crear el esquema de la base de datos
 */
export const runMigrations = () => {
  console.log('🔄 Ejecutando migraciones de base de datos...');

  try {
    // Tabla: users
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        picture TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);
    console.log('✅ Tabla "users" creada/verificada');

    // Tabla: resumes
    db.exec(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT DEFAULT 'Mi Currículum',
        data TEXT NOT NULL,
        template TEXT DEFAULT 'modern',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla "resumes" creada/verificada');

    // Tabla: pdfs
    db.exec(`
      CREATE TABLE IF NOT EXISTS pdfs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resume_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        pdf_data BLOB NOT NULL,
        file_size INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla "pdfs" creada/verificada');

    // Crear índices para mejorar el rendimiento de las consultas
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
      CREATE INDEX IF NOT EXISTS idx_pdfs_user_id ON pdfs(user_id);
      CREATE INDEX IF NOT EXISTS idx_pdfs_resume_id ON pdfs(resume_id);
    `);
    console.log('✅ Índices creados/verificados');

    console.log('✅ Migraciones completadas exitosamente\n');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  }
};

/**
 * Función para resetear la base de datos (útil para desarrollo)
 * ⚠️ CUIDADO: Esto borra TODOS los datos
 */
export const resetDatabase = () => {
  console.log('⚠️  RESETEANDO BASE DE DATOS...');

  db.exec(`
    DROP TABLE IF EXISTS pdfs;
    DROP TABLE IF EXISTS resumes;
    DROP TABLE IF EXISTS users;
  `);

  console.log('✅ Tablas eliminadas');

  // Volver a crear las tablas
  runMigrations();
};
