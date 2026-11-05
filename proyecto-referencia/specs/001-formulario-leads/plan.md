# Plan

## Decisiones

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Sitio estático sin frameworks | Una landing no necesita más, y es fácil de revisar | Framework: agrega complejidad sin beneficio aquí |
| Función serverless en `api/lead.js` | Permite validar y guardar la clave fuera del navegador | Escribir desde el navegador: exige exponer la tabla a una clave pública |
| Supabase (Postgres) con clave secreta solo en el servidor | Base gestionada y permisos mínimos | Guardar en archivos: las funciones serverless no conservan datos |
| Sin políticas RLS para claves públicas | Nadie necesita acceso directo desde el navegador | Política de inserción anónima: permitiría saltarse la validación |
| Mismo resultado para un email repetido | No revela quién está registrado | Responder 409: filtra información |

## Flujo

Navegador → `POST /api/lead` → validación → inserción con clave secreta → `leads`

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Spam | Campo trampa; agregar límite de peticiones si hay abuso |
| Filtración de la clave | Variable de entorno, `.gitignore`, test y hook |
| Falla de la base | Mensaje genérico al usuario y detalle en los logs |
