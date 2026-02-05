import express from 'express';
import { PDF } from '../models/PDF.js';
import { Resume } from '../models/Resume.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

/**
 * GET /api/pdfs
 * Listar todos los PDFs del usuario autenticado (sin datos binarios)
 */
router.get('/', async (req, res) => {
  try {
    const pdfs = PDF.findByUser(req.user.id);
    res.json({
      success: true,
      count: pdfs.length,
      pdfs
    });
  } catch (error) {
    console.error('❌ Error al listar PDFs:', error);
    res.status(500).json({
      error: 'Error al listar PDFs',
      message: error.message
    });
  }
});

/**
 * GET /api/pdfs/resume/:resumeId
 * Listar todos los PDFs de un currículum específico
 */
router.get('/resume/:resumeId', async (req, res) => {
  try {
    const pdfs = PDF.findByResumeAndUser(req.params.resumeId, req.user.id);
    res.json({
      success: true,
      count: pdfs.length,
      pdfs
    });
  } catch (error) {
    console.error('❌ Error al listar PDFs del currículum:', error);
    res.status(500).json({
      error: 'Error al listar PDFs',
      message: error.message
    });
  }
});

/**
 * GET /api/pdfs/:id/download
 * Descargar un PDF específico
 */
router.get('/:id/download', async (req, res) => {
  try {
    const pdf = PDF.findByIdAndUser(req.params.id, req.user.id);

    if (!pdf) {
      return res.status(404).json({
        error: 'PDF no encontrado',
        message: 'No se encontró el PDF o no tienes permiso para descargarlo'
      });
    }

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdf.filename}"`);
    res.setHeader('Content-Length', pdf.file_size);

    // Enviar el buffer del PDF
    res.send(pdf.pdf_data);
  } catch (error) {
    console.error('❌ Error al descargar PDF:', error);
    res.status(500).json({
      error: 'Error al descargar PDF',
      message: error.message
    });
  }
});

/**
 * POST /api/pdfs
 * Guardar un nuevo PDF
 * Body: { resume_id, filename, pdf_data (base64) }
 */
router.post('/', async (req, res) => {
  try {
    const { resume_id, filename, pdf_data } = req.body;

    // Validaciones
    if (!resume_id) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'El campo "resume_id" es requerido'
      });
    }

    if (!filename) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'El campo "filename" es requerido'
      });
    }

    if (!pdf_data) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'El campo "pdf_data" es requerido'
      });
    }

    // Verificar que el currículum existe y pertenece al usuario
    const resume = Resume.findByIdAndUser(resume_id, req.user.id);
    if (!resume) {
      return res.status(404).json({
        error: 'Currículum no encontrado',
        message: 'No se encontró el currículum o no tienes permiso para agregar PDFs'
      });
    }

    // Convertir base64 a Buffer
    const pdfBuffer = Buffer.from(pdf_data, 'base64');
    const fileSize = pdfBuffer.length;

    // Crear el PDF
    const pdf = PDF.create({
      resume_id,
      user_id: req.user.id,
      filename,
      pdf_data: pdfBuffer,
      file_size: fileSize
    });

    res.status(201).json({
      success: true,
      message: 'PDF guardado exitosamente',
      pdf
    });
  } catch (error) {
    console.error('❌ Error al guardar PDF:', error);
    res.status(500).json({
      error: 'Error al guardar PDF',
      message: error.message
    });
  }
});

/**
 * DELETE /api/pdfs/:id
 * Eliminar un PDF
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = PDF.delete(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'PDF no encontrado',
        message: 'No se encontró el PDF o no tienes permiso para eliminarlo'
      });
    }

    res.json({
      success: true,
      message: 'PDF eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar PDF:', error);
    res.status(500).json({
      error: 'Error al eliminar PDF',
      message: error.message
    });
  }
});

/**
 * GET /api/pdfs/stats
 * Obtener estadísticas de PDFs del usuario
 */
router.get('/stats', async (req, res) => {
  try {
    const count = PDF.countByUser(req.user.id);
    const totalSize = PDF.totalSizeByUser(req.user.id);

    res.json({
      success: true,
      count,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de PDFs:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
});

export default router;
