function render() {
  ensureMarket();
  $('mainMenuScreen').classList.add('hidden'); $('modeScreen').classList.add('hidden'); $('gameScreen').classList.remove('hidden');
  setMoneyVisible(true);
  $('money').textContent = formatMoney(state.money); $('money').classList.toggle('debt-balance', Number(state.money) < 0); $('modeLabel').textContent = MODE_CONFIG[state.mode].label; renderPcCoupons();
  state.power = currentPower(); $('power').textContent = state.power; renderRewardInfo(); renderGamePicker(); renderEarnTabs(); renderMarketEventBanner();
  syncAfkComponents();
  renderBlackMarketButton();
  renderLightModeUI();
  renderLightExamButton();
  $('pcParts').innerHTML = activeCategories().map((category) => { const item = installedItem(category); const broken = !!(item && isItemBroken(item)); return `<button class="part part-button ${broken ? 'part-broken' : ''}" data-part-category="${category}"><span>${displayPartLabel(category)}</span><b>${displayPartValue(category)}</b></button>`; }).join('');
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
  Cooling: ['Air', 'Liquid'],
  OS: ['Microsoft', 'Linux', 'Apple']
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
    NVIDIA: ['GT', 'GTX', 'RTX'],
    Intel: ['Arc']
  },
  RAM: { DDR3: ['Desktop'], DDR4: ['Desktop'], DDR5: ['Desktop'] },
  Storage: { HDD: ['5400 RPM', '7200 RPM'], SSD: ['SATA', 'NVMe'] },
  PSU: { Power: HARDCORE_PSU_WATTS.map((watts) => `${watts} W`) },
  Case: { Case: ['Basic', 'Airflow', 'Premium'] },
  Motherboard: {
    Intel: ['H410', 'B560', 'B660 / B760', 'Z690 / Z790', 'B860 / Z890', 'Z790 / Z890 High Capacity'],
    AMD: ['A320', 'B450 / B550', 'B650 / X670 / X870', 'X870 High Capacity']
  },
  Cooling: { Air: ['Stock', 'Tower'], Liquid: ['AIO'] },
  OS: { Microsoft: ['Windows XP', 'Windows Vista', 'Windows 7', 'Windows 8.1', 'Windows 10', 'Windows 11'], Linux: ['Linux'], Apple: ['macOS'] }
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
  const items = SHOP.filter((item) => !item.starter && !item.legacy && !item.hardcoreOnly && item.category === category);
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
  if (isLightMode()) lightCoachEvent('info','Замена деталей',`Здесь ты выбираешь деталь той же категории вместо установленной. В Лайте удобно пробовать разные варианты: после установки я проверю, совместима ли новая деталь с остальными компонентами.`,7000,true);
}
function openCatalog() {
  shopView = 'catalog'; replacementCategory = null;
  if (!isLightMode()) ensureMarket(); const modal = $('shopModal'); modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); renderShopWindow();
  if (isLightMode()) lightCoachEvent('info','Каталог комплектующих',`В Лайт-режиме здесь фиксированные базовые цены и все обычные детали доступны постоянно. Никаких рыночных наценок, SOLD OUT или рероллов нет. Выбери деталь, которую хочешь изучить или купить.`,7000,true);
}
function openBlackMarket() {
  if (isLightMode()) return;
  ensureBlackMarket();
  if (!blackMarketAvailable()) { renderBlackMarketButton(); return; }
  shopView = 'blackmarket'; replacementCategory = null;
  const modal = $('shopModal'); modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); renderShopWindow();
}
function renderBlackMarketButton() {
  const btn = $('openBlackMarketBtn');
  if (!btn || !state) return;
  if (isLightMode()) { btn.classList.add('hidden'); btn.disabled = true; return; }
  btn.classList.remove('hidden');
  const available = blackMarketAvailable();
  btn.disabled = !available;
  btn.classList.toggle('black-market-ready', available);
  btn.classList.toggle('black-market-locked', !available);
  btn.textContent = available ? '🕷️ Чёрный рынок' : '⛓️ Чёрный рынок';
  btn.title = available ? 'Чёрный рынок доступен до следующего реролла.' : 'В этом реролле шанс 25% не сработал. Жди следующий реролл.';
}
function renderMarketEventBanner() {
  const banner = $('marketEventBanner');
  if (!banner) return;
  if (isLightMode()) { banner.innerHTML = ''; banner.classList.remove('active','event-break'); return; }
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
  if (isLightMode()) { if (meta) meta.textContent = 'Лайт-режим: базовые цены · все детали доступны'; return; }
  const couponText = Number(state?.couponPercent) > 0 ? ` • 🎟 Купон -${state.couponPercent}%` : '';
  const extraCouponText = state?.extraCoupon ? ' • 🎟️ EXTRA COUPON' : '';
  if (meta) meta.textContent = `Рынок обновляется каждые 2 минуты • следующий рерол через ${marketSecondsLeft()} с. • событие через ${eventSecondsLeft()} с.${couponText}${extraCouponText}`;
  renderMarketEventBanner();
}

