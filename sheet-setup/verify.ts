import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadMenuFromSheet } from '../src/services/googleSheets';

const folder = fileURLToPath(new URL('.', import.meta.url));
const rows = Object.fromEntries(['Categorias', 'Productos'].map((name) => [
  name,
  readFileSync(join(folder, `${name}.tsv`), 'utf8').trim().split('\n').map((line) => line.split('\t')),
])) as Record<string, string[][]>;

(globalThis as any).window = globalThis;
(globalThis as any).document = {
  createElement: () => ({ src: '', remove() {} }),
  head: {
    appendChild(script: { src: string }) {
      const url = new URL(script.src);
      const name = url.searchParams.get('sheet')!;
      const callback = url.searchParams.get('tqx')!.match(/responseHandler:([^;]+)/)![1];
      const [headers, ...data] = rows[name];
      queueMicrotask(() => (globalThis as any)[callback]({
        status: 'ok',
        table: {
          cols: headers.map((label) => ({ label })),
          rows: data.map((row) => ({ c: row.map((v) => ({ v })) })),
        },
      }));
    },
  },
};

const initial = await loadMenuFromSheet();
assert.equal(initial.length, 8);
assert.equal(initial.reduce((count, category) => count + category.items.length, 0), 48);
assert.equal(initial.find((category) => category.id === 'sandwiches')?.items.find((dish) => dish.id === 'sand-deshilachado-especial')?.opciones?.length, 1);

const productRows = rows.Productos;
productRows.splice(productRows.findIndex((row) => row[0] === 'salchi-tradicional'), 1);
const power = productRows.find((row) => row[0] === 'hamb-la-power')!;
power[2] = 'La Power renovada';
power[4] = '25';
power[5] = 'https://example.com/power.jpg';
productRows.push(['plato-nuevo', 'salchipapas', 'Plato nuevo', 'Nuevo', '9.5', '/dishes/nuevo.png', '10', 'SI']);

const updated = await loadMenuFromSheet();
assert.equal(updated.reduce((count, category) => count + category.items.length, 0), 48);
assert.equal(updated.find((category) => category.id === 'salchipapas')?.items.some((dish) => dish.id === 'salchi-tradicional'), false);
assert.equal(updated.find((category) => category.id === 'salchipapas')?.items.find((dish) => dish.id === 'plato-nuevo')?.precio, 9.5);
assert.deepEqual(updated.find((category) => category.id === 'hamburguesas')?.items.find((dish) => dish.id === 'hamb-la-power'), {
  id: 'hamb-la-power',
  nombre: 'La Power renovada',
  descripcion: 'Doble carne tradicional, doble queso cheddar y doble tocino.',
  precio: 25,
  imagen: 'https://example.com/power.jpg',
  opciones: undefined,
});
console.log('Google Sheets menu mapping: OK');
