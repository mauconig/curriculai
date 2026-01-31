import db from '../db/database.js';

/**
 * Modelo de Currículum
 */
export class Resume {
  /**
   * Crear un nuevo currículum
   * @param {Object} resumeData - Datos del currículum
   * @returns {Object} Currículum creado
   */
  static create({ user_id, title = 'Mi Currículum', data, template = 'modern' }) {
    // Convertir el objeto data a JSON string
    const dataJson = typeof data === 'string' ? data : JSON.stringify(data);

    const result = db.prepare(`
      INSERT INTO resumes (user_id, title, data, template, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(user_id, title, dataJson, template);

    return Resume.findById(result.lastInsertRowid);
  }

  /**
   * Buscar currículum por ID
   * @param {number} id - ID del currículum
   * @returns {Object|undefined} Currículum encontrado
   */
  static findById(id) {
    const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(id);

    if (resume) {
      // Parsear el JSON de data
      resume.data = JSON.parse(resume.data);
    }

    return resume;
  }

  /**
   * Buscar currículum por ID y verificar que pertenece al usuario
   * @param {number} id - ID del currículum
   * @param {number} userId - ID del usuario
   * @returns {Object|undefined} Currículum encontrado
   */
  static findByIdAndUser(id, userId) {
    const resume = db.prepare(`
      SELECT * FROM resumes
      WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (resume) {
      resume.data = JSON.parse(resume.data);
    }

    return resume;
  }

  /**
   * Listar todos los currículums de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Array} Lista de currículums
   */
  static findByUserId(userId) {
    const resumes = db.prepare(`
      SELECT * FROM resumes
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(userId);

    // Parsear el JSON de cada currículum
    return resumes.map(resume => ({
      ...resume,
      data: JSON.parse(resume.data)
    }));
  }

  /**
   * Actualizar un currículum
   * @param {number} id - ID del currículum
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|undefined} Currículum actualizado
   */
  static update(id, updates) {
    const allowedFields = ['title', 'data', 'template'];
    const setClause = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = ?`);
        // Si es data, convertir a JSON
        const value = key === 'data'
          ? (typeof updates[key] === 'string' ? updates[key] : JSON.stringify(updates[key]))
          : updates[key];
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      return Resume.findById(id);
    }

    // Añadir updated_at
    setClause.push("updated_at = datetime('now')");
    values.push(id);

    const sql = `UPDATE resumes SET ${setClause.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);

    return Resume.findById(id);
  }

  /**
   * Eliminar un currículum (también elimina sus PDFs por CASCADE)
   * @param {number} id - ID del currículum
   * @param {number} userId - ID del usuario (para verificar ownership)
   * @returns {Object} Resultado de la eliminación
   */
  static delete(id, userId) {
    return db.prepare(`
      DELETE FROM resumes
      WHERE id = ? AND user_id = ?
    `).run(id, userId);
  }

  /**
   * Contar currículums de un usuario
   * @param {number} userId - ID del usuario
   * @returns {number} Total de currículums
   */
  static countByUser(userId) {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM resumes
      WHERE user_id = ?
    `).get(userId);
    return result.count;
  }

  /**
   * Contar total de currículums en el sistema
   * @returns {number} Total de currículums
   */
  static count() {
    const result = db.prepare('SELECT COUNT(*) as count FROM resumes').get();
    return result.count;
  }
}

export default Resume;
