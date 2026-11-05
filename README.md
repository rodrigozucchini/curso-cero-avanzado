# De cero a tus primeros proyectos con IA

Curso de 4 meses (17 semanas) para personas sin experiencia en sistemas ni programación.

**Al terminar vas a poder:** publicar una landing en tu propio dominio, con base de datos, usando Claude Code, y explicar qué ocurre en cada capa por detrás.

**Resultado realista:** vas a tener bases sólidas, un proyecto real y un flujo de trabajo profesional con agentes. Este curso te da un nivel inicial para desarrollar con IA; la experiencia avanzada llega con más proyectos reales.

## Cómo funciona

- **Un solo proyecto:** tu landing crece semana a semana hasta salir a producción.
- **Primero a mano, después con el agente:** para revisar a un agente hay que saber qué debería hacer.
- **Dedicación:** 6-8 h por semana en las semanas 1 a 9, y 8-10 h en las semanas 10 a 17.

| Semanas | Cómo usar la IA |
|---|---|
| 1 a 9 | Como tutor: explica conceptos y errores, pero el código lo escribes tú |
| 10 a 17 | Como agente: genera código, y tú lo especificas, lo revisas y lo defiendes |

## Temario

### Etapa 1: Cómo funciona todo

| Sem. | Módulo | Temas | Qué logras |
|---|---|---|---|
| [1](semanas/01-computadora-y-terminal.md) | Computadora y terminal | Hardware, sistema operativo, archivos, procesos, binario, terminal, instalación, IA como tutor, contraseñas y 2FA | Te mueves por la terminal y proteges tus cuentas |
| [2](semanas/02-redes-e-internet.md) | Redes e internet | IP, puertos, DNS, TCP, cliente-servidor, HTTP, HTTPS, `ping`, `curl`, DevTools | Explicas qué pasa al abrir una web |
| [3](semanas/03-html-y-css.md) | HTML y CSS | Estructura, semántica, estilos, diseño responsive, accesibilidad | Primera versión de tu landing |
| [4](semanas/04-git-y-github.md) | Git y GitHub | Commits, ramas, pull requests, conflictos, `.gitignore`, GitHub Pages, secretos filtrados, revertir | Primer deploy, sin subir secretos |

### Etapa 2: Programar y guardar datos

| Sem. | Módulo | Temas | Qué logras |
|---|---|---|---|
| [5](semanas/05-programacion.md) | Programación | Variables, condicionales, bucles, funciones, arrays, objetos, leer errores | Resuelves programas pequeños |
| [6](semanas/06-algoritmia.md) | Algoritmia | Descomponer problemas, búsqueda, ordenamiento, Big O, recursión, depuración, tests | Comparas soluciones y las compruebas |
| [7](semanas/07-web-dinamica-y-apis.md) | Web dinámica y APIs | DOM, JSON, `fetch`, Node, npm, serverless, validación, XSS, `npm audit` | Formulario conectado a un servidor |
| [8](semanas/08-bases-de-datos.md) | Bases de datos | Tablas, SQL, relaciones, Supabase, RLS, claves, inyección SQL, datos personales, copias de seguridad | La landing guarda contactos |
| [9](semanas/09-hosting-y-dominio.md) | Hosting y dominio | Vercel, dominio, DNS, SSL, variables de entorno, logs, previews, deploy roto, rollback, privacidad | Landing en tu dominio |

### Etapa 3: Desarrollar con IA

| Sem. | Módulo | Temas | Qué logras |
|---|---|---|---|
| [10](semanas/10-modelos-y-prompts.md) | Modelos y prompt engineering | Tokens, contexto, límites, costos, alucinaciones, prompts para código, panorama de herramientas | Pides código con precisión y lo cuestionas |
| [11](semanas/11-claude-code-y-contexto.md) | Claude Code y context engineering | Ciclo del agente, modo plan, permisos, diffs, Git con el agente, `CLAUDE.md`, `AGENTS.md`, gestión del contexto | Haces y revisas cambios con el agente |
| [12](semanas/12-harness.md) | Harness engineering | Permisos, sandbox, hooks, skills, subagentes | Preparas un entorno confiable |
| [13](semanas/13-mcp-y-seguridad.md) | MCP y seguridad de agentes | Arquitectura MCP, tools/resources/prompts, servidor propio, prompt injection, mínimos permisos | Conectas al agente de forma segura |
| [14](semanas/14-spec-driven-development.md) | Spec-driven development | Especificación, criterios de aceptación, contratos, plan y tareas, Spec Kit, Kiro, OpenSpec | Defines el trabajo antes de generar código |
| [15](semanas/15-verificacion-y-evals.md) | Verificación y evals | Tests, skill verificadora, subagente revisor, barreras, evals | Demuestras que el resultado cumple |
| [16](semanas/16-orquestacion-y-automatizacion.md) | Orquestación y automatización | Subagentes en paralelo, worktrees, `claude -p`, GitHub Actions, revisión de pull requests | Coordinas agentes dentro de tu flujo |
| [17](semanas/17-proyecto-final.md) | Proyecto final | De carpeta vacía a producción: especificación, implementación, verificación, auditoría, deploy y defensa técnica | Publicas y explicas tu proyecto |

## Materiales

- [Glosario](recursos/glosario.md)
- [Lista de control de seguridad](recursos/checklist-seguridad.md): obligatoria desde la semana 11
- [Rúbrica del proyecto final](recursos/rubrica-proyecto-final.md)
- [Proyecto de referencia](proyecto-referencia/): para comparar después de intentarlo, no para copiar

## Qué necesitas

- Una computadora con Windows 10/11, macOS o Linux, y al menos 8 GB de RAM.
- Internet y unas horas fijas por semana.

## Costos

| Concepto | Desde cuándo | Costo |
|---|---|---|
| VS Code, Git, Node.js | Semana 1 | Gratis |
| GitHub, Vercel Hobby, Supabase Free | Semanas 4, 7 y 8 | Gratis, con límites |
| Dominio | Semana 9 | Pago anual; compara el precio de renovación, no solo el del primer año |
| Plan compatible con Claude Code | Semana 10 | Pago mensual; el plan gratis de claude.ai no lo incluye |

Los planes cambian: confirma precios y límites en la web oficial antes de contratar.

**Uso comercial:** Vercel Hobby es solo para uso personal y no comercial. Para la landing de un negocio real, usa un plan de pago o un hosting que permita ese uso.

## Cómo saber que aprobaste

Cada semana tiene un entregable y preguntas de comprobación. Avanza cuando puedas responderlas **sin ayuda**. El curso se aprueba con la [rúbrica del proyecto final](recursos/rubrica-proyecto-final.md).
