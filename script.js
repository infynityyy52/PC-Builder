const GAME_VERSION = 'v1.11.0';

const MODE_CONFIG = {
  easy: {
    label: 'Лёгкий',
    money: 500,
    baseReward: 40,
    start: {
      CPU: 'starter-easy-cpu', RAM: 'starter-easy-ram', GPU: 'starter-easy-gpu', Storage: 'starter-easy-storage',
      PSU: 'psu-450', Case: 'starter-easy-case', Motherboard: 'starter-easy-mb', Cooling: 'starter-easy-cooling'
    }
  },
  hard: {
    label: 'Сложный',
    money: 100,
    baseReward: 20,
    start: {
      CPU: 'starter-hard-cpu', RAM: 'starter-hard-ram', GPU: 'starter-hard-gpu', Storage: 'starter-hard-storage',
      PSU: 'psu-300', Case: 'starter-hard-case', Motherboard: 'starter-hard-mb', Cooling: 'starter-hard-cooling'
    }
  },
  hardcore: {
    label: 'Хардкор',
    money: 0,
    baseReward: 8,
    start: {
      CPU: 'cpu-cel-g5905', RAM: 'starter-hardcore-ram', GPU: 'starter-hardcore-gpu', Storage: 'starter-hardcore-storage',
      PSU: 'psu-180', Case: null, Motherboard: 'starter-hardcore-mb', Cooling: 'starter-hardcore-cooling'
    }
  }
};

const CATEGORY_LABELS = {
  GPU: 'Видеокарты', CPU: 'Процессоры', RAM: 'Оперативная память', Storage: 'Накопители',
  PSU: 'Блоки питания', Case: 'Корпуса', Motherboard: 'Материнские платы', Cooling: 'Охлаждение'
};

const MAIN_PART_LABELS_EASY = {
  CPU: 'Процессор', RAM: 'Оперативная память', GPU: 'Видеокарта', Storage: 'Накопитель',
  PSU: 'Блок питания', Case: 'Корпус', Motherboard: 'Материнская плата', Cooling: 'Охлаждение'
};

const CATEGORIES = ['GPU', 'CPU', 'RAM', 'Storage', 'PSU', 'Case', 'Motherboard', 'Cooling'];

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
  ['pentium-g6400', 'Intel Pentium Gold G6400', 120, 11], ['pentium-g7400', 'Intel Pentium Gold G7400', 220, 18]
], 0.80, [0.55, 2.05]);
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
  ['r9-5900x', 'AMD Ryzen 9 5900X', 2200, 78], ['r9-7900x', 'AMD Ryzen 9 7900X', 3500, 96], ['r9-7950x', 'AMD Ryzen 9 7950X', 4700, 116], ['r9-9950x', 'AMD Ryzen 9 9950X', 5200, 128]
], 0.38, [0.45, 2.80]);

// GPU — 20 позиций
addCatalog('GPU', 'NVIDIA', 'GTX', [
  ['gtx-1650', 'GeForce GTX 1650', 700, 24], ['gtx-1660s', 'GeForce GTX 1660 Super', 950, 32]
], 0.62, [0.45, 2.45]);
addCatalog('GPU', 'NVIDIA', 'RTX', [
  ['rtx-2060', 'GeForce RTX 2060', 1200, 40], ['rtx-3060', 'GeForce RTX 3060', 1900, 57], ['rtx-4060', 'GeForce RTX 4060', 2200, 62],
  ['rtx-4070', 'GeForce RTX 4070', 4200, 82], ['rtx-4070s', 'GeForce RTX 4070 SUPER', 5000, 91], ['rtx-4080s', 'GeForce RTX 4080 SUPER', 7800, 118], ['rtx-4090', 'GeForce RTX 4090', 10500, 145], ['rtx-5090', 'GeForce RTX 5090', 16500, 180]
], 0.50, [0.45, 2.85]);
addCatalog('GPU', 'AMD', 'Radeon RX', [
  ['rx-5500xt', 'Radeon RX 5500 XT', 900, 31], ['rx-6600', 'Radeon RX 6600', 1600, 50], ['rx-6700xt', 'Radeon RX 6700 XT', 2500, 68],
  ['rx-7600', 'Radeon RX 7600', 2200, 62], ['rx-7700xt', 'Radeon RX 7700 XT', 3400, 77], ['rx-7800xt', 'Radeon RX 7800 XT', 4500, 88], ['rx-7900xt', 'Radeon RX 7900 XT', 6900, 110], ['rx-7900xtx', 'Radeon RX 7900 XTX', 8200, 128]
], 0.50, [0.45, 2.75]);
addCatalog('GPU', 'Intel', 'Arc', [
  ['arc-a580', 'Intel Arc A580', 1100, 39], ['arc-a750', 'Intel Arc A750', 1450, 48], ['arc-b580', 'Intel Arc B580', 2600, 67]
], 0.48, [0.45, 2.70]);

// RAM — 10 позиций
addCatalog('RAM', 'DDR3', 'Desktop', [
  ['ddr3-4', '4 GB DDR3', 60, 5], ['ddr3-8', '8 GB DDR3', 105, 9]
], 0.88, [0.60, 1.95]);
addCatalog('RAM', 'DDR4', 'Desktop', [
  ['ddr4-8', '8 GB DDR4', 120, 12], ['ddr4-16', '16 GB DDR4', 220, 18], ['ddr4-32', '32 GB DDR4', 410, 27], ['ddr4-64', '64 GB DDR4', 760, 39],
  ['ddr4-128', '128 GB DDR4', 1650, 52], ['ddr4-256', '256 GB DDR4', 3600, 68]
], 0.72, [0.50, 2.35]);
addCatalog('RAM', 'DDR5', 'Desktop', [
  ['ddr5-16', '16 GB DDR5', 380, 27], ['ddr5-32', '32 GB DDR5', 700, 40], ['ddr5-64', '64 GB DDR5', 1350, 58], ['ddr5-96', '96 GB DDR5', 2150, 76],
  ['ddr5-128', '128 GB DDR5', 3150, 92], ['ddr5-256', '256 GB DDR5', 6800, 118]
], 0.50, [0.45, 2.70]);

// Storage — 13 позиций
addCatalog('Storage', 'HDD', '5400 RPM', [
  ['hdd-64', '64 GB HDD (0.4 MB/s)', 20, 1], ['hdd-500', '500 GB HDD', 90, 3], ['hdd-1tb-5400', '1 TB HDD 5400 RPM', 140, 5]
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
  ['mb-h410-basic', 'H410 базовая плата', 130, 5]
], 0.86, [0.60, 1.90]);
addCatalog('Motherboard', 'Intel', 'B560', [
  ['mb-b560', 'B560 материнская плата', 250, 8], ['mb-b560-gaming', 'B560 Gaming', 340, 11]
], 0.78, [0.55, 2.00]);
addCatalog('Motherboard', 'Intel', 'B660 / B760', [
  ['mb-b660', 'B660 материнская плата', 420, 14], ['mb-b760', 'B760 материнская плата', 520, 17], ['mb-b760-wifi', 'B760 Wi-Fi Gaming', 690, 22]
], 0.66, [0.50, 2.35]);
addCatalog('Motherboard', 'Intel', 'Z690 / Z790', [
  ['mb-z690', 'Z690 материнская плата', 850, 25], ['mb-z790', 'Z790 материнская плата', 1150, 30]
], 0.46, [0.45, 2.65]);
addCatalog('Motherboard', 'Intel', 'B860 / Z890', [
  ['mb-b860', 'B860 материнская плата', 1050, 28], ['mb-z890', 'Z890 материнская плата', 1500, 36]
], 0.44, [0.45, 2.70]);
addCatalog('Motherboard', 'Intel', 'Z790 / Z890 High Capacity', [
  ['mb-z790-256', 'GIGABYTE Z790 AORUS MASTER X', 4200, 45], ['mb-z890-256', 'ASUS ROG MAXIMUS Z890 EXTREME', 6200, 52]
], 0.34, [0.42, 2.80]);
addCatalog('Motherboard', 'AMD', 'A320', [
  ['mb-a320', 'A320 материнская плата', 120, 5]
], 0.76, [0.60, 1.95]);
addCatalog('Motherboard', 'AMD', 'B450 / B550', [
  ['mb-b450', 'B450 материнская плата', 220, 9], ['mb-b550', 'B550 материнская плата', 360, 14], ['mb-b550-wifi', 'B550 Wi-Fi Gaming', 480, 18]
], 0.70, [0.50, 2.20]);
addCatalog('Motherboard', 'AMD', 'B650 / X670 / X870', [
  ['mb-b650', 'B650 материнская плата', 620, 21], ['mb-x670', 'X670 материнская плата', 950, 28], ['mb-x870', 'X870 материнская плата', 1250, 34]
], 0.48, [0.45, 2.65]);
addCatalog('Motherboard', 'AMD', 'X870 High Capacity', [
  ['mb-x870e-256', 'MSI MEG X870E ACE', 5700, 48]
], 0.34, [0.42, 2.80]);

