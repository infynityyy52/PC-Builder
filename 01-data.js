const GAME_VERSION = 'v2.0.17';

const LIGHT_START_BUILD = Object.freeze({
  CPU: 'cpu-i3-10100',
  RAM: 'ram-ddr3-8',
  GPU: 'gpu-gt-1030',
  Storage: 'storage-ssd-256-sata',
  PSU: 'psu-450',
  Case: 'case-case-basic',
  Motherboard: 'starter-easy-mb',
  Cooling: 'cooling-cooler-stock'
});

const MODE_CONFIG = {
  light: {
    label: '🔵 Лайт',
    money: 500,
    baseReward: 0,
    start: LIGHT_START_BUILD
  },
  easy: {
    label: 'Лёгкий',
    money: 500,
    baseReward: 40,
    start: {
      CPU: 'cpu-i3-10100', RAM: 'ram-ddr3-8', GPU: 'gpu-gt-1030', Storage: 'starter-easy-storage',
      PSU: 'psu-450', Case: 'starter-easy-case', Motherboard: 'starter-easy-mb', Cooling: 'starter-easy-cooling', OS: 'os-windows-10-home'
    }
  },
  hard: {
    label: 'Сложный',
    money: 100,
    baseReward: 20,
    start: {
      CPU: 'cpu-j2900', RAM: 'ram-ddr3-4', GPU: 'starter-hard-gpu', Storage: 'storage-hdd-120',
      PSU: 'psu-300', Case: 'starter-hard-case', Motherboard: 'starter-hard-mb', Cooling: 'starter-hard-cooling', OS: 'os-windows-81-home'
    }
  },
  hardcore: {
    label: 'Хардкор',
    money: 0,
    baseReward: 8,
    start: {
      CPU: 'cpu-cel-g5905', RAM: 'starter-hardcore-ram', GPU: 'starter-hardcore-gpu', Storage: 'storage-hdd-64',
      PSU: 'psu-180', Case: null, Motherboard: 'starter-hardcore-mb', Cooling: 'starter-hardcore-cooling', OS: 'os-windows-xp'
    }
  }
};

const CATEGORY_LABELS = {
  GPU: 'Видеокарты', CPU: 'Процессоры', RAM: 'Оперативная память', Storage: 'Накопители',
  PSU: 'Блоки питания', Case: 'Корпуса', Motherboard: 'Материнские платы', Cooling: 'Охлаждение', OS: 'Операционная система'
};

const MAIN_PART_LABELS_EASY = {
  CPU: 'Процессор', RAM: 'Оперативная память', GPU: 'Видеокарта', Storage: 'Накопитель',
  PSU: 'Блок питания', Case: 'Корпус', Motherboard: 'Материнская плата', Cooling: 'Охлаждение', OS: 'Операционная система'
};

const CATEGORIES = ['GPU', 'CPU', 'RAM', 'Storage', 'PSU', 'Case', 'Motherboard', 'Cooling', 'OS'];
const LIGHT_CATEGORIES = ['GPU', 'CPU', 'RAM', 'Storage', 'PSU', 'Case', 'Motherboard', 'Cooling'];
function isLightMode() { return state?.mode === 'light'; }
function activeCategories() { return isLightMode() ? LIGHT_CATEGORIES : CATEGORIES; }

const SHOP = [];
function addCatalog(category, group, series, entries, availability = 0.72, volatility = [0.55, 2.25]) {
  entries.forEach(([suffix, name, basePrice, performance, desc, manufacturer]) => {
    const inferredManufacturer = manufacturer || ((category === 'CPU' || category === 'GPU') && ['AMD','Intel','NVIDIA'].includes(group) ? group : null);
    SHOP.push({
      id: `${category.toLowerCase()}-${suffix}`,
      category, group, series, name, basePrice, performance,
      manufacturer: inferredManufacturer,
      availability, volatility,
      desc: desc || `${CATEGORY_LABELS[category]} для твоей сборки.`
    });
  });
}

