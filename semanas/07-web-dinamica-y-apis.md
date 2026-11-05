# Semana 7: Web dinámica y APIs

**Objetivo:** conectar tu formulario con un servidor que valide los datos.

**Por qué importa:** aquí aparece la frontera más importante de la seguridad web: lo que corre en el navegador y lo que corre en el servidor.

## Conceptos

### Frontend y backend

| | Frontend | Backend |
|---|---|---|
| **Dónde corre** | En el navegador del visitante | En tu servidor |
| **Quién puede verlo** | Cualquiera, con F12 | Solo tú |
| **Qué puede guardar** | Nada secreto | Secretos, en variables de entorno |
| **Se puede confiar en él** | **No**: el usuario puede alterarlo | Sí, si lo proteges |

**Regla de oro:** todo lo que se envía al navegador es público, y todo lo que llega desde el navegador es sospechoso.

### DOM

El **DOM** es la representación de tu HTML que JavaScript puede leer y modificar.

```javascript
const titulo = document.querySelector('h1');
titulo.textContent = 'Nuevo título';

document.querySelector('.boton').addEventListener('click', () => {
  console.log('Hiciste clic');
});
```

### JSON

**JSON** es un formato de texto para intercambiar datos, muy parecido a un objeto de JavaScript.

```js
const persona = { nombre: 'Ana', edad: 30 };

const texto = JSON.stringify(persona);  // objeto a texto, para enviarlo
const objeto = JSON.parse(texto);       // texto a objeto, para usarlo

console.log(texto);
console.log(objeto.nombre);
```

### API

Una **API** es un conjunto de reglas para que un programa le pida cosas a otro. En la web suele ser una URL que recibe y devuelve JSON.

### fetch, async y await

Las peticiones de red tardan. `await` espera el resultado sin congelar la página.

```javascript
async function obtenerDatos() {
  const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  return respuesta.json();
}

try {
  console.log(await obtenerDatos());
} catch (error) {
  console.error('Falló la petición:', error.message);
}
```

Maneja siempre los errores: las redes fallan.

### Node.js y npm

**Node.js** ejecuta JavaScript fuera del navegador. **npm** instala paquetes, es decir, código escrito por otros.

| Archivo | Para qué sirve | ¿Va a Git? |
|---|---|---|
| `package.json` | Lista de dependencias y scripts | Sí |
| `package-lock.json` | Versiones exactas instaladas | Sí |
| `node_modules/` | El código descargado | **No** |

### Variables de entorno

Son valores que se configuran fuera del código. Sirven para los secretos: el código lee `process.env.CLAVE`, y el valor vive en `.env.local` en tu máquina y en el panel del hosting en producción.

### Serverless

Una **función serverless** es una porción de código backend que se ejecuta solo cuando llega una petición. Hay servidores, pero los administra el proveedor. En Vercel, cada archivo de la carpeta `api/` puede ser una función.

## Seguridad

### Valida en el servidor

La validación en el navegador mejora la experiencia, pero no protege. Cualquiera puede saltársela:

```bash
curl -X POST https://tu-sitio.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"nombre":"","email":"no-es-email"}'
```

### XSS

Hay **XSS** cuando un atacante logra ejecutar su JavaScript en la página de otra persona.

```javascript
// PELIGROSO: si el dato contiene HTML, se ejecuta
estado.innerHTML = datos.mensaje;

// SEGURO: se muestra como texto
estado.textContent = datos.mensaje;
```

Por defecto usa `textContent`. Si ves `innerHTML` con datos del usuario en código generado por un agente, revísalo.

### Dependencias

Cada paquete es código ajeno que corre en tu proyecto, y también en tu máquina al instalarlo. Antes de instalar uno:

1. Comprueba que el nombre sea exacto. Los atacantes publican paquetes con nombres casi iguales, y las IA a veces inventan nombres de paquetes.
2. Mira su página en npm: repositorio, actividad y descargas.
3. Pregúntate si realmente lo necesitas.

Después:

```bash
npm audit
```

`npm audit` detecta vulnerabilidades conocidas, pero no todo el código malicioso. No uses `npm audit fix --force` sin leer qué va a cambiar, porque puede romper tu proyecto.

