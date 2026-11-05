# Semana 14: Spec-driven development

**Objetivo:** definir qué se debe construir antes de generar código.

**Por qué importa:** un agente escribe rápido, así que un malentendido también se convierte en mucho código rápidamente. Corregir una línea de una especificación cuesta mucho menos que deshacer una implementación.

## Conceptos

### Del prompt a la especificación

Con **vibe coding** describes algo a grandes rasgos, aceptas lo que sale y sigues pidiendo arreglos. Sirve para prototipos descartables, pero en un proyecto real las decisiones quedan perdidas en una conversación.

Con **spec-driven development (SDD)**, los documentos guían el trabajo y sobreviven a cada sesión.

| | Vibe coding | SDD |
|---|---|---|
| **Fuente de verdad** | El chat y el código | La especificación |
| **Las decisiones** | Implícitas, se olvidan | Escritas y revisables |
| **Una nueva sesión** | Empieza sin saber nada | Lee los documentos |
| **Cómo se decide si terminó** | «Parece que funciona» | Criterios comprobables |
| **Mejor para** | Experimentos | Software que vas a mantener |

SDD no es burocracia: usa una especificación de tamaño proporcional al riesgo. Corregir un error de tipeo no necesita ninguna.

### El flujo

```text
Principios → Especificación → Contrato → Plan → Tareas → Implementación → Verificación
                    ↑                                                        │
                    └────────── si algo cambia, se actualiza primero ────────┘
```

| Documento | Responde | Quién manda |
|---|---|---|
| **Principios** | ¿Qué reglas valen siempre? | Tú |
| **Especificación** | ¿Qué y para qué? | Tú, con ayuda del agente |
| **Contrato** | ¿Cómo se comunican las partes exactamente? | Tú revisas |
| **Plan** | ¿Cómo lo construimos? | El agente propone, tú apruebas |
| **Tareas** | ¿En qué pasos pequeños? | El agente propone, tú apruebas |

### Especificación

Describe el **qué** y el **para qué**, no el cómo.

```markdown
# Especificación 001: formulario de contacto

## Objetivo
Una persona interesada deja su nombre y email para que le avisen del próximo grupo.

## Fuera de alcance
Login, panel de administración y envío de emails.

## Criterios de aceptación
- CA1: con nombre y email válidos, los datos quedan guardados y se ve una confirmación.
- CA2: un email inválido responde 400 y no guarda nada.
- CA4: un email repetido responde igual que uno nuevo y no crea otra fila.
```

La sección **Fuera de alcance** es muy valiosa: frena al agente cuando quiere agregar más de lo pedido.

### Criterios de aceptación

Son condiciones que deciden, sin discusión, si algo está terminado.

| Débil | Sólido | Por qué |
|---|---|---|
| El sitio es rápido | Lighthouse Performance ≥ 90 en móvil | Se puede medir |
| Valida bien los emails | `no-es-email` responde 400 y no guarda nada | Se puede ejecutar |
| Es seguro | La clave publicable no puede leer `leads` | Se puede comprobar |
| Maneja errores | Si falla la base, responde 500 sin detalles internos | Indica el comportamiento |

**Prueba:** ¿dos personas que comprueben el criterio por separado llegarían al mismo resultado? Si no, reescríbelo.

Cubre siempre el caso normal, las entradas inválidas, las fallas de sistemas externos y la seguridad.

### Contratos

La palabra **contrato** se usa en dos sentidos.

**Contrato técnico:** el acuerdo exacto entre dos partes de un sistema. Si se respeta, cada parte puede cambiar por dentro sin romper a la otra.

```markdown
# Contrato: POST /api/lead

Cuerpo JSON: { "nombre": string (1-100), "email": string (máx. 200), "sitio"?: string }

| Estado | Cuándo                          | Cuerpo              |
|--------|---------------------------------|---------------------|
| 201    | Guardado, o el email ya existía | { "ok": true }      |
| 200    | Campo trampa completado         | { "ok": true }      |
| 400    | Datos inválidos                 | { "error": string } |
| 405    | Método distinto de POST         | { "error": string } |
| 500    | Falla al guardar                | { "error": string } |
```

También son contratos el esquema de una base de datos, los tipos de una función y el `inputSchema` de una tool de MCP. En proyectos más grandes, se usa OpenAPI para escribir contratos de API en un formato que las herramientas pueden leer.

**Contrato de tarea:** lo que un agente acuerda entregar antes de empezar.

```markdown
## Contrato de tarea T3

Entrada: `spec.md`, `contrato.md`.
Puede modificar: `api/lead.js`, `test/lead.test.js`.
No puede modificar: `sql/`, `vercel.json`, `.claude/`.
Debe entregar: la API según el contrato, y un test por cada caso.
Está terminada cuando: `npm test` pasa y CA2, CA3 y CA5 tienen evidencia.
```

Este formato es especialmente útil cuando repartes trabajo entre varios agentes, como verás en la semana 16.

### Plan y tareas

El **plan** explica el cómo, las decisiones técnicas y sus motivos. Las **tareas** dividen el plan en pasos pequeños y verificables.