// Реальные производители материнских плат и их CPU-платформа.
const MOTHERBOARD_META = {
  'mb-h410-basic': ['GIGABYTE H410M H', 'GIGABYTE', 'Intel'],
  'mb-b560': ['MSI B560M PRO-VDH', 'MSI', 'Intel'],
  'mb-b560-gaming': ['ASUS TUF GAMING B560-PLUS', 'ASUS', 'Intel'],
  'mb-b660': ['GIGABYTE B660M DS3H', 'GIGABYTE', 'Intel'],
  'mb-b760': ['MSI PRO B760-P WIFI', 'MSI', 'Intel'],
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
addStarter('starter-easy-ram', 'RAM', '8 GB', 12);
addStarter('starter-easy-gpu', 'GPU', 'Бюджетная видеокарта', 25);
addStarter('starter-easy-storage', 'Storage', '256 ГБ SSD', 10);
addStarter('starter-easy-case', 'Case', 'Обычный корпус', 5);
addStarter('starter-easy-mb', 'Motherboard', 'Бюджетная материнская плата', 10);
addStarter('starter-easy-cooling', 'Cooling', 'Штатный кулер', 5);

addStarter('starter-hard-cpu', 'CPU', 'Intel Pentium J2900', 10);
addStarter('starter-hard-ram', 'RAM', '4 ГБ', 5);
addStarter('starter-hard-gpu', 'GPU', 'Встроенная графика', 8);
addStarter('starter-hard-storage', 'Storage', '120 ГБ HDD', 5);
addStarter('starter-hard-case', 'Case', 'Старый корпус', 4);
addStarter('starter-hard-mb', 'Motherboard', 'Старая материнская плата', 5);
addStarter('starter-hard-cooling', 'Cooling', 'Штатный кулер', 4);

addStarter('starter-hardcore-cpu', 'CPU', 'Intel Celeron G5905', 8);
addStarter('starter-hardcore-ram', 'RAM', '2 ГБ DDR3', 2);
addStarter('starter-hardcore-gpu', 'GPU', 'Встроенная графика', 2);
addStarter('starter-hardcore-storage', 'Storage', '64 ГБ HDD (0.4 МБ/с)', 1);
addStarter('starter-hardcore-mb', 'Motherboard', 'Начальная материнская плата', 1);
addStarter('starter-hardcore-cooling', 'Cooling', 'Штатный кулер', 1);

// Алиасы старых ID из v0.4/v0.5: нужны только для миграции старых сохранений.
// Они не показываются в новом каталоге и не участвуют в новом рынке.
const LEGACY_ITEMS = [
  ['cpu-i3', 'CPU', 'Intel', 'Core i3', 'Intel Core i3-class', 500, 35],
  ['cpu-i5', 'CPU', 'Intel', 'Core i5', 'Intel Core i5', 1200, 70],
  ['cpu-i7', 'CPU', 'Intel', 'Core i7', 'Intel Core i7', 2600, 120],
  ['cpu-ryzen3', 'CPU', 'AMD', 'Ryzen 3', 'AMD Ryzen 3', 450, 32],
  ['cpu-ryzen5', 'CPU', 'AMD', 'Ryzen 5', 'AMD Ryzen 5', 1100, 68],
  ['cpu-ryzen7', 'CPU', 'AMD', 'Ryzen 7', 'AMD Ryzen 7', 2400, 115],
  ['gpu-gtx1650', 'GPU', 'NVIDIA', 'GTX', 'GeForce GTX 1650', 900, 45],
  ['gpu-rtx3060', 'GPU', 'NVIDIA', 'RTX', 'GeForce RTX 3060', 2200, 90],
  ['gpu-rtx4070', 'GPU', 'NVIDIA', 'RTX', 'GeForce RTX 4070', 5500, 180],
  ['gpu-rx6600', 'GPU', 'AMD', 'Radeon RX', 'Radeon RX 6600', 1800, 75],
  ['gpu-rx7800', 'GPU', 'AMD', 'Radeon RX', 'Radeon RX 7800 XT', 4800, 165],
  ['gpu-arc-a750', 'GPU', 'Intel', 'Arc', 'Intel Arc A750', 1700, 70],
  ['ram-ddr3', 'RAM', 'DDR3', 'Desktop', 'RAM 4 GB DDR3', 80, 8],
  ['ram-ddr4-8', 'RAM', 'DDR4', 'Desktop', 'RAM 8 GB DDR4', 150, 15],
  ['ram-ddr4-16', 'RAM', 'DDR4', 'Desktop', 'RAM 16 GB DDR4', 300, 30],
  ['ram-ddr5-16', 'RAM', 'DDR5', 'Desktop', 'RAM 16 GB DDR5', 500, 42],
  ['ram-ddr5-32', 'RAM', 'DDR5', 'Desktop', 'RAM 32 GB DDR5', 900, 60],
  ['hdd-64', 'Storage', 'HDD', '5400 RPM', 'HDD 64 GB (0.4 MB/s)', 20, 1],
  ['hdd-500', 'Storage', 'HDD', '7200 RPM', 'HDD 500 GB', 90, 5],
  ['ssd-sata', 'Storage', 'SSD', 'SATA', 'SSD 256 GB SATA', 160, 12],
  ['ssd-nvme', 'Storage', 'SSD', 'NVMe', 'NVMe SSD 1 TB', 500, 28],
  ['psu-300', 'PSU', 'Power', 'Basic', 'БП 300 W', 90, 5],
  ['psu-550', 'PSU', 'Power', '80+ Bronze', 'БП 550 W 80+ Bronze', 220, 16],
  ['psu-850', 'PSU', 'Power', '80+ Gold', 'БП 850 W 80+ Gold', 550, 30],
  ['case-basic', 'Case', 'Case', 'Basic', 'Обычный корпус', 120, 3],
  ['case-air', 'Case', 'Case', 'Airflow', 'Корпус Airflow', 300, 10],
  ['mb-basic', 'Motherboard', 'Motherboard', 'Basic', 'Базовая материнская плата', 180, 8],
  ['mb-gaming', 'Motherboard', 'Motherboard', 'Gaming', 'Gaming материнская плата', 650, 25],
  ['cooler-basic', 'Cooling', 'Air', 'Stock', 'Стоковый кулер', 50, 2],
  ['cooler-tower', 'Cooling', 'Air', 'Tower', 'Башенный кулер', 180, 15],
];
LEGACY_ITEMS.forEach(([id, category, group, series, name, basePrice, performance]) => {
  if (!SHOP.some((item) => item.id === id)) SHOP.push({ id, category, group, series, name, basePrice, performance, legacy: true, desc: 'Старая позиция из предыдущей версии.' });
});

const HARDCORE_CATALOG = {
  GPU: { NVIDIA: ['GTX', 'RTX'], AMD: ['Radeon RX'], Intel: ['Arc'] },
  CPU: { Intel: ['Celeron', 'Pentium', 'Core i3', 'Core i5', 'Core i7', 'Core i9', 'Core Ultra', 'Xeon'], AMD: ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'] },
  RAM: { DDR3: ['Desktop'], DDR4: ['Desktop'], DDR5: ['Desktop'] },
  Storage: { HDD: ['5400 RPM', '7200 RPM'], SSD: ['SATA', 'NVMe'] },
  PSU: { Power: ['Basic', '80+ Bronze', '80+ Gold'] },
  Case: { Case: ['Basic', 'Airflow', 'Premium'] },
  Motherboard: { Intel: ['H410', 'B560', 'B660 / B760', 'Z690 / Z790', 'B860 / Z890', 'Z790 / Z890 High Capacity'], AMD: ['A320', 'B450 / B550', 'B650 / X670 / X870', 'X870 High Capacity'] },
  Cooling: { Air: ['Stock', 'Tower'], Liquid: ['AIO'] }
};

const EASY_CATEGORIES = [...CATEGORIES];
const NORMAL_CATEGORIES = [...CATEGORIES];
const STORAGE_KEY = 'pcBuilder_v06';
const EARN_TAB_KEY = 'pcBuilder_earn_tab';
const SAVE_SLOT_PREFIX = 'pcBuilder_save_slot_';
const $ = (id) => document.getElementById(id);

let state = null;
let pendingResetAfterSave = false;
let activeGame = null;
let gameCleanup = null;
let shopView = 'catalog';
let replacementCategory = null;
let activeEarnTab = ['afk', 'ai'].includes(localStorage.getItem(EARN_TAB_KEY)) ? localStorage.getItem(EARN_TAB_KEY) : 'games';
let afkMode = 'normal';
let afkTimer = null;
let afkOverheatTimer = null;
let afkCoolTimer = null;
let afkRunning = false;
let afkExitPending = false;
let afkOverheated = false;
let afkCoolProgress = 0;
let afkComponents = { CPU: true, Storage: false, GPU: false };
let afkNextPayoutAt = 0;
let afkLastPayoutAt = 0;
let afkHeatDeadline = 0;
let afkComponentTask = null;
let afkTasks = {};
let afkNextTaskAt = 0;
let afkTaskCounter = 0;
let afkSpawnTimers = [];
let afkStorageStopListeners = [];
let aiRunning = false;
let aiTasks = [];
let aiTaskIndex = 0;
let aiTaskTimer = null;
let aiTaskInterval = null;
let aiTaskState = null;
const AI_TASKS = ['wires', 'word', 'download', 'file', 'windows'];
const MIN_AFK_CPU_POWER = 34; // i5-10400F / Ryzen 5 3600 tier
const MIN_AI_CPU_POWER = 25; // i3-12100F tier

function isItemBroken(item) { return !!(item && state?.broken?.[item.id]); }
function brokenInfo(item) { return item ? state?.broken?.[item.id] || null : null; }
function isDiscreteGpu(item) { return !!(item && item.category === 'GPU' && !/integrated|встроенн/i.test(item.name || '')); }
function repairBaseValue(item) {
  if (!item) return 100;
  if (Number(item.basePrice) > 0) return Number(item.basePrice);
  const starterPrices = { 'starter-easy-cpu': 500, 'starter-easy-gpu': 350, 'starter-easy-storage': 220, 'starter-hard-cpu': 220, 'starter-hard-gpu': 80, 'starter-hard-storage': 70, 'starter-hardcore-cpu': 60, 'starter-hardcore-gpu': 20, 'starter-hardcore-storage': 20 };
  return starterPrices[item.id] || 100;
}
function repairMultiplier() { return state?.mode === 'hardcore' ? 4 : state?.mode === 'hard' ? 3 : 2; }
function repairCost(item) { const info = brokenInfo(item); if (!item || !info) return 0; const damage = Math.max(10, Math.min(100, Number(info.damage) || 10)); return Math.max(10, Math.ceil(repairBaseValue(item) * damage / 100 * repairMultiplier())); }
function normaliseAfkComponents() {
  if (!state) return;
  if (!state.afkComponents) state.afkComponents = { CPU: true, Storage: false, GPU: false };
  const cpu = installedItem('CPU'), storage = installedItem('Storage'), gpu = installedItem('GPU');
  if (!cpu || isItemBroken(cpu)) state.afkComponents.CPU = false;
  if (!storage || isItemBroken(storage)) state.afkComponents.Storage = false;
  if (!gpu || isItemBroken(gpu) || !isDiscreteGpu(gpu)) state.afkComponents.GPU = false;
  afkComponents = { ...state.afkComponents };
}
function syncAfkComponents() { normaliseAfkComponents(); if (state) state.afkComponents = { ...afkComponents }; return afkComponents; }
function activeAfkComponents() { syncAfkComponents(); return ['CPU','Storage','GPU'].filter(c => afkComponents[c] && installedItem(c)); }
function afkBaseIncome() { return Math.max(1, Math.floor(state.baseReward * pcMultiplier())); }
function isXeonCpu(item) { return !!(item && item.category === 'CPU' && item.group === 'Intel' && item.series === 'Xeon'); }
function isCoreUltraCpu(item) { return !!(item && item.category === 'CPU' && item.group === 'Intel' && /^Core Ultra(?: \d+)?$/.test(item.series || '')); }
function isRyzenCpu(item) { return !!(item && item.category === 'CPU' && item.group === 'AMD' && /^Ryzen \d+$/.test(item.series || '')); }
function xeonBreakChance() {
  const cpu = installedItem('CPU');
  if (!isXeonCpu(cpu) || isItemBroken(cpu)) return 0;
  return afkMode === 'overclock' ? 0.025 : 0.01;
}
function maybeBreakXeonAfterPayout() {
  const chance = xeonBreakChance();
  if (!chance || Math.random() >= chance) return false;
  const broken = breakInstalledComponent('CPU');
  if (!broken) return false;
  afkRunning = false;
  resetAfkTimersOnly();
  clearAfkTasks();
  render();
  showBreakdownWarning(broken);
  return true;
}
function afkGpuBonus(item) { if (!item || !isDiscreteGpu(item)) return 0; return Math.min(0.75, 0.15 + (Number(item.performance) || 0) / 220); }
function afkPayoutInterval() { return afkComponents.Storage ? afkStorageInterval() : 10000; }
function afkAveragePerSecond() {
  const cpu = installedItem('CPU');
  if (!afkComponents.CPU || !cpu || isItemBroken(cpu)) return 0;
  const storage = installedItem('Storage'), gpu = installedItem('GPU');
  const interval = afkPayoutInterval() / 1000;
  let payout = afkBaseIncome() * interval;
  if (afkComponents.Storage && storage) payout *= 1 + afkStorageBonus(storage);
  if (afkComponents.GPU && gpu) payout *= 1 + afkGpuBonus(gpu);
  if (isXeonCpu(cpu)) payout *= 3;
  if (afkMode === 'overclock') payout *= 5;
  return payout / interval;
}
function afkPayoutAmount() { return Math.max(1, Math.floor((afkAveragePerSecond() * afkPayoutInterval() / 1000) / 5)); }
function resetAfkTimersOnly() {
  if (afkTimer) clearInterval(afkTimer); if (afkOverheatTimer) clearTimeout(afkOverheatTimer); if (afkCoolTimer) clearInterval(afkCoolTimer);
  afkTimer = null; afkOverheatTimer = null; afkCoolTimer = null;
}


function normalisePsuIds() {
  if (!state) return;
  const map = {
    'starter-easy-psu': 'psu-450',
    'starter-hard-psu': 'psu-300',
    'starter-hardcore-psu': 'psu-180',
    'psu-psu-180': 'psu-180',
    'psu-psu-300': 'psu-300',
    'psu-psu-400': 'psu-400',
    'psu-psu-450': 'psu-450',
    'psu-psu-550-bronze': 'psu-550-bronze',
    'psu-psu-650-bronze': 'psu-650-bronze',
    'psu-psu-750-bronze': 'psu-750-bronze',
    'psu-psu-850-gold': 'psu-850-gold',
    'psu-psu-1000-gold': 'psu-1000-gold'
  };
  if (state.installed?.PSU && map[state.installed.PSU]) state.installed.PSU = map[state.installed.PSU];
  if (state.owned) {
    Object.entries(map).forEach(([oldId, newId]) => {
      if (state.owned[oldId]) { state.owned[newId] = true; delete state.owned[oldId]; }
      if (state.broken?.[oldId]) { state.broken[newId] = state.broken[oldId]; delete state.broken[oldId]; }
    });
  }
}

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveSlotKey(slot) { return `${SAVE_SLOT_PREFIX}${slot}`; }
function loadSaveSlot(slot) {
  try {
    const raw = localStorage.getItem(saveSlotKey(slot));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveGameSlot(slot) {
  if (!state) return false;
  const existing = loadSaveSlot(slot);
  if (existing && !window.confirm(`Ячейка ${slot} уже занята. Перезаписать сохранение?`)) return false;
  checkAchievements();
  const snapshot = JSON.parse(JSON.stringify({ ...state, savedAt: new Date().toISOString(), saveVersion: GAME_VERSION }));
  localStorage.setItem(saveSlotKey(slot), JSON.stringify(snapshot));
  renderSaveSlots();
  $('gameResult').textContent = `💾 Игра сохранена в ячейку ${slot}.`;
  if (pendingResetAfterSave) {
    pendingResetAfterSave = false;
    closeSaveModal();
    resetGameNow();
  }
  return true;
}
function loadGameSlot(slot) {
  const snapshot = loadSaveSlot(slot);
  if (!snapshot || !MODE_CONFIG[snapshot.mode]) return;
  closeGame(); closeShop(); closeDiagnostic(); closeResetConfirm(); closeSaveModal();
  stopAfk();
  state = snapshot;
  normalisePsuIds();
  delete state.savedAt;
  delete state.saveVersion;
  normaliseInstalledForAchievements();
  if (!state.broken) state.broken = {};
  if (!state.achievements || typeof state.achievements !== 'object') state.achievements = {};
  ensureMarket();
  state.power = currentPower();
  normaliseAfkComponents();
  checkAchievements();
  save();
  activeEarnTab = 'games';
  localStorage.setItem(EARN_TAB_KEY, activeEarnTab);
  render();
  $('gameResult').textContent = `↩ Загружено сохранение из ячейки ${slot}.`;
}
function saveSlotLabel(snapshot) {
  const mode = MODE_CONFIG[snapshot?.mode]?.label || 'Неизвестный режим';
  const money = formatMoney(Number(snapshot?.money) || 0);
  const date = snapshot?.savedAt ? new Date(snapshot.savedAt).toLocaleString('ru-RU') : 'Дата неизвестна';
  return { mode, money, date };
}
function renderSaveSlots(view = 'manage') {
  const wrap = $('saveSlots');
  if (!wrap) return;
  const loadOnly = view === 'load';
  wrap.innerHTML = [1,2,3].map((slot) => {
    const snapshot = loadSaveSlot(slot);
    if (!snapshot) {
      return `<article class="save-slot"><div class="save-slot-head"><span class="save-slot-title">Ячейка ${slot}</span><span class="badge">Пусто</span></div><div class="save-slot-empty">Здесь пока нет сохранения.</div><div class="save-slot-actions ${loadOnly ? 'single-action' : ''}">${loadOnly ? '<button class="small" disabled>Загрузить</button>' : `<button class="primary" data-save-slot="${slot}">Сохранить</button><button class="small" disabled>Загрузить</button>`}</div></article>`;
    }
    const info = saveSlotLabel(snapshot);
    return `<article class="save-slot occupied"><div class="save-slot-head"><span class="save-slot-title">Ячейка ${slot}</span><span class="badge">Занято</span></div><div class="save-slot-meta"><b>${info.mode}</b><br>💰 $${info.money}<br>🕒 ${info.date}</div><div class="save-slot-actions ${loadOnly ? 'single-action' : ''}">${loadOnly ? `<button class="primary" data-load-slot="${slot}">Загрузить</button>` : `<button class="primary" data-save-slot="${slot}">Сохранить</button><button class="small" data-load-slot="${slot}">Загрузить</button>`}</div></article>`;
  }).join('');
  wrap.querySelectorAll('[data-save-slot]').forEach((btn) => btn.addEventListener('click', () => saveGameSlot(Number(btn.dataset.saveSlot))));
  wrap.querySelectorAll('[data-load-slot]').forEach((btn) => btn.addEventListener('click', () => loadGameSlot(Number(btn.dataset.loadSlot))));
}
function openSaveModal() {
  if (!state) return;
  renderSaveSlots('manage');
  $('saveTitle').textContent = '💾 Сохранения';
  $('saveHint').textContent = pendingResetAfterSave ? 'Сначала выбери ячейку для сохранения. После успешного сохранения прохождение будет сброшено.' : 'Выбери ячейку для сохранения текущего прохождения.';
  $('saveModal').classList.remove('hidden');
  $('saveModal').setAttribute('aria-hidden','false');
}
function openLoadModal() {
  renderSaveSlots('load');
  $('saveTitle').textContent = '📂 Загрузка сохранения';
  $('saveHint').textContent = 'Выбери сохранение, которое хочешь загрузить.';
  $('saveModal').classList.remove('hidden');
  $('saveModal').setAttribute('aria-hidden','false');
}

function closeSaveModal() {
  $('saveModal').classList.add('hidden');
  $('saveModal').setAttribute('aria-hidden','true');
}
function closeResetConfirm() {
  $('resetConfirmModal').classList.add('hidden');
  $('resetConfirmModal').setAttribute('aria-hidden','true');
}
function resetGameNow() {
  closeGame(); closeShop(); closeDiagnostic(); closeSaveModal(); closeResetConfirm(); stopAfk();
  state = null;
  localStorage.removeItem(STORAGE_KEY);
  showMainMenu();
}
function openResetConfirm() {
  if (!state) { resetGameNow(); return; }
  closeGame();
  $('resetConfirmModal').classList.remove('hidden');
  $('resetConfirmModal').setAttribute('aria-hidden','false');
}
function todayKey() { return new Date().toLocaleDateString('sv-SE'); }

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

const MARKET_REFRESH_MS = 2 * 60 * 1000;
const EVENT_REFRESH_MS = 5 * 60 * 1000;
const EVENT_DURATION_MS = 4 * 60 * 1000 + 30 * 1000;

function marketSlot() { return Math.floor(Date.now() / MARKET_REFRESH_MS); }
function eventSlot() { return Math.floor(Date.now() / EVENT_REFRESH_MS); }
function marketSecondsLeft() {
  return Math.max(0, Math.ceil((MARKET_REFRESH_MS - (Date.now() % MARKET_REFRESH_MS)) / 1000));
}
function eventElapsedMs() { return Date.now() % EVENT_REFRESH_MS; }
function eventIsActive() { return eventElapsedMs() < EVENT_DURATION_MS; }
function eventSecondsLeft() {
  const elapsed = eventElapsedMs();
  return eventIsActive()
    ? Math.max(0, Math.ceil((EVENT_DURATION_MS - elapsed) / 1000))
    : Math.max(0, Math.ceil((EVENT_REFRESH_MS - elapsed) / 1000));
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function chooseMarketEvent(slot = eventSlot()) {
  const random = seededRandom(hashSeed(`${slot}-pc-event`));
  const roll = random();
  if (roll < 0.05) return { id: 'black_friday', icon: '🛍️', name: 'Чёрная пятница', description: 'Все товары получили скидку от 10% до 50%. Без переплат.' };
  if (roll < 0.35) return { id: 'ai_development', icon: '🤖', name: 'Разработка ИИ', description: 'Оперативная память резко подорожала и стала дефицитной.' };
  if (roll < 0.675) return { id: 'overproduction', icon: '🏭', name: 'Лишнее производство', description: 'Одну категорию комплектующих выпускают в избытке: все товары этой категории дешевеют и чаще встречаются.' };
  return { id: 'factory_explosion', icon: '💥', name: 'Взрыв фабрики', description: 'Две категории комплектующих стали дефицитными и подорожали.' };
}

function applyMarketEvent(marketItems, slot = eventSlot()) {
  const event = chooseMarketEvent(slot);
  const random = seededRandom(hashSeed(`${slot}-pc-event-effects`));
  const ids = Object.keys(marketItems);
  if (event.id === 'ai_development') {
    SHOP.filter((item) => !item.starter && !item.legacy && item.category === 'RAM').forEach((item) => {
      const entry = marketItems[item.id];
      if (!entry) return;
      const priceBoost = 2 + random() * 2; // +100%..+300%
      entry.price = Math.max(1, Math.round(entry.price * priceBoost / 5) * 5);
      entry.change = Math.max(100, Math.round((priceBoost - 1) * 100));
      entry.stockChance = clamp(entry.stockChance * 0.48, 0.04, 0.90);
      entry.available = random() < entry.stockChance;
      entry.event = 'ai_development';
    });
  } else if (event.id === 'overproduction') {
    const categories = [...new Set(SHOP.filter((item) => !item.starter && !item.legacy).map((item) => item.category))];
    const category = categories[Math.floor(random() * categories.length)];
    const categoryItems = SHOP.filter((item) => !item.starter && !item.legacy && item.category === category);
    const discount = 0.20 + random() * 0.20; // -20%..-40%
    categoryItems.forEach((item) => {
      const entry = marketItems[item.id];
      if (!entry) return;
      entry.price = Math.max(1, Math.round(entry.price * (1 - discount) / 5) * 5);
      entry.change = -Math.round(discount * 100);
      entry.stockChance = clamp(entry.stockChance * 1.65, 0.10, 0.99);
      entry.available = random() < entry.stockChance;
      entry.event = 'overproduction';
      entry.eventCategory = category;
    });
    event.targetCategory = category;
    event.target = category;
  } else if (event.id === 'factory_explosion') {
    const categories = [...new Set(SHOP.filter((item) => !item.starter && !item.legacy).map((item) => item.category))];
    const shuffledCategories = [...categories];
    for (let i = shuffledCategories.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [shuffledCategories[i], shuffledCategories[j]] = [shuffledCategories[j], shuffledCategories[i]];
    }
    const selectedCategories = shuffledCategories.slice(0, 2);
    event.targetCategories = selectedCategories;
    event.targets = selectedCategories;
    selectedCategories.forEach((category) => {
      const markup = 1.20 + random() * 0.80; // +20%..+100%
      SHOP.filter((item) => !item.starter && !item.legacy && item.category === category).forEach((item) => {
        const entry = marketItems[item.id];
        if (!entry) return;
        const itemMarkup = 1.20 + random() * 0.80; // +20%..+100% per item
        entry.price = Math.max(1, Math.round(entry.price * itemMarkup / 5) * 5);
        entry.change = Math.round((itemMarkup - 1) * 100);
        entry.stockChance = clamp(entry.stockChance * 0.42, 0.03, 0.88);
        entry.available = random() < entry.stockChance;
        entry.event = 'factory_explosion';
        entry.eventCategory = category;
      });
    });
  } else if (event.id === 'black_friday') {
    Object.values(marketItems).forEach((entry) => {
      const discount = 0.10 + random() * 0.40; // -10%..-50%
      entry.price = Math.max(1, Math.round(entry.price * (1 - discount) / 5) * 5);
      entry.change = -Math.round(discount * 100);
      entry.event = 'black_friday';
    });
  }
  return event;
}

function createMarket(slot = marketSlot()) {
  const random = seededRandom(hashSeed(`${slot}-pc-market`));
  const items = {};
  SHOP.filter((item) => !item.starter && !item.legacy).forEach((item) => {
    const performanceScarcity = Math.min(1, (Number(item.performance) || 0) / 180);
    const priceScarcity = Math.min(1, (Number(item.basePrice) || 0) / 16500);
    const scarcity = Math.max(performanceScarcity, priceScarcity);
    const stockChance = Math.max(0.08, Math.min(0.96, item.availability * (1 - scarcity * 0.48)));
    const inStock = random() < stockChance;
    const [minMultiplier, maxMultiplier] = item.volatility;
    const multiplier = minMultiplier + random() * (maxMultiplier - minMultiplier);
    const price = Math.max(1, Math.round(item.basePrice * multiplier / 5) * 5);
    items[item.id] = { available: inStock, price, change: Math.round((multiplier - 1) * 100), stockChance, event: null };
  });
  const evSlot = eventSlot();
  const active = eventIsActive();
  const event = active ? applyMarketEvent(items, evSlot) : null;
  return { slot, eventSlot: evSlot, eventActive: active, event, items };
}

function ensureMarket() {
  const slot = marketSlot();
  const evSlot = eventSlot();
  const active = eventIsActive();
  if (!state.market || state.market.slot !== slot || state.market.eventSlot !== evSlot || Boolean(state.market.eventActive) !== active) {
    const previousEventSlot = Number(state.market?.eventSlot);
    state.market = createMarket(slot);
    recordBlackFridayEventSlot(evSlot);
    save();
    if (previousEventSlot !== evSlot && eventIsActive()) checkAchievements();
    return true;
  }
  const allIdsPresent = SHOP.filter((item) => !item.starter && !item.legacy).every((item) => state.market.items?.[item.id]);
  if (!allIdsPresent) {
    state.market = createMarket(slot);
    save();
    return true;
  }
  return false;
}

function itemById(id) { return SHOP.find((item) => item.id === id) || null; }
function partPlatform(item) {
  if (!item) return null;
  if (item.category === 'CPU') {
    if (/starter-easy-cpu/i.test(item.id)) return 'LGA1200';
    if (/starter-hard-cpu/i.test(item.id)) return 'AM4';
    if (/starter-hardcore-cpu/i.test(item.id)) return 'LGA1200';
    if (/cel-g5905|pentium-g6400|i[3579]-(10100|10400|10700|11900)/i.test(item.id)) return 'LGA1200';
    if (/cel-g6900|pentium-g7400/i.test(item.id)) return 'LGA1700';
    if (/i[3579]-(12|13|14)/i.test(item.id)) return 'LGA1700';
    if (/ultra[579]-/i.test(item.id)) return 'LGA1851';
    if (/xeon-(e-2336|e-2388g|w-1290p)/i.test(item.id)) return 'LGA1200';
    if (/(3100|4100|3600|5600|5700|5800|5900)/i.test(item.id)) return 'AM4';
    if (/(7600|7800|7900|7950|9600|9700|9950)/i.test(item.id)) return 'AM5';
  }
  if (item.category === 'Motherboard') {
    if (/starter-easy-mb/i.test(item.id)) return 'LGA1200';
    if (/starter-hard-mb/i.test(item.id)) return 'AM4';
    if (/starter-hardcore-mb/i.test(item.id)) return 'LGA1200';
    if (/h410|b560/i.test(item.id)) return 'LGA1200';
    if (/b660|b760|z690|z790/i.test(item.id)) return 'LGA1700';
    if (/b860|z890/i.test(item.id)) return 'LGA1851';
    if (/a320|b450|b550/i.test(item.id)) return 'AM4';
    if (/b650|x670|x870/i.test(item.id)) return 'AM5';
  }
  return null;
}
function motherboardSpec(item) {
  if (!item || item.category !== 'Motherboard') return null;
  const id = item.id;
  if (/starter-easy-mb/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR4', maxRamGb: 16, ramSlots: 2, maxCpuTdp: 95 };
  if (/starter-hard-mb/i.test(id)) return { platform: 'AM4', ramType: 'DDR4', maxRamGb: 8, ramSlots: 2, maxCpuTdp: 95 };
  if (/starter-hardcore-mb/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR3', maxRamGb: 4, ramSlots: 2, maxCpuTdp: 95 };
  if (/h410/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR4', maxRamGb: 64, ramSlots: 2, maxCpuTdp: 125 };
  if (/b560/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR4', maxRamGb: 128, ramSlots: 4, maxCpuTdp: 125 };
  if (/b660|b760|z690|z790/i.test(id)) return { platform: 'LGA1700', ramType: 'DDR5', maxRamGb: 192, ramSlots: 4, maxCpuTdp: 253 };
  if (/mb-z790-256/i.test(id)) {
    return { platform: 'LGA1700', ramType: 'DDR5', maxRamGb: 256, ramSlots: 4, maxCpuTdp: 253 };
  }
  if (/mb-z890-256/i.test(id)) {
    return { platform: 'LGA1851', ramType: 'DDR5', maxRamGb: 256, ramSlots: 4, maxCpuTdp: 253 };
  }
  if (/mb-x870e-256/i.test(id)) {
    return { platform: 'AM5', ramType: 'DDR5', maxRamGb: 256, ramSlots: 4, maxCpuTdp: 200 };
  }
  if (/b860|z890/i.test(id)) return { platform: 'LGA1851', ramType: 'DDR5', maxRamGb: 192, ramSlots: 4, maxCpuTdp: 253 };
  if (/a320/i.test(id)) return { platform: 'AM4', ramType: 'DDR4', maxRamGb: 32, ramSlots: 2, maxCpuTdp: 105 };
  if (/b450|b550/i.test(id)) return { platform: 'AM4', ramType: 'DDR4', maxRamGb: 128, ramSlots: 4, maxCpuTdp: 145 };
  if (/b650|x670|x870/i.test(id)) return { platform: 'AM5', ramType: 'DDR5', maxRamGb: 192, ramSlots: 4, maxCpuTdp: 200 };
  return null;
}
function ramType(item) {
  if (!item || item.category !== 'RAM') return null;
  if (/starter-(easy|hard)-ram/i.test(item.id)) return 'DDR4';
  if (/starter-hardcore-ram/i.test(item.id)) return 'DDR3';
  return item.group;
}
function numericWatts(item) {
  if (!item) return 0;
  // Поддерживаем W/Вт независимо от регистра, пробела и точек/знаков после единицы.
  const text = String(item.name || '');
  const match = text.match(/(\d{2,4})\s*(?:W|Вт)(?=\s|$|[.,;:!?)]|[-–—])/iu) || text.match(/(\d{2,4})\s*(?:W|Вт)/iu);
  return match ? Number(match[1]) : 0;
}
function gpuRecommendedPsu(item) {
  if (!item || item.category !== 'GPU') return 0;
  if (!isDiscreteGpu(item)) return 0;
  const id = item.id;
  const explicit = {
    'gpu-rtx-5090': 1000, 'gpu-rtx-4090': 850, 'gpu-rtx-4080s': 750, 'gpu-rtx-4070s': 650, 'gpu-rtx-4070': 650,
    'gpu-rtx-4060': 450, 'gpu-rtx-3060': 550, 'gpu-rtx-2060': 500,
    'gpu-rx-7900xtx': 800, 'gpu-rx-7900xt': 750, 'gpu-rx-7800xt': 700, 'gpu-rx-7700xt': 700, 'gpu-rx-7600': 550
  };
  if (explicit[id]) return explicit[id];
  if (/1660/.test(id)) return 450;
  if (/1650/.test(id)) return 300;
  if (/5500xt/.test(id)) return 450;
  if (/6600/.test(id)) return 450;
  if (/6700xt/.test(id)) return 650;
  if (/arc-(a580|a750)/.test(id)) return 550;
  if (/arc-b580/.test(id)) return 600;
  return 450;
}
function cpuTdp(item) {
  if (!item || item.category !== 'CPU') return 65;
  if (/cel-g5905|cel-g6900|pentium-g6400|pentium-g7400|j2900|i3-10100|i3-12100f|i3-13100f/.test(item.id)) return 65;
  if (/14900k|9950x|7950x|ultra9-285k/.test(item.id)) return 170;
  if (/ultra5-245k|ultra7-265k/.test(item.id)) return 145;
  if (/13900k|14700k/.test(item.id)) return 180;
  if (/14600k|13700k|12900k/.test(item.id)) return 150;
  if (/7800x3d|9700x|7900x|5900x|5800x3d/.test(item.id)) return 120;
  return /i9|r9/.test(item.name.toLowerCase()) ? 125 : 95;
}
function coolingCapacity(item) {
  if (!item || item.category !== 'Cooling') return 0;
  if (/stock/i.test(item.id)) return 65;
  if (/basic/i.test(item.id)) return 95;
  if (/tower[^-]|cooler-tower/.test(item.id)) return 140;
  if (/dual-tower/.test(item.id)) return 200;
  if (/premium-air/.test(item.id)) return 180;
  if (/aio-240/.test(item.id)) return 220;
  if (/aio-360/.test(item.id)) return 300;
  if (/aio-420/.test(item.id)) return 340;
  return 100;
}
function installedItem(category) { return itemById(state?.installed?.[category]); }
function ownedItemsIn(category) { return SHOP.filter((item) => item.category === category && state?.owned?.[item.id]); }
function workingOwnedItemsIn(category) { return ownedItemsIn(category).filter((item) => !isItemBroken(item)); }
function motherboardCompatibilitySummary(item) {
  const spec = motherboardSpec(item);
  if (!spec) return '';
  return `${spec.platform}, ${spec.ramType}, до ${spec.maxRamGb} ГБ RAM / ${spec.ramSlots} слота`;
}
function checkCompatibility() {
  const issues = [];
  const cpu = installedItem('CPU'); const mb = installedItem('Motherboard'); const ram = installedItem('RAM');
  const gpu = installedItem('GPU'); const psu = installedItem('PSU'); const cooling = installedItem('Cooling'); const storage = installedItem('Storage');
  CATEGORIES.forEach((category) => { const installed = installedItem(category); const info = brokenInfo(installed); if (installed && info) issues.push({ category, title: 'Установленная деталь сломана', detail: `${installed.name} повреждена на ${info.damage}%.`, fixCategory: category, brokenItemId: installed.id }); });
  if (!cpu) issues.push({ category: 'CPU', title: 'Нет процессора', detail: 'Для запуска нужен процессор.', fixCategory: 'CPU' });
  if (!mb) issues.push({ category: 'Motherboard', title: 'Нет материнской платы', detail: 'Компоненты некуда подключить.', fixCategory: 'Motherboard' });
  if (!ram) issues.push({ category: 'RAM', title: 'Нет оперативной памяти', detail: 'Без RAM система не сможет нормально пройти POST.', fixCategory: 'RAM' });
  if (!storage) issues.push({ category: 'Storage', title: 'Нет накопителя', detail: 'Операционной системе неоткуда загружаться.', fixCategory: 'Storage' });
  if (!psu) issues.push({ category: 'PSU', title: 'Нет блока питания', detail: 'Системе нечем получать питание.', fixCategory: 'PSU' });
  const mbSpec = motherboardSpec(mb);
  if (cpu && mb && partPlatform(cpu) && mbSpec?.platform && partPlatform(cpu) !== mbSpec.platform) {
    issues.push({ category: 'CPU', title: 'CPU физически несовместим с материнской платой', detail: `${cpu.name} использует ${partPlatform(cpu)}, а ${mb.name} рассчитана на ${mbSpec.platform}. Процессор в этот сокет не устанавливается.`, fixCategory: 'CPU_OR_MB', preferred: partPlatform(cpu) });
  }
  if (cpu && mbSpec?.maxCpuTdp && cpuTdp(cpu) > mbSpec.maxCpuTdp) {
    issues.push({ category: 'CPU', title: 'Материнская плата не рассчитана на такой CPU', detail: `${mb.name} рассчитана примерно до ${mbSpec.maxCpuTdp} W, а ${cpu.name} может потреблять около ${cpuTdp(cpu)} W.`, fixCategory: 'CPU_OR_MB', preferred: mbSpec.platform, preferredCpuTdp: mbSpec.maxCpuTdp });
  }
  if (ram && mbSpec) {
    const expected = mbSpec.ramType;
    if (expected && ramType(ram) !== expected) {
      issues.push({ category: 'RAM', title: 'RAM несовместима с материнской платой', detail: `${mb.name} использует ${expected}, а установлена ${ram.name}.`, fixCategory: 'RAM', preferred: expected });
    } else if (mbSpec.maxRamGb && ramCapacityGb(ram) > mbSpec.maxRamGb) {
      issues.push({ category: 'RAM', title: 'Слишком большой объём RAM для материнской платы', detail: `${mb.name} физически поддерживает максимум ${mbSpec.maxRamGb} ГБ RAM (${mbSpec.ramSlots} слота), а установлено ${ramCapacityGb(ram)} ГБ.`, fixCategory: 'RAM_CAPACITY', preferred: mbSpec.maxRamGb });
    }
  }
  if (gpu && psu && isDiscreteGpu(gpu)) {
    const required = gpuRecommendedPsu(gpu);
    if (numericWatts(psu) < required) issues.push({ category: 'GPU', title: 'БП слишком слабый для видеокарты', detail: `${gpu.name} требует рекомендованный БП около ${required} W, а установлен ${psu.name}.`, fixCategory: 'GPU_OR_PSU', preferred: required, currentPsuWatts: numericWatts(psu) });
  }
  if (cpu && cooling) {
    const requiredCool = cpuTdp(cpu);
    if (coolingCapacity(cooling) < requiredCool) issues.push({ category: 'Cooling', title: 'Охлаждение не справляется с CPU', detail: `${cpu.name} может потребовать около ${requiredCool} W по теплу, а это охлаждение рассчитано примерно на ${coolingCapacity(cooling)} W.`, fixCategory: 'Cooling', preferred: requiredCool });
  }
  return issues;
}
function recommendationForIssue(issue) {
  let candidates = [];
  if (issue.fixCategory === 'CPU_OR_MB') {
    candidates = workingOwnedItemsIn('CPU')
      .filter((item) => partPlatform(item) === issue.preferred)
      .filter((item) => !issue.preferredCpuTdp || cpuTdp(item) <= Number(issue.preferredCpuTdp))
      .sort((a,b) => b.performance-a.performance);
    if (!candidates.length) candidates = workingOwnedItemsIn('Motherboard').filter((item) => partPlatform(item) === issue.preferred).sort((a,b) => b.performance-a.performance);
  } else if (issue.fixCategory === 'GPU_OR_PSU') {
    // Сначала ищем видеокарту из инвентаря, которая уже работает с текущим БП.
    candidates = workingOwnedItemsIn('GPU')
      .filter((item) => gpuRecommendedPsu(item) <= Number(issue.currentPsuWatts || 0))
      .sort((a,b) => b.performance-a.performance);
    // Если подходящей видеокарты нет, ищем более мощный БП для текущей карты.
    if (!candidates.length) {
      candidates = workingOwnedItemsIn('PSU')
        .filter((item) => numericWatts(item) >= Number(issue.preferred || 0))
        .sort((a,b) => numericWatts(a)-numericWatts(b));
    }
  } else if (issue.fixCategory === 'PSU') {
    candidates = workingOwnedItemsIn('PSU').filter((item) => numericWatts(item) >= Number(issue.preferred || 0)).sort((a,b) => numericWatts(a)-numericWatts(b));
  } else if (issue.fixCategory === 'RAM') {
    candidates = workingOwnedItemsIn('RAM').filter((item) => ramType(item) === issue.preferred).sort((a,b) => a.performance-b.performance);
  } else if (issue.fixCategory === 'RAM_CAPACITY') {
    candidates = workingOwnedItemsIn('RAM').filter((item) => ramType(item) && ramCapacityGb(item) <= Number(issue.preferred || 0)).sort((a,b) => ramCapacityGb(b)-ramCapacityGb(a));
  } else if (issue.fixCategory === 'Cooling') {
    candidates = workingOwnedItemsIn('Cooling').filter((item) => coolingCapacity(item) >= Number(issue.preferred || 0)).sort((a,b) => coolingCapacity(a)-coolingCapacity(b));
  } else if (issue.fixCategory) {
    candidates = workingOwnedItemsIn(issue.fixCategory).sort((a,b) => b.performance-a.performance);
  }
  return candidates[0] || null;
}

function openDiagnostic(issues) {
  const modal = $('diagnosticModal'), content = $('diagnosticContent');
  if (!modal || !content) return;
  const mode = state.mode;
  if (!issues.length) {
    content.innerHTML = `<div class="diagnostic-ok"><div class="diagnostic-count">✅ Проверка пройдена</div><div>Все основные комплектующие совместимы. Запуск разрешён.</div></div>`;
  } else if (mode === 'hardcore') {
    content.innerHTML = `<div class="diagnostic-error diagnostic-hc"><span class="glitch">ОШИБКА ОШИБКА ОШИБКА</span><small>Система не смогла пройти проверку. Причины не раскрываются в хардкорном режиме.</small></div>`;
  } else if (mode === 'hard') {
    const cats = [...new Set(issues.map((issue) => issue.category))].join(', ');
    content.innerHTML = `<div class="diagnostic-error"><div class="diagnostic-count">❌ Проблем обнаружено: ${issues.length}</div><div>Проблемные разделы: <b>${cats}</b></div></div>`;
  } else {
    content.innerHTML = `<div class="diagnostic-error"><div class="diagnostic-count">❌ Проблем обнаружено: ${issues.length}</div><div class="diagnostic-list">${issues.map((issue) => { const rec = recommendationForIssue(issue); return `<article class="diagnostic-item"><b>${issue.title}</b><small>${issue.detail}</small>${rec ? `<div class="diagnostic-recommend">💡 Лучше поставить из инвентаря: ${rec.name}</div>` : `<div class="diagnostic-recommend">💡 Подходящей детали в инвентаре сейчас нет.</div>`}</article>`; }).join('')}</div></div>`;
  }
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeDiagnostic() { const modal = $('diagnosticModal'); if (!modal) return; modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); const title=$('diagnosticTitle'); if(title) title.textContent='🛠 Проверка ПК'; }

function currentPower() {
  return CATEGORIES.reduce((sum, category) => {
    const id = state.installed?.[category];
    const item = id ? itemById(id) : null;
    return sum + (item?.performance || 0);
  }, 0);
}

function formatMoney(value) { return Number(value).toLocaleString('ru-RU'); }

function migrateState(previous) {
  const config = MODE_CONFIG[previous.mode];
  const migrated = {
    mode: previous.mode,
    money: Number(previous.money) || 0,
    baseReward: Number(previous.baseReward) || config.baseReward,
    owned: {},
    installed: { ...config.start },
    catalog: previous.catalog || { category: 'GPU', group: null, series: null },
    market: previous.market || createMarket(),
    broken: previous.broken ? { ...previous.broken } : {},
    achievements: previous.achievements ? { ...previous.achievements } : {},
    afkComponents: previous.afkComponents ? { ...previous.afkComponents } : { CPU: true, Storage: false, GPU: false },
    couponPercent: Number(previous.couponPercent) >= 10 ? Math.min(80, Number(previous.couponPercent)) : null,
  };

  if (previous.owned) migrated.owned = { ...previous.owned };
  if (previous.bought) Object.keys(previous.bought).forEach((id) => { migrated.owned[id] = true; });

  if (previous.pc) {
    Object.entries(previous.pc).forEach(([category, value]) => {
      if (!CATEGORIES.includes(category)) return;
      const legacyBought = previous.bought ? Object.keys(previous.bought).reverse().find((id) => itemById(id)?.category === category) : null;
      const exact = SHOP.find((item) => item.category === category && item.name === value);
      const match = legacyBought ? itemById(legacyBought) : exact;
      if (match) {
        migrated.installed[category] = match.id;
        migrated.owned[match.id] = true;
      }
    });
  }
  if (previous.mode === 'hardcore' && previous.pc?.Case === 'НЕТ') migrated.installed.Case = null;
  state = migrated;
  ensureMarket();
  state.power = currentPower();
  save();
}

function start(mode) {
  const config = MODE_CONFIG[mode];
  state = {
    mode,
    money: config.money,
    baseReward: config.baseReward,
    owned: {},
    installed: { ...config.start },
    catalog: { category: 'GPU', group: null, series: null },
    market: createMarket(),
    broken: {},
    achievements: {},
    afkComponents: { CPU: true, Storage: false, GPU: false },
    couponPercent: null
  };
  Object.values(config.start).forEach((id) => { if (id) state.owned[id] = true; });
  state.power = currentPower();
  closeGame();
  closeShop();
  save();
  render();
}

let pendingPurchaseItemId = null;
function couponAppliedPrice(marketPrice) {
  const coupon = Number(state?.couponPercent) || 0;
  return coupon > 0 ? Math.max(1, Math.ceil(Number(marketPrice) * (1 - coupon / 100))) : Math.max(1, Number(marketPrice));
}
function purchaseItem(itemId, useCoupon = false) {
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state.market.items[itemId];
  if (!item || item.starter || !marketItem || state.owned[item.id] || !marketItem.available) {
    $('gameResult').textContent = 'Покупка недоступна: товар больше нельзя купить по текущему состоянию рынка.';
    closePurchaseCouponModal();
    if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
    return false;
  }
  const normalPrice = Math.max(1, Number(marketItem.price) || 0);
  const coupon = Number(state.couponPercent) || 0;
  const finalPrice = useCoupon && coupon > 0 ? couponAppliedPrice(normalPrice) : normalPrice;
  if (state.money < finalPrice) {
    $('gameResult').textContent = `Не хватает денег. Сейчас это стоит $${formatMoney(finalPrice)} 😐`;
    return false;
  }
  state.money -= finalPrice;
  state.owned[item.id] = true;
  if (useCoupon && coupon > 0) state.couponPercent = null;
  $('gameResult').textContent = useCoupon && coupon > 0
    ? `Куплено: ${item.name} за $${formatMoney(finalPrice)}. Купон -${coupon}% использован.`
    : `Куплено: ${item.name} за $${formatMoney(finalPrice)}. Деталь отправлена в инвентарь.`;
  pendingPurchaseItemId = null;
  save();
  closePurchaseCouponModal();
  render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  return true;
}
function salePriceFor(itemId) {
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state?.market?.items?.[itemId];
  if (!item || item.starter || item.legacy || !marketItem) return 0;
  const currentPrice = Math.max(1, Number(marketItem.price) || Number(item.basePrice) || 0);
  return Math.max(1, Math.floor(currentPrice * 0.8));
}
function sellItem(itemId) {
  ensureMarket();
  const item = itemById(itemId);
  if (!item || item.starter || item.legacy || !state?.owned?.[itemId]) return false;
  const marketItem = state.market.items[itemId];
  const currentPrice = Math.max(1, Number(marketItem?.price) || Number(item.basePrice) || 0);
  const salePrice = Math.max(1, Math.floor(currentPrice * 0.8));
  state.money += salePrice;
  if (state.installed?.[item.category] === item.id) {
    state.installed[item.category] = null;
    state.power = currentPower();
    if (typeof syncAfkComponents === 'function') syncAfkComponents();
    if (typeof stopAfk === 'function') stopAfk();
  }
  delete state.owned[item.id];
  state.broken = state.broken || {};
  delete state.broken[item.id];
  $('gameResult').textContent = `💵 Продано: ${item.name} за $${formatMoney(salePrice)}.`;
  save();
  checkAchievements();
  render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  return true;
}

function buy(itemId) {
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state.market.items[itemId];
  if (!item || item.starter || !marketItem || state.owned[item.id] || !marketItem.available) return;
  if (Number(state.couponPercent) > 0) {
    openPurchaseCouponModal(itemId);
    return;
  }
  purchaseItem(itemId, false);
}
function openPurchaseCouponModal(itemId) {
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state.market.items[itemId];
  const coupon = Number(state.couponPercent) || 0;
  if (!item || !marketItem || !marketItem.available || !coupon) { purchaseItem(itemId, false); return; }
  pendingPurchaseItemId = itemId;
  const normalPrice = Math.max(1, Number(marketItem.price) || 0);
  const discounted = couponAppliedPrice(normalPrice);
  $('purchaseCouponTitle').textContent = `🎟 Купон -${coupon}%`;
  $('purchaseCouponContent').innerHTML = `<h3>${item.name}</h3><p>Текущая цена уже учитывает рыночный процент <b>${marketItem.change > 0 ? '+' : ''}${marketItem.change}%</b>.</p><div class=\"purchase-price-grid\"><div><span>Без купона</span><b>$${formatMoney(normalPrice)}</b></div><div class=\"coupon-price\"><span>С купоном -${coupon}%</span><b>$${formatMoney(discounted)}</b></div></div><p class=\"purchase-coupon-note\">Купон сгорает только при подтверждении покупки со скидкой.</p>`;
  $('purchaseCouponModal').classList.remove('hidden');
  $('purchaseCouponModal').setAttribute('aria-hidden','false');
}
function closePurchaseCouponModal() {
  const modal = $('purchaseCouponModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
  pendingPurchaseItemId = null;
}

function openCouponReceivedModal(percent) {
  const modal = $('couponReceivedModal');
  if (!modal) return;
  const value = Math.max(10, Math.min(80, Number(percent) || 10));
  $('couponReceivedTitle').textContent = `🎟 Купон -${value}%`;
  $('couponReceivedContent').innerHTML = `<p><b>Ты получил купон на скидку -${value}%.</b></p><p>Купон можно потратить при покупке любой доступной детали в каталоге.</p><p>При покупке игра покажет две цены: обычную и цену с купоном. Купон сгорит только если ты выберешь <b>«Использовать купон»</b>.</p><p>Пока купон не потрачен, новый купон получить нельзя.</p>`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
}
function closeCouponReceivedModal() {
  const modal = $('couponReceivedModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
}

function installItem(itemId) {
  const item = itemById(itemId);
  if (!item || !state.owned[itemId]) return;
  if (isItemBroken(item)) { $('gameResult').textContent = `Нельзя установить ${item.name}: деталь сломана. Сначала почини её или выбери другую.`; return; }
  state.installed[item.category] = item.id;
  state.broken = state.broken || {};
  delete state.broken[item.id];
  state.power = currentPower(); syncAfkComponents();
  const unlocked = checkAchievements();
  $('gameResult').textContent = unlocked.length
    ? `🏆 Получено достижение: ${unlocked.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean).join(', ')}`
    : `Установлено: ${item.name}. Мощность ПК: ${state.power}`;
  save(); render(); if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
}
function repairInstalledItem(itemId) {
  const item = itemById(itemId), info = brokenInfo(item);
  if (!item || !info) return false;
  const cost = repairCost(item);
  if (state.money < cost) { $('gameResult').textContent = `Не хватает $${formatMoney(cost - state.money)} на ремонт ${item.name}.`; render(); return false; }
  state.money -= cost; delete state.broken[item.id]; syncAfkComponents();
  $('gameResult').textContent = `🔧 ${item.name} отремонтирован за $${formatMoney(cost)}.`; save(); render();
  return true;
}
function openRepairConfirm(itemId) {
  const item = itemById(itemId), info = brokenInfo(item);
  if (!item || !info) return;
  const modal = $('diagnosticModal'), content = $('diagnosticContent'), title = $('diagnosticTitle');
  if (!modal || !content) return;
  const cost = repairCost(item);
  if (title) title.textContent = '🔧 Ремонт детали';
  content.innerHTML = `<div class="diagnostic-error breakdown-alert"><div class="diagnostic-count">Починить ${item.name}?</div><p>Вы действительно хотите починить деталь <b>${item.name}</b> за <b>$${formatMoney(cost)}</b>?</p><div class="breakdown-percent">Повреждение: <b>${info.damage}%</b></div><div class="breakdown-actions"><button class="primary" id="confirmRepair" ${state.money >= cost ? '' : 'disabled'}>Да, починить</button><button class="small" id="cancelRepair">Нет</button></div></div>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  $('confirmRepair')?.addEventListener('click', () => { if (repairInstalledItem(item.id)) closeDiagnostic(); });
  $('cancelRepair')?.addEventListener('click', closeDiagnostic);
}
function breakInstalledComponent(category) {
  const item = installedItem(category); if (!item) return null;
  const damage = randInt(10, 100), cost = Math.max(10, Math.ceil(repairBaseValue(item) * damage / 100 * repairMultiplier()));
  state.broken = state.broken || {}; state.broken[item.id] = { damage, repairCost: cost };
  if (state.afkComponents) state.afkComponents[category] = false; syncAfkComponents(); save();
  return { item, damage, cost, category };
}
function showBreakdownWarning(broken) {
  const modal = $('diagnosticModal'), content = $('diagnosticContent'), title = $('diagnosticTitle');
  if (!modal || !content || !broken?.item) return;
  const item = broken.item, cost = broken.cost; if (title) title.textContent = '⚠ Поломка компонента';
  content.innerHTML = `<div class="diagnostic-error breakdown-alert"><div class="diagnostic-count">💥 ${item.name} вышла из строя</div><div class="breakdown-percent">Степень поломки: <b>${broken.damage}%</b></div><p>Сломанная установленная деталь блокирует игры и AFK. Её можно починить или заменить другой рабочей деталью из инвентаря.</p><div class="diagnostic-recommend">🔧 Стоимость ремонта: <b>$${formatMoney(cost)}</b></div><div class="breakdown-actions"><button class="primary" id="repairBrokenNow" ${state.money >= cost ? '' : 'disabled'}>🔧 Починить за $${formatMoney(cost)}</button><button class="small" id="replaceBrokenNow">🔄 Заменить деталь</button></div></div>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  $('repairBrokenNow')?.addEventListener('click', () => { openRepairConfirm(item.id); });
  $('replaceBrokenNow')?.addEventListener('click', () => { closeDiagnostic(); openReplacement(item.category); });
}
const GAME_LIBRARY = [
  { id: 'memory', icon: '🧠', name: 'Память', description: 'Запомни мигающую последовательность и повтори её.', tier: 1, demand: 8, recommended: 30, mechanic: 'memory' },
  { id: 'math', icon: '🧮', name: 'Матеша', description: 'Решай примеры на время. Хардкор добавляет корни, факториалы и дроби.', tier: 1, demand: 6, recommended: 30, mechanic: 'math' },
  { id: 'cats', icon: '🐱', name: 'Котокбасик', description: 'Кликай по целям до того, как они исчезнут.', tier: 1, demand: 12, recommended: 45, mechanic: 'cats' },
  { id: 'reaction', icon: '⚡', name: 'Реакция', description: 'Жми кнопку сразу после появления. Чем быстрее, тем лучше.', tier: 1, demand: 10, recommended: 30, mechanic: 'reaction' },
  { id: 'color', icon: '🎨', name: 'Цветомания', description: 'Найди нужный цвет среди похожих кнопок.', tier: 1, demand: 14, recommended: 45, mechanic: 'color' },
  { id: 'typing', icon: '⌨️', name: 'Печатная машинка', description: 'Напечатай слова и короткие фразы как можно быстрее.', tier: 1, demand: 16, recommended: 45, mechanic: 'typing' },
  { id: 'order', icon: '🔢', name: 'Порядок', description: 'Нажми числа в правильной последовательности.', tier: 2, demand: 20, recommended: 50, mechanic: 'order' },
  { id: 'simon', icon: '🟦', name: 'Саймон', description: 'Повтори растущую последовательность цветных кнопок.', tier: 2, demand: 22, recommended: 60, mechanic: 'simon' },
  { id: 'clickrush', icon: '🖱️', name: 'Click Rush', description: 'Сделай как можно больше точных кликов за ограниченное время.', tier: 2, demand: 24, recommended: 60, mechanic: 'clickrush' },
  { id: 'dodge', icon: '☄️', name: 'Уклонение', description: 'Двигайся и не попадай под падающие препятствия.', tier: 2, demand: 32, recommended: 60, mechanic: 'dodge' },
  { id: 'snake', icon: '🐍', name: 'Змейка', description: 'Собирай еду, не врежься в стену или себя.', tier: 3, demand: 38, recommended: 60, mechanic: 'snake' },
  { id: 'maze', icon: '🧩', name: 'Лабиринт', description: 'Доберись до выхода по случайно сгенерированному лабиринту.', tier: 3, demand: 42, recommended: 60, mechanic: 'maze' },
  { id: 'pong', icon: '🏓', name: 'Pong', description: 'Отбивай мяч и переиграй компьютер.', tier: 3, demand: 46, recommended: 60, mechanic: 'pong' },
  { id: 'breakout', icon: '🧱', name: 'Breakout', description: 'Разбивай блоки мячом и не дай ему упасть.', tier: 3, demand: 52, recommended: 60, mechanic: 'breakout' },
  { id: 'flappy', icon: '🐤', name: 'Flappy', description: 'Лети между трубами, вовремя нажимая пробел.', tier: 4, demand: 58, recommended: 60, mechanic: 'flappy' },
  { id: 'racer', icon: '🏎️', name: 'Неоновая трасса', description: 'Уворачивайся от машин на постоянно ускоряющейся трассе.', tier: 4, demand: 64, recommended: 75, mechanic: 'racer' },
  { id: 'asteroids', icon: '☄️', name: 'Asteroids', description: 'Уничтожай астероиды и выживай в поле обломков.', tier: 4, demand: 70, recommended: 90, mechanic: 'asteroids' },
  { id: 'shooter', icon: '🎯', name: 'Target Storm', description: 'Собирай серию попаданий по движущимся целям.', tier: 4, demand: 62, recommended: 75, mechanic: 'shooter' },
  { id: 'tetris', icon: '🟪', name: 'Тетрис', description: 'Собирай линии из падающих фигур и переживи ускорение.', tier: 5, demand: 76, recommended: 90, mechanic: 'tetris' },
  { id: 'rhythm', icon: '🎵', name: 'Ритм', description: 'Попадай в круги точно в ритм. Ошибка сбивает комбо.', tier: 5, demand: 82, recommended: 120, mechanic: 'rhythm' },
  { id: 'platformer', icon: '🕹️', name: 'Pixel Runner', description: 'Прыгай через препятствия и переживи длинную трассу.', tier: 5, demand: 86, recommended: 120, mechanic: 'platformer' },
  { id: 'spaceshooter', icon: '🚀', name: 'Space Shooter', description: 'Уничтожай врагов, собирай усиления и переживай волны.', tier: 6, demand: 92, recommended: 144, mechanic: 'spaceshooter' },
  { id: 'benchmark', icon: '🔥', name: 'Stress Test', description: 'Не игра, а настоящий тест: чем мощнее ПК, тем выше FPS.', tier: 6, demand: 105, recommended: 165, mechanic: 'benchmark' }
];
function gameById(id) { return GAME_LIBRARY.find((game) => game.id === id) || null; }

// Реальный FPS-кап для мини-игр: requestAnimationFrame браузера сам по себе не ограничивается
// рассчитанным FPS, поэтому здесь мы пропускаем кадры и обновляем игру с нужной частотой.
let gameRafToken = 0;
function gameRAF(loop, targetFps) {
  const fps = Math.max(1, Math.min(240, Number(targetFps) || 60));
  const frameMs = 1000 / fps;
  const token = ++gameRafToken;
  const startedGame = activeGame;
  let lastRun = performance.now();
  let rafId = 0;
  const tick = (now) => {
    if (token !== gameRafToken || activeGame !== startedGame) return;
    if (now - lastRun >= frameMs - 0.5) {
      lastRun = now;
      loop(now);
    }
    if (token === gameRafToken && activeGame === startedGame) {
      rafId = requestAnimationFrame(tick);
    }
  };
  rafId = requestAnimationFrame(tick);
  return rafId;
}
function stopGameRAF() { gameRafToken++; }
function installedPerf(category) { const item = itemById(state?.installed?.[category]); return item?.performance || 0; }
function gameFPS(gameOrId) {
  const game = typeof gameOrId === 'string' ? gameById(gameOrId) : gameOrId;
  if (!game || !state) return 30;
  const gpu = installedPerf('GPU');
  const cpu = installedPerf('CPU');
  const ram = installedPerf('RAM');
  const storage = installedPerf('Storage');
  const cooling = installedPerf('Cooling');
  const motherboard = installedPerf('Motherboard');
  const raw = 14 + gpu * 2.6 + cpu * 0.9 + ram * 0.5 + storage * 0.15 + cooling * 0.05 + motherboard * 0.05 - game.demand * 1.2;
  const variance = Math.sin(hashSeed(`${game.id}:${todayKey()}:${Math.floor(currentPower() / 5)}`)) * 2.5;
  return Math.max(8, Math.min(360, Math.round(raw + variance)));
}
function fpsLabel(fps, recommended) {
  if (fps >= recommended) return '✅ Комфортно';
  if (fps >= Math.max(30, Math.floor(recommended * 0.55))) return '⚠️ Играбельно';
  return '🐢 Тормоза';
}
function renderGamePicker() {
  const picker = $('gamePicker');
  if (!picker || !state) return;
  picker.innerHTML = GAME_LIBRARY.map((game) => {
    const fps = gameFPS(game);
    const status = fpsLabel(fps, game.recommended);
    return `<button class="game-card game-tier-${game.tier}" data-game="${game.id}">
      <div class="game-card-top"><strong>${game.icon} ${game.name}</strong><span class="fps-pill">${fps} FPS</span></div>
      <span>${game.description}</span>
      <div class="game-meta"><span>Уровень ${game.tier}</span><span>Требовательность ${game.demand}/100</span><span>${status}</span></div>
    </button>`;
  }).join('');
  picker.querySelectorAll('[data-game]').forEach((btn) => { btn.onclick = () => chooseGame(btn.dataset.game); });
}

function pcMultiplier() { return 1 + Math.floor(currentPower() / 25) * 0.15; }
function rewardForPerformance(performance) {
  const performanceMultiplier = Math.max(0.2, Math.min(1.8, performance));
  let reward = state.baseReward * pcMultiplier() * performanceMultiplier * 1.10;
  if (isRyzenCpu(installedItem('CPU'))) reward *= 2;
  return Math.max(1, Math.floor(reward));
}
function finishGame(message, performance, completed = false) {
  const game = gameById(activeGame);
  const fps = game ? gameFPS(game) : 0;
  const issues = checkCompatibility();
  if (issues.length) {
    $('gameResult').textContent = 'Награда заблокирована: после изменения сборки ПК больше не проходит проверку.';
    activeGame = null;
    closeGame();
    openDiagnostic(issues);
    render();
    return;
  }
  const reward = rewardForPerformance(performance);
  state.money += reward;
  let couponMessage = '';
  let earnedCoupon = null;
  if (completed && game && !(Number(state.couponPercent) > 0) && Math.random() < 0.10) {
    state.couponPercent = randInt(10, 80);
    earnedCoupon = state.couponPercent;
    couponMessage = ` 🎟 Получен купон -${state.couponPercent}% на следующую покупку.`;
  }
  const unlocked = checkAchievements();
  const achievementMessage = unlocked.length ? `🏆 Получено достижение: ${unlocked.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean).join(', ')}.` : '';
  $('gameResult').textContent = `${message}  +$${reward}${game ? ` • ${fps} FPS` : ''}${couponMessage}${achievementMessage ? ` ${achievementMessage}` : ''}`;
  save();
  if (game) closeGame();
  else activeGame = null;
  render();
  if (earnedCoupon) setTimeout(() => openCouponReceivedModal(earnedCoupon), 0);
}
function closeGame() {
  if (typeof gameCleanup === 'function') { gameCleanup(); gameCleanup = null; }
  activeGame = null;
  if ($('gameArea')) $('gameArea').classList.add('hidden');
  if ($('gamePicker')) $('gamePicker').classList.remove('hidden');
}
function chooseGame(type) {
  const game = gameById(type);
  if (!game) return;
  const issues = checkCompatibility();
  if (issues.length) { openDiagnostic(issues); $('gameResult').textContent = 'Запуск заблокирован: сначала исправь сборку.'; return; }
  closeGame();
  closeDiagnostic();
  $('gameResult').textContent = '';
  activeGame = type;
  $('gamePicker').classList.add('hidden');
  $('gameArea').classList.remove('hidden');
  if (game.mechanic === 'memory') initMemoryGame();
  else if (game.mechanic === 'math') initMathGame();
  else if (game.mechanic === 'cats') initCatsGame();
  else if (game.mechanic === 'reaction') initReactionGame();
  else if (game.mechanic === 'color') initColorGame();
  else if (game.mechanic === 'typing') initTypingGame();
  else if (game.mechanic === 'order') initOrderGame();
  else if (game.mechanic === 'simon') initSimonGame();
  else if (game.mechanic === 'clickrush') initClickRushGame();
  else if (game.mechanic === 'dodge') initDodgeGame();
  else if (game.mechanic === 'snake') initSnakeGame();
  else if (game.mechanic === 'maze') initMazeGame();
  else if (game.mechanic === 'pong') initPongGame();
  else if (game.mechanic === 'breakout') initBreakoutGame();
  else if (game.mechanic === 'flappy') initFlappyGame();
  else if (game.mechanic === 'racer') initRacerGame();
  else if (game.mechanic === 'asteroids') initAsteroidsGame();
  else if (game.mechanic === 'shooter') initShooterGame();
  else if (game.mechanic === 'tetris') initTetrisGame();
  else if (game.mechanic === 'rhythm') initRhythmGame();
  else if (game.mechanic === 'platformer') initPlatformerGame();
  else if (game.mechanic === 'spaceshooter') initSpaceShooterGame();
  else if (game.mechanic === 'benchmark') initBenchmarkGame();
}
function backToGamePicker() { closeGame(); $('gameResult').textContent = ''; renderRewardInfo(); }
function renderRewardInfo() {
  const el = $('rewardInfo');
  if (!el) return;
  const parts = [`Множитель ПК ×${pcMultiplier().toFixed(2)}`];
  const cpu = installedItem('CPU');
  if (activeEarnTab === 'games' && isRyzenCpu(cpu)) parts.push(`<span class="cpu-purple-bonus">+100% CPU · Ryzen</span>`);
  if (activeEarnTab === 'afk' && isXeonCpu(cpu)) parts.push(`<span class="cpu-purple-bonus">+200% CPU · Xeon</span>`);
  if (activeEarnTab === 'ai' && isCoreUltraCpu(cpu)) parts.push(`<span class="cpu-purple-bonus">+75% CPU · Core Ultra</span>`);
  el.innerHTML = parts.join(' · ');
  el.classList.toggle('reward-bonus-active', parts.length > 1);
}

// ===== EXTRA MINI-GAMES =====
function gameHeader(title, hint, backId, fps) {
  const game = gameById(activeGame);
  return `<div class="game-header game-header-fps"><div><strong>${title}</strong><span>${hint}</span></div><div class="game-header-actions"><span class="fps-live">${fps} FPS</span><button class="small" id="${backId}">Назад</button></div></div>`;
}
function finishExtra(message, performance = 1, completed = true) { finishGame(message, performance, completed); }

function initReactionGame() {
  const area=$('gameArea'), game=gameById(activeGame), total=5, fps=gameFPS(game);
  const responseLimit = { easy: 1000, hard: 700, hardcore: 400 }[state.mode] || 1000;
  let round=0, readyAt=0, deadlineAt=0, waiting=false, stopped=false, signalTimer=null, deadlineTimer=null, countdownTimer=null, best=9999;
  area.innerHTML=gameHeader('⚡ Реакция','Жми только после сигнала. '+game.name,'reactionBack',fps)+`<div class="reaction-card"><button id="reactionBtn" class="reaction-btn">ЖДИ...</button><div id="reactionStatus">Раунд 0 / ${total}</div><div id="reactionWindow" class="reaction-window-timer">Окно реакции: —</div></div>`;
  const btn=$('reactionBtn'), status=$('reactionStatus'), windowEl=$('reactionWindow');
  function clearRoundTimers(){ if(signalTimer)clearTimeout(signalTimer); if(deadlineTimer)clearTimeout(deadlineTimer); if(countdownTimer)clearInterval(countdownTimer); signalTimer=null;deadlineTimer=null;countdownTimer=null; }
  function failForTimeout(){ if(stopped)return; stopped=true; clearRoundTimers(); btn.textContent='Слишком медленно'; btn.classList.remove('ready'); finishExtra(`Не успел среагировать за ${(responseLimit/1000).toFixed(1)} сек.`,0.25,false); }
  function next(){
    if(stopped)return;
    clearRoundTimers();
    round+=1; status.textContent=`Раунд ${round} / ${total}`; waiting=true; deadlineAt=0; windowEl.textContent=`Окно реакции: ${(responseLimit/1000).toFixed(1)} сек`; btn.textContent='ЖДИ...'; btn.className='reaction-btn';
    signalTimer=setTimeout(()=>{
      if(stopped)return;
      waiting=false; readyAt=performance.now(); deadlineAt=readyAt+responseLimit; btn.textContent='ЖМИ!'; btn.classList.add('ready');
      countdownTimer=setInterval(()=>{
        if(stopped || waiting || !deadlineAt)return;
        const left=Math.max(0,deadlineAt-performance.now());
        windowEl.textContent=`Окно реакции: ${(left/1000).toFixed(2)} сек`;
      },50);
      deadlineTimer=setTimeout(failForTimeout,responseLimit);
    },randInt(700,1700));
  }
  btn.addEventListener('click',()=>{
    if(stopped)return;
    if(waiting){
      stopped=true; clearRoundTimers(); btn.textContent='Слишком рано'; btn.classList.remove('ready'); setTimeout(()=>{finishExtra('Слишком ранняя реакция.',0.3,false);},350); return;
    }
    clearRoundTimers();
    const reaction=Math.round(performance.now()-readyAt); best=Math.min(best,reaction); windowEl.textContent=`Реакция: ${reaction} мс`;
    if(round>=total){ stopped=true; finishExtra(`Средняя реакция около ${best}–${Math.round(best*1.25)} мс.`,Math.max(0.4,1.25-reaction/900),true); } else next();
  });
  $('reactionBack').onclick=backToGamePicker;
  gameCleanup=()=>{stopped=true;clearRoundTimers();}; next();
}

function initColorGame(){
  const area=$('gameArea'), game=gameById(activeGame), fps=gameFPS(game), rounds=8; let round=0, score=0, stopped=false, colors=['Красный','Синий','Зелёный','Жёлтый'];
  area.innerHTML=gameHeader('🎨 Цветомания','Выбери названный цвет среди кнопок.', 'colorBack',fps)+`<div class="color-status" id="colorStatus"></div><div class="color-grid" id="colorGrid"></div>`;
  const status=$('colorStatus'), grid=$('colorGrid'); area.querySelector('#colorBack').onclick=backToGamePicker;
  function next(){if(stopped)return;if(round>=rounds){finishExtra(`Результат: ${score}/${rounds}.`,0.35+score/rounds);return;}round++;const target=colors[randInt(0,colors.length-1)];status.textContent=`Раунд ${round}/${rounds}: нажми «${target}»`;grid.innerHTML='';const shuffled=[...colors].sort(()=>Math.random()-.5);shuffled.forEach(c=>{const b=document.createElement('button');b.className='color-button';b.textContent=c;b.dataset.color=c;b.style.background={Красный:'#d74b4b',Синий:'#3478db',Зелёный:'#36a269',Жёлтый:'#d6b43c'}[c];b.addEventListener('click',()=>{if(stopped)return; if(c===target){score++;next();}else finishExtra(`Ошибка цвета. ${score}/${rounds}.`,0.25+score/rounds,false);});grid.appendChild(b);});}
  gameCleanup=()=>{stopped=true;}; next();
}

function initTypingGame(){
  const area=$('gameArea'), game=gameById(activeGame), fps=gameFPS(game), texts=['сервер','видеокарта','материнская плата','оперативная память','интерфейс','производительность'];let index=0,started=performance.now(),stopped=false;
  area.innerHTML=gameHeader('⌨️ Печатная машинка','Перепечатывай строки без ошибок.','typingBack',fps)+`<div class="typing-card"><div id="typingPrompt" class="typing-prompt"></div><input id="typingInput" class="math-input" autocomplete="off" autofocus><button id="typingSubmit" class="primary">Готово</button><div id="typingStatus"></div></div>`;
  const prompt=$('typingPrompt'),input=$('typingInput'),status=$('typingStatus');area.querySelector('#typingBack').onclick=backToGamePicker;
  function next(){if(index>=texts.length){const sec=(performance.now()-started)/1000;finishExtra(`Готово за ${sec.toFixed(1)} сек.`,Math.min(1.5,1.25-(sec/texts.length)/4));return;}prompt.textContent=texts[index];input.value='';input.focus();status.textContent=`${index+1}/${texts.length}`;}
  function submit(){if(input.value!==texts[index]){status.textContent='Ошибка. Исправь строку.';return;}index++;next();} $('typingSubmit').onclick=submit;input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});gameCleanup=()=>{stopped=true;};next();
}

function initOrderGame(){
  const area=$('gameArea'),game=gameById(activeGame),fps=gameFPS(game),count=state.mode==='easy'?8:state.mode==='hard'?12:16;let next=1,started=performance.now(),stopped=false;
  area.innerHTML=gameHeader('🔢 Порядок','Нажимай числа от меньшего к большему.', 'orderBack',fps)+`<div id="orderGrid" class="order-grid"></div><div id="orderStatus" class="color-status"></div>`;area.querySelector('#orderBack').onclick=backToGamePicker;const grid=$('orderGrid'),status=$('orderStatus');const nums=Array.from({length:count},(_,i)=>i+1).sort(()=>Math.random()-.5);nums.forEach(n=>{const b=document.createElement('button');b.className='order-button';b.textContent=n;b.onclick=()=>{if(stopped)return;if(n!==next){status.textContent=`Нужно нажать ${next}.`;return;}b.disabled=true;next++;if(next>count){const sec=(performance.now()-started)/1000;finishExtra(`Поле очищено за ${sec.toFixed(1)} сек.`,Math.max(.4,1.35-sec/10));}};grid.appendChild(b);});gameCleanup=()=>{stopped=true;};
}

function initSimonGame(){
  const area=$('gameArea'),game=gameById(activeGame),fps=gameFPS(game),pads=['red','blue','green','yellow'];let sequence=[],inputIndex=0,playing=false,stopped=false,timer=null,round=0;
  area.innerHTML=gameHeader('🟦 Саймон','Повтори последовательность цветов.', 'simonBack',fps)+`<div id="simonPad" class="simon-pad">${pads.map(p=>`<button class="simon-button ${p}" data-pad="${p}"></button>`).join('')}</div><div id="simonStatus" class="color-status"></div>`;area.querySelector('#simonBack').onclick=backToGamePicker;const buttons=[...area.querySelectorAll('.simon-button')],status=$('simonStatus');function flash(i){if(stopped)return;if(i>=sequence.length){playing=false;inputIndex=0;status.textContent=`Твой ход. Раунд ${round}.`;return;}const b=buttons.find(x=>x.dataset.pad===sequence[i]);b.classList.add('lit');timer=setTimeout(()=>{b.classList.remove('lit');timer=setTimeout(()=>flash(i+1),130);},360);}function nextRound(){round++;sequence.push(pads[randInt(0,3)]);playing=true;status.textContent=`Запоминай. Раунд ${round}.`;setTimeout(()=>flash(0),420);}buttons.forEach(b=>b.onclick=()=>{if(stopped||playing)return;if(b.dataset.pad!==sequence[inputIndex]){finishExtra(`Последовательность оборвалась на раунде ${round}.`,Math.min(1.25,0.35+round*.11),false);return;}inputIndex++;if(inputIndex===sequence.length)setTimeout(nextRound,300);});gameCleanup=()=>{stopped=true;clearTimeout(timer);};nextRound();
}

function initClickRushGame(){
  const area=$('gameArea'),game=gameById(activeGame),fps=gameFPS(game),duration=10000;let clicks=0,start=performance.now(),stopped=false;
  area.innerHTML=gameHeader('🖱️ Click Rush','Кликай по цели 10 секунд.', 'clickRushBack',fps)+`<button id="rushBtn" class="rush-target">КЛИК</button><div id="rushStatus" class="color-status"></div>`;area.querySelector('#clickRushBack').onclick=backToGamePicker;const btn=$('rushBtn'),status=$('rushStatus');function move(){btn.style.left=randInt(5,82)+'%';btn.style.top=randInt(10,78)+'%';}btn.onclick=()=>{if(stopped)return;clicks++;move();};move();const endTimer=setTimeout(()=>{if(stopped)return;stopped=true;finishExtra(`За 10 секунд: ${clicks} кликов.`,Math.max(.35,Math.min(1.6,clicks/15)));},duration);gameCleanup=()=>{stopped=true;clearTimeout(endTimer);};
}

function canvasGameShell(title,hint,backId,fps){
  const area=$('gameArea');area.innerHTML=gameHeader(title,hint,backId,fps)+`<canvas class="arcade-canvas" id="arcadeCanvas" width="720" height="420"></canvas><div id="canvasStatus" class="color-status"></div>`;area.querySelector('#'+backId).onclick=backToGamePicker;return $('arcadeCanvas');
}

function initDodgeGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('☄️ Уклонение','Стрелки / WASD. Выживи 20 секунд.', 'dodgeBack',fps),ctx=canvas.getContext('2d');let x=360,y=360,keys={},hazards=[],stopped=false,raf=0,start=performance.now(),last=performance.now();function key(e,v){keys[e.key.toLowerCase()]=v;if(v&&['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()))e.preventDefault();}window.addEventListener('keydown',e=>key(e,true));window.addEventListener('keyup',e=>key(e,false));function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;x+=(keys.arrowright||keys.d?1:0)*260*dt;x-=(keys.arrowleft||keys.a?1:0)*260*dt;y+=(keys.arrowdown||keys.s?1:0)*260*dt;y-=(keys.arrowup||keys.w?1:0)*260*dt;x=Math.max(12,Math.min(708,x));y=Math.max(12,Math.min(408,y));if(Math.random()<dt*(4+fps/70))hazards.push({x:randInt(10,710),y:-10,s:randInt(4,10)});hazards.forEach(h=>h.y+=h.s*55*dt);hazards=hazards.filter(h=>h.y<440);const hit=hazards.some(h=>Math.hypot(h.x-x,h.y-y)<20);ctx.clearRect(0,0,720,420);ctx.fillStyle='rgba(20,30,40,.96)';ctx.fillRect(0,0,720,420);ctx.fillStyle='#4ea2ff';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff5d6c';hazards.forEach(h=>{ctx.beginPath();ctx.arc(h.x,h.y,8,0,Math.PI*2);ctx.fill();});const sec=(t-start)/1000;$('canvasStatus').textContent=`${(20-sec).toFixed(1)} сек осталось`;if(hit){stopped=true;finishExtra('Попадание. Игра окончена.',Math.max(.3,sec/18),false);return;}if(sec>=20){stopped=true;finishExtra('Выжил все 20 секунд.',1.35);return;}raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',e=>key(e,true));window.removeEventListener('keyup',e=>key(e,false));};
}

function initSnakeGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🐍 Змейка','Стрелки / WASD. Собери 10 яблок.', 'snakeBack',fps),ctx=canvas.getContext('2d'),cell=21,cols=34,rows=20;let snake=[{x:8,y:10}],dir={x:1,y:0},nextDir={...dir},food={x:20,y:10},score=0,stopped=false,acc=0,last=performance.now(),raf=0;const keyMap={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]};function kd(e){const v=keyMap[e.key.toLowerCase()];if(!v)return;if(v[0]!==-dir.x||v[1]!==-dir.y)nextDir={x:v[0],y:v[1]};}window.addEventListener('keydown',kd);function spawn(){do{food={x:randInt(0,cols-1),y:randInt(0,rows-1)}}while(snake.some(s=>s.x===food.x&&s.y===food.y));}function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;acc+=dt;const step=Math.max(.05,.11-(fps-30)/2500);if(acc>step){acc=0;dir=nextDir;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some(s=>s.x===head.x&&s.y===head.y)){stopped=true;finishExtra(`Змея: ${score} яблок.`,Math.max(.3,score/8),false);return;}snake.unshift(head);if(head.x===food.x&&head.y===food.y){score++;if(score>=10){stopped=true;finishExtra('Собрано 10 яблок!',1.3);return;}spawn();}else snake.pop();}ctx.clearRect(0,0,720,420);ctx.fillStyle='#10161c';ctx.fillRect(0,0,720,420);ctx.fillStyle='#e3b94e';ctx.fillRect(food.x*cell,food.y*cell,cell-2,cell-2);ctx.fillStyle='#48b97b';snake.forEach(s=>ctx.fillRect(s.x*cell,s.y*cell,cell-2,cell-2));$('canvasStatus').textContent=`🍎 ${score}/10`;raf=gameRAF(loop,fps);}spawn();raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);};
}

function initMazeGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🧩 Лабиринт','Стрелки / WASD. Найди выход.', 'mazeBack',fps),ctx=canvas.getContext('2d');const cols=21,rows=13,cell=30;let px=1,py=1,stopped=false,keys={};const grid=Array.from({length:rows},()=>Array(cols).fill(1));function carve(x,y){grid[y][x]=0;const ds=[[2,0],[-2,0],[0,2],[0,-2]].sort(()=>Math.random()-.5);for(const[dX,dY]of ds){const nx=x+dX,ny=y+dY;if(nx>0&&nx<cols-1&&ny>0&&ny<rows-1&&grid[ny][nx]){grid[y+dY/2][x+dX/2]=0;carve(nx,ny);}}}carve(1,1);grid[rows-2][cols-2]=0;function kd(e){keys[e.key.toLowerCase()]=true;}function ku(e){keys[e.key.toLowerCase()]=false;}window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);let last=performance.now(),raf=0;function loop(t){if(stopped)return;const now=t;if(now-last>110){last=now;const dirs=[['arrowup',0,-1],['w',0,-1],['arrowdown',0,1],['s',0,1],['arrowleft',-1,0],['a',-1,0],['arrowright',1,0],['d',1,0]];for(const[k,dx,dy]of dirs){if(keys[k]&&grid[py+dy]?.[px+dx]===0){px+=dx;py+=dy;break;}}if(px===cols-2&&py===rows-2){stopped=true;finishExtra('Выход найден!',1.25);return;}}ctx.fillStyle='#0e1419';ctx.fillRect(0,0,630,390);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){ctx.fillStyle=grid[y][x]?'#273039':'#10161c';ctx.fillRect(x*cell,y*cell,cell-1,cell-1);}ctx.fillStyle='#4ea2ff';ctx.fillRect((cols-2)*cell+5,(rows-2)*cell+5,cell-10,cell-10);ctx.fillStyle='#6bd18a';ctx.beginPath();ctx.arc(px*cell+15,py*cell+15,9,0,Math.PI*2);ctx.fill();raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initShooterGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🎯 Target Storm','Кликай по движущимся целям. 15 попаданий.', 'shooterBack',fps),ctx=canvas.getContext('2d');let target={x:100,y:100,r:22},hits=0,stopped=false,start=performance.now(),raf=0;function move(){target={x:randInt(35,685),y:randInt(55,385),r:randInt(16,25)};}canvas.addEventListener('click',e=>{if(stopped)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*720/r.width,y=(e.clientY-r.top)*420/r.height;if(Math.hypot(x-target.x,y-target.y)<=target.r){hits++;if(hits>=15){stopped=true;const sec=(performance.now()-start)/1000;finishExtra(`15 попаданий за ${sec.toFixed(1)} сек.`,Math.max(.4,1.4-sec/10),true);return;}move();}});function loop(t){if(stopped)return;ctx.fillStyle='#10161c';ctx.fillRect(0,0,720,420);target.x+=Math.sin(t/170)*1.8;target.y+=Math.cos(t/230)*1.3;target.x=Math.max(25,Math.min(695,target.x));target.y=Math.max(50,Math.min(395,target.y));ctx.fillStyle='#e85d68';ctx.beginPath();ctx.arc(target.x,target.y,target.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(target.x,target.y,target.r/3,0,Math.PI*2);ctx.fill();$('canvasStatus').textContent=`🎯 ${hits}/15`;raf=gameRAF(loop,fps);}move();raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);};
}

function initPongGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🏓 Pong','W/S или стрелки. Первый до 7 очков.', 'pongBack',fps),ctx=canvas.getContext('2d');let py=180,aiy=180,x=360,y=210,vx=220,vy=135,player=0,ai=0,keys={},stopped=false,last=performance.now(),raf=0;const kd=e=>{keys[e.key.toLowerCase()]=true;},ku=e=>{keys[e.key.toLowerCase()]=false;};window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function reset(dir){x=360;y=210;vx=220*dir;vy=randInt(-110,110);}function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;py+=(keys.w||keys.arrowup?-1:0)*310*dt+(keys.s||keys.arrowdown?1:0)*310*dt;py=Math.max(15,Math.min(345,py));aiy+=Math.sign(y-aiy)*230*dt; x+=vx*dt;y+=vy*dt;if(y<8||y>412){vy*=-1;}if(x<35&&y>py&&y<py+70){x=35;vx=Math.abs(vx)*1.04;vy+=(y-(py+35))*2;}if(x>685&&y>aiy&&y<aiy+70){x=685;vx=-Math.abs(vx)*1.04;vy+=(y-(aiy+35))*2;}if(x<-20){ai++;reset(1);}if(x>740){player++;reset(-1);}if(player>=7||ai>=7){stopped=true;finishExtra(`Pong: ${player} : ${ai}.`,player>=7?1.3:.3, player>=7);return;}ctx.fillStyle='#10161c';ctx.fillRect(0,0,720,420);ctx.fillStyle='#e6edf3';ctx.fillRect(20,py,12,70);ctx.fillRect(688,aiy,12,70);ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();ctx.font='28px Arial';ctx.textAlign='center';ctx.fillText(`${player} : ${ai}`,360,35);raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initBreakoutGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🧱 Breakout','Левая/правая или A/D. Разбей все блоки.', 'breakoutBack',fps),ctx=canvas.getContext('2d');let paddle=300,x=360,y=350,vx=170,vy=-180,bricks=[],keys={},stopped=false,last=performance.now(),raf=0;for(let r=0;r<4;r++)for(let c=0;c<10;c++)bricks.push({x:35+c*65,y:35+r*24,w:58,h:18,on:true});const kd=e=>keys[e.key.toLowerCase()]=true,ku=e=>keys[e.key.toLowerCase()]=false;window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;paddle+=(keys.a||keys.arrowleft?-1:0)*330*dt+(keys.d||keys.arrowright?1:0)*330*dt;paddle=Math.max(0,Math.min(630,paddle));x+=vx*dt;y+=vy*dt;if(x<8||x>712)vx*=-1;if(y<8)vy*=-1;if(y>390&&x>paddle&&x<paddle+90)vy=-Math.abs(vy);for(const b of bricks)if(b.on&&x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h){b.on=false;vy*=-1;break;}if(y>430){stopped=true;finishExtra(`Мяч упущен. Осталось блоков: ${bricks.filter(b=>b.on).length}.`,.3,false);return;}if(bricks.every(b=>!b.on)){stopped=true;finishExtra('Все блоки уничтожены!',1.4);return;}ctx.fillStyle='#10161c';ctx.fillRect(0,0,720,420);ctx.fillStyle='#4ea2ff';ctx.fillRect(paddle,400,90,10);ctx.fillStyle='#e6edf3';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d45c68';bricks.filter(b=>b.on).forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));$('canvasStatus').textContent=`🧱 Осталось: ${bricks.filter(b=>b.on).length}`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initFlappyGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🐤 Flappy','Пробел / клик — взлёт. Пройди 12 ворот.', 'flappyBack',fps),ctx=canvas.getContext('2d');let birdY=210,vy=0,gates=[],passed=0,stopped=false,last=performance.now(),raf=0;function gate(){gates.push({x:730,gapY:randInt(100,315)});}canvas.addEventListener('click',()=>{if(!stopped)vy=-280;});window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(!stopped)vy=-280;}});gate();function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;vy+=780*dt;birdY+=vy*dt;gates.forEach(g=>g.x-=160*dt);if(gates.length<4&&gates[gates.length-1].x<500)gate();const g=gates[0];if(g&&g.x<370&&g.x>320){if(birdY<g.gapY-55||birdY>g.gapY+55){stopped=true;finishExtra(`Врезался на воротах ${passed+1}.`,Math.max(.3,passed/10),false);return;}}if(g&&g.x+30<330){gates.shift();passed++;if(passed>=12){stopped=true;finishExtra('Пройдено 12 ворот!',1.35);return;}}if(birdY<0||birdY>420){stopped=true;finishExtra(`Падение. Ворот: ${passed}.`,.3,false);return;}ctx.fillStyle='#0f1820';ctx.fillRect(0,0,720,420);ctx.fillStyle='#73b8ff';ctx.beginPath();ctx.arc(330,birdY,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4aab76';gates.forEach(g=>{ctx.fillRect(g.x,0,30,g.gapY-55);ctx.fillRect(g.x,g.gapY+55,30,420);});$('canvasStatus').textContent=`🚪 ${passed}/12`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);};
}

function initRacerGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🏎️ Неоновая трасса','A/D или ←/→. Переживи 30 секунд.', 'racerBack',fps),ctx=canvas.getContext('2d');let px=360,objects=[],keys={},stopped=false,start=performance.now(),last=performance.now(),raf=0;const kd=e=>keys[e.key.toLowerCase()]=true,ku=e=>keys[e.key.toLowerCase()]=false;window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;px+=(keys.a||keys.arrowleft?-1:0)*300*dt+(keys.d||keys.arrowright?1:0)*300*dt;px=Math.max(120,Math.min(600,px));if(Math.random()<dt*2.8)objects.push({x:randInt(120,600),y:-30,s:220+Math.random()*100});objects.forEach(o=>o.y+=o.s*dt);objects=objects.filter(o=>o.y<450);if(objects.some(o=>Math.abs(o.x-px)<35&&Math.abs(o.y-350)<50)){stopped=true;finishExtra('Авария на трассе.',Math.max(.3,(t-start)/30000),false);return;}const sec=(t-start)/1000;ctx.fillStyle='#0d1116';ctx.fillRect(0,0,720,420);ctx.fillStyle='#2d343c';ctx.fillRect(100,0,520,420);ctx.strokeStyle='#d5d9df';for(let y=0;y<420;y+=40){const yy=(y+(t/7)%40);ctx.fillRect(355,yy,10,22);}ctx.fillStyle='#4ea2ff';ctx.fillRect(px-18,340,36,60);ctx.fillStyle='#e65c69';objects.forEach(o=>ctx.fillRect(o.x-16,o.y-25,32,50));$('canvasStatus').textContent=`${Math.max(0,30-sec).toFixed(1)} сек`;if(sec>=30){stopped=true;finishExtra('Трасса пройдена!',1.35);return;}raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initAsteroidsGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('☄️ Asteroids','Стрелки + пробел. Уничтожь 20 астероидов.', 'asteroidsBack',fps),ctx=canvas.getContext('2d');let ship={x:360,y:210},bullets=[],asteroids=[],keys={},score=0,stopped=false,last=performance.now(),raf=0;const kd=e=>keys[e.key.toLowerCase()]=true,ku=e=>keys[e.key.toLowerCase()]=false;window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function spawn(){asteroids.push({x:randInt(0,720),y:randInt(0,420),vx:randInt(-50,50),vy:randInt(-50,50),r:randInt(10,22)});}for(let i=0;i<8;i++)spawn();function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;ship.x+=(keys.a||keys.arrowleft?-1:0)*230*dt+(keys.d||keys.arrowright?1:0)*230*dt;ship.y+=(keys.w||keys.arrowup?-1:0)*230*dt+(keys.s||keys.arrowdown?1:0)*230*dt;ship.x=(ship.x+720)%720;ship.y=(ship.y+420)%420;if(keys[' ']){if(!ship.cool||t-ship.cool>220){bullets.push({x:ship.x,y:ship.y,vy:-360});ship.cool=t;}}bullets.forEach(b=>b.y+=b.vy*dt);asteroids.forEach(a=>{a.x=(a.x+a.vx*dt+720)%720;a.y=(a.y+a.vy*dt+420)%420;});for(const b of bullets){const hit=asteroids.findIndex(a=>Math.hypot(a.x-b.x,a.y-b.y)<a.r+5);if(hit>=0){asteroids.splice(hit,1);b.y=-999;score++;spawn();if(score>=20){stopped=true;finishExtra('Уничтожено 20 астероидов!',1.45);return;}}}if(asteroids.some(a=>Math.hypot(a.x-ship.x,a.y-ship.y)<a.r+12)){stopped=true;finishExtra(`Корабль уничтожен. Счёт ${score}/20.`,.3+score/30,false);return;}ctx.fillStyle='#090d12';ctx.fillRect(0,0,720,420);ctx.fillStyle='#e7eef6';ctx.beginPath();ctx.arc(ship.x,ship.y,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#9eb0c4';asteroids.forEach(a=>{ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();});ctx.fillStyle='#f2d36b';bullets.forEach(b=>{ctx.fillRect(b.x-2,b.y-6,4,10)});$('canvasStatus').textContent=`☄️ ${score}/20`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initTetrisGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🟪 Тетрис','← → ↓. Заполни 8 линий.', 'tetrisBack',fps),ctx=canvas.getContext('2d'),cols=10,rows=20,cell=20;let board=Array.from({length:rows},()=>Array(cols).fill(0)),piece={x:4,y:0,w:2,h:2},lines=0,stopped=false,last=performance.now(),acc=0,keys={},raf=0;const kd=e=>keys[e.key.toLowerCase()]=true,ku=e=>keys[e.key.toLowerCase()]=false;window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function spawn(){piece={x:randInt(0,8),y:0,w:randInt(1,2),h:randInt(1,2)};if(board[0].some(Boolean)){stopped=true;finishExtra(`Тетрис: ${lines} линий.`,Math.min(1.3,lines/6+.2),false);}}function collide(ny=piece.y,nx=piece.x){for(let y=0;y<piece.h;y++)for(let x=0;x<piece.w;x++){const bx=nx+x,by=ny+y;if(bx<0||bx>=cols||by>=rows||(by>=0&&board[by][bx]))return true;}return false;}function lock(){for(let y=0;y<piece.h;y++)for(let x=0;x<piece.w;x++){if(piece.y+y>=0)board[piece.y+y][piece.x+x]=1;}for(let y=rows-1;y>=0;y--){if(board[y].every(Boolean)){board.splice(y,1);board.unshift(Array(cols).fill(0));lines++;y++;if(lines>=8){stopped=true;finishExtra('Собрано 8 линий!',1.4);return;}}}spawn();}function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;acc+=dt;if(keys.arrowleft||keys.a){if(!collide(piece.y,piece.x-1))piece.x--;keys.arrowleft=keys.a=false;}if(keys.arrowright||keys.d){if(!collide(piece.y,piece.x+1))piece.x++;keys.arrowright=keys.d=false;}if(keys.arrowdown){acc=.3;}const step=Math.max(.18,.45-(fps/1000));if(acc>step){acc=0;if(!collide(piece.y+1,piece.x))piece.y++;else lock();}ctx.fillStyle='#0d1217';ctx.fillRect(0,0,cols*cell,rows*cell);ctx.fillStyle='#4ea2ff';for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(board[y][x])ctx.fillRect(x*cell+1,y*cell+1,cell-2,cell-2);ctx.fillStyle='#e36f7c';for(let y=0;y<piece.h;y++)for(let x=0;x<piece.w;x++)ctx.fillRect((piece.x+x)*cell+1,(piece.y+y)*cell+1,cell-2,cell-2);$('canvasStatus').textContent=`▦ ${lines}/8 линий`;raf=gameRAF(loop,fps);}spawn();raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initRhythmGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🎵 Ритм','Жми по кругу в момент пульса. 12 нот.', 'rhythmBack',fps),ctx=canvas.getContext('2d');let beat=0,hits=0,target=null,stopped=false,last=performance.now(),raf=0;canvas.addEventListener('click',e=>{if(stopped||!target)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*720/r.width,y=(e.clientY-r.top)*420/r.height;if(Math.hypot(x-target.x,y-target.y)<target.r){hits++;target=null;if(hits>=12){stopped=true;finishExtra(`Ритм: ${hits}/12.`,1.35);}}});function next(){target={x:randInt(70,650),y:randInt(80,360),r:28};beat++;}next();function loop(t){if(stopped)return;ctx.fillStyle='#0d1218';ctx.fillRect(0,0,720,420);const pulse=20+10*Math.sin(t/95);if(target){ctx.strokeStyle='#69b7ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(target.x,target.y,target.r+pulse/3,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#4c9be8';ctx.beginPath();ctx.arc(target.x,target.y,target.r,0,Math.PI*2);ctx.fill();}if(t-last>750-(fps>100?80:0)){last=t;next();}$('canvasStatus').textContent=`🎵 ${hits}/12`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);};
}

function initPlatformerGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🕹️ Pixel Runner','Пробел / стрелка вверх — прыжок. Доберись до финиша.', 'platformerBack',fps),ctx=canvas.getContext('2d');let px=70,py=350,vy=0,scroll=0,obstacles=[],stopped=false,last=performance.now(),raf=0;function jump(){if(py>=350)vy=-420;}window.addEventListener('keydown',e=>{if(e.code==='Space'||e.key==='ArrowUp')jump();});canvas.addEventListener('click',jump);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;vy+=1050*dt;py+=vy*dt;if(py>350){py=350;vy=0;}scroll+=180*dt;if(Math.random()<dt*.8)obstacles.push({x:760,y:340,w:randInt(24,40),h:randInt(25,55)});obstacles.forEach(o=>o.x-=220*dt);obstacles=obstacles.filter(o=>o.x>-60);if(obstacles.some(o=>o.x<px+18&&o.x+o.w>px-18&&py+18>o.y)){stopped=true;finishExtra('Столкновение с препятствием.',.35,false);return;}if(scroll>5000){stopped=true;finishExtra('Финиш достигнут!',1.45);return;}ctx.fillStyle='#10151a';ctx.fillRect(0,0,720,420);ctx.fillStyle='#29343c';ctx.fillRect(0,370,720,50);ctx.fillStyle='#6db0ff';ctx.fillRect(px-16,py-18,32,36);ctx.fillStyle='#df6b75';obstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));$('canvasStatus').textContent=`🏁 ${Math.min(100,Math.round(scroll/50))}%`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);};
}

function initSpaceShooterGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🚀 Space Shooter','Стрелки + пробел. Уничтожь 30 врагов.', 'spaceBack',fps),ctx=canvas.getContext('2d');let x=360,y=360,bullets=[],enemies=[],score=0,keys={},stopped=false,last=performance.now(),raf=0;const kd=e=>keys[e.key.toLowerCase()]=true,ku=e=>keys[e.key.toLowerCase()]=false;window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;x+=(keys.a||keys.arrowleft?-1:0)*280*dt+(keys.d||keys.arrowright?1:0)*280*dt;x=Math.max(20,Math.min(700,x));if(keys[' ']){if(!last.shot||t-last.shot>150){bullets.push({x,y});last.shot=t;}}if(Math.random()<dt*(1.2+fps/180))enemies.push({x:randInt(30,690),y:-20,s:70+Math.random()*90});bullets.forEach(b=>b.y-=420*dt);enemies.forEach(e=>e.y+=e.s*dt);for(const b of bullets){const i=enemies.findIndex(e=>Math.hypot(e.x-b.x,e.y-b.y)<18);if(i>=0){enemies.splice(i,1);b.y=-999;score++;if(score>=30){stopped=true;finishExtra('Волна уничтожена: 30 врагов!',1.5);return;}}}if(enemies.some(e=>Math.hypot(e.x-x,e.y-y)<24)){stopped=true;finishExtra(`Корабль уничтожен. ${score}/30.`,.25+score/40,false);return;}ctx.fillStyle='#070b11';ctx.fillRect(0,0,720,420);ctx.fillStyle='#6db9ff';ctx.fillRect(x-16,y-22,32,44);ctx.fillStyle='#dd6271';enemies.forEach(e=>{ctx.beginPath();ctx.arc(e.x,e.y,14,0,Math.PI*2);ctx.fill();});ctx.fillStyle='#f2d36b';bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-8,4,12));$('canvasStatus').textContent=`🚀 ${score}/30`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
}

function initBenchmarkGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🔥 Stress Test','Запусти тест и смотри, сколько FPS выдаёт твой ПК.', 'benchmarkBack',fps),ctx=canvas.getContext('2d');let particles=Array.from({length:Math.max(120,fps*3)},()=>({x:Math.random()*720,y:Math.random()*420,vx:(Math.random()-.5)*180,vy:(Math.random()-.5)*180})),stopped=false,start=performance.now(),last=performance.now(),frames=0,raf=0;function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;frames++;ctx.fillStyle='#080c11';ctx.fillRect(0,0,720,420);ctx.fillStyle='#8fb8ff';for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<0||p.x>720)p.vx*=-1;if(p.y<0||p.y>420)p.vy*=-1;ctx.fillRect(p.x,p.y,2,2);}const sec=(t-start)/1000;$('canvasStatus').textContent=`Тест: ${Math.min(10,sec).toFixed(1)} / 10 сек • нагрузка: ${particles.length} частиц`;if(sec>=10){stopped=true;finishExtra(`Stress Test завершён. Расчётный FPS ПК: ${fps}.`,Math.min(1.6,.5+fps/180));return;}raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);};
}

// ===== 1. MEMORY =====
function initMemoryGame() {
  const area = $('gameArea');
  const config = { easy: { cells: 9, sequence: 4, columns: 3 }, hard: { cells: 12, sequence: 6, columns: 4 }, hardcore: { cells: 18, sequence: 9, columns: 6 } }[state.mode];
  const sequence = []; let lastIndex = -1; let userIndex = 0; let accepting = false; let stopped = false; let timer = null;
  while (sequence.length < config.sequence) {
    const nextIndex = Math.floor(Math.random() * config.cells);
    if (nextIndex === lastIndex) continue;
    sequence.push(nextIndex); lastIndex = nextIndex;
  }
  area.innerHTML = `<div class="game-header"><div><strong>🧠 Память</strong><span id="memoryStatus">Смотри последовательность...</span></div><button class="small" id="memoryBack">Назад</button></div><div id="memoryBoard" class="memory-board"></div>`;
  const board = $('memoryBoard'); const status = $('memoryStatus'); board.style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`;
  for (let i = 0; i < config.cells; i += 1) { const button = document.createElement('button'); button.className = 'memory-cell'; button.dataset.index = i; board.appendChild(button); }
  const cells = [...board.children];
  function endMemory(success, correctClicks) {
    if (stopped) return; stopped = true; clearTimeout(timer); cells.forEach((cell) => { cell.disabled = true; });
    if (success) finishGame('Последовательность пройдена!', 1 + correctClicks / 60, true); else finishGame('Ошибка. Последовательность сбилась.', 0.25, false);
  }
  function startInput() { if (stopped) return; accepting = true; status.textContent = `Повтори последовательность из ${config.sequence} клеток.`; cells.forEach((cell) => { cell.disabled = false; cell.addEventListener('click', onCellClick); }); }
  function showSequence(position = 0) {
    if (stopped) return;
    if (position >= sequence.length) { timer = setTimeout(startInput, 400); return; }
    cells.forEach((cell) => cell.classList.remove('flash'));
    const cell = cells[sequence[position]]; cell.classList.add('flash');
    timer = setTimeout(() => { cell.classList.remove('flash'); timer = setTimeout(() => showSequence(position + 1), 180); }, 420);
  }
  function onCellClick(event) {
    if (!accepting || stopped) return;
    const index = Number(event.currentTarget.dataset.index);
    if (index !== sequence[userIndex]) { event.currentTarget.classList.add('wrong'); setTimeout(() => event.currentTarget.classList.remove('wrong'), 180); endMemory(false, userIndex); return; }
    event.currentTarget.classList.add('correct'); setTimeout(() => event.currentTarget.classList.remove('correct'), 120); userIndex += 1;
    if (userIndex === sequence.length) endMemory(true, userIndex);
  }
  gameCleanup = () => { stopped = true; clearTimeout(timer); cells.forEach((cell) => cell.removeEventListener('click', onCellClick)); };
  $('memoryBack').addEventListener('click', backToGamePicker, { once: true }); cells.forEach((cell) => { cell.disabled = true; }); showSequence();
}

// ===== 2. MATH =====
function initMathGame() {
  const area = $('gameArea'); const TOTAL_TIME = state.mode === 'easy' ? 18 : state.mode === 'hard' ? 16 : 15;
  let timeLeft = TOTAL_TIME, solved = 0, mistakes = 0, timerId = null, finished = false;
  area.innerHTML = `<div class="game-header"><div><strong>🧮 Матеша</strong><span id="mathHint">Решай как можно больше примеров.</span></div><button class="small" id="mathBack">Назад</button></div><div class="math-stats"><span>⏱️ <b id="mathTime">${TOTAL_TIME}</b> сек</span><span>✅ <b id="mathSolved">0</b></span><span>❌ <b id="mathMistakes">0</b></span></div><div class="math-card"><div id="mathQuestion" class="math-question"></div><input id="mathInput" class="math-input" type="text" inputmode="decimal" autocomplete="off" placeholder="Ответ"><button id="mathSubmit" class="primary">Ответить</button></div>`;
  const timeEl = $('mathTime'), solvedEl = $('mathSolved'), mistakesEl = $('mathMistakes'), questionEl = $('mathQuestion'), input = $('mathInput'), submit = $('mathSubmit'), hint = $('mathHint');
  if (state.mode === 'hardcore') hint.textContent = 'Корни, факториалы, дроби и обычная арифметика. Время не ждёт.'; else if (state.mode === 'hard') hint.textContent = 'Арифметика посложнее, включая деление.';
  function factorial(n) { let result = 1; for (let i = 2; i <= n; i += 1) result *= i; return result; }
  function randomQuestion() {
    const hardcoreTypes = ['add', 'sub', 'mul', 'div', 'root', 'factorial', 'fraction']; const normalTypes = state.mode === 'easy' ? ['add', 'sub', 'mul'] : ['add', 'sub', 'mul', 'div'];
    const types = state.mode === 'hardcore' ? hardcoreTypes : normalTypes; const type = types[randInt(0, types.length - 1)]; let text; let answer;
    if (type === 'add') { const max = state.mode === 'easy' ? 300 : state.mode === 'hard' ? 700 : 1200; const a = randInt(10, max), b = randInt(10, max); text = `${a} + ${b} = ?`; answer = a + b; }
    else if (type === 'sub') { const a = randInt(20, state.mode === 'easy' ? 350 : 900), b = randInt(10, a); text = `${a} - ${b} = ?`; answer = a - b; }
    else if (type === 'mul') { const a = randInt(2, state.mode === 'easy' ? 20 : state.mode === 'hard' ? 35 : 60), b = randInt(2, state.mode === 'easy' ? 15 : state.mode === 'hard' ? 25 : 40); text = `${a} × ${b} = ?`; answer = a * b; }
    else if (type === 'div') { const b = randInt(2, state.mode === 'hard' ? 20 : 35), result = randInt(2, state.mode === 'hard' ? 30 : 80), a = b * result; text = `${a} ÷ ${b} = ?`; answer = result; }
    else if (type === 'root') { const n = randInt(2, 18); text = `√${n * n} = ?`; answer = n; }
    else if (type === 'factorial') { const n = randInt(3, 7); text = `${n}! = ?`; answer = factorial(n); }
    else { const denominators = [2, 3, 4, 5, 6, 8, 10]; const d1 = denominators[randInt(0, denominators.length - 1)], d2 = denominators[randInt(0, denominators.length - 1)], a = randInt(1, d1), b = randInt(1, d2), sign = Math.random() < 0.5 ? '+' : '-'; answer = sign === '+' ? a / d1 + b / d2 : a / d1 - b / d2; text = `${a}/${d1} ${sign} ${b}/${d2} = ?`; }
    return { text, answer };
  }
  function parseAnswer(value) { const raw = String(value).trim().replace(',', '.'); if (raw.includes('/')) { const parts = raw.split('/'); if (parts.length === 2) { const n = Number(parts[0].trim()), d = Number(parts[1].trim()); if (Number.isFinite(n) && Number.isFinite(d) && d !== 0) return n / d; } } return Number(raw); }
  function nextQuestion() { const q = randomQuestion(); questionEl.textContent = q.text; questionEl.dataset.answer = String(q.answer); input.value = ''; input.focus(); }
  function finishMath() { if (finished) return; finished = true; clearInterval(timerId); input.disabled = true; submit.disabled = true; const speedBonus = Math.min(0.8, solved * 0.07); const accuracyPenalty = Math.min(0.35, mistakes * 0.05); finishGame(`Время! Решено: ${solved}, ошибок: ${mistakes}.`, Math.max(0.2, 0.65 + speedBonus - accuracyPenalty), true); }
  function answerQuestion() { if (finished) return; const answer = parseAnswer(input.value); if (!Number.isFinite(answer) || input.value.trim() === '') return; const expected = Number(questionEl.dataset.answer); if (Math.abs(answer - expected) < 0.0001) { solved += 1; solvedEl.textContent = solved; } else { mistakes += 1; mistakesEl.textContent = mistakes; } nextQuestion(); }
  submit.addEventListener('click', answerQuestion); input.addEventListener('keydown', (event) => { if (event.key === 'Enter') answerQuestion(); }); $('mathBack').addEventListener('click', backToGamePicker, { once: true });
  timerId = setInterval(() => { timeLeft -= 1; timeEl.textContent = timeLeft; if (timeLeft <= 0) finishMath(); }, 1000);
  gameCleanup = () => { finished = true; clearInterval(timerId); };
  nextQuestion();
}
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ===== 3. KOTOKBASIK =====
function initCatsGame() {
  const area = $('gameArea'); const config = { easy: { targets: 8, lifetime: 1150, spawnDelay: [450, 900], size: [46, 62] }, hard: { targets: 10, lifetime: 900, spawnDelay: [250, 650], size: [42, 58] }, hardcore: { targets: 14, lifetime: 650, spawnDelay: [100, 420], size: [34, 52] } }[state.mode];
  const TOTAL_TARGETS = config.targets, TARGET_LIFETIME = config.lifetime; let targetNumber = 0, hits = 0, missed = 0, spawnedAt = 0, spawnTimeout = null, missTimeout = null, stopped = false;
  area.innerHTML = `<div class="game-header"><div><strong>🐱 Котокбасик</strong><span id="catsHint">Жми на кружки до того, как они исчезнут.</span></div><button class="small" id="catsBack">Назад</button></div><div class="cats-stats"><span>🎯 <b id="catsProgress">0</b>/${TOTAL_TARGETS}</span><span>✅ <b id="catsHits">0</b></span><span>❌ <b id="catsMissed">0</b></span><span>💨 <b id="catsSpeed">0</b> мс</span></div><div id="catsArena" class="cats-arena"></div>`;
  const arena = $('catsArena'), progressEl = $('catsProgress'), hitsEl = $('catsHits'), missedEl = $('catsMissed'), speedEl = $('catsSpeed'), hintEl = $('catsHint');
  if (state.mode === 'hardcore') hintEl.textContent = '14 целей. Кружки живут очень недолго.'; else if (state.mode === 'hard') hintEl.textContent = '10 целей и ускоренный темп.';
  function finishCats() { if (stopped) return; stopped = true; clearTimeout(spawnTimeout); clearTimeout(missTimeout); arena.innerHTML = ''; const accuracy = hits / TOTAL_TARGETS; const avgReaction = hits > 0 ? Number(speedEl.textContent) : TARGET_LIFETIME; const speedFactor = Math.max(0.1, 1.35 - (avgReaction / 1000)); finishGame(`Результат: ${hits} из ${TOTAL_TARGETS} попаданий.`, Math.max(0.2, accuracy * speedFactor), hits === TOTAL_TARGETS); }
  function spawnTarget() { if (stopped || targetNumber >= TOTAL_TARGETS) { finishCats(); return; } targetNumber += 1; progressEl.textContent = targetNumber; const target = document.createElement('button'); target.className = 'cat-target'; target.setAttribute('aria-label', 'Цель'); target.style.left = `${randInt(5, 91)}%`; target.style.top = `${randInt(8, 83)}%`; const size = randInt(config.size[0], config.size[1]); target.style.width = `${size}px`; target.style.height = `${size}px`; spawnedAt = performance.now(); arena.appendChild(target); const removeTarget = (wasHit) => { clearTimeout(missTimeout); target.remove(); if (!wasHit) { missed += 1; missedEl.textContent = missed; } if (targetNumber >= TOTAL_TARGETS) { finishCats(); return; } spawnTimeout = setTimeout(spawnTarget, randInt(config.spawnDelay[0], config.spawnDelay[1])); }; target.addEventListener('click', (event) => { event.stopPropagation(); if (stopped || !target.isConnected) return; const reaction = Math.round(performance.now() - spawnedAt); hits += 1; hitsEl.textContent = hits; speedEl.textContent = reaction; removeTarget(true); }, { once: true }); missTimeout = setTimeout(() => removeTarget(false), TARGET_LIFETIME); }
  $('catsBack').addEventListener('click', backToGamePicker, { once: true }); gameCleanup = () => { stopped = true; clearTimeout(spawnTimeout); clearTimeout(missTimeout); }; spawnTimeout = setTimeout(spawnTarget, randInt(config.spawnDelay[0], config.spawnDelay[1]));
}

function displayPartValue(category) {
  const installedId = state.installed?.[category];
  if (!installedId) return 'НЕТ';
  const item = itemById(installedId);
  if (!item) return 'НЕТ';
  const info = brokenInfo(item);
  return info ? `🔴 ${item.name} • СЛОМАНО ${info.damage}%` : item.name;
}
function displayPartLabel(category) {
  return state.mode === 'easy' ? (MAIN_PART_LABELS_EASY[category] || category) : category;
}
function setMoneyVisible(visible) {
  const moneyWrap = $('money')?.parentElement;
  if (moneyWrap) moneyWrap.classList.toggle('hidden', !visible);
}

function showMainMenu() {
  closeGame();
  stopAfk();
  stopAiTraining();
  closeShop();
  $('mainMenuScreen').classList.remove('hidden');
  $('modeScreen').classList.add('hidden');
  $('gameScreen').classList.add('hidden');
  setMoneyVisible(false);
  $('continueWrap').classList.toggle('hidden', !state);
  updateAchievementMenuButton();
}

function showModeScreen() {
  closeGame();
  stopAfk();
  stopAiTraining();
  closeShop();
  $('mainMenuScreen').classList.add('hidden');
  $('modeScreen').classList.remove('hidden');
  $('gameScreen').classList.add('hidden');
  setMoneyVisible(false);
}

function afkTaskLimit() {
  if (afkMode !== 'overclock') return 0;
  if (state?.mode === 'hardcore') return 3;
  if (state?.mode === 'hard') return 2;
  return 1;
}
function afkTaskCount() { return Object.keys(afkTasks).length; }
function clearAfkStopListeners() {
  if (!afkStorageStopListeners.length) return;
  afkStorageStopListeners.forEach(({ type, handler, options }) => document.removeEventListener(type, handler, options));
  afkStorageStopListeners = [];
}
function clearAfkTaskTimers(task) {
  if (!task) return;
  ['startTimer','glitchTimer','stopTimer','deadlineTimer'].forEach((key) => { if (task[key]) clearTimeout(task[key]); task[key] = null; });
}
function clearAfkTaskSpawnTimers() {
  afkSpawnTimers.forEach((timer) => clearTimeout(timer));
  afkSpawnTimers = [];
  afkNextTaskAt = 0;
}
function clearAfkTasks() {
  Object.values(afkTasks).forEach(clearAfkTaskTimers);
  afkTasks = {};
  clearAfkTaskSpawnTimers();
  clearAfkStopListeners();
  afkComponentTask = null;
  closeAfkTask();
}
function pruneAfkTasks() {
  for (const [type, task] of Object.entries(afkTasks)) {
    const category = type === 'gpu' ? 'GPU' : type === 'storage' ? 'Storage' : 'CPU';
    if (!componentAfkAvailable(category)) {
      clearAfkTaskTimers(task);
      delete afkTasks[type];
    }
  }
  if (!afkTasks.storage) clearAfkStopListeners();
}
function taskIntervalSeconds() { return randInt(30, 150) / 10; }
function ramCapacityGb(item) {
  if (!item || item.category !== 'RAM') return 0;
  if (/starter-easy-ram/i.test(item.id)) return 8;
  if (/starter-hard-ram/i.test(item.id)) return 4;
  if (/starter-hardcore-ram/i.test(item.id)) return 2;
  const match = String(item.name || '').match(/(\d+(?:[.,]\d+)?)\s*(?:GB|ГБ)/i);
  return match ? Number(match[1].replace(',', '.')) : 0;
}
function storageCapacityGb(item) {
  if (!item || item.category !== 'Storage') return 0;
  const match = String(item.name || '').match(/(\d+(?:[.,]\d+)?)\s*(TB|ТБ|GB|ГБ)/i);
  if (!match) return 0;
  const value = Number(match[1].replace(',', '.'));
  return /TB|ТБ/i.test(match[2]) ? value * 1000 : value;
}
function storageType(item) {
  if (!item || item.category !== 'Storage') return 'HDD';
  const text = `${item.series || ''} ${item.name || ''}`;
  if (/NVMe/i.test(text)) return 'NVMe';
  if (/SATA/i.test(text)) return 'SATA';
  return 'HDD';
}
function afkStorageInterval(item = installedItem('Storage')) {
  if (!item) return 10000;
  const type = storageType(item);
  if (type === 'NVMe') return 1000;
  if (type === 'SATA') return 2000;
  return 5000;
}
function afkStorageBonus(item) {
  if (!item || item.category !== 'Storage') return 0;
  const gb = storageCapacityGb(item);
  const type = storageType(item);
  let multiplier = 1;
  if (type === 'HDD') multiplier = 1 + Math.min(0.75, gb / 2000);
  else if (type === 'SATA') multiplier = 1 + Math.min(1, gb / 1200);
  else multiplier = 1 + Math.min(1.25, gb / 1000);
  return Math.max(0, multiplier - 1);
}
function cpuCoolingDuration() {
  const item = installedItem('Cooling');
  if (!item) return 3;
  const capacity = coolingCapacity(item);
  if (capacity <= 65) return 3.0;
  if (capacity <= 95) return 2.5;
  if (capacity <= 140) return 2.0;
  if (capacity <= 180) return 1.5;
  if (capacity <= 220) return 1.2;
  if (capacity <= 300) return 0.8;
  return 0.5;
}
function cpuTaskDeadline() {
  let min = 6, max = 10;
  if (state?.mode === 'hardcore') { min = 2.5; max = 4; }
  else if (state?.mode === 'hard') { min = 4; max = 6; }
  const minPossible = Math.max(min, cpuCoolingDuration() + 0.25);
  const floor = Math.min(minPossible, max - 0.05);
  return floor + Math.random() * (max - floor);
}
function gpuTaskDuration() {
  if (state?.mode === 'hardcore') return 4;
  if (state?.mode === 'hard') return 6;
  return 10;
}
function scheduleAfkTaskSpawn() {
  if (!afkRunning || afkOverheated) return;
  pruneAfkTasks();
  const desiredTimers = afkTaskLimit();
  const missing = Math.max(0, desiredTimers - afkSpawnTimers.length);
  for (let i = 0; i < missing; i++) {
    const delay = taskIntervalSeconds() * 1000;
    let timerId = null;
    timerId = setTimeout(() => {
      afkSpawnTimers = afkSpawnTimers.filter((id) => id !== timerId);
      if (!afkRunning || afkOverheated) return;
      trySpawnAfkTask();
      scheduleAfkTaskSpawn();
    }, delay);
    afkSpawnTimers.push(timerId);
  }
}
function attachStorageStopWatch(taskId) {
  clearAfkStopListeners();
  const events = ['mousemove','pointermove','mousedown','pointerdown','click','keydown','keyup','wheel','touchstart','touchmove','contextmenu'];
  const fail = (event) => {
    const task = afkTasks.storage;
    if (!task || task.id !== taskId || task.phase !== 'stop') return;
    event.preventDefault?.();
    event.stopPropagation?.();
    failAfkTask('storage', '💥 Накопитель повреждён: во время STOP произошло действие.');
  };
  events.forEach((type) => {
    document.addEventListener(type, fail, { capture: true, passive: false });
    afkStorageStopListeners.push({ type, handler: fail, options: { capture: true, passive: false } });
  });
}
function startStorageTask() {
  const task = afkTasks.storage;
  if (!task) return;
  const glitchMs = state?.mode === 'hardcore' ? 200 : state?.mode === 'hard' ? 500 : 1000;
  task.phase = 'glitch';
  task.glitchStartedAt = performance.now();
  renderAfkPanel();
  task.glitchTimer = setTimeout(() => {
    if (!afkTasks.storage || afkTasks.storage.id !== task.id) return;
    task.phase = 'stop';
    task.stopStartedAt = performance.now();
    task.stopDeadline = performance.now() + 1500;
    attachStorageStopWatch(task.id);
    renderAfkPanel();
    task.stopTimer = setTimeout(() => {
      if (!afkTasks.storage || afkTasks.storage.id !== task.id || task.phase !== 'stop') return;
      finishAfkComponentTask('storage', '💾 Накопитель пережил сбой. ');
    }, 1500);
  }, glitchMs);
}
function startGpuTask() {
  const count = randInt(3, 5);
  const ads = [
    'Ваша видеокарта слишком хороша! Заберите БЕСПЛАТНЫЙ приз!',
    'СРОЧНО: найден секретный буст FPS!',
    'Скидка 99.9% на абсолютно необходимую вещь!',
    'Ваш ПК выбран для участия в супер-розыгрыше!',
    'Нажмите кнопку! Она точно что-то даст!'
  ];
  afkTasks.gpu = { id: ++afkTaskCounter, type: 'gpu', ads: Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    text: ads[randInt(0, ads.length - 1)],
    left: 4 + Math.random() * 78,
    top: 8 + Math.random() * 76,
    z: 40 + i
  })), deadline: performance.now() + gpuTaskDuration() * 1000, startedAt: performance.now() };
}
function startCpuTask() {
  afkOverheated = true;
  afkCoolProgress = 0;
  afkHeatDeadline = performance.now() + cpuTaskDeadline() * 1000;
  afkTasks.cpu = { id: ++afkTaskCounter, type: 'cpu', startedAt: performance.now(), deadline: afkHeatDeadline };
}
function trySpawnAfkTask() {
  if (!afkRunning || afkOverheated) return;
  pruneAfkTasks();
  if (afkTaskCount() >= afkTaskLimit()) return;
  const available = activeAfkComponents().filter((category) => {
    const type = category === 'GPU' ? 'gpu' : category === 'Storage' ? 'storage' : 'cpu';
    return !afkTasks[type];
  });
  if (!available.length) return;
  const type = available[randInt(0, available.length - 1)];
  if (type === 'GPU') startGpuTask();
  else if (type === 'Storage') {
    const task = afkTasks.storage = { id: ++afkTaskCounter, type: 'storage', phase: 'idle', startedAt: performance.now() };
    task.startTimer = setTimeout(() => startStorageTask(), randInt(1, 12) * 100);
  } else startCpuTask();
  renderAfkPanel();
}
function componentTaskReward(type) {
  const item = installedItem(type === 'gpu' ? 'GPU' : type === 'storage' ? 'Storage' : 'CPU');
  if (!item) return 0;
  const factor = type === 'gpu' ? 0.65 : type === 'storage' ? 0.40 : 0.55;
  return Math.max(2, Math.floor(state.baseReward * (factor + (item.performance || 0) / (type === 'gpu' ? 250 : type === 'storage' ? 220 : 180))));
}
function finishAfkComponentTask(type, message) {
  const task = afkTasks[type];
  if (!task) return;
  clearAfkTaskTimers(task);
  if (type === 'storage') clearAfkStopListeners();
  delete afkTasks[type];
  if (type === 'cpu') {
    afkOverheated = false; afkCoolProgress = 0; afkHeatDeadline = 0;
  }
  const reward = componentTaskReward(type);
  state.money += reward;
  checkAchievements();
  save(); $('money').textContent = formatMoney(state.money); $('gameResult').textContent = `${message} +$${formatMoney(reward)}`;
  afkLastPayoutAt = performance.now(); afkNextPayoutAt = afkLastPayoutAt + afkPayoutInterval();
  renderAfkPanel();
  if (afkRunning) scheduleAfkTaskSpawn();
}
function failAfkTask(type, message) {
  const task = afkTasks[type];
  if (!task) return;
  const category = type === 'gpu' ? 'GPU' : type === 'storage' ? 'Storage' : 'CPU';
  clearAfkTaskTimers(task);
  if (type === 'storage') clearAfkStopListeners();
  delete afkTasks[type];
  afkRunning = false;
  resetAfkTimersOnly();
  clearAfkTaskSpawnTimers();
  afkOverheated = false; afkCoolProgress = 0; afkHeatDeadline = 0; afkExitPending = false;
  const broken = [];
  const b = breakInstalledComponent(category);
  if (b) broken.push(b);
  render();
  if (broken.length === 1) {
    showBreakdownWarning(broken[0]);
  } else if (broken.length > 1) {
    const modal = $('diagnosticModal'), content = $('diagnosticContent'), title = $('diagnosticTitle');
    if (title) title.textContent = '💥 Поломка компонентов';
    if (modal && content) {
      content.innerHTML = `<div class="diagnostic-error breakdown-alert"><div class="diagnostic-count">💥 Авария: вышли из строя ${broken.length} детали</div><p>${message}</p><div class="diagnostic-list">${broken.map((b) => `<article class="diagnostic-item"><b>${b.item.name}</b><small>Степень поломки: ${b.damage}% · Ремонт: $${formatMoney(b.cost)}</small></article>`).join('')}</div><div class="breakdown-actions"><button class="primary" id="closeMultiBreak">Понятно</button></div></div>`;
      modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
      $('closeMultiBreak')?.addEventListener('click', closeDiagnostic);
    }
  }
}
function renderAfkTaskCard(task) {
  const remainMs = task.deadline ? Math.max(0, task.deadline - performance.now()) : 0;
  if (task.type === 'cpu') {
    return `<div class="afk-task-card afk-task-cpu ${afkOverheated ? 'overheated' : ''}"><div class="afk-task-head"><strong>🔥 CPU — охлаждение</strong><span id="afkCpuTaskTimer">${(remainMs/1000).toFixed(1)} сек</span></div><p>Зажми кнопку и удерживай, пока процессор полностью не остынет.</p><button id="afkTaskCoolBtn" class="cool-button">❄ Охлаждать</button><div class="cool-progress"><div id="afkTaskCoolProgress" style="width:${Math.round(afkCoolProgress*100)}%"></div></div></div>`;
  }
  if (task.type === 'gpu') {
    return `<div class="afk-task-card afk-task-gpu"><div class="afk-task-head"><strong>📢 GPU</strong><span id="afkGpuTaskTimer">${(remainMs/1000).toFixed(1)} сек</span></div><div class="afk-ad-stack">${task.ads.map((ad) => `<div class="afk-ad-modal" style="left:${ad.left}%;top:${ad.top}%;z-index:${ad.z}"><div class="afk-ad-title">Реклама №${ad.id}</div><div class="afk-ad-text">${ad.text}</div><button class="small" data-afk-ad-close="${ad.id}">✕ Закрыть</button></div>`).join('')}</div></div>`;
  }
  let status = 'Подготовка сбоя...';
  if (task.phase === 'glitch') status = 'ГЛИТЧ...';
  if (task.phase === 'stop') status = '🛑 STOP';
  return `<div class="afk-task-card afk-task-storage ${task.phase === 'stop' ? 'storage-stop' : ''} ${task.phase === 'glitch' ? 'storage-glitch' : ''}"><div class="afk-task-head"><strong>💾 HDD / SSD — сбой диска</strong><span>${task.phase === 'stop' ? '1.5 сек' : task.phase === 'glitch' ? '...' : 'Ожидание'}</span></div><div class="storage-stop-stage"><div class="storage-glitch-layer"> </div><div class="storage-stop-sign">🛑</div></div><div class="wire-status">${status}</div></div>`;
}
function renderAfkTasks() {
  pruneAfkTasks();
  const layer = $('afkTaskContent');
  const modal = $('afkTaskModal');
  const tasks = Object.values(afkTasks);
  if (!layer || !modal) return '';
  if (!tasks.length) {
    layer.innerHTML = '';
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    return '';
  }
  layer.innerHTML = tasks.map(renderAfkTaskCard).join('');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
  return '';
}
function bindAfkTaskEvents() {
  const coolBtn = $('afkTaskCoolBtn');
  if (coolBtn) bindCoolingHold(coolBtn);
  document.querySelectorAll('[data-afk-ad-close]').forEach(btn => btn.addEventListener('click', () => {
    const task = afkTasks.gpu; if (!task) return;
    const id = Number(btn.dataset.afkAdClose);
    task.ads = task.ads.filter(ad => ad.id !== id);
    if (!task.ads.length) finishAfkComponentTask('gpu', '📢 Все рекламные окна закрыты. '); else renderAfkPanel();
  }));
}
function stopAfk(options = {}) {
  if (!options.preserveHeat) { afkExitPending = false; afkOverheated = false; afkCoolProgress = 0; afkHeatDeadline = 0; }
  afkRunning = false; resetAfkTimersOnly(); clearAfkTasks();
}
function requestStopAfk() {
  if (!afkRunning) return;
  if (afkOverheated) { afkExitPending = true; renderAfkPanel(); return; }
  if (afkTaskCount()) {
    afkExitPending = true; renderAfkPanel(); return;
  }
  stopAfk(); renderAfkPanel();
}
function renderEarnTabs() {
  const gamesTab = $('miniGamesTab'), afkTabEl = $('afkTab'), aiTabEl = $('aiTab');
  const games = $('miniGamesSection'), afk = $('afkSection'), ai = $('aiSection');
  if (!gamesTab || !afkTabEl || !aiTabEl || !games || !afk || !ai) return;
  const isGames = activeEarnTab === 'games'; const isAfk = activeEarnTab === 'afk'; const isAi = activeEarnTab === 'ai';
  gamesTab.classList.toggle('active', isGames); gamesTab.setAttribute('aria-selected', String(isGames));
  afkTabEl.classList.toggle('active', isAfk); afkTabEl.setAttribute('aria-selected', String(isAfk));
  aiTabEl.classList.toggle('active', isAi); aiTabEl.setAttribute('aria-selected', String(isAi));
  games.classList.toggle('hidden', !isGames); afk.classList.toggle('hidden', !isAfk); ai.classList.toggle('hidden', !isAi);
  renderRewardInfo();
  if (isAfk) renderAfkPanel(); if (isAi) renderAiPanel();
}
function canStartAiTraining() {
  const ram = installedItem('RAM');
  const cpu = installedItem('CPU');
  return !!(ram && !isItemBroken(ram) && ['DDR4','DDR5'].includes(ramType(ram)) && ramCapacityGb(ram) >= 64
    && cpu && !isItemBroken(cpu) && Number(cpu.performance) >= MIN_AI_CPU_POWER);
}
function aiStorageDuration(item = installedItem('Storage')) {
  if (!item) return 20000;
  const text = `${item.series || ''} ${item.name || ''}`;
  if (/PCIe\s*5\.0|Gen\s*5/i.test(text)) return 5000;
  if (storageType(item) === 'HDD') return 20000;
  return 10000;
}
function aiReward() {
  const base = 250;
  const bonus = Math.max(0, Math.floor(base * Math.max(0, pcMultiplier() - 1)));
  const subtotal = base + bonus;
  const ultraBonus = isCoreUltraCpu(installedItem('CPU')) ? Math.floor(subtotal * 0.75) : 0;
  return { base, bonus, ultraBonus, subtotal, total: subtotal + ultraBonus };
}
function generateAiTaskSequence() {
  const count = randInt(3, 5);
  const sequence = [];
  while (sequence.length < count) {
    const last = sequence[sequence.length - 1], prev = sequence[sequence.length - 2];
    const allowed = AI_TASKS.filter((type) => !(type === last && type === prev));
    sequence.push(allowed[randInt(0, allowed.length - 1)]);
  }
  return sequence;
}
function stopAiTraining() {
  aiRunning = false; aiTasks = []; aiTaskIndex = 0; aiTaskState = null;
  if (aiTaskTimer) clearTimeout(aiTaskTimer); if (aiTaskInterval) clearInterval(aiTaskInterval);
  aiTaskTimer = null; aiTaskInterval = null;
}
function finishAiTask() {
  if (!aiRunning) return;
  if (aiTaskTimer) { clearTimeout(aiTaskTimer); aiTaskTimer = null; }
  if (aiTaskInterval) { clearInterval(aiTaskInterval); aiTaskInterval = null; }
  aiTaskState = null; aiTaskIndex += 1;
  if (aiTaskIndex >= aiTasks.length) {
    const reward = aiReward();
    state.money += reward.total; checkAchievements(); save();
    $('money').textContent = formatMoney(state.money);
    $('gameResult').textContent = `🤖 Обучение ИИ завершено. +$${formatMoney(reward.total)} (250$ + ${formatMoney(reward.bonus)}$ бонус за мощность${reward.ultraBonus ? ` + ${formatMoney(reward.ultraBonus)}$ бонус Core Ultra` : ''})`;
    stopAiTraining(); renderAiPanel(); return;
  }
  renderAiTask();
}
function startAiTraining() {
  if (!state) return;
  if (!canStartAiTraining()) {
    const ram = installedItem('RAM'); const cpu = installedItem('CPU');
    const ramGb = ramCapacityGb(ram); const cpuPower = cpu ? Number(cpu.performance) || 0 : 0;
    const problems = [];
    if (!(ram && !isItemBroken(ram) && ['DDR4','DDR5'].includes(ramType(ram)) && ramGb >= 64)) problems.push(`нужно минимум 64 ГБ DDR4/DDR5 (сейчас ${ramGb || 0} ГБ)`);
    if (!(cpu && !isItemBroken(cpu) && cpuPower >= MIN_AI_CPU_POWER)) problems.push(`нужен CPU минимум ${MIN_AI_CPU_POWER} мощности (сейчас ${cpuPower})`);
    $('gameResult').textContent = `Для обучения ИИ ${problems.join(' и ')}.`;
    renderAiPanel(); return;
  }
  const issues = checkCompatibility();
  if (issues.length) { openDiagnostic(issues); return; }
  const brokenInstalled = CATEGORIES.map((category) => installedItem(category)).filter((item) => item && isItemBroken(item));
  if (brokenInstalled.length) {
    $('gameResult').textContent = 'Обучение ИИ недоступно: сначала почини сломанные комплектующие.';
    renderAiPanel(); return;
  }
  if (aiRunning) return;
  stopAfk(); if (activeGame) closeGame();
  aiRunning = true; aiTasks = generateAiTaskSequence(); aiTaskIndex = 0; aiTaskState = null;
  $('gameResult').textContent = ''; renderAiPanel();
}
function aiTaskTitle(type) {
  return ({ wires:'Соедини провода', word:'Напиши слово', download:'Скачивание данных', file:'Перенеси файл', windows:'Закрой окна' })[type] || 'Задача';
}
function renderAiPanel() {
  const area = $('aiArea'); if (!area || !state) return;
  const ram = installedItem('RAM'); const ramGb = ramCapacityGb(ram); const cpu = installedItem('CPU');
  const ramOk = !!(ram && !isItemBroken(ram) && ['DDR4','DDR5'].includes(ramType(ram)) && ramGb >= 64);
  const cpuOk = !!(cpu && !isItemBroken(cpu) && Number(cpu.performance) >= MIN_AI_CPU_POWER);
  const unlocked = ramOk && cpuOk;
  if (!aiRunning) {
    let requirementText = '';
    if (unlocked) requirementText = `✅ Требования выполнены: ${ram.name} · ${cpu.name}`;
    else {
      const issues = [];
      if (!ramOk) issues.push(`RAM: минимум 64 ГБ DDR4/DDR5 (сейчас ${ramGb || 0} ГБ)`);
      if (!cpuOk) issues.push(`CPU: минимум ${MIN_AI_CPU_POWER} мощности (сейчас ${cpu ? Number(cpu.performance) || 0 : 0})`);
      requirementText = `🔒 ${issues.join(' · ')}`;
    }
    area.innerHTML = `<div class="ai-status-card"><div class="ai-summary"><div><b>🤖 Обучение ИИ</b><span>Выполни от 3 до 5 случайных задач. Ограничения по времени на весь режим нет.</span></div><div class="ai-badge-row"><span class="badge">Награда: 250$ + бонус мощности</span></div></div><div class="ai-requirement ${unlocked ? 'ai-ok' : 'ai-locked'}">${requirementText}</div><button id="aiStartBtn" class="primary" ${unlocked ? '' : 'disabled'}>▶ Начать обучение ИИ</button></div>`;
    $('aiStartBtn').onclick = startAiTraining; return;
  }
  renderAiTask();
}
function renderAiTask() {
  const area = $('aiArea'); if (!area || !aiRunning) return;
  const type = aiTasks[aiTaskIndex]; const progress = `${aiTaskIndex + 1}/${aiTasks.length}`;
  let inner = '';
  if (type === 'wires') {
    if (!aiTaskState) {
      const colors = ['Красный','Синий','Зелёный','Жёлтый'];
      aiTaskState = { remaining: colors.slice(), selected: null };
    }
    inner = `<div class="ai-wires-grid"><div class="ai-wire-col"><b>Провода</b>${aiTaskState.remaining.map((color,i) => `<button class="ai-wire-btn" data-wire-src="${color}" data-color="${i}">${color}</button>`).join('')}</div><div class="ai-wire-col"><b>Разъёмы</b>${aiTaskState.remaining.slice().sort(() => Math.random()-.5).map((color,i) => `<button class="ai-wire-target" data-wire-target="${color}" data-color="${i}">${color} ●</button>`).join('')}</div></div><div id="aiWireStatus" class="ai-task-status">Выбери провод, затем разъём такого же цвета.</div>`;
  } else if (type === 'word') {
    const words=['кремний','нейросеть','сервер','алгоритм','процессор','данные','обучение','видеокарта','кластер','модель'];
    if (!aiTaskState) aiTaskState = { word: words[randInt(0, words.length - 1)] };
    inner = `<div class="ai-word-task"><div class="ai-word-prompt">${aiTaskState.word}</div><input id="aiWordInput" class="math-input" autocomplete="off" placeholder="Введи слово"><button id="aiWordSubmit" class="primary">Проверить</button><div id="aiWordStatus" class="ai-task-status"></div></div>`;
  } else if (type === 'download') {
    if (!aiTaskState) aiTaskState = { started: performance.now(), progress: 0, duration: aiStorageDuration(), running: false };
    inner = `<div class="ai-download-task"><div class="ai-download-percent" id="aiDownloadPercent">${Math.floor(aiTaskState.progress)}%</div><div class="ai-download-bar"><div id="aiDownloadBar" style="width:${aiTaskState.progress}%"></div></div><p id="aiDownloadText">Скачивание данных: ${Math.floor(aiTaskState.progress)}% (${(aiTaskState.duration/1000).toFixed(0)} сек)</p></div>`;
  } else if (type === 'file') {
    if (!aiTaskState) aiTaskState = { selected: false };
    inner = `<div class="ai-file-task"><div id="aiFile" class="ai-file" draggable="true">📄 training_data.bin</div><div class="ai-file-arrow">→</div><div id="aiFolder" class="ai-folder">📁 AI_DATA</div><div id="aiFileStatus" class="ai-task-status">Перетащи файл в папку.</div></div>`;
  } else if (type === 'windows') {
    if (!aiTaskState) aiTaskState = { closed: new Set() };
    inner = `<div class="ai-window-stack">${[1,2].map((n) => `<div class="ai-fake-window ${aiTaskState.closed.has(n)?'closed':''}"><b>${n === 1 ? 'AI Training Helper' : 'Data Center Login'}</b><p>${n === 1 ? 'Система готова к обучению.' : 'Не забудь сохранить данные.'}</p><button class="small" data-ai-window-close="${n}">✕ Закрыть</button></div>`).join('')}</div><div id="aiWindowStatus" class="ai-task-status">Закрой оба окна.</div>`;
  }
  area.innerHTML = `<div class="ai-status-card ai-active"><div class="ai-summary"><div><b>🤖 ${aiTaskTitle(type)}</b><span>Задача ${progress}. Следующая задача выбирается случайно.</span></div><div class="ai-badge-row"><span class="badge">${progress}</span></div></div>${inner}<button id="aiStopBtn" class="small danger">Остановить обучение</button></div>`;
  $('aiStopBtn').onclick = () => { stopAiTraining(); renderAiPanel(); };
  bindAiTask();
}
function bindAiTask() {
  const type = aiTasks[aiTaskIndex];
  if (type === 'wires') {
    document.querySelectorAll('[data-wire-src]').forEach((btn) => btn.onclick = () => { aiTaskState.selected = btn.dataset.wireSrc; document.getElementById('aiWireStatus').textContent = `Выбран ${aiTaskState.selected}. Теперь нажми соответствующий разъём.`; });
    document.querySelectorAll('[data-wire-target]').forEach((btn) => btn.onclick = () => {
      if (!aiTaskState.selected) return;
      const color = btn.dataset.wireTarget;
      const status = document.getElementById('aiWireStatus');
      if (color !== aiTaskState.selected) { status.textContent = '❌ Цвет не совпадает.'; return; }
      aiTaskState.remaining = aiTaskState.remaining.filter((x) => x !== color); aiTaskState.selected = null;
      if (!aiTaskState.remaining.length) finishAiTask(); else renderAiTask();
    });
  } else if (type === 'word') {
    const input = $('aiWordInput'), submit = $('aiWordSubmit'), status = $('aiWordStatus');
    const doSubmit = () => { if (input.value.trim().toLowerCase() === aiTaskState.word.toLowerCase()) finishAiTask(); else status.textContent='❌ Неверно. Попробуй ещё раз.'; };
    submit.onclick = doSubmit; input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSubmit(); }); input.focus();
  } else if (type === 'download') {
    const start = aiTaskState.started; const duration = aiTaskState.duration;
    aiTaskInterval = setInterval(() => {
      const progress = Math.min(100, ((performance.now() - start) / duration) * 100);
      aiTaskState.progress = progress;
      const pct=$('aiDownloadPercent'), bar=$('aiDownloadBar'), text=$('aiDownloadText');
      if (pct) pct.textContent = `${Math.floor(progress)}%`; if (bar) bar.style.width = `${progress}%`; if (text) text.textContent = `Скачивание данных: ${Math.floor(progress)}% (${(duration/1000).toFixed(0)} сек)`;
      if (progress >= 100) { clearInterval(aiTaskInterval); aiTaskInterval=null; finishAiTask(); }
    }, 50);
  } else if (type === 'file') {
    const file=$('aiFile'), folder=$('aiFolder'), status=$('aiFileStatus');
    const complete=()=>{ if (!aiRunning) return; finishAiTask(); };
    file.addEventListener('dragstart', () => { aiTaskState.selected=true; });
    folder.addEventListener('dragover', (e)=>{ e.preventDefault(); folder.classList.add('drop-ready'); });
    folder.addEventListener('dragleave', ()=>folder.classList.remove('drop-ready'));
    folder.addEventListener('drop', (e)=>{e.preventDefault();folder.classList.remove('drop-ready');complete();});
    file.onclick=()=>{aiTaskState.selected=true;status.textContent='Файл выбран. Нажми на папку AI_DATA.';};
    folder.onclick=()=>{if(aiTaskState.selected) complete(); else status.textContent='Сначала выбери или перетащи файл.';};
  } else if (type === 'windows') {
    document.querySelectorAll('[data-ai-window-close]').forEach((btn)=>btn.onclick=()=>{const n=Number(btn.dataset.aiWindowClose);aiTaskState.closed.add(n);if(aiTaskState.closed.size>=2)finishAiTask();else renderAiTask();});
  }
}
function renderEarnTabsLegacyCompat() {}
function setEarnTab(tab) {
  if (tab === activeEarnTab) return;
  if (tab === 'games' && (afkOverheated || afkTaskCount())) { renderAfkPanel(); return; }
  if (activeGame) closeGame();
  if (tab !== 'ai' && activeEarnTab === 'ai') stopAiTraining();
  if (tab === 'ai') stopAfk();
  activeEarnTab = ['games','afk','ai'].includes(tab) ? tab : 'games';
  localStorage.setItem(EARN_TAB_KEY, activeEarnTab);
  if (activeEarnTab === 'games') stopAfk();
  renderEarnTabs();
}
function overheatRiskActive() { return activeAfkComponents().length > 2; }
function scheduleOverheat() { /* Старый отдельный таймер заменён на CPU-испытание, появляющееся через общий AFK-таймер. */ }
function failOverheat() { if (afkTasks.cpu) failAfkTask('cpu', 'Охлаждение не завершено вовремя.'); }
function renderAfkComponentCards() {
  syncAfkComponents();
  const configs = [
    { category:'CPU', icon:'🧠', desc:'Основа AFK. Без работающего CPU денег не будет.', bonus:'Основа AFK', task:'cpu' },
    { category:'Storage', icon:'💾', desc:'Ускоряет выплаты: интервал сокращается с 10 до 5 секунд.', task:'storage' },
    { category:'GPU', icon:'🎨', desc:'Добавляет процент к сумме выплаты. Встроенную графику включить нельзя.', task:'gpu' }
  ];
  return `<div class="afk-components-title"><b>⚙ Работающие компоненты</b><span>Выбери, какие детали участвуют в AFK.</span></div><div class="afk-components-grid">${configs.map(c=>{ const item=installedItem(c.category); const available=componentAfkAvailable(c.category); const checked=!!afkComponents[c.category]&&available; const broken=!!(item&&isItemBroken(item)); let bonus=c.bonus; if(c.category==='Storage'&&available) bonus=`+${Math.round(afkStorageBonus(item)*100)}% и ${Math.round(afkStorageInterval(item)/1000)} сек`; if(c.category==='GPU'&&available) bonus=`+${Math.round(afkGpuBonus(item)*100)}% к выплате`; return `<div class="afk-component-card ${checked?'active':''} ${broken?'broken':''}"><div class="afk-component-head"><div class="afk-component-name"><span class="afk-component-icon">${c.icon}</span><div><strong>${afkComponentLabel(c.category)}</strong><small>${item?item.name:'НЕТ'}</small></div></div><label class="component-toggle"><input type="checkbox" data-afk-component="${c.category}" ${checked?'checked':''} ${available?'':'disabled'}><span></span></label></div><p>${broken?'🔴 Деталь сломана — сначала замени или почини её.':c.desc}</p><div class="afk-component-foot"><span class="afk-component-bonus">${bonus}</span>${c.task&&available&&afkMode==='overclock'?`<span class="afk-random-task-hint">🎲 Испытание может появиться автоматически</span>`:''}</div></div>`; }).join('')}</div>`;
}
function componentAfkAvailable(category) { const item=installedItem(category); if(!item||isItemBroken(item)) return false; if(category==='GPU'&&!isDiscreteGpu(item)) return false; return true; }
function afkComponentLabel(category) { return category==='CPU'?'CPU':category==='GPU'?'GPU':'HDD / SSD'; }
function updateAfkLiveUI() {
  const countdown = $('afkCountdownText');
  if (countdown) {
    const remain = afkRunning && afkNextPayoutAt ? Math.max(0, afkNextPayoutAt - performance.now()) : 0;
    countdown.textContent = afkRunning && !afkOverheated ? `${(remain / 1000).toFixed(1)} сек` : '—';
  }
  const cpuTimer = $('afkCpuTaskTimer');
  if (cpuTimer && afkTasks.cpu) cpuTimer.textContent = `${Math.max(0, (afkTasks.cpu.deadline-performance.now())/1000).toFixed(1)} сек`;
  const gpuTimer = $('afkGpuTaskTimer');
  if (gpuTimer && afkTasks.gpu) gpuTimer.textContent = `${Math.max(0, (afkTasks.gpu.deadline-performance.now())/1000).toFixed(1)} сек`;
  const cpuProgress = $('afkTaskCoolProgress'); if (cpuProgress) cpuProgress.style.width = `${Math.round(afkCoolProgress*100)}%`;
  if (afkTasks.gpu && performance.now() >= afkTasks.gpu.deadline) failAfkTask('gpu', 'Рекламные окна не были закрыты вовремя.');
  if (afkTasks.cpu && performance.now() >= afkTasks.cpu.deadline) failAfkTask('cpu', 'Охлаждение не завершено вовремя.');
}
function renderAfkPanel() {
  const area=$('afkArea'); if(!area||!state)return; syncAfkComponents(); const activeCount=activeAfkComponents().length; const interval=afkPayoutInterval()/1000; const payout=afkPayoutAmount(); const avg=payout/interval; const remain=afkRunning&&afkNextPayoutAt?Math.max(0,afkNextPayoutAt-performance.now()):0;
  const afkCpu = installedItem('CPU'); const afkCpuPower = afkCpu ? Number(afkCpu.performance) || 0 : 0; const afkCpuOk = !!(afkCpu && !isItemBroken(afkCpu) && afkCpuPower >= MIN_AFK_CPU_POWER);
  area.innerHTML=`<div class="afk-status-card ${afkOverheated?'overheated':''}"><div class="afk-summary"><span>Средний доход: <b>$${formatMoney(Math.floor(avg))}</b> / сек</span><span>Статус: <b>${afkOverheated?(afkExitPending?'ОХЛАЖДЕНИЕ → ВЫХОД':'ПЕРЕГРЕВ'):(afkRunning?'РАБОТАЕТ':'ОСТАНОВЛЕН')}</b></span></div><div class="afk-chip-row"><span class="badge">Компоненты: ${activeCount}/3</span><span class="badge">Выплата: $${formatMoney(payout)} каждые ${interval.toFixed(0)} сек</span>${afkMode==='overclock'?'<span class="badge afk-boost">×5 РАЗГОН</span>':''}<span class="badge">Испытания: ${afkTaskCount()}/${afkTaskLimit()}</span></div>${renderAfkComponentCards()}${renderAfkTasks()}<div class="afk-next-payout">${!afkCpuOk?`⚠ Для AFK нужен CPU не слабее ${MIN_AFK_CPU_POWER} мощности. Сейчас: ${afkCpuPower}.`:afkMode==='overclock'&&ramCapacityGb(installedItem('RAM'))<16?'⚠ Для разгона нужно минимум 16 ГБ RAM.':afkRunning&&!afkOverheated?`Следующая выплата через <b id="afkCountdownText">${(remain/1000).toFixed(1)} сек</b>.`:afkExitPending?'❄ Заверши текущие испытания, чтобы выйти из AFK.':afkComponents.CPU?'Нажми «Запустить AFK», чтобы начать.':'⚠ Включи CPU, чтобы получать доход.'}</div><div class="afk-controls"><button id="afkStartBtn" class="primary" ${!afkRunning&&!afkExitPending&&!afkCpuOk?'disabled':''}>${afkRunning?'⏸ Остановить AFK':(afkExitPending?'⏳ Заверши испытания':'▶ Запустить AFK')}</button></div><div class="afk-log">${afkTaskCount()?'⚠ Активные испытания нельзя игнорировать. Провал ломает соответствующую деталь.':afkRunning?'AFK работает. Проверка сборки идёт перед каждой выплатой.':'Выбери работающие компоненты и запусти режим.'}</div></div>`;
  $('afkStartBtn').onclick=()=>{if(afkRunning)requestStopAfk();else if(!afkExitPending)startAfk();};
  document.querySelectorAll('[data-afk-component]').forEach(input=>input.addEventListener('change',()=>{const c=input.dataset.afkComponent;if(input.checked&&!componentAfkAvailable(c)){input.checked=false;return;}afkComponents[c]=input.checked;state.afkComponents={...afkComponents};const type=c==='GPU'?'gpu':c==='Storage'?'storage':'cpu';if(!afkComponents[c]&&afkTasks[type]){clearAfkTaskTimers(afkTasks[type]);if(type==='storage')clearAfkStopListeners();delete afkTasks[type];if(type==='cpu'){afkOverheated=false;afkCoolProgress=0;afkHeatDeadline=0;}}if(afkRunning&&!afkOverheated){afkLastPayoutAt=performance.now();afkNextPayoutAt=afkLastPayoutAt+afkPayoutInterval(); if(afkMode==='overclock') scheduleAfkTaskSpawn();}save();renderAfkPanel();}));
  bindAfkTaskEvents();
}
function startAfk() {
  syncAfkComponents();
  const cpu = installedItem('CPU'); const cpuPower = cpu ? Number(cpu.performance) || 0 : 0;
  if (!cpu || isItemBroken(cpu) || cpuPower < MIN_AFK_CPU_POWER) { $('gameResult').textContent = `Для AFK нужен рабочий CPU не слабее ${MIN_AFK_CPU_POWER} мощности. Сейчас: ${cpuPower}.`; renderAfkPanel(); return; }
  if (!afkComponents.CPU) { $('gameResult').textContent = 'Для AFK необходимо включить CPU.'; renderAfkPanel(); return; }
  if (afkMode === 'overclock') {
    const ram = installedItem('RAM');
    const ramGb = ramCapacityGb(ram);
    if (ramGb < 16) { $('gameResult').textContent = `Для разгона нужно минимум 16 ГБ RAM. Сейчас установлено: ${ramGb || 0} ГБ.`; renderAfkPanel(); return; }
  }
  const issues=checkCompatibility(); if(issues.length){openDiagnostic(issues);return;}
  stopAfk(); afkExitPending=false; afkRunning=true; afkLastPayoutAt=performance.now(); afkNextPayoutAt=afkLastPayoutAt+afkPayoutInterval(); if (afkMode === 'overclock') scheduleAfkTaskSpawn();
  const tick=()=>{if(!afkRunning||!state)return;if(afkOverheated&&afkTasks.cpu&&performance.now()>=afkHeatDeadline){failAfkTask('cpu','Охлаждение не завершено вовремя.');return;}if(performance.now()>=afkNextPayoutAt&&!afkOverheated){const issuesNow=checkCompatibility();if(issuesNow.length){afkRunning=false;resetAfkTimersOnly();clearAfkTasks();renderAfkPanel();openDiagnostic(issuesNow);return;}if(!activeAfkComponents().includes('CPU')){afkRunning=false;resetAfkTimersOnly();clearAfkTasks();renderAfkPanel();return;}const payout=afkPayoutAmount();state.money+=payout;checkAchievements();afkLastPayoutAt=performance.now();afkNextPayoutAt=afkLastPayoutAt+afkPayoutInterval();save();$('money').textContent=formatMoney(state.money);if(maybeBreakXeonAfterPayout())return;}if(!afkOverheated&&afkTaskCount()<afkTaskLimit()&&afkRunning) scheduleAfkTaskSpawn();updateAfkLiveUI();};
  afkTimer=setInterval(tick,100); renderAfkPanel();
}
function bindCoolingHold(button = $('afkTaskCoolBtn')) {const btn=button;if(!btn)return;let holding=false,last=0;const stop=()=>{holding=false;if(afkCoolTimer){clearInterval(afkCoolTimer);afkCoolTimer=null;}};const start=()=>{if(!afkOverheated||!afkTasks.cpu||holding)return;holding=true;last=performance.now();afkCoolTimer=setInterval(()=>{const now=performance.now();const delta=now-last;last=now;afkCoolProgress=Math.min(1,afkCoolProgress+delta/(cpuCoolingDuration()*1000));const bar=$('afkTaskCoolProgress');if(bar)bar.style.width=`${Math.round(afkCoolProgress*100)}%`;if(performance.now()>=afkHeatDeadline){stop();failAfkTask('cpu','Охлаждение не завершено вовремя.');return;}if(afkCoolProgress>=1){stop();finishAfkComponentTask('cpu','❄ CPU успешно охлаждён. ');}},50);};['pointerdown','mousedown','touchstart'].forEach(e=>btn.addEventListener(e,start,{passive:true}));['pointerup','pointercancel','pointerleave','mouseup','touchend','touchcancel'].forEach(e=>btn.addEventListener(e,stop,{passive:true}));}
function closeAfkTask(){ if (afkTaskCount()) return; const modal=$('afkTaskModal'); if(!modal)return; modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
function openAfkComponentGame(type){ if(!afkRunning) return; if(type==='gpu' && componentAfkAvailable('GPU') && !afkTasks.gpu) startGpuTask(); if(type==='storage' && componentAfkAvailable('Storage') && !afkTasks.storage){afkTasks.storage={id:++afkTaskCounter,type:'storage',phase:'idle',startedAt:performance.now()}; startStorageTask();} if(type==='cpu' && componentAfkAvailable('CPU') && !afkTasks.cpu) startCpuTask(); renderAfkPanel(); }
function render() {
  ensureMarket();
  $('mainMenuScreen').classList.add('hidden'); $('modeScreen').classList.add('hidden'); $('gameScreen').classList.remove('hidden');
  setMoneyVisible(true);
  $('money').textContent = formatMoney(state.money); $('modeLabel').textContent = MODE_CONFIG[state.mode].label;
  state.power = currentPower(); $('power').textContent = state.power; renderRewardInfo(); renderGamePicker(); renderEarnTabs(); renderMarketEventBanner();
  syncAfkComponents();
  $('pcParts').innerHTML = CATEGORIES.map((category) => { const item = installedItem(category); const broken = !!(item && isItemBroken(item)); return `<button class="part part-button ${broken ? 'part-broken' : ''}" data-part-category="${category}"><span>${displayPartLabel(category)}</span><b>${displayPartValue(category)}</b></button>`; }).join('');
  document.querySelectorAll('[data-game]').forEach((btn) => { btn.onclick = () => chooseGame(btn.dataset.game); });
  document.querySelectorAll('[data-part-category]').forEach((btn) => { btn.onclick = () => openReplacement(btn.dataset.partCategory); });
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
}

const CATALOG_GROUP_ORDER = {
  CPU: ['Intel', 'AMD'],
  GPU: ['AMD', 'NVIDIA', 'Intel'],
  RAM: ['DDR3', 'DDR4', 'DDR5'],
  Storage: ['HDD', 'SSD'],
  PSU: ['Power'],
  Case: ['Case'],
  Motherboard: ['Intel', 'AMD'],
  Cooling: ['Air', 'Liquid']
};

// Внутренняя иерархия каталога. Эти группы/серии НЕ показываются в сложном режиме —
// они нужны движку только для правильного порядка: группа → серия → мощность.
const CATALOG_SERIES_ORDER = {
  CPU: {
    Intel: ['Celeron', 'Pentium', 'Core i3', 'Core i5', 'Core i7', 'Core i9', 'Core Ultra', 'Xeon'],
    AMD: ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9']
  },
  GPU: {
    AMD: ['Radeon RX'],
    NVIDIA: ['GTX', 'RTX'],
    Intel: ['Arc']
  },
  RAM: { DDR3: ['Desktop'], DDR4: ['Desktop'], DDR5: ['Desktop'] },
  Storage: { HDD: ['5400 RPM', '7200 RPM'], SSD: ['SATA', 'NVMe'] },
  PSU: { Power: ['Basic', '80+ Bronze', '80+ Gold'] },
  Case: { Case: ['Basic', 'Airflow', 'Premium'] },
  Motherboard: {
    Intel: ['H410', 'B560', 'B660 / B760', 'Z690 / Z790', 'B860 / Z890', 'Z790 / Z890 High Capacity'],
    AMD: ['A320', 'B450 / B550', 'B650 / X670 / X870', 'X870 High Capacity']
  },
  Cooling: { Air: ['Stock', 'Tower'], Liquid: ['AIO'] }
};
function catalogMode() { if (state.mode === 'hardcore') return 'hardcore'; if (state.mode === 'hard') return 'normal'; return 'easy'; }
function getCatalogState() { if (!state.catalog) state.catalog = { category: 'GPU', group: null, series: null }; return state.catalog; }
function orderedCatalogGroups(category, branches) {
  const preferred = CATALOG_GROUP_ORDER[category] || [];
  const keys = Object.keys(branches || {});
  return [...keys].sort((a, b) => {
    const ai = preferred.indexOf(a), bi = preferred.indexOf(b);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a.localeCompare(b, 'ru');
  });
}
function orderedCatalogSeries(category, group, branches) {
  const values = branches?.[group] || [];
  const preferred = CATALOG_SERIES_ORDER[category]?.[group] || [];
  return [...values].sort((a, b) => {
    const ai = preferred.indexOf(a), bi = preferred.indexOf(b);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    const aMin = Math.min(...SHOP.filter(item => !item.starter && !item.legacy && item.category === category && item.group === group && item.series === a).map(item => Number(item.performance) || 0), Infinity);
    const bMin = Math.min(...SHOP.filter(item => !item.starter && !item.legacy && item.category === category && item.group === group && item.series === b).map(item => Number(item.performance) || 0), Infinity);
    if (aMin !== bMin) return aMin - bMin;
    return a.localeCompare(b, 'ru');
  });
}

function catalogRank(value, order) {
  const index = order.indexOf(value);
  return index === -1 ? 999 : index;
}

function orderedNormalItems(category) {
  const items = SHOP.filter((item) => !item.starter && !item.legacy && item.category === category);
  const groupOrder = CATALOG_GROUP_ORDER[category] || [];
  const seriesOrders = CATALOG_SERIES_ORDER[category] || {};
  return [...items].sort((a, b) => {
    // Сначала всегда скрытая группа/производитель. Никогда не сравниваем
    // производительность деталей разных производителей между собой.
    const groupDiff = catalogRank(a.group, groupOrder) - catalogRank(b.group, groupOrder);
    if (groupDiff !== 0) return groupDiff;

    // Затем скрытая серия внутри производителя. Например: GTX -> RTX.
    const seriesOrder = seriesOrders[a.group] || [];
    const seriesDiff = catalogRank(a.series, seriesOrder) - catalogRank(b.series, seriesOrder);
    if (seriesDiff !== 0) return seriesDiff;

    // И только внутри одной серии — от слабого к мощному.
    const perfDiff = (Number(a.performance) || 0) - (Number(b.performance) || 0);
    if (perfDiff !== 0) return perfDiff;
    return String(a.name).localeCompare(String(b.name), 'ru');
  });
}

function openReplacement(category) {
  shopView = 'replacement'; replacementCategory = category;
  const modal = $('shopModal'); modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); renderShopWindow();
}
function openCatalog() {
  shopView = 'catalog'; replacementCategory = null;
  ensureMarket(); const modal = $('shopModal'); modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); renderShopWindow();
}
function renderMarketEventBanner() {
  const banner = $('marketEventBanner');
  if (!banner) return;
  if (!eventIsActive()) {
    banner.innerHTML = `<strong>⏱️ Перерыв рынка</strong><span>Следующее событие скоро появится.</span><small>До нового события: ${eventSecondsLeft()} с.</small>`;
    banner.classList.add('active', 'event-break');
    return;
  }
  const event = state?.market?.event || chooseMarketEvent();
  if (!event) { banner.textContent = ''; banner.classList.remove('active'); return; }
  let detail = event.description || '';
  if (event.id === 'overproduction' && event.targetCategory) detail += ` Категория: ${CATEGORY_LABELS[event.targetCategory] || event.targetCategory}.`;
  if (event.id === 'factory_explosion' && event.targetCategories?.length) detail += ` Дефицит: ${event.targetCategories.map((category) => CATEGORY_LABELS[category] || category).join(' • ')}.`;
  banner.innerHTML = `<strong>${event.icon} ${event.name}</strong><span>${detail}</span><small>До нового события: ${eventSecondsLeft()} с.</small>`;
  banner.className = 'market-event-banner active';
  banner.classList.add(`event-${event.id}`);
}
function updateShopRefreshTimer() {
  const meta = $('shopMeta');
  const couponText = Number(state?.couponPercent) > 0 ? ` • 🎟 Купон -${state.couponPercent}%` : '';
  if (meta) meta.textContent = `Рынок обновляется каждые 2 минуты • следующий рерол через ${marketSecondsLeft()} с. • событие через ${eventSecondsLeft()} с.${couponText}`;
  renderMarketEventBanner();
}

function renderShopWindow() {
  const title = $('shopWindowTitle');
  if (shopView === 'replacement') {
    title.textContent = `🔧 Замена — ${state.mode === 'easy' ? MAIN_PART_LABELS_EASY[replacementCategory] : replacementCategory}`;
    renderReplacement(); updateShopRefreshTimer(); return;
  }
  title.textContent = '🛒 Каталог комплектующих';
  renderCatalog();
  updateShopRefreshTimer();
}

function manufacturerMarkup(item) {
  if (!item) return '';
  if (item.category === 'CPU' || item.category === 'GPU') {
    const brand = item.manufacturer || item.group;
    if (!['AMD', 'Intel', 'NVIDIA'].includes(brand)) return '';
    const cls = brand.toLowerCase();
    return `<span class=\"manufacturer-tag manufacturer-${cls}\">${brand}</span>`;
  }
  if (item.category === 'Motherboard' && item.manufacturer) {
    const platform = item.group;
    const platformClass = platform === 'Intel' ? 'intel' : platform === 'AMD' ? 'amd' : 'neutral';
    return `<span class=\"manufacturer-tag manufacturer-board\">${item.manufacturer}</span><span class=\"platform-tag platform-${platformClass}\">${platform}</span>`;
  }
  return '';
}

function renderReplacement() {
  const category = replacementCategory;
  const owned = sortByPower(SHOP.filter((item) => item.category === category && state.owned[item.id]));
  const installedId = state.installed?.[category];
  const body = owned.length
    ? `<div class="catalog-title">Купленные детали этого типа. Выбирай, что поставить.</div><div class="shop-items-grid">${owned.map((item) => {
      const installed = item.id === installedId;
      const broken = isItemBroken(item);
      const brokenText = broken ? `<span class="price-change up">ПОВРЕЖДЕНО ${brokenInfo(item).damage}%</span>` : '';
      let buttonHtml;
      if (broken) {
        buttonHtml = `<div class="shop-actions"><button class="small shop-buy" data-repair="${item.id}">Починить за $${formatMoney(repairCost(item))}</button><button class="small shop-buy danger" data-sell="${item.id}">Продать за $${formatMoney(salePriceFor(item.id))}</button></div>`;
      } else {
        const installButton = installed ? `<button class="small shop-buy" disabled>Установлено</button>` : `<button class="small shop-buy" data-install="${item.id}">Установить</button>`;
        buttonHtml = `<div class="shop-actions">${installButton}<button class="small shop-buy danger" data-sell="${item.id}">Продать за $${formatMoney(salePriceFor(item.id))}</button></div>`;
      }
      return `<div class="shop-item ${installed ? 'installed-item' : ''} ${broken ? 'broken-item' : ''}"><div><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div><div class="price-line"><span class="base-price">Производительность: +${item.performance}</span>${manufacturerMarkup(item)}${installed && !broken ? '<span class="price-change down">УСТАНОВЛЕНО</span>' : ''}${brokenText}</div></div>${buttonHtml}</div>`;
    }).join('')}</div>`
    : `<div class="empty-catalog">У тебя пока нет купленных деталей этого типа.</div>`;
  $('shopItems').innerHTML = `<div class="catalog-breadcrumb"><button class="small" id="backToCatalog">← В каталог</button><b>${CATEGORY_LABELS[category]}</b></div>${body}`;
  $('backToCatalog').onclick = openCatalog;
  document.querySelectorAll('[data-install]').forEach((btn) => { btn.onclick = () => installItem(btn.dataset.install); });
  document.querySelectorAll('[data-repair]').forEach((btn) => { btn.onclick = () => openRepairConfirm(btn.dataset.repair); });
  document.querySelectorAll('[data-sell]').forEach((btn) => { btn.onclick = () => sellItem(btn.dataset.sell); });
}

function sortByPower(items) {
  return [...items].sort((a, b) => {
    const perfDiff = (Number(a.performance) || 0) - (Number(b.performance) || 0);
    if (perfDiff !== 0) return perfDiff;
    return String(a.name).localeCompare(String(b.name), 'ru');
  });
}

function sortCatalogValues(values, getItems) {
  return [...values].sort((a, b) => {
    const aMin = Math.min(...getItems(a).map((item) => Number(item.performance) || 0), Infinity);
    const bMin = Math.min(...getItems(b).map((item) => Number(item.performance) || 0), Infinity);
    if (aMin !== bMin) return aMin - bMin;
    return String(a).localeCompare(String(b), 'ru');
  });
}

function renderCatalog() {
  const wrap = $('shopItems'); const catalog = getCatalogState(); const mode = catalogMode();
  const categories = mode === 'hardcore' ? Object.keys(HARDCORE_CATALOG) : (mode === 'normal' ? NORMAL_CATEGORIES : EASY_CATEGORIES);
  const tabs = categories.map((category) => `<button class="catalog-tab${catalog.category === category ? ' active' : ''}" data-cat="${category}">${CATEGORY_LABELS[category]}</button>`).join('');
  let body = '';
  if (mode === 'hardcore') {
    const branches = HARDCORE_CATALOG[catalog.category] || {}; const group = catalog.group; const series = catalog.series;
    const groups = orderedCatalogGroups(catalog.category, branches);
    if (!group) body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]} → выбери производителя / тип</div><div class="catalog-tree">${groups.map((key) => `<button class="catalog-node" data-group="${key}"><strong>${key}</strong><span>${(branches[key] || []).length} сер.</span></button>`).join('')}</div>`;
    else if (!series) {
      const seriesList = orderedCatalogSeries(catalog.category, group, branches);
      body = `<div class="catalog-breadcrumb"><button class="small" data-catalog-back="group">← ${CATEGORY_LABELS[catalog.category]}</button><b>${group}</b></div><div class="catalog-tree">${seriesList.map((key) => `<button class="catalog-node" data-series="${key}"><strong>${key}</strong><span>Открыть</span></button>`).join('')}</div>`;
    } else body = `<div class="catalog-breadcrumb"><button class="small" data-catalog-back="series">← ${group}</button><b>${series}</b></div>${renderShopItems(SHOP.filter((item) => !item.starter && !item.legacy && item.category === catalog.category && item.group === group && item.series === series))}`;
  } else if (mode === 'normal') {
    // Сложный: видна только одна верхняя категория (CPU/GPU/RAM...), без производителей и серий.
    // Внутри список плоский, но порядок строится по скрытой группе → серии → мощности.
    catalog.group = null; catalog.series = null;
    body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]}</div>${renderShopItems(orderedNormalItems(catalog.category), true)}`;
  } else {
    body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]}</div>${renderShopItems(SHOP.filter((item) => !item.starter && item.category === catalog.category))}`;
  }
  wrap.innerHTML = `<div class="catalog-tabs">${tabs}</div><div class="catalog-view-links"><button class="small ${shopView === 'catalog' ? 'active-mini' : ''}" id="catalogViewBtn">Каталог</button></div>${body}`;
  $('catalogViewBtn').onclick = openCatalog;
  wrap.querySelectorAll('[data-cat]').forEach((btn) => btn.addEventListener('click', () => { catalog.category = btn.dataset.cat; catalog.group = null; catalog.series = null; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-group]').forEach((btn) => btn.addEventListener('click', () => { catalog.group = btn.dataset.group; catalog.series = null; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-series]').forEach((btn) => btn.addEventListener('click', () => { catalog.series = btn.dataset.series; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-catalog-back]').forEach((btn) => btn.addEventListener('click', () => { if (btn.dataset.catalogBack === 'group') catalog.group = null; if (btn.dataset.catalogBack === 'series') catalog.series = null; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-buy]').forEach((btn) => btn.addEventListener('click', () => buy(btn.dataset.buy)));
  wrap.querySelectorAll('[data-install]').forEach((btn) => btn.addEventListener('click', () => installItem(btn.dataset.install)));
  wrap.querySelectorAll('[data-sell]').forEach((btn) => btn.addEventListener('click', () => sellItem(btn.dataset.sell)));
}

function renderShopItems(items, preserveOrder = false) {
  // Не пересортировываем уже упорядоченный список сложного режима.
  // Иначе скрытый приоритет производителя/серии теряется и детали снова смешиваются.
  const sortedItems = preserveOrder ? [...items] : sortByPower(items);
  if (!sortedItems.length) return `<div class="empty-catalog">В этом разделе пока ничего нет.</div>`;
  return `<div class="shop-items-grid">${sortedItems.map((item) => {
    const bought = !!state.owned[item.id]; const installed = state.installed?.[item.category] === item.id; const marketItem = state.market.items[item.id];
    const unavailable = !marketItem?.available; const priceText = marketItem?.price?.toLocaleString('ru-RU') || '—'; const change = marketItem?.change ?? 0;
    const changeClass = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'; const changeText = change > 0 ? `+${change}%` : `${change}%`;
    let buttonHtml = '';
    if (bought) {
      const installButton = installed ? `<button class="small shop-buy" disabled>Установлено</button>` : `<button class="small shop-buy" data-install="${item.id}">Установить</button>`;
      buttonHtml = `<div class="shop-actions">${installButton}<button class="small shop-buy danger" data-sell="${item.id}">Продать за $${formatMoney(salePriceFor(item.id))}</button></div>`;
    } else {
      buttonHtml = `<button class="small shop-buy" data-buy="${item.id}" ${unavailable ? 'disabled' : ''}>${unavailable ? 'SOLD OUT' : `$${priceText}`}</button>`;
    }
    return `<div class="shop-item ${unavailable && !bought ? 'sold-out' : ''}"><div><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div><div class="price-line"><span class="base-price">База: $${item.basePrice.toLocaleString('ru-RU')}</span><span class="price-change ${changeClass}">${changeText}</span><span class="base-price">+${item.performance} мощности</span>${manufacturerMarkup(item)}</div></div>${buttonHtml}</div>`;
  }).join('')}</div>`;
}

function closeShop() {
  const modal = $('shopModal'); modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true');
  shopView = 'catalog'; replacementCategory = null;
}

const SETTINGS_KEY = 'pcBuilder_settings';
const PART_INFO = [
  { category: 'CPU', icon: '🧠', title: 'Процессор (CPU)', text: 'Главный вычислительный компонент. Выполняет команды, считает данные и влияет на общую производительность системы.', details: ['Ядра и потоки — сколько задач CPU может обрабатывать параллельно.', 'Частота — скорость работы ядер, но одна только частота не определяет производительность.', 'Сокет и совместимость с материнской платой важны при сборке.'] },
  { category: 'GPU', icon: '🎨', title: 'Видеокарта (GPU)', text: 'Отвечает за обработку графики и вычислительные задачи, связанные с изображением. Особенно важна для игр.', details: ['Видеопамять (VRAM) хранит данные графики.', 'Производительность GPU сильно влияет на FPS в графических задачах.', 'Встроенная графика находится прямо в процессоре или платформе и обычно слабее отдельной видеокарты.'] },
  { category: 'RAM', icon: '🧩', title: 'Оперативная память (RAM)', text: 'Быстрая временная память для данных, которыми система пользуется прямо сейчас. После выключения её содержимое исчезает.', details: ['Объём определяет, сколько данных и программ можно держать одновременно.', 'Тип памяти — DDR3, DDR4 или DDR5 — должен соответствовать платформе.', 'Больший объём не всегда означает большую производительность, но нехватка RAM сильно мешает системе.'] },
  { category: 'Storage', icon: '💾', title: 'Накопитель', text: 'Хранит операционную систему, игры и файлы даже после выключения ПК.', details: ['HDD использует магнитные пластины и обычно медленнее SSD.', 'SATA SSD заметно быстрее HDD.', 'NVMe SSD работает через PCIe и обычно ещё быстрее.'] },
  { category: 'PSU', icon: '⚡', title: 'Блок питания (PSU)', text: 'Преобразует электричество из сети и подаёт подходящее питание компонентам компьютера.', details: ['Мощность указывается в ваттах (W).', 'Слабого БП может не хватить мощным компонентам.', 'Качество питания тоже важно: сертификат эффективности не является полной оценкой качества БП.'] },
  { category: 'Motherboard', icon: '🔌', title: 'Материнская плата', text: 'Соединяет компоненты компьютера и определяет, какие процессоры, память и устройства можно установить.', details: ['Сокет должен совпадать с процессором.', 'Поддержка памяти определяет совместимые поколения DDR.', 'Количество и стандарт слотов расширения влияют на возможности апгрейда.'] },
  { category: 'Cooling', icon: '❄️', title: 'Охлаждение', text: 'Отводит тепло от горячих компонентов, прежде всего процессора.', details: ['Штатный кулер подходит не для любого мощного CPU.', 'Башенные кулеры используют радиатор и вентилятор.', 'СЖО использует жидкость, радиатор и помпу для отвода тепла.'] },
  { category: 'Case', icon: '🖥️', title: 'Корпус', text: 'Физический корпус, в котором размещаются компоненты. В игре он влияет на удобство и пригодность сборки, но не заменяет остальные детали.', details: ['Размер корпуса определяет совместимость с комплектующими.', 'Хороший airflow помогает выводить горячий воздух.', 'На хардкоре можно начать вообще без корпуса.'] }
];

let infoCategory = 'CPU';
let tutorialStep = 0;
let tutorialPreviewSnapshot = null;
let tutorialPreviewActive = false;
const TUTORIAL_STEPS = [
  { target: '#startGameBtn', screen: 'menu', title: 'Начать', text: 'Создаёт новое прохождение. После этого выбираешь лёгкий, сложный или хардкор.' },
  { target: '#loadGameBtn', screen: 'menu', title: 'Загрузить', text: 'Здесь загружаются сохранения из трёх ручных ячеек.' },
  { target: '.mode-card.easy', screen: 'mode', title: 'Режимы', text: 'У каждого режима свой стартовый ПК, бюджет, экономика и ограничения.' },
  { target: '.mode-card.hardcore', screen: 'mode', title: 'Хардкор', text: 'Самый жёсткий режим. Перед запуском появляется отдельное предупреждение.' },
  { target: '#miniGamesTab', screen: 'games', title: 'Мини-игры', text: 'Активный заработок: проходишь игру полностью и получаешь награду. CPU может дать дополнительный бонус.' },
  { target: '#afkTab', screen: 'afk', title: 'AFK', text: 'Компьютер зарабатывает автоматически. Для запуска нужны подходящие компоненты и достаточно мощный CPU.' },
  { target: '[data-afk-mode="overclock"]', screen: 'afk-overclock', title: 'Разгон', text: 'Разгон даёт ×5 к доходу, но повышает риск перегрева и требует более мощного процессора.' },
  { target: '#openShopBtn', screen: 'shop', title: 'Каталог', text: 'Здесь покупаются детали. В зависимости от режима каталог отображается по-разному, а скрытые группы помогают правильно расставлять приоритеты.' },
  { target: '#openShopBtn', screen: 'shop', title: 'Продажа деталей', text: 'У купленных деталей есть две кнопки: «Установить» и «Продать». Продажа возвращает 80% от текущей рыночной цены детали.' },
  { target: '#openShopBtn', screen: 'shop', title: 'Купоны', text: 'После полного прохождения мини-игры может выпасть купон от -10% до -80%. Он применяется к уже изменённой рынком цене и хранится только один за раз.' },
  { target: '#openShopBtn', screen: 'shop', title: 'Рынок и события', text: 'Цены и доступность деталей меняются. События временно влияют на категории товаров и их цены.' },
  { target: '#pcParts .part-button:first-child', screen: 'pc', title: 'Сборка ПК', text: 'Нажми на слот компонента, чтобы заменить установленную деталь на купленную из инвентаря.' },
  { target: '#pcParts .part-button:first-child', screen: 'pc', title: 'Совместимость', text: 'Процессор и материнская плата должны иметь совместимые платформы, а RAM — соответствующий тип памяти. Некоторые детали также имеют требования по питанию и охлаждению.' },
  { target: '#saveBtn', screen: 'pc', title: 'Сохранения', text: 'Рядом со сбросом есть сохранения с тремя ручными ячейками. Если ячейка занята, сайт предложит перезаписать её.' },
  { target: '#resetBtn', screen: 'pc', title: 'Сброс', text: 'Сброс прохождения требует подтверждения и сначала предлагает сохранить текущую игру.' },
  { target: '#achievementsBtn', screen: 'menu', title: 'Достижения', text: 'Здесь отслеживается прогресс достижений. Некоторые требуют конкретную сборку, деньги, события или полную коллекцию каталога.' },
  { target: '#infoBtn', screen: 'menu', title: 'Энциклопедия', text: 'Здесь можно посмотреть назначение комплектующих и важные характеристики.' }
];

const BLACK_FRIDAY_PROGRESS_KEY = 'pcBuilder_black_friday_progress';

function loadBlackFridayProgress() {
  try {
    const raw = localStorage.getItem(BLACK_FRIDAY_PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveBlackFridayProgress(progress) {
  try {
    localStorage.setItem(BLACK_FRIDAY_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors.
  }
  return progress;
}

function recordBlackFridayEventSlot(slot = eventSlot()) {
  const event = chooseMarketEvent(slot);
  const progress = loadBlackFridayProgress();
  const lastSlot = Number.isFinite(Number(progress.lastSlot)) ? Number(progress.lastSlot) : null;
  if (lastSlot === slot) return Number(progress.streak) || 0;

  let streak = 0;
  if (lastSlot === slot - 1) streak = Number(progress.streak) || 0;
  if (event.id === 'black_friday') streak += 1;
  else streak = 0;

  saveBlackFridayProgress({ lastSlot: slot, streak: Math.min(3, streak) });
  return Math.min(3, streak);
}

function getBlackFridayStreak() {
  return Math.min(3, Number(loadBlackFridayProgress().streak) || 0);
}

const ACHIEVEMENTS = [
  {
    id: 'amd_max',
    icon: '🔴',
    name: 'I need more powerful!',
    description: 'Максимальный апгрейд на пути AMD.',
    requirements: [
      ['CPU', ['cpu-r9-9950x'], 'AMD Ryzen 9 9950X'],
      ['GPU', ['gpu-rx-7900xtx', 'gpu-rtx-5090'], 'Radeon RX 7900 XTX или GeForce RTX 5090'],
      ['RAM', ['ram-ddr5-96'], '96 GB DDR5'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-x870'], 'X870 материнская плата'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм']
    ]
  },
  {
    id: 'intel_max',
    icon: '🔵',
    name: 'Process or Factory',
    description: 'Максимальный апгрейд на пути Intel.',
    requirements: [
      ['CPU', ['cpu-i9-14900k'], 'Intel Core i9-14900K'],
      ['GPU', ['gpu-rtx-5090', 'gpu-arc-b580'], 'GeForce RTX 5090 или Intel Arc B580'],
      ['RAM', ['ram-ddr5-96'], '96 GB DDR5'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-z790'], 'Z790 материнская плата'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм']
    ]
  }
,

  {
    id: 'millionaire',
    icon: '💰',
    name: "Villain? That's what losers call the winner",
    description: 'Накопи на балансе 1 000 000 $.',
    type: 'money',
    target: 1000000
  },
  {
    id: 'holy_bottleneck',
    icon: '🙏',
    name: 'Holy Bottleneck!',
    description: 'Собери почти идеальный ПК, оставив ровно одну деталь слабым местом.',
    type: 'bottleneck'
  },
  {
    id: 'jackpot',
    icon: '🎰',
    name: 'JACKPOOOOOOOT!',
    description: 'Выбей 3 Чёрные пятницы подряд.',
    type: 'event_streak',
    target: 3
  },
  {
    id: 'mining_farm',
    icon: '⛏️',
    name: 'Mining Farm',
    description: 'Собери мощную майнинг-ферму на Xeon и 128 ГБ DDR4.',
    requirements: [
      ['GPU', ['gpu-rtx-5090'], 'GeForce RTX 5090'],
      ['CPU', ['cpu-xeon-e-2388g'], 'Intel Xeon E-2388G'],
      ['RAM', ['ram-ddr4-128'], '128 GB DDR4'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-b560-gaming'], 'ASUS TUF GAMING B560-PLUS'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм']
    ]
  },
  {
    id: 'terminator',
    icon: '🤖',
    name: 'Terminator',
    description: 'Собери ультимативную AI-сборку на Core Ultra 9 и 256 ГБ DDR5.',
    requirements: [
      ['GPU', ['gpu-rtx-5090'], 'GeForce RTX 5090'],
      ['CPU', ['cpu-ultra9-285k'], 'Intel Core Ultra 9 285K'],
      ['RAM', ['ram-ddr5-256'], '256 GB DDR5'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-z890-256'], 'ASUS ROG MAXIMUS Z890 EXTREME'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм']
    ]
  },
  {
    id: 'order_empire',
    icon: '👑',
    name: "I'll end this, for the order empire!",
    description: 'Скупи все предметы из каталога.',
    type: 'collection'
  }
];


function achievementRequirementState(requirement) {
  const [category, ids, label] = requirement;
  let installed = installedItem(category);
  // Совместимость со старыми сохранениями: если там сохранилось имя детали
  // вместо ID, восстанавливаем реальный объект из текущего каталога.
  if (!installed && state?.installed?.[category]) {
    const raw = String(state.installed[category]);
    installed = SHOP.find((item) => item.category === category && (item.id === raw || item.name === raw)) || null;
  }
  const normalizedIds = ids.map((id) => String(id).toLowerCase());
  const normalizedNames = [label, ...(ids.map((id) => itemById(id)?.name).filter(Boolean))]
    .map((value) => String(value).toLowerCase().trim());
  const installedId = installed?.id ? String(installed.id).toLowerCase() : '';
  const installedName = installed?.name ? String(installed.name).toLowerCase().trim() : '';
  const ok = !!installed && !isItemBroken(installed) &&
    (normalizedIds.includes(installedId) || normalizedNames.includes(installedName));
  return { category, ids, label, installed, ok };
}

function normaliseInstalledForAchievements() {
  if (!state?.installed) return;
  state.owned = state.owned || {};
  state.broken = state.broken || {};
  if (state.installed.CPU === 'starter-hardcore-cpu') {
    state.installed.CPU = 'cpu-cel-g5905';
    state.owned['cpu-cel-g5905'] = true;
    delete state.owned['starter-hardcore-cpu'];
    if (state.broken['starter-hardcore-cpu']) {
      state.broken['cpu-cel-g5905'] = state.broken['starter-hardcore-cpu'];
      delete state.broken['starter-hardcore-cpu'];
    }
  }
  for (const category of CATEGORIES) {
    const raw = state.installed[category];
    if (!raw) continue;
    if (itemById(raw)) {
      state.owned[raw] = true;
      continue;
    }
    const match = SHOP.find((item) => item.category === category && item.name === raw);
    if (match) {
      state.installed[category] = match.id;
      state.owned[match.id] = true;
    }
  }
}

function bottleneckAchievementState() {
  const topSets = {
    CPU: new Set(['cpu-r9-9950x', 'cpu-i9-14900k']),
    GPU: new Set(['gpu-rtx-5090', 'gpu-rx-7900xtx', 'gpu-arc-b580']),
    RAM: new Set(['ram-ddr5-96']),
    Storage: new Set(['storage-ssd-2tb-gen5']),
    PSU: new Set(['psu-1000-gold']),
    Case: new Set(['case-case-showcase']),
    Motherboard: new Set(['motherboard-mb-x870', 'motherboard-mb-z790']),
    Cooling: new Set(['cooling-cooler-aio-420'])
  };
  const weak = {
    CPU: (item) => item && (item.id === 'starter-hardcore-cpu' || (item.performance || 0) <= 20),
    GPU: (item) => item && (item.id === 'starter-hardcore-gpu' || (item.performance || 0) <= 31),
    RAM: (item) => item && (item.id === 'starter-hardcore-ram' || (item.performance || 0) <= 12),
    Storage: (item) => item && (item.id === 'starter-hardcore-storage' || (item.performance || 0) <= 12),
    PSU: (item) => item && (/psu-(180|300|400)$/.test(item.id) || (item.performance || 0) <= 5),
    Case: (item) => !item || item.id === 'starter-hardcore-case' || (item.performance || 0) <= 5,
    Motherboard: (item) => item && (item.id === 'starter-hardcore-mb' || (item.performance || 0) <= 10),
    Cooling: (item) => item && (/starter-.*cooling|cooler-(stock|basic)$/.test(item.id) || (item.performance || 0) <= 5)
  };
  const installed = Object.fromEntries(CATEGORIES.map((category) => [category, installedItem(category)]));
  const weakCategories = CATEGORIES.filter((category) => weak[category](installed[category]));
  if (weakCategories.length !== 1) return { ok: false, weakCategories, installed };
  const weakCategory = weakCategories[0];
  const topCategories = CATEGORIES.filter((category) => category !== weakCategory && topSets[category].has(installed[category]?.id));
  return { ok: topCategories.length === CATEGORIES.length - 1, weakCategory, weakCategories, installed };
}

function catalogPurchaseItems() { return SHOP.filter((item) => !item.starter && !item.legacy); }
function catalogCollectionProgress() {
  const items = catalogPurchaseItems();
  const owned = items.filter((item) => !!state?.owned?.[item.id]).length;
  return { owned, total: items.length, complete: items.length > 0 && owned === items.length };
}
function achievementRequirementsMet(achievement) {
  if (achievement.type === 'money') return Number(state?.money || 0) >= Number(achievement.target || 0);
  if (achievement.type === 'bottleneck') return bottleneckAchievementState().ok;
  if (achievement.type === 'event_streak') return getBlackFridayStreak() >= Number(achievement.target || 3);
  if (achievement.type === 'collection') return catalogCollectionProgress().complete;
  return achievement.requirements.every((requirement) => achievementRequirementState(requirement).ok);
}

let achievementToastTimer = null;
let confettiAnimationId = null;

function showAchievementCelebration(achievement) {
  const toast = $('achievementToast');
  const name = $('achievementToastName');
  const icon = $('achievementToastIcon');
  if (!toast || !name || !icon || !achievement) return;
  icon.textContent = achievement.icon || '🏆';
  name.textContent = achievement.name;
  toast.classList.remove('show');
  requestAnimationFrame(() => toast.classList.add('show'));
  if (achievementToastTimer) clearTimeout(achievementToastTimer);
  achievementToastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  launchConfetti();
}

function launchConfetti() {
  const canvas = $('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const colors = ['#ff4d6d','#ffd166','#4cc9f0','#80ed99','#c77dff','#f8f9fa'];
  const pieces = Array.from({ length: 110 }, () => ({
    x: width * (0.12 + Math.random() * 0.76),
    y: height + 10 + Math.random() * 35,
    vx: (Math.random() - 0.5) * 3.8,
    vy: -(8 + Math.random() * 7.5),
    gravity: 0.18 + Math.random() * 0.08,
    width: 6 + Math.random() * 7,
    height: 5 + Math.random() * 10,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0,
    maxLife: 170 + Math.random() * 70
  }));
  const started = performance.now();
  function frame(now) {
    const elapsed = now - started;
    ctx.clearRect(0, 0, width, height);
    let alive = false;
    for (const p of pieces) {
      if (p.life >= p.maxLife) continue;
      alive = true;
      p.life += 1;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      if (p.y > height + 40) p.life = p.maxLife;
      const alpha = Math.max(0, 1 - Math.max(0, p.life - p.maxLife + 35) / 35);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      ctx.restore();
    }
    if (alive && elapsed < 7000) {
      confettiAnimationId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, width, height);
      confettiAnimationId = null;
      window.removeEventListener('resize', resize);
    }
  }
  window.addEventListener('resize', resize);
  confettiAnimationId = requestAnimationFrame(frame);
}

const ACHIEVEMENT_STORAGE_KEY = 'pcBuilder_global_achievements';

function loadGlobalAchievements() {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveGlobalAchievements(achievements = null) {
  try {
    const existing = loadGlobalAchievements();
    const incoming = achievements && typeof achievements === 'object'
      ? achievements
      : (state?.achievements && typeof state.achievements === 'object' ? state.achievements : {});
    const merged = { ...existing };
    Object.keys(incoming).forEach((id) => { if (incoming[id]) merged[id] = true; });
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return loadGlobalAchievements();
  }
}

function syncAchievementsFromGlobal() {
  if (!state) return loadGlobalAchievements();
  const global = loadGlobalAchievements();
  const local = state.achievements && typeof state.achievements === 'object' ? state.achievements : {};
  state.achievements = { ...global };
  Object.keys(local).forEach((id) => { if (local[id]) state.achievements[id] = true; });
  const merged = saveGlobalAchievements(state.achievements);
  state.achievements = { ...merged };
  return merged;
}

function isAchievementUnlocked(achievementId) {
  return !!loadGlobalAchievements()[achievementId];
}

function getUnlockedAchievementCount() {
  return ACHIEVEMENTS.reduce((count, achievement) => count + (isAchievementUnlocked(achievement.id) ? 1 : 0), 0);
}

function updateAchievementMenuButton() {
  const btn = $('achievementsBtn');
  if (!btn) return;
  const unlocked = getUnlockedAchievementCount();
  btn.textContent = `🏆 Достижения${unlocked ? ` (${unlocked}/${ACHIEVEMENTS.length}) ✅` : ''}`;
  btn.classList.toggle('has-achievements', unlocked > 0);
}

function checkAchievements() {
  if (!state) { updateAchievementMenuButton(); return []; }
  const global = syncAchievementsFromGlobal();
  const unlocked = { ...global };
  const unlockedNow = [];
  ACHIEVEMENTS.forEach((achievement) => {
    if (!unlocked[achievement.id] && achievementRequirementsMet(achievement)) {
      unlocked[achievement.id] = true;
      unlockedNow.push(achievement.id);
    }
  });
  const merged = saveGlobalAchievements(unlocked);
  state.achievements = { ...merged };
  updateAchievementMenuButton();
  if (unlockedNow.length) {
    save();
    unlockedNow.forEach((id) => {
      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      showAchievementCelebration(achievement);
    });
  }
  if ($('achievementsModal') && !$('achievementsModal').classList.contains('hidden')) renderAchievements();
  return unlockedNow;
}

function renderAchievements() {
  syncAchievementsFromGlobal();
  const wrap = $('achievementList');
  if (!wrap) return;
  wrap.innerHTML = ACHIEVEMENTS.map((achievement) => {
    const unlocked = isAchievementUnlocked(achievement.id);
    let body = '';
    if (achievement.type === 'money') {
      const current = unlocked ? Number(achievement.target || 0) : Math.min(Number(state?.money || 0), Number(achievement.target || 0));
      body = `<div class="achievement-progress"><div class="achievement-progress-label">${formatMoney(current)} / ${formatMoney(achievement.target)} $</div><div class="achievement-progress-bar"><span style="width:${Math.min(100, current / achievement.target * 100)}%"></span></div></div>`;
    } else if (achievement.type === 'bottleneck') {
      const result = bottleneckAchievementState();
      body = `<div class="achievement-progress"><div class="achievement-progress-label">${result.ok ? '✅ Условие выполнено' : `Нужно: 7 топовых деталей + 1 слабая${result.weakCategory ? ` • слабая: ${CATEGORY_LABELS[result.weakCategory]}` : ''}`}</div></div>`;
    } else if (achievement.type === 'event_streak') {
      const current = unlocked ? Number(achievement.target || 3) : getBlackFridayStreak();
      body = `<div class="achievement-progress"><div class="achievement-progress-label">${current} / ${achievement.target} Чёрных пятниц подряд</div><div class="achievement-progress-bar"><span style="width:${Math.min(100, current / achievement.target * 100)}%"></span></div></div>`;
    } else if (achievement.type === 'collection') {
      const progress = catalogCollectionProgress();
      const current = unlocked ? progress.total : progress.owned;
      body = `<div class="achievement-progress"><div class="achievement-progress-label">${current} / ${progress.total} предметов каталога</div><div class="achievement-progress-bar"><span style="width:${progress.total ? Math.min(100, current / progress.total * 100) : 0}%"></span></div></div>`;
    } else {
      const requirements = achievement.requirements.map((requirement) => {
        const { category, label, ok } = achievementRequirementState(requirement);
        const completed = unlocked ? true : ok;
        return `<li class="achievement-req ${completed ? 'met' : ''}"><span>${completed ? '✓' : '○'}</span><b>${category}</b><span>${label}</span></li>`;
      }).join('');
      body = `<ul class="achievement-reqs">${requirements}</ul>`;
    }
    return `<article class="achievement-card ${unlocked ? 'unlocked' : 'locked'}"><div class="achievement-card-head"><div class="achievement-icon">${achievement.icon}</div><div class="achievement-title-wrap"><h3>${achievement.name}</h3><p>${achievement.description}</p></div><span class="achievement-status">${unlocked ? '✅ Получено' : '🔒 Заблокировано'}</span></div>${body}</article>`;
  }).join('');
  updateAchievementMenuButton();
}

function openAchievements() {
  syncAchievementsFromGlobal();
  checkAchievements();
  openMenuModal('achievementsModal');
  renderAchievements();
  updateAchievementMenuButton();
}

const UPDATE_LOG = `v1.11.0 — ПРОДАЖА ДЕТАЛЕЙ И НОВОЕ ДОСТИЖЕНИЕ
- Добавлена продажа купленных деталей из каталога и инвентаря.
- Цена продажи составляет 80% от текущей рыночной стоимости.
- Продажа учитывает текущий рыночный процент детали.
- Добавлено достижение «I'll end this, for the order empire!» за скупку всего каталога.

