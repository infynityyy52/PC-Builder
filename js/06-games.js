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
function installedPerf(category) { const item = itemById(state?.installed?.[category]); return item && !isItemBroken(item) ? (item.performance || 0) : 0; }
function gameFPS(gameOrId) {
  const game = typeof gameOrId === 'string' ? gameById(gameOrId) : gameOrId;
  if (isLightMode()) return 0;
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

function lightStartPower() {
  const start = MODE_CONFIG.light?.start || {};
  return LIGHT_CATEGORIES.reduce((sum, category) => {
    const item = itemById(start[category]);
    return sum + Number(item?.performance || 0);
  }, 0);
}
function pcMultiplier() {
  const raw = 1 + Math.floor(currentPower() / 25) * 0.15;
  if (!isLightMode()) return raw;
  const baseline = lightStartPower();
  return 1 + Math.max(0, Math.floor((currentPower() - baseline) / 25)) * 0.15;
}
function lightClickReward() { return Math.max(10, Math.floor(10 * pcMultiplier())); }
function rewardForPerformance(performance) {
  const performanceMultiplier = Math.max(0.2, Math.min(1.8, performance));
  let reward = state.baseReward * pcMultiplier() * performanceMultiplier * 1.10;
  if (isRyzenCpu(installedItem('CPU'))) reward *= 2;
  const os = installedItem('OS');
  if (os && /^os-windows-(10|11)-/i.test(os.id)) reward *= 1.5;
  return applyPayoutPenalty(Math.max(1, Math.floor(reward)));
}
function finishGame(message, performance, completed = false, expectedGameId = null) {
  const gameId = expectedGameId || activeGame;
  if (!gameId || activeGame !== gameId) return;
  const game = gameById(gameId);
  if (!game) return;
  const fps = gameFPS(game);
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
  ensureMarket();
  let couponMessage = '';
  let earnedCoupon = null;
  if (completed && game && !(Number(state.couponPercent) > 0) && Math.random() < normalCouponDropChance()) {
    state.couponPercent = randInt(10, 80);
    earnedCoupon = state.couponPercent;
    couponMessage = ` 🎟 Получен купон -${state.couponPercent}% на следующую покупку.`;
  }
  const unlocked = checkAchievements();
  const achievementMessage = unlocked.length ? `🏆 Получено достижение: ${unlocked.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).filter(Boolean).join(', ')}.` : '';
  $('gameResult').textContent = `${message}  +$${reward}${game ? ` • ${fps} FPS` : ''}${couponMessage}${achievementMessage ? ` ${achievementMessage}` : ''}`;
  if (earnedCoupon) showCouponCelebration('normal', earnedCoupon);
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
  // Шанс пожара проверяется в момент старта мини-игры, поэтому он срабатывает
  // даже если игрок не успеет пройти её до конца. Ровно один бросок на игру.
  if (maybeTriggerBlackMarketFire(0.02, 'мини-игры')) {
    return;
  }
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
  if (isLightMode()) { el.textContent = `Лайт: заработок отключён · ПК ×${pcMultiplier().toFixed(2)}`; return; }
  const parts = [`Множитель ПК ×${pcMultiplier().toFixed(2)}`];
  const cpu = installedItem('CPU');
  const os = installedItem('OS');
  if (activeEarnTab === 'games' && isRyzenCpu(cpu)) parts.push(`<span class="cpu-purple-bonus">+100% CPU · Ryzen</span>`);
  if (activeEarnTab === 'games' && os && /^os-windows-(10|11)-/i.test(os.id)) parts.push(`<span class="cpu-purple-bonus">+50% ОС · Windows 10+</span>`);
  if (activeEarnTab === 'afk' && isXeonCpu(cpu)) parts.push(`<span class="cpu-purple-bonus">+200% CPU · Xeon</span>`);
  if (activeEarnTab === 'afk' && os && os.group === 'Linux') parts.push(`<span class="cpu-purple-bonus">+50% ОС · Linux</span>`);
  if (activeEarnTab === 'ai' && isCoreUltraCpu(cpu)) parts.push(`<span class="cpu-purple-bonus">+75% CPU · Core Ultra</span>`);
  if (activeEarnTab === 'programming' && os && os.manufacturer === 'Apple') parts.push(`<span class="cpu-purple-bonus">+50% ОС · macOS</span>`);
  if (state?.money < 0) parts.push(`<span class="debt-payout-penalty">−10% выплаты · долг</span>`);
  el.innerHTML = parts.join(' · ');
  el.classList.toggle('reward-bonus-active', parts.length > 1);
}

// ===== EXTRA MINI-GAMES =====
function gameHeader(title, hint, backId, fps) {
  const game = gameById(activeGame);
  return `<div class="game-header game-header-fps"><div><strong>${title}</strong><span>${hint}</span></div><div class="game-header-actions"><span class="fps-live">${fps} FPS</span><button class="small" id="${backId}">Назад</button></div></div>`;
}
function finishExtra(message, performance = 1, completed = true) {
  const expectedGameId = activeGame;
  finishGame(message, performance, completed, expectedGameId);
}

function initReactionGame() {
  const area=$('gameArea'), game=gameById(activeGame), total=5, fps=gameFPS(game);
  const responseLimit = { easy: 1000, hard: 700, hardcore: 400 }[state.mode] || 1000;
  let round=0, readyAt=0, deadlineAt=0, waiting=false, stopped=false, signalTimer=null, deadlineTimer=null, countdownTimer=null, earlyFinishTimer=null, best=9999;
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
      stopped=true; clearRoundTimers(); btn.textContent='Слишком рано'; btn.classList.remove('ready'); earlyFinishTimer=setTimeout(()=>{earlyFinishTimer=null;finishExtra('Слишком ранняя реакция.',0.075,false);},350); return;
    }
    clearRoundTimers();
    const reaction=Math.round(performance.now()-readyAt); best=Math.min(best,reaction); windowEl.textContent=`Реакция: ${reaction} мс`;
    if(round>=total){ stopped=true; finishExtra(`Средняя реакция около ${best}–${Math.round(best*1.25)} мс.`,Math.max(0.4,1.25-reaction/900),true); } else next();
  });
  $('reactionBack').onclick=backToGamePicker;
  gameCleanup=()=>{stopped=true;clearRoundTimers();if(earlyFinishTimer)clearTimeout(earlyFinishTimer);earlyFinishTimer=null;}; next();
}

