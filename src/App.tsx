import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
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
import { MENU_DATA, MENU_ITEMS, type Dish } from './data/menuData';

const WHATSAPP_NUMBER = '51957669038';
const INSTAGRAM_URL = 'https://www.instagram.com/monkeyrollperu/';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Monkeyroll+San+Juan+de+Lurigancho';

type Cart = Record<string, number>;

const money = (value: number) => `S/ ${value.toFixed(2)}`;

export default function App() {
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(MENU_DATA[0].id);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const cartItems = useMemo(
    () =>
      MENU_ITEMS.filter((item) => cart[item.id]).map((item) => ({
        ...item,
        cantidad: cart[item.id],
      })),
    [cart],
  );

  const itemCount = useMemo(
    () => Object.keys(cart).reduce((total, id) => total + (cart[id] ?? 0), 0),
    [cart],
  );

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [cartItems],
  );

  useEffect(() => {
    const sections = MENU_DATA.map((category) => document.getElementById(category.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveCategory(visible.target.id);
      },
      { rootMargin: '-28% 0px -60% 0px', threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section as Element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!cartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [cartOpen]);

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) => {
      const nextQuantity = (current[id] || 0) + delta;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[id];
      else next[id] = nextQuantity;
      return next;
    });
  };

  const addToCart = (dish: Dish) => {
    changeQuantity(dish.id, 1);
    setAddedItem(dish.nombre);
    window.setTimeout(() => setAddedItem(null), 1700);
  };

  const sendOrder = () => {
    if (!cartItems.length) return;
    const lines = cartItems.map(
      (item) => `• ${item.cantidad} × ${item.nombre} — ${money(item.precio * item.cantidad)}`,
    );
    const message = [
      '*Hola Monkeyroll, quiero hacer este pedido:*',
      '',
      ...lines,
      '',
      `*Total: ${money(total)}*`,
      '',
      '¿Me confirman disponibilidad y tiempo de entrega? 🙌',
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const goToCategory = (id: string) => {
    setActiveCategory(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="site-shell">
      <header className="topbar" id="inicio">
        <a className="brand" href="#inicio" aria-label="Volver al inicio de Monkeyroll">
          <img src="/monkeyroll-logo.png" alt="Monkeyroll Fast Food Peruano" />
        </a>
        <div className="topbar-actions">
          <a className="round-action desktop-only" href={MAPS_URL} target="_blank" rel="noreferrer" aria-label="Ver ubicación">
            <MapPin size={19} />
          </a>
          <button className="cart-action" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir pedido, ${itemCount} productos`}>
            <ShoppingBag size={20} />
            <span className="cart-action-label">Mi pedido</span>
            <span className="cart-count">{itemCount}</span>
          </button>
        </div>
      </header>

      <div className="marquee" aria-label="Sabores de Monkeyroll">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((item) => (
            <span key={item}>
              SABOR SIN JAULA <i>•</i> HAMBURGUESAS CON ACTITUD <i>•</i> FAST FOOD PERUANO <i>•</i>
            </span>
          ))}
        </div>
      </div>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={15} /> Fast food peruano</p>
            <h1 id="hero-title">Sabor que se sale <em>de la jaula.</em></h1>
            <p className="hero-description">
              Hamburguesas, salchipapas y clásicos peruanos hechos para atacar el antojo sin pedir permiso.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" type="button" onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver la carta <ArrowDown size={18} />
              </button>
              <a className="button button-ghost" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                <Phone size={17} /> WhatsApp
              </a>
            </div>
            <div className="hero-notes" aria-label="Características de la carta">
              <span>Hecho al momento</span>
              <span>Sazón peruana</span>
              <span>Delivery</span>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/monkeyroll-hero.png" alt="Hamburguesa, salchipapas y chaufa al estilo Monkeyroll" />
            <div className="hero-stamp" aria-hidden="true">
              <span>100%</span>
              <small>ANTOJO</small>
            </div>
          </div>
        </section>

        <section className="menu-zone" id="carta" aria-labelledby="menu-title">
          <div className="menu-intro">
            <div>
              <p className="eyebrow eyebrow-dark">La carta · Monkeyroll</p>
              <h2 id="menu-title">Elige tu próxima obsesión.</h2>
            </div>
            <p>Arma tu pedido y envíalo directo por WhatsApp. Simple, rápido y con hambre.</p>
          </div>

          <nav className="category-nav" aria-label="Categorías de la carta">
            {MENU_DATA.map((category) => (
              <button
                key={category.id}
                type="button"
                className={activeCategory === category.id ? 'active' : ''}
                onClick={() => goToCategory(category.id)}
              >
                {category.nombre}
              </button>
            ))}
          </nav>

          <div className="menu-sections">
            {MENU_DATA.map((category, categoryIndex) => (
              <section className="menu-category" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
                <div className="category-heading">
                  <span className="category-number">{String(categoryIndex + 1).padStart(2, '0')}</span>
                  <div>
                    <p>{category.eyebrow}</p>
                    <h3 id={`${category.id}-title`}>{category.nombre}</h3>
                    <span>{category.descripcion}</span>
                  </div>
                </div>

                <div className={`product-grid ${category.items.length === 1 ? 'single-product' : ''}`}>
                  {category.items.map((dish) => (
                    <article className="product-card" key={dish.id}>
                      <div className="product-media" aria-label={`Espacio reservado para la imagen de ${dish.nombre}`}>
                        <Camera size={25} strokeWidth={1.5} />
                        <strong>ACÁ VA LA IMAGEN</strong>
                        <span>Foto de {dish.nombre}</span>
                      </div>
                      <div className="product-body">
                        <div className="product-title-row">
                          <h4>{dish.nombre}</h4>
                          <span>{money(dish.precio)}</span>
                        </div>
                        <p>{dish.descripcion || 'Una favorita de la casa, preparada al momento.'}</p>
                        <button type="button" onClick={() => addToCart(dish)} aria-label={`Agregar ${dish.nombre} al pedido`}>
                          Agregar <Plus size={17} strokeWidth={2.5} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
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
      </main>

      <footer className="footer">
        <img src="/monkeyroll-logo.png" alt="Monkeyroll Fast Food Peruano" />
        <p>Fast food peruano con espíritu inquieto.</p>
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
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-copy">
                        <h3>{item.nombre}</h3>
                        <p>{money(item.precio)}</p>
                      </div>
                      <div className="quantity-control" aria-label={`Cantidad de ${item.nombre}`}>
                        <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label="Quitar uno"><Minus size={15} /></button>
                        <span>{item.cantidad}</span>
                        <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label="Agregar uno"><Plus size={15} /></button>
                      </div>
                      <button className="delete-item" type="button" onClick={() => changeQuantity(item.id, -item.cantidad)} aria-label={`Eliminar ${item.nombre}`}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Total</span><strong>{money(total)}</strong></div>
                  <p>El precio final y la disponibilidad se confirman por WhatsApp.</p>
                  <button type="button" onClick={sendOrder}>
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

      <div className={`toast ${addedItem ? 'visible' : ''}`} role="status" aria-live="polite">
        <span>✓</span> {addedItem ? `${addedItem} se sumó al pedido` : ''}
      </div>
    </div>
  );
}
