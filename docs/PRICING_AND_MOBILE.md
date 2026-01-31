# Modelo de Negocio y Estrategia Mobile - CurriculAI

**Fecha de actualización**: 31 Enero 2026

---

## 💰 Modelo de Pricing

### Estrategia: Pay-Per-CV

**Precio**: **$1 USD por currículum creado**

### ¿Por qué este modelo?

✅ **Ventajas sobre suscripciones:**
- Más justo: solo pagas por lo que usas
- Sin compromisos mensuales
- Menor barrera de entrada
- Transparente y simple de entender
- Ideal para usuarios ocasionales

❌ **Desventajas de las suscripciones:**
- Usuarios se sienten atrapados
- Hay que cancelar manualmente
- Pagas aunque no uses el servicio
- Competencia feroz con muchas opciones

### Flujo de Pago

1. **Usuario se registra** (gratis con Google OAuth)
2. **Crea y edita CV** sin límite de tiempo (gratis)
3. **Usa IA para mejorar** todas las veces que quiera (gratis)
4. **Al exportar a PDF** → se cobra $1 USD
5. **PDF se guarda** en la nube y puede descargarlo siempre

### Qué Incluye el $1

- ✅ Acceso completo al editor
- ✅ Sugerencias ilimitadas con IA (Groq API)
- ✅ Todas las plantillas disponibles
- ✅ Exportación a PDF de alta calidad
- ✅ Guardado permanente en la nube
- ✅ Descarga ilimitada del PDF
- ✅ Posibilidad de editar después (sin cargo adicional)

### Costo Real por CV

**Costos operativos estimados:**
- Groq API (IA): ~$0.001 por CV (casi gratis)
- Hosting VPS: ~$5/mes ÷ 500 CVs = $0.01 por CV
- Base de datos SQLite: $0
- Google OAuth: $0
- **Total costo**: ~$0.011 por CV

**Margen de ganancia**: $1.00 - $0.011 = **$0.989 por CV** (98.9%)

### Proyecciones

**Escenario conservador:**
- 100 CVs/mes → $100/mes - $5 hosting = **$95/mes ganancia**
- 500 CVs/mes → $500/mes - $5 hosting = **$495/mes ganancia**

**Escenario optimista:**
- 1,000 CVs/mes → $1,000/mes - $10 hosting = **$990/mes ganancia**
- 5,000 CVs/mes → $5,000/mes - $20 hosting = **$4,980/mes ganancia**

---

## 💳 Integración de Pagos (Fase Adicional)

### Plataforma: Stripe

**¿Por qué Stripe?**
- Fácil integración con React y Node.js
- Acepta tarjetas de crédito/débito globalmente
- Tarifas competitivas: 2.9% + $0.30 por transacción
- Excelente documentación y SDK
- Cumple con PCI DSS (seguridad)
- Webhooks para automatización

### Costo de Stripe por Transacción

**Cobro al usuario**: $1.00
**Tarifa Stripe**: $0.059 (2.9% de $1.00 + $0.30)
**Neto recibido**: $0.941 por CV

**Margen ajustado**: $0.941 - $0.011 (costos) = **$0.93 por CV** (93%)

### Implementación de Stripe

**Archivos a crear:**

1. **`backend/src/routes/payments.js`**
   - Crear Stripe Checkout Session
   - Webhook para confirmar pago
   - Actualizar estado del CV

2. **`backend/src/services/stripeService.js`**
   - Configuración de Stripe
   - Crear sesión de pago
   - Verificar webhook signature

3. **`frontend/src/services/paymentService.js`**
   - Iniciar pago
   - Redirigir a Stripe Checkout
   - Manejar success/cancel

4. **`backend/src/models/Payment.js`**
   - Tabla payments (id, user_id, resume_id, stripe_session_id, status, amount)

### Base de Datos - Nueva Tabla

```sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  resume_id INTEGER NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,           -- En centavos (100 = $1.00)
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',     -- pending, completed, failed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);
```

### Flujo de Pago Completo

1. **Usuario clickea "Exportar a PDF"**
   ```javascript
   // Frontend
   const handleExport = async () => {
     const session = await createCheckoutSession(resumeId);
     window.location.href = session.url; // Redirige a Stripe
   };
   ```