v1.10.4 — ОБНОВЛЕНО ОБУЧЕНИЕ
- Обновлено встроенное обучение сайта под актуальные функции: загрузка, хардкор, мини-игры, AFK, разгон, каталог, продажа деталей, купоны, события, совместимость, сохранения и достижения.
- Добавлены подсказки по новым механикам и актуальным ограничениям.

v1.10.3 — НОВЫЕ ДОСТИЖЕНИЯ
- Добавлены достижения «Mining Farm» и «Terminator».
- Оба достижения требуют полного совпадения всех 8 компонентов сборки.
- «Mining Farm»: RTX 5090 + Xeon E-2388G + 128 GB DDR4 + 2 TB PCIe 5.0 NVMe SSD + БП 1000 W 80+ Gold + Showcase + ASUS TUF GAMING B560-PLUS + СЖО 420 мм.
- «Terminator»: RTX 5090 + Core Ultra 9 285K + 256 GB DDR5 + 2 TB PCIe 5.0 NVMe SSD + БП 1000 W 80+ Gold + Showcase + ASUS ROG MAXIMUS Z890 EXTREME + СЖО 420 мм.

v1.10.2 — ФИКС КНОПКИ МОДАЛКИ КУПОНА
- Исправлена кнопка «Понятно» в модалке получения купона: теперь она корректно закрывает окно.

