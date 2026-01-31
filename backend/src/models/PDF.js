import db from '../db/database.js';

/**
 * Modelo de PDF
 */
export class PDF {
  /**
   * Crear un nuevo PDF
   * @param {Object} pdfData - Datos del PDF
   * @returns {Object} PDF creado
   */
  static create({ resume_id, user_id, filename, pdf_data, file_size }) {
    const result = db.prepare(`
      INSERT INTO pdfs (resume_id, user_id, filename, pdf_data, file_size, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(resume_id, user_id, filename, pdf_data, file_size);

    // Devolver PDF sin el BLOB para ahorrar memoria
    return PDF.findByIdWithoutBlob(result.lastInsertRowid);
  }

  /**
   * Buscar PDF por ID (sin incluir el BLOB de datos)
   * @param {number} id - ID del PDF
   * @returns {Object|undefined} PDF encontrado (sin pdf_data)
   */
  static findByIdWithoutBlob(id) {
    return db.prepare(`
      SELECT id, resume_id, user_id, filename, file_size, created_at
      FROM pdfs
      WHERE id = ?
    `).get(id);
  }

  /**
   * Buscar PDF por ID (incluyendo el BLOB de datos)
   * @param {number} id - ID del PDF
   * @returns {Object|undefined} PDF encontrado completo
   */
  static findById(id) {
    return db.prepare('SELECT * FROM pdfs WHERE id = ?').get(id);
  }

  /**
   * Buscar PDF por ID y verificar que pertenece al usuario
   * @param {number} id - ID del PDF
   * @param {number} userId - ID del usuario
   * @returns {Object|undefined} PDF encontrado
   */
  static findByIdAndUser(id, userId) {
    return db.prepare(`
      SELECT * FROM pdfs
      WHERE id = ? AND user_id = ?
    `).get(id, userId);
  }

  /**
   * Listar todos los PDFs de un currículum (sin BLOBs)
   * @param {number} resumeId - ID del currículum
   * @param {number} userId - ID del usuario
   * @returns {Array} Lista de PDFs
   */
  static findByResumeAndUser(resumeId, userId) {
    return db.prepare(`
      SELECT id, resume_id, user_id, filename, file_size, created_at
      FROM pdfs
      WHERE resume_id = ? AND user_id = ?
      ORDER BY created_at DESC
    `).all(resumeId, userId);
  }

  /**
   * Listar todos los PDFs de un usuario (sin BLOBs)
   * @param {number} userId - ID del usuario
   * @returns {Array} Lista de PDFs
   */
  static findByUser(userId) {
    return db.prepare(`
      SELECT id, resume_id, user_id, filename, file_size, created_at
      FROM pdfs
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId);
  }

  /**
   * Eliminar un PDF
   * @param {number} id - ID del PDF
   * @param {number} userId - ID del usuario (para verificar ownership)
   * @returns {Object} Resultado de la eliminación
   */
  static delete(id, userId) {
    return db.prepare(`
      DELETE FROM pdfs
      WHERE id = ? AND user_id = ?
    `).run(id, userId);
  }

  /**
   * Eliminar todos los PDFs de un currículum
   * @param {number} resumeId - ID del currículum
   * @param {number} userId - ID del usuario
   * @returns {Object} Resultado de la eliminación
   */
  static deleteByResume(resumeId, userId) {
    return db.prepare(`
      DELETE FROM pdfs
      WHERE resume_id = ? AND user_id = ?
    `).run(resumeId, userId);
  }

  /**
   * Contar PDFs de un currículum
   * @param {number} resumeId - ID del currículum
   * @returns {number} Total de PDFs
   */
  static countByResume(resumeId) {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM pdfs
      WHERE resume_id = ?
    `).get(resumeId);
    return result.count;
  }

  /**
   * Contar PDFs de un usuario
   * @param {number} userId - ID del usuario
   * @returns {number} Total de PDFs
   */
  static countByUser(userId) {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM pdfs
      WHERE user_id = ?
    `).get(userId);
    return result.count;
  }

  /**
   * Calcular tamaño total de PDFs de un usuario (en bytes)
   * @param {number} userId - ID del usuario
   * @returns {number} Tamaño total en bytes
   */
  static totalSizeByUser(userId) {
    const result = db.prepare(`
      SELECT COALESCE(SUM(file_size), 0) as total_size
      FROM pdfs
      WHERE user_id = ?
    `).get(userId);
    return result.total_size;
  }

  /**
   * Contar total de PDFs en el sistema
   * @returns {number} Total de PDFs
   */
  static count() {
    const result = db.prepare('SELECT COUNT(*) as count FROM pdfs').get();
    return result.count;
  }
}

export default PDF;