// CPU — 31 позиция
addCatalog('CPU', 'Intel', 'Celeron', [
  ['cel-g5905', 'Intel Celeron G5905', 80, 8], ['cel-g6900', 'Intel Celeron G6900', 140, 13]
], 0.82, [0.55, 2.00]);
addCatalog('CPU', 'Intel', 'Pentium', [
  ['j2900', 'Intel Pentium J2900', 70, 10, 'Энергоэффективный процессор. Стартовый CPU сложного режима.'],
  ['pentium-g6400', 'Intel Pentium Gold G6400', 120, 11], ['pentium-g7400', 'Intel Pentium Gold G7400', 220, 18]
], 0.88, [0.55, 2.05]);
addCatalog('CPU', 'Intel', 'Core i3', [
  ['i3-10100', 'Intel Core i3-10100', 350, 18], ['i3-12100f', 'Intel Core i3-12100F', 500, 25], ['i3-13100f', 'Intel Core i3-13100F', 620, 29]
], 0.76, [0.55, 2.15]);
addCatalog('CPU', 'Intel', 'Core i5', [
  ['i5-10400f', 'Intel Core i5-10400F', 700, 34], ['i5-12400f', 'Intel Core i5-12400F', 950, 43], ['i5-13400f', 'Intel Core i5-13400F', 1250, 51], ['i5-14600k', 'Intel Core i5-14600K', 1750, 62]
], 0.68, [0.55, 2.25]);
addCatalog('CPU', 'Intel', 'Core i7', [
  ['i7-10700k', 'Intel Core i7-10700K', 1450, 55], ['i7-12700k', 'Intel Core i7-12700K', 2200, 71], ['i7-13700k', 'Intel Core i7-13700K', 2850, 82], ['i7-14700k', 'Intel Core i7-14700K', 3300, 92]
], 0.55, [0.50, 2.45]);
addCatalog('CPU', 'Intel', 'Core i9', [
  ['i9-11900k', 'Intel Core i9-11900K', 2100, 66], ['i9-12900k', 'Intel Core i9-12900K', 3000, 84], ['i9-13900k', 'Intel Core i9-13900K', 3900, 101], ['i9-14900k', 'Intel Core i9-14900K', 4500, 112]
], 0.42, [0.45, 2.70]);
addCatalog('CPU', 'Intel', 'Core Ultra', [
  ['ultra5-245k', 'Intel Core Ultra 5 245K', 2970, 82]
], 0.48, [0.48, 2.55]);
addCatalog('CPU', 'Intel', 'Core Ultra', [
  ['ultra7-265k', 'Intel Core Ultra 7 265K', 3960, 98]
], 0.44, [0.45, 2.65]);
addCatalog('CPU', 'Intel', 'Core Ultra', [
  ['ultra9-285k', 'Intel Core Ultra 9 285K', 5060, 112]
], 0.40, [0.42, 2.75]);
addCatalog('CPU', 'Intel', 'Xeon', [
  ['xeon-e-2336', 'Intel Xeon E-2336', 6240, 118, 'Серверный процессор. +200% к заработку в обычном AFK и разгоне.'],
  ['xeon-e-2388g', 'Intel Xeon E-2388G', 8160, 132, 'Высокопроизводительный серверный процессор. +200% к заработку в обычном AFK и разгоне.'],
  ['xeon-w-1290p', 'Intel Xeon W-1290P', 7080, 124, 'Рабочая станция. +200% к заработку в обычном AFK и разгоне.']
], 0.44, [0.48, 2.70]);
addCatalog('CPU', 'AMD', 'Ryzen 3', [
  ['r3-3100', 'AMD Ryzen 3 3100', 300, 17], ['r3-4100', 'AMD Ryzen 3 4100', 370, 20]
], 0.72, [0.55, 2.15]);
addCatalog('CPU', 'AMD', 'Ryzen 5', [
  ['r5-3600', 'AMD Ryzen 5 3600', 650, 34], ['r5-5600', 'AMD Ryzen 5 5600', 850, 45], ['r5-7600', 'AMD Ryzen 5 7600', 1200, 58], ['r5-9600x', 'AMD Ryzen 5 9600X', 1700, 70]
], 0.68, [0.55, 2.30]);
addCatalog('CPU', 'AMD', 'Ryzen 7', [
  ['r7-5700x', 'AMD Ryzen 7 5700X', 1250, 57], ['r7-5800x3d', 'AMD Ryzen 7 5800X3D', 1900, 73], ['r7-7800x3d', 'AMD Ryzen 7 7800X3D', 3200, 95], ['r7-9700x', 'AMD Ryzen 7 9700X', 3000, 88]
], 0.52, [0.50, 2.55]);
addCatalog('CPU', 'AMD', 'Ryzen 9', [
  ['r9-5900x', 'AMD Ryzen 9 5900X', 2200, 78], ['r9-7900x', 'AMD Ryzen 9 7900X', 3500, 96], ['r9-7950x', 'AMD Ryzen 9 7950X', 4700, 116], ['r9-9950x', 'AMD Ryzen 9 9950X', 5200, 128], ['r9-9950x3d', 'AMD Ryzen 9 9950X3D', 5600, 136]
], 0.38, [0.45, 2.80]);

// GPU — расширенная линейка NVIDIA GT / GTX
addCatalog('GPU', 'NVIDIA', 'GT', [
  ['gt-610', 'GeForce GT 610', 35, 2], ['gt-710', 'GeForce GT 710', 50, 3], ['gt-730', 'GeForce GT 730', 75, 5],
  ['gt-1030', 'GeForce GT 1030', 130, 8], ['gt-1630', 'GeForce GT 1630', 190, 12]
], 0.92, [0.55, 1.80]);
addCatalog('GPU', 'NVIDIA', 'GTX', [
  ['gtx-1050', 'GeForce GTX 1050', 480, 17], ['gtx-1050ti', 'GeForce GTX 1050 Ti', 560, 20],
  ['gtx-1060', 'GeForce GTX 1060', 650, 23], ['gtx-1070', 'GeForce GTX 1070', 820, 29],
  ['gtx-1080', 'GeForce GTX 1080', 1050, 35], ['gtx-1080ti', 'GeForce GTX 1080 Ti', 1250, 40],
  ['gtx-1650', 'GeForce GTX 1650', 700, 24], ['gtx-1660s', 'GeForce GTX 1660 Super', 950, 32]
], 0.62, [0.45, 2.45]);
addCatalog('GPU', 'NVIDIA', 'RTX', [
  ['rtx-2060', 'GeForce RTX 2060', 1200, 40], ['rtx-2070', 'GeForce RTX 2070', 1550, 48], ['rtx-3060', 'GeForce RTX 3060', 1900, 57], ['rtx-4060', 'GeForce RTX 4060', 2200, 62],
  ['rtx-4070', 'GeForce RTX 4070', 4200, 82], ['rtx-4070s', 'GeForce RTX 4070 SUPER', 5000, 91], ['rtx-4080s', 'GeForce RTX 4080 SUPER', 7800, 118], ['rtx-4090', 'GeForce RTX 4090', 10500, 145], ['rtx-5090', 'GeForce RTX 5090', 16500, 180]
], 0.50, [0.45, 2.85]);
addCatalog('GPU', 'AMD', 'Radeon RX', [
  ['rx-5500xt', 'Radeon RX 5500 XT', 900, 31], ['rx-6600', 'Radeon RX 6600', 1600, 50], ['rx-6700xt', 'Radeon RX 6700 XT', 2500, 68],
  ['rx-7600', 'Radeon RX 7600', 2200, 62], ['rx-7700xt', 'Radeon RX 7700 XT', 3400, 77], ['rx-7800xt', 'Radeon RX 7800 XT', 4500, 88], ['rx-7900xt', 'Radeon RX 7900 XT', 6900, 110], ['rx-7900xtx', 'Radeon RX 7900 XTX', 8200, 128]
], 0.50, [0.45, 2.75]);
addCatalog('GPU', 'Intel', 'Arc', [
  ['arc-a580', 'Intel Arc A580', 1100, 39], ['arc-a750', 'Intel Arc A750', 1450, 48], ['arc-b580', 'Intel Arc B580', 2600, 67]
], 0.48, [0.45, 2.70]);

