export interface Dish {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  opciones?: DishOption[];
  imagen?: string;
}

export interface DishOptionChoice {
  id: string;
  nombre: string;
  precioExtra?: number;
}

export interface DishOption {
  id: string;
  nombre: string;
  tipo: 'single' | 'multiple';
  requerida?: boolean;
  minimo?: number;
  maximo?: number;
  opciones: DishOptionChoice[];
}

export interface Category {
  id: string;
  nombre: string;
  eyebrow: string;
  descripcion: string;
  items: Dish[];
}

export interface CategoryUpsell {
  id: string;
  categoryId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  opciones?: DishOption[];
  productosElegibles?: string[];
}

const SABORES_ALITAS: DishOption = {
  id: 'sabor-alitas',
  nombre: 'Elige el sabor de tus alitas',
  tipo: 'single',
  requerida: true,
  opciones: [
    { id: 'bbq', nombre: 'BBQ' },
    { id: 'bufalo', nombre: 'Búfalo' },
    { id: 'mango-fuego', nombre: 'Mango Fuego' },
    { id: 'mango-princesa', nombre: 'Mango Princesa' },
    { id: 'maracuya', nombre: 'Maracuyá' },
    { id: 'maracuya-hot', nombre: 'Maracuyá Hot' },
    { id: 'chimichurri', nombre: 'Chimichurri' },
    { id: 'acevichada', nombre: 'Acevichada' },
  ],
};

const BEBIDA_CONO: DishOption = {
  id: 'sabor-bebida',
  nombre: 'Elige el sabor de la bebida',
  tipo: 'single',
  requerida: true,
  opciones: [
    { id: 'limonada', nombre: 'Limonada' },
    { id: 'fresa', nombre: 'Fresa' },
    { id: 'pina', nombre: 'Piña' },
  ],
};

const opcionesSabor = (id: string, nombre: string, sabores: DishOptionChoice[]): DishOption => ({
  id,
  nombre,
  tipo: 'single',
  requerida: true,
  opciones: sabores,
});

const SABORES_JUGOS = [
  { id: 'fresa', nombre: 'Fresa' },
  { id: 'pina', nombre: 'Piña' },
  { id: 'papaya', nombre: 'Papaya' },
];

const SABORES_BEBIDAS = [
  { id: 'limonada', nombre: 'Limonada' },
  { id: 'maracuya', nombre: 'Maracuyá' },
];

export const CATEGORY_UPSELLS: CategoryUpsell[] = [
  {
    id: 'porcion-arroz',
    categoryId: 'pollitos-crunch',
    nombre: 'Porción de arroz',
    descripcion: 'Agrega una porción de arroz a tu pedido.',
    precio: 2,
  },
  {
    id: 'huevo-platano',
    categoryId: 'criollos',
    nombre: 'Huevo y plátano',
    descripcion: 'Agrega los 2 acompañamientos a tu plato criollo.',
    precio: 3,
  },
  {
    id: 'dos-jugos-wings',
    categoryId: 'wings',
    nombre: '2 jugos personales',
    descripcion: 'Promoción disponible con Combo Wings o Combo Wings Triple.',
    precio: 10,
    productosElegibles: ['wings-combo', 'wings-combo-triple'],
    opciones: [
      opcionesSabor('jugo-1', 'Sabor del primer jugo', SABORES_JUGOS),
      opcionesSabor('jugo-2', 'Sabor del segundo jugo', SABORES_JUGOS),
    ],
  },
  {
    id: 'dos-bebidas-wings',
    categoryId: 'wings',
    nombre: '2 bebidas personales',
    descripcion: 'Promoción disponible con Combo Wings o Combo Wings Triple.',
    precio: 12,
    productosElegibles: ['wings-combo', 'wings-combo-triple'],
    opciones: [
      opcionesSabor('bebida-1', 'Sabor de la primera bebida', SABORES_BEBIDAS),
      opcionesSabor('bebida-2', 'Sabor de la segunda bebida', SABORES_BEBIDAS),
    ],
  },
];