function initColorGame(){
  const area=$('gameArea'), game=gameById(activeGame), fps=gameFPS(game), rounds=8; let round=0, score=0, stopped=false, colors=['Красный','Синий','Зелёный','Жёлтый'];
  area.innerHTML=gameHeader('🎨 Цветомания','Выбери названный цвет среди кнопок.', 'colorBack',fps)+`<div class="color-status" id="colorStatus"></div><div class="color-grid" id="colorGrid"></div>`;
  const status=$('colorStatus'), grid=$('colorGrid'); area.querySelector('#colorBack').onclick=backToGamePicker;
  function next(){if(stopped)return;if(round>=rounds){finishExtra(`Результат: ${score}/${rounds}.`,0.35+score/rounds);return;}round++;const target=colors[randInt(0,colors.length-1)];status.textContent=`Раунд ${round}/${rounds}: нажми «${target}»`;grid.innerHTML='';const shuffled=[...colors].sort(()=>Math.random()-.5);shuffled.forEach(c=>{const b=document.createElement('button');b.className='color-button';b.textContent=c;b.dataset.color=c;b.style.background={Красный:'#d74b4b',Синий:'#3478db',Зелёный:'#36a269',Жёлтый:'#d6b43c'}[c];b.addEventListener('click',()=>{if(stopped)return; if(c===target){score++;next();}else finishExtra(`Ошибка цвета. ${score}/${rounds}.`,0.25+score/rounds,false);});grid.appendChild(b);});}
  gameCleanup=()=>{stopped=true;}; next();
}

