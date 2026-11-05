# Especificación 001: formulario de contacto

## Objetivo
Una persona interesada deja su nombre y email para que le avisen del próximo grupo.

## Fuera de alcance
Login, panel de administración y envío de emails.

## Criterios de aceptación
- CA1: con nombre y email válidos, los datos quedan guardados en `leads` y la persona ve una confirmación.
- CA2: un email inválido responde 400 y no guarda nada.
- CA3: un nombre vacío responde 400 y no guarda nada.
- CA4: un email repetido responde igual que uno nuevo, sin revelar que ya existía, y no crea otra fila.
- CA5: si se completa el campo trampa, responde éxito y no guarda nada.
- CA6: la clave secreta no aparece en ningún archivo que llegue al navegador ni en Git.
- CA7: con la clave pública de Supabase no se puede leer ni escribir en `leads`.
