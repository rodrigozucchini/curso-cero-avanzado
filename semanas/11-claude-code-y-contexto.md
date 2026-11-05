# Semana 11: Claude Code y context engineering

**Objetivo:** hacer cambios reales con un agente, revisarlos y darle el contexto correcto.

**Por qué importa:** un agente puede modificar archivos y ejecutar comandos. La calidad del resultado depende de cómo lo dirijas y de lo que revises.

**Desde esta semana,** usa la [lista de control de seguridad](../recursos/checklist-seguridad.md) antes de cada deploy.

## Conceptos

### Chat y agente

Un **chat** responde. Un **agente** tiene un objetivo y herramientas, y decide qué pasos dar hasta terminar.

```text
    Objetivo
       ↓
  ┌─→ Piensa: ¿qué necesito ahora?
  │    ↓
  │   Actúa: lee, edita o ejecuta
  │    ↓
  └── Observa el resultado
       ↓
    Termina
```

Las **herramientas** son las acciones disponibles: leer y editar archivos, buscar, ejecutar comandos. Lo importante: **el modelo pide, y Claude Code ejecuta en tu máquina**, de acuerdo con tus permisos.

### Permisos

Claude Code tiene varios modos, y puedes alternar algunos con `Shift + Tab`.

| Modo | Qué hace | Cuándo usarlo |
|---|---|---|
| `default` (Manual) | Pide aprobación para las acciones sensibles | Mientras aprendes |
| `plan` | Investiga y propone un plan, sin cambiar archivos | Antes de cualquier cambio no trivial |
| `acceptEdits` | Acepta ediciones de archivos automáticamente | Si ya confías en el plan y tienes Git limpio |
| `auto` | Una comprobación automática decide qué acciones permitir | Tareas largas, con cuidado |
| `dontAsk` | Solo ejecuta lo preaprobado y rechaza lo demás | Automatización controlada |
| `bypassPermissions` | Ejecuta casi todo sin preguntar | **Evítalo**: solo en entornos aislados y desechables |

**Antes de aprobar un comando,** lee qué hace. Si no lo entiendes, pregunta antes de aceptar.

### Comandos esenciales

| Comando | Para qué sirve |
|---|---|
| `/init` | Crea un `CLAUDE.md` inicial a partir del proyecto |
| `/plan` | Pide un plan antes de actuar |
| `/context` | Muestra qué ocupa el contexto |
| `/compact` | Resume la conversación para liberar espacio |
| `/clear` | Empieza una conversación nueva |
| `/model` | Cambia de modelo |
| `/usage` | Muestra el costo y el uso |
| `/rewind` | Vuelve a un punto anterior de la conversación o del código |

## El flujo de trabajo

```text
Explorar → Planificar → Implementar → Probar → Revisar → Publicar
```

| Paso | Qué haces | Prompt de ejemplo |
|---|---|---|
| **Explorar** | Que entienda el código antes de tocarlo | «Lee `api/lead.js` y explícame cómo valida. No edites.» |
| **Planificar** | Revisar el plan en modo plan | «¿Cómo agregarías un campo de teléfono opcional?» |
| **Implementar** | Una tarea por vez, en una rama | «Implementa el plan aprobado.» |
| **Probar** | Exigir evidencia | «Ejecuta `npm test` y muéstrame el resultado.» |
| **Revisar** | Leer el diff tú mismo | `git diff` |
| **Publicar** | PR, preview y merge | «Crea un PR con un resumen.» |

### Revisar un diff

Revisa este orden:

1. **Alcance:** ¿tocó solo lo pedido?
2. **Seguridad:** ¿hay secretos, validaciones quitadas o permisos abiertos?
3. **Tests:** ¿agregó tests reales? ¿Quitó o debilitó alguno?
4. **Dependencias:** ¿agregó paquetes? ¿Existen y hacen falta?
5. **Comprensión:** ¿puedes explicar cada cambio?

### Git con el agente

- Trabaja en una rama, nunca directamente en `main`.
- Empieza con el repositorio limpio, para que el diff muestre solo lo que hizo el agente.
- Haz commits pequeños, uno por tarea.
- Revisa antes de cada `push`.

### Depurar con el agente

Dale evidencia, no sensaciones.

```text
Al enviar el formulario en producción recibo un 500.
Log de Vercel: [pega el mensaje, sin datos sensibles]
Pasos para reproducir: [pasos]
Qué cambió: [último commit]

Primero dime tus dos hipótesis más probables y cómo comprobarlas.
No edites hasta que veamos la causa.
```

## Context engineering

**Context engineering** consiste en decidir qué información recibe el agente, cuándo y qué queda afuera. Si hay poco contexto, adivina. Si hay demasiado, se distrae y gasta más.

### CLAUDE.md

Es un archivo con instrucciones que Claude Code lee al iniciar cada sesión.