v1.10.1 — ФИКС ХАРДКОРА И МОДАЛКА КУПОНА
- Исправлен стартовый блок питания хардкора: БП 180 W теперь является реальной каталоговой деталью с корректным ID.
- Исправлена миграция старых сохранений после объединения стартовых и каталоговых БП.
- После получения купона появляется отдельная модалка с объяснением, что это за купон и как им пользоваться.

v1.10.0 — КУПОНЫ И ФИКС МИНИ-ИГР
- После полного успешного прохождения любой мини-игры появляется 10% шанс получить один купон на скидку от -10% до -80%.
- Пока купон не потрачен, новый купон не выдаётся.
- Скидка купона применяется к уже изменённой рынком цене детали, а не к базовой цене.
- Перед покупкой с купоном показывается сравнение цены без купона и со скидкой, после чего игрок выбирает, тратить ли купон.
- Исправлена «Реакция»: после 5-го успешного раунда игра закрывается и повторные нажатия больше не выдают деньги.
- Для «Реакции» добавлено окно ответа: 1.0 сек на лёгком, 0.7 сек на сложном и 0.4 сек на хардкоре.
- Исправлена стартовая совместимость хардкора: Celeron G5905 корректно укладывается в возможности штатного охлаждения.
- Шанс «Чёрной пятницы» остаётся 5%.

