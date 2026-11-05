# Semana 5: Programación

**Objetivo:** escribir programas pequeños en JavaScript y entender sus errores.

**Por qué importa:** para evaluar el código de un agente no hace falta escribirlo rápido, pero sí leerlo y razonar sobre él.

JavaScript corre en el navegador y también en el servidor con Node.js, así que aprendes un solo lenguaje para ambos lados.

## Cómo ejecutar

Crea `~/curso/practica/ejercicio.js` y ejecútalo:

```bash
node ejercicio.js
```

## Conceptos

### Variables y tipos

Una variable es una caja con nombre que guarda un dato.

```js
const nombre = 'Ana';      // texto (string); no se puede reasignar
let edad = 30;             // número; se puede reasignar
const activa = true;       // booleano: true o false
let telefono = null;       // ausencia intencional de valor

edad = edad + 1;
console.log(nombre, edad, activa, telefono);
console.log(`${nombre} tiene ${edad} años`);
```

Usa `const` por defecto, y `let` solo si el valor va a cambiar.

### Condicionales

```js
const nota = 75;

if (nota >= 90) {
  console.log('Excelente');
} else if (nota >= 60) {
  console.log('Aprobado');
} else {
  console.log('Desaprobado');
}
```

Compara siempre con `===`: `5 === '5'` es `false`, mientras que `5 == '5'` es `true` y puede ocultar errores.

También vas a usar `&&` (y), `||` (o) y `!` (no).

### Arrays

Un array es una lista ordenada. El primer elemento está en la posición 0.

```js
const compras = ['pan', 'leche'];
compras.push('café');

console.log(compras[0]);       // pan
console.log(compras.length);   // 3
```

### Bucles

```js
const precios = [10, 20, 5];
let total = 0;

for (const precio of precios) {
  total += precio;
}

console.log(total); // 35

let cuenta = 3;
while (cuenta > 0) {
  console.log(cuenta);
  cuenta -= 1;
}
```

Si la condición de un `while` nunca se vuelve falsa, el programa no termina. Detenlo con `Ctrl + C`.

### Funciones

Una función es una receta con nombre: recibe datos, hace algo y devuelve un resultado.

```js
function calcularTotal(precio, cantidad) {
  return precio * cantidad;
}

// La misma idea, escrita como función flecha
const conIva = (monto) => monto * 1.21;

console.log(calcularTotal(100, 3)); // 300
console.log(conIva(100));
```

Una buena función hace una sola cosa y tiene un nombre que lo explica.

### Objetos

Un objeto agrupa datos relacionados bajo nombres.

```js
const persona = { nombre: 'Ana', email: 'ana@ejemplo.com', activa: true };

console.log(persona.nombre);
persona.activa = false;
console.log(persona);
```

### Listas de objetos

Es la forma más común de los datos reales.

```js
const contactos = [
  { nombre: 'Ana', edad: 30 },
  { nombre: 'Luis', edad: 17 },
  { nombre: 'Marta', edad: 45 },
];

const adultos = contactos.filter((c) => c.edad >= 18);
const nombres = adultos.map((c) => c.nombre);
const sumaEdades = contactos.reduce((suma, c) => suma + c.edad, 0);

console.log(nombres);    // [ 'Ana', 'Marta' ]
console.log(sumaEdades); // 92
```

## Leer errores

Un error no es un fracaso: es información. Este programa falla a propósito:

```text
function saludar(persona) {
  return persona.nombre.toUpperCase();
}
saludar({});
```

Vas a ver algo como:

```text
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
    at saludar (/home/ana/curso/practica/error.js:2:25)
    at Object.<anonymous> (/home/ana/curso/practica/error.js:4:1)
```

Léelo así:

| Parte | Qué te dice |
|---|---|
| `TypeError` | La categoría del error |
| `Cannot read properties of undefined` | `persona.nombre` no tiene valor |
| `error.js:2:25` | Archivo, línea y columna donde falló |
| Las líneas `at` | **Stack trace:** la cadena de llamadas que llegó hasta ahí |

Errores frecuentes:

| Error | Causa probable |
|---|---|
| `SyntaxError` | Falta o sobra un símbolo, como `)` o `}` |
| `ReferenceError: x is not defined` | Nombre mal escrito o variable inexistente |
| `TypeError` | Operación sobre un valor del tipo incorrecto |
| `Cannot find module` | Falta instalar un paquete o la ruta es incorrecta |

**Método:** lee el mensaje, ve a la línea indicada, formula una hipótesis, cambia una sola cosa y vuelve a ejecutar.

**Con la IA:** intenta primero tu hipótesis. Después pega el error y pide: «Explícame la causa y cómo diagnosticarlo, sin darme el código corregido».

## Ejercicios

Escribe cada uno sin generar código con IA:

1. **Par o impar:** una función que reciba un número y devuelva `'par'` o `'impar'`.
2. **Mayor de una lista:** devuelve el número más grande, sin usar `Math.max`.
3. **FizzBuzz:** imprime del 1 al 30, con `Fizz` en los múltiplos de 3, `Buzz` en los de 5 y `FizzBuzz` en los de ambos.
4. **Contar vocales:** recibe un texto y devuelve cuántas vocales tiene.
5. **Carrito:** dada una lista de `{ nombre, precio, cantidad }`, calcula el total.
6. **Validar email:** comprueba que un texto tenga exactamente un `@` y al menos un `.` después.
7. **Rompe y arregla:** introduce tres errores distintos en un programa, lee sus mensajes y corrígelos.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre `const` y `let`?
2. ¿Qué diferencia hay entre `return` y `console.log`?
3. ¿Por qué el primer elemento de un array está en la posición 0 y qué devuelve `lista[lista.length]`?
4. ¿Qué información da un stack trace?
5. ¿Cuándo usarías un objeto y cuándo un array?

## Entregable

- [ ] Los siete ejercicios en `~/curso/practica`, con commits en un repositorio.
- [ ] Notas con tres errores que hayas leído, su causa y cómo los resolviste.