// RAM — 15 позиций
addCatalog('RAM', 'DDR3', 'Desktop', [
  ['ddr3-4', '4 GB DDR3', 60, 5], ['ddr3-8', '8 GB DDR3', 105, 9]
], 0.88, [0.60, 1.95]);
addCatalog('RAM', 'DDR4', 'Desktop', [
  ['ddr4-8', '8 GB DDR4', 120, 12], ['ddr4-16', '16 GB DDR4', 220, 18], ['ddr4-32', '32 GB DDR4', 410, 27], ['ddr4-64', '64 GB DDR4', 760, 39],
  ['ddr4-128', '128 GB DDR4', 1650, 52], ['ddr4-256', '256 GB DDR4', 3600, 68]
], 0.72, [0.50, 2.35]);
addCatalog('RAM', 'DDR5', 'Desktop', [
  ['ddr5-16', '16 GB DDR5', 380, 27], ['ddr5-32', '32 GB DDR5', 700, 40], ['ddr5-64', '64 GB DDR5', 1350, 58], ['ddr5-96', '96 GB DDR5', 2150, 76],
  ['ddr5-128', '128 GB DDR5', 3150, 92], ['ddr5-192', '192 GB DDR5', 4800, 105], ['ddr5-256', '256 GB DDR5', 6800, 118]
], 0.50, [0.45, 2.70]);

// Operating systems — обычные каталоговые компоненты, влияющие на мощность ПК.
addCatalog('OS', 'Microsoft', 'Windows XP', [
  ['windows-xp', 'Windows XP', 70, 1, 'Классическая Windows XP. Стартовая ОС хардкора.', 'Microsoft']
], 0.92, [0.55, 1.70]);
addCatalog('OS', 'Microsoft', 'Windows Vista', [
  ['windows-vista', 'Windows Vista', 105, 2, 'Windows Vista. Тяжелее XP, но слабее Windows 7.', 'Microsoft']
], 0.88, [0.55, 1.80]);
addCatalog('OS', 'Microsoft', 'Windows 7', [
  ['windows-7-lite', 'Windows 7 Lite', 140, 2, 'Урезанная версия Windows 7.', 'Microsoft'],
  ['windows-7-home', 'Windows 7 Home', 245, 3, 'Классическая домашняя Windows.', 'Microsoft']
], 0.84, [0.60, 1.90]);
addCatalog('OS', 'Microsoft', 'Windows 8.1', [
  ['windows-81-home', 'Windows 8.1 Home', 385, 5, 'Домашняя версия Windows 8.1. Стартовая ОС сложного режима.', 'Microsoft']
], 0.82, [0.58, 1.95]);
addCatalog('OS', 'Microsoft', 'Windows 10', [
  ['windows-10-home', 'Windows 10 Home', 560, 8, 'Домашняя Windows 10. Стартовая ОС лёгкого режима.', 'Microsoft'],
  ['windows-10-pro', 'Windows 10 Pro', 840, 12, 'Профессиональная Windows 10.', 'Microsoft']
], 0.74, [0.55, 2.15]);
addCatalog('OS', 'Microsoft', 'Windows 11', [
  ['windows-11-home', 'Windows 11 Home', 1120, 16, 'Домашняя Windows 11.', 'Microsoft'],
  ['windows-11-pro', 'Windows 11 Pro', 1680, 20, 'Профессиональная Windows 11.', 'Microsoft']
], 0.60, [0.50, 2.40]);
addCatalog('OS', 'Linux', 'Linux', [
  ['linux-mint', 'Linux Mint', 315, 7, 'Популярный Linux-дистрибутив.', 'Linux Mint'],
  ['ubuntu', 'Ubuntu', 455, 10, 'Универсальный Linux-дистрибутив.', 'Canonical'],
  ['debian', 'Debian', 420, 9, 'Стабильный универсальный Linux-дистрибутив.', 'Debian'],
  ['fedora', 'Fedora', 500, 11, 'Современный Linux-дистрибутив для рабочих систем.', 'Fedora'],
  ['arch', 'Arch Linux', 540, 12, 'Минималистичный Linux-дистрибутив с гибкой настройкой.', 'Arch'],
  ['opensuse', 'openSUSE', 470, 10, 'Linux-дистрибутив для универсального использования.', 'openSUSE']
], 0.72, [0.52, 2.25]);
addCatalog('OS', 'Apple', 'macOS', [
  ['macos', 'macOS 15 Sequoia', 1820, 20, 'Современная версия macOS.', 'Apple'],
  ['macos-14-sonoma', 'macOS 14 Sonoma', 1680, 19, 'Версия macOS поколения Sonoma.', 'Apple'],
  ['macos-13-ventura', 'macOS 13 Ventura', 1540, 18, 'Версия macOS поколения Ventura.', 'Apple'],
  ['macos-12-monterey', 'macOS 12 Monterey', 1420, 17, 'Версия macOS поколения Monterey.', 'Apple'],
  ['macos-11-big-sur', 'macOS 11 Big Sur', 1280, 16, 'Версия macOS поколения Big Sur.', 'Apple'],
  ['macos-10-15-catalina', 'macOS 10.15 Catalina', 1120, 14, 'Версия macOS поколения Catalina.', 'Apple'],
  ['macos-10-14-mojave', 'macOS 10.14 Mojave', 980, 13, 'Версия macOS поколения Mojave.', 'Apple']
], 0.38, [0.48, 2.65]);

