function blackMarketFireCandidates() {
  if (!state?.blackMarketOwned) return [];
  const result = [];
  for (const category of activeCategories()) {
    const item = installedItem(category);
    if (!item || installedSourceFor(category) !== 'black') continue;
    if (!state.blackMarketOwned[item.id] || item.starter || item.legacy) continue;
    if (isSourceItemBroken(item, 'black')) continue;
    result.push({ item, source: 'black', category });
  }
  return result;
}
function blackMarketFireInstalledCandidates(exclude = null) {
  const result = [];
  for (const category of activeCategories()) {
    const item = installedItem(category);
    if (!item || isItemBroken(item)) continue;
    const source = installedSourceFor(category);
    if (exclude && item.id === exclude.item?.id && source === exclude.source) continue;
    result.push({ item, source, category });
  }
  return result;
}
function breakFireEntry(entry) {
  if (!entry?.item) return null;
  const { item, source } = entry;
  const damage = randInt(25, 100);
  const cost = Math.max(10, Math.ceil(repairBaseValue(item) * damage / 100 * repairMultiplier()));
  sourceBrokenMap(source)[item.id] = { damage, repairCost: cost, fire: true };
  const compensation = item.category === 'PSU' && source === 'catalog' && typeof grantHardcorePsuCompensation === 'function' ? grantHardcorePsuCompensation(item) : 0;
  if (state.installed?.[item.category] === item.id && installedSourceFor(item.category) === source) {
    if (state.afkComponents) state.afkComponents[item.category] = false;
  }
  return { item, source, damage, cost, category: item.category, compensation };
}
function renderBlackMarketFireModal() {
  const modal = $('blackMarketFireModal');
  const status = $('blackMarketFireStatus');
  const area = $('blackMarketFireArea');
  if (!modal || !status || !area || !blackMarketFire) return;
  const fire = blackMarketFire;
  const left = Math.max(0, fire.deadline - Date.now());
  status.innerHTML = `🔥 <b>${fire.item.name}</b> загорелась! Закрой <b>${fire.windowsNeeded}</b> окон за <b>${(left / 1000).toFixed(1)} сек.</b>`;
  if (area.dataset.fireToken !== String(fire.token)) {
    area.dataset.fireToken = String(fire.token);
    area.innerHTML = Array.from({ length: fire.windowsNeeded }, (_, index) => {
      const leftPct = randInt(4, 82), topPct = randInt(5, 78), rot = randInt(-8, 8);
      return `<button class="black-market-fire-window" data-fire-window="${index}" style="left:${leftPct}%;top:${topPct}%;transform:rotate(${rot}deg)">✕</button>`;
    }).join('');
    area.querySelectorAll('[data-fire-window]').forEach((button) => button.addEventListener('click', () => {
      if (!blackMarketFire || Number(button.dataset.fireWindow) < 0) return;
      button.disabled = true;
      button.classList.add('closed');
      blackMarketFire.closed += 1;
      if (blackMarketFire.closed >= blackMarketFire.windowsNeeded) finishBlackMarketFire(true);
    }, { once: true }));
  }
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeBlackMarketFireModal() {
  const modal = $('blackMarketFireModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  if (blackMarketFireTimer) clearInterval(blackMarketFireTimer);
  blackMarketFireTimer = null;
}
function finishBlackMarketFire(success) {
  if (!blackMarketFire) return;
  const fire = blackMarketFire;
  if (blackMarketFireTimer) clearInterval(blackMarketFireTimer);
  blackMarketFireTimer = null;
  if (success) {
    const broken = breakFireEntry(fire);
    blackMarketFire = null;
    closeBlackMarketFireModal();
    state.power = currentPower();
    syncAfkComponents();
    $('gameResult').textContent = `🔥 Пожар потушен. Сломалась только ${broken?.item?.name || 'загоревшаяся деталь'} из чёрного рынка.`;
  } else {
    const pool = blackMarketFireInstalledCandidates(fire);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const chosen = [fire, ...shuffled.slice(0, 2)];
    const broken = chosen.map(breakFireEntry).filter(Boolean);
    blackMarketFire = null;
    closeBlackMarketFireModal();
    state.power = currentPower();
    syncAfkComponents();
    const names = broken.map((entry) => entry.item.name).join(', ');
    $('gameResult').textContent = `🔥 Пожар не потушен. Повреждены ${broken.length} детали: ${names}.`;
  }
  save();
  render();
}
function startBlackMarketFire(item, context) {
  if (blackMarketFire || !item) return false;
  blackMarketFireToken += 1;
  const duration = state?.mode === 'hardcore' ? 8000 : state?.mode === 'hard' ? 9000 : 10000;
  const source = installedSourceFor(item.category);
  blackMarketFire = { token: blackMarketFireToken, item, source, context, windowsNeeded: randInt(10, 15), closed: 0, duration, deadline: Date.now() + duration };
  stopAfk();
  stopAiTraining();
  closeGame();
  renderBlackMarketFireModal();
  blackMarketFireTimer = setInterval(() => {
    if (!blackMarketFire) return;
    if (Date.now() >= blackMarketFire.deadline) finishBlackMarketFire(false);
    else renderBlackMarketFireModal();
  }, 100);
  save();
  return true;
}
function maybeTriggerBlackMarketFire(chance, context = 'фарм') {
  if (!state || blackMarketFire || Math.random() >= chance) return false;
  const candidates = blackMarketFireCandidates();
  if (!candidates.length) return false;
  const entry = candidates[Math.floor(Math.random() * candidates.length)];
  return startBlackMarketFire(entry.item, context);
}
