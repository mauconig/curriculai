/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado antes de permitir acceso a rutas protegidas
 */
export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    error: 'No autenticado',
    message: 'Debes iniciar sesión para acceder a este recurso'
  });
};

/**
 * Middleware opcional de autenticación
 * Permite el acceso pero adjunta el usuario si está autenticado
 */
export const optionalAuth = (req, res, next) => {
  // Simplemente continúa, req.user estará disponible si está autenticado
  next();
};

/**
 * Middleware para verificar que el usuario es dueño del recurso
 */
export const requireOwnership = (userIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
    }

    // El recurso debe tener un campo user_id que coincida con el usuario actual
    const resourceUserId = req.body[userIdField] || req.params[userIdField];

    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permiso para acceder a este recurso'
      });
    }

    next();
  };
};

export default {
  requireAuth,
  optionalAuth,
  requireOwnership
};
