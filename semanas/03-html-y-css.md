# Semana 3: HTML y CSS

**Objetivo:** construir a mano la primera versión de tu landing.

**Por qué importa:** cuando un agente genere una web, vas a poder leerla, detectar errores y pedir cambios precisos.

## Antes de empezar: elige tu landing

Elige una idea real o inventada: un servicio, un curso o un portfolio. Escribe en tus notas:

- ¿Para quién es?
- ¿Qué problema resuelve?
- ¿Qué quieres que haga el visitante? Por ejemplo, dejar su email.

Tu respuesta a la última pregunta es la **llamada a la acción** (CTA), y toda la página debe llevar hacia ella.

## Conceptos

Una web tiene tres capas:

| Capa | Rol | En una casa |
|---|---|---|
| **HTML** | Estructura y contenido | Paredes y habitaciones |
| **CSS** | Apariencia | Pintura y decoración |
| **JavaScript** | Comportamiento (semana 7) | Electricidad |

### HTML

Se escribe con **etiquetas**:

```html
<a href="https://ejemplo.com" class="boton">Visítanos</a>
<!-- etiqueta  atributos                    contenido -->
```

Estructura mínima:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Título que aparece en la pestaña y en Google</title>
  <meta name="description" content="Resumen que suele mostrarse en buscadores">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Lo que ve el visitante -->
</body>
</html>
```

### HTML semántico

Usa la etiqueta que describe el significado del contenido, no solo su apariencia. Esto ayuda a lectores de pantalla y buscadores.

| Etiqueta | Uso |
|---|---|
| `<header>`, `<main>`, `<footer>` | Grandes zonas de la página |
| `<section>`, `<article>` | Bloques de contenido |
| `<nav>` | Navegación |
| `<h1>` a `<h6>` | Títulos, en orden; un solo `<h1>` por página |
| `<p>`, `<ul>`, `<li>` | Párrafos y listas |
| `<a>` | Enlaces: llevan a otro lugar |
| `<button>` | Botones: ejecutan una acción |
| `<img alt="...">` | Imágenes, con su descripción |
| `<form>`, `<label>`, `<input>` | Formularios |

### CSS

```css
/* selector { propiedad: valor; } */
.boton {
  background: #b4441c;
  color: white;
  padding: 12px 24px;
}
```

| Selector | Selecciona |
|---|---|
| `p` | Todos los párrafos |
| `.boton` | Elementos con `class="boton"` |
| `#contacto` | El elemento con `id="contacto"` |
| `.hero h1` | Los `h1` dentro de `.hero` |

**Modelo de caja:** todo elemento es una caja con contenido, `padding` (espacio interior), `border` (borde) y `margin` (espacio exterior).

**Flexbox y Grid:** ordenan elementos en una dimensión (`display: flex`) o en dos (`display: grid`).

**Responsive:** la página debe verse bien en cualquier pantalla. Diseña primero para móvil y usa medidas flexibles. Esta línea crea columnas que se acomodan solas:

```css
.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
```

**Variables CSS:** guardan valores que se repiten, como los colores de la marca.

```css
:root { --acento: #b4441c; }
.boton { background: var(--acento); }
```

### Accesibilidad básica

- Cada campo de formulario tiene su `<label>`.
- Cada imagen informativa tiene `alt`.
- El texto tiene contraste suficiente con el fondo.
- Todo se puede usar solo con el teclado: pruébalo con `Tab`.

## Laboratorio: tu landing v1 (4 h)

En `~/curso/mi-landing`, crea `index.html` y `styles.css` con estas secciones:

1. **Hero:** un título claro, una frase y un botón hacia el formulario (`href="#contacto"`).
2. **Beneficios:** tres tarjetas.
3. **Formulario:** nombre, email y botón. Todavía no envía datos a ningún lado.
4. **Pie de página**.

Míralo funcionando con:

```bash
cd ~/curso/mi-landing
npx serve -l 3000
```

**Inspecciona:** con `F12`, usa la pestaña **Elements** para modificar estilos en vivo. Después, activa el modo dispositivo (`Ctrl + Shift + M`) y prueba tu página en tamaño móvil. Lo que cambies ahí se pierde al recargar; pasa a tu archivo lo que te guste.

Escribe tú el código. Si te trabas, pídele a la IA una explicación del concepto, no la página.

## Ejercicios

1. Cambia los colores de toda la página tocando solo las variables CSS.
2. Recorre la página solo con `Tab` y corrige lo que no se pueda alcanzar.
3. Ejecuta **Lighthouse** en DevTools y corrige dos observaciones de accesibilidad.
4. Pasa tu HTML por el [validador del W3C](https://validator.w3.org/#validate_by_input) y resuelve los errores.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre HTML y CSS?
2. ¿Por qué usar `<button>` y no un `<div>` con apariencia de botón?
3. ¿Cuándo usarías una clase y cuándo un id?
4. ¿Qué hace la etiqueta `<meta name="viewport">`?
5. ¿Qué diferencia hay entre `padding` y `margin`?

## Entregable

- [ ] Landing con hero, beneficios, formulario y pie de página.
- [ ] Se ve bien en móvil y en escritorio.
- [ ] HTML semántico, sin errores en el validador.
- [ ] Se puede usar solo con el teclado.
