# Semana 10: Modelos y prompt engineering

**Objetivo:** entender cómo genera código un modelo y aprender a pedirlo con precisión.

**Por qué importa:** un modelo puede responder con seguridad algo falso. Si entiendes sus límites, sabes cuándo confiar y qué comprobar.

Desde esta semana, la IA ya puede generar código. La regla nueva es: **tú eres responsable de todo lo que publiques**, aunque no lo hayas escrito.

## Conceptos

### Qué es un modelo de lenguaje

Un **modelo de lenguaje (LLM)** aprendió patrones a partir de enormes cantidades de texto. Genera su respuesta prediciendo, paso a paso, qué texto debería seguir.

De ahí salen dos consecuencias:

- No busca en una base de datos de verdades: produce lo que resulta plausible, y por eso puede inventar.
- La misma pregunta puede dar respuestas distintas, porque hay una parte de azar.

### Tokens y contexto

| Concepto | Qué es | Qué implica |
|---|---|---|
| **Token** | Fragmento de texto que procesa el modelo; una palabra puede ocupar uno o varios | El costo y los límites se miden en tokens |
| **Ventana de contexto** | Todo lo que el modelo puede considerar a la vez | Instrucciones, archivos, historial y respuesta comparten ese espacio |
| **Sin memoria propia** | Cada petición recibe el contexto que se le envía | Si algo no está en el contexto, el modelo no lo sabe |
| **Fecha de corte** | Hasta cuándo llega su conocimiento | Puede desconocer versiones recientes |

### Por qué falla al programar

| Falla | Ejemplo | Cómo se detecta |
|---|---|---|
| **Inventa APIs o paquetes** | Una función que no existe en esa librería | Ejecutar y leer la documentación oficial |
| **Usa información vieja** | Un método obsoleto | Comprobar la versión y sus docs |
| **Asume cosas sin decirlo** | Elige una base de datos que no pediste | Leer el plan antes de implementar |
| **Resuelve solo el caso feliz** | Falla con una lista vacía | Tests con casos raros |
| **Afirma sin comprobar** | «Ya está arreglado» sin ejecutar nada | Exigir evidencia |
| **Debilita controles** | Quita un test o abre un permiso para que «funcione» | Revisar el diff completo |

### Cómo elegir modelo

Los proveedores ofrecen modelos más potentes y costosos, y otros más rápidos y económicos.

| Tarea | Modelo sugerido |
|---|---|
| Arquitectura, depuración difícil, revisiones de seguridad | El más capaz |
| Implementar una tarea bien definida | Intermedio |
| Renombrar, buscar, resumir o formatear | Rápido y económico |

Empieza con un modelo intermedio y sube solo si hace falta. Los nombres y precios cambian rápido: consúltalos en la documentación oficial.

### Costos

Se paga por suscripción con límites de uso, o por API según los tokens de entrada y salida. Una tarea larga de un agente puede consumir mucho más que una conversación, porque relee archivos y resultados de herramientas en cada paso.

**Para gastar menos:** contexto más pequeño, tareas acotadas y conversaciones nuevas para temas nuevos.

### Privacidad

Antes de pegar algo en una IA, revisa:

- **Nunca compartas** contraseñas, claves ni tokens.
- **Evita** datos personales de clientes.
- **Consulta** las políticas de datos de tu plan, porque varían.
- **Código de terceros o de tu trabajo:** confirma que tienes permiso.

## Prompt engineering para código

Un buen prompt se parece a un buen pedido de trabajo.

| Elemento | Pregunta | Ejemplo |
|---|---|---|
| **Objetivo** | ¿Qué debe lograrse? | Rechazar emails inválidos |
| **Contexto** | ¿Dónde y con qué? | En `api/lead.js`, sin frameworks |
| **Restricciones** | ¿Qué no debe hacer? | Sin dependencias nuevas |
| **Criterios de éxito** | ¿Cómo sé que está bien? | `npm test` pasa y hay un test nuevo |
| **Ejemplos** | ¿Qué formas de entrada y salida? | `no-es-email` responde 400 |
| **Formato** | ¿Cómo debe responder? | Primero el plan, sin editar |

**Prompt débil:**

```text
Mejora el formulario.
```

**Prompt sólido:**

```text
Objetivo: el formulario debe rechazar nombres de más de 100 caracteres.

Contexto: la validación está en api/lead.js. El proyecto no usa frameworks.

Restricciones:
- No agregues dependencias.
- No cambies el formato de respuesta de la API.

Criterios de éxito:
- Un nombre de 101 caracteres responde 400 y no guarda nada.
- Un nombre de 100 caracteres sigue siendo válido.
- Agrega tests para ambos casos y confirma que npm test pasa.

Antes de editar, explícame tu plan en un máximo de cinco líneas.
```

### Técnicas útiles

- **Divide:** una tarea por vez, y comprueba antes de seguir.
- **Pide que pregunte:** «Si falta información, pregúntame antes de asumir».
- **Da ejemplos:** muestra un fragmento del estilo que quieres.
- **Pide alternativas:** «Dame dos opciones con sus ventajas y desventajas».
- **Pide evidencia:** «Muéstrame el comando que ejecutaste y su resultado».
- **Corrige la causa:** si no funciona tras dos intentos, no sigas insistiendo. Empieza de nuevo con lo que aprendiste y un prompt mejor.