v1.9.7 — ФИКС ХАРДКОРА И ШАНСА ЧЁРНОЙ ПЯТНИЦЫ\n- Исправлена совместимость стартовой DDR3-памяти хардкора с его материнской платой: плата теперь корректно заявляет DDR3, а стартовая RAM считывается как DDR3.\n- Шанс события «Чёрная пятница» повышен с 2.5% до 5%.\n\nv1.9.6 — ХАРДКОР: ПРЕДУПРЕЖДЕНИЕ И ЕДИНЫЕ БП\n- При выборе хардкора появляется предупреждение с подтверждением запуска.\n- Стартовые БП всех режимов объединены с каталоговыми записями; для лёгкого режима добавлен каталоговый БП 450 W.\n- Стартовые 300 W и 180 W теперь используют те же ID, что и каталог.\n- Стартовая RAM хардкора отображается как 2 ГБ DDR3.\n\nv1.9.5 — ФИКС СТАРТОВОЙ СОВМЕСТИМОСТИ ХАРДКОРА\n- Стартовая материнская плата хардкора теперь LGA1200 и совместима с Celeron G5905.\n- Исправлен ошибочный блок мини-игр в новом хардкорном прохождении.\n\nv1.9.4 — БАЛАНС БОНУСОВ И ТРЕБОВАНИЯ CPU

