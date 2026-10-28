import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MENU_DATA } from '../src/data/menuData';

const folder = dirname(fileURLToPath(import.meta.url));
mkdirSync(folder, { recursive: true });
const tsv = (rows: (string | number)[][]) => rows
  .map((row) => row.map((value) => String(value).replace(/[\t\r\n]/g, ' ')).join('\t'))
  .join('\n');

const categories = [
  ['id', 'nombre', 'subtitulo', 'descripcion', 'imagen', 'orden', 'activo'],
  ...MENU_DATA.map((category, index) => [
    category.id, category.nombre, category.eyebrow, category.descripcion,
    category.imagen ?? '', index + 1, 'SI',
  ]),
];

const products = [
  ['id', 'categoria_id', 'nombre', 'descripcion', 'precio', 'imagen', 'orden', 'activo'],
  ...MENU_DATA.flatMap((category) => category.items.map((dish, index) => [
    dish.id, category.id, dish.nombre, dish.descripcion ?? '',
    dish.precio, dish.imagen ?? '', index + 1, 'SI',
  ])),
];

writeFileSync(join(folder, 'Categorias.tsv'), tsv(categories), 'utf8');
writeFileSync(join(folder, 'Productos.tsv'), tsv(products), 'utf8');
