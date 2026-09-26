function normaliseLightStarterIds() {
  if (!state || state.mode !== 'light') return;
  const map = {
    'starter-easy-ram': 'ram-ddr3-8',
    'starter-easy-storage': 'storage-ssd-256-sata',
    'starter-easy-case': 'case-case-basic',
    'starter-easy-cooling': 'cooling-cooler-stock'
  };
  state.installed = state.installed || {};
  state.owned = state.owned || {};
  state.starterProtected = state.starterProtected || {};
  Object.entries(map).forEach(([oldId, newId]) => {
    if (!itemById(newId)) return;
    const category = itemById(newId).category;
    if (state.installed[category] === oldId) state.installed[category] = newId;
    if (state.owned[oldId]) {
      state.owned[newId] = true;
      delete state.owned[oldId];
    }
    if (state.starterProtected[oldId]) {
      state.starterProtected[newId] = true;
      delete state.starterProtected[oldId];
    }
    if (state.broken?.[oldId]) {
      state.broken[newId] = state.broken[oldId];
      delete state.broken[oldId];
    }
  });
}

function ensureRequiredModeStarters() {
  if (!state || !MODE_CONFIG[state.mode]) return;
  normaliseLightStarterIds();
  const start = MODE_CONFIG[state.mode].start || {};
  state.installed = state.installed || {};
  state.owned = state.owned || {};
  state.starterProtected = state.starterProtected || {};

  // Сложный режим всегда должен иметь стартовый Intel Pentium J2900.
  // Старые/битые ID или пустое поле CPU считаем потерянным стартовым CPU и восстанавливаем его.
  if (state.mode === 'hard') {
    const cpuId = state.installed.CPU;
    const cpu = itemById(cpuId);
    if (!cpu || cpu.category !== 'CPU') {
      state.installed.CPU = 'cpu-j2900';
    }
    state.owned['cpu-j2900'] = true;
    state.starterProtected['cpu-j2900'] = true;
    delete state.owned['starter-hard-cpu'];
    delete state.owned['cpu-pentium-j2900'];
  }

  // Для остальных категорий не восстанавливаем заменённые детали: это только страховка
  // от пустого/невалидного стартового ID в новой игре или старом сохранении.
  for (const [category, id] of Object.entries(start)) {
    if (!id || category === 'CPU' && state.mode === 'hard') continue;
    const current = state.installed[category];
    if (current == null || (current !== null && !itemById(current))) state.installed[category] = id;
    if (state.installed[category] === id) {
      state.owned[id] = true;
      state.starterProtected[id] = true;
    }
  }
}

