# Galería de películas y series

## Cómo ejecutar

En PowerShell: `npm.cmd run dev`. Abrir http://localhost:3000.
La clave de ejemplo del laboratorio está en `.env.local`, que está excluido de Git. Para usar tu propia clave gratuita, solicítala en https://www.omdbapi.com/apikey.aspx, actívala desde tu correo y cambia `OMDB_API_KEY`. Reinicia el servidor al cambiarla. No se ha creado una cuenta nueva: se utiliza la clave proporcionada en la guía.

## Justificación para el laboratorio

Usé SSR en la página principal porque la lista de películas ya llega con sus datos cuando se muestra la página. El servidor consulta una selección de títulos populares por su ID; OMDb no ofrece un ranking de popularidad. La función connection() garantiza que la página se prepare al recibir una visita.

Usé CSR en la búsqueda porque permite escribir, cambiar los filtros y ver resultados sin recargar la página. useState guarda la búsqueda, los resultados y los estados de carga. useEffect consulta los datos cuando cambia la búsqueda, con una espera de 450 ms para no gastar peticiones por cada tecla y cancelación de solicitudes anteriores.

Los detalles se abren en un modal en la misma página. Se consulta el ID con plot=full para obtener la información completa disponible. El modal admite Escape, cierre con botón y clic fuera, y conserva el foco con el elemento dialog nativo.

Las peticiones del navegador van a /api/movies. Esa ruta consulta OMDb para mantener la clave en el servidor; la búsqueda sigue siendo interactiva del lado del cliente. Los errores, búsquedas sin resultados y pósters no disponibles tienen estados propios. Los resultados tienen paginación y filtros de tipo y año.

## Comprobación en el navegador

1. Abrir la página principal y comprobar los títulos en el código fuente.
2. En Network → Fetch/XHR, buscar Batman; aparece una petición a /api/movies sin recarga del documento.
3. Cambiar a series y buscar Sherlock; probar el año y la paginación.
4. Abrir una tarjeta, comprobar detalles, cerrar con Escape y volver a buscar.
5. Probar una búsqueda sin resultados y la presentación en pantalla móvil.

Fuentes: https://www.omdbapi.com/ y https://nextjs.org/docs/app/api-reference/functions/connection
