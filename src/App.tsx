import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Camera,
  Instagram,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { CATEGORY_UPSELLS, MENU_DATA, type Dish, type DishOption } from './data/menuData';

const WHATSAPP_NUMBER = '51957669038';
const INSTAGRAM_URL = 'https://www.instagram.com/monkeyrollperu/';
const MAPS_URL = 'https://www.google.com/maps/place/Monkeyroll/@-11.985699,-76.841749,1851m/data=!3m1!1e3!4m6!3m5!1s0x9105c33838b74247:0x8d4424dd7d3e1518!8m2!3d-11.9871569!4d-76.8354301!16s%2Fg%2F11p5ml7x56!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkyNy4xIKXMDSoASAFQAw%3D%3D';
const MAP_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21809.05114670971!2d-76.81351747747055!3d-11.972918849295421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c33838b74247%3A0x8d4424dd7d3e1518!2sMonkeyroll!5e1!3m2!1ses!2spe!4v1790729257953!5m2!1ses!2spe';

interface CartSelection {
  label: string;
  values: string[];
}

interface CartExtra {
  id: string;
  nombre: string;
  precio: number;
  selections: CartSelection[];
}

interface CartItem {
  key: string;
  dishId: string;
  categoryId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  selections: CartSelection[];
  extras: CartExtra[];
  nota?: string;
}

const money = (value: number) => `S/ ${value.toFixed(2)}`;

const resolveSelections = (options: DishOption[] | undefined, selected: Record<string, string[]>) => (
  (options ?? []).flatMap((option) => {
    const values = (selected[option.id] ?? [])
      .map((choiceId) => option.opciones.find((choice) => choice.id === choiceId)?.nombre)
      .filter((value): value is string => Boolean(value));
    return values.length ? [{ label: option.nombre, values }] : [];
  })
);

