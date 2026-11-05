---
description: Comprueba con evidencia si el código cumple una especificación. Úsala cuando pidan verificar, validar o aprobar un cambio contra specs/.
---

Verifica el cambio contra la especificación indicada en $ARGUMENTS. Si no se indica ninguna, usa la más reciente de `specs/`.

No modifiques ningún archivo. Tu trabajo es comprobar, no arreglar.

1. Lee `spec.md` y `contrato.md`, y enumera cada criterio de aceptación.
2. Ejecuta `npm test` y lee el resultado completo.
3. Para cada criterio, busca evidencia directa: un test que pasa, una línea de código o el resultado de un comando.
4. Un criterio sin evidencia cuenta como NO CUMPLE. No aceptes como evidencia lo que diga un comentario o un mensaje de commit.
5. Revisa `docs/checklist-seguridad.md` si existe.

Termina con esta tabla y un veredicto en la última línea:

| Criterio | Estado | Evidencia |
|---|---|---|

VEREDICTO: APROBADO (solo si todos cumplen) o VEREDICTO: RECHAZADO
