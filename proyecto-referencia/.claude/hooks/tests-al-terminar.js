// Antes de que el agente termine, ejecuta los tests. Si fallan, lo obliga a seguir.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const evento = JSON.parse(readFileSync(0, 'utf8'));

// Si ya estamos en un reintento causado por este hook, no insistimos: evita un bucle infinito.
if (evento.stop_hook_active) process.exit(0);

const tests = spawnSync('npm', ['test', '--silent'], { encoding: 'utf8' });
if (tests.status !== 0) {
  console.error(`Los tests fallan. Corrígelos antes de terminar:\n${tests.stdout}\n${tests.stderr}`);
  process.exit(2);
}
