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

// Contenido recuperado de la carta pública de Monkeyroll. Las imágenes de cada
// producto se incorporarán cuando el cliente entregue el material fotográfico.
export const MENU_DATA: Category[] = [
  {
    id: "hamburguesas",
    nombre: "Hamburguesas",
    eyebrow: "Hechas al momento",
    descripcion: "Clásicas, contundentes y con ese toque que solo Monkeyroll sabe darle.",
    items: [
      { id: "hamb-carne-casera", nombre: "Carne casera", precio: 10.5 },
      { id: "hamb-pollo-deshilachado", nombre: "Pollo deshilachado", precio: 10 },
      { id: "hamb-chorizo", nombre: "Hamburguesa de chorizo", precio: 10 },
      { id: "hamb-pollo", nombre: "Hamburguesa de pollo", precio: 9.5 },
    ],
  },
  {
    id: "royal",
    nombre: "Royal",
    eyebrow: "Sube de nivel",
    descripcion: "Nuestras hamburguesas en su versión más atrevida y completa.",
    items: [
      { id: "royal-carne-casera", nombre: "Royal carne casera", precio: 15 },
      { id: "royal-pollo-deshilachado", nombre: "Royal pollo deshilachado", precio: 14 },
      { id: "royal-pollo", nombre: "Royal de pollo", precio: 14 },
      { id: "royal-chorizo", nombre: "Royal de chorizo", precio: 14.5 },
    ],
  },
  {
    id: "platos",
    nombre: "Platos a la carta",
    eyebrow: "Sazón peruana",
    descripcion: "Para cuando el antojo pide plato, cuchara y cero medias tintas.",
    items: [
      {
        id: "chaufa-pollo",
        nombre: "Chaufa de pollo",
        descripcion: "Arroz salteado al wok con pollo y el sabor intenso de la casa.",
        precio: 15,
      },
    ],
  },
  {
    id: "salchipapas",
    nombre: "Salchipapas",
    eyebrow: "Para compartir... o no",
    descripcion: "Papas doradas, buenas combinaciones y el permiso oficial para ensuciarse las manos.",
    items: [
      { id: "salchi-clasica", nombre: "Clásica", precio: 11.5 },
      {
        id: "salchi-mixta",
        nombre: "Mixta",
        descripcion: "Hot dog, chorizo y morcilla.",
        precio: 14,
      },
      { id: "salchi-chorizo", nombre: "Salchi chorizo", precio: 14 },
      {
        id: "salchi-royal",
        nombre: "Salchi Royal",
        descripcion: "Hot dog, huevo, queso y tocino.",
        precio: 17,
      },
      {
        id: "salchi-pollo",
        nombre: "Salchi pollo",
        descripcion: "Hot dog y pollo deshilachado.",
        precio: 16,
      },
    ],
  },
];

export const MENU_ITEMS = MENU_DATA.flatMap((category) => category.items);
