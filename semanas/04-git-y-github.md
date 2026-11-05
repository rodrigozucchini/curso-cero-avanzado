# Semana 4: Git y GitHub

**Objetivo:** guardar el historial de tu proyecto, colaborar y hacer tu primer deploy.

**Por qué importa:** Git es tu red de seguridad cuando trabajes con agentes. Si un agente rompe algo, lo vas a ver y lo vas a poder deshacer.

## Conceptos

**Git** guarda fotos de tu proyecto en el tiempo y corre en tu computadora. **GitHub** es un servicio online que aloja repositorios de Git y permite colaborar. No son lo mismo.

| Concepto | Qué es |
|---|---|
| **Repositorio** | Tu proyecto, junto con todo su historial |
| **Commit** | Una foto guardada, con un mensaje |
| **Rama (branch)** | Una línea de trabajo paralela |
| **Merge** | Unir una rama con otra |
| **Remote** | La copia en otro lugar, como GitHub |
| **Pull request (PR)** | Propuesta para unir cambios, con espacio para revisarlos |

**Las tres zonas de Git:**

```text
Carpeta de trabajo --git add--> Staging --git commit--> Historial --git push--> GitHub
```

## Laboratorio 1: primer repositorio (1 h)

Configura tu identidad una sola vez:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
```

Tu email queda en cada commit público. Si prefieres no exponerlo, usa el email `noreply` que GitHub ofrece en sus ajustes.

Crea tu primer commit:

```bash
cd ~/curso/mi-landing
git init
git status
git add index.html styles.css
git commit -m "Agrega primera versión de la landing"
git log --oneline
```

Haz un cambio y míralo antes de guardarlo:

```bash
git diff
git add .
git commit -m "Mejora el título principal"
```

**Aprende a leer `git diff`:** las líneas con `-` se quitaron y las líneas con `+` se agregaron. Es lo mismo que vas a revisar cuando un agente modifique tu código.

**Buen mensaje de commit:** indica qué cambió y por qué. `Corrige email duplicado en el formulario` sirve; `arreglos` no.

## Laboratorio 2: secretos y `.gitignore` (1 h)

Un **secreto** es cualquier dato que da acceso a algo: contraseñas, tokens, claves de API. Nunca van en Git.

Crea `.gitignore` antes de tener secretos:

```text
node_modules/
.env
.env.local
.vercel/
.DS_Store
```

Compruébalo:

```bash
echo "CLAVE=prueba" > .env
git status
```

`.env` no debe aparecer en la lista.

**Si subes un secreto por error:**

1. **Primero, revócalo y genera uno nuevo.** Esto es lo importante: borrarlo no alcanza, porque puede seguir en el historial y alguien ya pudo copiarlo.
2. Revisa la actividad de esa cuenta.
3. Quita el secreto del código y haz commit.
4. Limpia el historial solo si hace falta, y sigue una guía oficial.

## Laboratorio 3: GitHub (1 h)

1. Crea una cuenta en GitHub y **activa 2FA**.
2. Instala [`gh`](https://cli.github.com/) y autentícate con `gh auth login`.
3. Publica el repositorio:

```bash
gh repo create mi-landing --public --source=. --push
```

Antes de hacerlo, revisa que no haya nada privado: un repositorio público lo ve todo el mundo, incluido el historial.

## Laboratorio 4: ramas y pull requests (2 h)

```bash
git switch -c mejora-titulo
# Edita el título en index.html
git add index.html
git commit -m "Hace el título más específico"
git push -u origin mejora-titulo
gh pr create --fill
```

En GitHub, abre el PR y revisa la pestaña **Files changed**. Después, únelo con **Merge** y actualiza tu copia local:

```bash
git switch main
git pull
```

### Provoca un conflicto a propósito

Un **conflicto** ocurre cuando dos ramas cambian las mismas líneas y Git no sabe con cuál quedarse.

```bash
git switch -c rama-a
# Cambia el h1 a "Versión A"
git commit -am "Título A"
git switch main
# Cambia el mismo h1 a "Versión B"
git commit -am "Título B"
git merge rama-a
```

Git marcará el archivo así:

```text
<<<<<<< HEAD
<h1>Versión B</h1>
=======
<h1>Versión A</h1>
>>>>>>> rama-a
```

Deja el texto correcto, borra las marcas y termina:

```bash
git add index.html
git commit
```

## Laboratorio 5: deshacer cambios (30 min)

| Situación | Comando | Riesgo |
|---|---|---|
| Descartar cambios sin commit en un archivo | `git restore archivo` | Se pierden esos cambios |
| Sacar un archivo de staging | `git restore --staged archivo` | Ninguno |
| Deshacer un commit con otro commit nuevo | `git revert <hash>` | Bajo: conserva el historial |
| Borrar commits | `git reset --hard <hash>` | **Alto:** se pierde trabajo |

En ramas compartidas, usa `git revert`. Antes de cualquier experimento grande, haz un commit.

## Laboratorio 6: primer deploy (30 min)

**Deploy** significa publicar tu código para que otros lo usen.

1. En GitHub, abre **Settings → Pages**.
2. En **Source**, elige **Deploy from a branch**, y luego `main` y `/ (root)`.
3. Espera un par de minutos y abre la URL que aparece.

Tu página ya está en internet. Investígala con lo que aprendiste:

```bash
nslookup TU-USUARIO.github.io
curl -I https://TU-USUARIO.github.io/mi-landing/
```

## Ejercicios

1. Haz cinco commits pequeños con buenos mensajes.
2. Usa `git log --oneline --graph` para ver tu historial.
3. Haz un cambio malo, publícalo y deshazlo con `git revert`.
4. Crea un PR y escribe qué cambia y cómo probarlo.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre Git y GitHub?
2. ¿Qué hace `git add` que no hace `git commit`?
3. ¿Para qué trabajar en una rama en vez de directamente en `main`?
4. ¿Por qué no alcanza con borrar un secreto subido por error?
5. ¿Cuándo usarías `git revert` y no `git reset --hard`?

## Entregable

- [ ] Repositorio en GitHub con historial claro y 2FA activo en la cuenta.
- [ ] `.gitignore` funcionando.
- [ ] Un PR revisado y unido, y un conflicto resuelto.
- [ ] Landing publicada en GitHub Pages con URL pública.
