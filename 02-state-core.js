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
let blackMarketFire = null;
let blackMarketFireTimer = null;
let blackMarketFireToken = 0;
let orderEmpireExpanded = false;
let activeEarnTab = ['afk', 'ai', 'programming'].includes(localStorage.getItem(EARN_TAB_KEY)) ? localStorage.getItem(EARN_TAB_KEY) : 'games';
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
let aiFileTaskCleanup = null;
let aiTasks = [];
let aiTaskIndex = 0;
let aiTaskTimer = null;
let aiTaskInterval = null;
let aiTaskState = null;
const AI_TASKS = ['wires', 'word', 'download', 'file', 'windows'];
const MIN_AFK_CPU_POWER = 34; // i5-10400F / Ryzen 5 3600 tier
const MIN_AFK_OS_POWER = 7; // Linux Mint tier
const MIN_AI_OS_POWER = 16; // Windows 11 Home tier
const MIN_AI_CPU_POWER = 25; // i3-12100F tier
const MIN_PROGRAMMING_CPU_POWER = 10; // Intel Pentium J2900 tier
const MIN_PROGRAMMING_RAM_GB = 4;
const PROGRAMMING_LANGUAGES = ['JavaScript', 'HTML', 'Python', 'C++', 'Java'];

function installedSourceFor(category) {
  return state?.installedSource?.[category] === 'black' ? 'black' : 'catalog';
}
function sourceBrokenMap(source = 'catalog') {
  if (!state) return {};
  if (source === 'black') {
    state.blackMarketBroken = state.blackMarketBroken || {};
    return state.blackMarketBroken;
  }
  state.broken = state.broken || {};
  return state.broken;
}
function isSourceItemBroken(item, source = 'catalog') {
  return !!(item && sourceBrokenMap(source)[item.id]);
}
function brokenInfoFor(item, source = 'catalog') {
  return item ? sourceBrokenMap(source)[item.id] || null : null;
}
function isItemBroken(item) {
  if (!item) return false;
  const installed = state?.installed?.[item.category];
  const source = installed === item.id ? installedSourceFor(item.category) : 'catalog';
  return isSourceItemBroken(item, source);
}
function brokenInfo(item) {
  if (!item) return null;
  const installed = state?.installed?.[item.category];
  const source = installed === item.id ? installedSourceFor(item.category) : 'catalog';
  return brokenInfoFor(item, source);
}
function isDiscreteGpu(item) { return !!(item && item.category === 'GPU' && !/integrated|встроенн/i.test(item.name || '')); }
function repairBaseValue(item) {
  if (!item) return 100;
  if (Number(item.basePrice) > 0) return Number(item.basePrice);
  const starterPrices = { 'starter-easy-cpu': 500, 'starter-easy-gpu': 350, 'starter-easy-storage': 220, 'starter-hard-cpu': 220, 'starter-hard-gpu': 80, 'starter-hard-storage': 70, 'starter-hardcore-cpu': 60, 'starter-hardcore-gpu': 20 };
  return starterPrices[item.id] || 100;
}
function repairMultiplier() { return state?.mode === 'light' ? 1 : state?.mode === 'hardcore' ? 4 : state?.mode === 'hard' ? 3 : 2; }
function repairCost(item, source = 'catalog') { const info = brokenInfoFor(item, source); if (!item || !info) return 0; const damage = Math.max(10, Math.min(100, Number(info.damage) || 10)); return Math.max(10, Math.ceil(repairBaseValue(item) * damage / 100 * repairMultiplier())); }
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
function applyPayoutPenalty(amount) {
  const value = Math.max(0, Number(amount) || 0);
  return state?.money < 0 ? Math.max(1, Math.floor(value * 0.90)) : value;
}
function isPurchaseBlockedByDebt() {
  if (Number(state?.money) < 0) {
    if ($('gameResult')) $('gameResult').textContent = '🚫 Покупки заблокированы: баланс отрицательный. Стабилизируй баланс до $0 или выше.';
    return true;
  }
  return false;
}
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
  const afkOs = installedItem('OS');
  if (afkOs && afkOs.group === 'Linux') payout *= 1.5;
  if (afkMode === 'overclock') payout *= 5;
  return payout / interval;
}
function afkPayoutAmount() { return applyPayoutPenalty(Math.max(1, Math.floor((afkAveragePerSecond() * afkPayoutInterval() / 1000) / 5))); }
function couponGiveawayActive() {
  return !!(state?.market?.eventActive && state?.market?.event?.id === 'coupon_giveaway' && eventIsActive());
}
function normalCouponDropChance() { return couponGiveawayActive() ? 0.20 : 0.10; }
function extraCouponDropChance() { return couponGiveawayActive() ? 0.01 : 0.005; }
function showCouponCelebration(type = 'extra', percent = null) {
  const toast = $('extraCouponToast');
  if (toast) {
    toast.classList.remove('show', 'coupon-normal', 'coupon-extra');
    toast.classList.add(type === 'normal' ? 'coupon-normal' : 'coupon-extra');
    const title = toast.querySelector('.extra-coupon-toast-text strong');
    const text = toast.querySelector('.extra-coupon-toast-text span');
    const icon = toast.querySelector('.extra-coupon-toast-icon');
    if (type === 'normal') {
      if (title) title.textContent = 'COUPON!';
      if (text) text.textContent = percent ? `Скидка -${percent}% на следующую покупку.` : 'Купон на скидку получен.';
      if (icon) icon.textContent = '🎟️';
    } else {
      if (title) title.textContent = 'EXTRA COUPON!';
      if (text) text.textContent = 'Можно купить одну деталь даже при SOLD OUT.';
      if (icon) icon.textContent = '🎟️';
    }
    requestAnimationFrame(() => toast.classList.add('show'));
    if (window.extraCouponToastTimer) clearTimeout(window.extraCouponToastTimer);
    window.extraCouponToastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
  }
  launchConfetti();
}
function showExtraCouponCelebration() { showCouponCelebration('extra'); }
function maybeGrantExtraCouponFromAfkPayout() {
  if (!state || afkMode === 'overclock' || state.extraCoupon) return false;
  if (Math.random() >= extraCouponDropChance()) return false;
  state.extraCoupon = true;
  showExtraCouponCelebration();
  $('gameResult').textContent = '🎟️ EXTRA COUPON получен! Теперь можно купить одну деталь даже при SOLD OUT.';
  return true;
}
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
  if (existing && !window.confirm(currentLanguage() === 'en' ? `Slot ${slot} is already occupied. Overwrite the save?` : `Ячейка ${slot} уже занята. Перезаписать сохранение?`)) return false;
  checkAchievements();
  const snapshot = JSON.parse(JSON.stringify({ ...state, savedAt: new Date().toISOString(), saveVersion: GAME_VERSION }));
  localStorage.setItem(saveSlotKey(slot), JSON.stringify(snapshot));
  renderSaveSlots();
  $('gameResult').textContent = `💾 Игра сохранена в ячейку ${slot}.`;
  if (pendingResetAfterSave) {
    pendingResetAfterSave = false;
    closeSaveModal();
    resetGameNow();
    return true;
  }
  if (typeof pendingExamExitAfterSave !== 'undefined' && pendingExamExitAfterSave) {
    pendingExamExitAfterSave = false;
    closeSaveModal();
    if (typeof finishExamExitToMenu === 'function') finishExamExitToMenu(true);
    return true;
  }
  return true;
}
function loadGameSlot(slot) {
  cancelOsInstall();
  const snapshot = loadSaveSlot(slot);
  if (!snapshot || !MODE_CONFIG[snapshot.mode]) return;
  closeGame(); closeShop(); closeDiagnostic(); closeResetConfirm(); closeSaveModal();
  stopAfk();
  state = snapshot;
  ensureRequiredModeStarters();
  normalisePsuIds();
  delete state.savedAt;
  delete state.saveVersion;
  normaliseInstalledForAchievements();
  normaliseStarterProtection();
  if (!state.broken) state.broken = {};
  if (!state.achievements || typeof state.achievements !== 'object') state.achievements = {};
  if (typeof state.extraCoupon !== 'boolean') state.extraCoupon = !!state.extraCoupon;
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
  const date = snapshot?.savedAt ? new Date(snapshot.savedAt).toLocaleString(currentLanguage() === 'ru' ? 'ru-RU' : 'en-US') : (currentLanguage() === 'en' ? 'Date unknown' : 'Дата неизвестна');
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
  cancelOsInstall();
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
