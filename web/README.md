# Web de presentación del curso

Sitio estático, sin dependencias ni paso de compilación.

## Verla en local

```bash
cd web
npx serve -l 3000
```

## Desplegar en Vercel

**Con la terminal:**

```bash
cd web
npx vercel        # crea una preview
npx vercel --prod # publica en producción
```

**Desde GitHub:** al importar el repositorio, en **Root Directory** elige `web`. No hace falta un comando de build.

## Antes de publicar

- Si vas a vender el curso, usa un plan de Vercel que permita uso comercial: Hobby es solo para uso personal y no comercial.
- La página no tiene precio, formulario ni datos de contacto. Agrégalos si quieres recibir inscripciones. Un formulario o un servicio externo requiere ajustar la `Content-Security-Policy` de `vercel.json`.

## Fuentes

Bricolage Grotesque y Atkinson Hyperlegible, alojadas en `fonts/` bajo licencia SIL Open Font License.
