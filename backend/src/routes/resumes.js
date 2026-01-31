import express from 'express';
import { Resume } from '../models/Resume.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

/**
 * GET /api/resumes
 * Listar todos los currículums del usuario autenticado
 */
router.get('/', async (req, res) => {
  try {
    const resumes = Resume.findByUserId(req.user.id);
    res.json({
      success: true,
      count: resumes.length,
      resumes
    });
  } catch (error) {
    console.error('❌ Error al listar currículums:', error);
    res.status(500).json({
      error: 'Error al listar currículums',
      message: error.message
    });
  }
});

/**
 * GET /api/resumes/:id
 * Obtener un currículum específico por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const resume = Resume.findByIdAndUser(req.params.id, req.user.id);

    if (!resume) {
      return res.status(404).json({
        error: 'Currículum no encontrado',
        message: 'No se encontró el currículum o no tienes permiso para verlo'
      });
    }

    // El modelo ya parsea el JSON
    res.json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('❌ Error al obtener currículum:', error);
    res.status(500).json({
      error: 'Error al obtener currículum',
      message: error.message
    });
  }
});

/**
 * POST /api/resumes
 * Crear un nuevo currículum
 */
router.post('/', async (req, res) => {
  try {
    const { title, data, template } = req.body;

    if (!data) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: 'El campo "data" es requerido'
      });
    }

    const resume = Resume.create({
      user_id: req.user.id,
      title: title || 'Mi Currículum',
      data: typeof data === 'string' ? data : JSON.stringify(data),
      template: template || 'modern'
    });

    // El modelo ya parsea el JSON
    res.status(201).json({
      success: true,
      message: 'Currículum creado exitosamente',
      resume
    });
  } catch (error) {
    console.error('❌ Error al crear currículum:', error);
    res.status(500).json({
      error: 'Error al crear currículum',
      message: error.message
    });
  }
});

/**
 * PUT /api/resumes/:id
 * Actualizar un currículum existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, data, template } = req.body;

    // Verificar que el currículum existe y pertenece al usuario
    const existingResume = Resume.findByIdAndUser(req.params.id, req.user.id);

    if (!existingResume) {
      return res.status(404).json({
        error: 'Currículum no encontrado',
        message: 'No se encontró el currículum o no tienes permiso para editarlo'
      });
    }

    const updatedResume = Resume.update(req.params.id, {
      title,
      data: data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined,
      template
    });

    if (!updatedResume) {
      return res.status(500).json({
        error: 'Error al actualizar',
        message: 'No se pudo actualizar el currículum'
      });
    }

    // El modelo ya parsea el JSON
    res.json({
      success: true,
      message: 'Currículum actualizado exitosamente',
      resume: updatedResume
    });
  } catch (error) {
    console.error('❌ Error al actualizar currículum:', error);
    res.status(500).json({
      error: 'Error al actualizar currículum',
      message: error.message
    });
  }
});

/**
 * DELETE /api/resumes/:id
 * Eliminar un currículum
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = Resume.delete(req.params.id, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        error: 'Currículum no encontrado',
        message: 'No se encontró el currículum o no tienes permiso para eliminarlo'
      });
    }

    res.json({
      success: true,
      message: 'Currículum eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar currículum:', error);
    res.status(500).json({
      error: 'Error al eliminar currículum',
      message: error.message
    });
  }
});

/**
 * GET /api/resumes/stats/count
 * Obtener estadísticas de currículums del usuario
 */
router.get('/stats/count', async (req, res) => {
  try {
    const count = Resume.countByUser(req.user.id);
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
});

export default router;
