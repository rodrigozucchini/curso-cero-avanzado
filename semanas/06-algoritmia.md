# Semana 6: Algoritmia, depuración y tests

**Objetivo:** resolver problemas con método, comparar soluciones y comprobar que funcionan.

**Por qué importa:** un agente puede darte una solución que funciona con 10 datos y colapsa con un millón. Los tests, además, serán la principal forma de controlar a los agentes.

## Conceptos

Un **algoritmo** es una secuencia finita y precisa de pasos para resolver un problema, como una receta sin ambigüedades.

### Cómo resolver un problema

1. **Entiende:** ¿qué entra y qué debe salir?
2. **Prueba a mano:** resuélvelo en papel con un ejemplo.
3. **Descompón:** divídelo en pasos pequeños.
4. **Escribe pseudocódigo:** los pasos en tu idioma.
5. **Programa y prueba**, incluidos los casos raros: lista vacía, un solo elemento, duplicados.

### Búsqueda

**Búsqueda lineal:** mira uno por uno. Sirve para cualquier lista.

```js
function busquedaLineal(lista, objetivo) {
  for (let i = 0; i < lista.length; i++) {
    if (lista[i] === objetivo) return i;
  }
  return -1;
}

console.log(busquedaLineal([4, 2, 9], 9)); // 2
```

**Búsqueda binaria:** en una lista **ordenada**, mira el centro y descarta la mitad donde no puede estar, como al buscar en un diccionario.

```js
function busquedaBinaria(lista, objetivo) {
  let inicio = 0;
  let fin = lista.length - 1;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    if (lista[medio] === objetivo) return medio;
    if (lista[medio] < objetivo) inicio = medio + 1;
    else fin = medio - 1;
  }
  return -1;
}

console.log(busquedaBinaria([1, 3, 5, 7, 9, 11], 7)); // 3
```

### Ordenamiento

**Inserción:** como ordenar cartas en la mano, cada elemento se ubica en su lugar entre los ya ordenados.

```js
function ordenarPorInsercion(lista) {
  const copia = [...lista];
  for (let i = 1; i < copia.length; i++) {
    const actual = copia[i];
    let j = i - 1;
    while (j >= 0 && copia[j] > actual) {
      copia[j + 1] = copia[j];
      j--;
    }
    copia[j + 1] = actual;
  }
  return copia;
}

console.log(ordenarPorInsercion([5, 2, 9, 1])); // [ 1, 2, 5, 9 ]
```

En un proyecto real usarías el método incluido en el lenguaje. Ojo: sin una función de comparación, `sort` compara como texto.

```js
console.log([10, 9, 1].sort());                // [ 1, 10, 9 ]
console.log([10, 9, 1].sort((a, b) => a - b)); // [ 1, 9, 10 ]
```

### Big O

**Big O** describe cómo crece el trabajo cuando crecen los datos.

| Notación | Nombre | Ejemplo | Con 1.000.000 de datos |
|---|---|---|---|
| `O(1)` | Constante | Leer `lista[5]` | 1 paso |
| `O(log n)` | Logarítmica | Búsqueda binaria | ~20 pasos |
| `O(n)` | Lineal | Búsqueda lineal | 1.000.000 de pasos |
| `O(n log n)` | Casi lineal | Buenos ordenamientos | ~20.000.000 de pasos |
| `O(n²)` | Cuadrática | Bucle dentro de un bucle | 1.000.000.000.000 de pasos |

Compara estas dos formas de detectar duplicados:

```js
// O(n²): cada elemento se compara con los demás
function tieneDuplicadosLento(lista) {
  for (let i = 0; i < lista.length; i++) {
    for (let j = i + 1; j < lista.length; j++) {
      if (lista[i] === lista[j]) return true;
    }
  }
  return false;
}

// O(n): un Set recuerda lo que ya se vio
function tieneDuplicadosRapido(lista) {
  const vistos = new Set();
  for (const elemento of lista) {
    if (vistos.has(elemento)) return true;
    vistos.add(elemento);
  }
  return false;
}

console.log(tieneDuplicadosLento([1, 2, 1]));  // true
console.log(tieneDuplicadosRapido([1, 2, 3])); // false
```

