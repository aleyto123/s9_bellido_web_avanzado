# Laboratorio 09 — Desarrollo de Aplicaciones Web Avanzado

**Estudiante:** Rony Bellido  
**Tema:** Next.js, renderizado del cliente y del servidor

## FRAME — Galería de películas y series

Galería con Next.js, TypeScript y Tailwind CSS que consulta la API de OMDb.

- Página principal renderizada en el servidor con una selección de películas populares.
- Búsqueda interactiva con filtros de tipo y año, sin recargar la página.
- Paginación de resultados y detalles completos en un modal.
- Diseño adaptable a computadora y celular.
- Estados de carga, errores y búsquedas sin resultados.

## Instalación

Requisitos: Node.js 20.9 o superior y npm. El laboratorio se desarrolló con Node.js 24 y Next.js 16.

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
```

Solicitar una clave en https://www.omdbapi.com/apikey.aspx y activarla desde el correo. Editar `.env.local`:

```dotenv
OMDB_API_KEY=tu_clave_de_omdb
```

Luego ejecutar:

```powershell
npm.cmd run dev
```

Abrir http://localhost:3000. En CMD se puede usar `npm` en lugar de `npm.cmd`.

## Rutas del laboratorio

| Ruta | Actividad |
| --- | --- |
| `/` | FRAME: galería de películas y series |
| `/pokemon-csr` | Pokémon con datos obtenidos del lado del cliente |
| `/pokemon-ssr` | Pokémon con datos obtenidos del lado del servidor |
| `/weather` | Dashboard híbrido del clima |

## CSR y SSR

La portada obtiene las películas en el servidor y entrega el HTML con sus datos. La búsqueda usa `useState`, `useEffect` y `async/await` para actualizar resultados en el navegador. La ruta `/api/movies` mantiene la clave de OMDb en el servidor.

La justificación completa y los pasos de comprobación están en [RENDERIZADO.md](RENDERIZADO.md).

## Archivos excluidos

Las claves, `.env.local`, `node_modules` y `.next` no se publican. `.env.example` contiene únicamente el nombre de la variable requerida.

Datos y pósters: [OMDb](https://www.omdbapi.com/).