const optionExtraPrice = (options: DishOption[] | undefined, selected: Record<string, string[]>) => (
  (options ?? []).reduce((sum, option) => sum + (selected[option.id] ?? []).reduce(
    (optionSum, choiceId) => optionSum + (option.opciones.find((choice) => choice.id === choiceId)?.precioExtra ?? 0),
    0,
  ), 0)
);

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [configuringDish, setConfiguringDish] = useState<Dish | null>(null);
  const [configuringCategoryId, setConfiguringCategoryId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [selectedUpsells, setSelectedUpsells] = useState<Record<string, Record<string, string[]>>>({});
  const [note, setNote] = useState('');
  const [configurationError, setConfigurationError] = useState('');
  const [pickupSelected, setPickupSelected] = useState(false);
  const [customer, setCustomer] = useState({ nombre: '', apellido: '', telefono: '' });
  const [customerError, setCustomerError] = useState('');

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.cantidad, 0),
    [cartItems],
  );

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cartItems],
  );

  const selectedCategory = useMemo(
    () => MENU_DATA.find((category) => category.id === selectedCategoryId) ?? null,
    [selectedCategoryId],
  );

  const configuratorUpsells = useMemo(() => {
    if (!configuringDish || !configuringCategoryId) return [];
    return CATEGORY_UPSELLS.filter((upsell) => (
      upsell.categoryId === configuringCategoryId
      && (!upsell.productosElegibles || upsell.productosElegibles.includes(configuringDish.id))
    ));
  }, [configuringCategoryId, configuringDish]);

  const customerReady = useMemo(() => (
    pickupSelected
    && customer.nombre.trim().length > 1
    && customer.apellido.trim().length > 1
    && customer.telefono.replace(/\D/g, '').length >= 7
  ), [customer, pickupSelected]);

  useEffect(() => {
    if (!cartOpen && !configuringDish) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (configuringDish) setConfiguringDish(null);
      else setCartOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [cartOpen, configuringDish]);

  const changeQuantity = (key: string, delta: number) => {
    setCartItems((current) => current
      .map((item) => item.key === key ? { ...item, cantidad: item.cantidad + delta } : item)
      .filter((item) => item.cantidad > 0));
  };

  const closeConfigurator = () => {
    setConfiguringDish(null);
    setConfiguringCategoryId(null);
    setSelections({});
    setSelectedUpsells({});
    setNote('');
    setConfigurationError('');
  };

  const addConfiguredDish = (
    dish: Dish,
    selected: Record<string, string[]>,
    itemNote: string,
    categoryId: string,
    extras: CartExtra[] = [],
  ) => {
    const resolvedSelections = resolveSelections(dish.opciones, selected);
    const extraPrice = optionExtraPrice(dish.opciones, selected) + extras.reduce((sum, extra) => sum + extra.precio, 0);
    const cleanNote = itemNote.trim();
    const key = JSON.stringify([dish.id, selected, cleanNote, extras]);

    setCartItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...current, {
        key,
        dishId: dish.id,
        categoryId,
        nombre: dish.nombre,
        precio: dish.precio + extraPrice,
        cantidad: 1,
        selections: resolvedSelections,
        extras,
        nota: cleanNote || undefined,
      }];
    });
    setAddedItem(dish.nombre);
    window.setTimeout(() => setAddedItem(null), 1700);
  };

  const openConfigurator = (dish: Dish, categoryId: string) => {
    const notesAllowed = categoryId !== 'bebidas';
    if (!dish.opciones?.length && !notesAllowed) {
      addConfiguredDish(dish, {}, '', categoryId);
      return;
    }
    setConfiguringDish(dish);
    setConfiguringCategoryId(categoryId);
    setSelections({});
    setSelectedUpsells({});
    setNote('');
    setConfigurationError('');
  };

  const toggleChoice = (optionId: string, choiceId: string, type: 'single' | 'multiple', maximo?: number) => {
    setSelections((current) => {
      const chosen = current[optionId] ?? [];
      if (type === 'single') return { ...current, [optionId]: [choiceId] };
      if (chosen.includes(choiceId)) return { ...current, [optionId]: chosen.filter((id) => id !== choiceId) };
      if (maximo && chosen.length >= maximo) return current;
      return { ...current, [optionId]: [...chosen, choiceId] };
    });
    setConfigurationError('');
  };

  const toggleUpsell = (upsellId: string) => {
    setSelectedUpsells((current) => {
      if (Object.prototype.hasOwnProperty.call(current, upsellId)) {
        const next = { ...current };
        delete next[upsellId];
        return next;
      }
      return { ...current, [upsellId]: {} };
    });
    setConfigurationError('');
  };

  const toggleUpsellChoice = (
    upsellId: string,
    optionId: string,
    choiceId: string,
    type: 'single' | 'multiple',
    maximo?: number,
  ) => {
    setSelectedUpsells((current) => {
      const upsellSelections = current[upsellId] ?? {};
      const chosen = upsellSelections[optionId] ?? [];
      let nextChosen: string[];
      if (type === 'single') nextChosen = [choiceId];
      else if (chosen.includes(choiceId)) nextChosen = chosen.filter((id) => id !== choiceId);
      else if (maximo && chosen.length >= maximo) return current;
      else nextChosen = [...chosen, choiceId];
      return {
        ...current,
        [upsellId]: { ...upsellSelections, [optionId]: nextChosen },
      };
    });
    setConfigurationError('');
  };

  const confirmConfiguration = () => {
    if (!configuringDish) return;
    const missingOption = (configuringDish.opciones ?? []).find((option) => {
      const selectedCount = selections[option.id]?.length ?? 0;
      const minimum = option.minimo ?? (option.requerida ? 1 : 0);
      return selectedCount < minimum;
    });
    if (missingOption) {
      setConfigurationError(`Completa: ${missingOption.nombre}.`);
      return;
    }

    const incompleteUpsell = configuratorUpsells.find((upsell) => {
      const upsellSelections = selectedUpsells[upsell.id];
      if (!upsellSelections) return false;
      return (upsell.opciones ?? []).some((option) => {
        const selectedCount = upsellSelections[option.id]?.length ?? 0;
        const minimum = option.minimo ?? (option.requerida ? 1 : 0);
        return selectedCount < minimum;
      });
    });
    if (incompleteUpsell) {
      setConfigurationError(`Completa las opciones de: ${incompleteUpsell.nombre}.`);
      return;
    }

    const extras = configuratorUpsells.flatMap((upsell): CartExtra[] => {
      const upsellSelections = selectedUpsells[upsell.id];
      if (!upsellSelections) return [];
      return [{
        id: upsell.id,
        nombre: upsell.nombre,
        precio: upsell.precio + optionExtraPrice(upsell.opciones, upsellSelections),
        selections: resolveSelections(upsell.opciones, upsellSelections),
      }];
    });

    addConfiguredDish(
      configuringDish,
      selections,
      note,
      configuringCategoryId ?? '',
      extras,
    );
    closeConfigurator();
  };

  const sendOrder = () => {
    if (!cartItems.length) return;
    if (!customerReady) {
      setCustomerError('Selecciona recojo en tienda y completa nombre, apellido y teléfono.');
      return;
    }
    const lines = cartItems.flatMap((item) => {
      const details = item.selections.map((selection) => `   ${selection.label}: ${selection.values.join(', ')}`);
      item.extras.forEach((extra) => {
        details.push(`   + ${extra.nombre} — ${money(extra.precio)}`);
        extra.selections.forEach((selection) => {
          details.push(`      ${selection.label}: ${selection.values.join(', ')}`);
        });
      });
      if (item.nota) details.push(`   Nota: ${item.nota}`);
      return [`• ${item.cantidad} × ${item.nombre} — ${money(item.precio * item.cantidad)}`, ...details];
    });
    const message = [
      '*Hola Monkeyroll, quiero hacer este pedido:*',
      '',
      '*Datos para el recojo:*',
      `Nombre: ${customer.nombre.trim()} ${customer.apellido.trim()}`,
      `Teléfono: ${customer.telefono.trim()}`,
      '',
      ...lines,
      '',
      `*Total: ${money(total)}*`,
      '*Modalidad: Recoger en tienda*',
      '',
      '¿Me confirman disponibilidad y tiempo de recojo? 🙌',
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const goToCategory = (id: string) => {
    setSelectedCategoryId(id);
    window.requestAnimationFrame(() => {
      document.getElementById('category-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const showCategories = () => {
    setSelectedCategoryId(null);
    window.requestAnimationFrame(() => {
      document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="site-shell">
      <header className="topbar" id="inicio">
        <a className="brand" href="#inicio" aria-label="Volver al inicio de Monkeyroll">
          <img src="/monkeyroll-logo-header.png" alt="Monkeyroll" />
        </a>
      </header>

      <div className="marquee" aria-label="Sabores de Monkeyroll">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((item) => (
            <span key={item}>
              SABOR SIN JAULA <i>•</i> HAMBURGUESAS CON ACTITUD <i>•</i> ALITAS CON ACTITUD <i>•</i>
            </span>
          ))}
        </div>
      </div>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={15} /> Hecho al momento</p>
            <h1 id="hero-title">Sabor que se sale <em>de la jaula.</em></h1>
            <div className="hero-description-row">
              <p className="hero-description">
                Hamburguesas, salchipapas, alitas y clásicos peruanos hechos para atacar el antojo sin pedir permiso.
              </p>
              <div className="hero-stamp" aria-hidden="true">
                <span>100%</span>
                <small>ANTOJO</small>
              </div>
            </div>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver la carta <ArrowDown size={18} />
              </button>
              <a className="button button-ghost" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                <Phone size={17} /> WhatsApp
              </a>
              <a className="button button-ghost button-map" href={MAPS_URL} target="_blank" rel="noreferrer">
                <MapPin size={17} /> Google Maps
              </a>
            </div>
            <div className="hero-notes" aria-label="Modalidades disponibles">
              <span>Recoger en tienda</span>
              <span className="delivery-soon" aria-disabled="true">Delivery <small>Próximamente</small></span>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/monkeyroll-hero.png" alt="Hamburguesa, salchipapas y chaufa al estilo Monkeyroll" />
          </div>
        </section>

        <section className="menu-zone" id="carta" aria-labelledby="menu-title">
          <div className="menu-intro">
            <div>
              <p className="eyebrow eyebrow-dark">La carta · Monkeyroll</p>
              <h2 id="menu-title">{selectedCategory ? selectedCategory.nombre : 'Elige una categoría.'}</h2>
            </div>
            <p>
              {selectedCategory
                ? selectedCategory.descripcion
                : 'Entra a una categoría, arma tu pedido y envíalo directo por WhatsApp.'}
            </p>
          </div>

          {!selectedCategory ? (
            <div className="category-grid" aria-label="Categorías de la carta">
              {MENU_DATA.map((category) => (
                <button className="category-card" key={category.id} type="button" onClick={() => goToCategory(category.id)}>
                  <span className="category-card-art" aria-hidden="true" />
                  <span className="category-card-arrow" aria-hidden="true"><ArrowRight size={19} /></span>
                  <span className="category-card-copy">
                    <span>
                      <strong>{category.nombre}</strong>
                      <small>{category.items.length} {category.items.length === 1 ? 'producto' : 'productos'}</small>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="menu-sections" id="category-content">
              <button className="back-to-categories" type="button" onClick={showCategories}>
                <ArrowLeft size={18} /> Todas las categorías
              </button>
              <section className="menu-category" id={selectedCategory.id} aria-labelledby={`${selectedCategory.id}-title`}>
                <div className="category-heading">
                  <span className="category-number">
                    {String(MENU_DATA.findIndex((category) => category.id === selectedCategory.id) + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p>{selectedCategory.eyebrow}</p>
                    <h3 id={`${selectedCategory.id}-title`}>{selectedCategory.nombre}</h3>
                    <span>{selectedCategory.descripcion}</span>
                  </div>
                </div>

                <div className={`product-grid ${selectedCategory.items.length === 1 ? 'single-product' : ''}`}>
                  {selectedCategory.items.map((dish) => (
                    <article className="product-card" key={dish.id}>
                      <div
                        className={`product-media ${dish.imagen ? 'has-image' : ''}`}
                        aria-label={dish.imagen ? dish.nombre : `Espacio reservado para la imagen de ${dish.nombre}`}
                      >
                        {dish.imagen ? (
                          <img
                            src={dish.imagen}
                            alt={dish.nombre}
                            className="product-image"
                            loading="lazy"
                          />
                        ) : (
                          <>
                            <Camera size={25} strokeWidth={1.5} />
                            <strong>ACÁ VA LA IMAGEN</strong>
                            <span>Foto de {dish.nombre}</span>
                          </>
                        )}
                      </div>
                      <div className="product-body">
                        <div className="product-title-row">
                          <h4>{dish.nombre}</h4>
                          <span>{money(dish.precio)}</span>
                        </div>
                        <p>{dish.descripcion || 'Una favorita de la casa, preparada al momento.'}</p>
                        <button type="button" onClick={() => openConfigurator(dish, selectedCategory.id)} aria-label={`Agregar ${dish.nombre} al pedido`}>
                          Agregar <Plus size={17} strokeWidth={2.5} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>

        <section className="final-cta">
          <div>
            <p>¿Ya elegiste?</p>
            <h2>Tu antojo no sabe esperar.</h2>
          </div>
          <button className="button button-dark" type="button" onClick={() => setCartOpen(true)}>
            Revisar mi pedido <ArrowRight size={18} />
          </button>
        </section>

        <section className="location-section" id="ubicacion" aria-labelledby="location-title">
          <div className="location-copy">
            <p>Monkeyroll · Lurigancho Ñaña</p>
            <h2 id="location-title">Ubícanos</h2>
            <span>Abre el mapa, revisa la ruta y llega directo a Monkeyroll.</span>
            <a className="button location-button" href={MAPS_URL} target="_blank" rel="noreferrer">
              <MapPin size={18} /> Abrir en Google Maps
            </a>
          </div>
          <div className="map-frame">
            <iframe
              title="Ubicación de Monkeyroll en Google Maps"
              src={MAP_EMBED_URL}
              width="400"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src="/monkeyroll-logo.png" alt="Monkeyroll" />
        <p>Sabor sin jaula.</p>
        <div className="footer-links">
          <a href={`tel:+${WHATSAPP_NUMBER}`}><Phone size={17} /> 957 669 038</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={17} /> @monkeyrollperu</a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer"><MapPin size={17} /> Cómo llegar</a>
        </div>
        <small>© 2026 Monkeyroll · Carta digital</small>
      </footer>

      {itemCount > 0 && !cartOpen && (
        <button className="floating-cart" type="button" onClick={() => setCartOpen(true)}>
          <span><ShoppingBag size={20} /> {itemCount} {itemCount === 1 ? 'producto' : 'productos'}</span>
          <strong>{money(total)}</strong>
        </button>
      )}

      {cartOpen && (
        <div className="cart-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="cart-header">
              <div>
                <p>Monkeyroll</p>
                <h2 id="cart-title">Tu pedido</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar pedido"><X size={21} /></button>
            </div>

            {cartItems.length ? (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.key}>
                      <div className="cart-item-copy">
                        <h3>{item.nombre}</h3>
                        <p>{money(item.precio)}</p>
                        {item.selections.map((selection) => (
                          <small key={selection.label}><strong>{selection.label}:</strong> {selection.values.join(', ')}</small>
                        ))}
                        {item.extras.map((extra) => (
                          <div className="cart-item-extra" key={extra.id}>
                            <small><strong>+ {extra.nombre}</strong> · {money(extra.precio)}</small>
                            {extra.selections.map((selection) => (
                              <small key={`${extra.id}-${selection.label}`}>
                                <strong>{selection.label}:</strong> {selection.values.join(', ')}
                              </small>
                            ))}
                          </div>
                        ))}
                        {item.nota && <small><strong>Nota:</strong> {item.nota}</small>}
                      </div>
                      <div className="quantity-control" aria-label={`Cantidad de ${item.nombre}`}>
                        <button type="button" onClick={() => changeQuantity(item.key, -1)} aria-label="Quitar uno"><Minus size={15} /></button>
                        <span>{item.cantidad}</span>
                        <button type="button" onClick={() => changeQuantity(item.key, 1)} aria-label="Agregar uno"><Plus size={15} /></button>
                      </div>
                      <button className="delete-item" type="button" onClick={() => changeQuantity(item.key, -item.cantidad)} aria-label={`Eliminar ${item.nombre}`}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="fulfillment-options" aria-label="Modalidad del pedido">
                    <button
                      className={`fulfillment-choice ${pickupSelected ? 'selected' : ''}`}
                      type="button"
                      onClick={() => {
                        setPickupSelected(true);
                        setCustomerError('');
                      }}
                    >
                      <strong>Recoger en tienda</strong>
                      <small>{pickupSelected ? 'Seleccionado' : 'Seleccionar'}</small>
                    </button>
                    <div className="fulfillment-choice disabled" aria-disabled="true">
                      <strong>Delivery</strong>
                      <small>Próximamente</small>
                    </div>
                  </div>
                  {pickupSelected && (
                    <div className="customer-form">
                      <div className="customer-form-heading">
                        <strong>Datos para el recojo</strong>
                        <small>Obligatorios</small>
                      </div>
                      <label>
                        <span>Nombre</span>
                        <input
                          type="text"
                          autoComplete="given-name"
                          value={customer.nombre}
                          onChange={(event) => {
                            setCustomer((current) => ({ ...current, nombre: event.target.value }));
                            setCustomerError('');
                          }}
                        />
                      </label>
                      <label>
                        <span>Apellido</span>
                        <input
                          type="text"
                          autoComplete="family-name"
                          value={customer.apellido}
                          onChange={(event) => {
                            setCustomer((current) => ({ ...current, apellido: event.target.value }));
                            setCustomerError('');
                          }}
                        />
                      </label>
                      <label className="customer-phone">
                        <span>Número de teléfono</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          pattern="[0-9]*"
                          maxLength={9}
                          value={customer.telefono}
                          onInput={(event) => {
                            const telefono = event.currentTarget.value.replace(/\D/g, '').slice(0, 9);
                            event.currentTarget.value = telefono;
                            setCustomer((current) => ({ ...current, telefono }));
                            setCustomerError('');
                          }}
                        />
                      </label>
                      {customerError && <p className="customer-error" role="alert">{customerError}</p>}
                    </div>
                  )}
                  <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
                  <p>El precio final y la disponibilidad se confirman por WhatsApp.</p>
                  <button type="button" onClick={sendOrder} disabled={!customerReady}>
                    Enviar pedido por WhatsApp <ArrowRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <ShoppingBag size={34} strokeWidth={1.4} />
                <h3>Tu bolsa está esperando.</h3>
                <p>Agrega algo rico de la carta y vuelve por aquí.</p>
                <button type="button" onClick={() => setCartOpen(false)}>Explorar la carta</button>
              </div>
            )}
          </aside>
        </div>
      )}

      {configuringDish && (
        <div className="config-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeConfigurator()}>
          <section className="config-dialog" role="dialog" aria-modal="true" aria-labelledby="config-title">
            <div className="config-header">
              <div>
                <p>Personaliza tu pedido</p>
                <h2 id="config-title">{configuringDish.nombre}</h2>
                <span>Desde {money(configuringDish.precio)}</span>
              </div>
              <button type="button" onClick={closeConfigurator} aria-label="Cerrar personalización"><X size={21} /></button>
            </div>

            <div className="config-content">
              {(configuringDish.opciones ?? []).map((option) => {
                const selectedCount = selections[option.id]?.length ?? 0;
                const minimum = option.minimo ?? (option.requerida ? 1 : 0);
                return (
                  <fieldset className="config-option" key={option.id}>
                    <legend>
                      <span>{option.nombre}</span>
                      <small>{minimum > 0 ? `Obligatorio${option.maximo ? ` · elige ${option.maximo}` : ''}` : 'Opcional'}</small>
                    </legend>
                    <div className="choice-grid">
                      {option.opciones.map((choice) => {
                        const checked = selections[option.id]?.includes(choice.id) ?? false;
                        return (
                          <label className={`choice-pill ${checked ? 'selected' : ''}`} key={choice.id}>
                            <input
                              type={option.tipo === 'single' ? 'radio' : 'checkbox'}
                              name={option.id}
                              checked={checked}
                              onChange={() => toggleChoice(option.id, choice.id, option.tipo, option.maximo)}
                            />
                            <span>{choice.nombre}</span>
                            {choice.precioExtra ? <small>+ {money(choice.precioExtra)}</small> : null}
                          </label>
                        );
                      })}
                    </div>
                    {option.maximo && <p>{selectedCount} de {option.maximo} seleccionados</p>}
                  </fieldset>
                );
              })}

              {configuratorUpsells.length > 0 && (
                <section className="config-upsells" aria-labelledby="config-upsells-title">
                  <div className="config-upsells-heading">
                    <div>
                      <span id="config-upsells-title">Agrégale algo más</span>
                      <small>Opcional</small>
                    </div>
                    <p>Pulsa el + para añadirlo</p>
                  </div>

                  <div className="config-upsell-list">
                    {configuratorUpsells.map((upsell) => {
                      const isSelected = Object.prototype.hasOwnProperty.call(selectedUpsells, upsell.id);
                      const upsellSelections = selectedUpsells[upsell.id] ?? {};
                      return (
                        <article className={`config-upsell-card ${isSelected ? 'selected' : ''}`} key={upsell.id}>
                          <button
                            className="config-upsell-toggle"
                            type="button"
                            onClick={() => toggleUpsell(upsell.id)}
                            aria-pressed={isSelected}
                          >
                            <span>
                              <strong>{upsell.nombre}</strong>
                              <small>{upsell.descripcion}</small>
                            </span>
                            <b>+ {money(upsell.precio)}</b>
                            <i aria-hidden="true"><Plus size={18} /></i>
                          </button>

                          {isSelected && (upsell.opciones ?? []).map((option) => {
                            const selectedCount = upsellSelections[option.id]?.length ?? 0;
                            const minimum = option.minimo ?? (option.requerida ? 1 : 0);
                            return (
                              <fieldset className="config-option upsell-option" key={`${upsell.id}-${option.id}`}>
                                <legend>
                                  <span>{option.nombre}</span>
                                  <small>{minimum > 0 ? 'Obligatorio' : 'Opcional'}</small>
                                </legend>
                                <div className="choice-grid">
                                  {option.opciones.map((choice) => {
                                    const checked = upsellSelections[option.id]?.includes(choice.id) ?? false;
                                    return (
                                      <label className={`choice-pill ${checked ? 'selected' : ''}`} key={choice.id}>
                                        <input
                                          type={option.tipo === 'single' ? 'radio' : 'checkbox'}
                                          name={`${upsell.id}-${option.id}`}
                                          checked={checked}
                                          onChange={() => toggleUpsellChoice(
                                            upsell.id,
                                            option.id,
                                            choice.id,
                                            option.tipo,
                                            option.maximo,
                                          )}
                                        />
                                        <span>{choice.nombre}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                                {option.maximo && <p>{selectedCount} de {option.maximo} seleccionados</p>}
                              </fieldset>
                            );
                          })}
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {configuringCategoryId !== 'bebidas' && (
                <label className="note-field">
                  <span>Nota para cocina <small>Opcional</small></span>
                  <textarea
                    value={note}
                    maxLength={180}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ej.: sin cebolla, salsas aparte..."
                    rows={3}
                  />
                  <small>{note.length}/180</small>
                </label>
              )}

              {configurationError && <p className="config-error" role="alert">{configurationError}</p>}
            </div>

            <div className="config-footer">
              <button type="button" onClick={confirmConfiguration}>
                Agregar al pedido <Plus size={18} />
              </button>
            </div>
          </section>
        </div>
      )}

      <div className={`toast ${addedItem ? 'visible' : ''}`} role="status" aria-live="polite">
        <span>✓</span> {addedItem ? `${addedItem} se sumó al pedido` : ''}
      </div>
    </div>
  );
}