function renderShopWindow() {
  const title = $('shopWindowTitle');
  const modalWindow = document.querySelector('.shop-window');
  modalWindow?.classList.toggle('black-market-window', shopView === 'blackmarket');
  if (shopView === 'replacement') {
    title.textContent = `🔧 Замена — ${state.mode === 'easy' || isLightMode() ? MAIN_PART_LABELS_EASY[replacementCategory] : replacementCategory}`;
    renderReplacement(); updateShopRefreshTimer(); return;
  }
  if (shopView === 'blackmarket') {
    if (!blackMarketAvailable()) { closeShop(); return; }
    title.textContent = '🕷️ Чёрный рынок';
  } else {
    title.textContent = '🛒 Каталог комплектующих';
  }
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
  normaliseStarterProtection();
  const entries = inventoryEntriesIn(category).sort((a, b) => {
    const perf = (Number(a.item.performance) || 0) - (Number(b.item.performance) || 0);
    if (perf !== 0) return perf;
    return String(a.item.name).localeCompare(String(b.item.name), 'ru');
  });
  const installedId = state.installed?.[category];
  const installedSource = installedSourceFor(category);
  const body = entries.length
    ? `<div class="catalog-title">Купленные детали этого типа. Источник указан рядом с производителем.</div><div class="shop-items-grid">${entries.map(({ item, source }) => {
      const installed = item.id === installedId && source === installedSource;
      const broken = isSourceItemBroken(item, source);
      const info = brokenInfoFor(item, source);
      const brokenText = broken ? `<span class="price-change up">ПОВРЕЖДЕНО ${info.damage}%</span>` : '';
      const starterBlocked = source === 'catalog' && isStarterProtected(item);
      const sourceMarkup = `<span class="inventory-source ${source === 'black' ? 'inventory-source-black' : 'inventory-source-catalog'}">${sourceLabel(source)}</span>`;
      const sellButton = starterBlocked
        ? `<button class="small shop-buy danger" disabled>Продажа запрещена</button>`
        : `<button class="small shop-buy danger" data-sell="${item.id}" data-sell-source="${source}">Продать за $${formatMoney(salePriceFor(item.id, source))}</button>`;
      let buttonHtml;
      if (broken) {
        buttonHtml = `<div class="shop-actions"><button class="small shop-buy" data-repair="${item.id}" data-repair-source="${source}">Починить за $${formatMoney(repairCost(item, source))}</button>${sellButton}</div>`;
      } else {
        const installButton = installed ? `<button class="small shop-buy" disabled>Установлено</button>` : `<button class="small shop-buy" data-install="${item.id}" data-install-source="${source}">Установить</button>`;
        buttonHtml = `<div class="shop-actions">${installButton}${sellButton}</div>`;
      }
      return `<div class="shop-item ${installed ? 'installed-item' : ''} ${broken ? 'broken-item' : ''}"><div><div class="item-name">${item.name}</div><div class="item-desc">${item.desc}</div><div class="price-line"><span class="base-price">Производительность: +${item.performance}</span>${manufacturerMarkup(item)}${sourceMarkup}${installed && !broken ? '<span class="price-change down">УСТАНОВЛЕНО</span>' : ''}${brokenText}</div></div>${buttonHtml}</div>`;
    }).join('')}</div>`
    : `<div class="empty-catalog">У тебя пока нет купленных деталей этого типа.</div>`;
  $('shopItems').innerHTML = `<div class="catalog-breadcrumb"><button class="small" id="backToCatalog">← В каталог</button><b>${CATEGORY_LABELS[category]}</b></div>${body}`;
  $('backToCatalog').onclick = openCatalog;
  document.querySelectorAll('[data-install]').forEach((btn) => { btn.onclick = () => installItem(btn.dataset.install, btn.dataset.installSource || 'catalog'); });
  document.querySelectorAll('[data-repair]').forEach((btn) => { btn.onclick = () => openRepairConfirm(btn.dataset.repair, btn.dataset.repairSource || 'catalog'); });
  document.querySelectorAll('[data-sell]').forEach((btn) => { btn.onclick = () => sellItem(btn.dataset.sell, btn.dataset.sellSource || 'catalog'); });
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
  const wrap = $('shopItems'); const catalog = getCatalogState(); const mode = catalogMode(); const black = shopView === 'blackmarket';
  const categories = isLightMode() ? LIGHT_CATEGORIES : (mode === 'hardcore' ? Object.keys(HARDCORE_CATALOG) : (mode === 'normal' ? NORMAL_CATEGORIES : EASY_CATEGORIES));
  const tabs = categories.map((category) => `<button class="catalog-tab${catalog.category === category ? ' active' : ''}" data-cat="${category}">${CATEGORY_LABELS[category]}</button>`).join('');
  let body = '';
  if (isLightMode()) {
    catalog.group = null; catalog.series = null;
    body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]} · базовая цена</div>${renderShopItems(SHOP.filter((item) => !item.starter && !item.legacy && !item.hardcoreOnly && item.category === catalog.category), true)}`;
  } else if (mode === 'hardcore') {
    // В Хардкоре БП показываются одной общей лентой по мощности — без промежуточных разделов.
    if (catalog.category === 'PSU') {
      catalog.group = null; catalog.series = null;
      body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]} · мощность</div>${renderShopItems(hardcorePsuWattageItems(), true)}`;
    } else {
      const branches = HARDCORE_CATALOG[catalog.category] || {}; const group = catalog.group; const series = catalog.series;
      const groups = orderedCatalogGroups(catalog.category, branches);
      if (!group) {
        body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]} → выбери производителя / тип</div><div class="catalog-tree">${groups.map((key) => {
          const count = (branches[key] || []).length;
          const countLabel = catalog.category === 'OS' ? `${count} ОС` : `${count} сер.`;
          return `<button class="catalog-node" data-group="${key}"><strong>${key}</strong><span>${countLabel}</span></button>`;
        }).join('')}</div>`;
      } else if (catalog.category === 'OS') {
        const osItems = SHOP.filter((item) => !item.starter && !item.legacy && item.category === 'OS' && item.group === group);
        body = `<div class="catalog-breadcrumb"><button class="small" data-catalog-back="group">← ${CATEGORY_LABELS[catalog.category]}</button><b>${group}</b></div>${renderShopItems(sortByPower(osItems))}`;
      } else if (!series) {
        const seriesList = orderedCatalogSeries(catalog.category, group, branches);
        body = `<div class="catalog-breadcrumb"><button class="small" data-catalog-back="group">← ${CATEGORY_LABELS[catalog.category]}</button><b>${group}</b></div><div class="catalog-tree">${seriesList.map((key) => `<button class="catalog-node" data-series="${key}"><strong>${key}</strong><span>Открыть</span></button>`).join('')}</div>`;
      } else {
        const seriesItems = SHOP.filter((item) => !item.starter && !item.legacy && item.category === catalog.category && !item.hardcoreOnly && item.group === group && item.series === series);
        body = `<div class="catalog-breadcrumb"><button class="small" data-catalog-back="series">← ${group}</button><b>${series}</b></div>${renderShopItems(seriesItems)}`;
      }
    }
  } else if (mode === 'normal') {
    catalog.group = null; catalog.series = null;
    body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]}</div>${renderShopItems(orderedNormalItems(catalog.category), true)}`;
  } else {
    body = `<div class="catalog-title">${CATEGORY_LABELS[catalog.category]}</div>${renderShopItems(SHOP.filter((item) => !item.starter && !item.hardcoreOnly && item.category === catalog.category))}`;
  }
  const viewMarker = black
    ? '<span class="black-market-breadcrumb-chip">🕷️ Чёрный рынок</span>'
    : '<button class="small active-mini" id="catalogViewBtn">Каталог</button>';
  wrap.innerHTML = `<div class="catalog-tabs">${tabs}</div><div class="catalog-view-links">${viewMarker}</div>${body}`;
  if (!black && $('catalogViewBtn')) $('catalogViewBtn').onclick = openCatalog;
  wrap.querySelectorAll('[data-cat]').forEach((btn) => btn.addEventListener('click', () => { catalog.category = btn.dataset.cat; catalog.group = null; catalog.series = null; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-group]').forEach((btn) => btn.addEventListener('click', () => { catalog.group = btn.dataset.group; catalog.series = null; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-series]').forEach((btn) => btn.addEventListener('click', () => { catalog.series = btn.dataset.series; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-catalog-back]').forEach((btn) => btn.addEventListener('click', () => { if (btn.dataset.catalogBack === 'group') catalog.group = null; if (btn.dataset.catalogBack === 'series') catalog.series = null; save(); renderCatalog(); }));
  wrap.querySelectorAll('[data-buy]').forEach((btn) => btn.addEventListener('click', () => black ? buyBlackMarket(btn.dataset.buy) : buy(btn.dataset.buy)));
  wrap.querySelectorAll('[data-install]').forEach((btn) => btn.addEventListener('click', () => installItem(btn.dataset.install, black ? 'black' : 'catalog')));
  wrap.querySelectorAll('[data-sell]').forEach((btn) => btn.addEventListener('click', () => sellItem(btn.dataset.sell, btn.dataset.sellSource || (black ? 'black' : 'catalog'))));
  wrap.querySelectorAll('[data-extra-buy]').forEach((btn) => btn.addEventListener('click', () => openExtraCouponPurchaseModal(btn.dataset.extraBuy)));
}

function isHardcorePsuItem(item) {
  return state?.mode === 'hardcore' && item?.category === 'PSU' && item?.hardcoreOnly;
}
function hardcorePsuWattageItems() {
  return HARDCORE_PSU_WATTS.map((watts) => hardcorePsuVariantsForWatts(watts).find((item) => item.psuCertificate === 'standard')).filter(Boolean);
}
function hardcorePsuPriceRange(watts) {
  const variants = hardcorePsuVariantsForWatts(watts);
  const prices = variants.map((item) => Number(item.basePrice) || 0).filter((price) => price > 0);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
function renderShopItems(items, preserveOrder = false) {
  const black = shopView === 'blackmarket';
  const workingItems = [...items];
  const sortedItems = preserveOrder ? workingItems : sortByPower(workingItems);
  if (!sortedItems.length) return `<div class="empty-catalog">В этом разделе пока ничего нет.</div>`;
  return `<div class="shop-items-grid">${sortedItems.map((item) => {
    const hardcorePsu = isHardcorePsuItem(item);
    const watts = Number(item.psuWattage || 0);
    const ownedVariant = hardcorePsu ? hardcorePsuOwnedVariant(watts) : null;
    const installedVariant = hardcorePsu ? hardcorePsuInstalledVariant(watts) : null;
    const displayItem = ownedVariant || installedVariant || item;
    const normalOwned = hardcorePsu ? !!ownedVariant : !!state.owned?.[item.id];
    const blackOwned = !!state.blackMarketOwned?.[item.id];
    const bought = black ? blackOwned : normalOwned;
    const installed = hardcorePsu ? !!installedVariant : (state.installed?.[item.category] === item.id && installedSourceFor(item.category) === (black ? 'black' : 'catalog'));
    const marketItem = black ? blackMarketEntry(item.id) : (isLightMode() ? { available: true, price: item.basePrice, change: 0 } : state.market.items[item.id]);
    const unavailable = isLightMode() ? false : !marketItem?.available;
    const range = hardcorePsu ? hardcorePsuPriceRange(watts) : null;
    const priceText = hardcorePsu ? `от $${formatMoney(range.min)}` : (marketItem?.price?.toLocaleString(currentLanguage() === 'ru' ? 'ru-RU' : 'en-US') || '—');
    const change = Number(marketItem?.change ?? 0);
    const changeClass = black ? 'down' : (change > 0 ? 'up' : change < 0 ? 'down' : 'flat');
    const changeText = hardcorePsu ? (currentLanguage() === 'en' ? 'Certificate selected at purchase' : 'сертификат выбирается при покупке') : (isLightMode() ? (currentLanguage() === 'en' ? '0% · no markup' : '0% · без наценки') : (black ? `${Number(marketItem?.markup || 0) >= 0 ? '+' : ''}${Number(marketItem?.markup || 0)}% ${currentLanguage() === 'en' ? 'markup from Black Market base' : 'наценка от чёрной базы'}` : (change > 0 ? `+${change}%` : `${change}%`)));
    const compatibilityStatus = black || hardcorePsu ? 'neutral' : itemCompatibilityStatus(item);
    const compatibilityMarkup = compatibilityStatus !== 'neutral' ? `<span class="compatibility-tag compatibility-${compatibilityStatus}">${compatibilityStatusText(compatibilityStatus)}</span>` : '';
    const effectivePerf = effectiveItemPerformance(displayItem);
    const storagePenalty = storagePerformancePenaltyPercent(displayItem);
    const performanceMarkup = storagePenalty ? `<span class="price-change up">SSD -${storagePenalty}% от скорости/мощности платы</span>` : `<span class="base-price">+${effectivePerf} мощности</span>`;
    const blackBaseMarkup = black ? `<span class="black-market-price-note">−50% от базы</span>` : '';
    const displayName = hardcorePsu ? `БП ${watts} W` : displayItem.name;
    const certMarkup = hardcorePsu && ownedVariant ? `<span class="price-change flat">${ownedVariant.psuCertificateLabel || ownedVariant.name}</span>` : '';
    let buttonHtml = '';
    if (bought) {
      const actionId = hardcorePsu ? (ownedVariant?.id || item.id) : item.id;
      const sellSource = black ? 'black' : 'catalog';
      const installButton = installed ? `<button class="small shop-buy" disabled>Установлено</button>` : `<button class="small shop-buy" data-install="${actionId}">Установить</button>`;
      const sellPrice = salePriceFor(actionId, sellSource);
      buttonHtml = `<div class="shop-actions">${installButton}<button class="small shop-buy danger" data-sell="${actionId}" data-sell-source="${sellSource}">Продать за $${formatMoney(sellPrice)}</button></div>`;
    } else if (black) {
      buttonHtml = `<button class="small shop-buy black-market-buy" data-buy="${item.id}" ${unavailable ? 'disabled' : ''}>${unavailable ? 'SOLD OUT' : `$${priceText}`}</button>`;
    } else if (hardcorePsu) {
      buttonHtml = `<button class="small shop-buy hardcore-psu-buy" data-buy="${item.id}">${priceText}</button>`;
    } else if (unavailable && state.extraCoupon) {
      buttonHtml = `<button class="small shop-buy extra-coupon-button" data-extra-buy="${item.id}">!EXTRA!</button>`;
    } else {
      buttonHtml = `<button class="small shop-buy" data-buy="${item.id}" ${unavailable ? 'disabled' : ''}>${unavailable ? 'SOLD OUT' : `$${priceText}`}</button>`;
    }
    const titleLine = hardcorePsu ? `<div class="item-name">${displayName}</div>` : `<div class="item-name">${displayName}</div>`;
    const descLine = hardcorePsu ? `<div class="item-desc">Блок питания на ${watts} W. Сертификат выбирается после нажатия «Купить».</div>` : `<div class="item-desc">${displayItem.desc}</div>`;
    const baseLine = hardcorePsu ? `<span class="base-price">${watts} W</span>` : `<span class="base-price">${currentLanguage() === 'en' ? 'Base: ' : 'База: '}$${displayItem.basePrice.toLocaleString(currentLanguage() === 'ru' ? 'ru-RU' : 'en-US')}</span>`;
    return `<div class="shop-item ${unavailable && !bought && !hardcorePsu ? 'sold-out' : ''} compatibility-item-${compatibilityStatus} ${black ? 'black-market-item' : ''} ${hardcorePsu ? 'hardcore-psu-item' : ''}"><div>${titleLine}${descLine}<div class="price-line">${baseLine}<span class="price-change ${changeClass}">${changeText}</span>${certMarkup}${blackBaseMarkup}${performanceMarkup}${compatibilityMarkup}${hardcorePsu ? '' : manufacturerMarkup(displayItem)}</div></div>${buttonHtml}</div>`;
  }).join('')}</div>`;
}

function closeShop() {
  const modal = $('shopModal'); modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true');
  document.querySelector('.shop-window')?.classList.remove('black-market-window');
  shopView = 'catalog'; replacementCategory = null;
}