function normaliseStarterProtection() {
  if (!state) return;
  if (!state.starterProtected || typeof state.starterProtected !== 'object') state.starterProtected = {};
  const start = MODE_CONFIG[state.mode]?.start || {};
  Object.values(start).forEach((id) => {
    if (id && state.owned?.[id]) state.starterProtected[id] = true;
  });
  if (state.owned?.['starter-hard-storage']) state.starterProtected['storage-hdd-120'] = true;
}
function isStarterProtected(item) {
  return !!(item && (item.starter || state?.starterProtected?.[item.id]));
}
function inventoryEntriesIn(category) {
  const result = [];
  SHOP.filter((item) => item.category === category && state?.owned?.[item.id]).forEach((item) => result.push({ item, source: 'catalog' }));
  SHOP.filter((item) => item.category === category && state?.blackMarketOwned?.[item.id]).forEach((item) => result.push({ item, source: 'black' }));
  return result;
}
function inventoryCategoryCount(category) {
  return inventoryEntriesIn(category).length;
}
function sourceLabel(source) { const en = localStorage.getItem('pcBuilder_language') !== 'ru'; return source === 'black' ? (en ? 'Black Market' : 'Чёрный рынок') : (en ? 'Catalog' : 'Каталог'); }
function openSellBlockedModal(title, message) {
  const modal = $('sellBlockedModal'), content = $('sellBlockedContent'), titleEl = $('sellBlockedTitle');
  if (!modal || !content) return;
  if (titleEl) titleEl.textContent = title || '🚫 Продажа запрещена';
  content.innerHTML = `<div class="sell-blocked-card"><div class="sell-blocked-icon">🚫</div><h3>Продать эту деталь нельзя</h3><p>${message}</p></div>`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeSellBlockedModal() {
  const modal = $('sellBlockedModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function migrateState(previous) {
  const config = MODE_CONFIG[previous.mode];
  const migrated = {
    mode: previous.mode,
    money: Number(previous.money) || 0,
    baseReward: Number(previous.baseReward) || config.baseReward,
    owned: {},
    installed: { ...startBuild },
    catalog: previous.catalog || { category: 'GPU', group: null, series: null },
    market: previous.market || createMarket(),
    broken: previous.broken ? { ...previous.broken } : {},
    blackMarketBroken: previous.blackMarketBroken ? { ...previous.blackMarketBroken } : {},
    blackMarketOwned: previous.blackMarketOwned ? { ...previous.blackMarketOwned } : {},
    installedSource: previous.installedSource ? { ...previous.installedSource } : {},
    blackMarket: previous.blackMarket ? { ...previous.blackMarket } : null,
    achievements: previous.achievements ? { ...previous.achievements } : {},
    afkComponents: previous.afkComponents ? { ...previous.afkComponents } : { CPU: true, Storage: false, GPU: false },
    couponPercent: Number(previous.couponPercent) >= 10 ? Math.min(80, Number(previous.couponPercent)) : null,
    extraCoupon: !!previous.extraCoupon,
    superBuy: !!previous.superBuy,
    programmingStats: previous.programmingStats && typeof previous.programmingStats === 'object' ? { ...previous.programmingStats } : { completed: 0 },
    starterProtected: previous.starterProtected && typeof previous.starterProtected === 'object' ? { ...previous.starterProtected } : {},
  };

  if (previous.owned) migrated.owned = { ...previous.owned };
  if (previous.bought) Object.keys(previous.bought).forEach((id) => {
    const mapped = LEGACY_ID_MAP[id] || id;
    migrated.owned[mapped] = true;
  });
  migrateLegacyIds(migrated);

  if (previous.os) {
    const legacyOsId = LEGACY_ID_MAP[previous.os] || previous.os;
    if (itemById(legacyOsId)?.category === 'OS') migrated.installed.OS = legacyOsId;
  }
  if (!itemById(migrated.installed.OS)) migrated.installed.OS = config.start.OS;
  migrated.owned[migrated.installed.OS] = true;

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
  migrated.installedSource = migrated.installedSource || {};
  CATEGORIES.forEach((category) => { migrated.installedSource[category] = migrated.installedSource[category] === 'black' ? 'black' : 'catalog'; });
  state = migrated;
  ensureRequiredModeStarters();
  ensureMarket();
  state.power = currentPower();
  save();
}

function start(mode) {
  cancelOsInstall();
  const config = MODE_CONFIG[mode];
  const startBuild = mode === 'light' ? { ...LIGHT_START_BUILD } : { ...(config.start || {}) };
  state = {
    mode,
    money: config.money,
    baseReward: config.baseReward,
    owned: {},
    installed: { ...config.start },
    catalog: { category: 'GPU', group: null, series: null },
    market: isLightMode() ? null : createMarket(),
    broken: {},
    blackMarketBroken: {},
    blackMarketOwned: {},
    installedSource: Object.fromEntries(CATEGORIES.map((category) => [category, 'catalog'])),
    blackMarket: null,
    achievements: {},
    afkComponents: { CPU: true, Storage: false, GPU: false },
    couponPercent: null,
    extraCoupon: false,
    superBuy: false,
    programmingStats: { completed: 0 },
    starterProtected: {},
    lightClickerCount: 0,
    lightTrainingEnabled: false,
    knowledgeLightTraining: null,
  };
  Object.values(startBuild).forEach((id) => { if (id) { state.owned[id] = true; state.starterProtected[id] = true; } });
  ensureRequiredModeStarters();
  state.power = currentPower();
  activeEarnTab = 'games';
  localStorage.setItem(EARN_TAB_KEY, activeEarnTab);
  closeGame();
  closeShop();
  save();
  render();
}

let pendingPurchaseItemId = null;
let pendingExtraPurchaseItemId = null;
let hardcorePsuPurchasePending = null;
let osInstallTimer = null;
let osInstallProgressTimer = null;
let osInstallItemId = null;
let osInstallSource = 'catalog';
function couponAppliedPrice(marketPrice) {
  const coupon = Number(state?.couponPercent) || 0;
  return coupon > 0 ? Math.max(1, Math.ceil(Number(marketPrice) * (1 - coupon / 100))) : Math.max(1, Number(marketPrice));
}
function purchaseItem(itemId, useCoupon = false) {
  if (isLightMode()) {
    const item = itemById(itemId);
    if (!item || item.starter || item.legacy || state.owned?.[item.id]) return false;
    const price = Math.max(1, Number(item.basePrice) || 0);
    if (state.money < price) { $('gameResult').textContent = `Не хватает денег. Сейчас это стоит $${formatMoney(price)}.`; return false; }
    state.money -= price;
    state.owned[item.id] = true;
    $('gameResult').textContent = `Куплено: ${item.name} за $${formatMoney(price)}. Деталь отправлена в инвентарь.`;
    save(); render();
    lightCoachAfterAction('purchase', item);
    return true;
  }
  if (isPurchaseBlockedByDebt()) return false;
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
  const unlockedNow = checkAchievements({ deferCelebration: true });
  save();
  closePurchaseCouponModal();
  render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  if (unlockedNow.length) {
    const names = unlockedNow.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean);
    $('gameResult').textContent += ` 🏆 Получено достижение: ${names.join(', ')}.`;
    unlockedNow.forEach((id) => {
      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      setTimeout(() => showAchievementCelebration(achievement), 0);
    });
  }
  return true;
}
function salePriceFor(itemId, source = 'catalog') {
  const item = itemById(itemId);
  if (state?.mode === 'hardcore' && item?.hardcoreOnly && item.category === 'PSU') {
    return Math.max(1, Math.floor((Number(item.basePrice) || 0) * 0.8));
  }
  if (isLightMode()) {
    if (!item || item.starter || item.legacy) return 0;
    return Math.max(1, Math.floor((Number(item.basePrice) || 0) * 0.8));
  }
  ensureMarket();
  if (!item || item.starter || item.legacy) return 0;
  if (source === 'black') {
    const regularMarket = state?.market?.items?.[itemId];
    const catalogPrice = Math.max(1, Number(regularMarket?.price) || Number(item.basePrice) || 0);
    return Math.max(1, Math.floor(catalogPrice * 0.8));
  }
  const marketItem = state?.market?.items?.[itemId];
  if (!marketItem) return 0;
  const currentPrice = Math.max(1, Number(marketItem.price) || Number(item.basePrice) || 0);
  return Math.max(1, Math.floor(currentPrice * 0.8));
}

let pendingBlackMarketSale = null;
function isBlackMarketPoliceWarningEnabled() {
  return getSettings().blackMarketPoliceWarning !== false;
}
function setBlackMarketPoliceWarningEnabled(enabled) {
  const settings = getSettings();
  settings.blackMarketPoliceWarning = enabled !== false;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  loadSettings();
}
function closeBlackMarketPoliceWarning() {
  const modal = $('blackMarketPoliceWarningModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  pendingBlackMarketSale = null;
}
function openBlackMarketPoliceWarning(itemId) {
  const modal = $('blackMarketPoliceWarningModal');
  if (!modal) return;
  const item = itemById(itemId);
  if (!item) return;
  pendingBlackMarketSale = { itemId, source: 'black' };
  const checkbox = $('blackMarketPoliceDontShow');
  if (checkbox) checkbox.checked = false;
  const content = $('blackMarketPoliceWarningContent');
  if (content) content.innerHTML = `<p>⚠ Продажа детали <b>${item.name}</b> с чёрного рынка привлекает внимание полиции.</p><p>Шанс быть обнаруженным при продаже — <b>20%</b>. При обнаружении штраф составит <b>$10 000</b>.</p>`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function confirmBlackMarketPoliceSale() {
  const pending = pendingBlackMarketSale ? { ...pendingBlackMarketSale } : null;
  if (!pending) return;
  const dontShow = !!$('blackMarketPoliceDontShow')?.checked;
  closeBlackMarketPoliceWarning();
  if (dontShow) setBlackMarketPoliceWarningEnabled(false);
  performSellItem(pending.itemId, pending.source);
}
function performSellItem(itemId, source = 'catalog') {
  ensureMarket();
  const item = itemById(itemId);
  const owned = source === 'black' ? !!state?.blackMarketOwned?.[itemId] : !!state?.owned?.[itemId];
  if (!item || item.legacy || !owned) return false;
  normaliseStarterProtection();
  if (source === 'catalog' && isStarterProtected(item)) {
    openSellBlockedModal('🚫 Стартовая деталь', `Стартовую деталь <b>${item.name}</b> нельзя продать из инвентаря. Она является частью начальной сборки.`);
    return false;
  }
  if (inventoryCategoryCount(item.category) <= 1) {
    openSellBlockedModal('🚫 Продажа запрещена', `У тебя только одна деталь категории «${CATEGORY_LABELS[item.category] || item.category}». Нельзя продать единственную деталь этого типа.`);
    return false;
  }
  const salePrice = salePriceFor(itemId, source);
  state.money += salePrice;
  if (state.installed?.[item.category] === item.id && installedSourceFor(item.category) === source) {
    state.installed[item.category] = null;
    state.installedSource[item.category] = 'catalog';
    state.power = currentPower();
    if (typeof syncAfkComponents === 'function') syncAfkComponents();
    if (typeof stopAfk === 'function') stopAfk();
  }
  const ownedMap = source === 'black' ? state.blackMarketOwned : state.owned;
  delete ownedMap[item.id];
  delete sourceBrokenMap(source)[item.id];
  const police = source === 'black' && Math.random() < 0.20;
  $('gameResult').textContent = `💵 Продано: ${item.name} (${sourceLabel(source)}) за $${formatMoney(salePrice)}.`;
  save();
  checkAchievements();
  render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  if (police) openBlackMarketPoliceFine();
  return true;
}
function sellItem(itemId, source = 'catalog') {
  const item = itemById(itemId);
  if (source === 'black' && item && isBlackMarketPoliceWarningEnabled()) {
    openBlackMarketPoliceWarning(itemId);
    return false;
  }
  return performSellItem(itemId, source);
}
function openBlackMarketPoliceFine() {
  const modal = $('blackMarketPoliceFineModal');
  if (!modal) return;
  const status = $('blackMarketPoliceFineStatus');
  const balance = Number(state?.money) || 0;
  if (status) status.innerHTML = `🚨 Полиция тебя обнаружила при продаже детали с чёрного рынка.<br><br>Штраф: <b>$10 000</b>.<br>Баланс сейчас: <b>$${formatMoney(balance)}</b>. После оплаты баланс может стать отрицательным.`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function payBlackMarketPoliceFine() {
  if (!state) return;
  state.money -= 10000;
  save();
  render();
  const modal = $('blackMarketPoliceFineModal');
  if (modal) { modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); }
  $('gameResult').textContent = state.money < 0
    ? `🚨 Штраф оплачен. Баланс: -$${formatMoney(Math.abs(state.money))}. Покупки заблокированы, выплаты −10%.`
    : `🚨 Штраф $10 000 оплачен. Баланс: $${formatMoney(state.money)}.`;
}
let compatibilityPurchasePending = null;
function buyBlackMarket(itemId) {
  if (isPurchaseBlockedByDebt()) return false;
  if (isPurchaseBlockedByDebt()) return false;
  ensureBlackMarket();
  const item = itemById(itemId);
  const marketItem = blackMarketEntry(itemId);
  if (!blackMarketAvailable() || !item || item.starter || item.legacy || !marketItem || state.blackMarketOwned?.[item.id] || !marketItem.available) {
    $('gameResult').textContent = 'Покупка недоступна: чёрный рынок закрыт или товар уже куплен/в SOLD OUT.';
    return false;
  }
  const price = Math.max(1, Number(marketItem.price) || 0);
  if (state.money < price) {
    $('gameResult').textContent = `Не хватает денег. Чёрный рынок просит $${formatMoney(price)} за ${item.name}.`;
    return false;
  }
  state.money -= price;
  state.blackMarketOwned = state.blackMarketOwned || {};
  state.blackMarketOwned[item.id] = true;
  state.blackMarketBroken = state.blackMarketBroken || {};
  $('gameResult').textContent = `🕷️ Куплено на чёрном рынке: ${item.name} за $${formatMoney(price)}.`;
  const unlockedNow = checkAchievements({ deferCelebration: true });
  save(); render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  if (unlockedNow.length) {
    const names = unlockedNow.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean);
    $('gameResult').textContent += ` 🏆 Получено достижение: ${names.join(', ')}.`;
    unlockedNow.forEach((id) => {
      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      setTimeout(() => showAchievementCelebration(achievement), 0);
    });
  }
  return true;
}
function hardcorePsuVariantsForWatts(watts) {
  return SHOP.filter((item) => item.category === 'PSU' && item.hardcoreOnly && Number(item.psuWattage) === Number(watts));
}
function hardcorePsuOwnedVariant(watts) {
  return hardcorePsuVariantsForWatts(watts).find((item) => !!state?.owned?.[item.id]) || null;
}
function hardcorePsuInstalledVariant(watts) {
  return hardcorePsuVariantsForWatts(watts).find((item) => state?.installed?.PSU === item.id && installedSourceFor('PSU') === 'catalog') || null;
}
function openHardcorePsuCertModal(watts) {
  if (isPurchaseBlockedByDebt()) return false;
  const variants = hardcorePsuVariantsForWatts(watts);
  const modal = $('hardcorePsuCertModal');
  const content = $('hardcorePsuCertContent');
  const options = $('hardcorePsuCertOptions');
  if (!modal || !content || !options || !variants.length) return false;
  const owned = hardcorePsuOwnedVariant(watts);
  hardcorePsuPurchasePending = { watts: Number(watts), selectedId: null };
  content.innerHTML = `<h3>БП ${Number(watts)} W</h3><p>В хардкоре мощность выбирается отдельно от качества блока. Теперь выбери сертификат. Он влияет на цену и качество БП, а не на количество ватт.</p>${owned ? `<p class="hardcore-psu-owned-note">У тебя уже есть <b>${owned.psuCertificateLabel || owned.name}</b> для ${Number(watts)} W. Сначала выбери другой ваттный БП или продай/используй купленный.</p>` : ''}`;
  options.innerHTML = variants.map((item) => {
    const disabled = !!state?.owned?.[item.id];
    const certKey = item.psuCertificate || 'standard';
    const cert = HARDCORE_PSU_CERTS.find((entry) => entry.key === certKey) || HARDCORE_PSU_CERTS[0];
    return `<button type="button" class="hardcore-psu-cert-option${certKey === 'gold' ? ' premium' : ''}" data-hardcore-psu-cert="${item.id}" ${disabled ? 'disabled' : ''}><strong>${cert.label}</strong><span>$${formatMoney(item.basePrice)}</span><small>${cert.quality} БП · ${Number(item.psuWattage)} W${disabled ? ' · уже куплен' : ''}</small></button>`;
  }).join('');
  options.querySelectorAll('[data-hardcore-psu-cert]').forEach((btn) => btn.addEventListener('click', () => {
    if (!hardcorePsuPurchasePending) return;
    options.querySelectorAll('[data-hardcore-psu-cert]').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    hardcorePsuPurchasePending.selectedId = btn.dataset.hardcorePsuCert;
    const confirm = $('hardcorePsuCertConfirmBtn');
    if (confirm) confirm.disabled = false;
  }));
  const confirm = $('hardcorePsuCertConfirmBtn');
  if (confirm) confirm.disabled = true;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false');
  return true;
}
function closeHardcorePsuCertModal() {
  const modal = $('hardcorePsuCertModal');
  if (!modal) return;
  modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true');
  hardcorePsuPurchasePending = null;
}
function purchaseHardcorePsuVariant(itemId) {
  if (isPurchaseBlockedByDebt()) return false;
  const item = itemById(itemId);
  if (!item || !item.hardcoreOnly || item.category !== 'PSU' || state.mode !== 'hardcore') return false;
  if (state.owned?.[item.id]) {
    $('gameResult').textContent = `Ты уже купил ${item.name}.`;
    return false;
  }
  const price = Math.max(1, Number(item.basePrice) || 0);
  if (state.money < price) {
    $('gameResult').textContent = `Не хватает денег. ${item.name} стоит $${formatMoney(price)}.`;
    return false;
  }
  state.money -= price;
  state.owned[item.id] = true;
  $('gameResult').textContent = `Куплено: БП ${Number(item.psuWattage)} W (${item.psuCertificateLabel || 'Стандарт'}) за $${formatMoney(price)}. Деталь отправлена в инвентарь.`;
  const unlockedNow = checkAchievements({ deferCelebration: true });
  save(); render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  closeHardcorePsuCertModal();
  if (unlockedNow.length) {
    const names = unlockedNow.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean);
    $('gameResult').textContent += ` 🏆 Получено достижение: ${names.join(', ')}.`;
    unlockedNow.forEach((id) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      setTimeout(() => showAchievementCelebration(achievement), 0);
    });
  }
  return true;
}
function confirmHardcorePsuCertPurchase() {
  const pending = hardcorePsuPurchasePending;
  if (!pending?.selectedId) return;
  const item = itemById(pending.selectedId);
  if (!item) { closeHardcorePsuCertModal(); return; }
  if (itemCompatibilityStatus(item) === 'partial') {
    const watts = pending.watts;
    closeHardcorePsuCertModal();
    compatibilityPurchasePending = { itemId: item.id, mode: 'hardcore-psu' };
    openCompatibilityPurchaseModal(item.id, 'hardcore-psu');
    // Keep a direct fallback for the compatibility confirmation flow.
    compatibilityPurchasePending.hardcoreWattage = watts;
    compatibilityPurchasePending.hardcorePsu = true;
    return;
  }
  purchaseHardcorePsuVariant(item.id);
}
function buy(itemId) {
  const hardcoreItem = itemById(itemId);
  if (state?.mode === 'hardcore' && hardcoreItem?.category === 'PSU' && hardcoreItem?.hardcoreOnly) {
    openHardcorePsuCertModal(hardcoreItem.psuWattage);
    return;
  }
  if (isLightMode()) {
    purchaseItem(itemId, false);
    return;
  }
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state.market.items[itemId];
  if (!item || item.starter || !marketItem || state.owned[item.id] || !marketItem.available) return;
  if (itemCompatibilityStatus(item) === 'partial') { openCompatibilityPurchaseModal(itemId, 'regular'); return; }
  buyWithoutCompatibilityWarning(itemId);
}
function buyWithoutCompatibilityWarning(itemId) {
  if (isPurchaseBlockedByDebt()) return false;
  const item = itemById(itemId);
  if (!item) return;
  if (Number(state.couponPercent) > 0) { openPurchaseCouponModal(itemId); return; }
  purchaseItem(itemId, false);
}
function openCompatibilityPurchaseModal(itemId, mode = 'regular') {
  const item = itemById(itemId);
  if (!item) return;
  compatibilityPurchasePending = { itemId, mode };
  const modal = $('compatibilityPurchaseModal');
  const content = $('compatibilityPurchaseContent');
  if (!modal || !content) return;
  const failures = compatibilityWarningText(item);
  $('compatibilityPurchaseTitle').textContent = `⚠ ${item.name}`;
  content.innerHTML = `<p><b>Эта деталь совместима не со всеми установленными компонентами.</b></p><ul class=\"compatibility-warning-list\">${failures}</ul><p>Купить её всё равно?</p>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false');
}
function closeCompatibilityPurchaseModal() {
  const modal = $('compatibilityPurchaseModal');
  if (!modal) return;
  modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); compatibilityPurchasePending = null;
}
function confirmCompatibilityPurchase() {
  const pending = compatibilityPurchasePending;
  closeCompatibilityPurchaseModal();
  if (!pending) return;
  if (pending.mode === 'extra') openExtraCouponPurchaseModal(pending.itemId, true);
  else if (pending.mode === 'hardcore-psu' || pending.hardcorePsu) purchaseHardcorePsuVariant(pending.itemId);
  else buyWithoutCompatibilityWarning(pending.itemId);
}
function openPurchaseCouponModal(itemId) {
  if (isPurchaseBlockedByDebt()) return false;
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


function purchaseExtraItem(itemId, useCoupon = false) {
  if (isPurchaseBlockedByDebt()) return false;
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state.market.items[itemId];
  const coupon = Number(state.couponPercent) || 0;
  if (!item || item.starter || item.legacy || !marketItem || state.owned[item.id] || marketItem.available || !state.extraCoupon) {
    $('gameResult').textContent = 'EXTRA COUPON не может купить эту деталь: она больше не находится в SOLD OUT или купон уже потрачен.';
    closeExtraCouponPurchaseModal();
    if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
    return false;
  }
  useCoupon = Boolean(useCoupon && coupon > 0);
  const price = Math.max(1, Number(marketItem.price) || 0);
  const finalPrice = useCoupon ? couponAppliedPrice(price) : price;
  if (state.money < finalPrice) {
    $('gameResult').textContent = `Не хватает денег. Сейчас это стоит $${formatMoney(finalPrice)}${useCoupon ? ' с учётом скидки' : ''}.`;
    return false;
  }
  state.money -= finalPrice;
  state.owned[item.id] = true;
  state.extraCoupon = false;
  if (useCoupon) {
    state.couponPercent = null;
    state.superBuy = true;
  }
  pendingExtraPurchaseItemId = null;
  $('gameResult').textContent = useCoupon
    ? `🎟️🎟️ Оба купона использованы. Куплено: ${item.name} за $${formatMoney(finalPrice)} (-${coupon}%).`
    : `🎟️ EXTRA COUPON использован. Куплено: ${item.name} за $${formatMoney(price)}.`;
  const unlockedNow = checkAchievements({ deferCelebration: true });
  save();
  closeExtraCouponPurchaseModal();
  render();
  if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  if (unlockedNow.length) {
    const names = unlockedNow.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean);
    $('gameResult').textContent += ` 🏆 Получено достижение: ${names.join(', ')}.`;
    unlockedNow.forEach((id) => {
      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      setTimeout(() => showAchievementCelebration(achievement), 0);
    });
  }
  return true;
}
function openExtraCouponPurchaseModal(itemId, bypassCompatibility = false) {
  if (isPurchaseBlockedByDebt()) return false;
  ensureMarket();
  const item = itemById(itemId);
  const marketItem = state.market.items[itemId];
  if (!item || !marketItem || marketItem.available || !state.extraCoupon || state.owned[item.id]) {
    if (state.extraCoupon) $('gameResult').textContent = 'EXTRA COUPON можно использовать только для детали со статусом SOLD OUT.';
    return;
  }
  if (!bypassCompatibility && itemCompatibilityStatus(item) === 'partial') { openCompatibilityPurchaseModal(itemId, 'extra'); return; }
  pendingExtraPurchaseItemId = itemId;
  const price = Math.max(1, Number(marketItem.price) || 0);
  const coupon = Number(state.couponPercent) || 0;
  const discounted = coupon ? couponAppliedPrice(price) : null;
  $('extraCouponPurchaseTitle').textContent = coupon ? '🎟️🎟️ EXTRA COUPON + Купон' : '🎟️ EXTRA COUPON';
  $('extraCouponPurchaseContent').innerHTML = `<h3>${item.name}</h3><p>Сейчас эта деталь находится в <b>SOLD OUT</b>.</p><div class="extra-coupon-price"><span>Цена детали</span><b>$${formatMoney(price)}</b></div>${coupon ? `<div class="extra-coupon-discounted-price"><span>С двумя купонами (-${coupon}%)</span><b>$${formatMoney(discounted)}</b></div>` : ''}<p class="extra-coupon-note">EXTRA COUPON не даёт скидку сам по себе. При использовании обоих купонов обычный купон дополнительно уменьшит текущую рыночную цену.</p>`;
  const bothBtn = $('extraCouponPurchaseUseBothBtn');
  if (bothBtn) {
    bothBtn.classList.toggle('hidden', !(coupon > 0));
    bothBtn.disabled = !(coupon > 0);
  }
  $('extraCouponPurchaseModal').classList.remove('hidden');
  $('extraCouponPurchaseModal').setAttribute('aria-hidden','false');
}
function closeExtraCouponPurchaseModal() {
  const modal = $('extraCouponPurchaseModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
  pendingExtraPurchaseItemId = null;
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

function closeOsInstallModal() {
  const modal = $('osInstallModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}
function cancelOsInstall() {
  if (osInstallTimer) clearTimeout(osInstallTimer);
  if (osInstallProgressTimer) clearInterval(osInstallProgressTimer);
  osInstallTimer = null;
  osInstallProgressTimer = null;
  osInstallItemId = null;
  closeOsInstallModal();
}
function finishOsInstall() {
  const itemId = osInstallItemId;
  const source = osInstallSource;
  cancelOsInstall();
  if (!state || !itemId) return;
  const item = itemById(itemId);
  const owned = source === 'black' ? !!state.blackMarketOwned?.[itemId] : !!state.owned?.[itemId];
  if (!item || item.category !== 'OS' || !owned || isSourceItemBroken(item, source)) return;
  state.installed.OS = item.id;
  state.installedSource = state.installedSource || {};
  state.installedSource.OS = source;
  sourceBrokenMap(source);
  delete sourceBrokenMap(source)[item.id];
  state.power = currentPower(); syncAfkComponents();
  const unlocked = checkAchievements();
  $('gameResult').textContent = unlocked.length
    ? `🏆 Получено достижение: ${unlocked.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean).join(', ')}`
    : `Установлено: ${item.name} (${sourceLabel(source)}). Мощность ПК: ${state.power}`;
  save(); render(); if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
}
function openOsInstallModal(itemId, source = 'catalog') {
  const item = itemById(itemId);
  const owned = source === 'black' ? !!state?.blackMarketOwned?.[itemId] : !!state?.owned?.[itemId];
  if (!item || item.category !== 'OS' || !owned) return;
  const modal = $('osInstallModal');
  if (!modal) return;
  cancelOsInstall();
  osInstallItemId = itemId;
  osInstallSource = source;
  const duration = osInstallDurationMs();
  const storage = installedItem('Storage');
  const durationSec = Math.round(duration / 1000);
  $('osInstallTitle').textContent = `💿 Установка ${item.name}`;
  $('osInstallText').textContent = `Загрузка и установка ОС... Накопитель: ${storage?.name || 'HDD'}. Примерное время: ${durationSec} сек.`;
  $('osInstallStatus').textContent = `0% · ${durationSec} сек`;
  $('osInstallProgressBar').style.width = '0%';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  const startedAt = performance.now();
  osInstallProgressTimer = setInterval(() => {
    const progress = Math.min(1, (performance.now() - startedAt) / duration);
    const remaining = Math.max(0, duration - (performance.now() - startedAt));
    if ($('osInstallProgressBar')) $('osInstallProgressBar').style.width = `${Math.round(progress * 100)}%`;
    if ($('osInstallStatus')) $('osInstallStatus').textContent = `${Math.round(progress * 100)}% · ${Math.ceil(remaining / 1000)} сек`;
  }, 50);
  osInstallTimer = setTimeout(finishOsInstall, duration);
}
function installItem(itemId, source = 'catalog') {
  const item = itemById(itemId);
  const owned = source === 'black' ? !!state?.blackMarketOwned?.[itemId] : !!state?.owned?.[itemId];
  if (!item || !owned) return;
  if (isSourceItemBroken(item, source)) { $('gameResult').textContent = `Нельзя установить ${item.name}: деталь из ${sourceLabel(source)} сломана. Сначала почини её или выбери другую.`; return; }
  if (item.category === 'OS') {
    if (state.installed.OS === item.id && installedSourceFor('OS') === source) return;
    stopAfk();
    openOsInstallModal(item.id, source);
    return;
  }
  state.installed[item.category] = item.id;
  state.installedSource = state.installedSource || {};
  state.installedSource[item.category] = source;
  delete sourceBrokenMap(source)[item.id];
  state.power = currentPower(); syncAfkComponents();
  const unlocked = checkAchievements();
  $('gameResult').textContent = unlocked.length
    ? `🏆 Получено достижение: ${unlocked.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean).join(', ')}`
    : `Установлено: ${item.name} (${sourceLabel(source)}). Мощность ПК: ${state.power}`;
  save(); render(); if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  if (isLightMode()) lightCoachAfterAction('install', item);
}
function repairInstalledItem(itemId, source = 'catalog') {
  const item = itemById(itemId), info = brokenInfoFor(item, source);
  if (!item || !info) return false;
  const cost = repairCost(item, source);
  if (state.money < cost) { $('gameResult').textContent = `Не хватает $${formatMoney(cost - state.money)} на ремонт ${item.name}.`; render(); return false; }
  state.money -= cost;
  delete sourceBrokenMap(source)[item.id];
  syncAfkComponents();
  $('gameResult').textContent = `🔧 ${item.name} из ${sourceLabel(source)} отремонтирован за $${formatMoney(cost)}.`;
  save(); render();
  return true;
}
function openRepairConfirm(itemId, source = 'catalog') {
  const item = itemById(itemId), info = brokenInfoFor(item, source);
  if (!item || !info) return;
  const modal = $('diagnosticModal'), content = $('diagnosticContent'), title = $('diagnosticTitle');
  if (!modal || !content) return;
  const footer = document.querySelector('.diagnostic-footer');
  if (footer) footer.classList.add('hidden');
  const cost = repairCost(item, source);
  if (title) title.textContent = '🔧 Ремонт детали';
  content.innerHTML = `<div class="diagnostic-error breakdown-alert"><div class="diagnostic-count">Починить ${item.name}?</div><p>Источник: <b>${sourceLabel(source)}</b></p><p>Вы действительно хотите починить деталь <b>${item.name}</b> за <b>$${formatMoney(cost)}</b>?</p><div class="breakdown-percent">Повреждение: <b>${info.damage}%</b></div><div class="breakdown-actions"><button class="primary" id="confirmRepair" ${state.money >= cost ? '' : 'disabled'}>Да, починить</button><button class="small" id="cancelRepair">Нет</button></div></div>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  $('confirmRepair')?.addEventListener('click', () => { if (repairInstalledItem(item.id, source)) closeDiagnostic(); });
  $('cancelRepair')?.addEventListener('click', closeDiagnostic);
}
function hardcorePsuCompensation(item) {
  if (!item || item.category !== 'PSU' || !item.hardcoreOnly) return 0;
  const cert = item.psuCertificate || 'standard';
  const rate = cert === 'gold' ? 0.80 : cert === 'silver' ? 0.50 : cert === 'bronze' ? 0.25 : 0;
  if (rate <= 0) return 0;
  return Math.max(0, Math.floor((Number(item.basePrice) || 0) * rate));
}
function showPsuCompensationToast(item, amount) {
  const toast = $('psuCompensationToast');
  const title = $('psuCompensationTitle');
  const text = $('psuCompensationText');
  if (!toast || !title || !text || !item || amount <= 0) return;
  const cert = item.psuCertificateLabel || HARDCORE_PSU_CERTS.find(c => c.key === item.psuCertificate)?.label || 'Сертификат';
  title.textContent = `💸 Компенсация: ${cert}`;
  text.innerHTML = `Твой БП <b>${item.name}</b> вышел из строя. Сертификат вернул <b>$${formatMoney(amount)}</b> (${cert === '80+ Gold' ? '80%' : cert === '80+ Silver' ? '50%' : '25%'} от цены БП).`;
  toast.classList.remove('hidden');
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(window.__psuCompensationTimer);
  window.__psuCompensationTimer = setTimeout(() => closePsuCompensationToast(), 9000);
}
function closePsuCompensationToast() {
  const toast = $('psuCompensationToast');
  if (!toast) return;
  toast.classList.remove('show');
  setTimeout(() => toast.classList.add('hidden'), 220);
  if (window.__psuCompensationTimer) clearTimeout(window.__psuCompensationTimer);
  window.__psuCompensationTimer = null;
}
function grantHardcorePsuCompensation(item) {
  const amount = hardcorePsuCompensation(item);
  if (amount <= 0 || !state) return 0;
  state.money += amount;
  showPsuCompensationToast(item, amount);
  return amount;
}