- Бонус Xeon +200% перенесён в общий блок бонусов рядом с множителем мощности ПК в AFK.
- В «Обучении ИИ» убран дублирующий бейдж +75% CPU рядом с основной наградой; остаётся только бонус в общем блоке рядом с множителем мощности ПК.
- Для обычного AFK и разгона требуется CPU не слабее 34 мощности (уровень Intel Core i5-10400F / AMD Ryzen 5 3600).
- Для «Обучения ИИ» требуется CPU не слабее 25 мощности (уровень Intel Core i3-12100F) и прежние 64 ГБ DDR4/DDR5 RAM.
- Версия: v1.9.4.

v1.9.3 — БАЛАНС БОНУСОВ CPU И CORE ULTRA

- Бонус Core Ultra в «Обучении ИИ» теперь умножает уже рассчитанную награду на 1.75: например, $1 000 превращаются в $1 750.
- Цены Core Ultra повышены на 10%: 245K — $2 970, 265K — $3 960, 285K — $5 060.
- Core Ultra 5 / 7 / 9 объединены в одну скрытую категорию Core Ultra и внутри неё сортируются по мощности.
- Награды всех мини-игр повышены на 10%.
- Ryzen получает +100% к награде мини-игр; бонус отображается на странице фиолетовой подсветкой «+100% CPU · Ryzen».
- Бонус Core Ultra в разделе «Обучение ИИ» отображается фиолетовой подсветкой «+75% CPU · Core Ultra».
- Шанс поломки Xeon снижен до 1% в обычном AFK и 2.5% в разгоне.

