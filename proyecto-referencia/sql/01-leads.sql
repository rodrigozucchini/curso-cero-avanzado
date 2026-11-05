-- Tabla de personas interesadas en la landing.
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
