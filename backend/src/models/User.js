import db from '../db/database.js';

/**
 * Modelo de Usuario
 */
export class User {
  /**
   * Buscar o crear un usuario (usado en Google OAuth)
   * @param {Object} userData - Datos del usuario de Google
   * @returns {Object} Usuario encontrado o creado
   */
  static findOrCreate({ google_id, email, name, picture }) {
    // Buscar usuario existente por google_id
    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(google_id);

    if (user) {
      // Si existe, actualizar datos (por si cambiaron en Google)
      db.prepare(`
        UPDATE users
        SET email = ?, name = ?, picture = ?
        WHERE google_id = ?
      `).run(email, name, picture, google_id);

      // Devolver usuario actualizado
      user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(google_id);
      return user;
    }

    // Si no existe, crear nuevo usuario
    const result = db.prepare(`
      INSERT INTO users (google_id, email, name, picture, created_at, last_login)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(google_id, email, name, picture);

    // Devolver el usuario creado
    return db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }

  /**
   * Buscar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Object|undefined} Usuario encontrado o undefined
   */
  static findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|undefined} Usuario encontrado o undefined
   */
  static findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  /**
   * Buscar usuario por Google ID
   * @param {string} googleId - Google ID del usuario
   * @returns {Object|undefined} Usuario encontrado o undefined
   */
  static findByGoogleId(googleId) {
    return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
  }

  /**
   * Actualizar última fecha de login
   * @param {number} userId - ID del usuario
   */
  static updateLastLogin(userId) {
    db.prepare(`
      UPDATE users
      SET last_login = datetime('now')
      WHERE id = ?
    `).run(userId);
  }

  /**
   * Eliminar usuario (también elimina resumes y PDFs por CASCADE)
   * @param {number} userId - ID del usuario
   */
  static delete(userId) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  }

  /**
   * Contar total de usuarios
   * @returns {number} Total de usuarios
   */
  static count() {
    const result = db.prepare('SELECT COUNT(*) as count FROM users').get();
    return result.count;
  }
}

export default User;