v1.9.2 — CORE ULTRA И БОНУС XEON

- Процессоры Intel Core Ultra дают +75% к награде за «Обучение ИИ».
- При открытом разделе «Обучение ИИ» на установленном Core Ultra показывается «+75% CPU».
- При выполнении обучения ИИ бонус Core Ultra учитывается вместе с базовой наградой и бонусом мощности.
- При открытом разделе AFK на установленном Intel Xeon показывается «+200% CPU».
- Бонус Xeon для обычного AFK и разгона сохраняется по прежним правилам.

v1.9.1 — ФИКС Z890 И LGA1851
- ASUS ROG MAXIMUS Z890 EXTREME теперь корректно определяется как LGA1851.
- Intel Core i9-14900K больше не может считаться совместимым с Z890.
- GIGABYTE Z790 AORUS MASTER X остаётся LGA1700.

v1.9.0 — ОБУЧЕНИЕ ИИ И ОПЕРАТИВНАЯ ПАМЯТЬ

- Добавлен новый способ заработка «Обучение ИИ» рядом с AFK.
- Для запуска требуется минимум 64 ГБ рабочей DDR4 или DDR5 RAM.
- Каждая сессия содержит 3–5 случайных задач: соединение проводов по цветам, ввод случайного слова, скачивание данных, перенос файла в папку и закрытие пары окон.
- Если одна и та же задача выпала два раза подряд, на третий раз она принудительно исключается.
- Общего таймера у обучения ИИ нет.
- За завершение сессии выплачивается 250$ + бонус от мощности ПК.
- В каталог добавлены 128 ГБ и 256 ГБ DDR4/DDR5.
- Добавлены материнские платы с поддержкой до 256 ГБ RAM.

