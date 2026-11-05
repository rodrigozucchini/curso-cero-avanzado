// Bloquea herramientas que mencionan archivos .env, salvo .env.example.
// Es una red de seguridad, no una garantía: un comando ingenioso podría esquivarla.
import { readFileSync } from 'node:fs';

const evento = JSON.parse(readFileSync(0, 'utf8'));
const { file_path = '', command = '' } = evento.tool_input ?? {};
const objetivo = `${file_path} ${command}`;

if (/(^|[\s/"'=<>])\.env(\.(?!example\b)[\w.-]+)?(?=$|[\s"';|&<>])/.test(objetivo)) {
  console.error('Bloqueado: los archivos .env tienen secretos. Usa .env.example como referencia.');
  process.exit(2); // Código 2: bloquea la herramienta y le explica el motivo al agente.
}