### Cómo leer código generado

Antes de aceptar, responde estas preguntas:

1. ¿Puedo explicar qué hace cada parte?
2. ¿Qué ocurre con datos vacíos, enormes o maliciosos?
3. ¿Esta función o paquete existe? ¿Lo comprobé?
4. ¿Agregó algo que no pedí?
5. ¿Debilitó algún control, test o permiso?
6. ¿Ejecuté el resultado?

## Panorama de herramientas

| Categoría | Ejemplos | Cómo se usa |
|---|---|---|
| **Chat** | Claude, ChatGPT, Gemini | Preguntas, explicaciones, fragmentos |
| **Autocompletado en el editor** | GitHub Copilot, Cursor | Sugerencias mientras escribes |
| **Agente de terminal** | Claude Code, Codex CLI, Gemini CLI | Lee, edita y ejecuta en tu proyecto |
| **Editor con agente** | Cursor, Kiro, Windsurf | Agente integrado en el editor |
| **Generadores de apps** | v0, Lovable, Bolt | Crean prototipos desde una descripción |
| **Agente en la nube o en CI** | Claude Code en GitHub Actions, Copilot coding agent | Trabaja sobre issues y PRs |

**Cómo elegir:** las herramientas cambian rápido, pero las habilidades se transfieren. Este curso usa Claude Code, y casi todo lo que aprendas sirve en otros agentes. Compara por calidad en tus tareas, control de permisos, integración con tu flujo, costo y políticas de datos.

## Laboratorio 1: compara prompts (2 h)

Usa un chat de IA:

1. Pide la función de validación de email con un prompt débil.
2. Pídela otra vez con objetivo, restricciones, criterios y ejemplos.
3. Prueba ambas respuestas con estos casos: `a@b.co`, `a@b`, `@b.co`, `a b@c.co`, `a@@b.co` y un texto de 300 caracteres.
4. Anota cuál falló y por qué.

## Laboratorio 2: caza de alucinaciones (1 h)

1. Pídele a la IA un ejemplo de uso de una librería poco conocida o de una versión muy reciente.
2. Comprueba cada función contra la documentación oficial.
3. Si inventó algo, anótalo. Si no, repite con otra librería.
4. Pregunta por un paquete inventado por ti, como `validador-email-super-pro`. Observa si reconoce que no lo conoce. **No lo instales**: comprueba si existe en npmjs.com.

## Laboratorio 3: revisa código ajeno (2 h)

Esta función parece correcta, pero tiene varios problemas. Encuéntralos antes de consultar a la IA.

```js
function promedioDeEdades(personas) {
  let suma = 0;
  for (let i = 0; i <= personas.length; i++) {
    suma += personas[i].edad;
  }
  return suma / personas.length;
}

for (const prueba of [[{ edad: 20 }, { edad: 30 }], []]) {
  try {
    console.log(promedioDeEdades(prueba));
  } catch (error) {
    console.log('Falla:', error.message);
  }
}
```

Escribe los tests, corrígela y compara tu lista de problemas con la de la IA. ¿Quién encontró más? ¿La IA afirmó algo incorrecto?

## Laboratorio 4: instala Claude Code (30 min)

El plan gratis de claude.ai no incluye Claude Code: necesitas una cuenta Pro, Max, Ultra, Team, Enterprise o Console. Si estás en Windows, instálalo dentro de WSL.

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
```

Como aprendiste en la semana 1, revisa de dónde viene un comando así. Este es el que publica la [documentación oficial](https://code.claude.com/docs/en/setup); confírmalo allí antes de ejecutarlo.

Abre tu proyecto y haz solo preguntas, sin pedir cambios:

```bash
cd ~/curso/mi-landing
claude
```

```text
Explícame qué hace este proyecto, por dónde pasa un envío del formulario
y qué parte corre en el servidor. No modifiques nada.
```

Comprueba su respuesta contra lo que ya sabes.

## Ejercicios

1. Reescribe tres prompts vagos usando los seis elementos.
2. Pide una misma función a dos modelos o herramientas, y compara resultados.
3. Pregúntale a la IA algo que sepas responder bien y detecta errores en su explicación.
4. Consulta en `/usage` el consumo de tu sesión.

## Comprueba que entendiste

1. ¿Por qué un modelo puede inventar una función con total seguridad?
2. ¿Qué ocupa espacio en la ventana de contexto?
3. ¿Por qué una tarea de un agente puede costar más que un chat?
4. ¿Qué elementos debe tener un buen prompt para código?
5. ¿Qué harías si tras dos intentos el modelo no logra arreglar algo?

## Entregable

- [ ] Comparación de prompts con sus resultados.
- [ ] Al menos una alucinación documentada, o el intento de provocarla.
- [ ] Función corregida con tests.
- [ ] Claude Code instalado y una exploración de tu proyecto verificada.
