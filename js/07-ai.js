const OS_COMPAT_RULES = {
  'os-windows-xp': { minRamGb: 1, minStorageGb: 10 },
  'os-windows-vista': { minRamGb: 2, minStorageGb: 15 },
  'os-windows-7-lite': { minRamGb: 2, minStorageGb: 16 },
  'os-windows-7-home': { minRamGb: 2, minStorageGb: 16 },
  'os-windows-81-home': { minRamGb: 2, minStorageGb: 20 },
  'os-windows-10-home': { minRamGb: 4, minStorageGb: 32 },
  'os-windows-10-pro': { minRamGb: 4, minStorageGb: 32 },
  'os-windows-11-home': { minRamGb: 8, minStorageGb: 64 },
  'os-windows-11-pro': { minRamGb: 8, minStorageGb: 64 },
  'os-linux-mint': { minRamGb: 2, minStorageGb: 20 },
  'os-ubuntu': { minRamGb: 6, minStorageGb: 25 },
  'os-debian': { minRamGb: 2, minStorageGb: 10 },
  'os-fedora': { minRamGb: 2, minStorageGb: 15 },
  'os-arch': { minRamGb: 2, minStorageGb: 10 },
  'os-opensuse': { minRamGb: 2, minStorageGb: 20 },
  'os-macos-10-14-mojave': { minRamGb: 2, minStorageGb: 20 },
  'os-macos-10-15-catalina': { minRamGb: 4, minStorageGb: 32 },
  'os-macos-11-big-sur': { minRamGb: 4, minStorageGb: 35 },
  'os-macos-12-monterey': { minRamGb: 4, minStorageGb: 35 },
  'os-macos-13-ventura': { minRamGb: 4, minStorageGb: 35 },
  'os-macos-14-sonoma': { minRamGb: 4, minStorageGb: 35 },
  'os-macos': { minRamGb: 4, minStorageGb: 35 }
};
function osCompatRule(item) { return item?.category === 'OS' ? (OS_COMPAT_RULES[item.id] || { minRamGb: 2, minStorageGb: 20 }) : null; }
function motherboardPcieGeneration(item) {
  if (!item || item.category !== 'Motherboard') return 3;
  const id = item.id;
  if (/starter-hardcore-mb/i.test(id)) return 2;
  if (/h410|a320/i.test(id)) return 3;
  if (/b560|b660|b760|z690|z790|b450|b550|b650|x670/i.test(id)) return 4;
  if (/b860|z890|x870/i.test(id)) return 5;
  return 3;
}
function storagePerformancePenaltyPercent(item, motherboard = installedItem('Motherboard')) {
  if (!item || item.category !== 'Storage' || !/ssd-2tb-gen5/i.test(item.id)) return 0;
  const gen = motherboardPcieGeneration(motherboard);
  if (/starter-hardcore-mb/i.test(motherboard?.id || '')) return 95;
  if (gen >= 5) return 0;
  if (gen === 4) return 10;
  return 50;
}
function effectiveItemPerformance(item) {
  if (!item) return 0;
  const installed = state?.installed?.[item.category] === item.id;
  if (installed && isItemBroken(item)) return 0;
  const penalty = storagePerformancePenaltyPercent(item);
  return penalty ? Math.max(1, Math.round(Number(item.performance || 0) * (1 - penalty / 100))) : (Number(item.performance) || 0);
}
function itemCompatibilityChecks(candidate) {
  if (!candidate || !state) return [];
  const checks = [];
  const cpu = installedItem('CPU'), mb = installedItem('Motherboard'), ram = installedItem('RAM'), gpu = installedItem('GPU'), psu = installedItem('PSU'), cooling = installedItem('Cooling'), storage = installedItem('Storage'), os = installedItem('OS');
  if (candidate.category === 'Motherboard') {
    if (cpu && partPlatform(candidate) && partPlatform(cpu)) checks.push({ label: `CPU ${cpu.name}`, ok: partPlatform(candidate) === partPlatform(cpu), detail: `${cpu.name} → ${partPlatform(cpu)}, плата → ${partPlatform(candidate)}` });
    if (ram && motherboardSpec(candidate)) checks.push({ label: `RAM ${ram.name}`, ok: ramType(ram) === motherboardSpec(candidate).ramType && ramCapacityGb(ram) <= motherboardSpec(candidate).maxRamGb, detail: `${motherboardSpec(candidate).ramType}, до ${motherboardSpec(candidate).maxRamGb} ГБ` });
    if (cpu && motherboardSpec(candidate)) checks.push({ label: `Охлаждение/CPU ${cpu.name}`, ok: cpuTdp(cpu) <= motherboardSpec(candidate).maxCpuTdp, detail: `лимит платы ${motherboardSpec(candidate).maxCpuTdp} W` });
  } else if (candidate.category === 'CPU') {
    if (mb && partPlatform(candidate) && partPlatform(mb)) checks.push({ label: `Материнская плата ${mb.name}`, ok: partPlatform(candidate) === partPlatform(mb) && (!motherboardSpec(mb)?.maxCpuTdp || cpuTdp(candidate) <= motherboardSpec(mb).maxCpuTdp), detail: `${partPlatform(candidate)} / ${partPlatform(mb)}` });
    if (cooling) checks.push({ label: `Охлаждение ${cooling.name}`, ok: coolingCapacity(cooling) >= cpuTdp(candidate), detail: `${coolingCapacity(cooling)} W против ~${cpuTdp(candidate)} W` });
  } else if (candidate.category === 'Cooling') {
    if (cpu) checks.push({ label: `CPU ${cpu.name}`, ok: coolingCapacity(candidate) >= cpuTdp(cpu), detail: `${coolingCapacity(candidate)} W против ~${cpuTdp(cpu)} W` });
  } else if (candidate.category === 'PSU') {
    if (gpu && isDiscreteGpu(gpu)) checks.push({ label: `GPU ${gpu.name}`, ok: numericWatts(candidate) >= gpuRecommendedPsu(gpu), detail: `${numericWatts(candidate)} W против ~${gpuRecommendedPsu(gpu)} W` });
  } else if (candidate.category === 'GPU') {
    if (psu && isDiscreteGpu(candidate)) checks.push({ label: `БП ${psu.name}`, ok: numericWatts(psu) >= gpuRecommendedPsu(candidate), detail: `${numericWatts(psu)} W против ~${gpuRecommendedPsu(candidate)} W` });
  } else if (candidate.category === 'OS') {
    const rule = osCompatRule(candidate);
    if (ram) checks.push({ label: `RAM ${ram.name}`, ok: ramCapacityGb(ram) >= rule.minRamGb, detail: `минимум ${rule.minRamGb} ГБ` });
    if (storage) checks.push({ label: `Накопитель ${storage.name}`, ok: storageCapacityGb(storage) >= rule.minStorageGb, detail: `минимум ${rule.minStorageGb} ГБ` });
  } else if (candidate.category === 'Storage') {
    if (os) { const rule = osCompatRule(os); checks.push({ label: `ОС ${os.name}`, ok: storageCapacityGb(candidate) >= rule.minStorageGb, detail: `для ОС нужно минимум ${rule.minStorageGb} ГБ` }); }
  } else if (candidate.category === 'RAM') {
    if (mb && motherboardSpec(mb)) checks.push({ label: `Материнская плата ${mb.name}`, ok: ramType(candidate) === motherboardSpec(mb).ramType && ramCapacityGb(candidate) <= motherboardSpec(mb).maxRamGb, detail: `${motherboardSpec(mb).ramType}, до ${motherboardSpec(mb).maxRamGb} ГБ` });
  }
  return checks;
}
function itemCompatibilityStatus(candidate) {
  if (state?.mode !== 'easy') return 'neutral';
  const checks = itemCompatibilityChecks(candidate);
  if (!checks.length) return 'neutral';
  const good = checks.filter(c => c.ok).length;
  if (good === checks.length) return 'good';
  if (good > 0) return 'partial';
  return 'bad';
}
function compatibilityStatusText(status) { return status === 'good' ? '✅ Совместимо' : status === 'partial' ? '🟠 Совместимо не со всем' : status === 'bad' ? '❌ Несовместимо' : ''; }
function compatibilityWarningText(item) {
  const failures = itemCompatibilityChecks(item).filter(c => !c.ok);
  return failures.map(c => `<li><b>${c.label}</b><span>${c.detail}</span></li>`).join('');
}
function osInstallDurationMs() {
  const storage = installedItem('Storage');
  const text = `${storage?.id || ''} ${storage?.series || ''} ${storage?.name || ''}`;
  if (/gen5|PCIe\s*5(?:\.0)?/i.test(text)) return 10000;
  if (storageType(storage) === 'SATA' || storageType(storage) === 'NVMe') return 15000;
  return 30000;
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
  const reward = applyPayoutPenalty(componentTaskReward(type));
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
  const gamesTab = $('miniGamesTab'), afkTabEl = $('afkTab'), aiTabEl = $('aiTab'), programmingTabEl = $('programmingTab');
  const games = $('miniGamesSection'), afk = $('afkSection'), ai = $('aiSection'), programming = $('programmingSection');
  if (!gamesTab || !afkTabEl || !aiTabEl || !games || !afk || !ai) return;
  const isGames = activeEarnTab === 'games'; const isAfk = activeEarnTab === 'afk'; const isAi = activeEarnTab === 'ai'; const isProgramming = activeEarnTab === 'programming';
  gamesTab.classList.toggle('active', isGames); gamesTab.setAttribute('aria-selected', String(isGames));
  afkTabEl.classList.toggle('active', isAfk); afkTabEl.setAttribute('aria-selected', String(isAfk));
  aiTabEl.classList.toggle('active', isAi); aiTabEl.setAttribute('aria-selected', String(isAi));
  if (programmingTabEl) { programmingTabEl.classList.toggle('active', isProgramming); programmingTabEl.setAttribute('aria-selected', String(isProgramming)); }
  games.classList.toggle('hidden', !isGames); afk.classList.toggle('hidden', !isAfk); ai.classList.toggle('hidden', !isAi); if (programming) programming.classList.toggle('hidden', !isProgramming);
  renderRewardInfo();
  if (isAfk) renderAfkPanel(); if (isAi) renderAiPanel(); if (isProgramming) renderProgrammingPanel();
}
function osMeetsMinimum(minPower) {
  const os = installedItem('OS');
  return !!(os && !isItemBroken(os) && Number(os.performance) >= minPower);
}
function canStartAiTraining() {
  const ram = installedItem('RAM');
  const cpu = installedItem('CPU');
  return !!(ram && !isItemBroken(ram) && ['DDR4','DDR5'].includes(ramType(ram)) && ramCapacityGb(ram) >= 64
    && cpu && !isItemBroken(cpu) && Number(cpu.performance) >= MIN_AI_CPU_POWER
    && osMeetsMinimum(MIN_AI_OS_POWER));
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
  const rawTotal = subtotal + ultraBonus;
  return { base, bonus, ultraBonus, subtotal, total: applyPayoutPenalty(rawTotal) };
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
  if (aiFileTaskCleanup) { aiFileTaskCleanup(); aiFileTaskCleanup = null; }
}
function finishAiTask() {
  if (!aiRunning) return;
  if (aiFileTaskCleanup) { aiFileTaskCleanup(); aiFileTaskCleanup = null; }
  if (aiTaskTimer) { clearTimeout(aiTaskTimer); aiTaskTimer = null; }
  if (aiTaskInterval) { clearInterval(aiTaskInterval); aiTaskInterval = null; }
  aiTaskState = null; aiTaskIndex += 1;
  if (aiTaskIndex >= aiTasks.length) {
    const reward = aiReward();
    state.money += reward.total;
    const fireTriggered = maybeTriggerBlackMarketFire(0.02, 'обучение ИИ');
    checkAchievements(); save();
    $('money').textContent = formatMoney(state.money);
    $('gameResult').textContent = aiUseEnglish()
      ? `🤖 AI Training completed. +$${formatMoney(reward.total)} ($250 + $${formatMoney(reward.bonus)} power bonus${reward.ultraBonus ? ` + $${formatMoney(reward.ultraBonus)} Core Ultra bonus` : ''})`
      : `🤖 Обучение ИИ завершено. +$${formatMoney(reward.total)} (250$ + ${formatMoney(reward.bonus)}$ бонус за мощность${reward.ultraBonus ? ` + ${formatMoney(reward.ultraBonus)}$ бонус Core Ultra` : ''})`;
    stopAiTraining(); renderAiPanel(); if (fireTriggered) renderBlackMarketFireModal(); return;
  }
  renderAiTask();
}
function startAiTraining() {
  if (!state || isLightMode()) return;
  if (!canStartAiTraining()) {
    const ram = installedItem('RAM'); const cpu = installedItem('CPU');
    const ramGb = ramCapacityGb(ram); const cpuPower = cpu ? Number(cpu.performance) || 0 : 0;
    const problems = [];
    if (!(ram && !isItemBroken(ram) && ['DDR4','DDR5'].includes(ramType(ram)) && ramGb >= 64)) problems.push(`нужно минимум 64 ГБ DDR4/DDR5 (сейчас ${ramGb || 0} ГБ)`);
    if (!(cpu && !isItemBroken(cpu) && cpuPower >= MIN_AI_CPU_POWER)) problems.push(`нужен CPU минимум ${MIN_AI_CPU_POWER} мощности (сейчас ${cpuPower})`);
    if (!osMeetsMinimum(MIN_AI_OS_POWER)) { const os = installedItem('OS'); problems.push(`нужна ОС не слабее Windows 11 Home (${MIN_AI_OS_POWER} мощности, сейчас ${os ? Number(os.performance) || 0 : 0})`); }
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
const AI_WIRE_OPTIONS = [
  { key:'red', ru:'Красный', en:'Red', color:'#e85b5b' },
  { key:'blue', ru:'Синий', en:'Blue', color:'#4f91e8' },
  { key:'green', ru:'Зелёный', en:'Green', color:'#50b86d' },
  { key:'yellow', ru:'Жёлтый', en:'Yellow', color:'#e2c54b' }
];
const AI_WORD_OPTIONS = [
  { ru:'кремний', en:'silicon' },
  { ru:'нейросеть', en:'neural network' },
  { ru:'сервер', en:'server' },
  { ru:'алгоритм', en:'algorithm' },
  { ru:'процессор', en:'processor' },
  { ru:'данные', en:'data' },
  { ru:'обучение', en:'training' },
  { ru:'видеокарта', en:'graphics card' },
  { ru:'кластер', en:'cluster' },
  { ru:'модель', en:'model' }
];
function aiUseEnglish(){ return localStorage.getItem('pcBuilder_language') !== 'ru'; }
function aiWireLabel(key){ const wire=AI_WIRE_OPTIONS.find(w=>w.key===key); return wire ? (aiUseEnglish() ? wire.en : wire.ru) : key; }
function aiWireByKey(key){ return AI_WIRE_OPTIONS.find(w=>w.key===key) || AI_WIRE_OPTIONS[0]; }
function normalizeAiWord(value){ return String(value ?? '').trim().replace(/\s+/g,' ').toLowerCase(); }

function aiTaskTitle(type) {
  const en=aiUseEnglish();
  const titles=en
    ? { wires:'Connect wires', word:'Type a word', download:'Downloading data', file:'Transfer the file', windows:'Close windows' }
    : { wires:'Соедини провода', word:'Напиши слово', download:'Скачивание данных', file:'Перенеси файл', windows:'Закрой окна' };
  return titles[type] || (en ? 'Task' : 'Задача');
}
function renderAiPanel() {
  const area = $('aiArea'); if (!area || !state) return;
  const ram = installedItem('RAM'); const ramGb = ramCapacityGb(ram); const cpu = installedItem('CPU'); const os = installedItem('OS'); const osPower = os ? Number(os.performance) || 0 : 0;
  const ramOk = !!(ram && !isItemBroken(ram) && ['DDR4','DDR5'].includes(ramType(ram)) && ramGb >= 64);
  const cpuOk = !!(cpu && !isItemBroken(cpu) && Number(cpu.performance) >= MIN_AI_CPU_POWER);
  const osOk = osMeetsMinimum(MIN_AI_OS_POWER);
  const unlocked = ramOk && cpuOk && osOk;
  if (!aiRunning) {
    let requirementText = '';
    if (unlocked) requirementText = `✅ Требования выполнены: ${ram.name} · ${cpu.name} · ${os.name}`;
    else {
      const issues = [];
      if (!ramOk) issues.push(`RAM: минимум 64 ГБ DDR4/DDR5 (сейчас ${ramGb || 0} ГБ)`);
      if (!cpuOk) issues.push(`CPU: минимум ${MIN_AI_CPU_POWER} мощности (сейчас ${cpu ? Number(cpu.performance) || 0 : 0})`);
      if (!osOk) issues.push(`ОС: не слабее Windows 11 Home (${MIN_AI_OS_POWER} мощности, сейчас ${osPower})`);
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
      aiTaskState = { remaining: AI_WIRE_OPTIONS.map(w=>w.key), selected: null };
    }
    const wiresTitle=aiUseEnglish()?'Wires':'Провода';
    const portsTitle=aiUseEnglish()?'Connectors':'Разъёмы';
    const statusText=aiUseEnglish()?'Select a wire, then click the connector with the same color.':'Выбери провод, затем разъём такого же цвета.';
    const sourceButtons=aiTaskState.remaining.map((key,i)=>{const wire=aiWireByKey(key);return `<button class="ai-wire-btn" data-wire-src="${key}" style="--wire-color:${wire.color}" data-color="${i}"><span class="ai-wire-swatch"></span>${aiWireLabel(key)}</button>`;}).join('');
    const targetButtons=aiTaskState.remaining.slice().sort(() => Math.random()-.5).map((key,i)=>{const wire=aiWireByKey(key);return `<button class="ai-wire-target" data-wire-target="${key}" style="--wire-color:${wire.color}" data-color="${i}"><span class="ai-wire-port-dot"></span>${aiWireLabel(key)}</button>`;}).join('');
    inner = `<div class="ai-wires-grid"><div class="ai-wire-col"><b>${wiresTitle}</b>${sourceButtons}</div><div class="ai-wire-col"><b>${portsTitle}</b>${targetButtons}</div></div><div id="aiWireStatus" class="ai-task-status">${statusText}</div>`;
  } else if (type === 'word') {
    if (!aiTaskState) {
      const pair=AI_WORD_OPTIONS[randInt(0,AI_WORD_OPTIONS.length-1)];
      const primary=aiUseEnglish()?pair.en:pair.ru;
      aiTaskState={ word:primary.toLowerCase(), accepted:[pair.ru,pair.en].map(normalizeAiWord) };
    }
    const prompt=String(aiTaskState.word||'').toLowerCase();
    const placeholder=aiUseEnglish()?'Type the word':'Введи слово';
    const button=aiUseEnglish()?'Check':'Проверить';
    inner = `<div class="ai-word-task"><div class="ai-word-prompt">${prompt}</div><input id="aiWordInput" class="math-input" autocomplete="off" placeholder="${placeholder}"><button id="aiWordSubmit" class="primary">${button}</button><div id="aiWordStatus" class="ai-task-status"></div></div>`;
  } else if (type === 'download') {
    if (!aiTaskState) aiTaskState = { started: performance.now(), progress: 0, duration: aiStorageDuration(), running: false };
    inner = `<div class="ai-download-task"><div class="ai-download-percent" id="aiDownloadPercent">${Math.floor(aiTaskState.progress)}%</div><div class="ai-download-bar"><div id="aiDownloadBar" style="width:${aiTaskState.progress}%"></div></div><p id="aiDownloadText">Скачивание данных: ${Math.floor(aiTaskState.progress)}% (${(aiTaskState.duration/1000).toFixed(0)} сек)</p></div>`;
  } else if (type === 'file') {
    if (!aiTaskState) aiTaskState = { selected: false, dragging: false };
    inner = `<div class="ai-file-task"><div id="aiFile" class="ai-file" draggable="true" role="button" tabindex="0">📄 training_data.bin</div><div class="ai-file-arrow">→</div><div id="aiFolder" class="ai-folder" role="button">📁 AI_DATA</div><div id="aiFileStatus" class="ai-task-status">ПК: перетащи файл. Телефон: нажми файл, затем папку.</div></div>`;
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
    document.querySelectorAll('[data-wire-src]').forEach((btn) => btn.onclick = () => {
      aiTaskState.selected = btn.dataset.wireSrc;
      const label=aiWireLabel(aiTaskState.selected);
      document.getElementById('aiWireStatus').textContent = aiUseEnglish() ? `Selected ${label.toLowerCase()}. Now click the matching connector.` : `Выбран ${label}. Теперь нажми соответствующий разъём.`;
    });
    document.querySelectorAll('[data-wire-target]').forEach((btn) => btn.onclick = () => {
      if (!aiTaskState.selected) return;
      const color = btn.dataset.wireTarget;
      const status = document.getElementById('aiWireStatus');
      if (color !== aiTaskState.selected) { status.textContent = aiUseEnglish() ? '❌ The colors do not match.' : '❌ Цвет не совпадает.'; return; }
      aiTaskState.remaining = aiTaskState.remaining.filter((x) => x !== color); aiTaskState.selected = null;
      if (!aiTaskState.remaining.length) finishAiTask(); else renderAiTask();
    });
  } else if (type === 'word') {
    const input = $('aiWordInput'), submit = $('aiWordSubmit'), status = $('aiWordStatus');
    const doSubmit = () => { if (aiTaskState.accepted.includes(normalizeAiWord(input.value))) finishAiTask(); else status.textContent=aiUseEnglish()?'❌ Wrong. Try again.':'❌ Неверно. Попробуй ещё раз.'; };
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
    const taskIndex=aiTaskIndex;
    const taskIsCurrent=()=>aiRunning && aiTaskIndex===taskIndex && aiTasks[aiTaskIndex]==='file';
    const complete=()=>{ if (!taskIsCurrent()) return; finishAiTask(); };
    const selectFile=()=>{ if(!taskIsCurrent()) return; aiTaskState.selected=true; status.textContent='Файл выбран. Нажми или перетащи его к папке AI_DATA.'; file.classList.add('selected'); };
    const onDragStart=()=>{ selectFile(); aiTaskState.dragging=true; file.classList.add('dragging'); };
    const onDragEnd=()=>{ aiTaskState.dragging=false; file.classList.remove('dragging'); folder.classList.remove('drop-ready'); };
    const onDragOver=(e)=>{ if(!taskIsCurrent()) return; e.preventDefault(); folder.classList.add('drop-ready'); };
    const onDragLeave=()=>folder.classList.remove('drop-ready');
    const onDrop=(e)=>{ e.preventDefault(); folder.classList.remove('drop-ready'); complete(); };
    const onClick=()=>{ selectFile(); };
    const onKeyDown=(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectFile(); } };
    const onPointerDown=(e)=>{
      if(e.pointerType!=='touch' && e.pointerType!=='pen') return;
      e.preventDefault();
      selectFile();
      aiTaskState.dragging=true;
      file.classList.add('dragging');
      try { file.setPointerCapture(e.pointerId); } catch {}
    };
    const onPointerMove=(e)=>{
      if(!taskIsCurrent() || !aiTaskState.dragging) return;
      const target=document.elementFromPoint(e.clientX,e.clientY);
      const overFolder=!!target?.closest?.('#aiFolder');
      folder.classList.toggle('drop-ready',overFolder);
      status.textContent=overFolder ? 'Отпусти палец над папкой AI_DATA.' : 'Перетащи файл к папке AI_DATA.';
    };
    const onPointerUp=(e)=>{
      if(!taskIsCurrent() || !aiTaskState.dragging) return;
      const target=document.elementFromPoint(e.clientX,e.clientY);
      const overFolder=!!target?.closest?.('#aiFolder');
      aiTaskState.dragging=false;
      file.classList.remove('dragging');
      folder.classList.remove('drop-ready');
      if(overFolder) complete();
    };
    file.addEventListener('dragstart',onDragStart);
    file.addEventListener('dragend',onDragEnd);
    file.addEventListener('click',onClick);
    file.addEventListener('keydown',onKeyDown);
    file.addEventListener('pointerdown',onPointerDown);
    file.addEventListener('pointermove',onPointerMove);
    file.addEventListener('pointerup',onPointerUp);
    folder.addEventListener('dragover',onDragOver);
    folder.addEventListener('dragleave',onDragLeave);
    folder.addEventListener('drop',onDrop);
    const onFolderClick=()=>{if(!taskIsCurrent())return;if(aiTaskState.selected) complete(); else status.textContent='Сначала выбери файл.';};
    folder.addEventListener('click',onFolderClick);
    aiFileTaskCleanup=()=>{
      file.removeEventListener('dragstart',onDragStart);
      file.removeEventListener('dragend',onDragEnd);
      file.removeEventListener('click',onClick);
      file.removeEventListener('keydown',onKeyDown);
      file.removeEventListener('pointerdown',onPointerDown);
      file.removeEventListener('pointermove',onPointerMove);
      file.removeEventListener('pointerup',onPointerUp);
      folder.removeEventListener('dragover',onDragOver);
      folder.removeEventListener('dragleave',onDragLeave);
      folder.removeEventListener('drop',onDrop);
      folder.removeEventListener('click',onFolderClick);
      folder.classList.remove('drop-ready');
    };
  } else if (type === 'windows') {
    document.querySelectorAll('[data-ai-window-close]').forEach((btn)=>btn.onclick=()=>{const n=Number(btn.dataset.aiWindowClose);aiTaskState.closed.add(n);if(aiTaskState.closed.size>=2)finishAiTask();else renderAiTask();});
  }
}