const OS_OPTIONS = SHOP.filter((item) => item.category === 'OS').map((item) => [item.id, item.name]);

// Storage — 13 позиций
addCatalog('Storage', 'HDD', '5400 RPM', [
  ['hdd-64', '64 GB HDD (0.4 MB/s)', 20, 1], ['hdd-120', '120 GB HDD', 70, 2], ['hdd-500', '500 GB HDD', 90, 3], ['hdd-1tb-5400', '1 TB HDD 5400 RPM', 140, 5]
], 0.92, [0.60, 1.85]);
addCatalog('Storage', 'HDD', '7200 RPM', [
  ['hdd-1tb-7200', '1 TB HDD 7200 RPM', 170, 7], ['hdd-2tb-7200', '2 TB HDD 7200 RPM', 280, 9]
], 0.86, [0.60, 1.95]);
addCatalog('Storage', 'SSD', 'SATA', [
  ['ssd-256-sata', '256 GB SSD SATA', 140, 12], ['ssd-512-sata', '512 GB SSD SATA', 210, 16], ['ssd-1tb-sata', '1 TB SSD SATA', 340, 22]
], 0.84, [0.50, 2.20]);
addCatalog('Storage', 'SSD', 'NVMe', [
  ['ssd-500-nvme', '500 GB NVMe SSD', 250, 20], ['ssd-1tb-nvme', '1 TB NVMe SSD', 430, 29], ['ssd-2tb-nvme', '2 TB NVMe SSD', 760, 40], ['ssd-4tb-nvme', '4 TB NVMe SSD', 1450, 56], ['ssd-2tb-gen5', '2 TB PCIe 5.0 NVMe SSD', 1850, 70]
], 0.60, [0.45, 2.70]);

// PSU — 8 позиций
addCatalog('PSU', 'Power', 'Basic', [
  ['180', 'БП 180 W', 100, 2], ['300', 'БП 300 W', 180, 4], ['400', 'БП 400 W', 300, 5], ['450', 'БП 450 W', 360, 8]
], 0.88, [0.60, 1.85]);
addCatalog('PSU', 'Power', '80+ Bronze', [
  ['550-bronze', 'БП 550 W 80+ Bronze', 550, 8], ['650-bronze', 'БП 650 W 80+ Bronze', 800, 10], ['750-bronze', 'БП 750 W 80+ Bronze', 1200, 12]
], 0.76, [0.55, 2.15]);
addCatalog('PSU', 'Power', '80+ Gold', [
  ['850-gold', 'БП 850 W 80+ Gold', 2400, 17], ['1000-gold', 'БП 1000 W 80+ Gold', 4200, 21]
], 0.54, [0.50, 2.45]);

// Хардкор: карточка БП показывает только мощность. Сертификат выбирается после нажатия «Купить».
// Для каждого ватта есть 4 варианта: Standard → 80+ Bronze → 80+ Silver → 80+ Gold.
const HARDCORE_PSU_CERTS = [
  { key: 'standard', label: 'Стандарт', short: 'Standard', multiplier: 1, quality: 'базовый' },
  { key: 'bronze', label: '80+ Bronze', short: 'Bronze', multiplier: 1, quality: 'хороший базовый' },
  { key: 'silver', label: '80+ Silver', short: 'Silver', multiplier: 1, quality: 'повышенный' },
  { key: 'gold', label: '80+ Gold', short: 'Gold', multiplier: 1, quality: 'высокий' }
];
const HARDCORE_PSU_PERFORMANCE = { 180: 2, 300: 4, 400: 5, 450: 8, 550: 8, 650: 10, 750: 12, 850: 17, 1000: 21 };
const HARDCORE_PSU_WATTS = Object.keys(HARDCORE_PSU_PERFORMANCE).map(Number);
const HARDCORE_PSU_CERT_PRICE_ADD = { standard: 0, bronze: 150, silver: 300, gold: 500 };
const HARDCORE_PSU_BASE_PRICE = (watts) => Math.max(400, Math.round((900 * watts / 750) / 25) * 25);
HARDCORE_PSU_WATTS.forEach((watts) => {
  HARDCORE_PSU_CERTS.forEach((cert) => {
    const base = HARDCORE_PSU_BASE_PRICE(watts);
    const price = Math.max(400, Math.round(((base + HARDCORE_PSU_CERT_PRICE_ADD[cert.key]) * 3) / 25) * 25);
    const suffix = `hc-${watts}-${cert.key}`;
    addCatalog('PSU', 'Power', `${watts} W`, [[suffix, `БП ${watts} W ${cert.short}`, price, HARDCORE_PSU_PERFORMANCE[watts], `Хардкорный БП ${watts} W, сертификат ${cert.label}.`]], 0.95, [1, 1]);
    const item = SHOP[SHOP.length - 1];
    item.hardcoreOnly = true;
    item.psuWattage = watts;
    item.psuCertificate = cert.key;
    item.psuCertificateLabel = cert.label;
  });
});

