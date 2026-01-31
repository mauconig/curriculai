# Guía de Deployment - CurriculAI

## 📋 Índice

1. [Requisitos](#requisitos)
2. [Deployment Local con Docker](#deployment-local-con-docker)
3. [Deployment en VPS](#deployment-en-vps)
4. [Configuración SSL/HTTPS](#configuración-ssl-https)
5. [Backups Automáticos](#backups-automáticos)
6. [Troubleshooting](#troubleshooting)

---

## Requisitos

### Para Desarrollo Local
- Docker Desktop instalado
- Docker Compose instalado
- Credenciales de Google OAuth configuradas para localhost

### Para VPS (Producción)
- VPS con Ubuntu 20.04+ / Debian 11+
- Mínimo 1GB RAM
- 10GB espacio en disco
- Dominio apuntando al VPS (opcional pero recomendado)
- Acceso SSH al VPS

---

## Deployment Local con Docker

### 1. Construir imágenes

```bash
# Desde el directorio raíz del proyecto
docker-compose -f docker/docker-compose.yml build
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_secret
GOOGLE_CALLBACK_URL=http://localhost/api/auth/google/callback
SESSION_SECRET=tu_session_secret_generado
GROQ_API_KEY=tu_groq_key
```

### 3. Levantar contenedores

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 4. Verificar

- Frontend: http://localhost
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

### 5. Ver logs

```bash
# Logs de todos los servicios
docker-compose -f docker/docker-compose.yml logs -f

# Logs solo del backend
docker-compose -f docker/docker-compose.yml logs -f backend

# Logs solo del frontend
docker-compose -f docker/docker-compose.yml logs -f frontend
```

### 6. Detener contenedores

```bash
docker-compose -f docker/docker-compose.yml down
```

---

## Deployment en VPS

### Paso 1: Preparar el VPS

#### 1.1 Conectar por SSH

```bash
ssh tu-usuario@tu-vps-ip
```

#### 1.2 Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### 1.3 Instalar Docker

```bash
# Descargar script de instalación
curl -fsSL https://get.docker.com -o get-docker.sh

# Ejecutar script
sudo sh get-docker.sh

# Añadir usuario al grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose plugin
sudo apt install docker-compose-plugin
```

#### 1.4 Relogin para aplicar cambios

```bash
exit
ssh tu-usuario@tu-vps-ip
```

#### 1.5 Verificar instalación

```bash
docker --version
docker compose version
```

---

### Paso 2: Configurar el Proyecto

#### 2.1 Crear directorio de trabajo

```bash
sudo mkdir -p /opt/curriculai
sudo chown $USER:$USER /opt/curriculai
cd /opt/curriculai
```

#### 2.2 Clonar el proyecto

```bash
git clone https://github.com/tu-usuario/curriculai.git .
```

#### 2.3 Crear archivo .env

```bash
nano .env
```

Añadir:

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_secret
GOOGLE_CALLBACK_URL=https://tudominio.com/api/auth/google/callback
SESSION_SECRET=generar_secret_seguro
GROQ_API_KEY=tu_groq_key
```

**IMPORTANTE**: Generar un SESSION_SECRET seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2.4 Actualizar Google OAuth

En [Google Cloud Console](https://console.cloud.google.com/):

1. Ve a tu proyecto
2. Credentials → Edita tu OAuth client
3. Añade a "Authorized JavaScript origins":
   - `https://tudominio.com`
4. Añade a "Authorized redirect URIs":
   - `https://tudominio.com/api/auth/google/callback`
5. Guarda cambios

---

### Paso 3: Configurar Dominio (Opcional pero Recomendado)

#### 3.1 Configurar DNS

En tu proveedor de dominios (GoDaddy, Namecheap, Cloudflare, etc.):

1. Crea un registro A:
   - **Name**: `@` (o `www`)
   - **Type**: A
   - **Value**: IP de tu VPS
   - **TTL**: 300

2. Espera propagación DNS (5-30 minutos)

3. Verifica:
   ```bash
   ping tudominio.com
   ```

#### 3.2 Instalar Certbot (SSL/HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot certonly --standalone -d tudominio.com

# Certificados se guardan en:
# /etc/letsencrypt/live/tudominio.com/
```

#### 3.3 Renovación automática de SSL

Certbot ya configura auto-renovación. Verificar:

```bash
sudo certbot renew --dry-run
```

---

### Paso 4: Levantar la Aplicación

#### 4.1 Build y start

```bash
cd /opt/curriculai
docker compose -f docker/docker-compose.prod.yml up -d --build
```

#### 4.2 Verificar que funciona

```bash
# Ver logs
docker compose -f docker/docker-compose.prod.yml logs -f

# Verificar contenedores corriendo
docker ps

# Test local
curl http://localhost:3000/health
```

#### 4.3 Acceder desde el navegador

- `http://tudominio.com` (si configuraste dominio)
- O `http://tu-vps-ip`

---

### Paso 5: Configurar Nginx con SSL (Si usas dominio)

#### 5.1 Actualizar nginx.conf

Edita `docker/nginx.conf`:

```nginx
upstream backend {
    server backend:3000;
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name tudominio.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend (SPA)
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5.2 Actualizar docker-compose.prod.yml

```yaml
services:
  nginx:
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro  # Certificados SSL
      - frontend-dist:/usr/share/nginx/html:ro
```

#### 5.3 Rebuild y restart

```bash
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Backups Automáticos

### Configurar Backup Diario

#### 1. Crear script de backup

```bash
nano /opt/curriculai/backup.sh
```

Contenido:

```bash
#!/bin/bash

# Configuración
BACKUP_DIR="/opt/curriculai/backups"
DB_CONTAINER="curriculai-backend-1"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.sql"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Backup de base de datos
docker exec $DB_CONTAINER sqlite3 /app/data/curriculai.db .dump > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +30 -delete

echo "Backup completado: $BACKUP_FILE.gz"
```

#### 2. Dar permisos de ejecución

```bash
chmod +x /opt/curriculai/backup.sh
```

#### 3. Configurar crontab

```bash
crontab -e
```

Añadir:

```cron
# Backup diario a las 2 AM
0 2 * * * /opt/curriculai/backup.sh >> /var/log/curriculai-backup.log 2>&1
```

#### 4. Probar backup manual

```bash
/opt/curriculai/backup.sh
```

### Restaurar desde Backup

```bash
# Listar backups disponibles
ls -lh /opt/curriculai/backups/

# Descomprimir backup
gunzip /opt/curriculai/backups/backup-20260131-020000.sql.gz

# Restaurar
docker exec -i curriculai-backend-1 sqlite3 /app/data/curriculai.db < /opt/curriculai/backups/backup-20260131-020000.sql
```

---

## Monitoreo y Mantenimiento

### Ver estado de contenedores

```bash
docker ps
docker stats
```

### Ver logs en tiempo real

```bash
# Todos los servicios
docker compose -f docker/docker-compose.prod.yml logs -f

# Solo backend
docker compose -f docker/docker-compose.prod.yml logs -f backend
```

### Reiniciar servicios

```bash
# Reiniciar todo
docker compose -f docker/docker-compose.prod.yml restart

# Solo backend
docker compose -f docker/docker-compose.prod.yml restart backend
```

### Actualizar la aplicación

```bash
cd /opt/curriculai

# Pull últimos cambios
git pull origin main

# Rebuild y restart
docker compose -f docker/docker-compose.prod.yml down
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### Problema: Contenedores no arrancan

**Verificar logs:**
```bash
docker compose -f docker/docker-compose.prod.yml logs
```

**Verificar variables de entorno:**
```bash
cat .env
```

### Problema: Base de datos no persiste

**Verificar volumen:**
```bash
docker volume ls
docker volume inspect curriculai_sqlite-data
```

**Recrear volumen:**
```bash
docker compose -f docker/docker-compose.prod.yml down -v
docker compose -f docker/docker-compose.prod.yml up -d
```

### Problema: Google OAuth no funciona

**Verificar:**
1. GOOGLE_CALLBACK_URL coincide con URL configurada en Google Console
2. Dominio está en "Authorized JavaScript origins"
3. Callback está en "Authorized redirect URIs"

### Problema: SSL no funciona

**Verificar certificados:**
```bash
sudo certbot certificates
```

**Renovar manualmente:**
```bash
sudo certbot renew
```

### Problema: Puerto 80/443 en uso

**Verificar qué usa el puerto:**
```bash
sudo lsof -i :80
sudo lsof -i :443
```

**Detener servicio conflictivo:**
```bash
sudo systemctl stop apache2  # Si tienes Apache
sudo systemctl stop nginx    # Si tienes Nginx instalado localmente
```

### Problema: Falta espacio en disco

**Verificar espacio:**
```bash
df -h
```

**Limpiar Docker:**
```bash
# Limpiar imágenes no usadas
docker system prune -a

# Limpiar volúmenes no usados
docker volume prune
```

---

## Comandos Útiles

### Docker

```bash
# Ver imágenes
docker images

# Ver volúmenes
docker volume ls

# Ver redes
docker network ls

# Eliminar todo (CUIDADO!)
docker system prune -a --volumes
```

### Nginx

```bash
# Test configuración
docker exec curriculai-nginx-1 nginx -t

# Reload configuración
docker exec curriculai-nginx-1 nginx -s reload
```

### SQLite

```bash
# Acceder a base de datos
docker exec -it curriculai-backend-1 sqlite3 /app/data/curriculai.db

# Comandos útiles en SQLite:
.tables          # Listar tablas
.schema users    # Ver esquema de tabla
SELECT * FROM users;  # Query
.quit            # Salir
```

---

## Seguridad Adicional

### Firewall (UFW)

```bash
# Instalar UFW
sudo apt install ufw

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Habilitar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

### Fail2ban (Protección SSH)

```bash
# Instalar
sudo apt install fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Habilitar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

---

**Última actualización**: Enero 2026
