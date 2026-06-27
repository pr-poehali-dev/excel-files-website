export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  size: string;
  price: number;
  stock: number;
  article: string;
  warehouse: string;
};

const BRANDS = [
  'Continental', 'GOOD TUBE', 'Kabat', 'JST', 'JUSTAR', 'BRONKES', 'Junta',
  'SRW', 'Asterro', 'Matador', 'ADVANCE', 'SAMSON', 'TORNADO', 'AUSTONE',
  'FORTUNE', 'CEAT', 'Double Coin', 'EVERGREEN', 'GOFORM', 'FOMAN', 'GoodRide',
  'GoodYear', 'Fulda', 'Sava', 'Green Dragon', 'LANVIGATOR', 'ROYALBLACK',
  'APLUS', 'LEAO', 'LONGMARCH', 'TRIANGLE', 'Yokohama', 'КАМА', 'Cultor',
  'Nexen', 'Linglong', 'Sailun', 'Torero', 'Gislaved', 'Westlake', 'ALCEED',
  'Advance', 'JinTongDa', 'Ling Long', 'NEUMASTER', 'FELEDE', 'ROCKBUSTER',
  'ROADBUSTER', 'Hayes Lemmerz', 'YONGZHENG',
];

const SIZE_RE = /(\d{1,4}[.,/]?\d{0,3}[\s]?[-x/RОrх× ]\s?\d{1,4}([.,]\d{1,2})?(R\d{1,3}\.?\d?)?|\d{2,3}\/\d{2,3}R\d{1,3}\.?\d?|\d{1,3}\.\d{2}R\d{1,3}\.?\d?)/i;

function detectBrand(name: string): string {
  const found = BRANDS.find((b) => name.toLowerCase().includes(b.toLowerCase()));
  return found || 'Прочие';
}

function detectSize(name: string): string {
  const m = name.match(SIZE_RE);
  return m ? m[0].trim() : '';
}

// Парсит "сырые" строки прайса в товары.
// Строка-категория: есть текст группы, но нет цены.
// Строка-товар: есть название (с "шт.") и цена.
export function parsePriceRows(rows: string[][], warehouse = 'Основной'): Product[] {
  const products: Product[] = [];
  let currentCategory = 'Без категории';
  let counter = 0;

  // Определяем склад из шапки файла
  let detectedWarehouse = warehouse;
  for (const row of rows.slice(0, 5)) {
    const joined = row.map((c) => (c ?? '').toString()).join(' ');
    if (/ответхранение/i.test(joined)) { detectedWarehouse = 'Ответхранение Алабино'; break; }
    if (/алабино/i.test(joined)) { detectedWarehouse = 'Алабино'; break; }
  }

  for (const row of rows) {
    const cells = row.map((c) => (c ?? '').toString().trim());
    const joined = cells.join(' ').trim();
    if (!joined) continue;

    // Ищем ячейку с ценой (число формата "1 200,00" или "650,00")
    let price = 0;
    let priceIdx = -1;
    for (let i = cells.length - 1; i >= 0; i--) {
      const raw = cells[i].replace(/\s/g, '').replace(',', '.');
      const num = parseFloat(raw);
      if (cells[i].match(/^\s*\d[\d\s]*,\d{2}\s*$/) && num > 0) {
        price = num;
        priceIdx = i;
        break;
      }
    }

    // Название товара — ячейка, заканчивающаяся на "шт." или содержащая запятую с упаковкой
    const nameCell = cells.find((c) => /шт\.?$/.test(c) || /,\s*шт/.test(c));

    if (price > 0 && nameCell) {
      // Это товар
      const name = nameCell.replace(/,?\s*шт\.?$/, '').trim();
      let stock = 0;
      if (priceIdx >= 0 && cells[priceIdx + 1]) {
        stock = parseInt(cells[priceIdx + 1].replace(/\s/g, ''), 10) || 0;
      }
      const article = cells.find((c) => /^[A-ZА-Я0-9][A-ZА-Я0-9./-]{4,}$/i.test(c) && c !== nameCell) || '';
      products.push({
        id: `p-${counter++}`,
        name,
        category: currentCategory,
        brand: detectBrand(name),
        size: detectSize(name),
        price,
        stock,
        article,
        warehouse: detectedWarehouse,
      });
    } else if (!price && joined.length > 4 && !/^\d/.test(joined) && !/прайс-лист/i.test(joined)) {
      // Похоже на заголовок категории (нет цены, начинается с буквы)
      const cat = cells.find((c) => c.length > 4 && /[А-Яа-яA-Za-z]/.test(c) && !/^\d+$/.test(c));
      if (cat && !/шт/.test(cat)) currentCategory = cat;
    }
  }

  return products;
}

export const fmtPrice = (n: number) => n.toLocaleString('ru-RU') + ' ₽';