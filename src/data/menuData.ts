export interface Dish {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
}

export interface Category {
  id: string;
  nombre: string;
  eyebrow: string;
  descripcion: string;
  items: Dish[];
}

// Carta actualizada desde “CARTA MONKEY.xlsx”. Las imágenes se incorporarán
// en una siguiente etapa cuando el cliente entregue o apruebe el material.
export const MENU_DATA: Category[] = [
  {
    id: 'hamburguesas',
    nombre: 'Hamburguesas',
    eyebrow: 'Incluyen tomate, lechuga y papas fritas',
    descripcion: 'Hamburguesas de la casa, desde la original hasta las combinaciones más completas.',
    items: [
      { id: 'hamb-la-parrillera', nombre: 'La Parrillera', descripcion: 'Carne tradicional, queso o huevo, chorizo y salsa chimichurri.', precio: 15 },
      { id: 'hamb-la-power', nombre: 'La Power', descripcion: 'Doble carne tradicional, doble queso cheddar y doble tocino.', precio: 22 },
      { id: 'hamb-la-crunchy', nombre: 'La Crunchy - Crispy', descripcion: 'Pollo crispy, queso cheddar y salsa BBQ.', precio: 15 },
      { id: 'hamb-la-original', nombre: 'La Original', descripcion: 'Carne tradicional.', precio: 12 },
      { id: 'hamb-la-tropical', nombre: 'La Tropical - Hawaiana', descripcion: 'Carne tradicional, queso y piña.', precio: 14 },
      { id: 'hamb-la-peruana', nombre: 'La Peruana - A lo pobre', descripcion: 'Carne tradicional, huevo y plátano.', precio: 14 },
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
      { id: 'sand-deshilachado-especial', nombre: 'Deshilachado especial', descripcion: '100 g de pollo deshilachado y dos acompañamientos: plátano, huevo, tocino, queso cheddar o jamón.', precio: 13 },
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
      { id: 'broster-ala-pierna', nombre: 'Broster clásico - ala o pierna', descripcion: 'Presa broster, ensalada y papas.', precio: 10 },
      { id: 'broster-pecho-entrepierna', nombre: 'Broster clásico - pecho o entrepierna', descripcion: 'Presa broster, ensalada y papas.', precio: 13 },
      { id: 'broster-montada', nombre: 'La Montada Broster', descripcion: 'Dos alitas broster, ensalada y papas.', precio: 16 },
      { id: 'milanesa-crunch', nombre: 'Milanesa Crunch', descripcion: 'Una pieza crocante de filete de pollo con papas.', precio: 15 },
      { id: 'mostrito-ala-pierna', nombre: 'Mostrito Crunch - ala o pierna', descripcion: 'Presa broster, chaufa y papas.', precio: 16 },
      { id: 'mostrito-pecho-entrepierna', nombre: 'Mostrito Crunch - pecho o entrepierna', descripcion: 'Presa broster, chaufa y papas.', precio: 19 },
      { id: 'broster-con-salsa', nombre: 'La Broster con salsa', descripcion: 'Ala o pierna broster, ensalada, papas y salsa acevichada, BBQ o búfalo. Agrega arroz por S/ 2.00.', precio: 12 },
    ],
  },
  {
    id: 'wings',
    nombre: 'Las Wings',
    eyebrow: 'Alitas bañadas en tu salsa favorita',
    descripcion: 'Elige entre BBQ, búfalo, mango fuego, mango princesa, maracuyá, maracuyá hot, chimichurri o acevichada.',
    items: [
      { id: 'wings-clasicas', nombre: 'Las Clásicas', descripcion: 'Cinco trozos de pollo bañados en salsa y acompañados de papas crujientes.', precio: 15 },
      { id: 'wings-salchialitas', nombre: 'Salchialitas', descripcion: 'Cinco alitas del sabor que elijas, papas y salchicha frankfurter.', precio: 17 },
      { id: 'wings-mostrialitas', nombre: 'Mostrialitas', descripcion: 'Cinco alitas del sabor que elijas, papas y una porción de chaufa.', precio: 20 },
      { id: 'wings-combo', nombre: 'Combo Wings', descripcion: 'Diez trozos de alitas bañadas en salsa y acompañadas de papas crujientes.', precio: 26 },
      { id: 'wings-combo-triple', nombre: 'Combo Wings Triple', descripcion: 'Quince trozos de alitas bañadas en salsa y acompañadas de papas crujientes.', precio: 40 },
    ],
  },
  {
    id: 'criollos',
    nombre: 'Los Criollos de Casa',
    eyebrow: 'Chaufas, plancha y saltados',
    descripcion: 'Agrega huevo y plátano por S/ 3.00.',
    items: [
      { id: 'chaufa-pollo', nombre: 'Chaufa de pollo', precio: 13 },
      { id: 'chaufa-carne', nombre: 'Chaufa de carne', precio: 15 },
      { id: 'chaufa-charapa', nombre: 'Chaufa charapa', precio: 17 },
      { id: 'chaufa-broster', nombre: 'Chaufa broster', descripcion: 'Con presa de pecho o entrepierna.', precio: 22 },
      { id: 'pollo-plancha', nombre: 'Pollo a la plancha', precio: 13 },
      { id: 'lomo-pollo', nombre: 'Lomo saltado de pollo', precio: 16 },
      { id: 'lomo-carne', nombre: 'Lomo saltado de carne', precio: 18 },
    ],
  },
  {
    id: 'conos',
    nombre: 'Conos pa’ llevar',
    eyebrow: 'Prácticos, completos y listos para llevar',
    descripcion: 'Combos en cono con bebida y papas.',
    items: [
      { id: 'cono-monkey', nombre: 'Cono Monkey', descripcion: 'Cinco alitas del sabor que elijas, una bebida de limonada, fresa o piña y una porción de papas.', precio: 20 },
      { id: 'cono-salchicha', nombre: 'Cono Salchicha', descripcion: 'Porción de papas, porción de salchicha y una bebida de limonada, fresa o piña.', precio: 18 },
    ],
  },
  {
    id: 'bebidas',
    nombre: 'Bebidas',
    eyebrow: 'Frías, calientes y naturales',
    descripcion: 'Jugos, limonadas, frozen, gaseosas y bebidas calientes.',
    items: [
      { id: 'beb-jugos-clasicos', nombre: 'Jugos clásicos', descripcion: 'Piña, fresa o papaya.', precio: 7 },
      { id: 'beb-limonadas', nombre: 'Limonadas', descripcion: 'Limón, fresa o piña.', precio: 8 },
      { id: 'beb-frozen', nombre: 'Frozen', descripcion: 'Limón, fresa o maracuyá.', precio: 10 },
      { id: 'beb-especiales', nombre: 'Especiales', descripcion: 'Maracumango o hierba luisa.', precio: 11 },
      { id: 'beb-milkshake', nombre: 'Milkshake', descripcion: 'Oreo, vainilla, chocolate o fresa.', precio: 11 },
      { id: 'beb-gaseosa-600', nombre: 'Gaseosa 600 ml', descripcion: 'Inca Kola o Coca-Cola.', precio: 4 },
      { id: 'beb-gaseosa-1l', nombre: 'Gaseosa 1 L', descripcion: 'Inca Kola o Coca-Cola.', precio: 8 },
      { id: 'beb-infusiones', nombre: 'Infusiones calientes', descripcion: 'Anís, manzanilla o hierba luisa.', precio: 3.5 },
      { id: 'beb-cafe', nombre: 'Café', precio: 5 },
      { id: 'beb-agua', nombre: 'Agua 500 ml', precio: 3 },
    ],
  },
];

export const MENU_ITEMS = MENU_DATA.flatMap((category) => category.items);
