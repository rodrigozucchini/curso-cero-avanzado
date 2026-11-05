# Semana 12: Harness engineering

**Objetivo:** preparar el entorno para que el agente trabaje mejor y dentro de límites.

**Por qué importa:** un mismo modelo da resultados muy distintos según lo que lo rodea. Además, decirle a un agente «no hagas X» no garantiza que no lo haga.

## Conceptos

### Qué es el harness

El **harness** es todo lo que rodea al modelo para convertirlo en un agente útil: instrucciones, herramientas, permisos, automatizaciones y controles.

```text
┌───────────────── Harness ─────────────────┐
│  CLAUDE.md          → qué debe saber       │
│  Skills             → cómo hacer tareas    │
│  Subagentes         → quién se encarga     │
│  MCP y herramientas → qué puede usar       │
│  Permisos y sandbox → qué tiene prohibido  │
│  Hooks              → qué siempre ocurre   │
│  Tests y CI         → cómo se comprueba    │
│              ┌─────────┐                   │
│              │ Modelo  │                   │
│              └─────────┘                   │
└────────────────────────────────────────────┘
```

**Harness engineering** es diseñar ese entorno. Cada error repetido es una señal: no lo corrijas solo una vez; cambia el harness para que no vuelva a ocurrir.

### Guía y control

| | Guía | Control |
|---|---|---|
| **Ejemplos** | `CLAUDE.md`, skills | Permisos, sandbox, hooks, CI |
| **Quién decide** | El modelo, que puede ignorarla | El sistema, de forma determinista |
| **Sirve para** | Preferencias y conocimiento | Reglas que no se pueden romper |

**Regla práctica:** si incumplir la regla causa un daño real, no la dejes solo por escrito.

### Qué herramienta usar

| Necesitas | Usa | Ejemplo |
|---|---|---|
| Un dato siempre presente | `CLAUDE.md` | Comando de tests |
| Un procedimiento que se usa a veces | Skill | Cómo verificar una especificación |
| Trabajo aislado o una opinión independiente | Subagente | Revisor de código |
| Algo que debe ocurrir sí o sí | Hook | Bloquear lectura de `.env` |
| Prohibir o permitir acciones | Permisos | Denegar `git push --force` |
| Contener el daño de un comando | Sandbox | Limitar archivos y red |
| Acceso a un sistema externo | MCP | Base de datos, en la semana 13 |

## Permisos

Se configuran en estos archivos, entre otros:

| Archivo | Alcance | ¿Va a Git? |
|---|---|---|
| `.claude/settings.json` | Proyecto, para todo el equipo | Sí |
| `.claude/settings.local.json` | Proyecto, solo tú | No |
| `~/.claude/settings.json` | Todos tus proyectos | No |

```json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(git diff *)", "Bash(git status)"],
    "deny": ["Read(./.env)", "Read(./.env.local)", "Bash(git push --force *)"]
  }
}
```

**Principio de mínimos permisos:** autoriza solo lo que la tarea necesita. Las reglas `deny` tienen prioridad sobre `allow`.

## Sandbox

Los permisos deciden qué se intenta. El **sandbox** limita, a nivel del sistema operativo, qué pueden tocar los comandos, incluidos los procesos que estos lancen. Funciona en macOS, Linux y WSL2, pero no en Windows nativo.

En Ubuntu o WSL2:

```bash
sudo apt-get install bubblewrap socat
```

Después, dentro de Claude Code:

```text
/sandbox
```

## Hooks

Un **hook** es un comando que Claude Code ejecuta automáticamente en un punto del ciclo. No depende de que el modelo lo recuerde.

| Evento | Cuándo ocurre | Uso típico |
|---|---|---|
| `PreToolUse` | Antes de usar una herramienta | Bloquear acciones |
| `PostToolUse` | Después de usarla | Formatear, registrar |
| `Stop` | Cuando el agente va a terminar | Exigir que los tests pasen |
| `SessionStart` | Al comenzar la sesión | Cargar información |

El hook recibe un JSON por entrada estándar. Si termina con **código 2**, `PreToolUse` bloquea la herramienta y `Stop` obliga al agente a seguir; el texto de error le explica el motivo.

**Precaución:** un hook ejecuta código en tu máquina con tus permisos. Lee los hooks de cualquier proyecto ajeno antes de usarlos.

### Hook para proteger secretos

`.claude/hooks/proteger-secretos.js`:

```javascript
import { readFileSync } from 'node:fs';

const evento = JSON.parse(readFileSync(0, 'utf8'));
const { file_path = '', command = '' } = evento.tool_input ?? {};
const objetivo = `${file_path} ${command}`;

if (/(^|[\s/"'=<>])\.env(\.(?!example\b)[\w.-]+)?(?=$|[\s"';|&<>])/.test(objetivo)) {
  console.error('Bloqueado: los archivos .env tienen secretos. Usa .env.example.');
  process.exit(2);
}
```

Regístralo en `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Edit|Write|Bash",
        "hooks": [
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/proteger-secretos.js\"" }
        ]
      }
    ]
  }
}
```

Pruébalo sin el agente:

```bash
echo '{"tool_input":{"command":"cat .env.local"}}' | node .claude/hooks/proteger-secretos.js
echo "código: $?"   # 2 = bloqueado

echo '{"tool_input":{"command":"cat .env.example"}}' | node .claude/hooks/proteger-secretos.js
echo "código: $?"   # 0 = permitido
```

