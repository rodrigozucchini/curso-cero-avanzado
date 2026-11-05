# Semana 2: Redes e internet

**Objetivo:** poder explicar, paso a paso, qué ocurre cuando abres una página web.

**Por qué importa:** casi todos los problemas de deploy y de dominio son problemas de red. Esta base te permite diagnosticarlos.

## Conceptos

### Cliente y servidor

Un **cliente** pide algo y un **servidor** responde. Tu navegador es un cliente. Un servidor es una computadora, normalmente en un centro de datos, con un programa que espera pedidos.

### Dirección IP

Cada dispositivo conectado tiene una **dirección IP**, algo así como su dirección postal.

- IPv4: `142.250.190.78`
- IPv6: `2607:f8b0:4009:80b::200e`
- `127.0.0.1`, también llamada `localhost`, es tu propia computadora.

### Puertos

La IP identifica la máquina y el **puerto** identifica el programa dentro de ella, como el número de departamento dentro de un edificio.

| Puerto | Uso habitual |
|---|---|
| 80 | HTTP |
| 443 | HTTPS |
| 22 | SSH |
| 5432 | PostgreSQL |
| 3000 | Desarrollo local (por convención) |

### DNS

Las personas recuerdan nombres y las redes usan IP. El **DNS** es la agenda que traduce `ejemplo.com` a una IP. Volveremos a verlo en la semana 9, cuando conectes tu dominio.

### TCP y paquetes

Los datos viajan divididos en **paquetes**. **TCP** se asegura de que lleguen completos y en orden, y reenvía los que se pierden.

### HTTP

**HTTP** es el idioma de la web. Una petición lleva un **método**, una ruta y, a veces, datos:

| Método | Intención |
|---|---|
| `GET` | Leer |
| `POST` | Crear o enviar |
| `PUT` / `PATCH` | Modificar |
| `DELETE` | Borrar |

La respuesta incluye un **código de estado**:

| Código | Significado | Ejemplo |
|---|---|---|
| 2xx | Todo bien | `200 OK`, `201 Created` |
| 3xx | Redirección | `301 Moved Permanently` |
| 4xx | Error del cliente | `400 Bad Request`, `404 Not Found` |
| 5xx | Error del servidor | `500 Internal Server Error` |

**Encabezados (headers):** datos adicionales de la petición o la respuesta, como el tipo de contenido.

### HTTPS

**HTTPS** es HTTP con cifrado **TLS**. Sin él, cualquiera en el camino podría leer o alterar lo que envías. El **certificado** demuestra que el servidor es realmente dueño de ese dominio.

El candado indica que la conexión está cifrada, no que el sitio sea honesto: un sitio de phishing también puede tenerlo.

### El recorrido completo

```text
Escribes ejemplo.com
  1. DNS: el nombre se traduce a una IP
  2. TCP: tu navegador se conecta a esa IP en el puerto 443
  3. TLS: verifican el certificado y acuerdan el cifrado
  4. HTTP: GET / solicita la página
  5. El servidor responde 200 con HTML
  6. El navegador lee el HTML y pide CSS, JS e imágenes
  7. El navegador dibuja la página
```

## Laboratorio 1: investiga la red (2 h)

Si falta algún comando en Ubuntu, instálalo con `sudo apt install dnsutils iputils-ping traceroute`.

```bash
# ¿Qué IP tiene este dominio?
nslookup example.com

# ¿Responde y cuánto tarda?
ping -c 4 example.com

# ¿Por dónde viajan los paquetes?
traceroute example.com

# ¿Qué responde el servidor? (-I pide solo los encabezados)
curl -I https://example.com

# Petición completa, con detalles de la conexión
curl -v https://example.com

# Observa una redirección
curl -I http://github.com
```

Algunas redes bloquean `ping` o `traceroute`. Si fallan, eso no significa que el sitio esté caído: compruébalo con `curl`.

## Laboratorio 2: DevTools (1 h)

1. Abre un sitio y presiona `F12`, luego la pestaña **Network** (Red).
2. Recarga la página y haz clic en la primera petición.
3. Anota el método, el código de estado y el tipo de contenido.
4. Cuenta cuántos archivos se descargaron en total.
5. Abre una URL inventada de ese sitio y localiza el `404`.

## Laboratorio 3: tu propio servidor (1 h)

```bash
mkdir -p ~/curso/prueba-servidor && cd ~/curso/prueba-servidor
echo "<h1>Hola desde mi servidor</h1>" > index.html
npx serve -l 3000
```

Abre `http://localhost:3000` en el navegador y observa los pedidos en la terminal. Detén el servidor con `Ctrl + C` y recarga: ya no hay nadie que responda.

Tu computadora acaba de ser un servidor. Una web pública funciona igual, en una máquina que está siempre encendida y es accesible desde internet.

## Ejercicios

1. Dibuja en papel el recorrido completo para un sitio que elijas, con su IP real.
2. Con `curl -I`, compara las respuestas de tres sitios. ¿Qué encabezados se repiten?
3. Encuentra un sitio que redirija `http` a `https` y anota el código.
4. Clasifica estos casos en 4xx o 5xx: página inexistente, base de datos caída, datos inválidos en un formulario, error en el código del servidor.

## Comprueba que entendiste

1. ¿Qué diferencia hay entre IP, puerto y dominio?
2. Tu sitio responde con `curl` a la IP, pero no con el nombre. ¿Dónde mirarías primero?
3. ¿Qué diferencia hay entre un error 404 y un 500?
4. ¿Qué protege HTTPS y qué no?
5. ¿Por qué nadie más puede abrir tu `http://localhost:3000`?

## Entregable

- [ ] Diagrama del recorrido de una petición, explicado con tus palabras.
- [ ] Notas con los resultados de `nslookup`, `curl -I` y DevTools.
- [ ] Un servidor local funcionando, y una explicación de qué pasó al detenerlo.