// Cases — 7 позиций
addCatalog('Case', 'Case', 'Basic', [
  ['case-office', 'Офисный корпус', 90, 3], ['case-basic', 'Обычный корпус', 120, 5]
], 0.90, [0.60, 1.85]);
addCatalog('Case', 'Case', 'Airflow', [
  ['case-airflow', 'Корпус Airflow', 300, 8], ['case-mesh', 'Mesh-корпус', 380, 10]
], 0.72, [0.55, 2.15]);
addCatalog('Case', 'Case', 'Premium', [
  ['case-glass', 'Стеклянный корпус', 650, 11], ['case-dual-chamber', 'Dual-Chamber корпус', 900, 14], ['case-showcase', 'Showcase корпус', 1300, 16]
], 0.48, [0.50, 2.50]);

// Motherboards — 12 позиций
addCatalog('Motherboard', 'Intel', 'H410', [
  ['mb-h410-basic', 'H410 базовая плата', 195, 5]
], 0.86, [0.60, 1.90]);
addCatalog('Motherboard', 'Intel', 'B560', [
  ['mb-b560', 'B560 материнская плата', 375, 8], ['mb-b560-gaming', 'B560 Gaming', 510, 11]
], 0.78, [0.55, 2.00]);
addCatalog('Motherboard', 'Intel', 'B660 / B760', [
  ['mb-b660', 'B660 материнская плата', 630, 14], ['mb-b760', 'MSI PRO B760-P WIFI', 780, 17], ['mb-b760-ddr4', 'MSI PRO B760-P WIFI DDR4', 840, 19], ['mb-b760-wifi', 'B760 Wi-Fi Gaming', 1035, 22]
], 0.66, [0.50, 2.35]);
addCatalog('Motherboard', 'Intel', 'Z690 / Z790', [
  ['mb-z690', 'Z690 материнская плата', 1275, 25], ['mb-z790', 'Z790 материнская плата', 1725, 30]
], 0.46, [0.45, 2.65]);
addCatalog('Motherboard', 'Intel', 'B860 / Z890', [
  ['mb-b860', 'B860 материнская плата', 1575, 28], ['mb-z890', 'Z890 материнская плата', 2250, 36]
], 0.44, [0.45, 2.70]);
addCatalog('Motherboard', 'Intel', 'Z790 / Z890 High Capacity', [
  ['mb-z790-256', 'GIGABYTE Z790 AORUS MASTER X', 6300, 45], ['mb-z890-256', 'ASUS ROG MAXIMUS Z890 EXTREME', 9300, 52]
], 0.34, [0.42, 2.80]);
addCatalog('Motherboard', 'AMD', 'A320', [
  ['mb-a320', 'A320 материнская плата', 180, 5]
], 0.76, [0.60, 1.95]);
addCatalog('Motherboard', 'AMD', 'B450 / B550', [
  ['mb-b450', 'B450 материнская плата', 330, 9], ['mb-b550', 'B550 материнская плата', 540, 14], ['mb-b550-wifi', 'B550 Wi-Fi Gaming', 720, 18]
], 0.70, [0.50, 2.20]);
addCatalog('Motherboard', 'AMD', 'B650 / X670 / X870', [
  ['mb-b650', 'B650 материнская плата', 930, 21], ['mb-x670', 'X670 материнская плата', 1425, 28], ['mb-x870', 'X870 материнская плата', 1875, 34]
], 0.48, [0.45, 2.65]);
addCatalog('Motherboard', 'AMD', 'X870 High Capacity', [
  ['mb-x870e-256', 'MSI MEG X870E ACE', 8550, 48]
], 0.34, [0.42, 2.80]);

// Реальные производители материнских плат и их CPU-платформа.
const MOTHERBOARD_META = {
  'mb-h410-basic': ['GIGABYTE H410M H', 'GIGABYTE', 'Intel'],
  'mb-b560': ['MSI B560M PRO-VDH', 'MSI', 'Intel'],
  'mb-b560-gaming': ['ASUS TUF GAMING B560-PLUS', 'ASUS', 'Intel'],
  'mb-b660': ['GIGABYTE B660M DS3H', 'GIGABYTE', 'Intel'],
  'mb-b760': ['MSI PRO B760-P WIFI', 'MSI', 'Intel'],
  'mb-b760-ddr4': ['MSI PRO B760-P WIFI DDR4', 'MSI', 'Intel'],
  'mb-b760-wifi': ['ASUS TUF GAMING B760-PLUS WIFI', 'ASUS', 'Intel'],
  'mb-z690': ['GIGABYTE Z690 AORUS ELITE', 'GIGABYTE', 'Intel'],
  'mb-z790': ['MSI MAG Z790 TOMAHAWK WIFI', 'MSI', 'Intel'],
  'mb-b860': ['GIGABYTE B860 AORUS ELITE', 'GIGABYTE', 'Intel'],
  'mb-z890': ['ASUS ROG STRIX Z890-E', 'ASUS', 'Intel'],
  'mb-z790-256': ['GIGABYTE Z790 AORUS MASTER X', 'GIGABYTE', 'Intel'],
  'mb-z890-256': ['ASUS ROG MAXIMUS Z890 EXTREME', 'ASUS', 'Intel'],
  'mb-a320': ['ASUS PRIME A320M-K', 'ASUS', 'AMD'],
  'mb-b450': ['MSI B450M PRO-VDH MAX', 'MSI', 'AMD'],
  'mb-b550': ['GIGABYTE B550 AORUS ELITE', 'GIGABYTE', 'AMD'],
  'mb-b550-wifi': ['ASUS TUF GAMING B550-PLUS WIFI', 'ASUS', 'AMD'],
  'mb-b650': ['MSI PRO B650-S WIFI', 'MSI', 'AMD'],
  'mb-x670': ['GIGABYTE X670 AORUS ELITE AX', 'GIGABYTE', 'AMD'],
  'mb-x870': ['ASUS ROG STRIX X870-E', 'ASUS', 'AMD'],
  'mb-x870e-256': ['MSI MEG X870E ACE', 'MSI', 'AMD']
};
Object.entries(MOTHERBOARD_META).forEach(([id, [name, manufacturer, platform]]) => {
  const item = SHOP.find((entry) => entry.id === `motherboard-${id}`);
  if (item) { item.name = name; item.manufacturer = manufacturer; item.group = platform; }
});