La versión rápida usa más memoria: casi siempre se negocia tiempo contra memoria.

### Recursión

Una función recursiva se llama a sí misma con un problema más pequeño. Necesita un **caso base** para detenerse.

```js
function factorial(n) {
  if (n <= 1) return 1;           // caso base
  return n * factorial(n - 1);    // caso recursivo
}

console.log(factorial(5)); // 120
```

Sin caso base obtendrás `RangeError: Maximum call stack size exceeded`.

### Depuración sistemática

1. **Reproduce** el error de forma confiable.
2. **Aísla:** encuentra el caso más pequeño que falla.
3. **Formula una hipótesis.**
4. **Compruébala** con `console.log` o con el depurador de VS Code (`F5` y puntos de interrupción).
5. **Corrige la causa**, no el síntoma.
6. **Agrega un test** para que no vuelva a pasar.

### Tests

Un **test** es código que comprueba que otro código hace lo esperado. Node.js incluye lo necesario.

`suma.js`:

```javascript
export const sumar = (a, b) => a + b;
```

`suma.test.js`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sumar } from './suma.js';

test('suma dos números', () => {
  assert.equal(sumar(2, 3), 5);
});

test('funciona con negativos', () => {
  assert.equal(sumar(-2, 2), 0);
});
```

Crea un `package.json` que contenga `{ "type": "module" }` y ejecuta:

```bash
node --test
```

Un buen test falla cuando el código está mal. **Compruébalo rompiendo el código a propósito:** si el test sigue pasando, no sirve.

## Laboratorio: comparar en la práctica (3 h)

1. Mide el tiempo de ambas búsquedas:

```js
const lista = Array.from({ length: 1_000_000 }, (_, i) => i);

function busquedaLineal(datos, objetivo) {
  for (let i = 0; i < datos.length; i++) {
    if (datos[i] === objetivo) return i;
  }
  return -1;
}

function busquedaBinaria(datos, objetivo) {
  let inicio = 0;
  let fin = datos.length - 1;
  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    if (datos[medio] === objetivo) return medio;
    if (datos[medio] < objetivo) inicio = medio + 1;
    else fin = medio - 1;
  }
  return -1;
}

console.time('lineal');
for (let i = 0; i < 1000; i++) busquedaLineal(lista, 999_999);
console.timeEnd('lineal');

console.time('binaria');
for (let i = 0; i < 1000; i++) busquedaBinaria(lista, 999_999);
console.timeEnd('binaria');
```

2. Escribe tests para `busquedaBinaria` con estos casos: el elemento está al inicio, al final y en el medio; no está; lista vacía; un solo elemento.
3. Cambia `inicio <= fin` por `inicio < fin`. ¿Qué test falla? ¿Por qué?

## Ejercicios

1. **Palíndromo:** determina si un texto se lee igual al revés. Hazlo con un bucle y con recursión.
2. **Más frecuente:** devuelve el elemento que más se repite en una lista. Di cuál es su Big O.
3. **Unir ordenadas:** une dos listas ordenadas en una sola, sin usar `sort`.
4. **Quitar duplicados:** hazlo en `O(n²)` y en `O(n)`, y compara el tiempo con 100.000 elementos.
5. **Caza de bugs:** pídele a la IA una función con un error sutil, sin que te lo diga. Encuéntralo con un test y explica la causa.

## Comprueba que entendiste

1. ¿Por qué la búsqueda binaria necesita una lista ordenada?
2. ¿Cómo crece el trabajo en `O(n²)` si duplicas los datos?
3. ¿Qué pasa si una función recursiva no tiene caso base?
4. ¿Cómo sabes que un test realmente comprueba algo?
5. ¿Por qué conviene reducir un error al caso más pequeño posible?

## Entregable

- [ ] Ejercicios con tests pasando en tu repositorio.
- [ ] Tabla con los tiempos medidos y tu explicación.
- [ ] Un bug documentado: síntoma, hipótesis, causa, corrección y test.
