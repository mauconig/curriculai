import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

/**
 * GET /api/auth/google
 * Iniciar el proceso de autenticación con Google
 */
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * GET /api/auth/google/callback
 * Callback de Google después de la autenticación
 */
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL + '/login?error=auth_failed',
    failureMessage: true
  }),
  (req, res) => {
    // Autenticación exitosa, redirigir al dashboard
    res.redirect(process.env.FRONTEND_URL + '/dashboard');
  }
);

/**
 * POST /api/auth/logout
 * Cerrar sesión del usuario
 */
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('❌ Error al cerrar sesión:', err);
      return res.status(500).json({
        error: 'Error al cerrar sesión',
        message: 'Hubo un problema al cerrar tu sesión'
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Error al destruir sesión:', err);
      }

      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Sesión cerrada correctamente'
      });
    });
  });
});

/**
 * GET /api/auth/me
 * Obtener información del usuario actual
 */
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      }
    });
  } else {
    res.status(401).json({
      authenticated: false,
      error: 'No autenticado'
    });
  }
});

/**
 * GET /api/auth/status
 * Verificar estado de autenticación (endpoint público)
 */
router.get('/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    } : null
  });
});

export default router;
