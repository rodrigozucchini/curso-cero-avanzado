# Semana 9: Hosting y dominio

**Objetivo:** publicar tu landing en tu propio dominio y saber qué hacer cuando algo se rompe.

**Por qué importa:** es el último paso que haces a mano. Al terminar esta semana entenderás todo lo que después le pedirás al agente.

## Conceptos

### Hosting

**Hosting** es el servicio de mantener tu sitio en computadoras siempre disponibles.

| Tipo | Qué es | Sirve para | Tú administras |
|---|---|---|---|
| **Estático** | Entrega archivos | Sitios sin backend | Casi nada |
| **Plataforma (PaaS)** | Compila y publica desde Git | Webs con funciones | Poco |
| **Serverless** | Ejecuta funciones por petición | APIs pequeñas | Poco |
| **VPS** | Una máquina virtual tuya | Control total | Todo, incluida su seguridad |

Tu landing usa una plataforma con hosting estático más una función serverless. Con eso no hay servidor que mantener.

**CDN:** red de servidores en muchos países que entrega copias de tus archivos desde un punto cercano al visitante.

### Dominio

Un **dominio** es un nombre que alquilas por períodos, normalmente anuales. No lo compras para siempre.

```text
https://   www         .mi-negocio   .com    /contacto
protocolo  subdominio  dominio       TLD     ruta
```

Participan tres actores, que pueden ser tres empresas distintas:

| Actor | Rol |
|---|---|
| **Registrador** | Te alquila el dominio, como Cloudflare, Namecheap o Porkbun |
| **DNS** | Dice a dónde apunta el nombre |
| **Hosting** | Entrega el sitio |

### Registros DNS

| Tipo | Qué hace | Ejemplo |
|---|---|---|
| **A** | Nombre → IPv4 | `@` → una IP |
| **AAAA** | Nombre → IPv6 | `@` → una IPv6 |
| **CNAME** | Nombre → otro nombre | `www` → un destino del hosting |
| **MX** | Dónde se recibe el correo | `@` → servidor de correo |
| **TXT** | Texto, para verificaciones y correo | Verificación de propiedad |
| **NS** | Qué servidores responden por el dominio | `ns1.proveedor.com` |

`@` significa el dominio base, sin subdominio.

**TTL y propagación:** los registros se guardan en caché durante el tiempo indicado por el **TTL**. Un cambio puede tardar en verse: desde minutos hasta muchas horas, según el caso.

**SSL:** Vercel emite y renueva el certificado cuando el dominio apunta correctamente.

### Entornos

| Entorno | Para qué sirve |
|---|---|
| **Local** | Desarrollar en tu máquina |
| **Preview** | Probar una rama con una URL temporal |
| **Producción** | El sitio real |

Lo ideal es usar una base de datos distinta para pruebas, para no mezclar datos falsos con datos reales.

## Laboratorio 1: deploy en Vercel (1 h)

1. En Vercel, elige **Add New → Project** e importa tu repositorio.
2. Antes de desplegar, agrega las variables de entorno `SUPABASE_URL` y `SUPABASE_SECRET_KEY`.
3. Despliega y abre la URL `.vercel.app`.
4. Envía el formulario y comprueba en Supabase que apareció la fila.

**Condiciones:** el plan Hobby es solo para uso personal y no comercial. Para un negocio real, usa un plan que lo permita.

Comprueba que la clave no se filtró:

```bash
curl -s https://TU-SITIO.vercel.app/app.js | grep -c "sb_secret"
```

Debe imprimir `0`.

## Laboratorio 2: cabeceras de seguridad (30 min)