v1.8.17 — XEON: ЦЕНА И РИСК ПОЛОМКИ

- Цена всех Intel Xeon увеличена на 20%: E-2336 — $6 240, W-1290P — $7 080, E-2388G — $8 160.
- Каждый AFK-платёж для установленного Xeon теперь имеет шанс 1.5% сломать процессор в обычном AFK.
- В разгоне шанс поломки Xeon увеличивается до 3% на каждый AFK-платёж.
- При поломке Xeon режим AFK останавливается и показывается стандартное окно поломки CPU.

v1.8.16 — ПРОИЗВОДИТЕЛИ И МАТЕРИНСКИЕ ПЛАТЫ

- Добавлено мягкое свечение названия производителя рядом с мощностью детали.
- AMD отображается красным, Intel — синим, NVIDIA — фиолетовым.
- Материнским платам добавлены реальные производители GIGABYTE, MSI и ASUS.
- Рядом с производителем материнской платы показывается CPU-платформа: Intel или AMD.
- Производитель хранится отдельно от скрытой платформы/группы и не ломает сортировку, совместимость и иерархию каталога.

v1.8.15 — ЦВЕТА ПРОИЗВОДИТЕЛЕЙ

- Производители CPU и GPU получили цветные подписи в каталоге и списке замены.
- AMD — красный, Intel — синий, NVIDIA — фиолетовый.

v1.8.14 — ФИКС ФАКТИЧЕСКОГО ПОРЯДКА КАТАЛОГА

- Исправлена повторная сортировка списка в сложном режиме, из-за которой AMD/NVIDIA/Intel снова перемешивались.
- Скрытый приоритет производителя и серии теперь сохраняется до самого рендера товаров.
- Внутри каждой серии по-прежнему используется сортировка по мощности.

v1.8.13 — ФИКС ПОРЯДКА КАТАЛОГА
- В сложном режиме и внутри плоского списка каталог сначала группирует детали по скрытому производителю/типу, затем по скрытой серии и только потом сортирует по мощности.
- GPU: AMD → NVIDIA → Intel; внутри NVIDIA: GTX → RTX.
- CPU: Intel → Celeron → Pentium → Core i3 → Core i5 → Core i7 → Core i9 → Core Ultra → Xeon, затем AMD → Ryzen 3 → Ryzen 5 → Ryzen 7 → Ryzen 9.

v1.8.12 — КАТАЛОГ: ВИДИМЫЕ КАТЕГОРИИ ТОЛЬКО В ХАРДКОРЕ
- Сложный режим вернул прежний вид: отображаются только верхние категории комплектующих, без производителей и серий.
- Внутри сложного режима производитель и серия теперь скрытые данные, используемые только для правильного порядка.
- CPU внутри скрытой иерархии: Intel → Celeron → Pentium → Core i3 → Core i5 → Core i7 → Core i9 → Core Ultra → Xeon, затем AMD → Ryzen 3/5/7/9.
- GPU внутри скрытой иерархии: AMD → NVIDIA → Intel; у NVIDIA сначала GTX, затем RTX.
- Хардкор сохраняет видимую иерархию категория → производитель/тип → серия → деталь.

v1.8.11 — ИЕРАРХИЯ ХАРДКОРА И ВНУТРЕННЯЯ СОРТИРОВКА\n- Для сложного и хардкора каталог теперь разделён на производитель → серия → конкретные детали.\n- CPU: Intel → Celeron → Pentium → Core i3 → i5 → i7 → i9 → Core Ultra → Xeon, затем AMD → Ryzen 3 → 5 → 7 → 9.\n- GPU: AMD → NVIDIA → Intel.\n- Внутри каждой серии комплектующие автоматически сортируются от самой слабой к самой мощной по внутренней мощности PC Builder.\n\nv1.8.10 — ФИКС ДУБЛЯ Celeron G5905\n- Хардкорный стартовый процессор теперь использует тот же ID, что и Intel Celeron G5905 в каталоге.\n- У Celeron G5905 единая мощность 8: стартовая и каталоговая запись больше не расходятся.\n- В новом прохождении Celeron G5905 уже находится в инвентаре и не может быть куплен повторно.\n- Старые сохранения автоматически заменяют starter-hardcore-cpu на каталоговый Celeron G5905.\n\nv1.8.9 — БАЛАНСИРОВКА ОХЛАЖДЕНИЯ И СТАРТОВЫХ CPU\n- Повышены цены всех систем охлаждения; СЖО 420 мм теперь $3 000.\n- Сложный режим: стартовый CPU — Intel Pentium J2900.\n- Хардкор: стартовый CPU — Intel Celeron G5905.\n\nv1.8.8 — СОРТИРОВКА КАТАЛОГА И БАЛАНС XEON\n- Компоненты внутри категорий отсортированы от самого слабого к самому мощному по внутренней мощности PC Builder.\n- Xeon подняты по цене и мощности и остаются премиальной AFK-веткой.\n\nv1.8.7 — БАЛАНСИРОВКА AFK\n- Итоговая выплата AFK уменьшена в 5 раз. Интервалы и множители не изменены.\n\nv1.8.6 — INTEL XEON И AFK\n- В каталог добавлены Intel Xeon: E-2336, E-2388G и Xeon W-1290P.\n- Xeon дают +200% к доходу в обычном AFK и разгоне AFK.\n\nv1.8.5 — РАСШИРЕНИЕ INTEL CPU\n- Добавлены Intel Celeron и Pentium.\n- Добавлена ветка Intel Core Ultra.\n- Добавлены B860 и Z890 для LGA1851.\n\nv1.8.4 — ФИКС РЕАЛЬНОГО FPS И ДВИЖКА РЫНКА\n- Исправлено размножение игровых циклов мини-игр.\n\nv1.8.3 — ДЖЕКПОТ И КАТЕГОРИИ\n- Добавлено достижение JACKPOOOOOOOT! за 3 Чёрные пятницы подряд.\n- «Взрыв фабрики» теперь выбирает 2 категории, а не отдельные товары.\n\nv1.8.2 — ЛИШНЕЕ ПРОИЗВОДСТВО\n- «Лишнее производство» действует на целую категорию комплектующих.\n\nv1.8.1 — ДЛИТЕЛЬНОСТЬ СОБЫТИЙ\n- События рынка активны 4 минуты 30 секунд из каждого 5-минутного цикла.\n\nv1.8.0 — СОБЫТИЯ РЫНКА\n- Добавлены случайные события рынка каждые 5 минут.\n\n`


function renderInfoModal() {
  const list = $('infoCategoryList');
  const content = $('infoCategoryContent');
  if (!list || !content) return;
  list.innerHTML = PART_INFO.map((item) => `<button class="info-part-tab ${infoCategory === item.category ? 'active' : ''}" data-info-category="${item.category}">${item.icon} ${item.title}</button>`).join('');
  const item = PART_INFO.find((entry) => entry.category === infoCategory) || PART_INFO[0];
  content.innerHTML = `<div class="info-part-head"><span class="info-part-icon">${item.icon}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></div><div class="info-details">${item.details.map((detail) => `<div class="info-detail">${detail}</div>`).join('')}</div>`;
  list.querySelectorAll('[data-info-category]').forEach((btn) => btn.addEventListener('click', () => { infoCategory = btn.dataset.infoCategory; renderInfoModal(); }));
}

function openInfo() { renderInfoModal(); openMenuModal('infoModal'); }

function getSettings() {
  let settings = { animations: true, theme: 'dark' };
  try { settings = { ...settings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')) }; } catch { /* ignore broken settings */ }
  settings.theme = settings.theme === 'light' ? 'light' : 'dark';
  return settings;
}
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('theme-light', isLight);
  document.documentElement.classList.toggle('theme-light', isLight);
  document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = isLight ? '#eef2f5' : '#101317';
}
function loadSettings() {
  const settings = getSettings();
  document.body.classList.toggle('no-animations', settings.animations === false);
  applyTheme(settings.theme);
  if ($('animationsToggle')) $('animationsToggle').checked = settings.animations !== false;
  if ($('themeLight')) $('themeLight').checked = settings.theme === 'light';
  if ($('themeDark')) $('themeDark').checked = settings.theme !== 'light';
}
function saveSettings() {
  const current = getSettings();
  const animations = $('animationsToggle').checked;
  const theme = document.querySelector('input[name="theme"]:checked')?.value === 'light' ? 'light' : 'dark';
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ animations, theme }));
  document.body.classList.toggle('no-animations', !animations);
  applyTheme(theme);
}

function snapshotTutorialState() {
  tutorialPreviewSnapshot = {
    state,
    savedRaw: localStorage.getItem(STORAGE_KEY)
  };
  tutorialPreviewActive = true;
}
function restoreTutorialState() {
  if (!tutorialPreviewSnapshot) return;
  state = tutorialPreviewSnapshot.state;
  if (tutorialPreviewSnapshot.savedRaw === null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, tutorialPreviewSnapshot.savedRaw);
  tutorialPreviewSnapshot = null;
  tutorialPreviewActive = false;
  closeGame();
  closeShop();
  if (state) render(); else showMainMenu();
}
function prepareTutorialScreen(screen) {
  closeShop();
  if (screen === 'menu') { showMainMenu(); return; }
  if (screen === 'mode') { closeGame(); showModeScreen(); return; }
  if (!state) start('easy'); else render();
  if (screen === 'games') { setEarnTab('games'); renderEarnTabs(); return; }
  if (screen === 'afk') { setEarnTab('afk'); afkMode = 'normal'; document.querySelectorAll('[data-afk-mode]').forEach((b) => b.classList.toggle('active', b.dataset.afkMode === 'normal')); renderAfkPanel(); return; }
  if (screen === 'afk-overclock') { setEarnTab('afk'); afkMode = 'overclock'; document.querySelectorAll('[data-afk-mode]').forEach((b) => b.classList.toggle('active', b.dataset.afkMode === 'overclock')); stopAfk(); renderAfkPanel(); return; }
  if (screen === 'shop') openCatalog();
}
function positionTutorialGuide() {
  const step = TUTORIAL_STEPS[tutorialStep];
  const target = document.querySelector(step.target);
  const spotlight = $('tutorialSpotlight');
  const guide = $('tutorialGuide');
  if (!target || !spotlight || !guide) return;
  target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
  requestAnimationFrame(() => {
    const rect = target.getBoundingClientRect();
    const pad = 6;
    spotlight.style.display = 'block';
    spotlight.style.left = `${Math.max(6, rect.left - pad)}px`;
    spotlight.style.top = `${Math.max(6, rect.top - pad)}px`;
    spotlight.style.width = `${Math.min(window.innerWidth - 12, rect.width + pad * 2)}px`;
    spotlight.style.height = `${Math.min(window.innerHeight - 12, rect.height + pad * 2)}px`;
    const guideRect = guide.getBoundingClientRect();
    let left = rect.left + (rect.width - guideRect.width) / 2;
    left = Math.max(12, Math.min(window.innerWidth - guideRect.width - 12, left));
    const below = rect.bottom + 18;
    const above = rect.top - guideRect.height - 18;
    const top = below + guideRect.height <= window.innerHeight - 12 ? below : Math.max(12, above);
    guide.style.left = `${left}px`;
    guide.style.top = `${top}px`;
  });
}
function renderTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialStep];
  $('tutorialStepTitle').textContent = step.title;
  $('tutorialStepText').textContent = step.text;
  $('tutorialProgress').textContent = `${tutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
  $('tutorialPrev').disabled = tutorialStep === 0;
  $('tutorialNext').textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Завершить' : 'Далее';
  prepareTutorialScreen(step.screen);
  requestAnimationFrame(positionTutorialGuide);
}
function openTutorial() {
  if (!tutorialPreviewActive) snapshotTutorialState();
  tutorialStep = 0;
  openMenuModal('tutorialModal');
  renderTutorialStep();
}
function finishTutorial() {
  localStorage.setItem('pcBuilder_tutorial_seen', '1');
  $('tutorialSpotlight').style.display = 'none';
  closeMenuModal('tutorialModal');
}

function openMenuModal(id) {
  const modal = $(id);
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeMenuModal(id) {
  const modal = $(id);
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  if (id === 'achievementsModal') updateAchievementMenuButton();
  if (id === 'tutorialModal') {
    $('tutorialSpotlight').style.display = 'none';
    restoreTutorialState();
    localStorage.setItem('pcBuilder_tutorial_seen', '1');
  }
}
function closeAllMenuModals() {
  ['infoModal', 'settingsModal', 'achievementsModal', 'updateLogModal', 'tutorialModal'].forEach(closeMenuModal);
  closePurchaseCouponModal();
  closeCouponReceivedModal();
  closeHardcoreConfirm();
}


function openHardcoreConfirm() {
  const modal = $('hardcoreConfirmModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeHardcoreConfirm() {
  const modal = $('hardcoreConfirmModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}
function requestModeStart(mode) {
  if (mode === 'hardcore') {
    openHardcoreConfirm();
    return;
  }
  start(mode);
}

$('diagnosticCloseBtn')?.addEventListener('click', closeDiagnostic);

$('tutorialBtn').addEventListener('click', openTutorial);
$('tutorialSkipBtn').addEventListener('click', finishTutorial);
$('tutorialPrev').addEventListener('click', () => { if (tutorialStep > 0) { tutorialStep -= 1; renderTutorialStep(); } });
$('tutorialNext').addEventListener('click', () => { if (tutorialStep < TUTORIAL_STEPS.length - 1) { tutorialStep += 1; renderTutorialStep(); } else finishTutorial(); });

$('startGameBtn').addEventListener('click', showModeScreen);
$('loadGameBtn').addEventListener('click', openLoadModal);
$('continueBtn').addEventListener('click', () => { if (state) render(); });
$('backToMenuBtn').addEventListener('click', showMainMenu);
$('infoBtn').addEventListener('click', openInfo);
$('settingsBtn').addEventListener('click', () => openMenuModal('settingsModal'));
$('achievementsBtn').addEventListener('click', openAchievements);
$('updateLogBtn').addEventListener('click', () => { $('updateLogContent').textContent = UPDATE_LOG; openMenuModal('updateLogModal'); });
document.querySelectorAll('[data-close-menu-modal]').forEach((el) => el.addEventListener('click', () => {
  const value = el.dataset.closeMenuModal;
  closeMenuModal(value === 'log' ? 'updateLogModal' : `${value}Modal`);
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeAllMenuModals(); closeDiagnostic(); closeShop(); pendingResetAfterSave = false; closeSaveModal(); closeResetConfirm(); closeHardcoreConfirm(); closePurchaseCouponModal(); closeCouponReceivedModal(); }
});
$('animationsToggle').addEventListener('change', saveSettings);
document.querySelectorAll('input[name="theme"]').forEach((input) => input.addEventListener('change', saveSettings));
$('fullscreenBtn').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    // Browser blocked fullscreen or local file does not allow it.
  }
});

document.addEventListener('fullscreenchange', () => {
  const btn = $('fullscreenBtn');
  if (btn) btn.textContent = document.fullscreenElement ? '⛶ Выйти из полноэкранного режима' : '⛶ Полноэкранный режим';
});

$('miniGamesTab').addEventListener('click', () => setEarnTab('games'));
$('afkTab').addEventListener('click', () => setEarnTab('afk'));
$('aiTab').addEventListener('click', () => setEarnTab('ai'));
document.querySelectorAll('[data-afk-mode]').forEach((btn) => btn.addEventListener('click', () => {
  afkMode = btn.dataset.afkMode === 'overclock' ? 'overclock' : 'normal';
  stopAfk();
  document.querySelectorAll('[data-afk-mode]').forEach((b) => b.classList.toggle('active', b === btn));
  renderAfkPanel();
}));

$('openShopBtn').addEventListener('click', openCatalog);
$('closeShopBtn').addEventListener('click', closeShop);
document.querySelectorAll('[data-close-shop]').forEach((el) => el.addEventListener('click', closeShop));
$('saveBtn').addEventListener('click', openSaveModal);
document.querySelectorAll('[data-close-save]').forEach((el) => el.addEventListener('click', () => { pendingResetAfterSave = false; closeSaveModal(); }));
$('resetBtn').addEventListener('click', openResetConfirm);
$('saveBeforeResetBtn').addEventListener('click', () => { pendingResetAfterSave = true; closeResetConfirm(); openSaveModal(); });
$('resetWithoutSaveBtn').addEventListener('click', () => { pendingResetAfterSave = false; resetGameNow(); });
$('cancelResetBtn').addEventListener('click', closeResetConfirm);
document.querySelectorAll('[data-mode]').forEach((btn) => btn.addEventListener('click', () => requestModeStart(btn.dataset.mode)));
$('hardcoreConfirmYes').addEventListener('click', () => { closeHardcoreConfirm(); start('hardcore'); });
$('hardcoreConfirmNo').addEventListener('click', closeHardcoreConfirm);
$('purchaseCouponUseBtn').addEventListener('click', () => { if (pendingPurchaseItemId) purchaseItem(pendingPurchaseItemId, true); });
$('purchaseCouponNoBtn').addEventListener('click', () => { if (pendingPurchaseItemId) purchaseItem(pendingPurchaseItemId, false); });
$('purchaseCouponCancelBtn').addEventListener('click', closePurchaseCouponModal);
$('couponReceivedOkBtn').addEventListener('click', closeCouponReceivedModal);

loadSettings();
let previous = load();
if (!previous) {
  const legacyKeys = ['pcBuilder_v05', 'pcBuilder_v04', 'pcBuilder_v03'];
  for (const key of legacyKeys) {
    try {
      const raw = localStorage.getItem(key); if (raw) { previous = JSON.parse(raw); break; }
    } catch { /* ignore */ }
  }
}
if (previous && MODE_CONFIG[previous.mode]) {
  if (previous.installed && previous.owned) {
    state = previous; ensureMarket(); state.power = currentPower(); save();
  } else {
    migrateState(previous);
  }
}
if (state) { normalisePsuIds(); if (!state.broken) state.broken = {}; if (!state.achievements) state.achievements = {}; normaliseInstalledForAchievements(); normaliseAfkComponents(); checkAchievements(); updateAchievementMenuButton(); save(); }
showMainMenu();
updateAchievementMenuButton();
setInterval(() => {
  if (!state) return;
  const refreshed = ensureMarket();
  if (refreshed) {
    renderMarketEventBanner();
    if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  } else {
    updateShopRefreshTimer();
  }
}, 1000);
if (!localStorage.getItem('pcBuilder_tutorial_seen')) {
  openTutorial();
}

window.addEventListener('resize', () => { if (!$('tutorialModal').classList.contains('hidden')) positionTutorialGuide(); });
window.addEventListener('scroll', () => { if (!$('tutorialModal').classList.contains('hidden')) positionTutorialGuide(); }, true);
