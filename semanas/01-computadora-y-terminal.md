# Semana 1: Computadora y terminal

**Objetivo:** entender qué hace tu computadora y darle órdenes escribiendo.

**Por qué importa:** los agentes de IA trabajan en la terminal, con archivos y procesos. Si no entiendes esas piezas, no vas a saber qué aprobar.

## Conceptos

### Las piezas de una computadora

Imagina una cocina:

| Pieza | Qué hace | En la cocina |
|---|---|---|
| **CPU** | Ejecuta instrucciones | El cocinero |
| **RAM** | Memoria rápida y temporal; se borra al apagar | La mesada |
| **Disco** | Guarda datos de forma permanente | La despensa |
| **Sistema operativo** | Reparte los recursos entre programas | El jefe de cocina |

Una **aplicación** es un programa guardado en el disco. Cuando la abres, se convierte en un **proceso**: un programa en ejecución.

### Binario

La computadora trabaja con unos y ceros (**bits**). Ocho bits forman un **byte**, y un byte alcanza para representar un carácter simple, como la letra `A`. Un texto, una foto y un programa son, en el fondo, secuencias de bytes interpretadas de distinta forma.

### Archivos y rutas

Los archivos se organizan en carpetas, como un árbol. Una **ruta** indica dónde está cada uno:

- **Absoluta:** desde la raíz, como `/home/ana/proyectos/index.html`.
- **Relativa:** desde donde estás, como `proyectos/index.html`.
- `.` es la carpeta actual, `..` la carpeta superior y `~` tu carpeta personal.

Los archivos que empiezan con punto, como `.env`, están ocultos. Vas a usarlos mucho.

### Terminal

La terminal es una ventana para dar órdenes escritas. Cada comando sigue esta forma:

```text
comando  opciones  argumentos
ls       -la       proyectos
```

## Laboratorio 1: instalación (1-2 h)

**Windows:** abre PowerShell como administrador y ejecuta `wsl --install`. Reinicia y crea tu usuario de Ubuntu. Durante el curso, trabaja **dentro de Ubuntu**.

**macOS:** abre la app Terminal y ejecuta `xcode-select --install`.

**Todos:**

1. Instala [VS Code](https://code.visualstudio.com/). En Windows, agrega la extensión **WSL**.
2. Instala Node.js con [nvm](https://github.com/nvm-sh/nvm) siguiendo su guía oficial.
3. Comprueba que todo responda:

```bash
git --version
node --version
npm --version
code --version
```

Si Git falta en Ubuntu, instálalo con `sudo apt install git`.

**Hábito de seguridad:** antes de pegar un comando de internet, pregúntate de dónde viene y qué hace. Es aún más importante si incluye `sudo` o `curl ... | bash`, porque le das permiso para ejecutar código en tu máquina.

## Laboratorio 2: terminal (2 h)

| Comando | Qué hace |
|---|---|
| `pwd` | Muestra dónde estás |
| `ls -la` | Lista todo, incluso lo oculto |
| `cd carpeta` / `cd ..` | Entra a una carpeta / sube un nivel |
| `mkdir nombre` | Crea una carpeta |
| `touch archivo` | Crea un archivo vacío |
| `cp a b` / `mv a b` | Copia / mueve o renombra |
| `rm archivo` | Borra un archivo **sin pasar por la papelera** |
| `cat archivo` | Muestra el contenido |
| `ps aux` | Lista los procesos |
| `Ctrl + C` | Detiene el proceso actual |

Crea esta estructura solo con la terminal:

```text
~/curso/
├── notas/
│   └── semana-01.md
└── mi-landing/
    └── index.html
```

```bash
mkdir -p ~/curso/notas ~/curso/mi-landing
cd ~/curso
touch notas/semana-01.md mi-landing/index.html
ls -la notas mi-landing
code .
```

**Precaución:** `rm -rf` borra carpetas enteras sin preguntar. No lo uses hasta estar seguro de la ruta.

## Laboratorio 3: protege tus cuentas (1 h)

Durante el curso vas a tener cuentas que controlan tu código, tu sitio y tu dominio.

1. Instala un gestor de contraseñas, como Bitwarden o 1Password.
2. Crea una contraseña maestra larga, que sea una frase, y guárdala en un lugar físico seguro.
3. Activa la verificación en dos pasos (**2FA**) en tu email principal con una app autenticadora, y guarda los códigos de recuperación.

Tu email es la llave de todas las demás cuentas: protégelo primero.

## Usar la IA como tutor

Abre Claude u otro asistente y pídele esto:

```text
Soy principiante absoluto. Explícame qué hace este comando parte por parte
y qué riesgo tiene antes de que lo ejecute: [comando]
```

**Regla hasta la semana 9:** la IA puede explicarte, pero tú escribes el código. Si copias sin entender, avanzas en el proyecto y no en tu aprendizaje.

## Ejercicios

1. Crea `~/curso/pruebas/a/b/c` con un solo comando, entra a `c` y vuelve a `~` usando una ruta relativa.
2. Crea un archivo oculto y encuéntralo con `ls`.
3. Ejecuta `sleep 100`, detenlo con `Ctrl + C` y explica qué pasó con ese proceso.
4. Busca un comando que no conozcas con `man ls` o `ls --help`.

## Comprueba que entendiste

1. ¿Por qué se pierde lo que no guardaste cuando se apaga la computadora?
2. ¿Qué diferencia hay entre un programa y un proceso?
3. ¿Qué diferencia hay entre una ruta absoluta y una relativa?
4. ¿Por qué `rm` es más peligroso que borrar desde el explorador?
5. ¿Qué pasa con tus otras cuentas si alguien toma el control de tu email?

## Entregable

- [ ] Las herramientas responden con su versión.
- [ ] La estructura `~/curso` está creada desde la terminal.
- [ ] Gestor de contraseñas instalado y 2FA activo en tu email.
- [ ] Notas de la semana con tus palabras en `notas/semana-01.md`.
