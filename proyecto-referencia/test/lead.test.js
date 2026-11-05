import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/lead.js';

const enviar = (cuerpo) =>
  handler.fetch(new Request('http://local/api/lead', {
    method: 'POST',
    body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
  }));

test('rechaza métodos distintos de POST', async () => {
  const r = await handler.fetch(new Request('http://local/api/lead'));
  assert.equal(r.status, 405);
});

test('rechaza un cuerpo que no es JSON', async () => {
  assert.equal((await enviar('{roto')).status, 400);
});

test('rechaza un nombre vacío', async () => {
  assert.equal((await enviar({ nombre: '   ', email: 'ana@ejemplo.com' })).status, 400);
});

test('rechaza un email inválido', async () => {
  assert.equal((await enviar({ nombre: 'Ana', email: 'no-es-email' })).status, 400);
});

test('finge éxito ante un bot y no toca la base de datos', async () => {
  // Sin variables de entorno, llegar a la base de datos lanzaría un error.
  const r = await enviar({ sitio: 'spam', nombre: 'Bot', email: 'bot@ejemplo.com' });
  assert.equal(r.status, 200);
});
