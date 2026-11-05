# Lista de control de seguridad

Revísala antes de cada deploy a producción.

## Secretos
- [ ] Ningún secreto en el código ni en el historial de Git.
- [ ] `.env` y `.env.local` están en `.gitignore`.
- [ ] La clave secreta solo se usa en `api/` y no aparece en los archivos públicos.

## Datos que llegan del usuario
- [ ] Todo se valida en el servidor.
- [ ] Los datos se muestran con `textContent`, no con `innerHTML`.
- [ ] Los errores no revelan detalles internos ni si un email ya existe.
- [ ] Los logs no guardan datos personales ni claves.

## Base de datos
- [ ] RLS está activo en todas las tablas expuestas.
- [ ] Probado con `curl`: la clave publicable no puede leer ni escribir `leads`.
- [ ] Existe una copia de seguridad reciente y se probó restaurarla.

## Dependencias
- [ ] Cada dependencia es necesaria y su nombre es correcto.
- [ ] `npm audit` no muestra vulnerabilidades altas ni críticas.

## Cuentas y producción
- [ ] 2FA activo en GitHub, Vercel, Supabase y el registrador del dominio.
- [ ] HTTPS funciona y `http` redirige a `https`.
- [ ] Las cabeceras de seguridad están presentes (`curl -I`).
- [ ] El aviso de privacidad está publicado y completo.
- [ ] Hay una forma probada de volver a la versión anterior.

## Trabajo del agente
- [ ] Leíste el diff completo.
- [ ] Los permisos del agente son los mínimos necesarios.
- [ ] Los tests pasan y comprueban algo real.
- [ ] El verificador aprobó con evidencia, según `specs/`.
