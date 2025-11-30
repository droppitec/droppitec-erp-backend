# Guía de Despliegue en Vercel

Este proyecto ha sido configurado para desplegarse en Vercel. Sigue estos pasos para realizar el despliegue:

## Prerrequisitos

1. Tener una cuenta en [Vercel](https://vercel.com)
2. Tener el proyecto en un repositorio Git (GitHub, GitLab o Bitbucket)
3. Tener configurada tu base de datos PostgreSQL (puedes usar servicios como Neon, Supabase, etc.)

## Pasos para Desplegar

### 1. Conectar el Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "Add New Project"
3. Importa tu repositorio Git
4. Vercel detectará automáticamente la configuración del proyecto

### 2. Configurar Variables de Entorno

En la configuración del proyecto en Vercel, ve a **Settings > Environment Variables** y agrega las siguientes variables:

```
DB_HOST=tu-host-de-postgresql
DB_PORT=5432
DB_USER=tu-usuario
DB_PASSWORD=tu-contraseña
DB_NAME=tu-base-de-datos
JWT_SECRET=tu-secret-key-para-jwt
NODE_ENV=production
```

**Importante:** Asegúrate de configurar estas variables para todos los entornos (Production, Preview, Development).

### 3. Configuración del Proyecto

Vercel detectará automáticamente:
- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4. Desplegar

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación automáticamente
3. Una vez completado, recibirás una URL donde tu API estará disponible

## Estructura de Archivos para Vercel

- `api/index.ts` - Punto de entrada para las funciones serverless de Vercel
- `vercel.json` - Configuración de Vercel
- `.vercelignore` - Archivos que se excluirán del despliegue

## Notas Importantes

1. **Base de Datos:** Asegúrate de que tu base de datos PostgreSQL permita conexiones desde los servidores de Vercel. Puede que necesites configurar whitelist de IPs o usar SSL.

2. **Variables de Entorno:** Nunca commitees credenciales en el código. Usa siempre variables de entorno en Vercel.

3. **Límites de Vercel:** 
   - Las funciones serverless tienen un timeout máximo de 10 segundos en el plan gratuito
   - Para funciones más largas, considera el plan Pro

4. **Conexión a Base de Datos:** La conexión a la base de datos se inicializa cuando se carga la función. En Vercel, las funciones pueden "dormir" después de un período de inactividad, así que la primera solicitud después de un período de inactividad puede ser más lenta.

## Solución de Problemas

### Error de conexión a la base de datos
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que tu base de datos permita conexiones desde cualquier IP (o desde los IPs de Vercel)
- Verifica que el SSL esté configurado correctamente

### Error de build
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel para más detalles

### Timeout en funciones
- Considera optimizar las consultas a la base de datos
- Usa índices en tu base de datos para mejorar el rendimiento
- Considera actualizar al plan Pro de Vercel si necesitas más tiempo de ejecución

## Comandos Útiles

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar desde la línea de comandos
vercel

# Desplegar a producción
vercel --prod

# Ver logs
vercel logs
```

