const SETTINGS_KEY = 'pcBuilder_settings';
const PART_INFO = [
  { category: 'CPU', icon: '🧠', title: 'Процессор (CPU)', text: 'Главный вычислительный компонент. Выполняет команды, считает данные и влияет на общую производительность системы.', details: ['Ядра и потоки — сколько задач CPU может обрабатывать параллельно.', 'Частота — скорость работы ядер, но одна только частота не определяет производительность.', 'Сокет и совместимость с материнской платой важны при сборке.'] },
  { category: 'GPU', icon: '🎨', title: 'Видеокарта (GPU)', text: 'Отвечает за обработку графики и вычислительные задачи, связанные с изображением. Особенно важна для игр.', details: ['Видеопамять (VRAM) хранит данные графики.', 'Производительность GPU сильно влияет на FPS в графических задачах.', 'Встроенная графика находится прямо в процессоре или платформе и обычно слабее отдельной видеокарты.'] },
  { category: 'RAM', icon: '🧩', title: 'Оперативная память (RAM)', text: 'Быстрая временная память для данных, которыми система пользуется прямо сейчас. После выключения её содержимое исчезает.', details: ['Объём определяет, сколько данных и программ можно держать одновременно.', 'Тип памяти — DDR3, DDR4 или DDR5 — должен соответствовать платформе.', 'Больший объём не всегда означает большую производительность, но нехватка RAM сильно мешает системе.'] },
  { category: 'Storage', icon: '💾', title: 'Накопитель', text: 'Хранит операционную систему, игры и файлы даже после выключения ПК.', details: ['HDD использует магнитные пластины и обычно медленнее SSD.', 'SATA SSD заметно быстрее HDD.', 'NVMe SSD работает через PCIe и обычно ещё быстрее.'] },
  { category: 'PSU', icon: '⚡', title: 'Блок питания (PSU)', text: 'Преобразует электричество из сети и подаёт подходящее питание компонентам компьютера.', details: ['Мощность указывается в ваттах (W).', 'Слабого БП может не хватить мощным компонентам.', 'Качество питания тоже важно: сертификат эффективности не является полной оценкой качества БП.'] },
  { category: 'Motherboard', icon: '🔌', title: 'Материнская плата', text: 'Соединяет компоненты компьютера и определяет, какие процессоры, память и устройства можно установить.', details: ['Сокет должен совпадать с процессором.', 'Поддержка памяти определяет совместимые поколения DDR.', 'Количество и стандарт слотов расширения влияют на возможности апгрейда.'] },
  { category: 'Cooling', icon: '❄️', title: 'Охлаждение', text: 'Отводит тепло от горячих компонентов, прежде всего процессора.', details: ['Штатный кулер подходит не для любого мощного CPU.', 'Башенные кулеры используют радиатор и вентилятор.', 'СЖО использует жидкость, радиатор и помпу для отвода тепла.'] },
  { category: 'Case', icon: '🖥️', title: 'Корпус', text: 'Физический корпус, в котором размещаются компоненты. В игре он влияет на удобство и пригодность сборки, но не заменяет остальные детали.', details: ['Размер корпуса определяет совместимость с комплектующими.', 'Хороший airflow помогает выводить горячий воздух.', 'На хардкоре можно начать вообще без корпуса.'] },
  { category: 'OS', icon: '💿', title: 'Операционная система', text: 'Главное системное программное обеспечение. В игре ОС тоже влияет на общую мощность ПК.', details: ['Разные ОС имеют разную мощность и цену.', 'ОС покупается в каталоге и устанавливается как обычный компонент.', 'Стартовая ОС зависит от выбранного режима.'] },
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
  { target: '#pcParts .part-button:last-child', screen: 'pc', title: 'Операционная система', text: 'ОС теперь является полноценным компонентом: её можно покупать в каталоге, устанавливать, продавать и учитывать в общей мощности ПК. Стартовые ОС: Windows 10 Home, Windows 8.1 Home и Windows 7 Lite для разных режимов.' },
  { target: '#pcParts .part-button:first-child', screen: 'pc', title: 'Совместимость', text: 'Каталог подсвечивает совместимость деталей в лёгком режиме. Зелёный — всё подходит, оранжевый — подходит не всё, красный — несовместимо.' },
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
      ['CPU', ['cpu-r9-9950x3d'], 'AMD Ryzen 9 9950X3D'],
      ['GPU', ['gpu-rx-7900xtx', 'gpu-rtx-5090'], 'Radeon RX 7900 XTX или GeForce RTX 5090'],
      ['RAM', ['ram-ddr5-192'], '192 GB DDR5'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-x870e-256'], 'MSI MEG X870E ACE'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм'],
      ['OS', ['os-windows-11-pro', 'os-macos'], 'Windows 11 Pro или macOS']
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
      ['RAM', ['ram-ddr5-256'], '256 GB DDR5'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-z790-256'], 'GIGABYTE Z790 AORUS MASTER X'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм'],
      ['OS', ['os-windows-11-pro', 'os-macos'], 'Windows 11 Pro или macOS']
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
    description: 'Собери ПК, где 8 компонентов близки к максимуму своей категории, а 1 явно слабее остальных.',
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
    description: 'Собери мощную майнинг-ферму на Xeon и 128 ГБ DDR4 с Windows 11 Pro или macOS.',
    requirements: [
      ['GPU', ['gpu-rtx-5090'], 'GeForce RTX 5090'],
      ['CPU', ['cpu-xeon-e-2388g'], 'Intel Xeon E-2388G'],
      ['RAM', ['ram-ddr4-128'], '128 GB DDR4'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-b560-gaming'], 'ASUS TUF GAMING B560-PLUS'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм'],
      ['OS', ['os-windows-11-pro', 'os-macos'], 'Windows 11 Pro или macOS']
    ]
  },
  {
    id: 'terminator',
    icon: '🤖',
    name: 'Terminator',
    description: 'Собери ультимативную AI-сборку на Core Ultra 9 и 256 ГБ DDR5 с Windows 11 Pro или macOS.',
    requirements: [
      ['GPU', ['gpu-rtx-5090'], 'GeForce RTX 5090'],
      ['CPU', ['cpu-ultra9-285k'], 'Intel Core Ultra 9 285K'],
      ['RAM', ['ram-ddr5-256'], '256 GB DDR5'],
      ['Storage', ['storage-ssd-2tb-gen5'], '2 TB PCIe 5.0 NVMe SSD'],
      ['PSU', ['psu-1000-gold'], 'БП 1000 W 80+ Gold'],
      ['Case', ['case-case-showcase'], 'Showcase корпус'],
      ['Motherboard', ['motherboard-mb-z890-256'], 'ASUS ROG MAXIMUS Z890 EXTREME'],
      ['Cooling', ['cooling-cooler-aio-420'], 'СЖО 420 мм'],
      ['OS', ['os-windows-11-pro', 'os-macos'], 'Windows 11 Pro или macOS']
    ]
  },
  {
    id: 'order_empire',
    icon: '👑',
    name: "I'll end this, for the order empire!",
    description: 'Скупи все предметы из обычного каталога.',
    type: 'collection'
  },
  {
    id: 'pirate',
    icon: '🏴‍☠️',
    name: 'Pirate',
    description: 'Собери полностью рабочий ПК только из деталей, купленных на чёрном рынке.',
    type: 'black_assembly'
  },
  {
    id: 'go_beyond',
    icon: '🌌',
    name: 'Go beyond...',
    description: 'Купи по экземпляру из обычного каталога и чёрного рынка для каждого предмета каталога.',
    type: 'double_collection',
    parent: 'order_empire'
  },
  {
    id: 'diligent_student',
    icon: '🎓',
    name: 'Diligent student',
    description: 'Сдай экзамен на 95 или больше баллов.',
    type: 'exam_score',
    target: 95
  },
  {
    id: 'super_buy',
    icon: '🎟️',
    name: 'Super Buy!',
    description: 'Купи любую деталь, используя EXTRA COUPON и обычный купон одновременно.',
    type: 'super_buy'
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
  if (state.installed.Storage === 'starter-hard-storage' || state.owned['starter-hard-storage']) {
    if (state.installed.Storage === 'starter-hard-storage') state.installed.Storage = 'storage-hdd-120';
    state.owned['storage-hdd-120'] = true;
    delete state.owned['starter-hard-storage'];
    if (state.broken['starter-hard-storage']) {
      state.broken['storage-hdd-120'] = state.broken['starter-hard-storage'];
      delete state.broken['starter-hard-storage'];
    }
    state.starterProtected = state.starterProtected || {};
    state.starterProtected['storage-hdd-120'] = true;
  }
  if (state.installed.Storage === 'starter-hardcore-storage') {
    state.installed.Storage = 'storage-hdd-64';
    state.owned['storage-hdd-64'] = true;
    delete state.owned['starter-hardcore-storage'];
    if (state.broken['starter-hardcore-storage']) {
      state.broken['storage-hdd-64'] = state.broken['starter-hardcore-storage'];
      delete state.broken['starter-hardcore-storage'];
    }
  }
  if (state.installed.CPU === 'starter-hard-cpu' || state.installed.CPU === 'cpu-pentium-j2900' || state.installed.CPU === 'j2900') {
    const oldCpuId = state.installed.CPU;
    state.installed.CPU = 'cpu-j2900';
    state.owned['cpu-j2900'] = true;
    delete state.owned['starter-hard-cpu'];
    delete state.owned['cpu-pentium-j2900'];
    if (state.broken[oldCpuId]) {
      state.broken['cpu-j2900'] = state.broken[oldCpuId];
      delete state.broken[oldCpuId];
    }
    state.starterProtected = state.starterProtected || {};
    state.starterProtected['cpu-j2900'] = true;
  }
  if (state.installed.RAM === 'starter-hard-ram') {
    state.installed.RAM = 'ram-ddr3-4';
    state.owned['ram-ddr3-4'] = true;
    delete state.owned['starter-hard-ram'];
    if (state.broken['starter-hard-ram']) {
      state.broken['ram-ddr3-4'] = state.broken['starter-hard-ram'];
      delete state.broken['starter-hard-ram'];
    }
    state.starterProtected = state.starterProtected || {};
    state.starterProtected['ram-ddr3-4'] = true;
  }
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
  const installed = Object.fromEntries(CATEGORIES.map((category) => [category, installedItem(category)]));
  const issues = checkCompatibility();
  if (issues.length) return { ok: false, reason: 'compatibility', strongCategories: [], weakCategories: [], installed, issues };
  if (CATEGORIES.some((category) => !installed[category] || installed[category].starter || installed[category].legacy || isItemBroken(installed[category]))) {
    return { ok: false, reason: 'missing_or_broken', strongCategories: [], weakCategories: [], installed, issues };
  }

  // Holy Bottleneck — не «все флагманы», а одна явная дыра на фоне остальной сборки.
  // 8 компонентов должны быть хотя бы на 75% от максимальной мощности своей категории,
  // а ровно один — не более 25% от максимума этой категории. Это позволяет, например,
  // использовать RTX 4090 вместо 5090 или Windows 11 Home вместо Pro.
  const categoryStats = {};
  for (const category of CATEGORIES) {
    const candidates = SHOP.filter((item) => item.category === category && !item.starter && !item.legacy);
    const maxPerformance = Math.max(0, ...candidates.map((item) => Number(item.performance) || 0));
    const installedPerformance = effectiveItemPerformance(installed[category]);
    categoryStats[category] = {
      maxPerformance,
      installedPerformance,
      strong: maxPerformance > 0 && installedPerformance >= maxPerformance * 0.75,
      weak: maxPerformance > 0 && installedPerformance <= maxPerformance * 0.25
    };
  }

  const strongCategories = CATEGORIES.filter((category) => categoryStats[category].strong);
  const weakCategories = CATEGORIES.filter((category) => categoryStats[category].weak);
  const ok = strongCategories.length === CATEGORIES.length - 1 && weakCategories.length === 1;
  const weakCategory = weakCategories[0] || '';

  return {
    ok,
    reason: ok ? 'ok' : 'power_profile_mismatch',
    strongCategories,
    weakCategories,
    weakCategory,
    installed,
    issues,
    categoryStats
  };
}