**Sus límites:** un comando como `cat .en*` puede esquivarlo. Es una red de seguridad, no un muro. Por eso se combina con otras capas: permisos, sandbox y, sobre todo, no tener secretos de producción en tu máquina si no hace falta.

## Skills

Una **skill** es un procedimiento reutilizable en un archivo. A diferencia de `CLAUDE.md`, su contenido se carga solo cuando hace falta, así que no ocupa contexto todo el tiempo.

```text
.claude/skills/preparar-pr/SKILL.md     → proyecto
~/.claude/skills/preparar-pr/SKILL.md   → todos tus proyectos
```

```markdown
---
description: Prepara un pull request. Úsala cuando pidan abrir o preparar un PR.
---

1. Ejecuta `npm test`. Si falla, detente y muéstrame el error.
2. Ejecuta `git diff main...HEAD` y revisa que no haya secretos.
3. Escribe un resumen de qué cambia, por qué y cómo probarlo.
4. Muéstrame el resumen y espera mi confirmación antes de crear el PR.
```

Se puede invocar con `/preparar-pr`, y el agente también puede elegirla por su `description`. Por eso la descripción debe indicar qué hace y **cuándo** usarla.

**Cuándo crear una:** cuando repitas lo mismo por tercera vez. Las skills de terceros pueden contener instrucciones maliciosas: léelas antes de instalarlas.

## Subagentes

Un **subagente** trabaja con su propia conversación y sus propias herramientas, y devuelve un resultado. Sirve para aislar trabajo pesado del contexto principal y para obtener una mirada independiente.

`.claude/agents/revisor.md`:

```markdown
---
name: revisor
description: Revisa cambios para encontrar errores y problemas de seguridad antes de un merge.
tools: Read, Grep, Glob, Bash
---

Eres un revisor independiente. No escribiste este cambio y no das nada por cierto.
Revisa `git diff main...HEAD`. Busca secretos, datos sin validar y tests que no
comprueban nada. No modifiques archivos. Si no encuentras problemas, dilo.
```

Se usa pidiendo: «Usa el subagente revisor para revisar esta rama». Observa que sus herramientas no incluyen `Edit` ni `Write`. Aun así tiene `Bash`, así que un comando podría escribir archivos; quita `Bash` o combínalo con permisos si necesitas una garantía más fuerte.

| | Skill | Subagente |
|---|---|---|
| **Dónde corre** | Normalmente, en la conversación actual | En un contexto separado |
| **Devuelve** | Instrucciones que sigue el agente | Un resultado resumido |
| **Mejor para** | Procedimientos | Investigar, revisar y aislar |

## Laboratorio 1: permisos (1 h)

1. Crea `.claude/settings.json` con `allow` y `deny`.
2. Comprueba que `npm test` ya no pida permiso.
3. Pídele que lea `.env.local` y comprueba el rechazo. Usa solo valores falsos para esta prueba.
4. Activa el sandbox si tu sistema lo permite, y pídele que escriba un archivo fuera del proyecto. Anota qué ocurre.

## Laboratorio 2: hooks (2 h)

1. Agrega el hook de secretos y pruébalo con los dos comandos de arriba.
2. Agrega el hook `Stop` de `proyecto-referencia/.claude/hooks/tests-al-terminar.js`.
3. En una rama, rompe un test y pídele al agente una tarea no relacionada. Observa si el hook lo obliga a corregirlo.
4. Lee por qué ese hook revisa `stop_hook_active`. ¿Qué pasaría sin esa línea?

## Laboratorio 3: skill y subagente (2 h)

1. Crea la skill `preparar-pr` y úsala en un cambio real.
2. Crea el subagente `revisor`.
3. En una rama, introduce un problema a propósito, como quitar una validación. Comprueba si el revisor lo encuentra.
4. Mejora sus instrucciones si no lo encontró, y vuelve a probar.

## Laboratorio 4: convierte errores en harness (1 h)

Revisa tus notas de la semana 11. Elige tres errores del agente y, para cada uno, decide qué pieza del harness lo evita.

| Error observado | Pieza elegida | Por qué |
|---|---|---|
| Agregó una dependencia sin avisar | `CLAUDE.md` | Es una preferencia, de bajo riesgo |
| Intentó leer `.env.local` | Hook y permisos | Es una regla que no debe romperse |

Implementa las tres y comprueba que funcionan.

## Ejercicios

1. Reduce tu `CLAUDE.md` moviendo procedimientos largos a skills.
2. Escribe un hook que registre cada comando en un archivo de bitácora.
3. Diseña un harness para un proyecto de un compañero o compañera y explica tus decisiones.
4. Busca una forma de esquivar tu hook, y agrega la capa que lo cubra.

## Comprueba que entendiste

1. ¿Qué es el harness y por qué influye tanto en el resultado?
2. ¿Por qué una regla en `CLAUDE.md` no es un control de seguridad?
3. ¿Qué diferencia hay entre permisos y sandbox?
4. ¿Cuándo crearías una skill y cuándo un subagente?
5. ¿Por qué hay que leer los hooks y las skills de terceros antes de usarlos?

## Entregable

- [ ] `.claude/settings.json` con permisos mínimos.
- [ ] Dos hooks funcionando, con su prueba.
- [ ] Una skill y un subagente usados en un cambio real.
- [ ] Tabla de tres errores convertidos en mejoras del harness.