// Cooling — 8 позиций
addCatalog('Cooling', 'Air', 'Stock', [
  ['cooler-stock', 'Стоковый кулер', 60, 2], ['cooler-basic', 'Базовый кулер', 120, 3]
], 0.92, [0.60, 1.80]);
addCatalog('Cooling', 'Air', 'Tower', [
  ['cooler-tower', 'Башенный кулер', 350, 8], ['cooler-dual-tower', 'Двухбашенный кулер', 650, 13], ['cooler-premium-air', 'Премиум Air Cooler', 900, 16]
], 0.68, [0.55, 2.25]);
addCatalog('Cooling', 'Liquid', 'AIO', [
  ['cooler-aio-240', 'СЖО 240 мм', 1200, 17], ['cooler-aio-360', 'СЖО 360 мм', 1900, 24], ['cooler-aio-420', 'СЖО 420 мм', 3000, 29]
], 0.52, [0.50, 2.55]);

// Стартовые детали не продаются, но участвуют в сборке и могут отображаться в слоте.
function addStarter(id, category, name, performance) {
  SHOP.push({ id, category, group: 'Starter', series: 'Starter', name, performance, starter: true, desc: 'Стартовая деталь режима.' });
}

addStarter('starter-easy-cpu', 'CPU', 'Бюджетный процессор', 20);
addStarter('starter-easy-ram', 'RAM', '8 GB DDR3', 9);
addStarter('starter-easy-gpu', 'GPU', 'Бюджетная видеокарта', 25);
addStarter('starter-easy-storage', 'Storage', '256 ГБ SSD', 10);
addStarter('starter-easy-case', 'Case', 'Обычный корпус', 5);
addStarter('starter-easy-mb', 'Motherboard', 'Бюджетная материнская плата', 10);
addStarter('starter-easy-cooling', 'Cooling', 'Штатный кулер', 5);

addStarter('starter-hard-gpu', 'GPU', 'Встроенная графика', 8);
addStarter('starter-hard-case', 'Case', 'Старый корпус', 4);
addStarter('starter-hard-mb', 'Motherboard', 'MSI PRO 1200-D3', 5);
addStarter('starter-hard-cooling', 'Cooling', 'Штатный кулер', 4);

addStarter('starter-hardcore-cpu', 'CPU', 'Intel Celeron G5905', 8);
addStarter('starter-hardcore-ram', 'RAM', '2 ГБ DDR3', 2);
addStarter('starter-hardcore-gpu', 'GPU', 'Встроенная графика', 2);
addStarter('starter-hardcore-mb', 'Motherboard', 'GIGABYTE H1200-D3', 1);
addStarter('starter-hardcore-cooling', 'Cooling', 'Штатный кулер', 1);



// ===== v2.0.9 — technical metadata for Problem Mode =====
const GPU_TECH_METADATA = {
  'gpu-gt-610': { gddr: 'DDR3', vramGb: 1 },
  'gpu-gt-710': { gddr: 'DDR3', vramGb: 2 },
  'gpu-gt-730': { gddr: 'GDDR5', vramGb: 2 },
  'gpu-gt-1030': { gddr: 'GDDR5', vramGb: 2 },
  'gpu-gt-1630': { gddr: 'GDDR6', vramGb: 4 },
  'gpu-gtx-1050': { gddr: 'GDDR5', vramGb: 2 },
  'gpu-gtx-1050ti': { gddr: 'GDDR5', vramGb: 4 },
  'gpu-gtx-1060': { gddr: 'GDDR5', vramGb: 6 },
  'gpu-gtx-1070': { gddr: 'GDDR5', vramGb: 8 },
  'gpu-gtx-1080': { gddr: 'GDDR5X', vramGb: 8 },
  'gpu-gtx-1080ti': { gddr: 'GDDR5X', vramGb: 11 },
  'gpu-gtx-1650': { gddr: 'GDDR5', vramGb: 4 },
  'gpu-gtx-1660s': { gddr: 'GDDR6', vramGb: 6 },
  'gpu-rtx-2060': { gddr: 'GDDR6', vramGb: 6 },
  'gpu-rtx-2070': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rtx-3060': { gddr: 'GDDR6', vramGb: 12 },
  'gpu-rtx-4060': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rtx-4070': { gddr: 'GDDR6X', vramGb: 12 },
  'gpu-rtx-4070s': { gddr: 'GDDR6X', vramGb: 12 },
  'gpu-rtx-4080s': { gddr: 'GDDR6X', vramGb: 16 },
  'gpu-rtx-4090': { gddr: 'GDDR6X', vramGb: 24 },
  'gpu-rtx-5090': { gddr: 'GDDR7', vramGb: 32 },
  'gpu-rx-5500xt': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rx-6600': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rx-6700xt': { gddr: 'GDDR6', vramGb: 12 },
  'gpu-rx-7600': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rx-7700xt': { gddr: 'GDDR6', vramGb: 12 },
  'gpu-rx-7800xt': { gddr: 'GDDR6', vramGb: 16 },
  'gpu-rx-7900xt': { gddr: 'GDDR6', vramGb: 20 },
  'gpu-rx-7900xtx': { gddr: 'GDDR6', vramGb: 24 },
  'gpu-arc-a580': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-arc-a750': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-arc-b580': { gddr: 'GDDR6', vramGb: 12 }
};
Object.entries(GPU_TECH_METADATA).forEach(([id, meta]) => {
  const item = SHOP.find(entry => entry.id === id);
  if (item) Object.assign(item, meta);
});