2. **Backend crea Stripe Checkout Session**
   ```javascript
   // Backend
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{
       price_data: {
         currency: 'usd',
         product_data: {
           name: 'Currículum Profesional',
           description: 'Exportación a PDF de alta calidad'
         },
         unit_amount: 100, // $1.00 en centavos
       },
       quantity: 1,
     }],
     mode: 'payment',
     success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
     cancel_url: `${FRONTEND_URL}/editor/${resumeId}`,
   });
   ```

3. **Usuario paga en Stripe** (redirigido fuera del sitio)

4. **Stripe envía webhook al backend**
   ```javascript
   // Backend webhook
   app.post('/api/webhooks/stripe', async (req, res) => {
     const sig = req.headers['stripe-signature'];
     const event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);

     if (event.type === 'checkout.session.completed') {
       const session = event.data.object;
       // Actualizar payment a "completed"
       // Generar y guardar PDF
       // Enviar email de confirmación (opcional)
     }
   });
   ```

5. **Usuario es redirigido a página de éxito**

6. **PDF se genera automáticamente y guarda en DB**

### Variables de Entorno Adicionales

```env
# Stripe (backend/.env)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Testing con Stripe

**Tarjetas de prueba:**
- Éxito: `4242 4242 4242 4242`
- Fallo: `4000 0000 0000 0002`
- Requiere autenticación: `4000 0025 0000 3155`

---

## 📱 Estrategia Mobile-First

### Diseño Responsive

**Breakpoints:**
- Mobile: 360px - 480px (prioridad)
- Tablet: 481px - 768px
- Desktop: 769px+

**Características Mobile-Friendly:**
- ✅ Touch targets mínimos de 44x44px
- ✅ Fuentes legibles (mínimo 16px en body)
- ✅ Espaciado generoso entre elementos
- ✅ Botones grandes y fáciles de tocar
- ✅ Formularios optimizados para móvil
- ✅ Sin hover effects en touch devices

### Optimizaciones Implementadas

```css
/* Touch device detection */
@media (hover: none) and (pointer: coarse) {
  /* Todos los botones tienen min-height: 48px */
  button {
    min-height: 48px;
    min-width: 48px;
  }

  /* Sin animaciones hover en móvil */
  .card:hover {
    transform: none;
  }

  /* Pero sí feedback activo */
  .card:active {
    transform: scale(0.98);
  }
}
```

---

## 📲 Fase Opcional: Conversión a App Móvil

**⚠️ FASE OPCIONAL** - Solo después de MVP web completo

### Opción 1: Progressive Web App (PWA) ⭐ RECOMENDADO

**Ventajas:**
- ✅ Mismo código base (React)
- ✅ Se instala desde el navegador
- ✅ Funciona offline (con service workers)
- ✅ Notificaciones push
- ✅ Acceso a cámara, geolocalización, etc.
- ✅ Sin App Store/Google Play (distribución directa)
- ✅ Actualizaciones automáticas

**Desventajas:**
- ❌ No aparece en App Store/Google Play
- ❌ Funcionalidades limitadas vs app nativa
- ❌ Menor visibilidad

**Implementación:**

1. **Instalar dependencias**
   ```bash
   npm install workbox-webpack-plugin
   ```

2. **Crear `frontend/public/manifest.json`**
   ```json
   {
     "name": "CurriculAI",
     "short_name": "CurriculAI",
     "description": "Crea tu currículum profesional con IA",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#3b82f6",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

3. **Crear Service Worker** (`frontend/src/sw.js`)
   ```javascript
   import { precacheAndRoute } from 'workbox-precaching';
   import { registerRoute } from 'workbox-routing';
   import { CacheFirst } from 'workbox-strategies';

   // Cache de assets estáticos
   precacheAndRoute(self.__WB_MANIFEST);

   // Cache de imágenes
   registerRoute(
     ({request}) => request.destination === 'image',
     new CacheFirst({
       cacheName: 'images',
       plugins: [
         new ExpirationPlugin({
           maxEntries: 60,
           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
         }),
       ],
     })
   );
   ```

4. **Actualizar `index.html`**
   ```html
   <link rel="manifest" href="/manifest.json">
   <meta name="theme-color" content="#3b82f6">
   <link rel="apple-touch-icon" href="/icon-192.png">
   ```

**Tiempo estimado**: 2-3 días adicionales

---

### Opción 2: React Native (App Nativa)

**Ventajas:**
- ✅ Aparece en App Store y Google Play
- ✅ Acceso completo a APIs nativas
- ✅ Mejor rendimiento
- ✅ Look & feel nativo

**Desventajas:**
- ❌ Código separado del web (aunque comparte lógica)
- ❌ Requiere publicación en stores (costos y aprobación)
- ❌ Mantenimiento de 2 apps (iOS + Android)
- ❌ Curva de aprendizaje

**Implementación:**

Crear nuevo proyecto React Native:
```bash
npx react-native init CurriculAIMobile
```

**Componentes reutilizables:**
- Toda la lógica de negocio (services, utils)
- Esquema de datos (shared/types.js)
- API calls (solo cambiar base URL)

**Componentes nuevos:**
- UI components (nativos en vez de HTML/CSS)
- Navegación (React Navigation)
- Almacenamiento (AsyncStorage en vez de localStorage)

**Tiempo estimado**: 3-4 semanas adicionales

---

### Opción 3: Capacitor (Híbrido)

**Ventajas:**
- ✅ Mismo código React
- ✅ Se publica en App Store/Google Play
- ✅ Acceso a APIs nativas
- ✅ Más fácil que React Native

**Desventajas:**
- ❌ Rendimiento inferior a nativo
- ❌ Tamaño de app más grande

**Tiempo estimado**: 1-2 semanas adicionales

---

## 🎯 Recomendación

### Para MVP y Primeros 6 Meses:
1. **Web responsive mobile-first** (ya implementado)
2. **PWA básica** (3 días extra) para que usuarios puedan "instalar" en móvil
3. **Optimizar para móvil** continuamente basado en analytics

### Después de Validar el Mercado:
- Si >60% de usuarios vienen de móvil → **React Native**
- Si <40% de usuarios vienen de móvil → **Seguir con PWA mejorada**

---

## 📊 Fases Actualizadas del Proyecto

### Fase 1: Setup ✅ COMPLETADA
- Landing page con pricing claro ($1)
- Login con Google OAuth
- Mobile-first responsive design

### Fase 2-8: Core Features (según plan original)
- Base de datos y autenticación
- Editor de currículum
- Plantillas y vista previa
- IA con Groq
- Etc.

### **Fase 9 (NUEVA): Integración de Pagos con Stripe**
**Duración estimada**: 2-3 días

**Tareas:**
- [ ] Configurar cuenta Stripe
- [ ] Implementar backend Stripe service
- [ ] Crear ruta /api/payments/create-checkout
- [ ] Crear webhook /api/webhooks/stripe
- [ ] Actualizar modelo Resume con campo "paid"
- [ ] Crear tabla payments
- [ ] Implementar frontend payment flow
- [ ] Testing con tarjetas de prueba
- [ ] Probar webhooks con Stripe CLI

### Fase 10: Pulido y Testing
(según plan original)

### Fase 11: Dockerización
(según plan original)

### **Fase 12 (OPCIONAL): PWA Conversion**
**Duración estimada**: 2-3 días

**Tareas:**
- [ ] Crear manifest.json
- [ ] Implementar Service Worker
- [ ] Offline fallback page
- [ ] Cache strategies
- [ ] Testing instalación en móvil
- [ ] Iconos app (192x192, 512x512)

### **Fase 13 (OPCIONAL): React Native App**
**Duración estimada**: 3-4 semanas

**Tareas:**
- [ ] Setup React Native proyecto
- [ ] Migrar componentes UI
- [ ] Implementar navegación
- [ ] Integrar con backend existente
- [ ] Testing iOS y Android
- [ ] Preparar para App Store/Google Play

---

## 💡 Consejos de Monetización

### Marketing para $1/CV:

**Mensajes clave:**
- "Sin suscripciones mensuales"
- "Solo pagas cuando exportas"
- "Edita sin límite, gratis"
- "Más barato que una taza de café"
- "Una inversión de $1 en tu carrera"

### Upsells Futuros (v2.0):

1. **Paquete de 5 CVs**: $4 (ahorro de 20%)
2. **CV Premium**: $3 (plantillas exclusivas + revisión IA avanzada)
3. **Carta de presentación**: +$0.50
4. **Análisis ATS**: +$1
5. **LinkedIn optimization**: +$2

---

**Última actualización**: 31 Enero 2026
