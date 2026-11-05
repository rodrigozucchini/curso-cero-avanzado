# Semana 8: Bases de datos

**Objetivo:** guardar los contactos de tu landing de forma segura.

**Por qué importa:** los errores de permisos en bases de datos exponen datos de personas reales. A menudo la web funciona perfectamente mientras la tabla está abierta a cualquiera.

## Conceptos

Una **base de datos** guarda información de forma permanente y permite consultarla con rapidez y por muchos usuarios a la vez. Las variables de un programa se pierden al terminar, y una función serverless no conserva nada entre peticiones.

### Bases relacionales

Se parecen a un conjunto de hojas de cálculo, pero con reglas estrictas.

| Término | Qué es |
|---|---|
| **Tabla** | Un tipo de entidad, como `leads` |
| **Columna** | Un atributo con un tipo, como `email` |
| **Fila** | Un registro |
| **Clave primaria** | Identificador único de cada fila |
| **Clave foránea** | Columna que apunta a una fila de otra tabla |
| **Restricción** | Regla que la base hace cumplir, como `not null` o `unique` |
| **Índice** | Estructura que acelera las búsquedas, como el índice de un libro |

### Relaciones

Una clienta puede tener muchos pedidos: es una relación **uno a muchos**. En vez de repetir sus datos en cada pedido, cada pedido guarda el `cliente_id`.

```sql
create table clientes (
  id bigint generated always as identity primary key,
  nombre text not null
);

create table pedidos (
  id bigint generated always as identity primary key,
  cliente_id bigint not null references clientes (id),
  total numeric(10, 2) not null check (total >= 0)
);
```

Los índices aplican una idea parecida a la búsqueda binaria de la semana 6: evitan revisar toda la tabla.

## Laboratorio 1: SQL (2 h)

1. Crea una cuenta en [Supabase](https://supabase.com), con 2FA, y un proyecto. Guarda la contraseña en tu gestor.
2. Abre **SQL Editor** y ejecuta las dos tablas anteriores.
3. Practica:

```sql
insert into clientes (nombre) values ('Ana'), ('Luis'), ('Marta');
insert into pedidos (cliente_id, total) values (1, 100), (1, 50), (2, 75);

-- Leer y filtrar
select nombre from clientes where nombre like 'A%';

-- Ordenar y limitar
select * from pedidos order by total desc limit 2;

-- Unir tablas
select c.nombre, p.total
from pedidos p
join clientes c on c.id = p.cliente_id;

-- Agrupar
select c.nombre, count(p.id) as pedidos, coalesce(sum(p.total), 0) as gastado
from clientes c
left join pedidos p on p.cliente_id = c.id
group by c.nombre
order by gastado desc;

-- Modificar: el WHERE es lo que limita a qué filas afecta
update clientes set nombre = 'Ana María' where id = 1;
delete from pedidos where id = 3;
```

**Precaución:** `update` o `delete` sin `where` afecta a **todas** las filas. Escribe primero el `select` con el mismo `where`, para ver qué vas a tocar.

Al terminar, limpia:

```sql
drop table pedidos;
drop table clientes;
```

## Seguridad

### Inyección SQL

Ocurre cuando un dato del usuario se pega dentro de una consulta y se ejecuta como si fuera código.

```javascript
// PELIGROSO: el usuario podría enviar  '; drop table leads; --
const consulta = `select * from leads where email = '${email}'`;

// SEGURO: el dato viaja separado de la consulta
await client.query('select * from leads where email = $1', [email]);
```

Nunca armes SQL pegando texto. Las librerías como `supabase-js` separan los datos por ti.

### Claves de Supabase

| Clave | Formato | Dónde se usa | Qué permite |
|---|---|---|---|
| **Publicable** | `sb_publishable_...` | Navegador | Solo lo que autoricen tus permisos y políticas |
| **Secreta** | `sb_secret_...` | **Solo en el servidor** | Ignora las políticas de RLS |

Tal vez veas las claves antiguas `anon` y `service_role`. Supabase las está retirando; usa las nuevas.

### Permisos y RLS

Se aplican dos capas:

1. **`grant`:** qué operaciones puede hacer cada rol sobre una tabla.
2. **Row Level Security (RLS):** qué filas puede ver o cambiar cada rol, según **políticas**.

En los proyectos actuales de Supabase, una tabla nueva no queda accesible por la API hasta que le das permisos. La API da error si falta el `grant`.

**Nuestro diseño:** el navegador no toca la base. Habla con tu función, y solo la función usa la clave secreta.

```text
Navegador --> /api/lead (valida; tiene la clave secreta) --> Supabase
     X------------- sin acceso directo ------------------> leads
```

### Datos personales

Un nombre y un email son datos personales, y hay leyes que los protegen, según el país.

- **Minimiza:** pide solo lo que vayas a usar.
- **Informa:** explica qué guardas y para qué. Lo harás en la semana 9.
- **Controla el acceso:** solo quien lo necesite.
- **Permite borrar:** ten una forma de eliminar los datos de quien lo pida.
- **No uses datos reales para pruebas.**

## Laboratorio 2: la tabla real (1 h)

Ejecuta en el SQL Editor y guarda una copia en `sql/01-leads.sql` en tu repositorio:

```sql
create table public.leads (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(nombre) between 1 and 100),
  email text not null unique check (char_length(email) <= 200),
  creado_en timestamptz not null default now()
);

-- Con RLS activo y sin políticas, las claves públicas no pueden leer ni escribir.
alter table public.leads enable row level security;

-- Solo el servidor (clave secreta = rol service_role) puede usar la tabla por la API.
grant select, insert on table public.leads to service_role;
```

Observa que `anon` y `authenticated` no reciben ningún permiso.

## Laboratorio 3: conectar la API (2 h)

```bash
npm install @supabase/supabase-js
```

Copia la URL y la clave secreta desde **Project Settings** de Supabase y guárdalas en `.env.local`:

```text
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

Confirma con `git status` que `.env.local` no aparece. Crea también un `.env.example` con los mismos nombres y sin valores reales: ese sí va a Git y sirve de guía.

Reemplaza la línea `console.log('Lead válido:', nombre);` de `api/lead.js` por este bloque:

```javascript
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } },
);

