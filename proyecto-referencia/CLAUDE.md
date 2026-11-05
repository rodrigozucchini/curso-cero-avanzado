# Landing del curso: Mesa Abierta

Landing estática sin frameworks, con una función serverless que guarda contactos en Supabase.

## Comandos
- `npm test`: ejecuta los tests. Debe pasar antes de dar un trabajo por terminado.
- `npx vercel dev`: levanta el sitio y la API en local.
- `npm run evals`: mide el verificador. Consume uso del plan o de la API.

## Estructura
- `index.html`, `privacidad.html`, `404.html`, `styles.css`, `app.js`: corren en el navegador; son públicos.
- `api/lead.js`: corre en el servidor.
- `vercel.json`: cabeceras de seguridad.
- `sql/`: cambios de la base de datos.
- `specs/`: qué se debe construir. Es la fuente de verdad.
- `docs/checklist-seguridad.md`: revisión antes de cada deploy.
- `mcp-tareas/`: servidor MCP de práctica; no forma parte del sitio.

## Reglas
- Antes de cambiar comportamiento, lee o actualiza la especificación en `specs/`.
- La clave secreta de Supabase solo se usa en `api/`, nunca en el navegador.
- Valida en el servidor todo dato que llegue del navegador.
- Sin estilos ni scripts en línea: la CSP de `vercel.json` los bloquea.
- No agregues dependencias sin explicar por qué y sin pedir confirmación.
- No hagas push ni deploy sin confirmación.