function inferredReleaseYear(item) {
  if (!item) return null;
  const id = String(item.id || '');
  if (item.category === 'CPU') {
    const exact = {
      'cpu-j2900': 2013, 'cpu-cel-g5905': 2020, 'cpu-cel-g6900': 2022,
      'cpu-pentium-g6400': 2020, 'cpu-pentium-g7400': 2022,
      'cpu-i3-10100': 2020, 'cpu-i3-12100f': 2022, 'cpu-i3-13100f': 2023,
      'cpu-i5-10400f': 2020, 'cpu-i5-12400f': 2022, 'cpu-i5-13400f': 2023, 'cpu-i5-14600k': 2023,
      'cpu-i7-10700k': 2020, 'cpu-i7-12700k': 2021, 'cpu-i7-13700k': 2022, 'cpu-i7-14700k': 2023,
      'cpu-i9-11900k': 2021, 'cpu-i9-12900k': 2021, 'cpu-i9-13900k': 2022, 'cpu-i9-14900k': 2023,
      'cpu-ultra5-245k': 2024, 'cpu-ultra7-265k': 2024, 'cpu-ultra9-285k': 2024,
      'cpu-xeon-e-2336': 2021, 'cpu-xeon-e-2388g': 2021, 'cpu-xeon-w-1290p': 2020,
      'cpu-r3-3100': 2020, 'cpu-r3-4100': 2022,
      'cpu-r5-3600': 2019, 'cpu-r5-5600': 2022, 'cpu-r5-7600': 2022, 'cpu-r5-9600x': 2024,
      'cpu-r7-5700x': 2022, 'cpu-r7-5800x3d': 2022, 'cpu-r7-7800x3d': 2023, 'cpu-r7-9700x': 2024,
      'cpu-r9-5900x': 2020, 'cpu-r9-7900x': 2022, 'cpu-r9-7950x': 2022, 'cpu-r9-9950x': 2024, 'cpu-r9-9950x3d': 2025
    };
    if (exact[id]) return exact[id];
  }
  if (item.category === 'GPU') {
    const exact = {
      'gpu-gt-610': 2012, 'gpu-gt-710': 2014, 'gpu-gt-730': 2014, 'gpu-gt-1030': 2017, 'gpu-gt-1630': 2022,
      'gpu-gtx-1050': 2016, 'gpu-gtx-1050ti': 2016, 'gpu-gtx-1060': 2016, 'gpu-gtx-1070': 2016, 'gpu-gtx-1080': 2016, 'gpu-gtx-1080ti': 2017,
      'gpu-gtx-1650': 2019, 'gpu-gtx-1660s': 2019,
      'gpu-rtx-2060': 2019, 'gpu-rtx-2070': 2018, 'gpu-rtx-3060': 2021, 'gpu-rtx-4060': 2023,
      'gpu-rtx-4070': 2023, 'gpu-rtx-4070s': 2024, 'gpu-rtx-4080s': 2024, 'gpu-rtx-4090': 2022, 'gpu-rtx-5090': 2025,
      'gpu-rx-5500xt': 2019, 'gpu-rx-6600': 2021, 'gpu-rx-6700xt': 2021, 'gpu-rx-7600': 2023, 'gpu-rx-7700xt': 2023,
      'gpu-rx-7800xt': 2023, 'gpu-rx-7900xt': 2023, 'gpu-rx-7900xtx': 2022,
      'gpu-arc-a580': 2023, 'gpu-arc-a750': 2022, 'gpu-arc-b580': 2024
    };
    if (exact[id]) return exact[id];
  }
  if (item.category === 'Motherboard') {
    if (/b860/.test(id)) return 2025;
    if (/z890/.test(id)) return 2024;
    if (/b760/.test(id)) return 2023;
    if (id === 'motherboard-mb-z790-256') return 2023;
    if (/z790/.test(id)) return 2022;
    if (/b660|z690/.test(id)) return 2021;
    if (/b560/.test(id)) return 2021;
    if (/h410/.test(id)) return 2020;
    if (/a320/.test(id)) return 2017;
    if (/b450/.test(id)) return 2018;
    if (/b550/.test(id)) return 2020;
    if (/b650|x670/.test(id)) return 2022;
    if (/x870/.test(id)) return 2024;
  }
  if (item.category === 'RAM') return item.group === 'DDR3' ? 2007 : item.group === 'DDR4' ? 2014 : 2020;
  if (item.category === 'OS') {
    if (/windows-xp/.test(id)) return 2001; if (/vista/.test(id)) return 2006; if (/windows-7/.test(id)) return 2009;
    if (/windows-81/.test(id)) return 2013; if (/windows-10/.test(id)) return 2015; if (/windows-11/.test(id)) return 2021;
    if (/macos-15|^os-macos$/.test(id)) return 2024; if (/macos-14/.test(id)) return 2023; if (/macos-13/.test(id)) return 2022;
    if (/macos-12/.test(id)) return 2021; if (/macos-11/.test(id)) return 2020; if (/macos-10-15/.test(id)) return 2019; if (/macos-10-14/.test(id)) return 2018;
    return 2022;
  }
  if (item.category === 'Storage') {
    if (/gen5/.test(id)) return 2023;
    if (/nvme/.test(id)) return 2019;
    if (/ssd-/.test(id)) return 2017;
    return 2014;
  }
  return null;
}
SHOP.forEach(item => { if (item.releaseYear == null) item.releaseYear = inferredReleaseYear(item); });

