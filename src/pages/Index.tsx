import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const IMG_HEADPHONES =
  'https://cdn.poehali.dev/projects/5d9fa7db-a0df-4428-89ca-7c19abefd853/files/fcd437de-4d2b-4a48-8acc-bbe071d6eab8.jpg';
const IMG_WATCH =
  'https://cdn.poehali.dev/projects/5d9fa7db-a0df-4428-89ca-7c19abefd853/files/11908d7c-60ad-4db3-834a-839810981b80.jpg';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  brand: string;
  color: string;
  image: string;
  badge?: string;
};

const CATEGORIES = ['Все', 'Наушники', 'Часы', 'Колонки', 'Аксессуары'];
const BRANDS = ['Nova', 'Aurora', 'Pulse', 'Volt'];
const COLORS = ['Чёрный', 'Лайм', 'Фиолетовый', 'Белый'];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Nova Air Pro', category: 'Наушники', price: 12990, brand: 'Nova', color: 'Лайм', image: IMG_HEADPHONES, badge: 'Хит' },
  { id: 2, name: 'Aurora Watch X', category: 'Часы', price: 21490, brand: 'Aurora', color: 'Фиолетовый', image: IMG_WATCH, badge: 'New' },
  { id: 3, name: 'Pulse Beat 2', category: 'Наушники', price: 7990, brand: 'Pulse', color: 'Чёрный', image: IMG_HEADPHONES },
  { id: 4, name: 'Volt Time S', category: 'Часы', price: 15990, brand: 'Volt', color: 'Чёрный', image: IMG_WATCH },
  { id: 5, name: 'Nova Sound Mini', category: 'Колонки', price: 5490, brand: 'Nova', color: 'Белый', image: IMG_HEADPHONES, badge: '-20%' },
  { id: 6, name: 'Aurora Buds', category: 'Наушники', price: 4990, brand: 'Aurora', color: 'Фиолетовый', image: IMG_HEADPHONES },
  { id: 7, name: 'Pulse Dock', category: 'Аксессуары', price: 2990, brand: 'Pulse', color: 'Чёрный', image: IMG_WATCH },
  { id: 8, name: 'Volt Boom', category: 'Колонки', price: 9990, brand: 'Volt', color: 'Лайм', image: IMG_WATCH, badge: 'Хит' },
];

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const Index = () => {
  const [activeCat, setActiveCat] = useState('Все');
  const [price, setPrice] = useState<[number]>([25000]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (activeCat === 'Все' || p.category === activeCat) &&
          p.price <= price[0] &&
          (brands.length === 0 || brands.includes(p.brand)) &&
          (colors.length === 0 || colors.includes(p.color)),
      ),
    [activeCat, price, brands, colors],
  );

  const resetAll = () => {
    setActiveCat('Все');
    setPrice([25000]);
    setBrands([]);
    setColors([]);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* glow blobs */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-violet/30 blur-[140px] animate-glow" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-lime/20 blur-[140px] animate-glow" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-display font-black text-xl tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-lime animate-glow" />
            NOVA<span className="text-lime">.</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#catalog" className="hover:text-foreground transition-colors">Каталог</a>
            <a href="#catalog" className="hover:text-foreground transition-colors">Категории</a>
            <a href="#catalog" className="hover:text-foreground transition-colors">О нас</a>
          </nav>
          <Button className="bg-lime text-background hover:bg-lime/90 font-semibold rounded-full">
            <Icon name="ShoppingBag" size={18} />
            Корзина
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container pt-20 pb-16">
        <div className="max-w-4xl animate-fade-up">
          <Badge className="bg-violet/20 text-violet border-0 mb-6 rounded-full px-4 py-1.5">
            <span className="grain" /> Новая коллекция 2026
          </Badge>
          <h1 className="font-display font-black leading-[0.95] text-5xl md:text-7xl lg:text-8xl tracking-tight">
            Техника, которая <span className="text-gradient">звучит</span> ярко
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Гаджеты нового поколения. Подбирай по цене, бренду и цвету — фильтры найдут идеальный вариант за секунды.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-lime text-background hover:bg-lime/90 font-semibold rounded-full h-12 px-7">
              <a href="#catalog">Смотреть каталог <Icon name="ArrowRight" size={18} /></a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-7 border-border bg-transparent hover:bg-secondary">
              <Icon name="Play" size={18} /> Как это работает
            </Button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative border-y border-border py-4 overflow-hidden bg-secondary/40">
        <div className="flex w-max animate-marquee gap-10 text-sm font-display font-semibold uppercase tracking-widest text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-10">
              <span>Бесплатная доставка</span><span className="text-lime">✦</span>
              <span>Гарантия 2 года</span><span className="text-violet">✦</span>
              <span>Оплата частями</span><span className="text-lime">✦</span>
              <span>Возврат 30 дней</span><span className="text-violet">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Catalog */}
      <section id="catalog" className="container py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters */}
          <aside className="lg:w-72 lg:shrink-0 space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Фильтры</h3>
              <button onClick={resetAll} className="text-xs text-muted-foreground hover:text-lime transition-colors">
                Сбросить
              </button>
            </div>

            {/* Price */}
            <div className="space-y-4">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Wallet" size={16} className="text-lime" /> Цена до {fmt(price[0])}
              </p>
              <Slider value={price} onValueChange={(v) => setPrice(v as [number])} min={2000} max={25000} step={500} />
            </div>

            {/* Brand */}
            <div className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Tag" size={16} className="text-violet" /> Бренд
              </p>
              {BRANDS.map((b) => (
                <label key={b} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <Checkbox checked={brands.includes(b)} onCheckedChange={() => toggle(brands, setBrands, b)} />
                  {b}
                </label>
              ))}
            </div>

            {/* Color */}
            <div className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Palette" size={16} className="text-lime" /> Цвет
              </p>
              {COLORS.map((c) => (
                <label key={c} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <Checkbox checked={colors.includes(c)} onCheckedChange={() => toggle(colors, setColors, c)} />
                  {c}
                </label>
              ))}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeCat === c
                      ? 'bg-lime text-background'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Найдено <span className="text-foreground font-semibold">{filtered.length}</span> товаров
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Icon name="SearchX" size={48} className="mx-auto mb-4 text-violet" />
                Ничего не найдено. Попробуйте смягчить фильтры.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p, i) => (
                  <article
                    key={p.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="group animate-fade-up rounded-3xl border border-border bg-card p-3 hover:border-lime/50 transition-colors"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {p.badge && (
                        <Badge className="absolute top-3 left-3 bg-lime text-background border-0 rounded-full font-semibold">
                          {p.badge}
                        </Badge>
                      )}
                      <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-lime transition-colors">
                        <Icon name="Heart" size={16} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{p.brand} · {p.category}</p>
                      <h4 className="font-display font-semibold text-base mb-3">{p.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-lg">{fmt(p.price)}</span>
                        <Button size="sm" className="bg-secondary text-foreground hover:bg-lime hover:text-background rounded-full transition-colors">
                          <Icon name="Plus" size={16} /> В корзину
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-10">
        <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-black text-xl">NOVA<span className="text-lime">.</span></div>
          <p className="text-sm text-muted-foreground">© 2026 NOVA. Каталог из ваших Excel-файлов.</p>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#catalog" className="hover:text-lime transition-colors"><Icon name="Send" size={20} /></a>
            <a href="#catalog" className="hover:text-lime transition-colors"><Icon name="Instagram" size={20} /></a>
            <a href="#catalog" className="hover:text-lime transition-colors"><Icon name="Youtube" size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
