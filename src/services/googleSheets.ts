import { MENU_DATA, type Category, type Dish } from '../data/menuData';

export const SHEET_ID = '1bUU2g3-Rdyhhuwfa1oHJrqRDVKf2lWXJyc4be8G1tbo';

type Cell = { v?: string | number | boolean | null } | null;
type VisualizationResponse = {
  status: string;
  table?: { cols: { label: string }[]; rows: { c: Cell[] }[] };
  errors?: { detailed_message?: string; message?: string }[];
};
type SheetTable = { headers: string[]; rows: Record<string, string>[] };

let requestCount = 0;

const readSheet = (sheetName: string): Promise<SheetTable> => new Promise((resolve, reject) => {
  const callbackName = `__monkeyroll_sheet_${++requestCount}`;
  const script = document.createElement('script');
  const timeout = window.setTimeout(() => finish(new Error(`No se pudo leer ${sheetName}`)), 12000);

  const finish = (error?: Error, table?: SheetTable) => {
    window.clearTimeout(timeout);
    delete (window as unknown as Record<string, unknown>)[callbackName];
    script.remove();
    if (error) reject(error);
    else resolve(table ?? { headers: [], rows: [] });
  };

  (window as unknown as Record<string, unknown>)[callbackName] = (response: VisualizationResponse) => {
    if (response.status !== 'ok' || !response.table) {
      finish(new Error(response.errors?.[0]?.detailed_message ?? response.errors?.[0]?.message ?? `Error en ${sheetName}`));
      return;
    }
    const headers = response.table.cols.map((col) => col.label.trim().toLowerCase());
    const rows = response.table.rows.map((row) => Object.fromEntries(headers.map((header, index) => {
      const cell = row.c[index];
      return [header, cell?.v == null ? '' : String(cell.v).trim()];
    })));
    finish(undefined, { headers, rows });
  };

  script.onerror = () => finish(new Error(`No se pudo cargar ${sheetName}`));
  const tqx = `out:json;responseHandler:${callbackName}`;
  script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&headers=1&tqx=${encodeURIComponent(tqx)}&_=${Date.now()}`;
  document.head.appendChild(script);
});

const enabled = (value: string) => !['no', 'false', '0'].includes(value.trim().toLowerCase());
const order = (value: string, fallback: number) => {
  const number = Number(value);
  return value !== '' && Number.isFinite(number) ? number : fallback;
};
const imageUrl = (value: string) => {
  const url = value.trim();
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  if (/^https:\/\//i.test(url)) return url;
  return undefined;
};

export const loadMenuFromSheet = async (): Promise<Category[]> => {
  const [categories, dishes] = await Promise.all([readSheet('Categorias'), readSheet('Productos')]);
  if (!['id', 'nombre', 'descripcion', 'imagen', 'orden', 'activo'].every((column) => categories.headers.includes(column))) {
    throw new Error('La pestaña Categorias no tiene las columnas esperadas.');
  }
  if (!['id', 'categoria_id', 'nombre', 'descripcion', 'precio', 'imagen', 'orden', 'activo'].every((column) => dishes.headers.includes(column))) {
    throw new Error('La pestaña Productos no tiene las columnas esperadas.');
  }

  const existingDishes = new Map(MENU_DATA.flatMap((category) => category.items).map((dish) => [dish.id, dish]));
  const products = dishes.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.id && row.categoria_id && row.nombre && enabled(row.activo))
    .sort((a, b) => order(a.row.orden, a.index) - order(b.row.orden, b.index))
    .map(({ row }) => {
      const price = Number(row.precio.replace(',', '.'));
      if (!Number.isFinite(price) || price < 0) return null;
      const dish: Dish = {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion || undefined,
        precio: price,
        imagen: imageUrl(row.imagen),
        opciones: existingDishes.get(row.id)?.opciones,
      };
      return { categoryId: row.categoria_id, dish };
    })
    .filter((entry): entry is { categoryId: string; dish: Dish } => entry !== null);

  return categories.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.id && row.nombre && enabled(row.activo))
    .sort((a, b) => order(a.row.orden, a.index) - order(b.row.orden, b.index))
    .map(({ row }) => ({
      id: row.id,
      nombre: row.nombre,
      eyebrow: row.subtitulo ?? '',
      descripcion: row.descripcion,
      imagen: imageUrl(row.imagen),
      items: products.filter((item) => item.categoryId === row.id).map((item) => item.dish),
    }));
};