Las **cabeceras de seguridad** le indican al navegador qué restricciones aplicar. Crea `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

La **Content Security Policy (CSP)** permite cargar recursos solo desde tu propio dominio, lo que reduce el daño de un XSS. Si usas una fuente o un script externos, tendrás que autorizarlos. Después de publicar, comprueba con `curl -I` que las cabeceras aparecen y revisa la consola de DevTools.

## Laboratorio 3: tu dominio (2 h)

1. Elige un nombre corto y fácil de deletrear.
2. Cómpralo en un registrador con 2FA activo, revisando el **precio de renovación**.
3. Activa la **renovación automática** y el **bloqueo de transferencia**.
4. En Vercel, ve a **Settings → Domains**, y agrega `tudominio.com` y `www.tudominio.com`.
5. Copia en tu DNS los registros que indica Vercel para tu proyecto: un **A** para el dominio base y un **CNAME** para `www`. No los copies de un tutorial, porque pueden variar por proyecto.
6. Comprueba:

```bash
dig tudominio.com A +short
dig www.tudominio.com CNAME +short
curl -I https://tudominio.com
curl -I http://tudominio.com
```

La versión `http` debe redirigir a `https`.

**Precaución:** no cambies registros MX si ya tienes correo en ese dominio, y antes de tocar el DNS guarda una captura de los registros actuales.

## Laboratorio 4: observar el sistema (1 h)

Un sitio en producción necesita que puedas ver qué le pasa.

1. Abre los **Logs** del proyecto en Vercel y envía el formulario.
2. Revisa que los logs no muestren emails ni claves. Lo que imprimes con `console.log` queda almacenado.
3. Configura un monitor gratuito de disponibilidad, como UptimeRobot o Better Stack, para que te avise si el sitio cae.

## Laboratorio 5: previews y rollback (1 h)

**Preview:**

1. Crea una rama, cambia el título y abre un PR.
2. Abre la URL de preview que publica Vercel.
3. Únelo a `main` y comprueba que producción se actualizó.

**Rollback:** publica un cambio malo a propósito y recupéralo de estas dos formas:

- **Rápido:** en Vercel, abre **Deployments**, elige el último deploy correcto y usa **Instant Rollback**.
- **Permanente:** `git revert <hash>` y `git push`, para que el código también vuelva a estar bien.

Si solo haces lo primero, el error vuelve con el siguiente deploy.

## Laboratorio 6: arregla un deploy roto (1 h)

Provoca estas fallas una por una. Para cada una, registra el síntoma, dónde lo viste y cómo lo resolviste.

| Falla que provocas | Síntoma probable | Dónde mirar |
|---|---|---|
| Quitar `SUPABASE_SECRET_KEY` en Vercel y volver a desplegar | Error 500 al enviar | Logs de la función |
| Cambiar la ruta del `fetch` a `/api/leads` | Error 404 | DevTools → Network |
| Introducir un error de sintaxis en `api/lead.js` | Función con error | Logs de la función |
| Quitar el `grant` de la tabla | Error 500; los logs indican permiso denegado | Logs y Supabase |
| Pausar el proyecto de Supabase | Falla de conexión | Logs y panel de Supabase |

Restaura todo al terminar.

### Método de diagnóstico

Avanza por capas hasta encontrar la que falla:

```text
1. DNS:      ¿el nombre apunta al lugar correcto?      dig
2. Red/SSL:  ¿el servidor responde?                    curl -I
3. Deploy:   ¿el último deploy terminó bien?           panel de Vercel
4. Frontend: ¿hay errores en el navegador?             DevTools
5. API:      ¿qué responde la petición?                Network, logs
6. Datos:    ¿la base está activa y hay permisos?      Supabase
```

Pregúntate también: **¿qué cambió justo antes de que fallara?**

## Laboratorio 7: aviso de privacidad (30 min)

Tu formulario recoge datos personales. Agrega `privacidad.html`, enlazado desde el pie de página y junto al formulario, que indique quién es responsable, qué datos guardas, para qué, cuánto tiempo, con quién se comparten (Vercel y Supabase) y cómo pedir que se borren.

Si no usas cookies de análisis o publicidad, no agregues un banner de cookies sin necesidad. Los requisitos varían por país: para un negocio real, consulta a un profesional.

## Ejercicios

1. Dibuja el camino de un visitante desde que escribe tu dominio hasta que su fila queda guardada.
2. Compara tres registradores por precio de renovación, privacidad y 2FA.
3. Crea el subdominio `hola.tudominio.com` y apúntalo a tu proyecto.
4. Pasa tu sitio por Lighthouse y anota los resultados.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre registrador, DNS y hosting?
2. ¿Cuándo usarías un registro A y cuándo un CNAME?
3. ¿Por qué un cambio de DNS puede tardar en verse?
4. ¿Por qué hace falta un nuevo deploy después de cambiar una variable de entorno?
5. Tu formulario devuelve 500 solo en producción. ¿Qué revisas y en qué orden?

## Entregable

- [ ] Landing en tu dominio, con HTTPS, cabeceras de seguridad y formulario funcionando.
- [ ] Monitor de disponibilidad activo.
- [ ] Un rollback realizado y documentado.
- [ ] Las cinco fallas diagnosticadas y registradas.
- [ ] Aviso de privacidad publicado.
