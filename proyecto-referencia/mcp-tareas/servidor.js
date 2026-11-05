import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const tareas = [];

const servidor = new McpServer({ name: 'tareas', version: '1.0.0' });

servidor.registerTool(
  'agregar_tarea',
  {
    description: 'Agrega una tarea a la lista de pendientes.',
    inputSchema: { titulo: z.string().min(1).max(200).describe('Qué hay que hacer') },
  },
  async ({ titulo }) => {
    tareas.push(titulo);
    return { content: [{ type: 'text', text: `Agregada. Hay ${tareas.length} tarea(s).` }] };
  },
);

servidor.registerTool(
  'listar_tareas',
  { description: 'Devuelve todas las tareas pendientes.' },
  async () => ({
    content: [{ type: 'text', text: tareas.join('\n') || 'No hay tareas pendientes.' }],
  }),
);

// Por stdio, stdout lleva el protocolo: los mensajes de depuración van a stderr.
await servidor.connect(new StdioServerTransport());
console.error('Servidor MCP de tareas listo');
