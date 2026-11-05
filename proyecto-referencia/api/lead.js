import { createClient } from '@supabase/supabase-js';

const responder = (cuerpo, status) => Response.json(cuerpo, { status });

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return responder({ error: 'Método no permitido.' }, 405);
    }

    let datos;
    try {
      datos = await request.json();
    } catch {
      return responder({ error: 'El formato de los datos no es válido.' }, 400);
    }

    // Trampa para bots: fingimos éxito y no guardamos nada.
    if (datos.sitio) return responder({ ok: true }, 200);

    // Nunca confíes en lo que llega del navegador: se valida otra vez aquí.
    const nombre = String(datos.nombre ?? '').trim();
    const email = String(datos.email ?? '').trim().toLowerCase();

    if (nombre.length < 1 || nombre.length > 100) {
      return responder({ error: 'Escribe un nombre de hasta 100 caracteres.' }, 400);
    }
    if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return responder({ error: 'Escribe un email válido.' }, 400);
    }

    // La clave secreta solo existe en el servidor (variable de entorno).
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
      { auth: { persistSession: false } },
    );

    const { error } = await supabase.from('leads').insert({ nombre, email });

    // 23505 es el código de Postgres para "ese valor único ya existe".
    if (error && error.code !== '23505') {
      console.error('Error al guardar el lead:', error.message);
      return responder({ error: 'No pudimos guardar tus datos. Intenta más tarde.' }, 500);
    }

    // Si el email ya estaba, respondemos igual para no revelar quién se registró.
    return responder({ ok: true }, 201);
  },
};