function initTypingGame(){
  const area=$('gameArea'), game=gameById(activeGame), fps=gameFPS(game);
  const english=typeof isEnglish==='function' && isEnglish();
  const texts=english
    ? ['server','graphics card','motherboard','ram','interface','performance']
    : ['сервер','видеокарта','материнская плата','оперативная память','интерфейс','производительность'];
  const aliases={
    'server':['server','сервер'],
    'graphics card':['graphics card','graphics cards','видеокарта','видеокарты'],
    'motherboard':['motherboard','материнская плата','материнскую плату','материнской плате'],
    'ram':['ram','оперативная память','оперативную память'],
    'interface':['interface','интерфейс'],
    'performance':['performance','производительность']
  };
  let index=0,started=performance.now(),stopped=false;
  const title=english?'⌨️ Typing Machine':'⌨️ Печатная машинка';
  const description=english?'Retype each line exactly as shown.':'Перепечатывай строки без ошибок.';
  const submitLabel=english?'Check':'Готово';
  const errorText=english?'Wrong. Retype the line exactly as shown.':'Ошибка. Исправь строку.';
  const progressLabel=(i,total)=>english?`${i}/${total}`:`${i}/${total}`;
  area.innerHTML=gameHeader(title,description,'typingBack',fps)+`<div class="typing-card"><div id="typingPrompt" class="typing-prompt"></div><input id="typingInput" class="math-input" autocomplete="off" autofocus><button id="typingSubmit" class="primary">${submitLabel}</button><div id="typingStatus"></div></div>`;
  const prompt=$('typingPrompt'),input=$('typingInput'),status=$('typingStatus');area.querySelector('#typingBack').onclick=backToGamePicker;
  function normalized(value){return String(value??'').trim().toLowerCase().replace(/\s+/g,' ');}
  function acceptable(value,target){
    const typed=normalized(value), shown=normalized(target);
    if(typed===shown)return true;
    const list=english ? (aliases[shown]||[shown]) : (Object.entries(aliases).find(([,items])=>items.includes(shown))?.[1]||[shown]);
    return list.some(item=>normalized(item)===typed);
  }
  function next(){
    if(index>=texts.length){
      const sec=(performance.now()-started)/1000;
      const done=english?`Completed in ${sec.toFixed(1)} sec.`:`Готово за ${sec.toFixed(1)} сек.`;
      finishExtra(done,Math.min(1.5,1.25-(sec/texts.length)/4));
      return;
    }
    prompt.textContent=texts[index];
    input.value='';
    input.focus();
    status.textContent=progressLabel(index+1,texts.length);
  }
  function submit(){
    if(stopped)return;
    if(!acceptable(input.value,texts[index])){status.textContent=errorText;return;}
    index++;
    next();
  }
  $('typingSubmit').onclick=submit;
  input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  gameCleanup=()=>{stopped=true;};
  next();
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

function dispatchGameKey(type, down){
  const codeMap = {
    left: ['ArrowLeft', 'arrowleft'], right: ['ArrowRight', 'arrowright'],
    up: ['ArrowUp', 'arrowup'], down: ['ArrowDown', 'arrowdown'],
    fire: ['Space', ' ']
  };
  const pair = codeMap[type]; if (!pair) return;
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key: pair[1], code: pair[0], bubbles: true }));
}
function addCanvasTouchControls(canvas, layout = []) {
  if (!canvas || !layout.length) return null;
  const host = canvas.parentElement;
  if (!host) return null;
  const controls = document.createElement('div'); controls.className = `mobile-game-controls mobile-controls-${layout.length}`;
  controls.setAttribute('aria-label', 'Сенсорное управление');
  const labels = { left:'←', right:'→', up:'↑', down:'↓', fire:'🔥', action:'●' };
  layout.forEach((type) => {
    const b = document.createElement('button'); b.type='button'; b.className='mobile-game-control'; b.dataset.control=type; b.textContent=labels[type] || '●';
    b.setAttribute('aria-label', type);
    if (type === 'action') { b.addEventListener('pointerdown', (e)=>{e.preventDefault(); b.classList.add('pressed'); canvas.click();}); b.addEventListener('pointerup', ()=>b.classList.remove('pressed')); b.addEventListener('pointercancel', ()=>b.classList.remove('pressed')); }
    else {
      const start=(e)=>{e.preventDefault(); b.classList.add('pressed'); dispatchGameKey(type,true);};
      const stop=(e)=>{if(e) e.preventDefault(); b.classList.remove('pressed'); dispatchGameKey(type,false);};
      b.addEventListener('pointerdown',start); b.addEventListener('pointerup',stop); b.addEventListener('pointercancel',stop); b.addEventListener('pointerleave',stop);
    }
    controls.appendChild(b);
  });
  host.appendChild(controls);
  return controls;
}

function canvasGameShell(title,hint,backId,fps){
  const area=$('gameArea');
  area.innerHTML=gameHeader(title,hint,backId,fps)+`<canvas class="arcade-canvas" id="arcadeCanvas" width="720" height="420"></canvas><div id="canvasStatus" class="color-status"></div>`;
  area.querySelector('#'+backId).onclick=backToGamePicker;
  const canvas=$('arcadeCanvas');
  const layouts={
    dodge:['left','up','down','right'], snake:['left','up','down','right'], maze:['left','up','down','right'],
    pong:['up','down'], breakout:['left','right'], flappy:['action'], racer:['left','right'],
    asteroids:['left','up','down','right','fire'], tetris:['left','up','down','right'], platformer:['action'], spaceshooter:['left','right','fire']
  };
  addCanvasTouchControls(canvas, layouts[gameById(activeGame)?.mechanic] || []);
  return canvas;
}

function initDodgeGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('☄️ Уклонение','Стрелки / WASD. Выживи 20 секунд.', 'dodgeBack',fps),ctx=canvas.getContext('2d');let x=360,y=360,keys={},hazards=[],stopped=false,raf=0,start=performance.now(),last=performance.now();function key(e,v){keys[e.key.toLowerCase()]=v;if(v&&['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase()))e.preventDefault();}const keyDown=e=>key(e,true),keyUp=e=>key(e,false);window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;x+=(keys.arrowright||keys.d?1:0)*260*dt;x-=(keys.arrowleft||keys.a?1:0)*260*dt;y+=(keys.arrowdown||keys.s?1:0)*260*dt;y-=(keys.arrowup||keys.w?1:0)*260*dt;x=Math.max(12,Math.min(708,x));y=Math.max(12,Math.min(408,y));if(Math.random()<dt*(4+fps/70))hazards.push({x:randInt(10,710),y:-10,s:randInt(4,10)});hazards.forEach(h=>h.y+=h.s*55*dt);hazards=hazards.filter(h=>h.y<440);const hit=hazards.some(h=>Math.hypot(h.x-x,h.y-y)<20);ctx.clearRect(0,0,720,420);ctx.fillStyle='rgba(20,30,40,.96)';ctx.fillRect(0,0,720,420);ctx.fillStyle='#4ea2ff';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff5d6c';hazards.forEach(h=>{ctx.beginPath();ctx.arc(h.x,h.y,8,0,Math.PI*2);ctx.fill();});const sec=(t-start)/1000;$('canvasStatus').textContent=`${(20-sec).toFixed(1)} сек осталось`;if(hit){stopped=true;finishExtra('Попадание. Игра окончена.',Math.max(.3,sec/18),false);return;}if(sec>=20){stopped=true;finishExtra('Выжил все 20 секунд.',1.35);return;}raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);};
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
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🐤 Flappy','Пробел / клик — взлёт. Пройди 12 ворот.', 'flappyBack',fps),ctx=canvas.getContext('2d');let birdY=210,vy=0,gates=[],passed=0,stopped=false,last=performance.now(),raf=0;function gate(){gates.push({x:730,gapY:randInt(100,315)});}const flap=()=>{if(!stopped)vy=-280;};const keyDown=e=>{if(e.code==='Space'){e.preventDefault();flap();}};canvas.addEventListener('click',flap);window.addEventListener('keydown',keyDown);gate();function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;vy+=780*dt;birdY+=vy*dt;gates.forEach(g=>g.x-=160*dt);if(gates.length<4&&gates[gates.length-1].x<500)gate();const g=gates[0];if(g&&g.x<370&&g.x>320){if(birdY<g.gapY-55||birdY>g.gapY+55){stopped=true;finishExtra(`Врезался на воротах ${passed+1}.`,Math.max(.3,passed/10),false);return;}}if(g&&g.x+30<330){gates.shift();passed++;if(passed>=12){stopped=true;finishExtra('Пройдено 12 ворот!',1.35);return;}}if(birdY<0||birdY>420){stopped=true;finishExtra(`Падение. Ворот: ${passed}.`,.3,false);return;}ctx.fillStyle='#0f1820';ctx.fillRect(0,0,720,420);ctx.fillStyle='#73b8ff';ctx.beginPath();ctx.arc(330,birdY,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4aab76';gates.forEach(g=>{ctx.fillRect(g.x,0,30,g.gapY-55);ctx.fillRect(g.x,g.gapY+55,30,420);});$('canvasStatus').textContent=`🚪 ${passed}/12`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('click',flap);window.removeEventListener('keydown',keyDown);};
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
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🕹️ Pixel Runner','Пробел / стрелка вверх — прыжок. Доберись до финиша.', 'platformerBack',fps),ctx=canvas.getContext('2d');let px=70,py=350,vy=0,scroll=0,obstacles=[],stopped=false,last=performance.now(),raf=0;function jump(){if(py>=350)vy=-420;}const keyDown=e=>{if(e.code==='Space'||e.key==='ArrowUp'){e.preventDefault();jump();}};window.addEventListener('keydown',keyDown);canvas.addEventListener('click',jump);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;vy+=1050*dt;py+=vy*dt;if(py>350){py=350;vy=0;}scroll+=180*dt;if(Math.random()<dt*.8)obstacles.push({x:760,y:340,w:randInt(24,40),h:randInt(25,55)});obstacles.forEach(o=>o.x-=220*dt);obstacles=obstacles.filter(o=>o.x>-60);if(obstacles.some(o=>o.x<px+18&&o.x+o.w>px-18&&py+18>o.y)){stopped=true;finishExtra('Столкновение с препятствием.',.35,false);return;}if(scroll>5000){stopped=true;finishExtra('Финиш достигнут!',1.45);return;}ctx.fillStyle='#10151a';ctx.fillRect(0,0,720,420);ctx.fillStyle='#29343c';ctx.fillRect(0,370,720,50);ctx.fillStyle='#6db0ff';ctx.fillRect(px-16,py-18,32,36);ctx.fillStyle='#df6b75';obstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));$('canvasStatus').textContent=`🏁 ${Math.min(100,Math.round(scroll/50))}%`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keyDown);};
}

function initSpaceShooterGame(){
  const game=gameById(activeGame),fps=gameFPS(game),canvas=canvasGameShell('🚀 Space Shooter','Стрелки + пробел. Уничтожь 30 врагов.', 'spaceBack',fps),ctx=canvas.getContext('2d');let x=360,y=360,bullets=[],enemies=[],score=0,keys={},stopped=false,last=performance.now(),lastShot=0,raf=0;const kd=e=>keys[e.key.toLowerCase()]=true,ku=e=>keys[e.key.toLowerCase()]=false;window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);function loop(t){if(stopped)return;const dt=Math.min(.05,(t-last)/1000);last=t;x+=(keys.a||keys.arrowleft?-1:0)*280*dt+(keys.d||keys.arrowright?1:0)*280*dt;x=Math.max(20,Math.min(700,x));if(keys[' ']){if(t-lastShot>150){bullets.push({x,y});lastShot=t;}}if(Math.random()<dt*(1.2+fps/180))enemies.push({x:randInt(30,690),y:-20,s:70+Math.random()*90});bullets.forEach(b=>b.y-=420*dt);enemies.forEach(e=>e.y+=e.s*dt);for(const b of bullets){const i=enemies.findIndex(e=>Math.hypot(e.x-b.x,e.y-b.y)<18);if(i>=0){enemies.splice(i,1);b.y=-999;score++;if(score>=30){stopped=true;finishExtra('Волна уничтожена: 30 врагов!',1.5);return;}}}if(enemies.some(e=>Math.hypot(e.x-x,e.y-y)<24)){stopped=true;finishExtra(`Корабль уничтожен. ${score}/30.`,.25+score/40,false);return;}ctx.fillStyle='#070b11';ctx.fillRect(0,0,720,420);ctx.fillStyle='#6db9ff';ctx.fillRect(x-16,y-22,32,44);ctx.fillStyle='#dd6271';enemies.forEach(e=>{ctx.beginPath();ctx.arc(e.x,e.y,14,0,Math.PI*2);ctx.fill();});ctx.fillStyle='#f2d36b';bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-8,4,12));$('canvasStatus').textContent=`🚀 ${score}/30`;raf=gameRAF(loop,fps);}raf=gameRAF(loop,fps);gameCleanup=()=>{stopped=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);};
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
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);
    if (index !== sequence[userIndex]) { cell.classList.add('wrong'); setTimeout(() => cell.classList.remove('wrong'), 180); endMemory(false, userIndex); return; }
    cell.classList.add('correct'); setTimeout(() => cell.classList.remove('correct'), 120); userIndex += 1;
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
  const source = installedSourceFor(category);
  return info ? `🔴 ${item.name} • ${sourceLabel(source)} • СЛОМАНО ${info.damage}%` : `${item.name} • ${sourceLabel(source)}`;
}
function displayPartLabel(category) {
  return state.mode === 'easy' ? (MAIN_PART_LABELS_EASY[category] || category) : category;
}
function setMoneyVisible(visible) {
  const moneyWrap = $('money')?.parentElement;
  if (moneyWrap) moneyWrap.classList.toggle('hidden', !visible);
}
function renderPcCoupons() {
  const wrap = $('pcCoupons');
  if (!wrap) return;
  const parts = [];
  const coupon = Number(state?.couponPercent) || 0;
  if (coupon > 0) parts.push(`<span class="pc-coupon pc-coupon-normal">🎟️ -${coupon}%</span>`);
  if (state?.extraCoupon) parts.push('<span class="pc-coupon pc-coupon-extra">🎟️ EXTRA</span>');
  wrap.innerHTML = parts.join('');
}

function showMainMenu() {
  cancelOsInstall();
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

