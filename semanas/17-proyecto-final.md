# Semana 17: Proyecto final

**Objetivo:** partir de una carpeta vacía y llegar a producción con Claude Code, demostrando que entiendes cada capa.

**Reglas:**

- Debe ser un proyecto **nuevo**, no tu landing de práctica.
- El agente escribe la mayor parte del código. Tú especificas, diriges, revisas y decides.
- Todo lo que publiques debes poder explicarlo sin ayuda.

Se evalúa con la [rúbrica del proyecto final](../recursos/rubrica-proyecto-final.md).

## Requisitos

| Área | Mínimo |
|---|---|
| **Sitio** | Landing con propuesta clara, responsive, accesible y con aviso de privacidad |
| **Backend** | Formulario con validación en el servidor |
| **Datos** | Base de datos con RLS, permisos mínimos y una copia de seguridad probada |
| **Producción** | Dominio propio, HTTPS, cabeceras de seguridad, monitor y rollback probado |
| **Git** | Trabajo por ramas y PRs, con `main` protegida y CI |
| **SDD** | Especificación, contrato, plan y tareas |
| **Harness** | `CLAUDE.md`, permisos mínimos, al menos un hook, una skill y un subagente |
| **Verificación** | Tests, skill verificadora y un eval con al menos 10 casos |
| **Seguridad** | Lista de control completa y modelo de amenazas |

Si usas datos o marcas reales, necesitas contar con permiso. Si tu landing es para un negocio, usa un plan de hosting que permita uso comercial.

## Plan de la semana

### Día 1: especificación (2 h)

Sin generar código todavía.

1. Define el problema, el público y la llamada a la acción.
2. Escribe `specs/001-landing/spec.md`, con su sección **Fuera de alcance**.
3. Escribe al menos 10 criterios de aceptación, incluidos los de seguridad.
4. Escribe `contrato.md`.
5. Pídele al agente que critique la especificación, sin escribir código.

### Día 2: harness y plan (2 h)

```bash
mkdir ~/curso/proyecto-final && cd ~/curso/proyecto-final
git init
```

1. Crea `.gitignore` **antes que nada**, y haz el primer commit.
2. Crea `CLAUDE.md`, `.claude/settings.json`, tus hooks, tu skill verificadora y tu subagente revisor.
3. Comprueba que los hooks bloqueen lo que deben.
4. En modo plan, genera `plan.md` y `tareas.md`. Corrígelos hasta que puedas defender cada decisión.
5. Sube el repositorio a GitHub, con CI y protección de `main`.

### Días 3 y 4: construcción (4 h)

Por cada tarea:

```text
1. Abrir una rama
2. Pedir solo esa tarea, indicando su criterio de aceptación
3. Tests primero
4. Implementar
5. Leer el diff
6. Abrir un PR y revisar la preview
7. Unirlo cuando la CI pase
```

Registra en `docs/bitacora.md` las decisiones importantes, los errores del agente y cómo los corregiste. **Cada error repetido debe terminar en una mejora del harness.**

### Día 5: verificación y auditoría (2 h)

1. Ejecuta `/verificar-spec` en una **sesión nueva**, y comprueba tú mismo varios criterios.
2. Pídele al subagente revisor una revisión de toda la rama.
3. Ejecuta el eval de tu verificador.
4. Completa `docs/modelo-de-amenazas.md`.
5. Audítate como atacante:

```bash
# Busca secretos en todo el historial
git log -p --all | grep -nE "sb_secret_|SUPABASE_SECRET_KEY=" || echo "Sin coincidencias"

# ¿La clave publicable accede a tu tabla? Debe fallar
curl -i "https://TU-PROYECTO.supabase.co/rest/v1/leads?select=*" \
  -H "apikey: sb_publishable_..."

# ¿La API acepta datos inválidos? Debe responder 400
curl -i -X POST https://tudominio.com/api/lead \
  -H "Content-Type: application/json" -d '{"nombre":"","email":"x"}'

# Revisa las dependencias
npm audit --audit-level=high

# Revisa las cabeceras
curl -I https://tudominio.com
```

Audita **solo tus propios sistemas**.

### Día 6: producción (2 h)

Puedes dirigir al agente, pero **tú** aprobarás cada acción y cada comando externo.

1. Configura las variables de entorno y publica.
2. Conecta el dominio y comprueba con `dig` y `curl`.
3. Completa `recursos/checklist-seguridad.md`.
4. Envía un formulario real y confirma la fila guardada.
5. Prueba un rollback.
6. Activa el monitor de disponibilidad.
7. Pide a dos personas que usen tu sitio en sus teléfonos, y corrige lo que encuentren.

### Día 7: defensa técnica (1 h)

Graba un video de 10 minutos o preséntalo en vivo.

1. **Demo:** el sitio funcionando en tu dominio.
2. **Recorrido:** qué pasa desde que alguien escribe tu dominio hasta que queda guardada su fila.
3. **Seguridad:** dónde está la clave secreta, y cómo demuestras que la tabla no está abierta.
4. **Agente:** muestra tu harness y un error que evitó.
5. **Verificación:** muestra un rechazo real y cómo se resolvió.
6. **Reflexión:** qué harías distinto.

## Preguntas de la defensa

Responde sin ayuda de IA:

**Infraestructura**

1. ¿Qué registros DNS configuraste y por qué?
2. ¿Qué diferencia hay entre tu registrador, tu DNS y tu hosting?
3. Si el sitio cae ahora, ¿qué revisas primero?

**Código**

4. Abre `api/lead.js` y explica línea por línea.
5. ¿Qué pasa si alguien envía datos directamente a tu API, sin pasar por el formulario?
6. ¿Cómo se comporta tu sistema con un email repetido, y por qué?

**Datos**

7. ¿Qué hace RLS en tu tabla?
8. Si se filtra tu clave secreta, ¿qué pasos sigues?
9. ¿Cómo eliminarías los datos de una persona que lo solicite?

**Desarrollo con IA**

10. ¿Qué regla pusiste en un hook y no en `CLAUDE.md`? ¿Por qué?
11. ¿Cómo sabes que tu verificador funciona?
12. ¿Cómo podría una prompt injection dañar tu proyecto, y qué lo limita?
13. ¿Qué parte generada por el agente rechazaste, y por qué?

## Entregables finales

- [ ] URL pública con dominio propio.
- [ ] Repositorio con historial limpio, PRs y CI.
- [ ] `specs/` completo y actualizado.
- [ ] Harness: `CLAUDE.md`, `.claude/`.
- [ ] Informe de verificación y resultados del eval.
- [ ] `docs/bitacora.md` y `docs/modelo-de-amenazas.md`.
- [ ] Lista de control de seguridad completa.
- [ ] Defensa técnica.

## Después del curso

| Si quieres… | Sigue con… |
|---|---|
| Hacer productos más complejos | TypeScript, un framework como Next.js o Astro, autenticación y pagos |
| Fortalecer las bases | Estructuras de datos, diseño de sistemas y arquitectura de bases de datos |
| Profundizar en seguridad | OWASP Top 10 y OWASP Top 10 para aplicaciones con LLM |
| Crear productos con IA | API de Claude, RAG, embeddings y Agent SDK |
| Ganar experiencia | Proyectos para clientes reales y contribuciones a código abierto |

Lo más importante es seguir construyendo cosas reales y conservar el hábito que aprendiste: **especificar, delegar, verificar y entender.**
