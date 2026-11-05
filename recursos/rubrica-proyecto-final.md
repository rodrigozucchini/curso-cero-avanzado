# Rúbrica del proyecto final

**Para aprobar:** al menos 70 de 100 puntos y **todos** los requisitos obligatorios.

## Requisitos obligatorios

Si falta uno, el proyecto no se aprueba, sin importar la puntuación.

- [ ] El sitio funciona en un dominio propio con HTTPS.
- [ ] No hay secretos en el código ni en el historial de Git.
- [ ] La clave secreta nunca llega al navegador.
- [ ] Está demostrado que la clave publicable no puede leer ni escribir datos privados.
- [ ] El servidor valida los datos.
- [ ] La persona explica sin ayuda `api/lead.js` y el recorrido de una petición.

## Puntuación

| Área | Puntos | Excelente | Suficiente | Insuficiente |
|---|---|---|---|---|
| **Producto** | 10 | Propuesta clara, responsive y accesible; probada con personas reales | Funciona y se entiende, con detalles menores | Confuso o roto en móvil |
| **Ingeniería** | 15 | PRs pequeños, buenos commits, tests útiles y errores bien manejados | Usa ramas y tests básicos | Commits directos a `main`, o sin tests |
| **Datos y seguridad** | 20 | Lista de control completa, permisos mínimos, copia probada y modelo de amenazas con mejoras | Lista completa con pequeñas brechas | Permisos amplios o sin comprobar |
| **Operación** | 10 | Rollback probado, monitor, logs sin datos sensibles | Deploy estable, con rollback sin probar | Sin forma de recuperarse |
| **SDD** | 15 | Criterios comprobables, trazados a tareas y tests; especificación al día | Documentos completos, con criterios algo vagos | Especificación escrita después del código |
| **Harness y agentes** | 15 | Controles proporcionales al riesgo; errores convertidos en mejoras | Harness funcional, sin mejoras a partir de errores | Solo un `CLAUDE.md` genérico |
| **Verificación y evals** | 10 | Verificador independiente que detecta sabotajes; eval con casos difíciles y comparación | Verificador y eval básicos | Aprueba por lo que afirma el agente |
| **Defensa técnica** | 5 | Explica decisiones y alternativas, y admite lo que no sabe | Responde con pequeñas dudas | Depende de la IA para explicar |

## Señales de alerta

Revisa con más atención si observas:

- Código que la persona no sabe explicar.
- Tests que nunca fallaron.
- Una especificación que coincide exactamente con el código, pero fue creada después.
- Una bitácora sin errores ni correcciones del agente.
- `bypassPermissions` usado sin aislamiento.
- Claves de prueba reales compartidas en capturas o en el video de la defensa.

## Autoevaluación

Antes de entregar, responde:

1. ¿Qué es lo más riesgoso de mi proyecto hoy?
2. ¿Qué parte entiendo menos?
3. ¿Qué comprobaciones hice yo mismo, sin confiar en el agente?
4. Si mañana falla, ¿sabría por dónde empezar?