const { error } = await supabase.from('leads').insert({ nombre, email });

// 23505 es el código de Postgres para "ese valor único ya existe".
if (error && error.code !== '23505') {
  console.error('Error al guardar el lead:', error.message);
  return Response.json({ error: 'No pudimos guardar tus datos.' }, { status: 500 });
}
```

Y agrega al inicio del archivo:

```javascript
import { createClient } from '@supabase/supabase-js';
```

Observa tres decisiones de seguridad:

- El navegador recibe un mensaje genérico; el detalle queda en los logs del servidor.
- El email repetido responde como éxito, para no revelar quién está registrado.
- La clave nunca sale del servidor.

## Laboratorio 4: comprueba los permisos (1 h)

Esto es lo más importante de la semana: **intenta entrar sin permiso.** Usa tu clave **publicable**:

```bash
curl -i "https://TU-PROYECTO.supabase.co/rest/v1/leads?select=*" \
  -H "apikey: sb_publishable_..."

curl -i -X POST "https://TU-PROYECTO.supabase.co/rest/v1/leads" \
  -H "apikey: sb_publishable_..." \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Intruso","email":"intruso@ejemplo.com"}'
```

Ambas deben fallar con un error de permisos. Si alguna devuelve datos o crea una fila, **tu tabla está expuesta**: corrígelo antes de seguir.

## Laboratorio 5: copia de seguridad (30 min)

Las copias automáticas de Supabase dependen del plan: revisa qué incluye el tuyo. Exporta tus datos en CSV desde **Table Editor** y guárdalos fuera del repositorio, porque contienen datos personales.

Una copia que nunca probaste restaurar no es confiable. Importa ese CSV en una tabla de prueba y comprueba que los datos estén completos.

**Plan gratis:** Supabase pausa los proyectos gratuitos tras una semana de inactividad. Si tu formulario deja de funcionar, revisa eso primero.

## Ejercicios

1. Diseña las tablas de una tienda: productos, clientes, pedidos y detalle de pedido.
2. Escribe consultas para el cliente que más gastó y el producto más vendido.
3. Intenta insertar un email duplicado, un nombre vacío y un nombre de 200 caracteres. Anota qué restricción lo impide.
4. Agrega un índice en `leads (creado_en)` y explica cuándo ayuda.
5. Escribe la consulta para eliminar los datos de una persona que lo solicite.

## Comprueba que entendiste

1. ¿Por qué no guardar los contactos en un archivo dentro de tu función serverless?
2. ¿Qué diferencia hay entre la clave publicable y la secreta?
3. ¿Qué hace RLS y qué pasa si está activo y no hay políticas?
4. ¿Cómo se evita la inyección SQL?
5. ¿Por qué tu API responde igual cuando el email ya existe?

## Entregable

- [ ] Formulario que guarda filas reales en `leads`.
- [ ] Prueba de `curl` que demuestra que la clave publicable no accede.
- [ ] `.env.local` fuera de Git y `.env.example` dentro.
- [ ] Archivo SQL en el repositorio.
- [ ] Copia de seguridad exportada y probada.