// Carta actualizada desde “CARTA MONKEY.xlsx”. Las imágenes se incorporarán
// en una siguiente etapa cuando el cliente entregue o apruebe el material.
export const MENU_DATA: Category[] = [
  {
    id: 'hamburguesas',
    nombre: 'Hamburguesas',
    eyebrow: 'Incluyen tomate, lechuga y papas fritas',
    descripcion: 'Hamburguesas de la casa, desde la original hasta las combinaciones más completas.',
    items: [
      {
        id: 'hamb-la-parrillera',
        nombre: 'La Parrillera',
        descripcion: 'Carne tradicional, queso o huevo, chorizo y salsa chimichurri.',
        precio: 15,
        imagen: '/dishes/la-parrillera-yellow.png',
        opciones: [{
          id: 'queso-o-huevo',
          nombre: 'Elige queso o huevo',
          tipo: 'single',
          requerida: true,
          opciones: [{ id: 'queso', nombre: 'Queso' }, { id: 'huevo', nombre: 'Huevo' }],
        }],
      },
      { id: 'hamb-la-power', nombre: 'La Power', descripcion: 'Doble carne tradicional, doble queso cheddar y doble tocino.', precio: 22, imagen: '/dishes/la-power-yellow.png' },
      { id: 'hamb-la-crunchy', nombre: 'La Crunchy - Crispy', descripcion: 'Pollo crispy, queso cheddar y salsa BBQ.', precio: 15, imagen: '/dishes/la-crunchy-yellow.png' },
      { id: 'hamb-la-original', nombre: 'La Original', descripcion: 'Carne tradicional.', precio: 12, imagen: '/dishes/la-original-yellow.png' },
      { id: 'hamb-la-tropical', nombre: 'La Tropical - Hawaiana', descripcion: 'Carne tradicional, queso y piña.', precio: 14, imagen: '/dishes/la-tropical-yellow.png' },
      { id: 'hamb-la-peruana', nombre: 'La Peruana - A lo pobre', descripcion: 'Carne tradicional, huevo y plátano.', precio: 14, imagen: '/dishes/la-peruana-yellow.png' },
    ],
  },
  {
    id: 'sandwiches',
    nombre: 'Sándwiches',
    eyebrow: 'Incluyen tomate, lechuga y papas fritas',
    descripcion: 'Filete de pollo y pollo deshilachado en versiones clásicas y especiales.',
    items: [
      { id: 'sand-chicken-grill', nombre: 'Chicken Grill', descripcion: 'Doble filete de pollo a la parrilla.', precio: 14 },
      { id: 'sand-chicken-tropical', nombre: 'Chicken Tropical', descripcion: 'Filete de pollo, piña y queso cheddar.', precio: 15 },
      { id: 'sand-deshilachado-clasico', nombre: 'Deshilachado clásico', descripcion: '100 g de pollo deshilachado.', precio: 10 },
      {
        id: 'sand-deshilachado-especial',
        nombre: 'Deshilachado especial',
        descripcion: '100 g de pollo deshilachado y dos acompañamientos: plátano, huevo, tocino, queso cheddar o jamón.',
        precio: 13,
        opciones: [{
          id: 'acompanamientos',
          nombre: 'Elige 2 acompañamientos',
          tipo: 'multiple',
          minimo: 2,
          maximo: 2,
          opciones: [
            { id: 'platano', nombre: 'Plátano' },
            { id: 'huevo', nombre: 'Huevo' },
            { id: 'tocino', nombre: 'Tocino' },
            { id: 'queso-cheddar', nombre: 'Queso cheddar' },
            { id: 'jamon', nombre: 'Jamón' },
          ],
        }],
      },
    ],
  },
  {
    id: 'salchipapas',
    nombre: 'Salchipapas',
    eyebrow: 'Papas crujientes y combinaciones de la casa',
    descripcion: 'Salchicha frankfurter con papas y el complemento que mejor le queda al antojo.',
    items: [
      { id: 'salchi-tradicional', nombre: 'La Tradicional', descripcion: 'Salchicha frankfurter y papas.', precio: 13 },
      { id: 'salchi-pollo', nombre: 'La Salchipollo', descripcion: 'Salchicha frankfurter, papas y trozos crujientes de pollo.', precio: 16 },
      { id: 'salchi-pobre', nombre: 'A lo pobre', descripcion: 'Salchicha frankfurter, papas, doble huevo y plátano.', precio: 16 },
      { id: 'salchi-carnivora', nombre: 'La Carnívora', descripcion: 'Salchicha frankfurter, papas, doble tocino y chorizo.', precio: 17 },
      { id: 'salchi-burguer', nombre: 'La Burguer', descripcion: 'Salchicha frankfurter, papas y hamburguesa en trozos.', precio: 20 },
      { id: 'salchi-charapa', nombre: 'La Charapa', descripcion: 'Salchicha frankfurter, papas, chorizo amazónico y plátano.', precio: 20 },
    ],
  },
  {
    id: 'pollitos-crunch',
    nombre: 'Pollitos Crunch',
    eyebrow: 'Pollo crocante con acompañamientos',
    descripcion: 'Broster y filetes crocantes servidos con papas, ensalada o chaufa.',
    items: [
      {
        id: 'broster-ala-pierna',
        nombre: 'Broster clásico - ala o pierna',
        descripcion: 'Presa broster, ensalada y papas.',
        precio: 10,
        opciones: [{ id: 'presa', nombre: 'Elige tu presa', tipo: 'single', requerida: true, opciones: [{ id: 'ala', nombre: 'Ala' }, { id: 'pierna', nombre: 'Pierna' }] }],
      },
      {
        id: 'broster-pecho-entrepierna',
        nombre: 'Broster clásico - pecho o entrepierna',
        descripcion: 'Presa broster, ensalada y papas.',
        precio: 13,
        opciones: [{ id: 'presa', nombre: 'Elige tu presa', tipo: 'single', requerida: true, opciones: [{ id: 'pecho', nombre: 'Pecho' }, { id: 'entrepierna', nombre: 'Entrepierna' }] }],
      },
      { id: 'broster-montada', nombre: 'La Montada Broster', descripcion: 'Dos alitas broster, ensalada y papas.', precio: 16 },
      { id: 'milanesa-crunch', nombre: 'Milanesa Crunch', descripcion: 'Una pieza crocante de filete de pollo con papas.', precio: 15 },
      {
        id: 'mostrito-ala-pierna',
        nombre: 'Mostrito Crunch - ala o pierna',
        descripcion: 'Presa broster, chaufa y papas.',
        precio: 16,
        opciones: [{ id: 'presa', nombre: 'Elige tu presa', tipo: 'single', requerida: true, opciones: [{ id: 'ala', nombre: 'Ala' }, { id: 'pierna', nombre: 'Pierna' }] }],
      },
      {
        id: 'mostrito-pecho-entrepierna',
        nombre: 'Mostrito Crunch - pecho o entrepierna',
        descripcion: 'Presa broster, chaufa y papas.',
        precio: 19,
        imagen: '/dishes/mostrito-pecho.png',
        opciones: [{ id: 'presa', nombre: 'Elige tu presa', tipo: 'single', requerida: true, opciones: [{ id: 'pecho', nombre: 'Pecho' }, { id: 'entrepierna', nombre: 'Entrepierna' }] }],
      },
      {
        id: 'broster-con-salsa',
        nombre: 'La Broster con salsa',
        descripcion: 'Ala o pierna broster, ensalada, papas y salsa acevichada, BBQ o búfalo. Agrega arroz por S/ 2.00.',
        precio: 12,
        opciones: [
          { id: 'presa', nombre: 'Elige tu presa', tipo: 'single', requerida: true, opciones: [{ id: 'ala', nombre: 'Ala' }, { id: 'pierna', nombre: 'Pierna' }] },
          { id: 'salsa', nombre: 'Elige tu salsa', tipo: 'single', requerida: true, opciones: [{ id: 'acevichada', nombre: 'Acevichada' }, { id: 'bbq', nombre: 'BBQ' }, { id: 'bufalo', nombre: 'Búfalo' }] },
        ],
      },
    ],
  },
  {
    id: 'wings',
    nombre: 'Las Wings',
    eyebrow: 'Alitas bañadas en tu salsa favorita',
    descripcion: 'Elige entre BBQ, búfalo, mango fuego, mango princesa, maracuyá, maracuyá hot, chimichurri o acevichada.',
    items: [
      { id: 'wings-clasicas', nombre: 'Las Clásicas', descripcion: 'Cinco trozos de pollo bañados en salsa y acompañados de papas crujientes.', precio: 15, opciones: [SABORES_ALITAS], imagen: '/dishes/acevichadas.png' },
      { id: 'wings-salchialitas', nombre: 'Salchialitas', descripcion: 'Cinco alitas del sabor que elijas, papas y salchicha frankfurter.', precio: 17, opciones: [SABORES_ALITAS], imagen: '/dishes/wings-salchialitas-yellow.png' },
      { id: 'wings-mostrialitas', nombre: 'Mostrialitas', descripcion: 'Cinco alitas del sabor que elijas, papas y una porción de chaufa.', precio: 20, opciones: [SABORES_ALITAS], imagen: '/dishes/wings-mostrialitas-yellow.png' },
      { id: 'wings-combo', nombre: 'Combo Wings', descripcion: 'Diez trozos de alitas bañadas en salsa y acompañadas de papas crujientes.', precio: 26, opciones: [SABORES_ALITAS], imagen: '/dishes/wings-combo-yellow.png' },
      { id: 'wings-combo-triple', nombre: 'Combo Wings Triple', descripcion: 'Quince trozos de alitas bañadas en salsa y acompañadas de papas crujientes.', precio: 40, opciones: [SABORES_ALITAS], imagen: '/dishes/wings-combo-triple-yellow.png' },
    ],
  },
  {
    id: 'criollos',
    nombre: 'Los Criollos de Casa',
    eyebrow: 'Chaufas, plancha y saltados',
    descripcion: 'Agrega huevo y plátano por S/ 3.00.',
    items: [
      { id: 'chaufa-pollo', nombre: 'Chaufa de pollo', precio: 13, imagen: '/dishes/chaufa-pollo-yellow.png' },
      { id: 'chaufa-carne', nombre: 'Chaufa de carne', precio: 15, imagen: '/dishes/chaufa-carne-yellow.png' },
      { id: 'chaufa-charapa', nombre: 'Chaufa charapa', precio: 17, imagen: '/dishes/chaufa-charapa-yellow.png' },
      { id: 'chaufa-broster', nombre: 'Chaufa broster', descripcion: 'Con presa de pecho o entrepierna.', precio: 22, imagen: '/dishes/chaufa-broster-yellow.png', opciones: [{ id: 'presa', nombre: 'Elige tu presa', tipo: 'single', requerida: true, opciones: [{ id: 'pecho', nombre: 'Pecho' }, { id: 'entrepierna', nombre: 'Entrepierna' }] }] },
      { id: 'pollo-plancha', nombre: 'Pollo a la plancha', precio: 13, imagen: '/dishes/pollo-plancha-yellow.png' },
      { id: 'lomo-pollo', nombre: 'Lomo saltado de pollo', precio: 16, imagen: '/dishes/lomo-pollo-yellow.png' },
      { id: 'lomo-carne', nombre: 'Lomo saltado de carne', precio: 18, imagen: '/dishes/lomo-carne-yellow.png' },
    ],
  },
  {
    id: 'conos',
    nombre: 'Conos pa’ llevar',
    eyebrow: 'Prácticos, completos y listos para llevar',
    descripcion: 'Combos en cono con bebida y papas.',
    items: [
      { id: 'cono-monkey', nombre: 'Cono Monkey', descripcion: 'Cinco alitas del sabor que elijas, una bebida de limonada, fresa o piña y una porción de papas.', precio: 20, opciones: [SABORES_ALITAS, BEBIDA_CONO] },
      { id: 'cono-salchicha', nombre: 'Cono Salchicha', descripcion: 'Porción de papas, porción de salchicha y una bebida de limonada, fresa o piña.', precio: 18, opciones: [BEBIDA_CONO] },
    ],
  },
  {
    id: 'bebidas',
    nombre: 'Bebidas',
    eyebrow: 'Frías, calientes y naturales',
    descripcion: 'Jugos, limonadas, frozen, gaseosas y bebidas calientes.',
    items: [
      { id: 'beb-jugos-clasicos', nombre: 'Jugos clásicos', descripcion: 'Piña, fresa o papaya.', precio: 7, opciones: [{ id: 'sabor', nombre: 'Elige un sabor', tipo: 'single', requerida: true, opciones: [{ id: 'pina', nombre: 'Piña' }, { id: 'fresa', nombre: 'Fresa' }, { id: 'papaya', nombre: 'Papaya' }] }] },
      { id: 'beb-limonadas', nombre: 'Limonadas', descripcion: 'Limón, fresa o piña.', precio: 8, imagen: '/dishes/limonada-fresa-1l.png', opciones: [{ id: 'sabor', nombre: 'Elige un sabor', tipo: 'single', requerida: true, opciones: [{ id: 'limon', nombre: 'Limón' }, { id: 'fresa', nombre: 'Fresa' }, { id: 'pina', nombre: 'Piña' }] }] },
      { id: 'beb-frozen', nombre: 'Frozen', descripcion: 'Limón, fresa o maracuyá.', precio: 10, opciones: [{ id: 'sabor', nombre: 'Elige un sabor', tipo: 'single', requerida: true, opciones: [{ id: 'limon', nombre: 'Limón' }, { id: 'fresa', nombre: 'Fresa' }, { id: 'maracuya', nombre: 'Maracuyá' }] }] },
      { id: 'beb-especiales', nombre: 'Especiales', descripcion: 'Maracumango o hierba luisa.', precio: 11, opciones: [{ id: 'sabor', nombre: 'Elige un sabor', tipo: 'single', requerida: true, opciones: [{ id: 'maracumango', nombre: 'Maracumango' }, { id: 'hierba-luisa', nombre: 'Hierba luisa' }] }] },
      { id: 'beb-milkshake', nombre: 'Milkshake', descripcion: 'Oreo, vainilla, chocolate o fresa.', precio: 11, opciones: [{ id: 'sabor', nombre: 'Elige un sabor', tipo: 'single', requerida: true, opciones: [{ id: 'oreo', nombre: 'Oreo' }, { id: 'vainilla', nombre: 'Vainilla' }, { id: 'chocolate', nombre: 'Chocolate' }, { id: 'fresa', nombre: 'Fresa' }] }] },
      { id: 'beb-gaseosa-600', nombre: 'Gaseosa 600 ml', descripcion: 'Inca Kola o Coca-Cola.', precio: 4, imagen: '/dishes/gaseosa-600-yellow.png', opciones: [{ id: 'gaseosa', nombre: 'Elige tu gaseosa', tipo: 'single', requerida: true, opciones: [{ id: 'inka-kola', nombre: 'Inka Kola' }, { id: 'coca-cola', nombre: 'Coca-Cola' }] }] },
      { id: 'beb-gaseosa-1l', nombre: 'Gaseosa 1 L', descripcion: 'Inca Kola o Coca-Cola.', precio: 8, imagen: '/dishes/gaseosa-1l-yellow.png', opciones: [{ id: 'gaseosa', nombre: 'Elige tu gaseosa', tipo: 'single', requerida: true, opciones: [{ id: 'inka-kola', nombre: 'Inka Kola' }, { id: 'coca-cola', nombre: 'Coca-Cola' }] }] },
      { id: 'beb-infusiones', nombre: 'Infusiones calientes', descripcion: 'Anís, manzanilla o hierba luisa.', precio: 3.5, imagen: '/dishes/infusiones-calientes-yellow.png', opciones: [{ id: 'sabor', nombre: 'Elige una infusión', tipo: 'single', requerida: true, opciones: [{ id: 'anis', nombre: 'Anís' }, { id: 'manzanilla', nombre: 'Manzanilla' }, { id: 'hierba-luisa', nombre: 'Hierba luisa' }] }] },
      { id: 'beb-cafe', nombre: 'Café', precio: 5, imagen: '/dishes/cafe-yellow.png' },
      { id: 'beb-agua', nombre: 'Agua 500 ml', precio: 3, imagen: '/dishes/agua-500-yellow.png' },
    ],
  },
];

export const MENU_ITEMS = MENU_DATA.flatMap((category) => category.items);
