# Carta editable desde Google Sheets

Hoja: https://docs.google.com/spreadsheets/d/1bUU2g3-Rdyhhuwfa1oHJrqRDVKf2lWXJyc4be8G1tbo/edit

La carta lee las pestañas `Categorias` y `Productos` al abrir o recargar la página. Los archivos TSV de esta carpeta contienen la carga inicial de la carta.

## Categorias

| Columna | Uso |
| --- | --- |
| `id` | Identificador único y estable, sin espacios. Ejemplo: `salchipapas`. |
| `nombre` | Título de la categoría. |
| `subtitulo` | Frase breve sobre el título al entrar a la categoría. |
| `descripcion` | Texto de presentación. |
| `imagen` | URL directa de imagen pública `https://...` o ruta local `/dishes/...`. |
| `orden` | Número que define la posición de la categoría. |
| `activo` | `SI` para mostrar; `NO` para ocultar. |

## Productos

| Columna | Uso |
| --- | --- |
| `id` | Identificador único y estable, sin espacios. Ejemplo: `salchi-tradicional`. |
| `categoria_id` | Debe coincidir con un `id` de `Categorias`. |
| `nombre` | Título del plato o bebida. |
| `descripcion` | Texto bajo el título. |
| `precio` | Número sin `S/`; por ejemplo `16` o `3.5`. |
| `imagen` | URL directa de imagen pública `https://...` o ruta local `/dishes/...`. |
| `orden` | Posición dentro de su categoría. |
| `activo` | `SI` para mostrar; `NO` para ocultar. |

Para añadir un plato, agrega una fila con un `id` nuevo y una `categoria_id` existente. Para quitarlo de la carta puedes poner `NO` en `activo` o eliminar su fila. Para cambiar el precio, el título o la imagen, edita la celda y recarga la web. Las personalizaciones de los productos originales siguen asociadas a su `id`; los platos nuevos se agregan como productos simples.

La web necesita acceso de lectura a la hoja. La opción directa con Google Visualization requiere compartirla como **Cualquier persona con el enlace: Lector**. Solo el propietario y las personas autorizadas en Google Sheets pueden editarla. Si la web no puede leerla, muestra la copia local incluida en el proyecto.

Las imágenes de Google Drive deben tener una URL de archivo que se pueda abrir públicamente como imagen; el enlace a la página de vista previa de Drive no sirve como URL directa. Las rutas `/dishes/...` son las imágenes ya incluidas en la web.