## Laboratorio 1: API local (3 h)

En tu landing, crea esta estructura:

```text
mi-landing/
├── index.html
├── styles.css
├── app.js
├── package.json
└── api/
    └── lead.js
```

`package.json`:

```json
{ "name": "mi-landing", "private": true, "type": "module", "scripts": { "test": "node --test" } }
```

`api/lead.js` (por ahora solo valida):

```javascript
export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Método no permitido.' }, { status: 405 });
    }

    let datos;
    try {
      datos = await request.json();
    } catch {
      return Response.json({ error: 'Datos con formato inválido.' }, { status: 400 });
    }

    const nombre = String(datos.nombre ?? '').trim();
    const email = String(datos.email ?? '').trim().toLowerCase();

    if (nombre.length < 1 || nombre.length > 100) {
      return Response.json({ error: 'Escribe un nombre válido.' }, { status: 400 });
    }
    if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Escribe un email válido.' }, { status: 400 });
    }

    console.log('Lead válido:', nombre);
    return Response.json({ ok: true }, { status: 201 });
  },
};
```

La expresión regular `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` comprueba la forma general de un email: texto, `@`, texto, punto y texto. Solo enviarle un mensaje demuestra que un email existe.

`app.js`:

```javascript
const formulario = document.querySelector('#formulario');
const estado = document.querySelector('#estado');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  estado.textContent = 'Enviando...';

  try {
    const respuesta = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
    });
    const datos = await respuesta.json();
    estado.textContent = respuesta.ok ? '¡Listo!' : datos.error;
  } catch {
    estado.textContent = 'No pudimos conectar. Intenta de nuevo.';
  }
});
```

En `index.html`, agrega `id="formulario"` al `<form>`, un `<p id="estado" role="status"></p>` dentro de él, `name` en cada campo, y `<script src="app.js"></script>` antes de `</body>`.

Para ejecutar la función en local, crea una cuenta en [Vercel](https://vercel.com) con tu usuario de GitHub, con 2FA activo, y corre:

```bash
npx vercel login
npx vercel link
npx vercel dev
```

## Laboratorio 2: prueba como atacante (1 h)

Con el servidor en marcha, prueba estas peticiones y anota qué responde:

```bash
curl -i -X POST localhost:3000/api/lead -H "Content-Type: application/json" -d '{"nombre":"Ana","email":"ana@ejemplo.com"}'
curl -i -X POST localhost:3000/api/lead -H "Content-Type: application/json" -d '{"nombre":"","email":"ana@ejemplo.com"}'
curl -i -X POST localhost:3000/api/lead -H "Content-Type: application/json" -d '{roto'
curl -i localhost:3000/api/lead
```

Agrega `test/lead.test.js` con un test por cada caso. Puedes compararlo después con `proyecto-referencia/test/lead.test.js`.

## Ejercicios

1. Agrega un contador de caracteres en vivo a un campo, usando el evento `input`.
2. Desactiva el botón mientras se envía y vuelve a activarlo al terminar.
3. Muestra en la página datos de una API pública con `fetch`, y un mensaje claro si falla.
4. Inyecta `<img src=x onerror=alert(1)>` como dato en una página de prueba, usando primero `innerHTML` y después `textContent`. Explica la diferencia.
5. Instala un paquete, ejecuta `npm audit` y revisa qué agregó a `package-lock.json`.

## Comprueba que entendiste

1. ¿Por qué una clave secreta no puede estar en `app.js`?
2. ¿Por qué validar en el servidor si ya se valida en el navegador?
3. ¿Qué diferencia hay entre `innerHTML` y `textContent`?
4. ¿Por qué `node_modules` no va a Git y `package-lock.json` sí?
5. ¿Qué significa «serverless» si igual hay servidores?

## Entregable

- [ ] El formulario envía datos a `/api/lead` y muestra respuestas de éxito y error.
- [ ] La API rechaza datos inválidos, comprobado con `curl`.
- [ ] Tests de la API pasando.
- [ ] `npm audit` ejecutado y resultado anotado.
