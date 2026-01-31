import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Usar DATABASE_PATH del .env o por defecto crear en src/db/
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'curriculai.db');

console.log('📁 Ruta de la base de datos:', dbPath);

// Crear instancia de la base de datos
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Habilitar foreign keys (importante para CASCADE DELETE)
db.pragma('foreign_keys = ON');

// Configuraciones de optimización
db.pragma('journal_mode = WAL'); // Write-Ahead Logging para mejor performance

console.log('✅ Base de datos SQLite conectada correctamente');

export default db;
