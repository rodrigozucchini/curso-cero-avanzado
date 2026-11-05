import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (archivo) => readFileSync(new URL(`../${archivo}`, import.meta.url), 'utf8');
const inicio = leer('index.html');

test('todos los enlaces internos apuntan a una sección que existe', () => {
  const destinos = [...inicio.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  assert.ok(destinos.length > 0);
  for (const destino of destinos) {
    assert.ok(inicio.includes(`id="${destino}"`), `Falta la sección #${destino}`);
  }
});

test('hay un solo h1 y cada campo visible tiene su etiqueta', () => {
  assert.equal(inicio.match(/<h1[\s>]/g).length, 1);
  for (const [, id] of inicio.matchAll(/<input id="([^"]+)"/g)) {
    assert.ok(inicio.includes(`<label for="${id}"`), `Falta la etiqueta de ${id}`);
  }
});

test('ningún archivo público contiene una clave secreta (CA6)', () => {
  for (const archivo of ['index.html', 'privacidad.html', '404.html', 'app.js', 'styles.css']) {
    assert.doesNotMatch(leer(archivo), /sb_secret_|SUPABASE_SECRET_KEY/, archivo);
  }
});

test('la página no usa estilos ni scripts en línea, que bloquearía la CSP', () => {
  assert.doesNotMatch(inicio, /<style|\sstyle="|\son[a-z]+="|<script(?![^>]*\ssrc=)/);
});