Una buena tarea:

- Se puede comprobar por sí sola.
- Está vinculada a un criterio de aceptación.
- Toca pocos archivos.
- Cabe en una sesión.

```markdown
- [ ] T1: crear la tabla `leads` con RLS y permisos (CA4, CA7)
- [ ] T2: escribir los tests de validación (CA2, CA3, CA5)
- [ ] T3: implementar `api/lead.js` según el contrato (CA1 a CA5)
```

Observa que los tests van **antes** de la implementación. Así, el agente no puede escribir un test a la medida de lo que ya hizo.

Puedes ver el ejemplo completo en `proyecto-referencia/specs/001-formulario-leads/`.

## Herramientas de SDD

Puedes hacer SDD solo con archivos Markdown. Estas herramientas agregan estructura:

| Herramienta | Cómo funciona | Archivos | Se adapta a |
|---|---|---|---|
| [Spec Kit](https://github.com/github/spec-kit) | CLI de GitHub y comandos `/speckit-*`: constitution, specify, plan, tasks, implement | Carpeta `.specify/` | Un flujo guiado y completo |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | CLI y comandos `/opsx:*`: explore, propose, apply, archive | `openspec/changes/<nombre>/` | Cambios en proyectos existentes |
| [Kiro](https://kiro.dev/docs/specs/) | Editor con SDD integrado | `requirements.md`, `design.md`, `tasks.md` | Quienes prefieren un IDE |

Evolucionan rápido: consulta siempre la instalación en su documentación oficial.

**Consejo:** aprende primero con Markdown. Si sabes qué hace cada documento, podrás usar cualquier herramienta y evitar seguir un proceso sin entenderlo.

## Laboratorio 1: especifica a mano (2 h)

Elige una función nueva para tu landing, como un formulario de reserva con fecha de preferencia o una lista de espera por grupo. **Todavía sin agente:**

1. Crea `specs/002-nombre/spec.md`, con objetivo, fuera de alcance y al menos seis criterios.
2. Cubre el caso normal, las entradas inválidas, las fallas y la seguridad.
3. Pásale la prueba de los dos revisores a cada criterio.

## Laboratorio 2: critica con el agente (1 h)

Usa al agente como crítico, no como autor:

```text
Lee specs/002-nombre/spec.md. No escribas código.
Actúa como analista exigente:
1. ¿Qué criterios son ambiguos o imposibles de comprobar?
2. ¿Qué casos límite faltan?
3. ¿Qué contradicciones encuentras?
4. ¿Qué preguntas me harías antes de implementar?
```

Decide tú qué aceptar: la especificación sigue siendo tuya.

## Laboratorio 3: contrato, plan y tareas (2 h)

1. Escribe `contrato.md` con cada respuesta posible.
2. En modo plan, pide un `plan.md` que respete la especificación y el contrato. No aceptes decisiones que no entiendas.
3. Pide `tareas.md`, y vincula cada tarea a sus criterios.
4. Revisa que **cada criterio esté cubierto por alguna tarea**, y que ninguna tarea agregue algo no especificado.

## Laboratorio 4: implementa siguiendo la especificación (2 h)

Trabaja en una rama, una tarea a la vez y en sesiones nuevas:

```text
Lee specs/002-nombre/spec.md, contrato.md y tareas.md.
Implementa solo T2: escribe los tests. Todavía no implementes el código.
Ejecútalos y confirma que fallan por el motivo correcto.
No hagas nada fuera de esta tarea.
```

Después de cada tarea, revisa el diff y haz un commit.

**Cuando cambie un requisito,** actualiza primero la especificación y luego el código. Pruébalo a propósito: agrega un criterio y pídele que lleve el código hasta cumplirlo.

## Laboratorio 5: prueba una herramienta (1 h)

Crea una carpeta de prueba y usa OpenSpec o Spec Kit en un mini proyecto, siguiendo su guía oficial. Compara con tu flujo manual:

- ¿Qué archivos creó?
- ¿Qué pasos te ahorró?
- ¿Qué sobraba para tu proyecto?

## Ejercicios

1. Reescribe cinco criterios débiles hasta que se puedan comprobar.
2. Escribe un contrato para una API `GET /api/grupos` que devuelva los próximos grupos.
3. Escribe un contrato de tarea que limite qué archivos se pueden modificar.
4. Decide si estas tareas requieren especificación: cambiar un color, agregar pagos, corregir un error de tipeo, eliminar datos de usuarios.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre especificación y plan?
2. ¿Por qué es útil la sección «Fuera de alcance»?
3. ¿Qué hace comprobable a un criterio de aceptación?
4. ¿Qué diferencia hay entre un contrato técnico y un contrato de tarea?
5. ¿Por qué escribir los tests antes de la implementación cuando trabajas con un agente?

## Entregable

- [ ] Especificación, contrato, plan y tareas de una función nueva.
- [ ] Función implementada tarea por tarea, con un commit por cada una.
- [ ] Un cambio de requisito hecho primero en la especificación.
- [ ] Comparación de una herramienta de SDD con tu flujo manual.
