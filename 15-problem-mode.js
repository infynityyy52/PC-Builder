/* ===== v2.0.15 — Problem Mode ===== */

let problemSession = null;

const PROBLEM_CATEGORIES = ['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'PSU', 'Cooling', 'Case', 'OS'];

/*
 * Problem Mode deliberately separates "game compatibility" from "forensic metadata".
 * A case is built from a known-clean base and then receives only the intended faults.
 * This keeps every puzzle fair: there are no accidental extra errors hidden in the build.
 */
const PROBLEM_CASE_META = {
  gpuLengthMm: {
    'gpu-rtx-2060': 229, 'gpu-rtx-2070': 267, 'gpu-rtx-3060': 242, 'gpu-rtx-4060': 244,
    'gpu-rtx-4070': 244, 'gpu-rtx-4070s': 244, 'gpu-rtx-4080s': 304, 'gpu-rtx-4090': 304,
    'gpu-rtx-5090': 304, 'gpu-rx-6600': 190, 'gpu-rx-6700xt': 267, 'gpu-rx-7800xt': 267,
    'gpu-rx-7900xt': 276, 'gpu-rx-7900xtx': 287, 'gpu-arc-a580': 270, 'gpu-arc-a750': 280, 'gpu-arc-b580': 272
  },
  caseGpuClearanceMm: {
    'case-case-office': 280, 'case-case-basic': 300, 'case-case-airflow': 330, 'case-case-mesh': 340,
    'case-case-glass': 350, 'case-case-dual-chamber': 400, 'case-case-showcase': 420
  },
  coolerHeightMm: {
    'cooling-cooler-stock': 55, 'cooling-cooler-basic': 120, 'cooling-cooler-tower': 155,
    'cooling-cooler-dual-tower': 160, 'cooling-cooler-premium-air': 165
  },
  caseCoolerClearanceMm: {
    'case-case-office': 125, 'case-case-basic': 145, 'case-case-airflow': 160, 'case-case-mesh': 165,
    'case-case-glass': 170, 'case-case-dual-chamber': 180, 'case-case-showcase': 190
  }
};

const PROBLEM_GPU_META = {
  'gpu-gt-610': { gddr: 'DDR3', vramGb: 1 }, 'gpu-gt-710': { gddr: 'DDR3', vramGb: 2 }, 'gpu-gt-730': { gddr: 'GDDR5', vramGb: 2 },
  'gpu-gt-1030': { gddr: 'GDDR5', vramGb: 2 }, 'gpu-gt-1630': { gddr: 'GDDR6', vramGb: 4 },
  'gpu-gtx-1050': { gddr: 'GDDR5', vramGb: 2 }, 'gpu-gtx-1050ti': { gddr: 'GDDR5', vramGb: 4 },
  'gpu-gtx-1060': { gddr: 'GDDR5', vramGb: 6 }, 'gpu-gtx-1070': { gddr: 'GDDR5', vramGb: 8 },
  'gpu-gtx-1080': { gddr: 'GDDR5X', vramGb: 8 }, 'gpu-gtx-1080ti': { gddr: 'GDDR5X', vramGb: 11 },
  'gpu-gtx-1650': { gddr: 'GDDR5', vramGb: 4 }, 'gpu-gtx-1660s': { gddr: 'GDDR6', vramGb: 6 },
  'gpu-rtx-2060': { gddr: 'GDDR6', vramGb: 6 }, 'gpu-rtx-2070': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rtx-3060': { gddr: 'GDDR6', vramGb: 12 }, 'gpu-rtx-4060': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rtx-4070': { gddr: 'GDDR6X', vramGb: 12 }, 'gpu-rtx-4070s': { gddr: 'GDDR6X', vramGb: 12 },
  'gpu-rtx-4080s': { gddr: 'GDDR6X', vramGb: 16 }, 'gpu-rtx-4090': { gddr: 'GDDR6X', vramGb: 24 },
  'gpu-rtx-5090': { gddr: 'GDDR7', vramGb: 32 },
  'gpu-rx-5500xt': { gddr: 'GDDR6', vramGb: 8 }, 'gpu-rx-6600': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rx-6700xt': { gddr: 'GDDR6', vramGb: 12 }, 'gpu-rx-7600': { gddr: 'GDDR6', vramGb: 8 },
  'gpu-rx-7700xt': { gddr: 'GDDR6', vramGb: 12 }, 'gpu-rx-7800xt': { gddr: 'GDDR6', vramGb: 16 },
  'gpu-rx-7900xt': { gddr: 'GDDR6', vramGb: 20 }, 'gpu-rx-7900xtx': { gddr: 'GDDR6', vramGb: 24 },
  'gpu-arc-a580': { gddr: 'GDDR6', vramGb: 8 }, 'gpu-arc-a750': { gddr: 'GDDR6', vramGb: 8 }, 'gpu-arc-b580': { gddr: 'GDDR6', vramGb: 12 }
};

// Form factors used by the forensic puzzles. These are intentionally explicit here so
// Problem Mode can show/check them without exposing the game's generic compatibility hints.
const PROBLEM_FORM_FACTOR_META = {
  motherboard: {
    'motherboard-mb-h410-basic': 'mATX',
    'motherboard-mb-b560': 'mATX',
    'motherboard-mb-b560-gaming': 'ATX',
    'motherboard-mb-b660': 'mATX',
    'motherboard-mb-b760': 'ATX',
    'motherboard-mb-b760-ddr4': 'ATX',
    'motherboard-mb-b760-wifi': 'ATX',
    'motherboard-mb-z690': 'ATX',
    'motherboard-mb-z790': 'ATX',
    'motherboard-mb-b860': 'ATX',
    'motherboard-mb-z890': 'ATX',
    'motherboard-mb-z790-256': 'E-ATX',
    'motherboard-mb-z890-256': 'E-ATX',
    'motherboard-mb-a320': 'mATX',
    'motherboard-mb-b450': 'mATX',
    'motherboard-mb-b550': 'ATX',
    'motherboard-mb-b550-wifi': 'ATX',
    'motherboard-mb-b650': 'ATX',
    'motherboard-mb-x670': 'ATX',
    'motherboard-mb-x870': 'ATX',
    'motherboard-mb-x870e-256': 'E-ATX'
  },
  caseSupports: {
    'case-case-office': ['Mini-ITX', 'mATX', 'ATX'],
    'case-case-basic': ['Mini-ITX', 'mATX', 'ATX'],
    'case-case-airflow': ['Mini-ITX', 'mATX', 'ATX'],
    'case-case-mesh': ['Mini-ITX', 'mATX', 'ATX'],
    'case-case-glass': ['Mini-ITX', 'mATX', 'ATX'],
    'case-case-dual-chamber': ['Mini-ITX', 'mATX', 'ATX', 'E-ATX'],
    'case-case-showcase': ['Mini-ITX', 'mATX', 'ATX', 'E-ATX']
  },
  psu: {
    'psu-450': 'ATX', 'psu-550-bronze': 'ATX', 'psu-650-bronze': 'ATX', 'psu-750-bronze': 'ATX',
    'psu-750-gold': 'ATX', 'psu-850-gold': 'ATX', 'psu-1000-gold': 'ATX', 'psu-300': 'ATX', 'psu-180': 'ATX'
  }
};

function problemClone(build) { return { ...build }; }
function problemMakeCase(name, build, selected, reasonRu, reasonEn, overrides = {}, kind = 'compatibility') {
  return { name, build: problemClone(build), selected: [...selected], reasonRu, reasonEn, overrides, kind };
}
function problemItemName(id) { return typeof itemById === 'function' ? (itemById(id)?.name || id) : id; }
function problemWith(build, changes) { return Object.assign(problemClone(build), changes); }
function problemRamCapacity(item) {
  if (typeof ramCapacityGb === 'function') return Number(ramCapacityGb(item)) || 0;
  const match = String(item?.name || '').match(/(\d+)\s*GB/i);
  return match ? Number(match[1]) : 0;
}
function problemActualPsuCert(id) {
  const item = problemItem(id);
  if (!item) return null;
  return item.psuCertificateLabel || (/80\+ Gold/i.test(item.series || '') ? '80+ Gold' : /80\+ Bronze/i.test(item.series || '') ? '80+ Bronze' : 'Нет сертификата');
}
function problemCaseBase(d, i = 0) {
  const pools = {
    1: [
      {CPU:'cpu-i5-12400f',Motherboard:'motherboard-mb-b660',RAM:'ram-ddr5-16',GPU:'gpu-rtx-4060',Storage:'storage-ssd-500-nvme',PSU:'psu-650-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-airflow',OS:'os-windows-11-home'},
      {CPU:'cpu-i5-13400f',Motherboard:'motherboard-mb-b760',RAM:'ram-ddr5-32',GPU:'gpu-rtx-3060',Storage:'storage-ssd-1tb-sata',PSU:'psu-750-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-mesh',OS:'os-windows-10-home'},
      {CPU:'cpu-r5-7600',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-32',GPU:'gpu-rx-7600',Storage:'storage-ssd-1tb-nvme',PSU:'psu-650-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-airflow',OS:'os-windows-11-home'},
      {CPU:'cpu-r7-7800x3d',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-32',GPU:'gpu-rtx-4070',Storage:'storage-ssd-2tb-nvme',PSU:'psu-750-bronze',Cooling:'cooling-cooler-aio-240',Case:'case-case-mesh',OS:'os-windows-11-home'},
      {CPU:'cpu-i7-12700k',Motherboard:'motherboard-mb-z690',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-nvme',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'}
    ],
    2: [
      {CPU:'cpu-r5-7600',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-32',GPU:'gpu-rx-7600',Storage:'storage-ssd-1tb-nvme',PSU:'psu-650-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-airflow',OS:'os-windows-11-home'},
      {CPU:'cpu-r7-7800x3d',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-32',GPU:'gpu-rtx-4070',Storage:'storage-ssd-2tb-nvme',PSU:'psu-750-bronze',Cooling:'cooling-cooler-aio-240',Case:'case-case-airflow',OS:'os-windows-11-home'},
      {CPU:'cpu-i7-12700k',Motherboard:'motherboard-mb-z690',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-nvme',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-i7-13700k',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4080s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-r7-9700x',Motherboard:'motherboard-mb-x870',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-240',Case:'case-case-glass',OS:'os-windows-11-pro'}
    ],
    3: [
      {CPU:'cpu-r7-7800x3d',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-nvme',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-i7-14700k',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4080s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-7950x',Motherboard:'motherboard-mb-x670',RAM:'ram-ddr5-96',GPU:'gpu-rx-7900xtx',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      {CPU:'cpu-i9-13900k',Motherboard:'motherboard-mb-z790-256',RAM:'ram-ddr5-128',GPU:'gpu-rtx-4090',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-9950x',Motherboard:'motherboard-mb-x870',RAM:'ram-ddr5-64',GPU:'gpu-rtx-5090',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'}
    ],
    4: [
      {CPU:'cpu-r7-7800x3d',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-nvme',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-i7-14700k',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4080s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-7950x',Motherboard:'motherboard-mb-x670',RAM:'ram-ddr5-96',GPU:'gpu-rx-7900xtx',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-9950x3d',Motherboard:'motherboard-mb-x870e-256',RAM:'ram-ddr5-128',GPU:'gpu-rtx-5090',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      {CPU:'cpu-i9-14900k',Motherboard:'motherboard-mb-z790-256',RAM:'ram-ddr5-128',GPU:'gpu-rtx-4090',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'}
    ],
    5: [
      {CPU:'cpu-r9-9950x3d',Motherboard:'motherboard-mb-x870e-256',RAM:'ram-ddr5-128',GPU:'gpu-rtx-5090',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      {CPU:'cpu-i9-14900k',Motherboard:'motherboard-mb-z790-256',RAM:'ram-ddr5-128',GPU:'gpu-rtx-4090',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-7950x',Motherboard:'motherboard-mb-x670',RAM:'ram-ddr5-96',GPU:'gpu-rx-7900xtx',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      {CPU:'cpu-i7-14700k',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4080s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-9950x',Motherboard:'motherboard-mb-x870',RAM:'ram-ddr5-128',GPU:'gpu-rtx-5090',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'}
    ]
  };
  return problemClone(pools[d][i % pools[d].length]);
}

const PROBLEM_CLEAN_BUILDS = [
  {"CPU":"cpu-i3-12100f","Motherboard":"motherboard-mb-b660","RAM":"ram-ddr5-16","GPU":"gpu-gt-1030","Storage":"storage-ssd-256-sata","PSU":"psu-450","Cooling":"cooling-cooler-basic","Case":"case-case-basic","OS":"os-windows-10-home"},
  {"CPU":"cpu-i3-12100f","Motherboard":"motherboard-mb-b660","RAM":"ram-ddr5-16","GPU":"gpu-rtx-3060","Storage":"storage-ssd-2tb-gen5","PSU":"psu-650-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-10-home"},
  {"CPU":"cpu-i3-12100f","Motherboard":"motherboard-mb-b660","RAM":"ram-ddr5-16","GPU":"gpu-rtx-4080s","Storage":"storage-ssd-2tb-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-pro"},
  {"CPU":"cpu-i5-12400f","Motherboard":"motherboard-mb-b660","RAM":"ram-ddr5-16","GPU":"gpu-rtx-2060","Storage":"storage-ssd-1tb-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-10-pro"},
  {"CPU":"cpu-i5-12400f","Motherboard":"motherboard-mb-b660","RAM":"ram-ddr5-16","GPU":"gpu-rtx-4070","Storage":"storage-ssd-1tb-sata","PSU":"psu-750-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-basic","OS":"os-windows-11-home"},
  {"CPU":"cpu-i5-13400f","Motherboard":"motherboard-mb-b760","RAM":"ram-ddr5-32","GPU":"gpu-gtx-1650","Storage":"storage-ssd-500-nvme","PSU":"psu-450","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-pro"},
  {"CPU":"cpu-i5-13400f","Motherboard":"motherboard-mb-b760","RAM":"ram-ddr5-32","GPU":"gpu-rtx-4060","Storage":"storage-ssd-256-sata","PSU":"psu-650-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-xp"},
  {"CPU":"cpu-i5-13400f","Motherboard":"motherboard-mb-b760","RAM":"ram-ddr5-32","GPU":"gpu-rtx-5090","Storage":"storage-ssd-256-sata","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-home"},
  {"CPU":"cpu-i5-14600k","Motherboard":"motherboard-mb-b760","RAM":"ram-ddr5-32","GPU":"gpu-rtx-3060","Storage":"storage-ssd-4tb-nvme","PSU":"psu-650-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-pro"},
  {"CPU":"cpu-i5-14600k","Motherboard":"motherboard-mb-b760","RAM":"ram-ddr5-32","GPU":"gpu-rtx-4080s","Storage":"storage-ssd-2tb-gen5","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-pro"},
  {"CPU":"cpu-i7-12700k","Motherboard":"motherboard-mb-z690","RAM":"ram-ddr5-64","GPU":"gpu-rtx-2060","Storage":"storage-ssd-2tb-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-home"},
  {"CPU":"cpu-i7-12700k","Motherboard":"motherboard-mb-z690","RAM":"ram-ddr5-64","GPU":"gpu-rtx-4070","Storage":"storage-ssd-1tb-nvme","PSU":"psu-750-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-basic","OS":"os-windows-11-pro"},
  {"CPU":"cpu-i7-13700k","Motherboard":"motherboard-mb-z790","RAM":"ram-ddr5-64","GPU":"gpu-gtx-1650","Storage":"storage-ssd-1tb-sata","PSU":"psu-450","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-xp"},
  {"CPU":"cpu-i7-13700k","Motherboard":"motherboard-mb-z790","RAM":"ram-ddr5-64","GPU":"gpu-rtx-4060","Storage":"storage-ssd-1tb-sata","PSU":"psu-650-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-home"},
  {"CPU":"cpu-i7-13700k","Motherboard":"motherboard-mb-z790","RAM":"ram-ddr5-64","GPU":"gpu-rtx-5090","Storage":"storage-ssd-500-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-home"},
  {"CPU":"cpu-i7-14700k","Motherboard":"motherboard-mb-z790","RAM":"ram-ddr5-64","GPU":"gpu-rx-6600","Storage":"storage-ssd-256-sata","PSU":"psu-550-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-pro"},
  {"CPU":"cpu-i7-14700k","Motherboard":"motherboard-mb-z790","RAM":"ram-ddr5-64","GPU":"gpu-rtx-4080s","Storage":"storage-ssd-4tb-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-11-home"},
  {"CPU":"cpu-i9-12900k","Motherboard":"motherboard-mb-z690","RAM":"ram-ddr5-64","GPU":"gpu-rtx-2060","Storage":"storage-ssd-2tb-gen5","PSU":"psu-550-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-11-pro"},
  {"CPU":"cpu-i9-12900k","Motherboard":"motherboard-mb-z690","RAM":"ram-ddr5-64","GPU":"gpu-rtx-4070","Storage":"storage-ssd-2tb-nvme","PSU":"psu-750-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-basic","OS":"os-windows-xp"},
  {"CPU":"cpu-i9-13900k","Motherboard":"motherboard-mb-z790-256","RAM":"ram-ddr5-128","GPU":"gpu-gtx-1650","Storage":"storage-ssd-2tb-nvme","PSU":"psu-450","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-10-home"},
  {"CPU":"cpu-i9-13900k","Motherboard":"motherboard-mb-z790-256","RAM":"ram-ddr5-128","GPU":"gpu-rtx-4060","Storage":"storage-ssd-1tb-nvme","PSU":"psu-650-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-10-home"},
  {"CPU":"cpu-i9-13900k","Motherboard":"motherboard-mb-z790-256","RAM":"ram-ddr5-128","GPU":"gpu-rtx-5090","Storage":"storage-ssd-1tb-sata","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-10-pro"},
  {"CPU":"cpu-i9-14900k","Motherboard":"motherboard-mb-z790-256","RAM":"ram-ddr5-128","GPU":"gpu-rx-6600","Storage":"storage-ssd-500-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-11-home"},
  {"CPU":"cpu-i9-14900k","Motherboard":"motherboard-mb-z790-256","RAM":"ram-ddr5-128","GPU":"gpu-rx-7900xtx","Storage":"storage-ssd-256-sata","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-11-pro"},
  {"CPU":"cpu-ultra5-245k","Motherboard":"motherboard-mb-z890","RAM":"ram-ddr5-32","GPU":"gpu-rtx-2060","Storage":"storage-ssd-4tb-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-xp"},
  {"CPU":"cpu-ultra5-245k","Motherboard":"motherboard-mb-z890","RAM":"ram-ddr5-32","GPU":"gpu-rtx-4070","Storage":"storage-ssd-2tb-gen5","PSU":"psu-750-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-basic","OS":"os-windows-xp"},
  {"CPU":"cpu-ultra7-265k","Motherboard":"motherboard-mb-z890","RAM":"ram-ddr5-64","GPU":"gpu-gtx-1650","Storage":"storage-ssd-2tb-gen5","PSU":"psu-450","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-home"},
  {"CPU":"cpu-ultra7-265k","Motherboard":"motherboard-mb-z890","RAM":"ram-ddr5-64","GPU":"gpu-rtx-4060","Storage":"storage-ssd-2tb-nvme","PSU":"psu-650-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-pro"},
  {"CPU":"cpu-ultra7-265k","Motherboard":"motherboard-mb-z890","RAM":"ram-ddr5-64","GPU":"gpu-rtx-5090","Storage":"storage-ssd-1tb-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-11-home"},
  {"CPU":"cpu-r3-3100","Motherboard":"motherboard-mb-a320","RAM":"ram-ddr4-16","GPU":"gpu-rx-6600","Storage":"storage-ssd-1tb-sata","PSU":"psu-550-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-pro"},
  {"CPU":"cpu-r3-3100","Motherboard":"motherboard-mb-a320","RAM":"ram-ddr4-16","GPU":"gpu-rx-7900xtx","Storage":"storage-ssd-500-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-420","Case":"case-case-basic","OS":"os-windows-11-pro"},
  {"CPU":"cpu-r5-3600","Motherboard":"motherboard-mb-b450","RAM":"ram-ddr4-32","GPU":"gpu-rtx-2070","Storage":"storage-ssd-256-sata","PSU":"psu-650-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-xp"},
  {"CPU":"cpu-r5-3600","Motherboard":"motherboard-mb-b450","RAM":"ram-ddr4-32","GPU":"gpu-rx-7900xt","Storage":"storage-ssd-256-sata","PSU":"psu-850-gold","Cooling":"cooling-cooler-aio-360","Case":"case-case-basic","OS":"os-windows-10-home"},
  {"CPU":"cpu-r7-5700x","Motherboard":"motherboard-mb-b550","RAM":"ram-ddr4-32","GPU":"gpu-gtx-1650","Storage":"storage-ssd-4tb-nvme","PSU":"psu-450","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-10-pro"},
  {"CPU":"cpu-r7-5700x","Motherboard":"motherboard-mb-b550","RAM":"ram-ddr4-32","GPU":"gpu-rtx-4060","Storage":"storage-ssd-2tb-gen5","PSU":"psu-650-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-home"},
  {"CPU":"cpu-r7-5700x","Motherboard":"motherboard-mb-b550","RAM":"ram-ddr4-32","GPU":"gpu-rtx-5090","Storage":"storage-ssd-2tb-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-11-pro"},
  {"CPU":"cpu-r5-7600","Motherboard":"motherboard-mb-b650","RAM":"ram-ddr5-32","GPU":"gpu-rx-6600","Storage":"storage-ssd-1tb-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-pro"},
  {"CPU":"cpu-r5-7600","Motherboard":"motherboard-mb-b650","RAM":"ram-ddr5-32","GPU":"gpu-rx-7900xtx","Storage":"storage-ssd-1tb-sata","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-420","Case":"case-case-basic","OS":"os-windows-xp"},
  {"CPU":"cpu-r7-7800x3d","Motherboard":"motherboard-mb-b650","RAM":"ram-ddr5-64","GPU":"gpu-rtx-2070","Storage":"storage-ssd-1tb-sata","PSU":"psu-650-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-10-home"},
  {"CPU":"cpu-r7-7800x3d","Motherboard":"motherboard-mb-b650","RAM":"ram-ddr5-64","GPU":"gpu-rx-7900xt","Storage":"storage-ssd-500-nvme","PSU":"psu-850-gold","Cooling":"cooling-cooler-aio-360","Case":"case-case-basic","OS":"os-windows-10-pro"},
  {"CPU":"cpu-r7-9700x","Motherboard":"motherboard-mb-x870","RAM":"ram-ddr5-64","GPU":"gpu-gtx-1660s","Storage":"storage-ssd-256-sata","PSU":"psu-550-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-home"},
  {"CPU":"cpu-r7-9700x","Motherboard":"motherboard-mb-x870","RAM":"ram-ddr5-64","GPU":"gpu-rtx-4060","Storage":"storage-ssd-4tb-nvme","PSU":"psu-650-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-11-home"},
  {"CPU":"cpu-r7-9700x","Motherboard":"motherboard-mb-x870","RAM":"ram-ddr5-64","GPU":"gpu-rtx-5090","Storage":"storage-ssd-2tb-gen5","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-11-pro"},
  {"CPU":"cpu-r9-7900x","Motherboard":"motherboard-mb-x670","RAM":"ram-ddr5-64","GPU":"gpu-rx-6600","Storage":"storage-ssd-2tb-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-tower","Case":"case-case-basic","OS":"os-windows-xp"},
  {"CPU":"cpu-r9-7900x","Motherboard":"motherboard-mb-x670","RAM":"ram-ddr5-64","GPU":"gpu-rx-7900xtx","Storage":"storage-ssd-2tb-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-420","Case":"case-case-basic","OS":"os-windows-10-home"},
  {"CPU":"cpu-r9-7950x","Motherboard":"motherboard-mb-x670","RAM":"ram-ddr5-96","GPU":"gpu-rtx-2070","Storage":"storage-ssd-1tb-nvme","PSU":"psu-650-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-airflow","OS":"os-windows-10-pro"},
  {"CPU":"cpu-r9-7950x","Motherboard":"motherboard-mb-x670","RAM":"ram-ddr5-96","GPU":"gpu-rx-7900xt","Storage":"storage-ssd-1tb-sata","PSU":"psu-850-gold","Cooling":"cooling-cooler-aio-360","Case":"case-case-basic","OS":"os-windows-11-home"},
  {"CPU":"cpu-r9-9950x3d","Motherboard":"motherboard-mb-x870e-256","RAM":"ram-ddr5-128","GPU":"gpu-gtx-1660s","Storage":"storage-ssd-500-nvme","PSU":"psu-550-bronze","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-11-home"},
  {"CPU":"cpu-r9-9950x3d","Motherboard":"motherboard-mb-x870e-256","RAM":"ram-ddr5-128","GPU":"gpu-rx-7800xt","Storage":"storage-ssd-256-sata","PSU":"psu-850-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-11-pro"},
  {"CPU":"cpu-r9-9950x3d","Motherboard":"motherboard-mb-x870e-256","RAM":"ram-ddr5-128","GPU":"gpu-rtx-5090","Storage":"storage-ssd-4tb-nvme","PSU":"psu-1000-gold","Cooling":"cooling-cooler-aio-240","Case":"case-case-showcase","OS":"os-windows-xp"}
];

function problemMakeCleanCase(d, index) {
  const balanceTricks = [
    {
      name: 'Чистая ловушка: мощный CPU + слабая GPU',
      build: {CPU:'cpu-i7-12700k',Motherboard:'motherboard-mb-z690',RAM:'ram-ddr5-64',GPU:'gpu-gt-1030',Storage:'storage-ssd-2tb-nvme',PSU:'psu-850-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-dual-chamber',OS:'os-windows-11-pro'},
      ru: 'Сборка полностью валидна. Процессор заметно мощнее видеокарты, поэтому в играх GPU станет узким местом, но боттлнек сам по себе не является ошибкой совместимости.',
      en: 'This build is fully valid. The CPU is much stronger than the GPU, so the GPU will bottleneck gaming, but a bottleneck by itself is not a compatibility error.'
    },
    {
      name: 'Чистая ловушка: i9 + встроенная графика',
      build: {CPU:'cpu-i9-14900k',Motherboard:'motherboard-mb-z790-256',RAM:'ram-ddr5-128',GPU:'starter-hard-gpu',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      ru: 'Сборка полностью валидна. У этого i9 есть встроенная графика, поэтому отдельная видеокарта здесь не обязательна. Слабое место такой системы — игровая производительность, а не совместимость.',
      en: 'This build is fully valid. This i9 has integrated graphics, so a discrete GPU is not required. The weakness is gaming performance, not hardware compatibility.'
    },
    {
      name: 'Чистая ловушка: Ryzen 9 + старая видеокарта',
      build: {CPU:'cpu-r9-9950x3d',Motherboard:'motherboard-mb-x870e-256',RAM:'ram-ddr5-128',GPU:'gpu-rtx-2060',Storage:'storage-ssd-4tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'},
      ru: 'Боттлнек здесь огромный, но сборка остаётся валидной. Узкое место по производительности не равно несовместимости деталей.',
      en: 'The bottleneck here is huge, but the build is still valid. A performance bottleneck is not the same thing as incompatible hardware.'
    }
  ];
  if (index < balanceTricks.length) {
    const trick = balanceTricks[index];
    return problemMakeCase(trick.name, problemClone(trick.build), [], trick.ru, trick.en, {}, 'clean-balance');
  }
  const build = problemClone(PROBLEM_CLEAN_BUILDS[(index - balanceTricks.length) % PROBLEM_CLEAN_BUILDS.length]);
  const suffix = index + 1;
  const special = d >= 4 && /os-windows-xp/i.test(build.OS || '');
  const ru = special
    ? 'Ничего не выбирай: сборка выглядит подозрительно из-за Windows XP, но сама по себе старая ОС не делает совместимую систему проблемной.'
    : 'В этой сборке специально нет ошибки. Ничего не выбирай.';
  const en = special
    ? 'Select nothing: the build looks suspicious because of Windows XP, but an old OS does not make an otherwise compatible build invalid.'
    : 'There is intentionally no problem in this build. Select nothing.';
  return problemMakeCase(`Clean build ${suffix}`, build, [], ru, en, {}, 'clean');
}

function problemAddFamily(out, d, familyIndex, makeCase) {
  for (let i = 0; i < 5; i++) out.push(makeCase(i));
}

function buildBasicProblemPool(d) {
  const out = [];
  const b = i => problemCaseBase(d, i);
  const n = problemItemName;
  const item = problemItem;

  // Families are intentionally different by difficulty. Level 1 stays concrete and readable;
  // level 2 introduces one hidden data point; level 3 mixes real-spec checks with multi-part checks.
  problemAddFamily(out,d,0,i=>{
    const base=b(i), mb=['motherboard-mb-b660','motherboard-mb-b760','motherboard-mb-b650','motherboard-mb-z790','motherboard-mb-x870'][i];
    const ram=['ram-ddr4-16','ram-ddr4-32','ram-ddr4-32','ram-ddr4-64','ram-ddr4-64'][i];
    const cpu=['cpu-i5-12400f','cpu-i5-13400f','cpu-r5-7600','cpu-i7-13700k','cpu-r7-9700x'][i];
    return problemMakeCase(`RAM mismatch ${i+1}`,problemWith(base,{CPU:cpu,Motherboard:mb,RAM:ram}),[mb,ram],`Поколение RAM не совпадает с платой. Сравни два компонента.`,`The RAM generation does not match the motherboard. Compare the two components.`);
  });

  problemAddFamily(out,d,1,i=>{
    const base=b(i), cpu=['cpu-i5-12400f','cpu-r5-7600','cpu-i3-12100f','cpu-r7-7800x3d','cpu-i5-12400f'][i];
    const mb=['motherboard-mb-b650','motherboard-mb-b760','motherboard-mb-b650','motherboard-mb-z790','motherboard-mb-a320'][i];
    const ram = i===4 ? 'ram-ddr4-32' : base.RAM;
    return problemMakeCase(`Socket mismatch ${i+1}`,problemWith(base,{CPU:cpu,Motherboard:mb,RAM:ram}),[cpu,mb],`Сокеты не совпадают: ${partPlatform(item(cpu))} и ${partPlatform(item(mb))}.`,`The sockets do not match: ${partPlatform(item(cpu))} and ${partPlatform(item(mb))}.`);
  });

  problemAddFamily(out,d,2,i=>{
    const base=b(i), gpu=['gpu-rtx-4090','gpu-rtx-5090','gpu-rtx-4080s','gpu-rx-7900xtx','gpu-rtx-4070s'][i];
    const psu=['psu-750-bronze','psu-850-gold','psu-650-bronze','psu-750-bronze','psu-550-bronze'][i];
    return problemMakeCase(`PSU wattage ${i+1}`,problemWith(base,{GPU:gpu,PSU:psu}),[gpu,psu],`БП слишком слаб для этой видеокарты. Сравни рекомендуемую мощность GPU и мощность БП.`,`The PSU is too weak for this GPU. Compare the GPU power recommendation with the PSU wattage.`);
  });

  problemAddFamily(out,d,3,i=>{
    const base=b(i), storage=['storage-hdd-64','storage-hdd-64','storage-hdd-64','storage-hdd-64','storage-hdd-64'][i];
    return problemMakeCase(`Storage trap ${i+1}`,problemWith(base,{Storage:storage}),[storage],`64 GB HDD слишком мал для этой современной ОС.`,`The 64 GB HDD is too small for this modern operating system.`);
  });

  problemAddFamily(out,d,4,i=>{
    const base=b(i), cpu=['cpu-i9-14900k','cpu-i7-13700k','cpu-r9-9950x3d','cpu-r9-7950x','cpu-i7-14700k'][i];
    const cool=['cooling-cooler-basic','cooling-cooler-tower','cooling-cooler-tower','cooling-cooler-basic','cooling-cooler-tower'][i];
    return problemMakeCase(`Cooling trap ${i+1}`,problemWith(base,{CPU:cpu,Cooling:cool}),[cpu,cool],`Охлаждение не справляется с процессором. Сравни тепловую нагрузку CPU и возможности кулера.`,`The cooler cannot handle the CPU. Compare the CPU heat load with the cooler's capacity.`);
  });

  if (d >= 3) problemAddFamily(out,d,5,i=>{
    const base=b(i), gpu=['gpu-rtx-4090','gpu-rtx-4070s','gpu-rx-7800xt','gpu-rtx-5090','gpu-rtx-4080s'][i];
    const caseId=['case-case-office','case-case-airflow','case-case-basic','case-case-basic','case-case-office'][i];
    const psu=['psu-1000-gold','psu-1000-gold','psu-850-gold','psu-1000-gold','psu-1000-gold'][i];
    return problemMakeCase(`Physical fit ${i+1}`,problemWith(base,{GPU:gpu,Case:caseId,PSU:psu}),[gpu,caseId],`Видеокарта физически не помещается в корпус. Проверь длину карты и внутреннее пространство корпуса.`,`The graphics card does not physically fit the case. Check the card length and the case's internal clearance.`,{},'physical');
  });

  problemAddFamily(out,d,6,i=>{
    const base=b(i);
    if (d <= 2) {
      const presets = [
        ['CPU', 'manufacturer', 'NovaForge Systems', 'tdp', 35, `У ${n(base.CPU)} в карточке указан выдуманный производитель NovaForge Systems и подозрительно низкий TDP 35 W. Само название модели настоящее — проверь мелкие данные.`, `The ${n(base.CPU)} card shows the fictional manufacturer NovaForge Systems and a suspiciously low 35 W TDP. The model name is real, so re-check the small details.`],
        ['GPU', 'manufacturer', 'QuantumByte Labs', 'gddr', 'GDDR7', `У ${n(base.GPU)} указан выдуманный производитель QuantumByte Labs и неправильный тип памяти GDDR7.`, `The ${n(base.GPU)} lists the fictional manufacturer QuantumByte Labs and the wrong GDDR7 memory type.`],
        ['Motherboard', 'manufacturer', 'OrionCore', 'releaseYear', 2011, `У ${n(base.Motherboard)} всё выглядит нормально, но в мелких данных появился выдуманный производитель OrionCore и год 2011.`, `The ${n(base.Motherboard)} looks normal, but its small metadata fields invent OrionCore as the manufacturer and claim a 2011 release.`],
        ['RAM', 'manufacturer', 'Vertex Memory Co.', 'capacityGb', 512, `У ${n(base.RAM)} внезапно указан объём 512 GB вместо реального. Производитель Vertex Memory Co. тоже выдуман.`, `The ${n(base.RAM)} suddenly claims 512 GB instead of its real capacity. Vertex Memory Co. is also fictional here.`],
        ['PSU', 'manufacturer', 'TitanPeak Power', 'certificateLabel', '80+ Titanium', `У ${n(base.PSU)} появился выдуманный производитель TitanPeak Power и подозрительный сертификат 80+ Titanium.`, `The ${n(base.PSU)} has a fictional TitanPeak Power manufacturer and a suspicious 80+ Titanium certificate.`]
      ];
      const [category, _label, fakeManufacturer, badKey, badValue, ru, en] = presets[i];
      const id = base[category];
      const overrides = {[id]:{manufacturer:fakeManufacturer,[badKey]:badValue}};
      return problemMakeCase(`Fake manufacturer ${i+1}`, base, [id], ru, en, overrides, 'metadata');
    }
    const gpu=['gpu-rtx-2070','gpu-rtx-4070','gpu-rx-7800xt','gpu-rtx-4090','gpu-rtx-5090'][i];
    const wrongGddr=['GDDR5','GDDR5','GDDR5X','GDDR7','GDDR6X'][i];
    const wrongVram=[16,8,8,12,24][i];
    const changes = { GPU: gpu, PSU: 'psu-1000-gold' };
    return problemMakeCase(`GPU forensic ${i+1}`,problemWith(base,changes),[gpu],`Название GPU правильное, но GDDR и/или VRAM в характеристиках подменены. Сравни реальные спецификации.`,`The GPU name is correct, but its GDDR and/or VRAM data is falsified. Compare the real specifications.`,{[gpu]:{gddr:wrongGddr,vramGb:wrongVram}},'metadata');
  });

  return out.slice(0,35);
}

function buildDeepAuditPool(d) {
  const out = [];
  const n = problemItemName;
  const b = i => problemCaseBase(d,i);
  const add = (name, build, selected, ru, en, overrides = {}, kind='metadata') => out.push(problemMakeCase(name,build,selected,ru,en,overrides,kind));

  // 1. Five certificate contradictions.
  const certClaims=['80+ Platinum','80+ Titanium','80+ Silver','80+ Bronze','80+ Platinum'];
  certClaims.forEach((claim,i)=>{
    const psu=b(i).PSU;
    add(`Forensic certificate ${i+1}`,b(i),[psu],
      `Карточка ${n(psu)} выглядит нормально, но внутри характеристик указан другой сертификат: ${claim}. Нужно заметить противоречие.`,
      `The ${n(psu)} card looks normal, but its detailed specifications show another certificate: ${claim}. Notice the contradiction.`,{[psu]:{certificateLabel:claim}},'metadata');
  });

  // 2. Five GPU forensic cases: only metadata is falsified, so no hidden compatibility error appears.
  const gpuTraps=[
    ['gpu-rtx-2070','GDDR5',16,2021],['gpu-rtx-4070','GDDR6',16,2020],['gpu-rx-7800xt','GDDR5X',8,2025],['gpu-rtx-4090','GDDR7',12,2024],['gpu-rtx-5090','GDDR6X',24,2022]
  ];
  gpuTraps.forEach(([gpu,gddr,vram,year],i)=>{
    const changes = { GPU: gpu, PSU: 'psu-1000-gold' };
    if (d === 3 && i === 3) changes.Storage = 'storage-ssd-2tb-gen5';
    if (d === 3 && i === 4) changes.Storage = 'storage-ssd-2tb-nvme';
    if (d === 4 && i === 3) changes.Storage = 'storage-ssd-4tb-nvme';
    add(`Forensic GPU ${i+1}`,problemWith(b(i+1),changes),[gpu],
      `${n(gpu)} по названию настоящий, но в характеристиках подменены GDDR, объём VRAM и год выпуска. Здесь уже хочется открыть поиск и перепроверить всё.`,
      `The ${n(gpu)} name is real, but its GDDR type, VRAM amount and release year are falsified. This is a case where checking the web is appropriate.`,{[gpu]:{gddr,vramGb:vram,releaseYear:year}},'metadata');
  });

  // 3. RAM capacity cases. No max-RAM text is shown in Problem Mode, so the player must look it up.
  const ramLimitBuilds = [
    ['cpu-i7-12700k','motherboard-mb-z690'],
    ['cpu-i7-14700k','motherboard-mb-z790'],
    ['cpu-r9-7950x','motherboard-mb-x670'],
    ['cpu-r9-9950x3d','motherboard-mb-x870'],
    ['cpu-i9-13900k','motherboard-mb-z790']
  ];
  ramLimitBuilds.forEach(([cpu,mb],i)=>{
    const base={CPU:cpu,Motherboard:mb,RAM:'ram-ddr5-256',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',Case:'case-case-showcase',OS:'os-windows-11-pro'};
    add(`RAM capacity forensic ${i+1}`,base,[mb,'ram-ddr5-256'],
      `Объём RAM здесь превышает возможности ${n(mb)}. Лимит специально не написан в игре — проверь модель платы самостоятельно.`,
      `The RAM capacity exceeds what ${n(mb)} can handle. The limit is intentionally not shown in-game — check the board model yourself.`,{},'compatibility');
  });

  // 4. Five physical traps, isolated so there are no CPU/RAM/PSU side-errors.
  const fit=[
    ['gpu-rtx-4090','case-case-office'],['gpu-rtx-5090','case-case-airflow'],['gpu-rtx-4080s','case-case-basic'],['gpu-rtx-4090','case-case-basic'],['gpu-rtx-5090','case-case-office']
  ];
  fit.forEach(([gpu,caseId],i)=>add(`Physical forensic ${i+1}`,problemWith(b(i+1),{GPU:gpu,Case:caseId,PSU:'psu-1000-gold'}),[gpu,caseId],
    `Видеокарта не помещается по длине. Открой реальные размеры модели и сравни их с корпусом.`,
    `The graphics card does not fit by length. Check the real model dimensions and compare them with the case.`,{},'physical'));

  // 5. Five cooler traps. The base CPU is chosen so the board and PSU remain valid.
  const cool=[
    ['cpu-i9-14900k','cooling-cooler-basic','motherboard-mb-z790-256'],
    ['cpu-i7-14700k','cooling-cooler-basic','motherboard-mb-z790'],
    ['cpu-r9-9950x3d','cooling-cooler-tower','motherboard-mb-x870e-256'],
    ['cpu-r9-7950x','cooling-cooler-basic','motherboard-mb-x670'],
    ['cpu-i7-13700k','cooling-cooler-basic','motherboard-mb-z790']
  ];
  cool.forEach(([cpu,cooler,mb],i)=>{
    const base={CPU:cpu,Motherboard:mb,RAM:'ram-ddr5-128',GPU:'gpu-rtx-4090',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:cooler,Case:'case-case-showcase',OS:'os-windows-11-pro'};
    add(`Cooling forensic ${i+1}`,base,[cpu,cooler],
      `Всё выглядит дорого и правильно, но охлаждение не вытягивает тепловую нагрузку CPU. Характеристики кулера придётся читать внимательно.`,
      `Everything looks expensive and correct, but the cooler cannot handle the CPU heat load. Read the cooler specifications carefully.`,{},'cooling');
  });

  // 6. Five manufacturer/date contradictions, metadata only.
  const fakeManufacturers=['ASRock','MSI','ASUS','GIGABYTE','Biostar'];
  const fakeYears=[2024,2024,2022,2022,2022];
  for (let i=0;i<5;i++) {
    const mb=b(i+2).Motherboard;
    const manufacturer=fakeManufacturers[i], year=fakeYears[i];
    add(`Board data forensic ${i+1}`,b(i+2),[mb],
      `В названии платы всё нормально, но технические данные лгут: производитель указан как ${manufacturer}, а год — ${year}.`,
      `The board name looks normal, but its metadata lies: manufacturer is shown as ${manufacturer}, and the year as ${year}.`,{[mb]:{manufacturer,releaseYear:year}},'metadata');
  }

  // 7. Form-factor traps: high-level cases require comparing board and case standards.
  const formCases = d === 4
    ? [
        {CPU:'cpu-i9-14900k',Motherboard:'motherboard-mb-z790-256',Case:'case-case-airflow'},
        {CPU:'cpu-ultra9-285k',Motherboard:'motherboard-mb-z890-256',Case:'case-case-mesh'},
        {CPU:'cpu-r9-9950x3d',Motherboard:'motherboard-mb-x870e-256',Case:'case-case-glass'},
        {CPU:'cpu-i9-13900k',Motherboard:'motherboard-mb-z790-256',Case:'case-case-office'}
      ]
    : [
        {CPU:'cpu-r9-9950x3d',Motherboard:'motherboard-mb-x870e-256',Case:'case-case-airflow'},
        {CPU:'cpu-ultra7-265k',Motherboard:'motherboard-mb-z890-256',Case:'case-case-basic'},
        {CPU:'cpu-i7-14700k',Motherboard:'motherboard-mb-z790-256',Case:'case-case-glass'},
        {CPU:'cpu-ultra9-285k',Motherboard:'motherboard-mb-z890-256',Case:'case-case-office'}
      ];
  formCases.forEach((partSet,i)=>{
    const build={...partSet,RAM:'ram-ddr5-128',GPU:'gpu-rtx-4080s',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-420',OS:'os-windows-11-pro'};
    add(`Form factor forensic ${i+1}`,build,[partSet.Motherboard,partSet.Case],
      `Материнская плата и корпус не совпадают по форм-фактору. Проверь размер платы и список форм-факторов, которые принимает корпус.`,
      `The motherboard and case do not match in form factor. Check the board size and the form factors supported by the case.`,{},'form-factor');
  });
  const fCpu='cpu-i5-12400f';
  const fBuild={CPU:fCpu,Motherboard:'motherboard-mb-z790',RAM:'ram-ddr5-128',GPU:'starter-hard-gpu',Storage:'storage-ssd-2tb-gen5',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-showcase',OS:'os-windows-11-pro'};
  add('Stealth F-suffix',fBuild,[fCpu,'starter-hard-gpu'],
    `${n(fCpu)} заканчивается на F. Такой процессор не имеет встроенной графики, поэтому «Встроенная графика» здесь не спасает ситуацию.`,
    `${n(fCpu)} ends in F. That CPU has no integrated graphics, so the “Integrated graphics” part cannot provide video output.`,{},'suffix');

  return out.slice(0,35);
}

function buildAdditionalProblemVariants(d) {
  const out=[];
  const n=problemItemName;
  const B=(i)=>problemCaseBase(d,i%5);
  const add=(name,build,selected,ru,en,overrides={},kind='compatibility')=>out.push(problemMakeCase(name,build,selected,ru,en,overrides,kind));
  const commonGpu=['gpu-rtx-2060','gpu-rtx-2070','gpu-rtx-3060','gpu-rtx-4060','gpu-rtx-4070','gpu-rx-6600','gpu-rx-7800xt','gpu-rtx-4090'];
  const commonCpu=['cpu-i5-12400f','cpu-i5-13400f','cpu-i7-12700k','cpu-r5-7600','cpu-r7-7800x3d','cpu-r9-7950x','cpu-i9-14900k','cpu-r9-9950x3d'];
  const boards=['motherboard-mb-b660','motherboard-mb-b760','motherboard-mb-z690','motherboard-mb-z790','motherboard-mb-b650','motherboard-mb-x670','motherboard-mb-x870','motherboard-mb-z790-256'];
  const rams=['ram-ddr4-16','ram-ddr4-32','ram-ddr4-64','ram-ddr5-16','ram-ddr5-32','ram-ddr5-64','ram-ddr5-128'];

  if(d<=2){
    const socketPairs=[
      ['cpu-r5-7600','motherboard-mb-z790'],['cpu-i5-12400f','motherboard-mb-b650'],['cpu-r9-7950x','motherboard-mb-z790'],['cpu-i7-13700k','motherboard-mb-b650'],['cpu-i9-14900k','motherboard-mb-x870']
    ];
    socketPairs.slice(0,5).forEach(([cpu,mb],i)=>{
      const base=B(i); add(`Additional socket trap ${i+1}`,{...base,CPU:cpu,Motherboard:mb},[cpu,mb],`Сокеты не совпадают. Названия похожи, но платформы разные: ${partPlatform(problemItem(cpu))} и ${partPlatform(problemItem(mb))}.`,`The sockets do not match. The names may look similar, but the platforms are different: ${partPlatform(problemItem(cpu))} and ${partPlatform(problemItem(mb))}.`);
    });
    const ramPairs=[
      ['motherboard-mb-b760','ram-ddr4-32'],['motherboard-mb-z790','ram-ddr4-64'],['motherboard-mb-b650','ram-ddr4-32'],['motherboard-mb-x670','ram-ddr4-64'],['motherboard-mb-x870','ram-ddr4-16']
    ];
    ramPairs.forEach(([mb,ram],i)=>{const base=B(i+1);add(`Additional RAM trap ${i+1}`,{...base,Motherboard:mb,RAM:ram},[mb,ram],`Поколение памяти не подходит к этой плате. Сравни тип DDR у обеих деталей.`,`The RAM generation does not match this motherboard. Compare the DDR type of both parts.`);});
    const fakeSpecs=[
      ['CPU','manufacturer','ByteCore'],['GPU','manufacturer','Quantum Foundry'],['Motherboard','releaseYear',2019],['RAM','capacityGb',256],['PSU','certificateLabel','80+ Platinum']
    ];
    fakeSpecs.forEach(([cat,key,val],i)=>{const base=B(i+2);const id=base[cat];add(`Additional fake-data trap ${i+1}`,base,[id],`Внешне всё выглядит правдоподобно, но мелкая характеристика ${key} подделана.`,`Everything looks plausible, but the small ${key} field is falsified.`,{[id]:{[key]:val}},'metadata');});
    return out;
  }

  if(d===3){
    const fitPairs=[['gpu-rtx-4090','case-case-office'],['gpu-rtx-5090','case-case-airflow'],['gpu-rx-7900xtx','case-case-basic'],['gpu-rtx-4080s','case-case-mesh'],['gpu-arc-a580','case-case-office']];
    fitPairs.forEach(([gpu,caseId],i)=>add(`Additional physical trap ${i+1}`,{...B(i),GPU:gpu,Case:caseId,PSU:'psu-1000-gold'},[gpu,caseId],`Проблема не в производительности: карта физически слишком длинная для этого корпуса.`,`This is not a performance problem: the GPU is physically too long for this case.`,{},'physical'));
    const gpuMeta=[['gpu-rtx-2060','GDDR5',2020],['gpu-rtx-3060','GDDR5',2021],['gpu-rtx-4070','GDDR6',2021],['gpu-rx-6600','GDDR5X',2020],['gpu-rtx-4090','GDDR7',2023]];
    gpuMeta.forEach(([gpu,gddr,year],i)=>add(`Additional GPU research ${i+1}`,{...B(i+1),GPU:gpu,PSU:'psu-1000-gold'},[gpu],`${n(gpu)} выглядит нормально, но в данных спрятаны неправильные GDDR и год выпуска.`,`The ${n(gpu)} looks normal, but its GDDR type and release year are falsified.`,{[gpu]:{gddr,releaseYear:year}},'metadata'));
    const storageOs=[['storage-hdd-64','os-windows-11-home'],['storage-hdd-64','os-windows-10-home'],['storage-hdd-64','os-macos'],['storage-hdd-64','os-windows-11-pro'],['storage-hdd-64','os-windows-10-pro']];
    storageOs.forEach(([storage,os],i)=>add(`Additional storage trap ${i+1}`,{...B(i+2),Storage:storage,OS:os},[storage,os],`Накопитель не подходит под условия этой ОС/системы: проверь объём и тип накопителя, а не только название.`,`The storage choice is invalid for this OS/system setup. Check the drive capacity and type, not just the name.`));
    return out;
  }

  const certs=['80+ Platinum','80+ Titanium','80+ Silver','80+ Bronze','80+ Platinum'];
  certs.forEach((claim,i)=>{const base=B(i+2),psu=base.PSU;add(`Additional certificate forensic ${i+1}`,base,[psu],`На вид это обычный БП, но сертификат внутри характеристик подменён на ${claim}.`,`It looks like a normal PSU, but the certificate in its details is falsified as ${claim}.`,{[psu]:{certificateLabel:claim}},'metadata');});

  const meta=[
    ['gpu-rtx-2070','GDDR5',4,2019],['gpu-rtx-4070s','GDDR5X',8,2020],['gpu-rx-7800xt','GDDR5',16,2025],['gpu-rtx-4090','GDDR7',16,2023],['gpu-rtx-5090','GDDR6X',24,2022]
  ];
  meta.forEach(([gpu,gddr,vram,year],i)=>add(`Additional GPU forensic ${i+1}`,{...B(i+1),GPU:gpu,PSU:'psu-1000-gold'},[gpu],`${n(gpu)} настоящая, но GDDR, VRAM и год выпуска в описании намеренно искажены.`,`The ${n(gpu)} is real, but its GDDR, VRAM and release year are intentionally falsified.`,{[gpu]:{gddr,vramGb:vram,releaseYear:year}},'metadata'));

  const form=[
    ['motherboard-mb-z790-256','case-case-airflow'],['motherboard-mb-z890-256','case-case-glass'],['motherboard-mb-x870e-256','case-case-office'],['motherboard-mb-z790-256','case-case-basic'],['motherboard-mb-z890-256','case-case-mesh']
  ];
  form.forEach(([mb,caseId],i)=>add(`Additional form-factor forensic ${i+1}`,{...B(i+3),Motherboard:mb,Case:caseId},[mb,caseId],`Форм-фактор не сходится. Эта ошибка спрятана в характеристиках платы и корпуса.`,`The form factors do not match. The mismatch is hidden in the motherboard and case specifications.`,{},'form-factor'));

  return out;
}

function buildProblemVarietyFillers(d, needed) {
  const out=[];
  const B=(i)=>problemClone(PROBLEM_CLEAN_BUILDS[(i+7)%PROBLEM_CLEAN_BUILDS.length]);
  const n=problemItemName;
  const add=(name,build,selected,ru,en,overrides={},kind='compatibility')=>out.push(problemMakeCase(name,build,selected,ru,en,overrides,kind));
  const target=()=>out.length<needed;

  const socketPairs=[
    ['cpu-r5-7600','motherboard-mb-z790'],['cpu-i5-12400f','motherboard-mb-b650'],['cpu-i7-13700k','motherboard-mb-b650'],
    ['cpu-r9-7950x','motherboard-mb-z790'],['cpu-i9-14900k','motherboard-mb-x870'],['cpu-r7-9700x','motherboard-mb-z690'],
    ['cpu-i9-13900k','motherboard-mb-b650']
  ];
  socketPairs.forEach(([cpu,mb],i)=>{if(!target())return;const build={...B(i),CPU:cpu,Motherboard:mb,RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070',PSU:'psu-750-bronze',Cooling:'cooling-cooler-aio-240',Case:'case-case-airflow',Storage:'storage-ssd-1tb-nvme',OS:'os-windows-11-home'};add(`Generated socket variant ${i+1}`,build,[cpu,mb],`Сокет процессора и платформа материнской платы не совпадают.`,`The CPU socket and motherboard platform do not match.`);});

  const ramPairs=[
    ['motherboard-mb-b760','ram-ddr4-32'],['motherboard-mb-z790','ram-ddr4-64'],['motherboard-mb-b650','ram-ddr4-32'],
    ['motherboard-mb-x670','ram-ddr4-64'],['motherboard-mb-x870','ram-ddr4-16'],['motherboard-mb-z890','ram-ddr4-32'],['motherboard-mb-z790-256','ram-ddr4-128']
  ];
  ramPairs.forEach(([mb,ram],i)=>{if(!target())return;const cpu=/b650|x670|x870/i.test(mb)?'cpu-r7-7800x3d':'cpu-i7-12700k';const build={...B(i+3),CPU:cpu,Motherboard:mb,RAM:ram,GPU:'gpu-rtx-4060',PSU:'psu-650-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-airflow',Storage:'storage-ssd-1tb-nvme',OS:'os-windows-11-home'};add(`Generated RAM variant ${i+1}`,build,[mb,ram],`Поколение оперативной памяти не соответствует этой материнской плате.`,`The RAM generation does not match this motherboard.`);});

  const gpuPsu=[
    ['gpu-rtx-4090','psu-650-bronze'],['gpu-rtx-5090','psu-750-bronze'],['gpu-rtx-4080s','psu-650-bronze'],['gpu-rx-7900xtx','psu-750-bronze'],['gpu-rtx-4070s','psu-550-bronze'],['gpu-rx-7800xt','psu-550-bronze'],['gpu-rtx-4070','psu-450']
  ];
  gpuPsu.forEach(([gpu,psu],i)=>{if(!target())return;const base={...B(i+8),GPU:gpu,PSU:psu};base.CPU='cpu-r5-7600';base.Motherboard='motherboard-mb-b650';base.RAM='ram-ddr5-32';base.Cooling='cooling-cooler-tower';base.Case='case-case-showcase';base.Storage='storage-ssd-2tb-nvme';base.OS='os-windows-11-home';add(`Generated PSU variant ${i+1}`,base,[gpu,psu],`Блок питания слабее рекомендованного уровня для этой видеокарты.`,`The PSU is below the recommended level for this GPU.`);});

  const storagePairs=[['storage-hdd-64','os-windows-11-home'],['storage-hdd-64','os-windows-10-home'],['storage-hdd-64','os-macos'],['storage-hdd-64','os-windows-11-pro']];
  storagePairs.forEach(([storage,os],i)=>{if(!target())return;const base={...B(i+13),Storage:storage,OS:os,CPU:'cpu-i5-12400f',Motherboard:'motherboard-mb-b660',RAM:'ram-ddr5-16',GPU:'gpu-rtx-4060',PSU:'psu-650-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-airflow'};add(`Generated storage variant ${i+1}`,base,[storage,os],`Накопитель слишком мал для этой системы с выбранной ОС.`,`The storage drive is too small for this system with the selected OS.`);});

  if(d>=3){
    const physical=[['gpu-rtx-4090','case-case-office'],['gpu-rtx-5090','case-case-basic'],['gpu-rx-7900xtx','case-case-office'],['gpu-rtx-4080s','case-case-basic'],['gpu-rtx-4090','case-case-basic']];
    physical.forEach(([gpu,caseId],i)=>{if(!target())return;const base={...B(i+17),GPU:gpu,Case:caseId,CPU:'cpu-r5-7600',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr5-32',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-240',Storage:'storage-ssd-2tb-nvme',OS:'os-windows-11-home'};add(`Generated physical variant ${i+1}`,base,[gpu,caseId],`Видеокарта физически не помещается в этот корпус по длине.`,`The GPU does not physically fit in this case by length.`,{},'physical');});
  }

  if(d>=4){
    const forms=[['motherboard-mb-z790-256','case-case-airflow'],['motherboard-mb-z890-256','case-case-glass'],['motherboard-mb-x870e-256','case-case-office'],['motherboard-mb-z790-256','case-case-basic'],['motherboard-mb-z890-256','case-case-mesh']];
    forms.forEach(([mb,caseId],i)=>{if(!target())return;const cpu=/x870/i.test(mb)?'cpu-r9-9950x3d':/z890/i.test(mb)?'cpu-ultra7-265k':'cpu-i7-14700k';const base={CPU:cpu,Motherboard:mb,RAM:'ram-ddr5-128',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:caseId,OS:'os-windows-11-pro'};add(`Generated form-factor variant ${i+1}`,base,[mb,caseId],`Форм-факторы платы и корпуса не совпадают.`,`The motherboard and case form factors do not match.`,{},'form-factor');});
  }

  // Metadata traps are used across all difficulties so players cannot memorize only compatibility formulas.
  const metadata=[
    ['CPU','tdp',35,'Скрытый TDP процессора подделан.'],
    ['GPU','gddr','GDDR5','Тип памяти GPU подделан.'],
    ['GPU','vramGb',4,'Объём видеопамяти подделан.'],
    ['Motherboard','releaseYear',2018,'Год выпуска платы подделан.'],
    ['RAM','capacityGb',256,'Объём RAM в характеристиках подделан.'],
    ['PSU','certificateLabel','80+ Titanium','Сертификат БП в характеристиках подделан.'],
    ['CPU','manufacturer','Northstar Computing','Производитель процессора выдуман.']
  ];
  metadata.forEach(([cat,key,val,ruText],i)=>{if(!target())return;const base=B(i+22);const id=base[cat];add(`Generated metadata variant ${i+1}`,base,[id],ruText,`The ${key} field is falsified.`,{[id]:{[key]:val}},'metadata');});
  return out;
}

function buildProblemPool(d) {
  const base = d >= 4 ? buildDeepAuditPool(d) : buildBasicProblemPool(d);
  const variants = buildAdditionalProblemVariants(d);
  const combined = [...base, ...variants];
  if (combined.length < 70) combined.push(...buildProblemVarietyFillers(d, 70-combined.length));
  return combined;
}

function problemBuildHasOnlyExpectedCompat(caseData) {
  // Metadata, suffix and balance puzzles deliberately bypass the normal compatibility engine.
  if (caseData.kind === 'metadata' || caseData.kind === 'balance' || caseData.kind === 'suffix' || caseData.kind === 'clean' || caseData.kind === 'clean-balance') return true;
  const build = caseData.build;
  const cpu=problemItem(build.CPU), mb=problemItem(build.Motherboard), ram=problemItem(build.RAM), gpu=problemItem(build.GPU), psu=problemItem(build.PSU), cooling=problemItem(build.Cooling), storage=problemItem(build.Storage), os=problemItem(build.OS);
  const issues=[];
  const ms=typeof motherboardSpec==='function'?motherboardSpec(mb):null;
  if(cpu && mb && partPlatform(cpu) && ms?.platform && partPlatform(cpu)!==ms.platform) issues.push('socket');
  if(cpu && ms?.maxCpuTdp && cpuTdp(cpu)>ms.maxCpuTdp) issues.push('cpu-tdp');
  if(ram && ms){ const expected=ms.ramType; if(expected && ramType(ram)!==expected) issues.push('ram-type'); else if(ms.maxRamGb && problemRamCapacity(ram)>ms.maxRamGb) issues.push('ram-capacity'); }
  if(gpu && psu && isDiscreteGpu(gpu) && numericWatts(psu)<gpuRecommendedPsu(gpu)) issues.push('psu');
  if(storage && os && /storage-hdd-64/i.test(storage.id) && /^(os-windows-10-home|os-windows-10-pro|os-windows-11-home|os-windows-11-pro|os-macos)$/i.test(os.id)) issues.push('storage');
  if(cpu && cooling && coolingCapacity(cooling)<cpuTdp(cpu)) issues.push('cooling');
  return issues.length === 0 || caseData.kind === 'compatibility';
}

function buildTieredCleanPool(d) {
  return Array.from({length:30},(_,i)=>problemMakeCleanCase(d,i));
}


/* ===== v2.0.15 — expanded fair puzzle generator =====
 * The old hand-authored pools are kept above as a source of ideas, but the active
 * pool below filters accidental side-errors and fills each difficulty to 100 real
 * problem cases + 50 clean cases. This makes exact memorisation much less useful.
 */
function problemEvaluateBuild(build) {
  const previousState = state;
  state = { mode: 'hard', installed: { ...build }, installedSource: {}, broken: {}, blackMarketBroken: {} };
  let issues = [];
  try { issues = typeof checkCompatibility === 'function' ? checkCompatibility() : []; }
  catch { issues = [{ fixCategory: 'EXCEPTION' }]; }
  state = previousState;
  return issues;
}
function problemExpectedIdsFromIssues(build, issues) {
  const out = new Set();
  for (const issue of issues) {
    switch (issue.fixCategory) {
      case 'CPU_OR_MB': out.add(build.CPU); out.add(build.Motherboard); break;
      case 'GPU_OR_PSU': out.add(build.GPU); out.add(build.PSU); break;
      case 'RAM':
      case 'RAM_CAPACITY': out.add(build.Motherboard); out.add(build.RAM); break;
      case 'Storage': out.add(build.Storage); out.add(build.OS); break;
      case 'Cooling': out.add(build.CPU); out.add(build.Cooling); break;
      default: break;
    }
  }
  return out;
}
function problemMetadataOverridesAreReal(caseData) {
  const overrides = caseData?.overrides || {};
  for (const [id, fields] of Object.entries(overrides)) {
    const item = problemItem(id);
    if (!item) return false;
    for (const [key, value] of Object.entries(fields || {})) {
      let actual = item[key];
      if (key === 'certificateLabel') actual = problemActualPsuCert(id);
      else if (key === 'tdp' && typeof cpuTdp === 'function') actual = cpuTdp(item);
      else if (key === 'gddr' || key === 'vramGb') actual = PROBLEM_GPU_META[id]?.[key] ?? item[key];
      else if (key === 'capacityGb' && typeof ramCapacityGb === 'function') actual = problemRamCapacity(item);
      else if (key === 'releaseYear') actual = item.releaseYear;
      else if (key === 'platform') actual = partPlatform(item);
      else if (key === 'ramType') actual = ramType(item);
      else if (key === 'formFactor') actual = PROBLEM_FORM_FACTOR_META.motherboard[id] || item[key];
      if (String(actual) === String(value)) return false;
    }
  }
  return true;
}
function problemFairCase(caseData, difficulty = 0) {
  const issues = problemEvaluateBuild(caseData.build);
  const kind = caseData.kind || 'compatibility';
  if (['clean','clean-balance'].includes(kind)) return issues.length === 0;
  if (['metadata','suffix'].includes(kind)) return issues.length === 0 && problemMetadataOverridesAreReal(caseData);
  if (kind === 'physical') return issues.length === 0 && !problemPhysicalFitOk(caseData.build);
  if (kind === 'form-factor') return issues.length === 0 && !problemFormFactorOk(caseData.build);
  const expected = problemExpectedIdsFromIssues(caseData.build, issues);
  if (difficulty >= 3 && !problemPhysicalFitOk(caseData.build)) { expected.add(caseData.build.GPU); expected.add(caseData.build.Case); }
  if (difficulty >= 4 && !problemFormFactorOk(caseData.build)) { expected.add(caseData.build.Motherboard); expected.add(caseData.build.Case); }
  const selected = new Set(caseData.selected || []);
  if (!issues.length && expected.size === 0) return false;
  if (expected.size !== selected.size) return false;
  for (const id of expected) if (!selected.has(id)) return false;
  return true;
}
function problemPhysicalFitOk(build) {
  const gpuLen = PROBLEM_CASE_META.gpuLengthMm[build.GPU];
  const caseClr = PROBLEM_CASE_META.caseGpuClearanceMm[build.Case];
  return !(gpuLen && caseClr && gpuLen > caseClr);
}
function problemFormFactorOk(build) {
  const mbFF = PROBLEM_FORM_FACTOR_META.motherboard[build.Motherboard];
  const supports = PROBLEM_FORM_FACTOR_META.caseSupports[build.Case] || [];
  return !mbFF || supports.includes(mbFF);
}
function problemCleanBuildFair(build) {
  return problemEvaluateBuild(build).length === 0 && problemPhysicalFitOk(build) && problemFormFactorOk(build);
}
function problemUniqueCaseKey(c) {
  return `${c.name}|${c.kind}|${(c.selected || []).slice().sort().join(',')}|${JSON.stringify(c.build)}|${JSON.stringify(c.overrides || {})}`;
}
function problemAddGenerated(out, seen, caseData, d) {
  if (!caseData || out.length >= 100) return;
  if (!problemFairCase(caseData, d)) return;
  if (d < 3 && (caseData.kind === 'physical' || caseData.kind === 'form-factor')) return;
  if (d < 4 && caseData.kind === 'form-factor') return;
  if (caseData.kind === 'suffix' && d !== 5) return;
  const key = problemUniqueCaseKey(caseData);
  if (seen.has(key)) return;
  seen.add(key); out.push(caseData);
}

function problemSafeForensicsBuild(index = 0) {
  const boards = SHOP.filter((item) => item.category === 'Motherboard' && !/^starter-/i.test(item.id));
  const board = boards[index % boards.length];
  const spec = motherboardSpec(board);
  if (!board || !spec) return problemClone(PROBLEM_CLEAN_BUILDS[index % PROBLEM_CLEAN_BUILDS.length]);
  const cpus = SHOP.filter((item) => item.category === 'CPU' && !/^starter-/i.test(item.id))
    .filter((item) => partPlatform(item) === spec.platform)
    .filter((item) => !spec.maxCpuTdp || cpuTdp(item) <= spec.maxCpuTdp);
  const rams = SHOP.filter((item) => item.category === 'RAM' && !/^starter-/i.test(item.id))
    .filter((item) => !spec.ramType || ramType(item) === spec.ramType)
    .filter((item) => !spec.maxRamGb || problemRamCapacity(item) <= spec.maxRamGb);
  const cpu = cpus[(index * 3) % Math.max(1, cpus.length)] || cpus[0];
  const ram = rams[(index * 5) % Math.max(1, rams.length)] || rams[0];
  return {
    CPU: cpu?.id || 'cpu-i5-12400f',
    Motherboard: board.id,
    RAM: ram?.id || 'ram-ddr5-16',
    GPU: 'gpu-rtx-4060',
    Storage: 'storage-ssd-2tb-nvme',
    PSU: 'psu-1000-gold',
    Cooling: 'cooling-cooler-aio-420',
    Case: 'case-case-showcase',
    OS: 'os-windows-11-pro'
  };
}

function problemFillExpandedPool(out, seen, d, target = 100) {
  if (out.length >= target) return;
  const add = (name, build, selected, ru, en, overrides = {}, kind = 'compatibility') => {
    if (out.length >= target) return;
    problemAddGenerated(out, seen, problemMakeCase(name, problemClone(build), selected, ru, en, overrides, kind), d);
  };
  const allCpus = SHOP.filter((item) => item.category === 'CPU' && !/^starter-/i.test(item.id));
  const allBoards = SHOP.filter((item) => item.category === 'Motherboard' && !/^starter-/i.test(item.id));
  const allRams = SHOP.filter((item) => item.category === 'RAM' && !/^starter-/i.test(item.id));
  const allGpus = SHOP.filter((item) => item.category === 'GPU' && isDiscreteGpu(item));
  const allOs = SHOP.filter((item) => item.category === 'OS' && /^os-/.test(item.id));
  const allPsus = SHOP.filter((item) => item.category === 'PSU' && !/^starter-/i.test(item.id));
  const allCoolers = SHOP.filter((item) => item.category === 'Cooling' && !/^starter-/i.test(item.id));
  const n = problemItemName;

  // 1) Socket traps: many different CPU/platform combinations, but no accidental TDP problem.
  let k = 0;
  for (const board of allBoards) {
    if (out.length >= target) break;
    const ms = motherboardSpec(board); if (!ms) continue;
    const candidates = allCpus.filter((cpu) => partPlatform(cpu) !== ms.platform && (!ms.maxCpuTdp || cpuTdp(cpu) <= ms.maxCpuTdp));
    for (const cpu of candidates.slice(0, 6)) {
      const build = problemSafeForensicsBuild(k++);
      build.Motherboard = board.id; build.CPU = cpu.id;
      const ramChoices = allRams.filter((ram) => ramType(ram) === ms.ramType && (!ms.maxRamGb || problemRamCapacity(ram) <= ms.maxRamGb));
      if (ramChoices[0]) build.RAM = ramChoices[(k + 1) % ramChoices.length].id;
      add(`Socket investigation ${out.length + 1}`, build, [cpu.id, board.id],
        'Сокет выглядит правдоподобно только на глаз. Сравни реальную платформу процессора и платы.',
        'The socket looks plausible at a glance. Compare the CPU and motherboard platforms.');
    }
  }

  // 2) CPU TDP traps: same socket, wrong thermal/power class for the motherboard.
  for (const board of allBoards) {
    if (out.length >= target) break;
    const ms = motherboardSpec(board); if (!ms?.maxCpuTdp) continue;
    const candidates = allCpus.filter((cpu) => partPlatform(cpu) === ms.platform && cpuTdp(cpu) > ms.maxCpuTdp);
    for (const cpu of candidates.slice(0, 5)) {
      const build = problemSafeForensicsBuild(k++);
      build.Motherboard = board.id; build.CPU = cpu.id;
      const ramChoices = allRams.filter((ram) => ramType(ram) === ms.ramType && (!ms.maxRamGb || problemRamCapacity(ram) <= ms.maxRamGb));
      if (ramChoices[0]) build.RAM = ramChoices[(k + 2) % ramChoices.length].id;
      add(`CPU power-class investigation ${out.length + 1}`, build, [cpu.id, board.id],
        'Сокет совпадает, но сама плата не рассчитана на такой класс процессора.',
        'The socket matches, but the motherboard is not suitable for this CPU power class.');
    }
  }

  // 3) RAM generation traps: many boards and both DDR generations.
  for (const board of allBoards) {
    if (out.length >= target) break;
    const ms = motherboardSpec(board); if (!ms?.ramType) continue;
    const wrong = allRams.filter((ram) => ramType(ram) && ramType(ram) !== ms.ramType);
    for (const ram of wrong.slice(0, 5)) {
      const build = problemSafeForensicsBuild(k++);
      build.Motherboard = board.id; build.RAM = ram.id;
      const cpuChoices = allCpus.filter((cpu) => partPlatform(cpu) === ms.platform && (!ms.maxCpuTdp || cpuTdp(cpu) <= ms.maxCpuTdp));
      if (cpuChoices[0]) build.CPU = cpuChoices[k % cpuChoices.length].id;
      add(`Memory generation investigation ${out.length + 1}`, build, [board.id, ram.id],
        'Поколение памяти не совпадает с платой. Названия легко перепутать, поэтому смотри характеристики.',
        'The memory generation does not match the motherboard. The names are easy to confuse, so check the specifications.');
    }
  }

  // 4) RAM capacity traps: use 256 GB modules only where the board genuinely tops out lower.
  for (const board of allBoards) {
    if (out.length >= target) break;
    const ms = motherboardSpec(board); if (!ms?.maxRamGb || ms.maxRamGb >= 256) continue;
    const ram = allRams.find((item) => problemRamCapacity(item) === 256 && ramType(item) === ms.ramType);
    if (!ram) continue;
    const build = problemSafeForensicsBuild(k++);
    build.Motherboard = board.id; build.RAM = ram.id;
    add(`Memory capacity investigation ${out.length + 1}`, build, [board.id, ram.id],
      'Объём памяти слишком большой для этой платы. Лимит специально не показываем — его надо проверить самому.',
      'The memory capacity is too high for this motherboard. The limit is deliberately hidden so you have to verify it yourself.');
  }

  // 5) PSU traps across many GPU generations and PSU wattages.
  for (const gpu of allGpus) {
    if (out.length >= target) break;
    const need = gpuRecommendedPsu(gpu);
    if (!need) continue;
    const weak = allPsus.filter((psu) => numericWatts(psu) < need).sort((a,b) => numericWatts(b) - numericWatts(a));
    for (const psu of weak.slice(0, 4)) {
      const build = problemSafeForensicsBuild(k++);
      build.GPU = gpu.id; build.PSU = psu.id;
      add(`PSU investigation ${out.length + 1}`, build, [gpu.id, psu.id],
        'Проверь рекомендованную мощность видеокарты и реальную мощность БП отдельно.',
        'Compare the GPU recommended PSU level with the PSU wattage separately.');
    }
  }

  // 6) Cooling traps over many CPU generations.
  for (const cpu of allCpus) {
    if (out.length >= target) break;
    const weak = allCoolers.filter((cooler) => coolingCapacity(cooler) < cpuTdp(cpu)).sort((a,b) => coolingCapacity(b) - coolingCapacity(a));
    for (const cooler of weak.slice(-3)) {
      const build = problemSafeForensicsBuild(k++);
      const cpuMs = allBoards.filter((board) => partPlatform(board) === partPlatform(cpu) && (!motherboardSpec(board)?.maxCpuTdp || cpuTdp(cpu) <= motherboardSpec(board).maxCpuTdp));
      const board = cpuMs[(k + 1) % Math.max(1, cpuMs.length)];
      if (!board) continue;
      build.CPU = cpu.id; build.Motherboard = board.id; build.Cooling = cooler.id;
      const ms = motherboardSpec(board);
      const r = allRams.filter((ram) => ramType(ram) === ms?.ramType && (!ms?.maxRamGb || problemRamCapacity(ram) <= ms.maxRamGb));
      if (r[0]) build.RAM = r[k % r.length].id;
      add(`Cooling investigation ${out.length + 1}`, build, [cpu.id, cooler.id],
        'Кулер может выглядеть нормальным, но его запас ниже тепловой нагрузки процессора.',
        'The cooler may look fine, but its thermal capacity is below the CPU heat load.');
    }
  }

  // 7) Storage/OS: same SSD/HDD trap with many OS variants.
  const storage = problemItem('storage-hdd-64');
  if (storage) {
    for (const os of allOs) {
      if (out.length >= target) break;
      if (!/windows-10|windows-11|macos/i.test(os.id)) continue;
      const build = problemSafeForensicsBuild(k++);
      build.Storage = storage.id; build.OS = os.id;
      add(`Storage investigation ${out.length + 1}`, build, [storage.id, os.id],
        'Накопитель слишком мал для этой ОС. Само название HDD/SSD ещё ничего не гарантирует.',
        'The drive is too small for this OS. The HDD/SSD label alone does not guarantee compatibility.');
    }
  }

  // 8) Metadata forensics: GDDR, VRAM, years, TDP, RAM capacity and PSU certificates.
  const metaTargets = [];
  allGpus.slice(0, 15).forEach((item) => {
    const gpuMeta = PROBLEM_GPU_META[item.id];
    if (gpuMeta?.gddr) metaTargets.push([item.id, 'gddr', gpuMeta.gddr === 'GDDR6' ? 'GDDR5' : 'GDDR6']);
    if (gpuMeta?.vramGb) metaTargets.push([item.id, 'vramGb', gpuMeta.vramGb + 4]);
    if (item.releaseYear) metaTargets.push([item.id, 'releaseYear', item.releaseYear - 2]);
  });
  allCpus.slice(0, 12).forEach((item) => {
    if (item.releaseYear) metaTargets.push([item.id, 'releaseYear', item.releaseYear + 1]);
    metaTargets.push([item.id, 'tdp', cpuTdp(item) + 25]);
  });
  allBoards.slice(0, 10).forEach((item) => { if (item.releaseYear) metaTargets.push([item.id, 'releaseYear', item.releaseYear - 1]); });
  allRams.slice(0, 8).forEach((item) => metaTargets.push([item.id, 'capacityGb', problemRamCapacity(item) + 16]));
  allPsus.filter((item) => numericWatts(item) >= 450).slice(0, 8).forEach((item) => metaTargets.push([item.id, 'certificateLabel', '80+ Titanium']));
  for (let i = 0; i < metaTargets.length && out.length < target; i++) {
    const [id, key, value] = metaTargets[i];
    const item = problemItem(id); if (!item) continue;
    const build = problemSafeForensicsBuild(k++); build[item.category] = id;
    add(`Specification investigation ${out.length + 1}`, build, [id],
      `Модель настоящая, но характеристика «${key}» подделана. Проверь реальную спецификацию.`,
      `The model is real, but the “${key}” specification is falsified. Verify the real specification.`,
      {[id]: {[key]: value}}, 'metadata');
  }

  // 9) Fake manufacturers only on levels 1–2: easy to understand, but not instantly obvious.
  if (d <= 2) {
    const fakeNames = ['Northstar Computing','Quantum Foundry','OrionCore','Vertex Memory Co.','TitanPeak Power','Silver Circuit Labs','Apex Logic'];
    const targets = [...allCpus.slice(0,5), ...allGpus.slice(0,5), ...allBoards.slice(0,4), ...allRams.slice(0,4), ...allPsus.slice(0,4)];
    targets.forEach((item, i) => {
      if (out.length >= target) return;
      const build = problemSafeForensicsBuild(k++); build[item.category] = item.id;
      add(`Fake company investigation ${out.length + 1}`, build, [item.id],
        `Модель настоящая, но производитель в характеристиках выдуман: ${fakeNames[i % fakeNames.length]}.`,
        `The model is real, but the manufacturer shown in the details is fictional: ${fakeNames[i % fakeNames.length]}.`,
        {[item.id]: {manufacturer: fakeNames[i % fakeNames.length]}}, 'metadata');
    });
  }

  // 10) From difficulty 3: physical dimensions. Use only physically safe builds otherwise.
  if (d >= 3) {
    const physicalCases = ['case-case-office','case-case-basic','case-case-airflow','case-case-mesh'];
    for (const gpu of allGpus) {
      if (out.length >= target) break;
      const len = PROBLEM_CASE_META.gpuLengthMm[gpu.id]; if (!len) continue;
      const caseId = physicalCases.find((id) => (PROBLEM_CASE_META.caseGpuClearanceMm[id] || 999) < len);
      if (!caseId) continue;
      const build = problemSafeForensicsBuild(k++); build.GPU = gpu.id; build.Case = caseId;
      add(`Physical fit investigation ${out.length + 1}`, build, [gpu.id, caseId],
        'Видеокарта не помещается по длине. Здесь уже недостаточно просто знать её мощность.',
        'The GPU does not fit by length. Performance alone is not enough here.', {}, 'physical');
    }
  }

  // 11) From difficulty 4: form-factor traps.
  if (d >= 4) {
    const eAtx = allBoards.filter((board) => PROBLEM_FORM_FACTOR_META.motherboard[board.id] === 'E-ATX');
    const unsupportedCases = ['case-case-office','case-case-basic','case-case-airflow','case-case-mesh','case-case-glass'];
    eAtx.forEach((board, i) => {
      if (out.length >= target) return;
      const caseId = unsupportedCases.find((id) => !(PROBLEM_FORM_FACTOR_META.caseSupports[id] || []).includes('E-ATX'));
      if (!caseId) return;
      const build = problemSafeForensicsBuild(k++); build.Motherboard = board.id; build.Case = caseId;
      const ms = motherboardSpec(board);
      const cpu = allCpus.find((item) => partPlatform(item) === ms?.platform && (!ms?.maxCpuTdp || cpuTdp(item) <= ms.maxCpuTdp));
      if (cpu) build.CPU = cpu.id;
      const ram = allRams.find((item) => ramType(item) === ms?.ramType && (!ms?.maxRamGb || problemRamCapacity(item) <= ms.maxRamGb));
      if (ram) build.RAM = ram.id;
      add(`Form-factor investigation ${out.length + 1}`, build, [board.id, caseId],
        'Ошибка спрятана в форм-факторе. Эти стандарты нужно сопоставить отдельно.',
        'The trap is hidden in the form factor. Compare the supported standards separately.', {}, 'form-factor');
    });
  }

  // 12) Composite investigations from difficulty 3 upward: several independent faults at once.
  if (d >= 3) {
    for (let i = 0; i < 60 && out.length < target; i++) {
      const base = problemSafeForensicsBuild(i + 80);
      const boards = allBoards.filter((board) => motherboardSpec(board));
      const board = boards[i % boards.length];
      const ms = motherboardSpec(board); if (!ms) continue;
      const badCpu = allCpus.find((cpu) => partPlatform(cpu) !== ms.platform && (!ms.maxCpuTdp || cpuTdp(cpu) <= ms.maxCpuTdp));
      const badRam = allRams.find((ram) => ramType(ram) && ramType(ram) !== ms.ramType);
      const gpu = allGpus[(i * 2) % Math.max(1, allGpus.length)];
      const psu = allPsus.find((item) => numericWatts(item) < gpuRecommendedPsu(gpu));
      const cooler = allCoolers.find((item) => coolingCapacity(item) < (badCpu ? cpuTdp(badCpu) : 150));
      const mods = [
        {CPU: badCpu?.id},
        {RAM: badRam?.id},
        {GPU: gpu?.id, PSU: psu?.id},
        {Cooling: cooler?.id}
      ].filter((m) => Object.values(m).every(Boolean));
      const one = mods[i % mods.length], two = mods[(i + 1) % mods.length];
      const build = {...base, ...one, ...two};
      if (i % 3 === 0 && badRam) build.RAM = badRam.id;
      if (i % 4 === 0 && badCpu) build.CPU = badCpu.id;
      const issues = problemEvaluateBuild(build);
      if (issues.length < 2) continue;
      const selected = [...problemExpectedIdsFromIssues(build, issues)];
      add(`Composite forensic investigation ${out.length + 1}`, build, selected,
        'Здесь несколько независимых проблем. Нужно проверить всю сборку, а не остановиться на первой найденной.',
        'This build contains several independent problems. Inspect the whole build instead of stopping at the first issue.');
    }
  }

  // 13) More metadata permutations guarantee the target is reached without repeating compatibility puzzles.
  const fraudFields = ['gddr','vramGb','releaseYear'];
  let fraudRound = 0;
  while (out.length < target && fraudRound < 30) {
    const gpu = allGpus[fraudRound % Math.max(1, allGpus.length)];
    const gm = PROBLEM_GPU_META[gpu?.id]; if (!gpu || !gm) { fraudRound++; continue; }
    const key = fraudFields[fraudRound % fraudFields.length];
    let value = gm[key];
    if (value == null) { fraudRound++; continue; }
    if (key === 'gddr') value = value === 'GDDR5' ? 'GDDR6' : 'GDDR5';
    if (key === 'vramGb') value = Number(value) + 2;
    if (key === 'releaseYear') value = Number(value) - 1;
    const build = problemSafeForensicsBuild(150 + fraudRound); build.GPU = gpu.id;
    add(`Deep specification investigation ${out.length + 1}`, build, [gpu.id],
      `У видеокарты подменена характеристика «${key}». Её нельзя определить только по названию модели.`,
      `The GPU's “${key}” specification is falsified. The model name alone is not enough to verify it.`,
      {[gpu.id]: {[key]: value}}, 'metadata');
    fraudRound++;
  }
}

function buildExpandedProblemPool(d) {
  const out = [], seen = new Set();
  const n = problemItemName;
  const safeBases = PROBLEM_CLEAN_BUILDS;
  const add = (name, build, selected, ru, en, overrides={}, kind='compatibility') => problemAddGenerated(out,seen,problemMakeCase(name,problemClone(build),selected,ru,en,overrides,kind),d);

  // Prioritise composite investigations so higher difficulties cannot collapse into one-error puzzles.
  if (d >= 3) {
    const priorityMulti=[
      {CPU:'cpu-i5-12400f',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr4-32',GPU:'gpu-rtx-4070',PSU:'psu-450',Cooling:'cooling-cooler-tower',Case:'case-case-showcase',Storage:'storage-ssd-1tb-nvme',OS:'os-windows-11-home'},
      {CPU:'cpu-r5-7600',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr4-32',GPU:'gpu-rtx-4090',PSU:'psu-750-bronze',Cooling:'cooling-cooler-tower',Case:'case-case-showcase',Storage:'storage-hdd-64',OS:'os-windows-11-home'},
      {CPU:'cpu-i7-14700k',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr4-64',GPU:'gpu-rtx-4080s',PSU:'psu-650-bronze',Cooling:'cooling-cooler-basic',Case:'case-case-showcase',Storage:'storage-ssd-2tb-nvme',OS:'os-windows-11-pro'},
      {CPU:'cpu-r9-9950x3d',Motherboard:'motherboard-mb-x870',RAM:'ram-ddr5-256',GPU:'gpu-rtx-4070',PSU:'psu-750-gold',Cooling:'cooling-cooler-tower',Case:'case-case-showcase',Storage:'storage-ssd-2tb-nvme',OS:'os-windows-11-pro'},
      {CPU:'cpu-i9-14900k',Motherboard:'motherboard-mb-b650',RAM:'ram-ddr4-64',GPU:'gpu-rtx-4090',PSU:'psu-750-bronze',Cooling:'cooling-cooler-basic',Case:'case-case-showcase',Storage:'storage-ssd-2tb-nvme',OS:'os-windows-11-pro'},
      {CPU:'cpu-ultra7-265k',Motherboard:'motherboard-mb-z790',RAM:'ram-ddr5-64',GPU:'gpu-rtx-4080s',PSU:'psu-650-bronze',Cooling:'cooling-cooler-basic',Case:'case-case-showcase',Storage:'storage-hdd-64',OS:'os-windows-11-pro'}
    ];
    priorityMulti.forEach((build,i)=>{
      const issues=problemEvaluateBuild(build);
      if (issues.length >= 2) add(`Composite investigation ${i+1}`,build,[...problemExpectedIdsFromIssues(build,issues)],
        `Здесь несколько независимых проблем. Не останавливайся на первой найденной ошибке — проверь всю сборку.`,
        `This build contains several independent problems. Do not stop at the first error — inspect the whole build.`);
    });
  }

  // Keep only the fair historical cases.
  const historical = [...buildBasicProblemPool(d), ...buildDeepAuditPool(d), ...buildAdditionalProblemVariants(d)];
  historical.forEach(c => problemAddGenerated(out,seen,c,d));

  // Socket/platform: lots of valid-looking combinations, with a CPU chosen below the board TDP ceiling.
  const mismatchCpuByPlatform = {
    LGA1200: ['cpu-i5-12400f','cpu-r5-7600','cpu-ultra5-245k'],
    LGA1700: ['cpu-i5-10400f','cpu-r5-5600','cpu-ultra5-245k'],
    AM4: ['cpu-i5-10400f','cpu-i5-12400f','cpu-ultra5-245k'],
    AM5: ['cpu-i5-10400f','cpu-i5-12400f','cpu-ultra5-245k'],
    LGA1851: ['cpu-i5-10400f','cpu-r5-5600','cpu-i5-12400f']
  };
  for (let i=0;i<safeBases.length && out.length<100;i++) {
    const base=safeBases[i], mb=problemItem(base.Motherboard), platform=partPlatform(mb);
    const options=mismatchCpuByPlatform[platform] || mismatchCpuByPlatform.LGA1700;
    for (let j=0;j<options.length && out.length<100;j++) {
      const cpu=options[(i+j)%options.length], build={...base,CPU:cpu};
      if (partPlatform(problemItem(cpu))===platform) continue;
      add(`Platform research ${i+1}-${j+1}`,build,[cpu,base.Motherboard],
        `Названия выглядят правдоподобно, но платформы процессора и платы разные. Сравни сокет, а не только серию.`,
        `The names look plausible, but the CPU and motherboard use different platforms. Compare the socket, not just the series.`);
    }
  }

  // RAM generation and capacity traps.
  for (let i=0;i<safeBases.length && out.length<100;i++) {
    const base=safeBases[i], mb=problemItem(base.Motherboard), spec=motherboardSpec(mb); if(!spec) continue;
    const wrongRam = spec.ramType === 'DDR5' ? ['ram-ddr4-16','ram-ddr4-32','ram-ddr4-64'][i%3] : ['ram-ddr5-16','ram-ddr5-32','ram-ddr5-64'][i%3];
    add(`RAM research ${i+1}`,{...base,RAM:wrongRam},[base.Motherboard,wrongRam],
      `Плата и память похожи по классу, но используют разные поколения DDR.`,
      `The board and memory look like a plausible pair, but they use different DDR generations.`);
  }
  const capacityBoards=['motherboard-mb-z690','motherboard-mb-b760','motherboard-mb-b650','motherboard-mb-x670','motherboard-mb-z790','motherboard-mb-x870'];
  capacityBoards.forEach((mb,i)=>{
    const base={CPU:({
      'motherboard-mb-z690':'cpu-i7-12700k','motherboard-mb-b760':'cpu-i5-13400f','motherboard-mb-b650':'cpu-r7-7800x3d','motherboard-mb-x670':'cpu-r9-7900x','motherboard-mb-z790':'cpu-i7-14700k','motherboard-mb-x870':'cpu-r9-9950x3d'
    })[mb],Motherboard:mb,RAM:['ram-ddr5-256','ram-ddr5-256','ram-ddr5-256','ram-ddr5-256','ram-ddr5-256','ram-ddr5-256'][i],GPU:'gpu-rtx-4070',Storage:'storage-ssd-2tb-nvme',PSU:'psu-750-gold',Cooling:'cooling-cooler-aio-360',Case:'case-case-showcase',OS:'os-windows-11-pro'};
    add(`Memory capacity research ${i+1}`,base,[mb,base.RAM],`Объём RAM превышает реальный предел этой платы. Лимит специально не показан в игре.`,`The RAM capacity exceeds the board's real limit. The limit is intentionally not shown in-game.`,{},'compatibility');
  });

  // Power traps with different GPU/PSU pairs.
  const powerPairs=[
    ['gpu-rtx-2060','psu-450'],['gpu-rtx-2070','psu-450'],['gpu-rtx-3060','psu-450'],['gpu-rtx-4060','psu-300'],
    ['gpu-rtx-4070','psu-550-bronze'],['gpu-rtx-4070s','psu-550-bronze'],['gpu-rtx-4080s','psu-650-bronze'],
    ['gpu-rx-6700xt','psu-550-bronze'],['gpu-rx-7800xt','psu-650-bronze'],['gpu-rx-7900xt','psu-650-bronze'],
    ['gpu-rx-7900xtx','psu-750-bronze'],['gpu-rtx-4090','psu-750-bronze'],['gpu-rtx-5090','psu-850-gold']
  ];
  powerPairs.forEach(([gpu,psu],i)=>{
    const base=problemClone(safeBases[(i+11)%safeBases.length]);
    const build={...base,GPU:gpu,PSU:psu,Storage:'storage-ssd-2tb-nvme',Case:'case-case-showcase',Cooling:'cooling-cooler-aio-360'};
    add(`Power forensic ${i+1}`,build,[gpu,psu],`Проверяй рекомендованную мощность видеокарты отдельно от общей мощности БП.`,`Compare the GPU's recommended PSU separately from the PSU's printed wattage.`);
  });

  // Cooling traps with several CPU generations.
  const coolPairs=[
    ['cpu-i5-14600k','motherboard-mb-b760','cooling-cooler-basic'],['cpu-i7-13700k','motherboard-mb-z790','cooling-cooler-basic'],
    ['cpu-i7-14700k','motherboard-mb-z790','cooling-cooler-tower'],['cpu-i9-14900k','motherboard-mb-z790-256','cooling-cooler-tower'],
    ['cpu-r7-7800x3d','motherboard-mb-b650','cooling-cooler-basic'],['cpu-r9-7900x','motherboard-mb-x670','cooling-cooler-basic'],
    ['cpu-r9-7950x','motherboard-mb-x670','cooling-cooler-tower'],['cpu-r9-9950x3d','motherboard-mb-x870e-256','cooling-cooler-tower']
  ];
  coolPairs.forEach(([cpu,mb,cooler],i)=>{
    if (d<2) return;
    const build={CPU:cpu,Motherboard:mb,RAM:'ram-ddr5-64',GPU:'gpu-rtx-4070',Storage:'storage-ssd-2tb-nvme',PSU:'psu-750-gold',Cooling:cooler,Case:'case-case-showcase',OS:'os-windows-11-pro'};
    add(`Thermal research ${i+1}`,build,[cpu,cooler],`Кулер выглядит обычным, но его тепловой запас ниже нагрузки процессора.`, `The cooler looks ordinary, but its thermal capacity is below the CPU's heat load.`);
  });

  // Storage/OS traps.
  const osIds=['os-windows-10-home','os-windows-10-pro','os-windows-11-home','os-windows-11-pro','os-macos'];
  for(let i=0;i<osIds.length;i++){
    const base=problemClone(safeBases[(i+19)%safeBases.length]); const build={...base,Storage:'storage-hdd-64',OS:osIds[i]};
    add(`Storage forensic ${i+1}`,build,['storage-hdd-64',osIds[i]],`Накопитель подозрительно маленький. Проверь требования выбранной ОС.`,`The drive is suspiciously small. Check the selected OS requirements.`);
  }

  if (d>=3) {
    const physicalPairs=[
      ['gpu-rtx-4090','case-case-office'],['gpu-rtx-5090','case-case-basic'],['gpu-rx-7900xtx','case-case-office'],['gpu-rtx-4080s','case-case-basic'],
      ['gpu-rtx-4090','case-case-basic'],['gpu-rtx-5090','case-case-airflow'],['gpu-rx-7900xtx','case-case-basic'],['gpu-rtx-4080s','case-case-office']
    ];
    physicalPairs.forEach(([gpu,caseId],i)=>{const base=problemClone(safeBases[(i+24)%safeBases.length]);add(`Dimension research ${i+1}`,{...base,GPU:gpu,Case:caseId,PSU:'psu-1000-gold'},[gpu,caseId],`Смотри не только на мощность: физическая длина карты важна не меньше.`,`Do not check only performance: the card's physical length matters too.` ,{},'physical');});
  }

  if (d>=4) {
    const formPairs=[
      ['motherboard-mb-z790-256','case-case-airflow'],['motherboard-mb-z890-256','case-case-mesh'],['motherboard-mb-x870e-256','case-case-glass'],
      ['motherboard-mb-z790-256','case-case-office'],['motherboard-mb-z890-256','case-case-basic'],['motherboard-mb-x870e-256','case-case-airflow']
    ];
    formPairs.forEach(([mb,caseId],i)=>{const cpu=/x870e/.test(mb)?'cpu-r9-9950x3d':/z890/.test(mb)?'cpu-ultra7-265k':'cpu-i9-14900k';const base={CPU:cpu,Motherboard:mb,RAM:'ram-ddr5-128',GPU:'gpu-rtx-4070s',Storage:'storage-ssd-2tb-nvme',PSU:'psu-1000-gold',Cooling:'cooling-cooler-aio-360',Case:caseId,OS:'os-windows-11-pro'};add(`Form factor research ${i+1}`,base,[mb,caseId],`Ошибка спрятана в форм-факторе: E-ATX не помещается в этот корпусный стандарт.`,`The trap is the form factor: this E-ATX board is not supported by this case.`,{},'form-factor');});
  }

  // Metadata fraud across several categories: years, manufacturers, TDP, VRAM and form factors.
  const metaTargets=[
    ['GPU','gpu-rtx-2070','gddr','GDDR5'],['GPU','gpu-rtx-3060','vramGb',4],['GPU','gpu-rx-7800xt','releaseYear',2025],
    ['CPU','cpu-i7-12700k','releaseYear',2024],['CPU','cpu-r9-9950x3d','tdp',95],['Motherboard','motherboard-mb-z790-256','releaseYear',2022],
    ['Motherboard','motherboard-mb-x870','manufacturer','OrionCore'],['RAM','ram-ddr5-64','capacityGb',256],['PSU','psu-1000-gold','certificateLabel','80+ Titanium'],
    ['OS','os-windows-11-home','releaseYear',2018]
  ];
  metaTargets.forEach(([cat,id,key,val],i)=>{
    const base=problemClone(safeBases[(i+31)%safeBases.length]); const build={...base,[cat]:id};
    add(`Data forensic ${i+1}`,build,[id],`Название детали настоящее, но поле «${key}» подделано. Придётся перепроверить реальную спецификацию.`,`The component name is real, but the “${key}” field is falsified. Verify the real specification.`,{[id]:{[key]:val}},'metadata');
  });

  // False manufacturers / fake companies remain early-game specific.
  if (d<=2) {
    const fake=[['CPU','cpu-i5-12400f','Northstar Computing'],['GPU','gpu-rtx-4060','Quantum Foundry'],['Motherboard','motherboard-mb-b760','OrionCore'],['RAM','ram-ddr5-32','Vertex Memory Co.'],['PSU','psu-650-bronze','TitanPeak Power']];
    fake.forEach(([cat,id,m],i)=>{const base=problemClone(safeBases[(i+41)%safeBases.length]);const build={...base,[cat]:id};add(`Fake company ${i+1}`,build,[id],`Модель настоящая, а компания в характеристиках выдумана: ${m}.`,`The model is real, but the company shown in the details is fictional: ${m}.`,{[id]:{manufacturer:m}},'metadata');});
  }


  problemFillExpandedPool(out, seen, d, 100);
  return out.slice(0,100);
}

function buildExpandedCleanPool(d) {
  return Array.from({ length: 50 }, (_, i) => problemMakeCleanCase(d, i));
}

const PROBLEM_CASES = Object.fromEntries([1,2,3,4,5].map(d => {
  const bad = buildExpandedProblemPool(d);
  const clean = buildExpandedCleanPool(d);
  return [d, [...bad, ...clean]];
}));

const PROBLEM_CASE_COUNTS = Object.fromEntries([1,2,3,4,5].map(d => [d, {
  total: PROBLEM_CASES[d].length,
  clean: PROBLEM_CASES[d].filter(c => c.selected.length === 0).length,
  problem: PROBLEM_CASES[d].filter(c => c.selected.length > 0).length
}]));

const PROBLEM_CATEGORY_LABELS = {
  CPU: { ru: 'Процессор', en: 'CPU' },
  Motherboard: { ru: 'Материнская плата', en: 'Motherboard' },
  RAM: { ru: 'Оперативная память', en: 'RAM' },
  GPU: { ru: 'Видеокарта', en: 'GPU' },
  Storage: { ru: 'Накопитель', en: 'Storage' },
  PSU: { ru: 'Блок питания', en: 'PSU' },
  Cooling: { ru: 'Охлаждение', en: 'Cooling' },
  Case: { ru: 'Корпус', en: 'Case' },
  OS: { ru: 'Операционная система', en: 'OS' }
};

function problemText(ru, en) {
  return currentLanguage?.() === 'ru' ? ru : en;
}

function problemEsc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function problemItem(id) {
  const item = typeof itemById === 'function' ? itemById(id) : null;
  return item || null;
}

function problemReason(caseData) {
  if (!caseData) return '';
  if (currentLanguage?.() === 'ru') return caseData.reasonRu || PROBLEM_REASON_RU[caseData.reason] || caseData.reason || '';
  return caseData.reasonEn || caseData.reason || '';
}

function initProblemStaticTexts() {
  const card = document.querySelector('.problem-mode-card');
  if (!card) return;
  const title = card.querySelector('b');
  const desc = card.querySelector('span');
  if (currentLanguage?.() === 'ru') {
    if (title) title.textContent = '⚠ Проблема';
    if (desc) desc.textContent = 'Найди ошибку в готовой сборке. А может, ошибки вообще нет.';
  } else {
    if (title) title.textContent = '⚠ Problem';
    if (desc) desc.textContent = 'Find the problem in a finished build. Or maybe there is no problem at all.';
  }
}

function problemCloseDifficulty() {
  const modal = $('problemDifficultyModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function openProblemDifficulty() {
  problemCloseMode();
  const modal = $('problemDifficultyModal');
  const list = $('problemDifficultyOptions');
  if (!modal || !list) return;
  const ruNames = ['Разогрев', 'Уже интереснее', 'Надо смотреть внимательнее', 'Легко запутаться', 'Без пощады'];
  const enNames = ['Warm-up', 'Getting tricky', 'Look closer', 'Easy to get fooled', 'No mercy'];
  list.innerHTML = [1,2,3,4,5].map((level) => `
    <button type="button" class="problem-difficulty-card" data-problem-difficulty="${level}">
      <span class="problem-difficulty-number">${level}</span>
      <span class="problem-difficulty-copy"><strong>${problemText(ruNames[level - 1], enNames[level - 1])}</strong><small>${problemText(`Сложность ${level}. Просто попробуй.`, `Difficulty ${level}. Just give it a try.`)}</small></span>
      <span class="problem-difficulty-arrow">→</span>
    </button>
  `).join('');
  list.querySelectorAll('[data-problem-difficulty]').forEach((button) => {
    button.addEventListener('click', () => startProblemMode(Number(button.dataset.problemDifficulty)));
  });
  const title = $('problemDifficultyTitle');
  const text = $('problemDifficultyText');
  if (title) title.textContent = problemText('⚠ Проблема', '⚠ Problem');
  if (text) text.textContent = problemText('Выбери сложность. В каждом уровне 150 кейсов. В 30% раундов ошибки нет.', 'Choose a difficulty. Each level has 150 cases. 30% of rounds have no problem.');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function problemCloseDrawer() {
  const screen = $('problemScreen');
  screen?.classList.remove('problem-detail-open');
  const drawer = $('problemDetailDrawer');
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  const body = $('problemDetailBody');
  if (body) body.innerHTML = '';
  problemSession && (problemSession.openItemId = null);
}

function problemCloseMode() {
  problemCloseDifficulty();
  problemCloseDrawer();
  const screen = $('problemScreen');
  if (screen) screen.classList.add('hidden');
  problemSession = null;
}

function problemBackToModes() {
  problemCloseMode();
  showModeScreen();
}

function problemShuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function problemStartSession(difficulty) {
  const pool = PROBLEM_CASES[difficulty] || PROBLEM_CASES[1];
  const cleanPool = pool.filter(c => !c.selected.length);
  const problemPool = pool.filter(c => c.selected.length);
  const wantClean = Math.random() < 0.30;
  let source = wantClean ? cleanPool : problemPool;
  if (!source.length) source = pool;
  const lastKey = window.__problemLastCaseKey || '';
  let picked = source[Math.floor(Math.random() * source.length)];
  for (let tries=0; tries<8 && `${picked.name}|${picked.reasonEn}` === lastKey; tries++) picked = source[Math.floor(Math.random() * source.length)];
  window.__problemLastCaseKey = `${picked.name}|${picked.reasonEn}`;
  const shuffledCategories = problemShuffle(PROBLEM_CATEGORIES);
  problemSession = {
    difficulty,
    case: picked,
    order: shuffledCategories,
    selectedIds: new Set(),
    openItemId: null,
    finished: false
  };
}

function startProblemMode(difficulty) {
  problemCloseDifficulty();
  problemStartSession(difficulty);
  const screen = $('problemScreen');
  if (!screen || !problemSession) return;
  screen.setAttribute('aria-label', problemText('Режим «Проблема»', 'Problem mode'));
  $('mainMenuScreen')?.classList.add('hidden');
  $('modeScreen')?.classList.add('hidden');
  $('gameScreen')?.classList.add('hidden');
  setMoneyVisible(false);
  renderProblemMode();
  screen.classList.remove('hidden');
  screen.classList.add('problem-screen-enter');
  setTimeout(() => screen.classList.remove('problem-screen-enter'), 300);
}

function problemOverride(itemId, key, fallback = null) {
  const override = problemSession?.case?.overrides?.[itemId]?.[key];
  return override !== undefined ? override : fallback;
}
function problemSpecValue(item, key, fallback = null) {
  if (!item) return fallback;
  if (item.category === 'GPU' && PROBLEM_GPU_META[item.id]?.[key] != null) return PROBLEM_GPU_META[item.id][key];
  if (key === 'gpuLengthMm') return PROBLEM_CASE_META.gpuLengthMm[item.id] ?? fallback;
  if (key === 'coolerHeightMm') return PROBLEM_CASE_META.coolerHeightMm[item.id] ?? fallback;
  return item[key] ?? fallback;
}
function problemCaseMeta(itemId, key, fallback = null) { return problemOverride(itemId,key,problemSpecValue(problemItem(itemId),key,fallback)); }
function problemDisplayedPsuCert(itemId) { return problemCaseMeta(itemId,'certificateLabel',problemActualPsuCert(itemId) || '—'); }

function problemBuildCards() {
  if (!problemSession) return;
  const grid = $('problemPartsGrid');
  if (!grid) return;
  const caseBuild = problemSession.case.build;
  grid.innerHTML = problemSession.order.map((category) => {
    const id = caseBuild[category];
    const item = problemItem(id);
    const label = PROBLEM_CATEGORY_LABELS[category]?.[currentLanguage?.() === 'ru' ? 'ru' : 'en'] || category;
    const selected = problemSession.selectedIds.has(id);
    return `<button type="button" class="problem-part-card ${selected ? 'selected' : ''}" data-problem-item="${problemEsc(id)}">
      <span class="problem-part-category">${problemEsc(label)}</span>
      <strong>${problemEsc(item?.name || id)}</strong>
      <span class="problem-part-hint">${problemText('Нажми, чтобы посмотреть характеристики', 'Click to inspect specifications')}</span>
      ${selected ? `<span class="problem-selected-mark">✓</span>` : ''}
    </button>`;
  }).join('');
  grid.querySelectorAll('[data-problem-item]').forEach((card) => card.addEventListener('click', () => openProblemDetail(card.dataset.problemItem)));
}

function problemTechRows(item) {
  if (!item) return [];
  const rows = [];
  const category = item.category;
  if (item.manufacturer) rows.push([problemText('Производитель', 'Manufacturer'), problemCaseMeta(item.id,'manufacturer',item.manufacturer)]);
  if (item.performance != null) rows.push([problemText('Мощность в игре', 'Game power'), String(item.performance)]);
  if (category === 'CPU') {
    if (typeof partPlatform === 'function') rows.push([problemText('Платформа', 'Platform'), partPlatform(item) || '—']);
    if (typeof cpuTdp === 'function') rows.push([problemText('Тепло / TDP', 'Heat / TDP'), `${problemCaseMeta(item.id,'tdp',cpuTdp(item))} W`]);
  }
  if (category === 'Motherboard') {
    const spec = typeof motherboardSpec === 'function' ? motherboardSpec(item) : null;
    if (spec) {
      rows.push([problemText('Платформа', 'Platform'), problemCaseMeta(item.id,'platform',spec.platform)]);
      rows.push([problemText('Форм-фактор', 'Form factor'), problemCaseMeta(item.id,'formFactor',PROBLEM_FORM_FACTOR_META.motherboard[item.id] || '—')]);
      rows.push([problemText('Слоты RAM', 'RAM slots'), String(spec.ramSlots)]);
    } else {
      rows.push([problemText('Форм-фактор', 'Form factor'), problemCaseMeta(item.id,'formFactor',PROBLEM_FORM_FACTOR_META.motherboard[item.id] || '—')]);
    }
  }
  if (category === 'RAM') {
    if (typeof ramType === 'function') rows.push([problemText('Поколение', 'Generation'), problemCaseMeta(item.id,'ramType',ramType(item) || '—')]);
    if (typeof ramCapacityGb === 'function') rows.push([problemText('Объём', 'Capacity'), `${problemCaseMeta(item.id,'capacityGb',problemRamCapacity(item))} GB`]);
  }
  if (category === 'GPU') {
    if (typeof gpuRecommendedPsu === 'function' && isDiscreteGpu(item)) rows.push([problemText('Рекомендованный БП', 'Recommended PSU'), `${gpuRecommendedPsu(item)} W`]);
    rows.push([problemText('Память GPU', 'GPU memory type'), problemCaseMeta(item.id, 'gddr', problemSpecValue(item,'gddr','—'))]);
    rows.push([problemText('Видеопамять', 'VRAM'), `${problemCaseMeta(item.id, 'vramGb', problemSpecValue(item,'vramGb','—'))} GB`]);
    if ((problemSession?.difficulty || 0) >= 3) {
      const len = problemCaseMeta(item.id,'gpuLengthMm',null); if (len) rows.push([problemText('Длина видеокарты', 'GPU length'), `${len} mm`]);
    }
  }
  if (category === 'PSU' && typeof numericWatts === 'function') {
    rows.push([problemText('Мощность БП', 'PSU wattage'), `${numericWatts(item)} W`]);
    rows.push([problemText('Форм-фактор', 'Form factor'), problemCaseMeta(item.id,'formFactor',PROBLEM_FORM_FACTOR_META.psu[item.id] || 'ATX')]);
    rows.push([problemText('Сертификат', 'Certification'), problemCaseMeta(item.id,'certificateLabel',problemActualPsuCert(item.id) || '—')]);
  }
  if (category === 'Case') {
    rows.push([problemText('Поддерживаемые форм-факторы', 'Supported form factors'), problemCaseMeta(item.id,'supportedFormFactors',(PROBLEM_FORM_FACTOR_META.caseSupports[item.id] || []).join(', ') || '—')]);
    // Keep direct physical clearance values hidden; difficulty 3+ only exposes GPU length.
  }
  if (category === 'Cooling') {
    const h = PROBLEM_CASE_META.coolerHeightMm[item.id]; if (h) rows.push([problemText('Высота', 'Height'), `${h} mm`]);
  }
  const year = problemCaseMeta(item.id,'releaseYear',item.releaseYear ?? null);
  if (year) rows.push([problemText('Год выпуска', 'Release year'), String(year)]);
  if (category === 'Cooling' && typeof coolingCapacity === 'function') rows.push([problemText('Ёмкость охлаждения', 'Cooling capacity'), `${coolingCapacity(item)} W`]);
  if (category === 'Storage') {
    const text = String(item.name || '');
    const cap = text.match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
    if (cap) rows.push([problemText('Объём', 'Capacity'), `${cap[1]} ${cap[2].toUpperCase()}`]);
  }
  if (item.desc) rows.push([problemText('Описание', 'Description'), item.desc]);
  return rows;
}

function openProblemDetail(itemId) {
  if (!problemSession || problemSession.finished) return;
  const item = problemItem(itemId);
  const drawer = $('problemDetailDrawer');
  const body = $('problemDetailBody');
  if (!item || !drawer || !body) return;
  problemSession.openItemId = itemId;
  const categoryLabel = PROBLEM_CATEGORY_LABELS[item.category]?.[currentLanguage?.() === 'ru' ? 'ru' : 'en'] || item.category;
  const rows = problemTechRows(item);
  const selected = problemSession.selectedIds.has(item.id);
  body.innerHTML = `
    <div class="problem-detail-head">
      <div>
        <span class="problem-detail-category">${problemEsc(categoryLabel)}</span>
        <h3>${problemEsc(item.name)}</h3>
      </div>
      <button type="button" class="small problem-detail-close" id="problemDetailCloseBtn">✕</button>
    </div>
    <div class="problem-spec-list">
      ${rows.map(([name, value]) => `<div class="problem-spec-row"><span>${problemEsc(name)}</span><strong>${problemEsc(value)}</strong></div>`).join('')}
    </div>
    <button type="button" class="primary problem-select-btn ${selected ? 'is-selected' : ''}" id="problemSelectBtn">
      ${selected ? problemText('Убрать из выбора', 'Remove from selection') : problemText('Выбрать', 'Select')}
    </button>
  `;
  drawer.classList.add('open');
  $('problemScreen')?.classList.add('problem-detail-open');
  drawer.setAttribute('aria-hidden', 'false');
  $('problemDetailCloseBtn')?.addEventListener('click', problemCloseDrawer);
  $('problemSelectBtn')?.addEventListener('click', () => toggleProblemSelection(item.id));
}

function toggleProblemSelection(itemId) {
  if (!problemSession || problemSession.finished) return;
  if (problemSession.selectedIds.has(itemId)) problemSession.selectedIds.delete(itemId);
  else problemSession.selectedIds.add(itemId);
  problemBuildCards();
  openProblemDetail(itemId);
}

function problemMatchesSelection() {
  if (!problemSession) return false;
  const expected = new Set(problemSession.case.selected);
  const actual = problemSession.selectedIds;
  if (expected.size !== actual.size) return false;
  for (const id of expected) if (!actual.has(id)) return false;
  return true;
}

function problemResult() {
  if (!problemSession) return;
  const success = problemMatchesSelection();
  const expected = problemSession.case.selected;
  const actual = problemSession.selectedIds;
  const correctSelected = expected.filter((id) => actual.has(id)).length;
  const partial = !success && expected.length > 1 && correctSelected > 0 && actual.size === correctSelected;
  problemSession.finished = true;
  problemCloseDrawer();
  const result = $('problemResult');
  if (!result) return;
  const expectedNames = expected.map((id) => problemItem(id)?.name || id);
  const selectedNames = [...problemSession.selectedIds].map((id) => problemItem(id)?.name || id);
  if (success) {
    result.innerHTML = `<div class="problem-result-card success"><div class="problem-result-icon">✓</div><h3>${problemText('Правильно!', 'Correct!')}</h3><p>${expected.length ? problemText('Ты нашёл проблему. ', 'You found the problem. ') + problemReason(problemSession.case) : problemReason(problemSession.case)}</p><div class="problem-result-actions"><button type="button" class="primary" id="problemAgainBtn">${problemText('Следующая проблема', 'Next problem')}</button><button type="button" class="small" id="problemBackBtn">${problemText('К режимам', 'Back to modes')}</button></div></div>`;
  } else {
    const expectedText = expected.length ? expectedNames.join(', ') : problemText('Ничего', 'Nothing');
    const selectedText = selectedNames.length ? selectedNames.join(', ') : problemText('Ничего', 'Nothing');
    const resultClass = partial ? 'partial' : 'fail';
    const resultIcon = partial ? '!' : '×';
    const resultTitle = partial ? problemText('Частично правильно', 'Partially correct') : problemText('Не угадал', 'Not quite');
    const lead = partial
      ? problemText(`Ты нашёл ${correctSelected} из ${expected.length} проблем. Осталось найти ещё. `, `You found ${correctSelected} of ${expected.length} problems. There is still more to find. `)
      : problemText(`Ты выбрал: ${selectedText}. Правильный ответ: ${expectedText}. `, `You selected: ${selectedText}. Correct answer: ${expectedText}. `);
    result.innerHTML = `<div class="problem-result-card ${resultClass}"><div class="problem-result-icon">${resultIcon}</div><h3>${resultTitle}</h3><p>${lead + problemReason(problemSession.case)}</p><div class="problem-result-actions"><button type="button" class="primary" id="problemAgainBtn">${problemText('Попробовать ещё раз', 'Try again')}</button><button type="button" class="small" id="problemBackBtn">${problemText('К режимам', 'Back to modes')}</button></div></div>`;
  }
  $('problemAgainBtn')?.addEventListener('click', () => startProblemMode(problemSession.difficulty));
  $('problemBackBtn')?.addEventListener('click', problemBackToModes);
  result.classList.remove('hidden');
  document.querySelectorAll('.problem-part-card').forEach((card) => card.disabled = true);
  const confirm = $('problemConfirmBtn');
  if (confirm) confirm.disabled = true;
}

function renderProblemMode() {
  if (!problemSession) return;
  const difficulty = $('problemDifficultyLabel');
  const title = $('problemGameTitle');
  const hint = $('problemGameHint');
  const result = $('problemResult');
  const confirm = $('problemConfirmBtn');
  if (difficulty) difficulty.textContent = problemText(`Сложность ${problemSession.difficulty}`, `Difficulty ${problemSession.difficulty}`);
  if (title) title.textContent = problemText('Проблема', 'Problem');
  const back = $('problemBackBtnStatic');
  if (back) back.textContent = problemText('← К режимам', '← Back to modes');
  if (hint) hint.textContent = problemText('Посмотри на сборку и открывай характеристики. Если думаешь, что здесь есть ошибка, выбери проблемный элемент или элементы и нажми «Подтвердить».', 'Inspect the build. If you think there is a problem, select the problematic component or components and press “Confirm”.');
  if (confirm) {
    confirm.textContent = problemText('Подтвердить', 'Confirm');
    confirm.disabled = false;
    confirm.onclick = problemResult;
  }
  const sub = $('problemNoIssueHint');
  if (sub) sub.textContent = problemText('Если ты думаешь, что тут нет ошибки — просто нажми «Подтвердить», ничего не выбирая.', 'If you think there is no problem here, just press “Confirm” without selecting anything.');
  if (result) { result.classList.add('hidden'); result.innerHTML = ''; }
  problemBuildCards();
  problemCloseDrawer();
}

initProblemStaticTexts();

function initProblemModeUI() {
  $('problemDifficultyCancelBtn')?.addEventListener('click', () => { problemCloseDifficulty(); showModeScreen(); });
  document.querySelector('#problemDifficultyModal .menu-modal-backdrop')?.addEventListener('click', () => { problemCloseDifficulty(); showModeScreen(); });
  $('problemBackBtnStatic')?.addEventListener('click', problemBackToModes);
  $('problemDetailBackdrop')?.addEventListener('click', problemCloseDrawer);
}

initProblemModeUI();