// Старые ID больше не добавляются в SHOP: устаревшие позиции удалены из каталога.
// Для совместимости старых сохранений оставляем только таблицу миграции ID.
const LEGACY_ID_MAP = {
  'cpu-i3': 'cpu-i3-10100',
  'cpu-i5': 'cpu-i5-10400f',
  'cpu-i7': 'cpu-i7-10700k',
  'cpu-ryzen3': 'cpu-r3-3100',
  'cpu-ryzen5': 'cpu-r5-3600',
  'cpu-ryzen7': 'cpu-r7-5700x',
  'gpu-gtx1650': 'gpu-gtx-1650',
  'gpu-rtx3060': 'gpu-rtx-3060',
  'gpu-rtx4070': 'gpu-rtx-4070',
  'gpu-rx6600': 'gpu-rx-6600',
  'gpu-rx7800': 'gpu-rx-7800xt',
  'gpu-arc-a750': 'gpu-arc-a750',
  'ram-ddr3': 'ram-ddr3-4',
  'starter-hard-cpu': 'cpu-j2900',
  'j2900': 'cpu-j2900',
  'cpu-pentium-j2900': 'cpu-j2900',
  'starter-easy-cpu': 'cpu-i3-10100',
  'starter-easy-gpu': 'gpu-gt-1030',
  'starter-hard-ram': 'ram-ddr3-4',
  'ram-ddr4-8': 'ram-ddr4-8',
  'ram-ddr4-16': 'ram-ddr4-16',
  'ram-ddr5-16': 'ram-ddr5-16',
  'ram-ddr5-32': 'ram-ddr5-32',
  'hdd-64': 'storage-hdd-64',
  'hdd-120': 'storage-hdd-120',
  'starter-hardcore-storage': 'storage-hdd-64',
  'hdd-500': 'storage-hdd-500',
  'ssd-sata': 'storage-ssd-256-sata',
  'ssd-nvme': 'storage-ssd-1tb-nvme',
  'psu-550': 'psu-550-bronze',
  'psu-850': 'psu-850-gold',
  'case-basic': 'case-case-basic',
  'case-air': 'case-case-airflow',
  'mb-basic': 'motherboard-mb-h410-basic',
  'mb-gaming': 'motherboard-mb-b560-gaming',
  'cooler-basic': 'cooling-cooler-basic',
  'cooler-tower': 'cooling-cooler-tower',
  'windows-11': 'os-windows-11-home',
  'macos': 'os-macos',
  'linux': 'os-linux-mint'
};

function migrateLegacyIds(target) {
  if (!target) return;
  const migrateMap = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.entries(LEGACY_ID_MAP).forEach(([oldId, newId]) => {
      if (obj[oldId] === undefined) return;
      if (obj[newId] === undefined) obj[newId] = obj[oldId];
      delete obj[oldId];
    });
  };
  migrateMap(target.owned);
  migrateMap(target.broken);
  if (target.installed && typeof target.installed === 'object') {
    Object.entries(target.installed).forEach(([category, id]) => {
      if (LEGACY_ID_MAP[id]) target.installed[category] = LEGACY_ID_MAP[id];
    });
  }
  if (target.market?.items) {
    Object.entries(LEGACY_ID_MAP).forEach(([oldId, newId]) => {
      if (target.market.items[oldId] !== undefined && target.market.items[newId] === undefined) target.market.items[newId] = target.market.items[oldId];
      delete target.market.items[oldId];
    });
  }
}

const HARDCORE_CATALOG = {
  GPU: { NVIDIA: ['GT', 'GTX', 'RTX'], AMD: ['Radeon RX'], Intel: ['Arc'] },
  CPU: { Intel: ['Celeron', 'Pentium', 'Core i3', 'Core i5', 'Core i7', 'Core i9', 'Core Ultra', 'Xeon'], AMD: ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'] },
  RAM: { DDR3: ['Desktop'], DDR4: ['Desktop'], DDR5: ['Desktop'] },
  Storage: { HDD: ['5400 RPM', '7200 RPM'], SSD: ['SATA', 'NVMe'] },
  PSU: { Power: HARDCORE_PSU_WATTS.map((watts) => `${watts} W`) },
  Case: { Case: ['Basic', 'Airflow', 'Premium'] },
  Motherboard: { Intel: ['H410', 'B560', 'B660 / B760', 'Z690 / Z790', 'B860 / Z890', 'Z790 / Z890 High Capacity'], AMD: ['A320', 'B450 / B550', 'B650 / X670 / X870', 'X870 High Capacity'] },
  Cooling: { Air: ['Stock', 'Tower'], Liquid: ['AIO'] },
  OS: { Microsoft: ['Windows XP', 'Windows Vista', 'Windows 7', 'Windows 8.1', 'Windows 10', 'Windows 11'], Linux: ['Linux'], Apple: ['macOS'] }
};

const EASY_CATEGORIES = [...CATEGORIES];
const NORMAL_CATEGORIES = [...CATEGORIES];
