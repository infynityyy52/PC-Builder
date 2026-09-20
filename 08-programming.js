const PROGRAMMING_TASKS = [
  { language:'JavaScript', title:'Сумма двух чисел', difficulty:1, prompt:'Заполни функцию, которая возвращает сумму a и b.', template:'function add(a, b) {\n  return ___;\n}', answer:'a + b', hint:'Подсказка: сложи два параметра через +.' },
  { language:'HTML', title:'Заголовок страницы', difficulty:1, prompt:'Создай заголовок первого уровня с текстом PC Builder.', template:'___', answer:'<h1>PC Builder</h1>', hint:'Подсказка: используй тег h1.' },
  { language:'Python', title:'Квадрат числа', difficulty:2, prompt:'Напиши функцию с четырьмя строками кода, которая возвращает квадрат x.', template:'def square(x):\n    result = ___\n    return result\nprint(square(5))', answer:'x * x', hint:'Подсказка: сохрани x * x в result.' },
  { language:'Python', title:'Приветствие', difficulty:2, prompt:'Напиши четыре строки кода, возвращающие строку Hello, и имя через пробел.', template:'def greet(name):\n    message = ___\n    return message\nprint(greet("Alex"))', answer:'"Hello, " + name', hint:'Подсказка: сначала собери строку в message.' },
  { language:'Java', title:'Умножение', difficulty:3, prompt:'Напиши пять строк кода, возвращающих произведение a и b.', template:'static int multiply(int a, int b) {\n    int result = ___;\n    System.out.println(result);\n    return result;\n}', answer:'a * b', hint:'Подсказка: сначала вычисли произведение и сохрани его в result.' },
  { language:'C++', title:'Максимум двух чисел', difficulty:3, prompt:'Напиши пять строк кода, возвращающих большее из двух чисел.', template:'int max2(int a, int b) {\n    int result = ___;\n    std::cout << result;\n    return result;\n}', answer:'a > b ? a : b', hint:'Подсказка: используй тернарный оператор.' },
  { language:'Java', title:'Чётное число', difficulty:4, prompt:'Напиши шесть строк кода, проверяющих делимость n на 2 без остатка.', template:'static boolean isEven(int n) {\n    int remainder = n % 2;\n    boolean result = ___;\n    System.out.println(result);\n    if (!result) return false;\n    return true;\n}', answer:'remainder == 0', hint:'Подсказка: остаток от деления должен быть равен нулю.' },
  { language:'C++', title:'Счётчик', difficulty:4, prompt:'Напиши шесть строк кода и увеличь count на 1.', template:'void increment(int& count) {\n    int before = count;\n    count = ___;\n    int after = count;\n    std::cout << before;\n    std::cout << after;\n}', answer:'count + 1', hint:'Подсказка: новая величина должна быть count + 1.' }
];
let programmingTask = null;
function normalizeExactCode(value) {
  return String(value == null ? '' : value).replace(/\r\n?/g, '\n');
}
function programmingCodeMatches(input, expected) {
  // Программирование сдаётся строго: ни лишних пробелов, ни лишних строк.
  return normalizeExactCode(input) === normalizeExactCode(expected);
}
function escapeCodeHtml(value) { return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function highlightCode(code) {
  let out = escapeCodeHtml(code);
  const savedStrings = [];
  out = out.replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, (match) => {
    const indexChar = String.fromCharCode(0xE100 + savedStrings.length);
    const token = `\uE000${indexChar}\uE001`;
    savedStrings.push(`<span class="code-string">${match}</span>`);
    return token;
  });
  out = out.replace(/\b(function|return|def|int|void|static|boolean|if|else|const|let|var|class|public|private|true|false)\b/g, '<span class="code-keyword">$1</span>');
  out = out.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
  out = out.replace(/\uE000([\uE100-\uE1FF])\uE001/g, (_, indexChar) => savedStrings[indexChar.charCodeAt(0) - 0xE100] || '');
  return out;
}
function pickProgrammingTask() { programmingTask = PROGRAMMING_TASKS[randInt(0, PROGRAMMING_TASKS.length - 1)]; return programmingTask; }
function programmingRequirementsMet() {
  const cpu = installedItem('CPU'); const ram = installedItem('RAM');
  // Для программирования важен объём RAM, а не поколение памяти:
  // 4+ ГБ DDR3, DDR4 или DDR5 подходят.
  return !!(cpu && !isItemBroken(cpu) && Number(cpu.performance) >= MIN_PROGRAMMING_CPU_POWER && ram && !isItemBroken(ram) && ['DDR3','DDR4','DDR5'].includes(ramType(ram)) && ramCapacityGb(ram) >= MIN_PROGRAMMING_RAM_GB);
}
function programmingCanStart() {
  // Программирование полностью блокируется, если сборка ПК невалидна:
  // нет обязательных компонентов, конфликтуют CPU/MB/RAM/PSU/ОС и т.д.
  return programmingRequirementsMet() && checkCompatibility().length === 0;
}
function programmingRequirementText() {
  const cpu=installedItem('CPU'), ram=installedItem('RAM'); const cpuPower=cpu ? Number(cpu.performance)||0 : 0; const ramGb=ramCapacityGb(ram); const kind=ram ? ramType(ram) : 'нет';
  const problems=[];
  if (!cpu || isItemBroken(cpu) || cpuPower < MIN_PROGRAMMING_CPU_POWER) problems.push(`CPU: минимум Intel Pentium J2900 (10 мощности, сейчас ${cpuPower})`);
  if (!ram || isItemBroken(ram) || !['DDR3','DDR4','DDR5'].includes(kind) || ramGb < MIN_PROGRAMMING_RAM_GB) problems.push(`RAM: минимум 4 ГБ DDR3/DDR4/DDR5 (сейчас ${ramGb || 0} ГБ${ram ? ` ${kind}` : ''})`);
  const compatibilityIssues = checkCompatibility();
  if (compatibilityIssues.length) {
    const issueText = compatibilityIssues.slice(0, 2).map((issue) => issue.title).join(' · ');
    problems.push(`Сборка ПК невалидна: ${issueText}`);
  }
  if (!problems.length) return `✅ Требования выполнены: ${cpu.name} · ${ram.name} (${kind})`;
  return `🔒 ${problems.join(' · ')}`;
}
function programmingReward(task) {
  const baseByDifficulty = { 1: 50, 2: 75, 3: 100, 4: 125 };
  let reward = Number(baseByDifficulty[Number(task?.difficulty)] || 50) * pcMultiplier();
  const os = installedItem('OS');
  if (os && os.manufacturer === 'Apple') reward *= 1.5;
  return applyPayoutPenalty(Math.max(1, Math.floor(reward)));
}
function renderProgrammingPanel() {
  const area=$('programmingArea'); if(!area||!state)return;
  if(!programmingCanStart()) { area.innerHTML=`<div class="programming-card"><div class="programming-summary"><div><b>💻 Программирование</b><span>Пиши небольшие программы по готовому шаблону и получай деньги только после успешного завершения.</span></div><div class="programming-badge-row"><span class="badge">JavaScript · HTML · Python · C++ · Java</span></div></div><div class="programming-requirement locked">❌ Программирование недоступно: исправь сборку ПК.<br>${programmingRequirementText()}</div></div>`; return; }
  if(!programmingTask)pickProgrammingTask(); const task=programmingTask;
  area.innerHTML=`<div class="programming-card"><div class="programming-summary"><div><b>💻 ${task.language}: ${task.title}</b><span>${task.prompt}</span></div><div class="programming-badge-row"><span class="badge">Сложность ${task.difficulty}/4</span><span class="badge">+$${formatMoney(programmingReward(task))} за успех</span></div></div><div class="programming-editor-wrap"><pre id="programmingReference" class="programming-reference-overlay" aria-hidden="true"></pre><textarea id="programmingInput" class="programming-editor" spellcheck="false" autocomplete="off"></textarea></div><div id="programmingEditorNote" class="programming-editor-note">Нажми на поле ввода…</div><div class="programming-actions"><button id="programmingCheckBtn" class="primary">✓ Проверить код</button><button id="programmingNextBtn" class="small">↻ Другая задача</button></div><div id="programmingStatus" class="programming-status">${task.hint}</div></div>`;
  const input=$('programmingInput'),reference=$('programmingReference'),note=$('programmingEditorNote');
  if(input&&reference){
    const expectedCode=String(task.template).replace('___', task.answer);
    const lines=expectedCode.replace(/\r/g,'').split('\n');
    const updateReference=()=>{
      const value=input.value.slice(0,input.selectionStart ?? input.value.length);
      const lineIndex=(value.match(/\n/g)||[]).length;
      const line=lines[lineIndex] ?? '';
      const display=new Array(lineIndex).fill('').concat([line]).join('\n');
      reference.innerHTML=highlightCode(display);
      reference.scrollTop=input.scrollTop;
      reference.scrollLeft=input.scrollLeft;
      reference.style.opacity=document.activeElement===input ? '1' : '0';
    };
    const sync=()=>{ reference.scrollTop=input.scrollTop; reference.scrollLeft=input.scrollLeft; };
    input.addEventListener('focus',()=>{ if(note) note.textContent='Ориентир показан на активной строке. Пиши строго по нему.'; updateReference(); });
    input.addEventListener('blur',()=>{ reference.style.opacity='0'; if(note) note.textContent='Нажми на поле ввода…'; });
    input.addEventListener('input',updateReference);
    input.addEventListener('click',updateReference);
    input.addEventListener('keyup',updateReference);
    input.addEventListener('scroll',sync);
    updateReference();
  }
  $('programmingCheckBtn').onclick=checkProgrammingTask; $('programmingNextBtn').onclick=()=>{pickProgrammingTask();renderProgrammingPanel();};
}
function checkProgrammingTask() {
  if(!programmingCanStart()||!programmingTask){renderProgrammingPanel();return;}
  const input=$('programmingInput'),status=$('programmingStatus'); if(!input||!status)return;
  const expected=String(programmingTask.template).replace('___', programmingTask.answer);
  if(!programmingCodeMatches(input.value, expected)) { status.innerHTML=`❌ Код не совпадает с ориентиром точь-в-точь. Проверь пробелы, переносы строк и символы.`; return; }
  const reward=programmingReward(programmingTask); state.money+=reward; const fireTriggered=maybeTriggerBlackMarketFire(0.01,'программирование'); state.programmingStats=state.programmingStats||{completed:0}; state.programmingStats.completed+=1;
  $('money').textContent=formatMoney(state.money); const rewardParts = [`💻 Код успешно выполнен! +$${formatMoney(reward)}`, `ПК ×${pcMultiplier().toFixed(2)}`];
  if (installedItem('OS')?.manufacturer === 'Apple') rewardParts.push('+50% macOS');
  $('gameResult').textContent=rewardParts.join(' · ');
  programmingTask=null; save(); checkAchievements(); renderProgrammingPanel(); renderRewardInfo(); if (fireTriggered) renderBlackMarketFireModal();
}

function renderEarnTabsLegacyCompat() {}
