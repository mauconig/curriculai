import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración de Passport con Google OAuth 2.0
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar o crear usuario en la base de datos
        const user = User.findOrCreate({
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0]?.value
        });

        // Actualizar última sesión
        User.updateLastLogin(user.id);

        return done(null, user);
      } catch (error) {
        console.error('❌ Error en autenticación de Google:', error);
        return done(error, null);
      }
    }
  )
);

/**
 * Serializar usuario para la sesión
 * Solo guardamos el ID del usuario en la sesión
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserializar usuario desde la sesión
 * Recuperamos el usuario completo usando el ID
 */
passport.deserializeUser((id, done) => {
  try {
    const user = User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('❌ Error al deserializar usuario:', error);
    done(error, null);
  }
});

export default passport;