function breakInstalledComponent(category) {
  const item = installedItem(category); if (!item) return null;
  const source = installedSourceFor(category);
  const damage = randInt(10, 100), cost = Math.max(10, Math.ceil(repairBaseValue(item) * damage / 100 * repairMultiplier()));
  sourceBrokenMap(source)[item.id] = { damage, repairCost: cost };
  if (state.afkComponents) state.afkComponents[category] = false; syncAfkComponents();
  const compensation = category === 'PSU' && source === 'catalog' ? grantHardcorePsuCompensation(item) : 0;
  save();
  return { item, damage, cost, category, source, compensation };
}
function showBreakdownWarning(broken) {
  const modal = $('diagnosticModal'), content = $('diagnosticContent'), title = $('diagnosticTitle');
  if (!modal || !content || !broken?.item) return;
  const footer = document.querySelector('.diagnostic-footer');
  if (footer) footer.classList.add('hidden');
  const item = broken.item, cost = broken.cost; if (title) title.textContent = '⚠ Поломка компонента';
  content.innerHTML = `<div class="diagnostic-error breakdown-alert"><div class="diagnostic-count">💥 ${item.name} вышла из строя</div><div class="breakdown-percent">Степень поломки: <b>${broken.damage}%</b></div><p>Сломанная установленная деталь блокирует игры и AFK. Её можно починить или заменить другой рабочей деталью из инвентаря.</p><div class="diagnostic-recommend">🔧 Стоимость ремонта: <b>$${formatMoney(cost)}</b></div><div class="breakdown-actions"><button class="primary" id="repairBrokenNow" ${state.money >= cost ? '' : 'disabled'}>🔧 Починить за $${formatMoney(cost)}</button><button class="small" id="replaceBrokenNow">🔄 Заменить деталь</button></div></div>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  $('repairBrokenNow')?.addEventListener('click', () => { openRepairConfirm(item.id, broken.source || 'catalog'); });
  $('replaceBrokenNow')?.addEventListener('click', () => { closeDiagnostic(); openReplacement(item.category); });
}