function catalogPurchaseItems() { return SHOP.filter((item) => !item.starter && !item.legacy); }
function catalogCollectionProgress() {
  const items = catalogPurchaseItems();
  const owned = items.filter((item) => !!state?.owned?.[item.id]).length;
  return { owned, total: items.length, complete: items.length > 0 && owned === items.length };
}
function doubleCollectionProgress() {
  const items = catalogPurchaseItems();
  const owned = items.filter((item) => !!state?.owned?.[item.id] && !!state?.blackMarketOwned?.[item.id]).length;
  return { owned, total: items.length, complete: items.length > 0 && owned === items.length };
}
function blackAssemblyAchievementMet() {
  if (!state) return false;
  const issues = checkCompatibility();
  if (issues.length) return false;
  return CATEGORIES.every((category) => {
    const item = installedItem(category);
    return !!item && installedSourceFor(category) === 'black' && !!state.blackMarketOwned?.[item.id] && !isSourceItemBroken(item, 'black');
  });
}
function achievementRequirementsMet(achievement, options = {}) {
  if (achievement.type === 'money') return Number(state?.money || 0) >= Number(achievement.target || 0);
  if (achievement.type === 'bottleneck') return bottleneckAchievementState().ok;
  if (achievement.type === 'event_streak') return getBlackFridayStreak() >= Number(achievement.target || 3);
  if (achievement.type === 'collection') return catalogCollectionProgress().complete;
  if (achievement.type === 'super_buy') return !!state?.superBuy;
  if (achievement.type === 'black_assembly') return blackAssemblyAchievementMet();
  if (achievement.type === 'double_collection') return doubleCollectionProgress().complete;
  if (achievement.type === 'exam_score') return options.examCompleted === true && Number(options.examScore) >= Number(achievement.target || 95);
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
  // Глобальное хранилище — единственный источник истины для достижений.
  // Не возвращаем флаги из старого сейва, иначе после ручного сброса ачивка
  // снова появлялась при загрузке/выходе из сохранения.
  const global = loadGlobalAchievements();
  state.achievements = { ...global };
  return global;
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

function checkAchievements(options = {}) {
  if (!state) { updateAchievementMenuButton(); return []; }
  const global = syncAchievementsFromGlobal();
  const unlocked = { ...global };
  const unlockedNow = [];
  ACHIEVEMENTS.forEach((achievement) => {
    if (!unlocked[achievement.id] && achievementRequirementsMet(achievement, options)) {
      unlocked[achievement.id] = true;
      unlockedNow.push(achievement.id);
    }
  });
  const merged = saveGlobalAchievements(unlocked);
  state.achievements = { ...merged };
  updateAchievementMenuButton();
  if (unlockedNow.length) {
    save();
    if (!options.deferCelebration) {
      unlockedNow.forEach((id) => {
        const achievement = ACHIEVEMENTS.find((item) => item.id === id);
        showAchievementCelebration(achievement);
      });
    }
  }
  if ($('achievementsModal') && !$('achievementsModal').classList.contains('hidden')) renderAchievements();
  return unlockedNow;
}

function achievementProgressData(achievement, unlocked = isAchievementUnlocked(achievement.id)) {
  if (unlocked) return { current: 1, total: 1, label: '100% выполнено' };
  if (achievement.type === 'money') {
    const total = Number(achievement.target || 0);
    return { current: Math.max(0, Math.min(Number(state?.money || 0), total)), total, label: '$' };
  }
  if (achievement.type === 'event_streak') {
    const total = Number(achievement.target || 3);
    return { current: Math.max(0, Math.min(getBlackFridayStreak(), total)), total, label: 'Чёрные пятницы подряд' };
  }
  if (achievement.type === 'collection') {
    const p = catalogCollectionProgress();
    return { current: p.owned, total: p.total, label: 'предметов каталога' };
  }
  if (achievement.type === 'black_assembly') {
    const current = CATEGORIES.filter((category) => installedSourceFor(category) === 'black' && !!installedItem(category) && !!state?.blackMarketOwned?.[installedItem(category)?.id] && !isSourceItemBroken(installedItem(category), 'black')).length;
    return { current, total: CATEGORIES.length, label: 'деталей с чёрного рынка' };
  }
  if (achievement.type === 'double_collection') {
    const p = doubleCollectionProgress();
    return { current: p.owned, total: p.total, label: 'пар деталей' };
  }
  if (achievement.type === 'exam_score') {
    const total = Number(achievement.target || 95);
    const current = Math.max(0, Math.min(Number(state?.examBestScore || 0), total));
    return { current, total, label: 'баллов экзамена' };
  }
  if (achievement.type === 'super_buy') return { current: 0, total: 1, label: 'особое условие' };
  if (achievement.type === 'bottleneck') return { current: 0, total: 1, label: 'условие сборки' };
  if (Array.isArray(achievement.requirements) && achievement.requirements.length) {
    const current = achievement.requirements.filter((req) => achievementRequirementState(req).ok).length;
    return { current, total: achievement.requirements.length, label: 'требований' };
  }
  return { current: 0, total: 1, label: 'условие' };
}
function renderAchievementProgress(achievement, unlocked) {
  const p = achievementProgressData(achievement, unlocked);
  const percent = unlocked ? 100 : (p.total ? Math.min(100, Math.max(0, p.current / p.total * 100)) : 0);
  const label = unlocked ? '100% выполнено' : `${p.current} / ${p.total} ${p.label}`;
  return `<div class="achievement-progress"><div class="achievement-progress-label">${label}</div><div class="achievement-progress-bar"><span style="width:${percent}%"></span></div></div>`;
}
function renderAchievements() {
  syncAchievementsFromGlobal();
  const wrap = $('achievementList');
  if (!wrap) return;
  const childIds = new Set(ACHIEVEMENTS.filter((achievement) => achievement.parent).map((achievement) => achievement.id));
  const parents = ACHIEVEMENTS.filter((achievement) => !childIds.has(achievement.id)).sort((a, b) => {
    const au = isAchievementUnlocked(a.id), bu = isAchievementUnlocked(b.id);
    if (au !== bu) return au ? 1 : -1;
    return ACHIEVEMENTS.indexOf(a) - ACHIEVEMENTS.indexOf(b);
  });
  wrap.innerHTML = parents.map((achievement) => {
    const unlocked = isAchievementUnlocked(achievement.id);
    let body = renderAchievementProgress(achievement, unlocked);
    if (achievement.id === 'order_empire') {
      const child = ACHIEVEMENTS.find((item) => item.parent === achievement.id);
      if (child) {
        const childUnlocked = isAchievementUnlocked(child.id);
        const expanded = orderEmpireExpanded;
        body += `<div class="achievement-child-toggle"><button class="achievement-child-arrow ${expanded ? 'expanded' : ''}" data-achievement-expand="${achievement.id}" aria-expanded="${expanded ? 'true' : 'false'}" title="Показать Go beyond...">⌄</button><span>Go beyond...</span></div><div class="achievement-child-wrap ${expanded ? 'expanded' : ''}"><article class="achievement-card achievement-child ${childUnlocked ? 'unlocked' : 'locked'}"><div class="achievement-card-head"><div class="achievement-icon">${child.icon}</div><div class="achievement-title-wrap"><h3>${child.name}</h3><p>${child.description}</p></div><span class="achievement-status">${childUnlocked ? '✅ Получено' : '🔒 Заблокировано'}</span></div>${renderAchievementProgress(child, childUnlocked)}</article></div>`;
      }
    }
    return `<article class="achievement-card ${unlocked ? 'unlocked' : 'locked'}"><div class="achievement-card-head"><div class="achievement-icon">${achievement.icon}</div><div class="achievement-title-wrap"><h3>${achievement.name}</h3><p>${achievement.description}</p></div><span class="achievement-status">${unlocked ? '✅ Получено' : '🔒 Заблокировано'}</span></div>${body}</article>`;
  }).join('');
  wrap.querySelectorAll('[data-achievement-expand]').forEach((btn) => btn.addEventListener('click', () => { orderEmpireExpanded = !orderEmpireExpanded; renderAchievements(); }));
  updateAchievementMenuButton();
}
function openAchievements() {
  syncAchievementsFromGlobal();
  checkAchievements();
  openMenuModal('achievementsModal');
  renderAchievements();
  updateAchievementMenuButton();
}

