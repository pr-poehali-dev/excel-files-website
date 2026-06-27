import { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { parsePriceRows, fmtPrice, type Product } from '@/lib/priceData';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';

const ALL = 'Все категории';
const ALL_WH = 'Все склады';

const Index = () => {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [isDemo, setIsDemo] = useState(true);
  const [activeCat, setActiveCat] = useState(ALL);
  const [activeWh, setActiveWh] = useState(ALL_WH);
  const [brands, setBrands] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [inStock, setInStock] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.price), 1000),
    [products],
  );
  const [priceCap, setPriceCap] = useState<number | null>(null);
  const cap = priceCap ?? maxPrice;

  const warehouses = useMemo(() => {
    const set = new Set(products.map((p) => p.warehouse).filter(Boolean));
    return set.size > 1 ? [ALL_WH, ...Array.from(set)] : [];
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [ALL, ...Array.from(set)];
  }, [products]);

  const brandList = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (activeCat === ALL || p.category === activeCat) &&
          (activeWh === ALL_WH || p.warehouse === activeWh) &&
          (brands.length === 0 || brands.includes(p.brand)) &&
          p.price <= cap &&
          (!inStock || p.stock > 0) &&
          (search === '' ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.size.toLowerCase().includes(search.toLowerCase()) ||
            p.article.toLowerCase().includes(search.toLowerCase())),
      ),
    [products, activeCat, activeWh, brands, cap, inStock, search],
  );

  const toggleBrand = (b: string) =>
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const resetAll = () => {
    setActiveCat(ALL);
    setActiveWh(ALL_WH);
    setBrands([]);
    setPriceCap(null);
    setInStock(false);
    setSearch('');
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const collected: Product[] = [];
    try {
      for (const file of Array.from(files)) {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        for (const sheetName of wb.SheetNames) {
          const rows = XLSX.utils.sheet_to_json<string[]>(wb.Sheets[sheetName], {
            header: 1,
            blankrows: false,
            defval: '',
          });
          collected.push(...parsePriceRows(rows as string[][]));
        }
      }
      if (collected.length === 0) {
        toast.error('Не удалось распознать товары. Проверьте формат прайса.');
        return;
      }
      setProducts(collected);
      setIsDemo(false);
      resetAll();
      toast.success(`Загружено ${collected.length} товаров из прайса`);
    } catch {
      toast.error('Ошибка чтения файла. Поддерживаются .xlsx, .xls, .csv');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-violet/20 blur-[140px] animate-glow" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-lime/10 blur-[140px] animate-glow" />

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2 font-display font-black text-xl tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-lime animate-glow" />
            ШИНТОРГ<span className="text-lime">.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => fileRef.current?.click()}
              className="bg-lime text-background hover:bg-lime/90 font-semibold rounded-full"
            >
              <Icon name="Upload" size={18} />
              <span className="hidden sm:inline">Загрузить прайс</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative container pt-16 pb-12">
        <div className="max-w-4xl animate-fade-up">
          <Badge className="bg-violet/20 text-violet border-0 mb-6 rounded-full px-4 py-1.5">
            Прайс-лист · Алабино · 29.06.2026
          </Badge>
          <h1 className="font-display font-black leading-[0.95] text-4xl md:text-6xl lg:text-7xl tracking-tight">
            Грузовые шины, камеры и <span className="text-gradient">диски</span> оптом
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            {isDemo
              ? 'Сейчас показан демо-каталог из вашего прайса. Загрузите свои Excel-файлы — каталог обновится полностью.'
              : 'Каталог загружен из вашего прайса. Фильтруйте по категории, бренду, цене и наличию.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-lime text-background hover:bg-lime/90 font-semibold rounded-full h-12 px-7">
              <a href="#catalog">Смотреть каталог <Icon name="ArrowRight" size={18} /></a>
            </Button>
            <Button
              onClick={() => fileRef.current?.click()}
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7 border-border bg-transparent hover:bg-secondary"
            >
              <Icon name="FileSpreadsheet" size={18} /> Загрузить Excel
            </Button>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="container py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters */}
          <aside className="lg:w-72 lg:shrink-0 space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Фильтры</h3>
              <button onClick={resetAll} className="text-xs text-muted-foreground hover:text-lime transition-colors">
                Сбросить
              </button>
            </div>

            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Размер, название, артикул"
                className="pl-9 bg-secondary border-border rounded-full"
              />
            </div>

            {warehouses.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="Warehouse" size={16} className="text-lime" /> Склад
                </p>
                <div className="flex flex-wrap gap-2">
                  {warehouses.map((w) => (
                    <button
                      key={w}
                      onClick={() => setActiveWh(w)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                        activeWh === w
                          ? 'bg-lime text-background'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Wallet" size={16} className="text-lime" /> Цена до {fmtPrice(cap)}
              </p>
              <Slider
                value={[cap]}
                onValueChange={(v) => setPriceCap(v[0])}
                min={0}
                max={maxPrice}
                step={500}
              />
            </div>

            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <Checkbox checked={inStock} onCheckedChange={(v) => setInStock(!!v)} />
              <span className="flex items-center gap-2">
                <Icon name="PackageCheck" size={16} className="text-violet" /> Только в наличии
              </span>
            </label>

            <div className="space-y-3">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Tag" size={16} className="text-violet" /> Бренд
              </p>
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
                {brandList.map((b) => (
                  <label key={b} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    <Checkbox checked={brands.includes(b)} onCheckedChange={() => toggleBrand(b)} />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
              {categories.map((c) => (
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
                Найдено <span className="text-foreground font-semibold">{filtered.length}</span> позиций
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Icon name="SearchX" size={48} className="mx-auto mb-4 text-violet" />
                Ничего не найдено. Смягчите фильтры.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p, i) => (
                  <article
                    key={p.id}
                    style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                    className="group animate-fade-up flex flex-col rounded-3xl border border-border bg-card p-5 hover:border-lime/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="border-border text-muted-foreground rounded-full text-xs">
                          {p.brand}
                        </Badge>
                        {p.warehouse && warehouses.length > 1 && (
                          <Badge className="bg-violet/15 text-violet border-0 rounded-full text-xs">
                            <Icon name="Warehouse" size={10} />
                            {p.warehouse === 'Ответхранение Алабино' ? 'Ответхр.' : p.warehouse}
                          </Badge>
                        )}
                      </div>
                      {p.stock > 0 ? (
                        <span className="text-xs text-lime flex items-center gap-1 shrink-0">
                          <Icon name="Check" size={12} /> {p.stock} шт
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground shrink-0">под заказ</span>
                      )}
                    </div>
                    {p.size && (
                      <p className="font-display font-bold text-lg text-lime mb-1">{p.size}</p>
                    )}
                    <h4 className="text-sm text-foreground/90 leading-snug mb-4 flex-1">{p.name}</h4>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                      <span className="font-display font-bold text-lg">{fmtPrice(p.price)}</span>
                      <Button
                        size="sm"
                        onClick={() => toast.success(`«${p.size || p.name}» добавлен в заявку`)}
                        className="bg-secondary text-foreground hover:bg-lime hover:text-background rounded-full transition-colors"
                      >
                        <Icon name="Plus" size={16} /> В заявку
                      </Button>
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
          <div className="font-display font-black text-xl">ШИНТОРГ<span className="text-lime">.</span></div>
          <p className="text-sm text-muted-foreground text-center">
            Прайс на 29.06.2026 · Цены оптовые, включают НДС
          </p>
          <Button
            onClick={() => fileRef.current?.click()}
            variant="outline"
            className="rounded-full border-border bg-transparent hover:bg-secondary"
          >
            <Icon name="Upload" size={16} /> Обновить прайс
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;