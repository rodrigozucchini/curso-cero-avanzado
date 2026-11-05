# Proyecto de referencia: Mesa Abierta

Landing completa de una escuela de cocina **ficticia**. Compárala con tu proyecto después de intentarlo; no la copies.

## Qué incluye

| Área | Contenido |
|---|---|
| Sitio | Hero, público, cómo funciona, programa, testimonios, precios, preguntas, formulario, privacidad y 404 |
| Backend | `api/lead.js`: valida y guarda contactos |
| Datos | `sql/01-leads.sql`: tabla con RLS y permisos mínimos |
| Producción | Cabeceras de seguridad, SEO básico, `robots.txt` y `sitemap.xml` |
| Calidad | Tests, CI y lista de control de seguridad |
| Agentes | `CLAUDE.md`, hooks, skill verificadora, subagente revisor, especificación, evals y servidor MCP |

## Ponerla en marcha

1. Instala las dependencias con `npm install` y ejecuta `npm test`.
2. Crea un proyecto en Supabase y ejecuta `sql/01-leads.sql` en el SQL Editor.
3. Copia `.env.example` como `.env.local` y completa los valores.
4. Prueba en local con `npx vercel dev`.
5. Publica en Vercel y agrega las mismas variables de entorno en el proyecto.

## Antes de publicar

- [ ] Reemplaza `tudominio.com` en `index.html`, `robots.txt` y `sitemap.xml`.
- [ ] Cambia la marca, el contenido, los precios y los testimonios ficticios, y quita la nota del pie de página.
- [ ] Completa los datos entre corchetes en `privacidad.html`.
- [ ] Agrega una imagen `og:image` si quieres una vista previa al compartir en redes.
- [ ] Revisa `docs/checklist-seguridad.md`.

Vercel Hobby es solo para uso personal y no comercial. Para un negocio real, usa un plan que lo permita.

## Límite conocido

El formulario no limita la cantidad de envíos por visitante. La trampa para bots frena el spam simple; si recibes abuso, agrega un límite de peticiones.
