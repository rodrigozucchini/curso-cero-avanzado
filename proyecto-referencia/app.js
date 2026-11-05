const formulario = document.querySelector('#formulario');
const estado = document.querySelector('#estado');
const boton = formulario.querySelector('button');
const campos = ['nombre', 'email'].map((id) => document.querySelector(`#${id}`));

// Esta validación solo ayuda a la persona. La que protege está en api/lead.js.
const primerCampoInvalido = () => {
  let primero = null;
  for (const campo of campos) {
    const valido = campo.value.trim() !== '' && campo.checkValidity();
    campo.setAttribute('aria-invalid', String(!valido));
    if (!valido && !primero) primero = campo;
  }
  return primero;
};

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // Evita que el navegador recargue la página.

  const invalido = primerCampoInvalido();
  if (invalido) {
    estado.textContent = invalido.id === 'email' ? 'Escribe un email válido.' : 'Escribe tu nombre.';
    invalido.focus();
    return;
  }

  boton.disabled = true;
  estado.textContent = 'Enviando...';

  try {
    const respuesta = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
    });
    const datos = await respuesta.json();
    estado.textContent = respuesta.ok ? '¡Listo! Te avisaremos cuando abra el próximo grupo.' : datos.error;
    if (respuesta.ok) formulario.reset();
  } catch {
    estado.textContent = 'No pudimos conectar. Revisa tu internet e intenta de nuevo.';
  } finally {
    boton.disabled = false;
  }
});
