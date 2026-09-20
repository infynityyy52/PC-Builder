function setEarnTab(tab) {
  if (isLightMode()) return;
  if (tab === activeEarnTab) return;
  if (tab === 'games' && (afkOverheated || afkTaskCount())) { renderAfkPanel(); return; }
  if (activeGame) closeGame();
  if (tab !== 'ai' && activeEarnTab === 'ai') stopAiTraining();
  if (tab === 'ai') stopAfk();
  activeEarnTab = ['games','afk','ai','programming'].includes(tab) ? tab : 'games';
  localStorage.setItem(EARN_TAB_KEY, activeEarnTab);
  if (activeEarnTab === 'games' || activeEarnTab === 'programming') stopAfk();
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
  const afkCpu = installedItem('CPU'); const afkCpuPower = afkCpu ? Number(afkCpu.performance) || 0 : 0; const afkCpuOk = !!(afkCpu && !isItemBroken(afkCpu) && afkCpuPower >= MIN_AFK_CPU_POWER); const afkOs = installedItem('OS'); const afkOsPower = afkOs ? Number(afkOs.performance) || 0 : 0; const afkOsOk = osMeetsMinimum(MIN_AFK_OS_POWER);
  area.innerHTML=`<div class="afk-status-card ${afkOverheated?'overheated':''}"><div class="afk-summary"><span>Средний доход: <b>$${formatMoney(Math.floor(avg))}</b> / сек</span><span>Статус: <b>${afkOverheated?(afkExitPending?'ОХЛАЖДЕНИЕ → ВЫХОД':'ПЕРЕГРЕВ'):(afkRunning?'РАБОТАЕТ':'ОСТАНОВЛЕН')}</b></span></div><div class="afk-chip-row"><span class="badge">Компоненты: ${activeCount}/3</span><span class="badge">Выплата: $${formatMoney(payout)} каждые ${interval.toFixed(0)} сек</span>${afkMode==='overclock'?'<span class="badge afk-boost">×5 РАЗГОН</span>':''}<span class="badge">Испытания: ${afkTaskCount()}/${afkTaskLimit()}</span></div>${renderAfkComponentCards()}${renderAfkTasks()}<div class="afk-next-payout">${!afkCpuOk?`⚠ Для AFK нужен CPU не слабее ${MIN_AFK_CPU_POWER} мощности. Сейчас: ${afkCpuPower}.`:!afkOsOk?`⚠ Для AFK нужна ОС не слабее Linux Mint (${MIN_AFK_OS_POWER} мощности). Сейчас: ${afkOsPower}.`:afkMode==='overclock'&&ramCapacityGb(installedItem('RAM'))<16?'⚠ Для разгона нужно минимум 16 ГБ RAM.':afkRunning&&!afkOverheated?`Следующая выплата через <b id="afkCountdownText">${(remain/1000).toFixed(1)} сек</b>.`:afkExitPending?'❄ Заверши текущие испытания, чтобы выйти из AFK.':afkComponents.CPU?'Нажми «Запустить AFK», чтобы начать.':'⚠ Включи CPU, чтобы получать доход.'}</div><div class="afk-controls"><button id="afkStartBtn" class="primary" ${!afkRunning&&!afkExitPending&&(!afkCpuOk||!afkOsOk)?'disabled':''}>${afkRunning?'⏸ Остановить AFK':(afkExitPending?'⏳ Заверши испытания':'▶ Запустить AFK')}</button></div><div class="afk-log">${afkTaskCount()?'⚠ Активные испытания нельзя игнорировать. Провал ломает соответствующую деталь.':afkRunning?'AFK работает. Проверка сборки идёт перед каждой выплатой.':'Выбери работающие компоненты и запусти режим.'}</div></div>`;
  $('afkStartBtn').onclick=()=>{if(afkRunning)requestStopAfk();else if(!afkExitPending)startAfk();};
  document.querySelectorAll('[data-afk-component]').forEach(input=>input.addEventListener('change',()=>{const c=input.dataset.afkComponent;if(input.checked&&!componentAfkAvailable(c)){input.checked=false;return;}afkComponents[c]=input.checked;state.afkComponents={...afkComponents};const type=c==='GPU'?'gpu':c==='Storage'?'storage':'cpu';if(!afkComponents[c]&&afkTasks[type]){clearAfkTaskTimers(afkTasks[type]);if(type==='storage')clearAfkStopListeners();delete afkTasks[type];if(type==='cpu'){afkOverheated=false;afkCoolProgress=0;afkHeatDeadline=0;}}if(afkRunning&&!afkOverheated){afkLastPayoutAt=performance.now();afkNextPayoutAt=afkLastPayoutAt+afkPayoutInterval(); if(afkMode==='overclock') scheduleAfkTaskSpawn();}save();renderAfkPanel();}));
  bindAfkTaskEvents();
}
function startAfk() {
  if (isLightMode()) return;
  syncAfkComponents();
  const cpu = installedItem('CPU'); const cpuPower = cpu ? Number(cpu.performance) || 0 : 0;
  if (!cpu || isItemBroken(cpu) || cpuPower < MIN_AFK_CPU_POWER) { $('gameResult').textContent = `Для AFK нужен рабочий CPU не слабее ${MIN_AFK_CPU_POWER} мощности. Сейчас: ${cpuPower}.`; renderAfkPanel(); return; }
  const os = installedItem('OS');
  if (!osMeetsMinimum(MIN_AFK_OS_POWER)) { $('gameResult').textContent = `Для AFK нужна ОС не слабее Linux Mint (${MIN_AFK_OS_POWER} мощности). Сейчас: ${os ? Number(os.performance) || 0 : 0}.`; renderAfkPanel(); return; }
  if (!afkComponents.CPU) { $('gameResult').textContent = 'Для AFK необходимо включить CPU.'; renderAfkPanel(); return; }
  if (afkMode === 'overclock') {
    const ram = installedItem('RAM');
    const ramGb = ramCapacityGb(ram);
    if (ramGb < 16) { $('gameResult').textContent = `Для разгона нужно минимум 16 ГБ RAM. Сейчас установлено: ${ramGb || 0} ГБ.`; renderAfkPanel(); return; }
  }
  const issues=checkCompatibility(); if(issues.length){openDiagnostic(issues);return;}
  stopAfk(); afkExitPending=false; afkRunning=true; afkLastPayoutAt=performance.now(); afkNextPayoutAt=afkLastPayoutAt+afkPayoutInterval(); if (afkMode === 'overclock') scheduleAfkTaskSpawn();
  const tick=()=>{if(!afkRunning||!state)return;if(afkOverheated&&afkTasks.cpu&&performance.now()>=afkHeatDeadline){failAfkTask('cpu','Охлаждение не завершено вовремя.');return;}if(performance.now()>=afkNextPayoutAt&&!afkOverheated){const issuesNow=checkCompatibility();if(issuesNow.length){afkRunning=false;resetAfkTimersOnly();clearAfkTasks();renderAfkPanel();openDiagnostic(issuesNow);return;}if(!activeAfkComponents().includes('CPU')){afkRunning=false;resetAfkTimersOnly();clearAfkTasks();renderAfkPanel();return;}const payout=afkPayoutAmount();state.money+=payout;checkAchievements();const fireTriggered=maybeTriggerBlackMarketFire(0.005,'AFK');if(fireTriggered){save();return;}const extraCouponEarned=maybeGrantExtraCouponFromAfkPayout();afkLastPayoutAt=performance.now();afkNextPayoutAt=afkLastPayoutAt+afkPayoutInterval();save();$('money').textContent=formatMoney(state.money);if(extraCouponEarned)render();if(maybeBreakXeonAfterPayout())return;}if(!afkOverheated&&afkTaskCount()<afkTaskLimit()&&afkRunning) scheduleAfkTaskSpawn();updateAfkLiveUI();};
  afkTimer=setInterval(tick,100); renderAfkPanel();
}
function bindCoolingHold(button = $('afkTaskCoolBtn')) {const btn=button;if(!btn)return;let holding=false,last=0;const stop=()=>{holding=false;if(afkCoolTimer){clearInterval(afkCoolTimer);afkCoolTimer=null;}};const start=()=>{if(!afkOverheated||!afkTasks.cpu||holding)return;holding=true;last=performance.now();afkCoolTimer=setInterval(()=>{const now=performance.now();const delta=now-last;last=now;afkCoolProgress=Math.min(1,afkCoolProgress+delta/(cpuCoolingDuration()*1000));const bar=$('afkTaskCoolProgress');if(bar)bar.style.width=`${Math.round(afkCoolProgress*100)}%`;if(performance.now()>=afkHeatDeadline){stop();failAfkTask('cpu','Охлаждение не завершено вовремя.');return;}if(afkCoolProgress>=1){stop();finishAfkComponentTask('cpu','❄ CPU успешно охлаждён. ');}},50);};['pointerdown','mousedown','touchstart'].forEach(e=>btn.addEventListener(e,start,{passive:true}));['pointerup','pointercancel','pointerleave','mouseup','touchend','touchcancel'].forEach(e=>btn.addEventListener(e,stop,{passive:true}));}
function closeAfkTask(){ if (afkTaskCount()) return; const modal=$('afkTaskModal'); if(!modal)return; modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
function openAfkComponentGame(type){ if(!afkRunning) return; if(type==='gpu' && componentAfkAvailable('GPU') && !afkTasks.gpu) startGpuTask(); if(type==='storage' && componentAfkAvailable('Storage') && !afkTasks.storage){afkTasks.storage={id:++afkTaskCounter,type:'storage',phase:'idle',startedAt:performance.now()}; startStorageTask();} if(type==='cpu' && componentAfkAvailable('CPU') && !afkTasks.cpu) startCpuTask(); renderAfkPanel(); }