| Ubicación | Alcance | ¿Se comparte? |
|---|---|---|
| `./CLAUDE.md` o `./.claude/CLAUDE.md` | Proyecto | Sí, va a Git |
| `./CLAUDE.local.md` | Proyecto, solo tú | No, agrégalo a `.gitignore` |
| `~/.claude/CLAUDE.md` | Todos tus proyectos | No |

**Qué incluir:** comandos clave, estructura, reglas que el agente no puede deducir y qué nunca debe hacer.

**Qué evitar:** explicaciones largas, información que ya esté clara en el código y secretos.

Un buen ejemplo está en `proyecto-referencia/CLAUDE.md`. Mantenlo corto: cada línea ocupa contexto en todas las sesiones. **Prueba de cada línea:** si la quito, ¿el agente cometería un error?

### AGENTS.md

`AGENTS.md` es un formato compartido por varios agentes. Claude Code lo lee solo si no existe un `CLAUDE.md`. Si usas varios agentes, puedes tener las reglas en `AGENTS.md` e importarlas desde `CLAUDE.md`:

```text
@AGENTS.md
```

### Dar el contexto correcto

| Técnica | Cómo | Cuándo |
|---|---|---|
| **Referenciar archivos** | `@api/lead.js` en el prompt | Si sabes dónde está el tema |
| **Pegar la evidencia** | Error completo, log, captura | Al depurar |
| **Importar documentos** | `@docs/decisiones.md` desde `CLAUDE.md` | Información de uso frecuente |
| **Consultar docs actuales** | Pegar el enlace oficial o la sección relevante | Librerías recientes |
| **Limpiar** | `/clear` | Al cambiar de tema |
| **Compactar** | `/compact conserva las decisiones y los errores` | En una tarea larga, cerca del límite |

**Señales de contexto saturado:** repite errores, olvida instrucciones o se contradice. Revísalo con `/context`, y si hace falta, empieza de nuevo con un resumen de lo aprendido.

## Laboratorio 1: primer cambio dirigido (2 h)

Agrega a tu landing una sección de preguntas frecuentes con este flujo:

```bash
git switch main && git pull
git switch -c agrega-preguntas
claude
```

1. Entra en modo plan con `Shift + Tab` y pídele un plan.
2. Critica el plan y corrígelo antes de aprobar.
3. Aprueba cada edición en modo `default`.
4. Revisa con `git diff`.
5. Comprueba en el navegador, en móvil y con el teclado.
6. Haz commit, abre un PR y revisa la preview antes de unirlo.

Anota qué hizo bien, qué corregiste y qué hizo sin que se lo pidieras.

## Laboratorio 2: CLAUDE.md (1 h)

1. Ejecuta `/init` y lee el resultado.
2. Elimina todo lo que no sea útil, y agrega tus reglas: dónde va la clave secreta, cómo se ejecutan los tests y qué no debe hacer sin confirmación.
3. En una sesión nueva, pídele algo que choque con una regla: «Agrega la clave de Supabase a `app.js`». Debe negarse o advertirte.

`CLAUDE.md` guía, pero no obliga. En la semana 12 aprenderás a imponer reglas de verdad.

## Laboratorio 3: gestión del contexto (1 h)

1. Abre una sesión nueva y ejecuta `/context`. Anota el uso.
2. Pídele que lea todo el proyecto y vuelve a medir.
3. Ejecuta `/compact`, vuelve a medir, y pregúntale algo de lo anterior. ¿Qué conservó y qué perdió?
4. Ejecuta `/clear` y haz la misma pregunta. Explica la diferencia.

## Laboratorio 4: depura con el agente (2 h)

Introduce un bug en una rama: por ejemplo, cambia `>` por `>=` en una validación, sin decirle dónde.

1. Dale solo el síntoma y la evidencia.
2. Pídele hipótesis antes de la corrección.
3. Exige un test que falle antes y pase después.
4. Revisa si corrigió la causa o solo el síntoma.

**Trampa frecuente:** si un agente hace pasar un test modificando el test, rechaza el cambio.

## Ejercicios

1. Pide la misma tarea con y sin modo plan, y compara.
2. Usa `/rewind` para deshacer un cambio equivocado.
3. Pide un cambio deliberadamente vago, observa qué asume y mejora el prompt.
4. Rechaza un plan y explica por qué. Observa cómo lo ajusta.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre un chat y un agente?
2. ¿Quién ejecuta realmente los comandos en tu máquina?
3. ¿Por qué empezar con el repositorio limpio?
4. ¿Qué debe ir en `CLAUDE.md` y qué no?
5. ¿Cuándo usarías `/compact` y cuándo `/clear`?

## Entregable

- [ ] Un PR hecho con el agente, con plan, diff revisado y preview.
- [ ] `CLAUDE.md` propio, breve y probado.
- [ ] Un bug resuelto con un test que falló antes de la corrección.
- [ ] Notas de contexto: mediciones con `/context` y conclusiones.
