# Contrato: POST /api/lead

## Petición
Cuerpo JSON: `{ "nombre": string (1-100), "email": string (máx. 200), "sitio"?: string }`

## Respuestas
| Estado | Cuándo | Cuerpo |
|---|---|---|
| 201 | Guardado, o el email ya existía | `{ "ok": true }` |
| 200 | Campo trampa completado | `{ "ok": true }` |
| 400 | Datos inválidos | `{ "error": string }` |
| 405 | Método distinto de POST | `{ "error": string }` |
| 500 | Falla al guardar | `{ "error": string }` sin detalles internos |
