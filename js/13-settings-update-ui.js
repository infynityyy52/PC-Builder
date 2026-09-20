/* ===== v1.17.9 LANGUAGE SYSTEM ===== */
const LANGUAGE_KEY = 'pcBuilder_language';
const LANGUAGE_PROMPT_KEY = 'pcBuilder_language_prompt_seen';
function currentLanguage(){ return localStorage.getItem(LANGUAGE_KEY) === 'ru' ? 'ru' : 'en'; }
function updateBootLoadingText(){
  const title=$('bootLoadingTitle'), text=$('bootLoadingText');
  if(currentLanguage()==='ru'){
    if(title) title.textContent='Загрузка PC Builder…';
    if(text) text.textContent='Подготавливаем интерфейс. Пожалуйста, подождите немного.';
  }else{
    if(title) title.textContent='Loading PC Builder…';
    if(text) text.textContent='Preparing the interface. Please wait a moment.';
  }
}
const bootLoadingStartedAt = performance.now();
function finishBootLoading(){
  const overlay=$('bootLoading');
  if(!overlay) return;
  updateBootLoadingText();
  const elapsed=performance.now()-bootLoadingStartedAt;
  const delay=Math.max(250,650-elapsed);
  setTimeout(()=>{
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-busy','false');
  },delay);
}
function isEnglish(){ return currentLanguage() === 'en'; }
const I18N_EXAM_DYNAMIC_PHRASES = [
  [/^💻 Код успешно выполнен! \+\$([0-9\s.,]+) · ПК ×([0-9.]+)$/g, (m, reward, multiplier) => `💻 Code completed successfully! +$${reward} · PC ×${multiplier}`],
  [/^Добавляет процент к сумме выплаты\. Встроенную графику включить нельзя\.$/g, 'Adds a percentage to total payouts. Integrated graphics cannot be enabled.'],
  [/^\+([0-9.]+)% к выплате$/g, (m, percent) => `+${percent}% to payouts`],
  [/^Экзамен завершён: ([0-9]+)\/100\. Игра сейчас закрыта\. Хочешь сохранить это прохождение\?$/g, (m, score) => `Exam Finished: ${score}/100. The game is now closed. Would you like to save this playthrough?`],
  [/^❌ Код не совпадает с ориентиром точь-в-точь\. Проверь пробелы, переносы строк и символы\.$/g, '❌ The code does not match the reference exactly. Check spaces, line breaks, and characters.'],
  [/^🔌 Блок питания слабее уровня всей сборки$/g, "🔌 Power Supply Below the Build's Overall Level"],
  [/^⚖️ Перекос между CPU и GPU$/g, '⚖️ CPU/GPU Imbalance'],
  [/^🧠 Мало оперативной памяти$/g, '🧠 Not Enough RAM'],
  [/^🧠 RAM ниже уровня мощной сборки$/g, '🧠 RAM Below the Level of a High-Performance Build'],
  [/^💰 Переплата за (.+)$/g, '💰 Overpaying for $1'],
  [/^Ниже перечислены конкретные замечания по этой сборке\. Названия деталей взяты прямо из твоего текущего ПК\.$/g, 'The specific issues found in this build are listed below. Component names are taken directly from your current PC.'],
  [/^(.+?) — (топ|высокий|средний|начальный|бюджетный) компонент, и к нему претензий нет\. Но (.+?) — (топ|высокий|средний|начальный|бюджетный) уровень\. В такой связке более сильная деталь не сможет полностью раскрыть свой потенциал, потому что более слабая часть будет ограничивать систему\. Для экзамена лучше подбирать CPU и GPU примерно одного класса\.$/g, (m, stronger, strongerTier, weaker, weakerTier) => `${stronger} is a ${({'топ':'top-tier','высокий':'high-end','средний':'mid-range','начальный':'entry-level','бюджетный':'budget'}[strongerTier] || strongerTier)} component, and there are no complaints about it. However, ${weaker} is in the ${({'топ':'top-tier','высокий':'high-end','средний':'mid-range','начальный':'entry-level','бюджетный':'budget'}[weakerTier] || weakerTier)} class. In this combination, the stronger component cannot fully reach its potential because the weaker part limits the system. For the exam, it is better to choose a CPU and GPU from roughly the same performance class.`],
  [/^(.+?) — 80\+ Bronze\. Сам по себе Bronze не означает несовместимость, но для системы с компонентами топ-класса это выглядит как экономия не в том месте и снижает оценку за баланс и качество комплектации\. Для такой сборки логичнее смотреть в сторону более высокого класса БП\.$/g, (m, psu) => `${psu} — 80+ Bronze. Bronze by itself does not mean incompatibility, but for a system with top-tier components it looks like a compromise in the wrong place and lowers the score for balance and overall component quality. For a build like this, a higher-class PSU would make more sense.`],
  [/^(.+?) стоит около \$([0-9\s.,]+)\. В каталоге есть (.+?) примерно за \$([0-9\s.,]+) при близкой производительности\. Экономия около \$([0-9\s.,]+) могла быть направлена в другую слабую часть сборки\.$/g, (m, chosen, price, alt, altPrice, saving) => `${chosen} costs about $${price}. The catalog has ${alt} for about $${altPrice} with similar performance. The $${saving} saved could have been spent on another weak part of the build.`],
  [/Идеальная совместимость/g, 'Ideal Compatibility'],
  [/Баланс сборки/g, 'Build Balance'],
  [/Разумная трата бюджета/g, 'Reasonable Budget Spending'],
  [/Апгрейд на будущее/g, 'Future Upgradeability'],
  [/Переплата за /g, 'Overpaying for '],
  [/По базовым ценам сборка стоит около \$([0-9\s.,]+)\. /g, (m, amount) => `At base component prices, this build costs about $${amount}. `],
  [/По базовым ценам на комплектующие потрачено около \$([0-9\s.,]+)\. /g, (m, amount) => `At base component prices, about $${amount} was spent. `],
  [/В ней есть дорогие компоненты, для которых существовали заметно более дешёвые варианты близкого уровня\./g, 'It includes expensive components for which noticeably cheaper alternatives at a similar performance level were available.'],
  [/(\S+) стоит около \$([0-9\s.,]+)\. В каталоге есть (\S+) примерно за \$([0-9\s.,]+) при близкой производительности\. Экономия около \$([0-9\s.,]+) могла быть направлена в другую слабую часть сборки\./g, (m, chosen, price, alt, altPrice, saving) => `${chosen} costs about $${price}. The catalog has ${alt} for about $${altPrice} with similar performance. The $${saving} saved could have been spent on another weak part of the build.`],
  [/Производительность относительно цены выглядит оправданной\./g, 'The performance is reasonable for the price.'],
  [/Мощность около ([0-9\s.,]+) — систему можно было сделать производительнее без обязательного перехода на самые дорогие детали\./g, (m, amount) => `Power is about ${amount} — the system could have been made faster without requiring the most expensive components.`],
  [/По базовым ценам сборка стоит около \$([0-9\s.,]+)\. В ней есть дорогие компоненты/g, (m, amount) => `At base component prices, this build costs about $${amount}. It includes expensive components`],
];

const I18N_EXACT = {
  'Собери ПК. Играй. Зарабатывай.':'Build a PC. Play. Earn.',
  '▶ Начать':'▶ Start','📂 Загрузить':'📂 Load','ℹ Информация':'ℹ Information','🏆 Достижения':'🏆 Achievements','⚙ Настройки':'⚙ Settings','🎓 Обучение':'🎓 Tutorial','↩ Продолжить текущую игру':'↩ Continue current game','Выбери режим':'Choose a mode','Один режим — одно прохождение.':'One mode — one playthrough.','← В меню':'← Back to menu',
  '🟢 Лёгкий':'🟢 Easy','Нормальный стартовый ПК':'Normal starter PC','🟡 Сложный':'🟡 Hard','Слабый ПК и маленький бюджет':'Weak PC and a small budget','🔴 Хардкор':'🔴 Hardcore','Практически голая система':'Almost bare system','🔵 Лайт':'🔵 Light','Спокойный режим без лишней экономики и случайных событий. При запуске можно включить новое обучение.':'A calm mode without extra economy or random events. You can enable the new tutorial when starting.',
  '🎓 Лайт-режим':'🎓 Light mode','Включить новое обучение?':'Enable the new tutorial?','По умолчанию обучение выключено. При включении подсказки будут объяснять комплектующие и помогать разбирать ошибки прямо во время этого прохождения.':'The tutorial is disabled by default. When enabled, hints will explain components and help you understand mistakes during this playthrough.','Включить обучение в этом прохождении':'Enable the tutorial for this playthrough','Начать Лайт':'Start Light','Назад':'Back',
  '⚠ Хардкор':'⚠ Hardcore','Хардкор очень сложен.':'Hardcore is very difficult.','Этот режим создан только для тех, кто уже умеет обращаться с компьютерами и готов к жёстким ограничениям, поломкам и сложной сборке.':'This mode is only for players who already know their way around computers and are ready for harsh restrictions, failures, and demanding builds.','Действительно хочешь продолжить?':'Are you sure you want to continue?','Да, продолжить':'Yes, continue','Нет, назад':'No, go back',
  '🖥️ Мой ПК':'🖥️ My PC','Купоны':'Coupons','Мощность ПК':'PC Power','🎮 Заработок':'🎮 Earnings','Награда зависит от ПК':'Reward depends on PC','📝 Экзамен':'📝 Exam','🎮 Мини-игры':'🎮 Mini-games','🤖 Обучение ИИ':'🤖 AI Training','💻 Программирование':'💻 Programming','💤 Обычный AFK':'💤 Normal AFK','🔥 Разгон':'🔥 Overclock','Получаешь деньги каждую секунду. Никакого контроля.':'You earn money every second. No supervision needed.','×5 дохода, но нужны минимум 16 ГБ RAM и периодический контроль компонентов.':'×5 income, but you need at least 16 GB RAM and periodic component checks.',
  '🛒 Магазин комплектующих':'🛒 Component Shop','💾 Сохранить':'💾 Save','Сбросить':'Reset','Каталог открыт в отдельном окне.':'The catalog opens in a separate window.','Открыть каталог':'Open catalog','⛓️ Чёрный рынок':'⛓️ Black Market','🎓 Обучение':'🎓 Tutorial',
  '💿 Операционная система':'💿 Operating System','🛠 Проверка ПК':'🛠 PC Check','💾 Сохранения':'💾 Saves','📂 Загрузка сохранения':'📂 Load Save','⚠ Сброс прохождения':'⚠ Reset Playthrough','📝 Экзамен':'📝 Exam','📦 Экзамен завершён':'📦 Exam Finished','🔎 Разбор ошибок':'🔎 Error Analysis','🏆 Достижения':'🏆 Achievements','📜 Update Log':'📜 Update Log',
  'Закрыть':'Close','Понятно':'Got it','Далее':'Next','Завершить':'Finish','Пропустить':'Skip','← Назад':'← Back','Установить':'Install','Продать':'Sell','Купить':'Buy','Установлено':'Installed','Продажа запрещена':'Sale forbidden','Показать Go beyond...':'Show Go beyond...','✅ Получено':'✅ Unlocked','🔒 Заблокировано':'🔒 Locked',
  'В этом разделе пока ничего нет.':'Nothing here yet.','Открыть':'Open','Разделы заработка':'Earnings sections','Тема оформления':'Theme','🌙 Тёмная':'🌙 Dark','☀️ Светлая':'☀️ Light','Анимации интерфейса':'Interface animations','Отключает часть визуальных эффектов.':'Disables some visual effects.','Предупреждение о полиции':'Police warning','Показывать предупреждение перед продажей деталей с чёрного рынка. Можно отключить здесь или прямо в окне продажи.':'Show a warning before selling black-market components. You can disable it here or directly in the sale window.','⛶ Полноэкранный режим':'⛶ Fullscreen','⛶ Выйти из полноэкранного режима':'⛶ Exit fullscreen','Настройки сохраняются отдельно от прохождения.':'Settings are saved separately from the playthrough.',
  'Язык / Language':'Language','Choose the language used throughout the website.':'Choose the language used throughout the website.','Language':'Language','🇬🇧 English':'🇬🇧 English','🇷🇺 Русский':'🇷🇺 Russian','Язык':'Language',
  'Лайт-режим':'Light mode','Здесь нет рынка, случайных цен, купонов, чёрного рынка, событий, SOLD OUT, рероллов, операционной системы и мини-игр. Сейчас мы спокойно учимся собирать рабочий ПК.':'There is no market, random pricing, coupons, black market, events, SOLD OUT, rerolls, operating system, or mini-games here. We can calmly learn how to build a working PC.',
  '💵 Нужны деньги на детали?':'💵 Need money for components?','В Лайте деньги выдаёт только этот простой кликер.':'In Light mode, this simple clicker is the only source of money.','Получить $10':'Get $10','Кликов: 0':'Clicks: 0',
  'Результат ниже 90. Хочешь подробно разобрать свои ошибки? Я покажу конкретные детали и объясню, где сборка теряет баллы и почему.':'The result is below 90. Would you like a detailed review of your mistakes? I will show the exact components and explain where and why the build loses points.',
  'Откажусь пожалуй':'I think I\'ll pass','🔎 Да, разобрать ошибки':'🔎 Yes, review my mistakes','Не сохранять':'Don\'t save','Сохранить':'Save','Назад':'Back',
  '🎟 Купон':'🎟 Coupon','Использовать купон':'Use coupon','Купить без купона':'Buy without coupon','Отмена':'Cancel','Купить':'Buy','Купить вместе с купоном на скидку':'Buy with discount coupon','🚫 Продажа запрещена':'🚫 Sale forbidden','🔌 Сертификат БП':'🔌 PSU Certificate','Купить выбранный':'Buy selected','⚠ Совместимость':'⚠ Compatibility','Да, купить':'Yes, buy','Нет, отмена':'No, cancel','⚠ ПРЕДУПРЕЖДЕНИЕ':'⚠ WARNING','Больше не показывать':'Do not show again','Отказаться':'Decline','Всё равно продать':'Sell anyway','🚨 ПОЛИЦИЯ':'🚨 POLICE','Оплатить':'Pay','🔥 ПОЖАР!':'🔥 FIRE!','Деталь загорелась!':'A component caught fire!','🛒 Каталог комплектующих':'🛒 Component Catalog',
  'Загрузка и установка ОС...':'Loading and installing the OS...','0% · 0 сек':'0% · 0 sec',
  '— игра про сборку ПК, мини-игры, заработок и апгрейды.':'— a game about building PCs, mini-games, earning money, and upgrades.','Чем лучше твоя сборка, тем выше потенциальный заработок в мини-играх. Комплектующие покупаются в динамическом магазине, а установленные детали можно менять.':'The better your build, the higher your potential mini-game earnings. Components are bought from the dynamic shop, and installed parts can be replaced.',
  'Текущее прохождение будет удалено из активного слота. Хочешь сначала сохранить его?':'The current playthrough will be removed from the active slot. Do you want to save it first?','💾 Сохранить и сбросить':'💾 Save and reset','Сбросить без сохранения':'Reset without saving','Отмена':'Cancel','Да, начать экзамен':'Yes, start the exam','Нет, назад':'No, go back',
  'Понятно, вернуться к сборке':'Got it, return to the build',  'Сдай экзамен на 95 или больше баллов.':'Pass the exam with a score of 95 or higher.',
'Хорошо, закончить обучение':'Okay, finish the tutorial','Экзамен завершён. Хочешь сохранить это прохождение?':'The exam is finished. Do you want to save this playthrough?','Собирай определённые конфигурации и открывай достижения. Полученное достижение остаётся навсегда.':'Build specific configurations and unlock achievements. An unlocked achievement stays forever.','Можно купить одну деталь даже при SOLD OUT.':'You can buy one component even when it is SOLD OUT.','Достижение получено!':'Achievement unlocked!','Компенсация за БП':'PSU compensation',
  'Компоненты некуда подключить.':'There is nowhere to connect the components.','Без RAM система не сможет нормально пройти POST.':'Without RAM, the system cannot complete POST normally.','Операционной системе неоткуда загружаться.':'The operating system has nowhere to boot from.','Системе нечем получать питание.':'The system has no power source.','Для запуска нужен установленный загрузочный образ ОС.':'A bootable operating system image is required.',
  'Покупка недоступна: товар больше нельзя купить по текущему состоянию рынка.':'Purchase unavailable: this item cannot currently be bought because of the market state.','Деталь отправлена в инвентарь.':'The component was sent to your inventory.','Получено достижение':'Achievement unlocked','Продажа детали':'Component sale','Шанс быть обнаруженным при продаже':'Chance of being detected while selling','При обнаружении штраф составит':'If detected, the fine will be','Покупки заблокированы':'Purchases are blocked','выплаты −10%':'payouts −10%','Покупка недоступна':'Purchase unavailable','Чёрный рынок закрыт':'Black Market is closed','или товар уже куплен':'or the item was already purchased','чёрном рынке':'Black Market','Куплено на чёрном рынке':'Purchased on the Black Market',

  'Экзамен пройден.':'Exam passed.','Экзамен не пройден.':'Exam failed.','Экзамен провален — разбор ошибок обязателен':'Exam failed — error review is required','🔎 Разбор твоей сборки':'🔎 Review of your build',
  'Ты русский?':'Are you Russian?','PC Builder по умолчанию открыт на английском языке. Если ты русский — нажми кнопку ниже и переключи сайт на русский.':'PC Builder opens in English by default. If you are Russian, click the button below to switch the site to Russian.','🇷🇺 Да, русский':'🇷🇺 Yes, Russian','🇬🇧 Оставить English':'🇬🇧 Keep English'
};
const I18N_WORDS = {
  'Энергоэффективный':'Energy-efficient','Стартовый':'Starter','Стартовая':'Starter','Стартовые':'Starter','Серверный':'Server','серверный':'server','Высокопроизводительный':'High-performance','Рабочая':'Workstation','станция':'station',
  'Классическая':'Classic','Тяжелее':'Heavier','Урезанная':'Stripped-down','Популярный':'Popular','Универсальный':'Universal','Стабильный':'Stable','Современный':'Modern','Минималистичный':'Minimalist','гибкой':'flexible','настройкой':'configuration','использования':'use','Домашняя':'Home','Профессиональная':'Professional','Офисный':'Office','Стеклянный':'Glass','Базовый':'Basic','базовая':'basic','Стоковый':'Stock','Башенный':'Tower','Двухбашенный':'Dual-tower','Премиум':'Premium','Обычный':'Regular','Бюджетный':'Budget','Бюджетная':'Budget','Встроенная':'Integrated','графика':'graphics','Старый':'Old','плата':'board','платы':'boards','материнская':'motherboard','материнской':'motherboard','материнские':'motherboard','процессор':'processor','процессора':'processor','процессоры':'processors','видеокарта':'graphics card','видеокарты':'graphics cards','накопитель':'storage drive','накопителя':'storage drive','накопители':'storage drives','корпус':'case','корпуса':'cases','кулер':'cooler','кулера':'cooler','питания':'power','питание':'power','память':'memory','памяти':'memory','оперативная':'RAM','операционной':'operating','операционную':'operating','система':'system','системы':'systems','охлаждение':'cooling','разгоне':'overclocking','заработку':'earnings','режима':'mode','режим':'mode','режимы':'modes','компонент':'component','компоненты':'components','комплектующие':'components','комплектующих':'components','деталь':'component','детали':'components','деталей':'components','прохождение':'playthrough','прохождения':'playthrough','сборка':'build','сборки':'builds','сборку':'build','сборке':'build','рынок':'market','рынка':'market','каталог':'Catalog','каталога':'catalog','магазин':'shop','магазине':'shop','деньги':'money','денег':'money','баланс':'balance','цена':'price','цены':'prices','скидка':'discount','скидку':'discount','купона':'coupon','купоном':'coupon','купоны':'coupons','купонами':'coupons','событие':'event','события':'events','ошибка':'error','ошибки':'errors','подсказка':'hint','подсказки':'hints','обучение':'tutorial','обучения':'tutorial','экзамен':'exam','экзамена':'exam','экзамену':'exam','разбор':'review','разбора':'review','производительность':'performance','мощность':'power','мощности':'power','уровень':'level','уровня':'level','класс':'class','класса':'class','сертификат':'certificate','сертификата':'certificate','компенсация':'compensation','компенсации':'compensation','балла':'points','баллов':'points','результат':'result','результата':'result','требования':'requirements','требование':'requirement','проверка':'check','проверку':'check','запуск':'start','запуска':'start','начало':'start','начать':'start','закрыть':'close','закрыто':'closed','открыть':'open','открывается':'opens','открывается':'opens','сохранено':'saved','сохранена':'saved','сохранение':'save','сохранения':'saves','сброс':'reset','сбросить':'reset','установить':'install','установка':'installation','установлено':'installed','купить':'buy','покупка':'purchase','покупки':'purchases','продать':'sell','продажа':'sale','продажи':'sales','продано':'sold','починить':'repair','ремонт':'repair','сломана':'broken','сломано':'broken','повреждена':'damaged','повреждены':'damaged','слабее':'weaker','слабый':'weak','сильный':'strong','мощный':'powerful','высокий':'high','высокого':'high','средний':'mid-range','начальный':'entry-level','бюджетный':'budget','топ':'top-tier','разумная':'reasonable','разумно':'reasonably','будущее':'future','будущего':'future','апгрейда':'upgrades','апгрейд':'upgrade','запас':'headroom','сокет':'socket','платформе':'platform','платформа':'platform','поддержка':'support','максимум':'maximum','минимум':'minimum','примерно':'approximately','около':'about','пример':'example','текущего':'current','текущую':'current','текущее':'current','сейчас':'now','теперь':'now','потом':'then','после':'after','перед':'before','внутри':'inside','прямо':'directly','автоматически':'automatically','отдельная':'separate','отдельно':'separately','обычного':'normal','обычном':'normal','обычные':'normal','новый':'new','новое':'new','новая':'new','новые':'new','старый':'old','старое':'old','старые':'old','простой':'simple','простая':'simple','сложный':'difficult','сложное':'difficult','быстрее':'faster','быстрый':'fast','медленный':'slow','данные':'data','данных':'data','файл':'file','файла':'file','кнопка':'button','кнопки':'buttons','окно':'window','окна':'windows','строка':'line','строки':'lines','часть':'part','уровней':'levels','качество':'quality','стандарт':'standard','бронза':'bronze','серебро':'silver','золото':'gold','ватт':'watts','ватта':'watts','слота':'slot','слотов':'slots','клик':'click','кликов':'clicks','игра':'game','игры':'games','игрок':'player','игрока':'player','времени':'time','время':'time','секунд':'seconds','секунду':'second','сек':'sec','появление':'appearance','появления':'appearance','объявления':'ads','реклама':'ads','задача':'task','задач':'tasks','поле':'field','цвет':'color','цвета':'colors','коду':'code','код':'code','строк':'lines','чисел':'numbers','число':'number','ответ':'answer','подсказки':'hints','совместим':'compatible','несовместим':'incompatible','совместимость':'compatibility','рассчитана':'rated','требует':'requires','требуемый':'required','рекомендованный':'recommended','подходящей':'suitable','единственную':'only','единственная':'only','внимание':'attention','полиции':'police','штраф':'fine','оплачен':'paid','недоступно':'unavailable','доступен':'available','доступны':'available','полностью':'fully','успешно':'successfully','провален':'failed','провал':'failure','пройден':'passed','пройдена':'passed','завершён':'finished','завершено':'finished','выплата':'payout','выплаты':'payouts','наград':'rewards','награда':'reward','наценка':'markup','наценок':'markups','реролл':'reroll','реролла':'reroll','производитель':'manufacturer','серия':'series','типа':'type','тип':'type','раздел':'section','раздела':'section','разделы':'sections','вход':'visit','первый':'first','первого':'first','следующую':'next','следующий':'next','следующее':'next','случайно':'randomly','случайных':'random','лишнее':'extra','избытке':'surplus','дефицитной':'scarce','дефицитными':'scarce','подорожала':'became more expensive','дешевеют':'become cheaper','чаще':'more often','потерянным':'lost','пустого':'empty','невалидного':'invalid','страховка':'fallback','переплат':'overpaying','переплата':'overpayment','лучше':'better','почему':'why','объяснить':'explain','объясняет':'explains','причина':'reason','причины':'reasons','примерно':'approximately','похожих':'similar','названный':'named','правильной':'correct','правильному':'correct','растущую':'growing','мигающую':'flashing','случайно':'randomly','сгенерированному':'generated','движущимся':'moving','падающие':'falling','неоновая':'neon','трасса':'track','астероидов':'asteroids','врагов':'enemies','ворот':'gates','линий':'lines','фигур':'shapes','ритм':'rhythm','реакция':'reaction','цветомания':'color mania','лабиринт':'maze','уклонение':'dodge','змейка':'snake','печатная':'typing','машинка':'typewriter','порядок':'order','матеша':'math','память':'memory','разгон':'overclock','испытание':'test','испытания':'tests','охлаждать':'cool','зажми':'hold','удерживай':'hold','нажми':'click','кликай':'click','жми':'press','повтори':'repeat','собирай':'collect','собери':'build','найди':'find','выбери':'choose','напечатай':'type','решай':'solve','решено':'solved','ошибок':'errors','готово':'done','осталось':'remaining','уничтожь':'destroy','уничтожены':'destroyed','лети':'fly','доберись':'reach','переживи':'survive','двигайся':'move','врежься':'crash','под':'under','среди':'among','последовательность':'sequence','сигнал':'signal','слишком':'too','рано':'early','поздно':'late','медленно':'slowly','быстро':'quickly','средняя':'average','ориентир':'reference','ввод':'input','переносы':'line breaks','символы':'characters','поля':'fields','заполни':'fill','увеличь':'increase','возвращающих':'returning','возвращает':'returns','произведение':'product','сумма':'sum','квадрат':'square','заголовок':'heading','страницы':'page','приветствие':'greeting','параметра':'parameter','тернарный':'ternary','делимость':'divisibility','остаток':'remainder','счётчик':'counter','величина':'value','выполнены':'completed','другого':'another','задачу':'task','успех':'success','другая':'another','которую':'which','изучить':'study','удалено':'removed','выбранный':'selected','выбран':'selected','практика':'practice','новичка':'beginner','заработка':'earnings','перезагрузки':'reload','перезагрузкой':'reload','сворачивается':'collapses','сохрани':'save','отказаться':'decline','галочка':'checkbox','включить':'enable','выключено':'disabled','включено':'enabled','включения':'enabling','скроллбар':'scrollbar','настройки':'settings','полноэкранный':'fullscreen','называется':'is called','находится':'is located','предупреждение':'warning','размер':'size','физически':'physically','технически':'technically','связка':'pairing','раскрыть':'unlock','потенциал':'potential','который':'which','которых':'which','которые':'that','когда':'when','чем':'the more','чтобы':'so that','может':'can','могут':'can','даёт':'gives','дает':'gives','нужны':'needed','нужен':'needed','нужна':'needed','есть':'there is','нет':'no','быть':'be','стал':'became','стала':'became','стали':'became','является':'is','использует':'uses','используют':'use','подходит':'fits','показывает':'shows','показывать':'show','появится':'will appear','появляется':'appears','остается':'stays','остаётся':'stays','сохранить':'save','продолжить':'continue','вернуться':'return','выход':'exit','дополнительный':'additional','добавляет':'adds','получать':'receive','получаешь':'receive','получен':'received','получено':'received','рассчитывается':'is calculated','расчётный':'estimated','выведен':'shown','отдельное':'separate','отдельным':'separate','касается':'concerns','важные':'important','характеристики':'characteristics','назначение':'purpose','главный':'main','временно':'temporarily','быстрого':'quick','постоянно':'always','здесь':'here','там':'there','рядом':'nearby','вместе':'together','сначала':'first','сразу':'immediately','затем':'then','далее':'next','назад':'back','выше':'above','ниже':'below','безопасный':'safe','жёстким':'harsh','ограничениям':'restrictions','ограничения':'restrictions','поломками':'failures','сборке':'build','напрямую':'directly','необходимую':'necessary','вещь':'thing','участия':'participation','розыгрыше':'giveaway','бесплатный':'free','секретный':'secret','буст':'boost','объявления':'ads','мощнее':'more powerful','меньше':'less','больше':'more','выше':'higher','ниже':'lower','каждую':'every','каждый':'each','одну':'one','другой':'another','две':'two','три':'three','четыре':'four','пять':'five','шесть':'six','семь':'seven','восемь':'eight','девять':'nine','десять':'ten'
};

const I18N_FINAL_EXACT = {
  'Уровень ${game.tier}':'Level ${game.tier}',
  'Перенеси файл':'Move the file',
  'Отпусти палец над папкой AI_DATA.':'Release your finger over the AI_DATA folder.',
  'Привет':'Hello',
  'Перенеси':'Move',
  'Добавляет процент к сумме выплаты. Встроенную графику включить нельзя.':'Adds a percentage to total payouts. Integrated graphics cannot be enabled.',
  '+56% к выплате':'+56% to payouts',
  'Требовательность':'Demand',
  'Соединяет компоненты компьютера и определяет, какие процессоры, память и устройства можно установить.':'Connects computer components and determines which processors, memory, and devices can be installed.',
  'У каждого режима свой стартовый ПК, бюджет, экономика и ограничения.':'Each mode has its own starter PC, budget, economy, and restrictions.',
  'Самый жёсткий режим. Перед запуском появляется отдельное предупреждение.':'The harshest mode. A separate warning appears before starting.',
  'ОС теперь является полноценным компонентом: её можно покупать в каталоге, устанавливать, продавать и учитывать в общей мощности ПК. Стартовые ОС: Windows 10 Home, Windows 8.1 Home и Windows 7 Lite для разных режимов.':'The OS is now a full component: it can be bought from the catalog, installed, sold, and counted in total PC power. Starter OS options are Windows 10 Home, Windows 8.1 Home, and Windows 7 Lite for different modes.',
  'Рядом со сбросом есть сохранения с тремя ручными ячейками. Если ячейка занята, сайт предложит перезаписать её.':'Next to Reset there are saves with three manual slots. If a slot is occupied, the site will offer to overwrite it.',
  'После перезагрузки мы вернулись прямо в твоё учебное прохождение. Можешь продолжать собирать ПК с того места, где остановился.':'After reloading, we return directly to your tutorial playthrough. You can continue building the PC from where you stopped.',
  'Компьютер — это не одна деталь, а система из нескольких частей. CPU выполняет расчёты, RAM временно держит данные для работающих программ, GPU занимается графикой, накопитель хранит файлы, PSU подаёт питание, материнская плата соединяет компоненты, охлаждение отводит тепло, а корпус размещает всё внутри. Главная задача сборки — не просто купить мощные детали, а подобрать такие, которые физически и технически подходят друг другу. Через несколько секунд я автоматически открою безопасный Лайт-режим и начну учить тебя на практике.':'A computer is not a single component but a system made of several parts. The CPU performs calculations, RAM temporarily stores data for running programs, the GPU handles graphics, the storage drive keeps files, the PSU supplies power, the motherboard connects components, cooling dissipates heat, and the case holds everything inside. The main goal of a build is not simply to buy powerful parts, but to choose parts that physically and technically work together. In a few seconds, I will automatically open the safe Light mode and start teaching you through practice.',
  'Кликер — единственный источник денег здесь. Сейчас один клик даёт $${formatMoney(reward)}, потому что множитель ПК составляет ×${pcMultiplier().toFixed(2)}. После улучшения ПК сумма за клик тоже вырастет.':'The clicker is the only source of money here. One click currently gives $${formatMoney(reward)} because the PC multiplier is ×${pcMultiplier().toFixed(2)}. After upgrading the PC, the amount per click will also increase.',
  '✅ Хорошо':'✅ Good',
  'GPU — видеокарта. Она отвечает за большую часть графической работы и особенно важна для игр; отдельная видеокарта обычно даёт намного больше графической производительности, чем встроенная.':'GPU — the graphics card. It handles most graphics work and is especially important for games; a dedicated graphics card usually provides much more graphics performance than integrated graphics.',
  'RAM — оперативная память. Она временно хранит данные, которыми программа пользуется прямо сейчас. Её объём определяет, сколько данных система может держать в работе одновременно, а поколение DDR должно совпадать с поддержкой материнской платы.':'RAM is system memory. It temporarily stores data that programs are using right now. Its capacity determines how much data the system can keep active at once, and the DDR generation must match the motherboard\'s supported memory type.',
  ' Блок питания должен иметь достаточную мощность для видеокарты и остальной системы; число ватт в названии БП — доступный запас питания.':' The power supply must have enough wattage for the graphics card and the rest of the system; the watt number in the PSU name is its available power headroom.',
  'Определение компонента…':'Identifying component…',
  '<span class="num">${index+1}</span><span class="name">Определение…</span>':'<span class="num">${index+1}</span><span class="name">Identifying…</span>',
  'Есть проблема совместимости или слишком сильный перекос между CPU и GPU. Даже если сокеты совпадают, очень слабая часть системы может ограничивать другую.':'There is a compatibility problem or a major CPU/GPU imbalance. Even when the sockets match, a very weak part of the system can limit the other one.',
  'Компоненты находятся примерно в одном классе мощности и не оставляют очевидного слабого места.':'The components are roughly in the same performance class and leave no obvious weak point.',
  'Некоторые детали заметно выбиваются из общего уровня. Например, флагманский компонент рядом с бюджетной частью системы создаёт дисбаланс.':'Some components stand out noticeably from the overall level. For example, a flagship component next to a budget part creates an imbalance.',
  'Разумная трата бюджета':'Reasonable budget spending',
  'По базовым ценам на комплектующие потрачено около $${formatMoney(totalCost)}. Производительность относительно цены выглядит оправданной.':'At base component prices, about $${formatMoney(totalCost)} was spent. The performance looks justified for the price.',
  'По базовым ценам сборка стоит около $${formatMoney(totalCost)}. В ней есть дорогие компоненты, для которых существовали заметно более дешёвые варианты близкого уровня.':'At base component prices, the build costs about $${formatMoney(totalCost)}. It contains expensive components for which noticeably cheaper alternatives of a similar level existed.',
  'Мощность около ${Math.round(currentPowerSnapshot)} — систему можно было сделать производительнее без обязательного перехода на самые дорогие детали.':'Power is about ${Math.round(currentPowerSnapshot)} — the system could have been made faster without moving to the most expensive parts.',
  'Материнская плата и платформа оставляют запас для увеличения памяти и будущего обновления компонентов.':'The motherboard and platform leave room for more memory and future component upgrades.',
  'Платформа заметно ограничивает будущие обновления: мало слотов, старый уровень платы или небольшой запас расширения.':'The platform noticeably limits future upgrades: it has few slots, an older board level, or little room for expansion.',
  '<div class="exam-screen-stage"><div class="exam-stage-note">Теперь оцениваю сборку критерий за критерием…</div><div id="examResults" class="exam-results"></div><div id="examFinal" class="exam-final-score hidden"></div></div>':'<div class="exam-screen-stage"><div class="exam-stage-note">Now I am evaluating the build criterion by criterion…</div><div id="examResults" class="exam-results"></div><div id="examFinal" class="exam-final-score hidden"></div></div>',
  '⚖️ Перекос между CPU и GPU':'⚖️ CPU/GPU Imbalance',
  '💰 Переплата за Видеокарты':'💰 Overpaying for Graphics Cards',
  '💰 Переплата за Процессоры':'💰 Overpaying for Processors',
  '💰 Переплата за Оперативная память':'💰 Overpaying for Memory',
  '💰 Переплата за Накопители':'💰 Overpaying for Storage',
  '💰 Переплата за Блоки питания':'💰 Overpaying for Power Supplies',
  '💰 Переплата за Корпуса':'💰 Overpaying for Cases',
  '💰 Переплата за Материнские платы':'💰 Overpaying for Motherboards',
  '💰 Переплата за Охлаждение':'💰 Overpaying for Cooling',
  '💰 Переплата за Операционная система':'💰 Overpaying for Operating System',
  '💻 Код успешно выполнен!': '💻 Code completed successfully!',
  '❌ Код не совпадает с ориентиром точь-в-точь. Проверь пробелы, переносы строк и символы.': '❌ The code does not match the reference exactly. Check spaces, line breaks, and characters.',
  '${stronger.name} — ${strongerTier} компонент, и к нему претензий нет. Но ${weaker.name} — ${weakerTier} уровень. В такой связке более сильная деталь не сможет полностью раскрыть свой потенциал, потому что более слабая часть будет ограничивать систему. Для экзамена лучше подбирать CPU и GPU примерно одного класса.':'${stronger.name} — a ${strongerTier} component with no issues. But ${weaker.name} is ${weakerTier}. In this combination, the stronger part cannot fully reach its potential because the weaker part limits the system. For the exam, it is better to choose a CPU and GPU from roughly the same class.',
  '${psu.name} относится к стандартной серии без сертификата 80+. Для сборки такого уровня это заметное слабое место: мощность блока сама по себе ещё не делает его хорошим выбором. В более серьёзной конфигурации стоит смотреть хотя бы на 80+ Bronze, а для действительно мощной системы — на более высокий класс.':'${psu.name} belongs to the standard series without an 80+ certificate. For a build at this level, that is a noticeable weak point: PSU wattage alone does not make it a good choice. For a more serious configuration, consider at least 80+ Bronze, and for a truly powerful system, a higher class.',
  '${psu.name} — 80+ Bronze. Сам по себе Bronze не означает несовместимость, но для системы с компонентами топ-класса это выглядит как экономия не в том месте и снижает оценку за баланс и качество комплектации. Для такой сборки логичнее смотреть в сторону более высокого класса БП.':'${psu.name} — 80+ Bronze. Bronze itself does not mean incompatibility, but for a system with top-tier components it looks like savings in the wrong place and lowers the balance and component-quality score. For this kind of build, a higher PSU class makes more sense.',
  '🧠 Мало оперативной памяти':'🧠 Not Enough RAM',
  'Установлено ${gb} ГБ (${ram.name}). Для сборки с мощностью ${Math.round(currentPower())} это уже ограниченный запас. Увеличение объёма RAM даст системе больше пространства для программ и будущих задач.':'${gb} GB (${ram.name}) is installed. For a build with ${Math.round(currentPower())} power, that is already limited headroom. Increasing RAM capacity will give the system more room for programs and future tasks.',
  '${storage.name} — медленный/небольшой накопитель относительно остальной системы. Когда CPU и GPU заметно мощнее, такой накопитель становится дисбалансом: часть бюджета вложена в производительность, а хранение и загрузка остаются на начальном уровне.':'${storage.name} is a slow/small storage drive compared with the rest of the system. When the CPU and GPU are much more powerful, this drive becomes an imbalance: part of the budget went into performance while storage and loading remain at an entry-level standard.',
  '🧩 Ограниченный запас материнской платы':'🧩 Limited motherboard headroom',
  '${mb.name} оставляет небольшой простор для будущего апгрейда: ${spec.ramSlots} слота RAM и максимум ${spec.maxRamGb} ГБ. Для долгосрочной сборки лучше выбирать плату с большим запасом памяти и расширения.':'${mb.name} leaves limited room for future upgrades: ${spec.ramSlots} RAM slots and a maximum of ${spec.maxRamGb} GB. For a long-term build, choose a board with more memory and expansion headroom.',
  '🧩 Платформа уже ограничивает будущие апгрейды':'🧩 The platform already limits future upgrades',
  '${mb.name} использует уровень PCIe ${pcie}. Для мощной современной сборки это уменьшает запас на будущее по сравнению с более новой платформой.':'${mb.name} uses PCIe ${pcie}. For a powerful modern build, this reduces future headroom compared with a newer platform.',
  '${ram.name} — ${gb} ГБ. Для заметно мощного CPU/GPU это уже небольшой запас. Такой объём не делает ПК технически несовместимым, но ограничивает комфорт при тяжёлых задачах и будущих апгрейдах.':'${ram.name} — ${gb} GB. For a noticeably powerful CPU/GPU, this is already limited headroom. This capacity does not make the PC technically incompatible, but it limits comfort in demanding tasks and future upgrades.',
  '💾 HDD заметно отстаёт от остальной системы':'💾 The HDD noticeably lags behind the rest of the system',
  '${storage.name} — HDD, тогда как CPU и GPU уже находятся на существенно более высоком уровне. Накопитель не обязан быть самым дорогим компонентом, но быстрый SSD лучше соответствует такой сборке по отзывчивости и загрузкам.':'${storage.name} is an HDD while the CPU and GPU are already at a much higher level. The drive does not need to be the most expensive component, but a fast SSD is a better match for this build in responsiveness and loading times.',
  '❄️ Слабый класс охлаждения':'❄️ Weak cooling class',
  '${cooling.name} формально может подходить по тепловому лимиту, но для ${cpu.name} это уже слишком простой уровень охлаждения. Для мощного CPU разумнее брать башенный кулер высокого уровня или СЖО.':'${cooling.name} may technically fit the thermal limit, but for ${cpu.name} it is already too basic a cooling solution. For a powerful CPU, a high-end tower cooler or AIO makes more sense.',
  '❄️ Охлаждение почти без запаса':'❄️ Cooling with almost no headroom',
  '${caseItem.name} относится к базовой серии. При мощном CPU/GPU это компромисс по размещению и вентиляции. Корпус сам по себе не увеличивает FPS, но хороший airflow помогает нормально использовать мощные компоненты.':'${caseItem.name} belongs to the basic series. With a powerful CPU/GPU, that is a compromise in space and airflow. A case does not increase FPS by itself, but good airflow helps powerful components perform properly.',
  '${chosen.name} стоит около $${formatMoney(price)}. В каталоге есть ${alt.name} примерно за $${formatMoney(Number(alt.basePrice||0))} при близкой производительности. Экономия около $${formatMoney(saving)} могла быть направлена в другую слабую часть сборки.':'${chosen.name} costs about $${formatMoney(price)}. The catalog has ${alt.name} for about $${formatMoney(Number(alt.basePrice||0))} with similar performance. The $${formatMoney(saving)} saved could have been spent on another weak part of the build.',
  '✅ Критических ошибок не найдено':'✅ No critical errors found',
  'Сборка получила меньше 90 баллов не из-за одной большой ошибки, а из-за совокупности небольших потерь. Посмотри на каждый из пяти критериев выше и попробуй довести их ближе к максимуму.':'The build scored below 90 not because of one major mistake, but because of a combination of smaller losses. Look at each of the five criteria above and try to bring them closer to the maximum.',
  // Dynamic exam analysis HTML is localized through DOM text nodes / phrase dictionaries.
  'Результат — ${total}/100. После сохранения или выхода из экзамена можно вернуться к сборке и улучшить найденные слабые места.':'Result — ${total}/100. After saving or leaving the exam, you can return to the build and improve the weak points that were found.',
  'Экзамен завершён: ${Number(examState?.total)||0}/100. Игра сейчас закрыта. Хочешь сохранить это прохождение?':'Exam finished: ${Number(examState?.total)||0}/100. The game is now closed. Would you like to save this playthrough?',
  '<div class="exam-analysis-offer"><h3>Экзамен завершён: ${examState.total}/100</h3><p>Результат ниже 90. Хочешь подробно разобрать свои ошибки? Я покажу конкретные детали и объясню, где сборка теряет баллы и почему.</p></div>':'<div class="exam-analysis-offer"><h3>Exam finished: ${examState.total}/100</h3><p>The result is below 90. Would you like a detailed review of your mistakes? I will show the exact components and explain where and why the build loses points.</p></div>',
  'Ошибка: укажи число, например pcMoney(1000000)':'Error: enter a number, for example pcMoney(1000000)',
  'Ошибка: сначала начни или загрузи игру.':'Error: start or load a game first.',
  'Требовательность ${game.demand}/100':'Demand ${game.demand}/100',
  'Выполни от 3 до 5 случайных задач. Ограничения по времени на весь режим нет.':'Complete 3 to 5 random tasks. There is no overall time limit for the mode.',
  'Отпусти палец над папкой AI_DATA.':'Release the pointer over the AI_DATA folder.',
  'Ориентир показан на активной строке. Пиши строго по нему.':'A reference is shown on the active line. Type exactly according to it.',
  'Нажми на поле ввода…':'Click the input field…'
};
const I18N_COMMON_WORDS = {
  'и':'and','в':'in','не':'not','а':'but','на':'on','с':'with','для':'for','я':'I','из':'from','за':'for','или':'or','от':'from','по':'by','к':'to','до':'until','при':'when','после':'after','перед':'before','у':'at','о':'about','об':'about','во':'in','со':'with','же':'also','ли':'whether','бы':'would','да':'yes','нет':'no','но':'but','или':'or','если':'if','что':'that','чтобы':'so that','как':'how','когда':'when','где':'where','почему':'why','который':'that','которая':'that','которые':'that','которого':'which','этот':'this','эта':'this','эти':'these','это':'this','этом':'this','этой':'this','эту':'this','того':'that','тому':'that','такой':'such','такая':'such','такое':'such','также':'also','ещё':'also','уже':'already','только':'only','можно':'can','нельзя':'cannot','нужно':'need','нужен':'needed','нужна':'needed','нужны':'needed','есть':'is','быть':'be','будет':'will','будут':'will','был':'was','была':'was','были':'were','было':'was','может':'may','могут':'can','можешь':'can','хочешь':'want','хочу':'want','хотите':'want','твой':'your','твоя':'your','твои':'your','твою':'your','твоём':'your','тебе':'you','тебя':'you','тебя':'you','ты':'you','мы':'we','вы':'you','они':'they','он':'it','она':'it','оно':'it','его':'its','её':'its','их':'their','свой':'your','своего':'your','своя':'your','свою':'your','свои':'your','сам':'self','сама':'self','саму':'self','самостоятельно':'independently','все':'all','всё':'everything','всегда':'always','сразу':'immediately','затем':'then','далее':'next','сначала':'first','сейчас':'now','теперь':'now','потом':'then','пока':'for now','здесь':'here','там':'there','рядом':'nearby','внутри':'inside','снаружи':'outside','вместе':'together','отдельно':'separately','отдельная':'separate','отдельный':'separate','отдельное':'separate','отдельные':'separate','обычно':'usually','обычный':'normal','обычная':'normal','обычное':'normal','обычные':'normal','новый':'new','новая':'new','новое':'new','новые':'new','старый':'old','старая':'old','старое':'old','старые':'old','простой':'simple','простая':'simple','простое':'simple','простые':'simple','сложный':'hard','сложная':'hard','сложное':'hard','сложные':'hard','слабый':'weak','слабая':'weak','слабое':'weak','слабые':'weak','сильный':'strong','сильная':'strong','сильное':'strong','сильные':'strong','мощный':'powerful','мощная':'powerful','мощное':'powerful','мощные':'powerful','высокий':'high','высокая':'high','высокое':'high','высокие':'high','средний':'mid-range','средняя':'mid-range','среднее':'mid-range','средние':'mid-range','начальный':'entry-level','начальная':'entry-level','начальное':'entry-level','начальные':'entry-level','бюджетный':'budget','бюджетная':'budget','бюджетное':'budget','бюджетные':'budget','топовый':'top-tier','топовая':'top-tier','топовое':'top-tier','топовые':'top-tier','разумный':'reasonable','разумная':'reasonable','разумное':'reasonable','разумные':'reasonable','пример':'example','например':'for example','около':'about','примерно':'approximately','более':'more','менее':'less','слишком':'too','достаточно':'enough','почти':'almost','примерно':'approximately','именно':'exactly','действительно':'really','особенно':'especially','полностью':'fully','постоянно':'constantly','временно':'temporarily','автоматически':'automatically','вручную':'manually','постепенно':'gradually','физически':'physically','необходим':'required','необходима':'required','необходимы':'required','доступен':'available','доступна':'available','доступно':'available','доступны':'available','запрещен':'forbidden','запрещена':'forbidden','запрещено':'forbidden','работает':'works','работают':'work','работать':'work','получать':'receive','получает':'receives','получаешь':'receive','получили':'received','получил':'received','получено':'received','получен':'received','показывает':'shows','показывать':'show','появляется':'appears','появиться':'appear','открывает':'opens','открывается':'opens','открыть':'open','закрывает':'closes','закрывается':'closes','закрыть':'close','выбирает':'chooses','выбирается':'is selected','выбери':'choose','выбрать':'choose','выбран':'selected','выбрана':'selected','выбрано':'selected','выбранный':'selected','выбранная':'selected','нажми':'click','нажать':'click','нажмите':'click','кликни':'click','кликнуть':'click','жми':'click','жмёшь':'click','сохранить':'save','сохрани':'save','сохранено':'saved','сохранена':'saved','загрузить':'load','загружен':'loaded','загружено':'loaded','сбросить':'reset','сброшено':'reset','установить':'install','установлен':'installed','установлена':'installed','установлено':'installed','купить':'buy','куплено':'purchased','покупка':'purchase','покупки':'purchases','продать':'sell','продажа':'sale','продажи':'sales','продано':'sold','починить':'repair','починка':'repair','ремонт':'repair','сломана':'broken','сломано':'broken','сломаны':'broken','повреждена':'damaged','повреждены':'damaged','повреждено':'damaged','требует':'requires','требуют':'require','требуется':'required','подходит':'fits','подходящий':'suitable','подходящая':'suitable','подходящее':'suitable','несовместима':'incompatible','несовместим':'incompatible','несовместимо':'incompatible','совместима':'compatible','совместим':'compatible','совместимо':'compatible','зависит':'depends','влияет':'affects','даёт':'gives','дают':'give','может':'can','можно':'can','сможет':'can','сможешь':'can','потребует':'will require','потреблять':'consume','потребляет':'consumes','помогает':'helps','объясняет':'explains','объяснять':'explain','объясни':'explain','помни':'remember','запомни':'remember','собери':'build','собирай':'build','собирать':'build','собрал':'built','сделай':'make','сделать':'make','получить':'get','получение':'getting','добавить':'add','добавлено':'added','добавлены':'added','добавлена':'added','увеличен':'increased','увеличены':'increased','снижен':'reduced','снижена':'reduced','выше':'above','ниже':'below','между':'between','через':'after','вовремя':'on time','раньше':'earlier','позже':'later','первый':'first','первая':'first','первое':'first','первые':'first','второй':'second','вторая':'second','второе':'second','вторые':'second','третий':'third','третья':'third','третье':'third','третьи':'third','один':'one','одна':'one','одно':'one','два':'two','две':'two','три':'three','четыре':'four','пять':'five','шесть':'six','семь':'seven','восемь':'eight','девять':'nine','десять':'ten','одну':'one','одного':'one','две':'two','двух':'two','трёх':'three','три':'three','четырёх':'four','пяти':'five','шести':'six','семи':'seven','восьми':'eight','девяти':'nine','десяти':'ten',
  'Лёгкий':'Easy','лёгкий':'easy','Лёгком':'Easy','Лёгкого':'Easy','Лёгкий':'Easy','Лайт':'Light','Лайте':'Light','Хардкор':'Hardcore','Хардкоре':'Hardcore','Сложный':'Hard','сложного':'hard','сложном':'hard','Чёрный':'Black','чёрный':'black','чёрного':'black','чёрном':'black','Чёрного':'Black','Каталог':'Catalog','каталог':'catalog','Загрузить':'Load','Выбери':'Choose','Начать':'Start','Назад':'Back','Далее':'Next','Закрыть':'Close','Понятно':'Got it','Нажми':'Click','Жми':'Click','Проверка':'Check','Награда':'Reward','Баланс':'Balance','Версия':'Version','Настройки':'Settings','Достижения':'Achievements','Обучение':'Tutorial','Экзамен':'Exam','Разбор':'Review','Результат':'Result','Покупка':'Purchase','Сертификат':'Certificate','Компенсация':'Compensation','Предупреждение':'Warning','Ошибка':'Error','Ошибки':'Errors','Система':'System','Операционная':'Operating','Оперативная':'RAM','Материнская':'Motherboard','Материнские':'Motherboard','Процессор':'Processor','Процессоры':'Processors','Видеокарта':'Graphics card','Видеокарты':'Graphics cards','Накопитель':'Storage drive','Накопители':'Storage drives','Блок':'Block','Блоки':'Blocks','питания':'power','Корпус':'Case','Корпуса':'Cases','Кулер':'Cooler','Охлаждение':'Cooling','Память':'Memory','Памяти':'Memory','Мощность':'Power','Производительность':'Performance','Бюджет':'Budget','Цена':'Price','Цены':'Prices','Деньги':'Money','Денег':'Money','Деталь':'Component','Детали':'Components','Деталей':'Components','Компонент':'Component','Компоненты':'Components','Компонентов':'Components','Сохранить':'Save','Сохранения':'Saves','Сбросить':'Reset','Установить':'Install','Купить':'Buy','Продать':'Sell','Куплено':'Purchased','Получено':'Unlocked','Заблокировано':'Locked','Открыть':'Open','Игра':'Game','Игры':'Games','Игрок':'Player','Кнопка':'Button','Кнопки':'Buttons','Окно':'Window','Окна':'Windows','Строка':'Line','Строки':'Lines','Поле':'Field','Файл':'File','Задача':'Task','Задачи':'Tasks','Ответ':'Answer','Цвет':'Color','Цвета':'Colors','Время':'Time','Секунда':'Second','Секунды':'Seconds','Секунд':'Seconds','Клик':'Click','Кликов':'Clicks','Уровень':'Level','Уровня':'Level','Класс':'Class','Класса':'Class','Слот':'Slot','Слота':'Slot','Слотов':'Slots','Качество':'Quality','Стандарт':'Standard','Бронза':'Bronze','Серебро':'Silver','Золото':'Gold','Ватт':'Watts','Ватта':'Watts','Рынок':'Market','Рынка':'Market','Событие':'Event','События':'Events','Анимации':'Animations','Язык':'Language','Русский':'Russian','Английский':'English','Программирование':'Programming','Исходник':'Source','Команда':'Command','Проверить':'Check','Объяснить':'Explain','Причина':'Reason','Причины':'Reasons','Почему':'Why','Где':'Where','Когда':'When','Количество':'Amount','Объём':'Capacity','Запас':'Headroom','Апгрейд':'Upgrade','Апгрейды':'Upgrades','Будущее':'Future','Будущего':'Future','Возможность':'Ability','Возможности':'Capabilities','Условие':'Condition','Условия':'Conditions','Шанс':'Chance','Доступ':'Access','Инвентарь':'Inventory','Категория':'Category','Категории':'Categories','Серии':'Series','Производитель':'Manufacturer','Серия':'Series','Тип':'Type','Скорость':'Speed','Тормоза':'Lag','Комфортно':'Comfortable','Играбельно':'Playable','Разгон':'Overclock','Разгоне':'Overclocking','Остановлен':'Stopped','Остановлено':'Stopped','Работает':'Running','Охлаждение':'Cooling','Перегрев':'Overheat','Выход':'Exit','Раунд':'Round','Очки':'Score','Уклонение':'Dodge','Змейка':'Snake','Лабиринт':'Maze','Тетрис':'Tetris','Ритм':'Rhythm','Порядок':'Order','Реакция':'Reaction','Цветомания':'Color Mania','Печатная':'Typing','машинка':'machine','Матеша':'Math','Котокбасик':'Kotokbasik','Саймон':'Simon','Неоновая':'Neon','трасса':'Track','Память':'Memory','Пропустить':'Skip','Лишнее':'Excess','производство':'production','Раздача':'Giveaway','купонов':'coupons','Взрыв':'Explosion','завода':'factory','Полиция':'Police','Штраф':'Fine','Оплатить':'Pay','Продать':'Sell','Рекомендовано':'Recommended','Подходит':'Compatible','Несовместимо':'Incompatible','Совместимость':'Compatibility','УСТАНОВЛЕНО':'INSTALLED','ПОВРЕЖДЕНО':'DAMAGED','База':'Base','Сброс':'Reset','Ссылка':'Link','Успешно':'Successfully','Провал':'Failure','Провален':'Failed','Пройден':'Passed','Завершён':'Finished','Завершено':'Completed','Загрузка':'Loading','Установка':'Installation','Установлено':'Installed','Запуск':'Start','Начало':'Start','Путь':'Path','Шаг':'Step','Шаги':'Steps','Данные':'Data','Список':'List','Часть':'Part','Части':'Parts','Параметр':'Parameter','Параметры':'Parameters','Значение':'Value','Значения':'Values','Максимум':'Maximum','Минимум':'Minimum','Новый':'New','Новая':'New','Новое':'New','Новые':'New','Старый':'Old','Старая':'Old','Старое':'Old','Старые':'Old','Быстрый':'Fast','Быстрая':'Fast','Медленный':'Slow','Медленная':'Slow','Точный':'Accurate','Точная':'Accurate','Личный':'Personal','Личная':'Personal','Личное':'Personal','Готов':'Ready','Готова':'Ready','Готово':'Ready','Ошибка':'Error','Ошибок':'Errors','Больше':'More','Меньше':'Less','Ещё':'More','Очень':'Very','Нормальный':'Normal','Популярный':'Popular','Универсальный':'Universal','Стабильный':'Stable','Современный':'Modern','Минималистичный':'Minimalist','Классическая':'Classic','Тяжелее':'Heavier','Урезанная':'Stripped','Профессиональная':'Professional','Домашняя':'Home','Офисный':'Office','Стеклянный':'Glass','Базовый':'Basic','Стоковый':'Stock','Башенный':'Tower','Двухбашенный':'Dual-tower','Премиум':'Premium','Встроенная':'Integrated','Старый':'Old','Классическая':'Classic','Версия':'Version','Версии':'Versions','Вариант':'Option','Варианты':'Options','Выбор':'Selection','Выбран':'Selected','Выбрана':'Selected','Выбрано':'Selected','Рекомендуется':'Recommended','Рекомендованный':'Recommended','Рекомендованная':'Recommended','Рекомендовано':'Recommended','Доступный':'Available','Доступная':'Available','Доступное':'Available','Свободен':'Free','Свободна':'Free','Свободно':'Free','Пусто':'Empty','Занято':'Occupied','Занята':'Occupied','занят':'occupied','занята':'occupied','получен':'received','получена':'received','получено':'received','получены':'received','покажи':'show','показывай':'show','показать':'show','содержит':'contains','содержимое':'contents','текст':'text','название':'name','названия':'names','имя':'name','именем':'name','описание':'description','описания':'descriptions','подсказка':'hint','подсказки':'hints','сообщение':'message','сообщения':'messages','уведомление':'notification','уведомления':'notifications','запись':'entry','записи':'entries','журнал':'log','урон':'damage','горит':'burning','загорелась':'caught fire','пожар':'fire','тушить':'extinguish','тушения':'extinguishing','сломался':'broke','сломалась':'broke','сломалось':'broke','компенсацию':'compensation','возврат':'refund','возвращает':'returns','возвращено':'refunded','оплата':'payment','стоить':'cost','стоит':'costs','цена':'price','цену':'price','скидка':'discount','скидки':'discounts','реролл':'reroll','рероллов':'rerolls','купонов':'coupons','купона':'coupon','купоном':'coupon','сертификата':'certificate','сертификатом':'certificate','сертификаты':'certificates','сертификация':'certification','ватты':'watts','ватт':'watts','ГБ':'GB','Вт':'W'
};

const I18N_COVER_WORDS = {
  'мини':'mini','Купон':'Coupon','купон':'coupon','игр':'games','Исправлена':'Fixed','исправлена':'fixed','достижение':'achievement','достижения':'Achievements','даже':'even','поэтому':'therefore','поколения':'generations','вместо':'instead','заметно':'noticeably','меню':'menu','хватает':'enough','этого':'this','кода':'code','ввода':'input','мм':'mm','базы':'base','себе':'itself','игру':'game','заработок':'earnings','интерфейс':'interface','Напиши':'Type','напиши':'type','определяет':'determines','ФИКС':'FIX','позиций':'positions','дистрибутив':'distribution','считается':'is considered','умолчанию':'default','совместимости':'compatibility','Без':'Without','без':'without','нормально':'normally','пройти':'pass','системе':'system','плату':'board','инвентаре':'inventory','инвентарь':'inventory','должен':'must','недоступна':'unavailable','товар':'item','покупке':'purchase','выхода':'exit','Стрелки':'Arrows','стрелки':'arrows','бонус':'bonus','снова':'again','кликер':'clicker','разобрать':'review','сайта':'site','запускается':'starts','запускаются':'start','выбора':'selection','выборе':'selection','базовой':'base','делает':'makes','добавлены':'added','добавлена':'added','добавлено':'added','небольшой':'small','Штатный':'Stock','штатный':'stock','ячейку':'slot','ячейки':'slots','успешного':'successful','Чёрная':'Black','чёрная':'black','пятница':'Friday','оперативной':'RAM','блока':'block','инвентаря':'inventory','остальных':'remaining','отправлена':'sent','рынке':'market','компонентами':'components','компонентом':'component','равно':'anyway','тем':'that','пробел':'space','попаданий':'hits','пожара':'fire','Зелёный':'Green','зелёный':'green','сколько':'how many','против':'against','раз':'times','функцию':'function','сумму':'sum','ни':'neither','подходят':'fit','рабочий':'working','одной':'one','хранит':'stores','отдельной':'separate','программ':'programs','одновременно':'simultaneously','расширения':'expansion','тепло':'heat','любого':'any','Мини':'Mini','сайт':'site','остальной':'rest','экономики':'economy','Заработок':'Earnings','цен':'prices','конкретные':'specific','баллы':'points','играх':'games','активного':'active','первом':'first','награды':'rewards','игровой':'game','бюджета':'budget','твоей':'your','хардкора':'Hardcore','рабочих':'working','систем':'systems','универсального':'universal','Современная':'Modern','хороший':'good','повышенный':'increased','Хардкорный':'Hardcore','отрицательный':'negative','Стабилизируй':'Stabilize','Перезаписать':'Overwrite','Неизвестный':'Unknown','Дата':'Date','неизвестна':'unknown','которое':'which','удвоен':'doubled','резко':'sharply','категорию':'category','выпускают':'release','встречаются':'appear','подорожали':'became more expensive','устанавливается':'is installed','большой':'large','мал':'small','справляется':'handles','потребовать':'require','теплу':'heat','рассчитано':'rated','основные':'main','совместимы':'compatible','разрешён':'allowed','смогла':'could','раскрываются':'are revealed','хардкорном':'Hardcore','поставить':'install','привлекает':'attracts','обнаруженным':'detected','обнаружении':'detection','составит':'will be','частью':'part','обнаружила':'detected','оплаты':'payment','стать':'become','просит':'asks for','качества':'quality','купил':'bought','всеми':'all','Текущая':'Current','учитывает':'takes into account','рыночный':'market','процент':'percentage','подтверждении':'confirmation','учётом':'taking into account','Оба':'Both','использованы':'used','использован':'used','использовать':'use','статусом':'status','использовании':'use','обоих':'both','дополнительно':'additionally','уменьшит':'will reduce','рыночную':'market','потратить':'spend','любой':'any','доступной':'available','покажет':'will show','обычную':'normal','сгорит':'will burn','выберешь':'you choose','Использовать':'Use','Примерное':'Approximate','почини':'repair','другую':'another','отремонтирован':'repaired','Источник':'Source','вышел':'came out','вернул':'returned','Поломка':'Breakage','вышла':'came out','Степень':'Degree','поломки':'breakage','Сломанная':'Broken','блокирует':'blocks','заменить':'replace','рабочей':'working','деталью':'component','Стоимость':'Cost','ремонта':'repair','Заменить':'Replace','примеры':'examples','корни':'roots','нужный':'needed','слова':'words','короткие':'short','фразы':'phrases','последовательности':'sequences','цветных':'colored','точных':'accurate','ограниченное':'limited','попадай':'hit','еду':'food','стену':'wall','себя':'yourself','лабиринту':'maze','Отбивай':'Deflect','мяч':'ball','переиграй':'beat','компьютер':'computer','Разбивай':'Break','мячом':'with the ball','дай':'let','ему':'it','упасть':'fall','трубами':'pipes','нажимая':'pressing','Уворачивайся':'Dodge','машин':'cars','ускоряющейся':'accelerating','астероиды':'asteroids','выживай':'survive','обломков':'debris','серию':'series','линии':'line','падающих':'falling','ускорение':'acceleration','Попадай':'Hit','круги':'circles','сбивает':'knocks down','комбо':'combo','Прыгай':'Jump','длинную':'long','трассу':'track','усиления':'power-ups','переживай':'survive','волны':'waves','настоящий':'real','заблокирована':'blocked','изменения':'changes','проходит':'passes','заблокирован':'blocked','исправь':'fix','отключён':'disabled','отключено':'disabled','Множитель':'Multiplier','множитель':'multiplier','долг':'debt','сигнала':'signal','успел':'managed','среагировать':'react','ранняя':'early','Красный':'Red','красный':'red','Синий':'Blue','синий':'blue','Зелёный':'Green','Жёлтый':'Yellow','жёлтый':'yellow','сервер':'server','Перепечатывай':'Retype','Исправь':'Fix','строку':'line','Нажимай':'Press','меньшего':'smaller','большему':'larger','очищено':'cleared','цветов':'colors','ход':'move','Запоминай':'Memorize','оборвалась':'was interrupted','раунде':'round','цели':'targets','Сенсорное':'Touch','управление':'controls','Выживи':'Survive','Попадание':'Hit','окончена':'finished','Выжил':'Survived','Змея':'Snake','очков':'points','Левая':'Left','левая':'left','правая':'right','Разбей':'Break','Мяч':'Ball','упущен':'missed','блоков':'blocks','взлёт':'takeoff','Пройди':'Complete','Врезался':'Crashed','воротах':'goal','Падение':'Fall','Авария':'Crash','Уничтожено':'Destroyed','Счёт':'Score','кругу':'lap','момент':'moment','пульса':'pulse','нот':'notes','стрелка':'arrow','вверх':'up','прыжок':'jump','финиша':'finish','Столкновение':'Collision','препятствием':'obstacle','Финиш':'Finish','достигнут':'reached','Волна':'Wave','уничтожена':'destroyed','Запусти':'Start','смотри':'watch','выдаёт':'gives','Тест':'Test','нагрузка':'load','частиц':'particles','Смотри':'Watch','сбилась':'got out of sync','клеток':'cells','примеров':'examples','Ответить':'Answer','Корни':'Roots','арифметика':'arithmetic','ждёт':'waits','Арифметика':'Arithmetic','посложнее':'harder','включая':'including','деление':'division','кружки':'circles','Кружки':'Circles','живут':'last','недолго':'briefly','ускоренный':'accelerated','темп':'tempo','Цель':'Goal','лимит':'limit','всем':'everyone','повреждён':'damaged','произошло':'happened','пережил':'survived','сбой':'failure','Ваша':'Your','хороша':'good','Заберите':'Claim','приз':'prize','СРОЧНО':'URGENT','абсолютно':'absolutely','Ваш':'Your','супер':'super','то':'that','даст':'will give','удалено':'removed','сохранения':'saves','заблокированы':'blocked','покупку':'purchase','товары':'items','платой':'board','продаже':'sale','куплен':'purchased','потрачен':'spent','строя':'out of order','факториалы':'factorials','дроби':'fractions','исчезнут':'will disappear','препятствия':'obstacles','трассе':'track','точно':'exactly','тест':'test','ЖДИ':'WAIT','Собрано':'Collected','найден':'found','Корабль':'Ship','уничтожен':'destroyed','целей':'targets','целям':'targets','кнопок':'buttons','реакции':'reaction','яблок':'apples','блоков':'blocks','пробела':'spacebar','мс':'ms','мигающую':'flashing','случайных':'random','окне':'window','подтверждения':'confirmation','перезагрузки':'reload','событий':'events','стартовый':'starter','общий':'overall','разных':'different','один':'one','два':'two','три':'three','четыре':'four','пять':'five','шесть':'six','семь':'seven','восемь':'eight','девять':'nine','десять':'ten'
};
const I18N_FINAL_WORDS = {
  'числа':'numbers','Скачивание':'Downloading','скачивание':'downloading','Закрой':'Close','закрой':'close','разъём':'connector','купленных':'purchased','файлы':'files','компьютера':'computer','влияют':'affect','друг':'another','другу':'another','должно':'must','Уничтожай':'Destroy','уничтожай':'destroy','закрыты':'closed','слово':'word','перетащи':'drag','Перетащи':'Drag','Остановить':'Stop','остановить':'stop','папке':'folder','папку':'folder','используй':'use','программы':'programs','Основа':'Base','основа':'base','какие':'which','доход':'income','каждые':'every','разгона':'overclocking','Заверши':'Finish','заверши':'finish','Запустить':'Start','запустить':'start','потушен':'extinguished','Замена':'Replacement','замена':'replacement','выбираешь':'you choose','разные':'different','базовые':'basic','общую':'overall','работы':'work','графики':'graphics','важна':'important','которыми':'which','пользуется':'uses','держать':'hold','соответствовать':'match','большую':'larger','подаёт':'supplies','компонентам':'components','совпадать':'match','процессором':'processor','совместимые':'compatible','радиатор':'heatsink','удобство':'convenience','заменяет':'replaces','остальные':'remaining','вообще':'at all','каждого':'each','посмотреть':'view','Максимальный':'Maximum','максимальный':'maximum','пути':'path','явно':'clearly','Чёрные':'Black','чёрные':'black','пятницы':'Fridays','подряд':'in a row','Купи':'Buy','купи':'buy','выполняет':'performs','расчёты':'calculations','соединяет':'connects','отводит':'dissipates','размещает':'places','несколько':'several','графической':'graphics','поколение':'generation','твоего':'your','отрицательным':'negative','вышли':'went out','остынет':'cools down','Подготовка':'Preparation','подготовка':'preparation','сбоя':'failure','ГЛИТЧ':'GLITCH','глитч':'glitch','диска':'disk','Ожидание':'Waiting','ожидание':'waiting','рекламные':'advertising','сломанные':'broken','Соедини':'Connect','соедини':'connect','провода':'wires','Провода':'Wires','Разъёмы':'Connectors','провод':'wire','такого':'such','кремний':'silicon','нейросеть':'neural network','алгоритм':'algorithm','кластер':'cluster','модель':'model','Введи':'Enter','введи':'enter','Телефон':'Phone','телефон':'phone','забудь':'forget','Следующая':'Next','следующая':'next','соответствующий':'corresponding','совпадает':'matches','Неверно':'Wrong','неверно':'wrong','Попробуй':'Try','попробуй':'try','Отпусти':'Release','отпусти':'release','палец':'finger','над':'over','сложи':'add','Создай':'Create','создай':'create','текстом':'text','тег':'tag','четырьмя':'four','строками':'lines','возвращающие':'returning','Умножение':'Multiplication','умножение':'multiplication','вычисли':'calculate','большее':'larger','оператор':'operator','Чётное':'Even','чётное':'even','проверяющих':'checking','остатка':'remainder','деления':'division','равен':'equals','нулю':'zero','должна':'must','Пиши':'Write','пиши':'write','небольшие':'small','готовому':'ready','шаблону':'template','завершения':'completion','работающего':'working','Ускоряет':'Speeds up','ускоряет':'speeds up','интервал':'interval','сокращается':'decreases','сумме':'sum','Встроенную':'Integrated','графику':'graphics','Работающие':'Working','работающие':'working','участвуют':'participate','замени':'replace','Рекламные':'Advertising','рекламные':'advertising','Статус':'Status','статус':'status','текущие':'current','выйти':'exit','Включи':'Enable','включи':'enable','Активные':'Active','активные':'active','игнорировать':'ignore','ломает':'breaks','соответствующую':'corresponding','идёт':'runs','каждой':'each','выплатой':'payout','необходимо':'necessary','охлаждён':'cooled','окон':'windows','загоревшаяся':'burning','фарм':'grinding','той':'that','удобно':'convenient','пробовать':'try','установки':'installation','проверю':'I will check','остальными':'remaining','Никаких':'No','никаких':'no','рыночных':'market','следующего':'next','реролле':'reroll','сработал':'worked','Перерыв':'Break','перерыв':'break','скоро':'soon','Дефицит':'Shortage','дефицит':'shortage','обновляется':'updates','минуты':'minutes','рерол':'reroll','Купленные':'Purchased','купленные':'purchased','указан':'specified','производителем':'manufacturer','производителя':'manufacturer','разделе':'section','ничего':'nothing','вычислительный':'computing','Выполняет':'Performs','считает':'calculates','Ядра':'Cores','ядра':'cores','потоки':'threads','обрабатывать':'process','параллельно':'in parallel','Частота':'Frequency','частота':'frequency','ядер':'cores','важны':'important','Отвечает':'Handles','отвечает':'handles','обработку':'processing','вычислительные':'computational','связанные':'related','изображением':'image','Видеопамять':'VRAM','графических':'graphics','задачах':'tasks','процессоре':'processor','временная':'temporary','исчезает':'disappears','Больший':'Larger','больший':'larger','означает':'means','нехватка':'shortage','мешает':'interferes','систему':'system','магнитные':'magnetic','пластины':'platters','Преобразует':'Converts','преобразует':'converts','электричество':'electricity','сети':'network','указывается':'is specified','хватить':'be enough','важно':'important','эффективности':'efficiency','полной':'full','оценкой':'score','Соединяет':'Connects','соединяет':'connects','горячих':'hot','прежде':'before','всего':'everything','Башенные':'Tower','кулеры':'coolers','вентилятор':'fan','жидкость':'liquid','помпу':'pump','отвода':'dissipation','тепла':'heat','Физический':'Physical','физический':'physical','котором':'which','размещаются':'are placed','пригодность':'suitability','комплектующими':'components','выводить':'output','горячий':'hot','воздух':'air','Главное':'Main thing','главное':'main','системное':'system','программное':'software','обеспечение':'software','имеют':'have','имеет':'has','разную':'different','покупается':'is purchased','выбранного':'selected','Создаёт':'Creates','создаёт':'creates','загружаются':'are loaded','ручных':'manual','ячеек':'slots','Самый':'The most','самый':'the most','жёсткий':'harsh','Активный':'Active','активный':'active','проходишь':'you complete','награду':'reward','дать':'give','зарабатывает':'earns','подходящие':'suitable','доходу':'income','повышает':'increases','риск':'risk','перегрева':'overheating','покупаются':'are purchased','зависимости':'dependence','отображается':'is displayed','разному':'differently','скрытые':'hidden','группы':'groups','помогают':'help','правильно':'correctly','расставлять':'set','приоритеты':'priorities','текущей':'current','рыночной':'market','полного':'full','выпасть':'drop','применяется':'is applied','изменённой':'modified','рынком':'market','хранится':'is stored','доступность':'availability','меняются':'change','товаров':'items','купленную':'purchased','полноценным':'full','покупать':'buy','устанавливать':'install','продавать':'sell','учитывать':'consider','подсвечивает':'highlights','оранжевый':'orange','сбросом':'reset','тремя':'three','ручными':'manual','ячейками':'slots','предложит':'will offer','предлагает':'offers','отслеживается':'is tracked','прогресс':'progress','достижений':'achievements','Некоторые':'Some','некоторые':'some','конкретную':'specific','полную':'full','коллекцию':'collection','Энциклопедия':'Encyclopedia','Накопи':'Collect','накопи':'collect','близки':'close','максимуму':'maximum','своей':'your','Выбей':'Get','выбей':'get','майнинг':'mining','ферму':'farm','ультимативную':'ultimate','Скупи':'Buy up','скупи':'buy up','предметы':'items','экземпляру':'copy','предмета':'item','любую':'any','используя':'using','выполнено':'completed','предметов':'items','пар':'pairs','особое':'special','требований':'requirements','ПОЛНАЯ':'FULL','ЛОКАЛИЗАЦИЯ':'LOCALIZATION','ЗАХОД':'VISIT','Продолжаем':'Continue','продолжаем':'continue','вернулись':'returned','твоё':'your','учебное':'training','продолжать':'continue','остановился':'stopped','Привет':'Hello','симулятор':'simulator','собираешь':'you build','отдельных':'separate','проверяешь':'you check','наблюдаешь':'you observe','покупаешь':'you buy','устанавливаешь':'you install','перейти':'go to','игровым':'game','механикам':'mechanics','буду':'will','происходящее':'what is happening','простыми':'simple','словами':'words','знания':'knowledge','компьютерах':'computers','заранее':'in advance','делают':'make','нескольких':'several','частей':'parts','держит':'holds','занимается':'handles','графикой':'graphics','Главная':'Main','просто':'just','подобрать':'choose','такие':'such','открою':'I will open','начну':'I will start','учить':'teach','практике':'practice','ПРАКТИКОЙ':'PRACTICE','Начинаем':'Starting','начинаем':'starting','основы':'basics','безопасная':'safe','открой':'open','посмотри':'look','растёт':'grows','множителем':'multiplier','давать':'give','контекстные':'contextual','несовместимости':'incompatibility','решения':'solutions','становится':'becomes','многоуровневым':'multi-level','единственный':'only','составляет':'is','улучшения':'upgrades','вырастет':'will grow','центральный':'central','отвечает':'handles','намного':'much','программе':'program','работе':'work','поддержкой':'support','подключается':'connects','значительно':'significantly','обеспечивает':'provides','электричеством':'electricity','достаточная':'sufficient','всей':'entire','чипсет':'chipset','рассчитан':'rated','хуже':'worse','проблему':'problem','тогда':'then','вентиляцию':'ventilation','размещаться':'be placed','охлаждаться':'be cooled','материн':'motherboard','смогут':'will be able','иметь':'have','названии':'name','успевать':'manage','отводить':'dissipate','иначе':'otherwise','заданном':'specified','Нашлась':'Found','нашлась':'was found','проблема':'problem','специально':'specifically','позволяет':'allows','ошибаться':'make mistakes','последствий':'consequences','понял':'understood','причинно':'causal','следственную':'effect','связь':'connection','конфликтующих':'conflicting','проверь':'check','добавил':'added','меняет':'changes','установил':'installed','участвует':'participates','расчёте':'calculation','проверках':'checks','проверена':'checked','гонись':'chase','самым':'the most','большим':'largest','числом':'number','дальше':'further','научиться':'learn','смотреть':'look','разумную':'reasonable','рекомендую':'recommend','дорогая':'expensive','крошечный':'tiny','испортить':'ruin','зафиксирована':'fixed','проверки':'checks','Изменять':'Change','изменять':'change','окончания':'completion','оценит':'will evaluate','критериев':'criteria','критерий':'criterion','проверяет':'checks','состав':'composition','Идеальная':'Ideal','идеальная':'ideal','выглядит':'looks','перекошенной':'unbalanced','всего':'everything','всем':'everyone','всех':'all','каждому':'each','должны':'must','хотя':'although','ровно':'exactly','максимума':'maximum','максимуму':'maximum','пути':'path','получил':'received','отрицательный':'negative','вышла':'came out','вышел':'came out','сделает':'will make','идти':'go','сможет':'will be able','зависит':'depends','поможет':'will help','помогает':'helps','оставить':'leave','оставь':'leave','завершить':'finish','окончить':'finish','перейдя':'by going','настройке':'setting','значит':'means','текущие':'current','следующие':'next','доступно':'available','входе':'visit','посещении':'visit','приходи':'come','обновление':'update','обновления':'updates','добавление':'addition','причём':'moreover','включает':'includes','содержит':'contains','каждый':'each','внутренний':'internal','внешний':'external','бывших':'former','новичков':'beginners','учимся':'learn','учить':'teach','изменить':'change','сменить':'switch','выключить':'disable','включить':'enable','выбранная':'selected','выбранной':'selected','выбрать':'choose','походу':'apparently','спросить':'ask','вопрос':'question','галочку':'checkbox','заранее':'in advance','открывает':'opens','объяснят':'will explain','объясняют':'explain','разборе':'review','конкретные':'specific','покажу':'I will show','где':'where','теряет':'loses','баллы':'points','почему':'why','например':'for example','если':'if','когда':'when','связке':'combination','раскрыть':'unleash','потенциал':'potential','топ':'top','ряд':'range','средняков':'mid-range','бронза':'Bronze','серебро':'Silver','золото':'Gold','стандарт':'Standard','стандартом':'Standard','сертификатами':'certificates','компенсация':'compensation','возместить':'compensate','возмещает':'compensates','произошло':'happened','огнём':'fire','огонь':'fire','другой':'another','механикой':'mechanic','сгорает':'burns','сгорел':'burned','перезагрузке':'reload','перезагрузка':'reload','попадают':'appear','отдельно':'separately','поэтому':'therefore','по умолчанию':'by default','начальной':'initial','фиксированная':'fixed','фиксированный':'fixed','сборку':'build','сборке':'build','режима':'mode','режимов':'modes','выборе':'selection','выбор':'selection','карточка':'card','карточки':'cards','градиент':'gradient','анимация':'animation','анимации':'animations','двигающийся':'moving','сохраняется':'is saved','сохранены':'saved','открыт':'open','открытая':'open','открывает':'opens','вызвать':'call','ошибку':'error','ошибка':'error','сообщение':'message','текст':'text','текста':'text','сайт':'site','сайта':'site','страница':'page','страницы':'pages','язык':'language','языка':'language','русский':'Russian','английский':'English'
};
// Extra UI words used by dynamic mini-game / AI panels.
I18N_FINAL_WORDS['требовательность']='demand';
I18N_FINAL_WORDS['выполни']='complete';
I18N_FINAL_WORDS['ограничения']='restrictions';
I18N_FINAL_WORDS['времени']='time';
I18N_FINAL_WORDS['весь']='entire';
I18N_FINAL_WORDS['режим']='mode';
I18N_FINAL_WORDS['нет']='none';
I18N_FINAL_WORDS['отпусти']='release';
I18N_FINAL_WORDS['палец']='pointer';
I18N_FINAL_WORDS['над']='over';
I18N_FINAL_WORDS['папкой']='folder';
I18N_FINAL_WORDS['ориентир']='reference';
I18N_FINAL_WORDS['показан']='shown';
I18N_FINAL_WORDS['активной']='active';
I18N_FINAL_WORDS['строке']='line';
I18N_FINAL_WORDS['пиши']='type';
I18N_FINAL_WORDS['строго']='exactly';
I18N_FINAL_WORDS['поле']='field';
I18N_FINAL_WORDS['ввода']='input';
const I18N_PHRASES = [
  [/С двумя купонами \(-([0-9]+)%\)/g,'With two coupons (-$1%)'],
  [/SSD -([0-9]+)% от скорости\/мощности платы/g,"SSD -$1% of the board's speed/power"],
  [/Блок питания на ([0-9]+) W\. Сертификат выбирается после нажатия «Купить»\./g,'Power supply rated at $1 W. The certificate is selected after clicking “Buy”.'],
  [/Блок питания должен иметь достаточную мощность для видеокарты и остальной системы; число ватт в названии БП — доступный запас питания\./g,'The PSU must provide enough power for the graphics card and the rest of the system; the wattage in the PSU name indicates available power headroom.'],
  [/^\s*([^—]+) оставляет небольшой простор для будущего апгрейда: ([0-9]+) слота RAM и максимум ([0-9]+) ГБ\. Для долгосрочной сборки лучше выбирать плату с большим запасом памяти и расширения\.$/g,'$1 leaves limited room for future upgrades: $2 RAM slots and up to $3 GB. For a long-term build, choose a motherboard with more memory and expansion headroom.'],
  [/БП слишком слабый для видеокарты/g,'The PSU is too weak for the graphics card'],[/БП слишком слабый/g,'The PSU is too weak'],[/Материнская плата/g,'Motherboard'],[/Операционная система/g,'Operating system'],[/Оперативная память/g,'RAM'],[/Видеокарта/g,'Graphics card'],[/Процессор/g,'Processor'],[/Накопитель/g,'Storage drive'],[/Блок питания/g,'Power supply'],[/Охлаждение/g,'Cooling'],[/Чёрный рынок/g,'Black market'],[/Чёрного рынка/g,'black market'],[/Чёрная пятница/g,'Black Friday'],[/Раздача купонов/g,'Coupon giveaway'],[/Разработка ИИ/g,'AI development'],[/Лишнее производство/g,'Overproduction'],[/Взрыв фабрики/g,'Factory explosion'],[/Продать эту деталь нельзя/g,"You cannot sell this component"],[/Продать/g,'Sell'],[/Куплено/g,'Purchased'],[/Покупка недоступна/g,'Purchase unavailable'],[/Не хватает денег/g,'Not enough money'],[/Сохранения/g,'Saves'],[/Ячейка/g,'Slot'],[/Занято/g,'Occupied'],[/Пусто/g,'Empty'],[/Достижение/g,'Achievement'],[/Получено/g,'Unlocked'],[/Заблокировано/g,'Locked'],[/Проверка пройдена/g,'Check passed'],[/Проблем обнаружено/g,'Problems found'],[/Проблемные разделы/g,'Problematic categories'],[/Рекомендовано/g,'Recommended'],[/Подходит/g,'Compatible'],[/Несовместимо/g,'Incompatible'],[/Совместимость/g,'Compatibility'],[/Мощность/g,'Power'],[/Производительность/g,'Performance'],[/Бюджет/g,'Budget'],[/сборк[аиуке]/gi,'build'],[/сборки/g,'builds'],[/сборке/g,'build'],[/сборку/g,'build'],[/сборкой/g,'build'],[/режим[а-я]*/gi,'mode'],[/прохождени[еяиюем]/gi,'playthrough'],[/детал[ьиелями]+/gi,'component'],[/компонент[аыоеамиу]?/gi,'component'],[/каталог[аеуом]/gi,'catalog'],[/магазин[аеуом]/gi,'shop'],[/деньг[иае]/gi,'money'],[/цен[аеой]/gi,'price'],[/скидк[аеиуой]+/gi,'discount'],[/куп[оа]н[аоеу]/gi,'coupon'],[/событи[яиею]/gi,'event'],[/ошибк[аиу]/gi,'mistake'],[/разбор/g,'review'],[/экзамен[а-я]*/gi,'exam'],[/обучени[еяиюем]/gi,'tutorial'],[/подсказк[аиу]/gi,'hint'],[/игр[аоеы]/gi,'game'],[/мини-игр[аы]/gi,'mini-games'],[/заработк[аеуом]/gi,'earnings'],[/клик[аеуом]/gi,'click'],[/кликов/g,'clicks'],[/баланс[а-я]*/gi,'balance'],[/секунд[а-я]*/gi,'seconds'],[/сек/gi,'sec'],[/сейчас/g,'now'],[/всегда/g,'always'],[/теперь/g,'now'],[/потом/g,'then'],[/после/g,'after'],[/перед/g,'before'],[/при/g,'when'],[/если/g,'if'],[/только/g,'only'],[/можно/g,'can'],[/нельзя/g,'cannot'],[/нужен/g,'needed'],[/нужно/g,'need'],[/получен/g,'received'],[/получено/g,'received'],[/получать/g,'receive'],[/получаешь/g,'receive'],[/выбери/g,'choose'],[/выбирать/g,'choose'],[/выбран/g,'selected'],[/выбрать/g,'choose'],[/нажми/g,'click'],[/нажать/g,'click'],[/открыт/g,'open'],[/открыто/g,'open'],[/открывается/g,'opens'],[/закрыт/g,'closed'],[/закрыть/g,'close'],[/сохранить/g,'save'],[/сохранения/g,'saves'],[/сохранен[а-я]*/gi,'saved'],[/сброс/g,'reset'],[/сбросить/g,'reset'],[/установить/g,'install'],[/установлен[а-я]*/gi,'installed'],[/купить/g,'buy'],[/покупки/g,'purchases'],[/продаж[аиу]/gi,'sale'],[/продать/g,'sell'],[/работает/g,'works'],[/работают/g,'work'],[/сломана/g,'broken'],[/сломано/g,'broken'],[/поврежден[а-я]*/gi,'damaged'],[/слаб[а-я]*/gi,'weak'],[/сильн[а-я]*/gi,'strong'],[/мощн[а-я]*/gi,'powerful'],[/высок[а-я]*/gi,'high'],[/средн[а-я]*/gi,'mid-range'],[/начальн[а-я]*/gi,'entry-level'],[/бюджетн[а-я]*/gi,'budget'],[/топ[а-я]*/gi,'top-tier'],[/примерно/g,'approximately'],[/около/g,'about'],[/более/g,'more'],[/менее/g,'less'],[/слишком/g,'too'],[/достаточно/g,'enough'],[/минимум/g,'minimum'],[/максимум/g,'maximum'],[/здесь/g,'here'],[/внутри/g,'inside'],[/рядом/g,'next to'],[/прямо/g,'directly'],[/автоматически/g,'automatically'],[/отдельн[аяеый]*/gi,'separate'],[/обычн[ыйое]*/gi,'normal'],[/нов[а-я]*/gi,'new'],[/стар[а-я]*/gi,'old'],[/простой/g,'simple'],[/сложн[а-я]*/gi,'difficult'],[/чуть/g,'a little'],[/быстр[а-я]*/gi,'fast'],[/медлен[а-я]*/gi,'slow'],[/система/g,'system'],[/данн[а-я]*/gi,'data'],[/файл/g,'file'],[/кнопк[аиу]/gi,'button'],[/окн[а-я]*/gi,'window'],[/строк[аи]/gi,'line'],[/полностью/g,'fully'],[/част[ьяью]/gi,'part'],[/уровн[ьяеи]/gi,'level'],[/качество/g,'quality'],[/сертификат[а-я]*/gi,'certificate'],[/станд[а-я]*/gi,'standard'],[/бронз[а-я]*/gi,'bronze'],[/серебр[а-я]*/gi,'silver'],[/золот[а-я]*/gi,'gold'],[/компенсаци[яуюи]/gi,'compensation'],[/сгорает/g,'is consumed'],[/потрат/g,'spent'],[/цена/g,'price'],[/стоит/g,'costs'],[/ватт[а-я]*/gi,'watts'],[/слот[а-я]*/gi,'slot'],[/памят[ьяю]/gi,'memory'],[/сокет/g,'socket'],[/платформ[а-я]*/gi,'platform'],[/поддержива[а-я]*/gi,'support'],[/запас/g,'headroom'],[/апгрейд[а-я]*/gi,'upgrade'],[/будущ[а-я]*/gi,'future'],[/получ[а-я]*/gi,'receive'],[/список/g,'list'],[/класс[а-я]*/gi,'class'],[/уровн[аяеи]/gi,'level'],[/причин[аеу]/gi,'reason'],[/почему/g,'why'],[/объясн[а-я]*/gi,'explain'],[/вывод/g,'output'],[/показ[а-я]*/gi,'show'],[/действи[еяием]/gi,'action'],[/результат[аеуом]/gi,'result'],[/ошибка/g,'error'],[/ошибки/g,'errors'],[/успешно/g,'successfully'],[/прош[а-я]*/gi,'passed'],[/пройден[а-я]*/gi,'passed'],[/провален[а-я]*/gi,'failed'],[/фиксированн[а-я]*/gi,'fixed'],[/стартов[а-я]*/gi,'starter'],[/начальн[а-я]*/gi,'initial'],[/запуск/g,'start'],[/начал[а-я]*/gi,'started'],[/сбросить/g,'reset'],[/включить/g,'enable'],[/выключен[а-я]*/gi,'disabled'],[/включен[а-я]*/gi,'enabled'],[/настройк[аи]/gi,'settings'],[/тема/g,'theme'],[/тёмн[а-я]*/gi,'dark'],[/светл[а-я]*/gi,'light'],[/полноэкранн[а-я]*/gi,'fullscreen'],[/язык[а-я]*/gi,'language'],[/русск[а-я]*/gi,'Russian'],[/англ[а-я]*/gi,'English'],[/программировани[ея]/gi,'programming'],[/исходник[а-я]*/gi,'source'],[/команд[а-я]*/gi,'command'],[/пример/g,'example'],[/показател[ьяе]/gi,'value'],[/человек/g,'player'],[/игрок[а-я]*/gi,'player'],[/тв[ояой]*/gi,'your'],[/у тебя/g,'you have'],[/твой/g,'your'],[/тебе/g,'you'],[/тебя/g,'you'],[/ты/g,'you'],[/я/g,'I'],[/мы/g,'we'],[/он/g,'it'],[/она/g,'it'],[/они/g,'they'],[/это/g,'this'],[/этом/g,'this'],[/такой/g,'such'],[/такая/g,'such'],[/которые/g,'that'],[/который/g,'that'],[/когда/g,'when'],[/чем/g,'the better'],[/как/g,'how'],[/что/g,'that'],[/без/g,'without'],[/только/g,'only'],[/все/g,'all'],[/вс[её]/gi,'all'],[/кажд[ыйуюое]/gi,'each'],[/част[ьяью]/gi,'part'],[/ещё/g,'also'],[/тоже/g,'also'],[/сразу/g,'immediately'],[/затем/g,'then'],[/далее/g,'next'],[/назад/g,'back'],[/пока/g,'for now'],[/здесь/g,'here'],[/там/g,'there'],[/выше/g,'above'],[/ниже/g,'below'],[/сам[аяое]?/gi,'own'],[/сво[яейоеи]/gi,'your'],[/перв[ыйаяое]*/gi,'first'],[/втор[ойаяое]*/gi,'second'],[/трет[ийьяье]*/gi,'third'],[/один/g,'one'],[/два/g,'two'],[/три/g,'three'],[/четыр[еехе]*/gi,'four'],[/пять/g,'five'],[/шесть/g,'six'],[/семь/g,'seven'],[/восемь/g,'eight'],[/девять/g,'nine'],[/десять/g,'ten']
];
const I18N_QUALITY_EXACT = {
  "Замена деталей": "Replace Components",
  "Для запуска нужен процессор.": "A processor is required to start the PC.",
  "Слишком большой объём RAM для материнской платы": "Too much RAM for the motherboard",
  "БП слишком слабый для видеокарты": "The PSU is too weak for the graphics card",
  "БП слишком слабый": "The PSU is too weak",
  "Компоненты некуда подключить.": "There is nowhere to connect the components.",
  "Без RAM система не сможет нормально пройти POST.": "Without RAM, the system cannot complete POST normally.",
  "Операционной системе неоткуда загружаться.": "The operating system has nowhere to boot from.",
  "Системе нечем получать питание.": "The system has no power source.",
  "Для запуска нужен установленный загрузочный образ ОС.": "A bootable operating system image is required to start the PC.",
  "64 GB HDD несовместим с этой ОС": "64 GB HDD is incompatible with this OS",
  "Охлаждение не справляется с CPU": "The cooling solution cannot handle this CPU",
  "Установленная деталь сломана": "Installed component is broken",
  "Ячейка": "Slot",
  "Пусто": "Empty",
  "Занято": "Occupied",
  "Здесь пока нет сохранения.": "There is no save in this slot yet.",
  "Купон на скидку получен.": "Discount coupon received.",
  "Можно купить одну деталь даже при SOLD OUT.": "You can buy one component even when the item is SOLD OUT.",
  "🎟️ EXTRA COUPON получен! Теперь можно купить одну деталь даже при SOLD OUT.": "🎟️ EXTRA COUPON received! You can now buy one component even when the item is SOLD OUT.",
  "🚫 Покупки заблокированы: баланс отрицательный. Стабилизируй баланс до $0 или выше.": "🚫 Purchases are blocked because your balance is negative. Bring your balance back to $0 or higher.",
  "Неизвестный режим": "Unknown mode",
  "Дата неизвестна": "Date unknown",
  "Сначала выбери ячейку для сохранения. После успешного сохранения прохождение будет сброшено.": "Choose a save slot first. After the save succeeds, the current playthrough will be reset.",
  "Выбери ячейку для сохранения текущего прохождения.": "Choose a slot to save the current playthrough.",
  "Выбери сохранение, которое хочешь загрузить.": "Choose the save you want to load.",
  "Все товары получили скидку от 10% до 50%. Без переплат.": "All items are discounted by 10% to 50%. No markups.",
  "Одну категорию комплектующих выпускают в избытке: все товары этой категории дешевеют и чаще встречаются.": "One component category is overproduced: all items in that category become cheaper and appear more often.",
  "Две категории комплектующих стали дефицитными и подорожали.": "Two component categories are now scarce and have become more expensive.",
  "Помни мигающую последовательность и повтори её.": "Remember the flashing sequence and repeat it.",
  "Запомни мигающую последовательность и повтори её.": "Remember the flashing sequence and repeat it.",
  "Решай примеры на время. Хардкор добавляет корни, факториалы и дроби.": "Solve math problems against the clock. Hardcore adds roots, factorials, and fractions.",
  "Кликай по целям до того, как они исчезнут.": "Click the targets before they disappear.",
  "Жми кнопку сразу после появления. Чем быстрее, тем лучше.": "Press the button as soon as it appears. The faster you are, the better.",
  "Найди нужный цвет среди похожих кнопок.": "Find the correct color among similar buttons.",
  "Напечатай слова и короткие фразы как можно быстрее.": "Type the words and short phrases as quickly as possible.",
  "Нажми числа в правильной последовательности.": "Click the numbers in the correct order.",
  "Повтори растущую последовательность цветных кнопок.": "Repeat the growing sequence of colored buttons.",
  "Сделай как можно больше точных кликов за ограниченное время.": "Make as many accurate clicks as possible within the time limit.",
  "Двигайся и не попадай под падающие препятствия.": "Move and avoid the falling obstacles.",
  "Собирай еду, не врежься в стену или себя.": "Collect food without hitting the wall or yourself.",
  "Доберись до выхода по случайно сгенерированному лабиринту.": "Find the exit through a randomly generated maze.",
  "Отбивай мяч и переиграй компьютер.": "Return the ball and beat the computer.",
  "Разбивай блоки мячом и не дай ему упасть.": "Break the blocks with the ball and keep it from falling.",
  "Лети между трубами, вовремя нажимая пробел.": "Fly between the pipes and press Space at the right time.",
  "Уворачивайся от машин на постоянно ускоряющейся трассе.": "Dodge the cars on a track that keeps getting faster.",
  "Уничтожай астероиды и выживай в поле обломков.": "Destroy asteroids and survive the debris field.",
  "Собирай серию попаданий по движущимся целям.": "Build a streak of hits on moving targets.",
  "Собирай линии из падающих фигур и переживи ускорение.": "Clear lines with falling pieces and survive the increasing speed.",
  "Попадай в круги точно в ритм. Ошибка сбивает комбо.": "Hit the circles in time with the rhythm. A mistake breaks your combo.",
  "Прыгай через препятствия и переживи длинную трассу.": "Jump over obstacles and survive the long course.",
  "Уничтожай врагов, собирай усиления и переживай волны.": "Destroy enemies, collect power-ups, and survive the waves.",
  "Не игра, а настоящий тест: чем мощнее ПК, тем выше FPS.": "This is not a game, but a real stress test: the more powerful the PC, the higher the FPS.",
  "Кликай по цели 10 секунд.": "Click the target for 10 seconds.",
  "Кликай по движущимся целям. 15 попаданий.": "Click the moving targets. Get 15 hits.",
  "Ускоряет выплаты: интервал сокращается с 10 до 5 секунд.": "Speeds up payouts: the interval is reduced from 10 to 5 seconds.",
  "Для AFK необходимо включить CPU.": "AFK requires an enabled CPU.",
  "Заполни функцию, которая возвращает сумму a и b.": "Complete the function so that it returns the sum of a and b.",
  "Создай заголовок первого уровня с текстом PC Builder.": "Create a level-one heading with the text PC Builder.",
  "Напиши функцию с четырьмя строками кода, которая возвращает квадрат x.": "Write a four-line function that returns the square of x.",
  "Напиши четыре строки кода, возвращающие строку Hello, и имя через пробел.": "Write four lines of code that return the word Hello and a name separated by a space.",
  "Напиши пять строк кода, возвращающих произведение a и b.": "Write five lines of code that return the product of a and b.",
  "Подсказка: сначала вычисли произведение и сохрани его в result.": "Hint: calculate the product first and store it in result.",
  "Напиши пять строк кода, возвращающих большее из двух чисел.": "Write five lines of code that return the larger of two numbers.",
  "Подсказка: используй тернарный оператор.": "Hint: use the ternary operator.",
  "Напиши шесть строк кода, проверяющих делимость n на 2 без остатка.": "Write six lines of code that check whether n is evenly divisible by 2.",
  "Подсказка: остаток от деления должен быть равен нулю.": "Hint: the remainder of the division must be zero.",
  "Напиши шесть строк кода и увеличь count на 1.": "Write six lines of code and increase count by 1.",
  "Ориентир показан на активной строке. Пиши строго по нему.": "A reference is shown on the active line. Type exactly what it shows.",
  "Нажми на поле ввода…": "Click the input field…",
  "В этом реролле шанс 25% не сработал. Жди следующий реролл.": "The 25% chance did not trigger on this reroll. Wait for the next reroll.",
  "Лайт-режим: базовые цены · все детали доступны": "Light mode: base prices · all components available",
  "сертификат выбирается при покупке": "Certificate selected at purchase",
  "0% · без наценки": "0% · no markup",
  "Процессор (CPU)": "Processor (CPU)",
  "Главный вычислительный компонент. Выполняет команды, считает данные и влияет на общую производительность системы.": "The main computing component. It executes instructions, processes data, and affects overall system performance.",
  "Ядра и потоки — сколько задач CPU может обрабатывать параллельно.": "Cores and threads determine how many tasks the CPU can process in parallel.",
  "Частота — скорость работы ядер, но одна только частота не определяет производительность.": "Clock speed measures how fast the cores operate, but clock speed alone does not determine performance.",
  "Сокет и совместимость с материнской платой важны при сборке.": "The socket and motherboard compatibility are important when building a PC.",
  "Видеокарта (GPU)": "Graphics Card (GPU)",
  "Отвечает за обработку графики и вычислительные задачи, связанные с изображением. Особенно важна для игр.": "Handles graphics processing and image-related computing tasks. It is especially important for gaming.",
  "Видеопамять (VRAM) хранит данные графики.": "Video memory (VRAM) stores graphics data.",
  "Производительность GPU сильно влияет на FPS в графических задачах.": "GPU performance has a major impact on FPS in graphics-heavy workloads.",
  "Встроенная графика находится прямо в процессоре или платформе и обычно слабее отдельной видеокарты.": "Integrated graphics are built into the processor or platform and are usually weaker than a discrete graphics card.",
  "🧠 memory": "🧠 Memory",
  "Оперативная память (RAM)": "Memory (RAM)",
  "Быстрая временная память для данных, которыми система пользуется прямо сейчас. После выключения её содержимое исчезает.": "Fast temporary memory for data the system is using right now. Its contents disappear when the PC is powered off.",
  "Объём определяет, сколько данных и программ можно держать одновременно.": "Capacity determines how much data and how many programs can stay in memory at once.",
  "Тип памяти — DDR3, DDR4 или DDR5 — должен соответствовать платформе.": "The memory type — DDR3, DDR4, or DDR5 — must match the platform.",
  "Больший объём не всегда означает большую производительность, но нехватка RAM сильно мешает системе.": "More memory does not always mean more performance, but not having enough RAM can severely limit the system.",
  "Накопитель": "Storage",
  "Хранит операционную систему, игры и файлы даже после выключения ПК.": "Stores the operating system, games, and files even after the PC is powered off.",
  "HDD использует магнитные пластины и обычно медленнее SSD.": "An HDD uses magnetic platters and is usually slower than an SSD.",
  "SATA SSD заметно быстрее HDD.": "A SATA SSD is noticeably faster than an HDD.",
  "NVMe SSD работает через PCIe и обычно ещё быстрее.": "An NVMe SSD uses PCIe and is usually even faster.",
  "Блок питания (PSU)": "Power Supply (PSU)",
  "Преобразует электричество из сети и подаёт подходящее питание компонентам компьютера.": "Converts mains electricity and supplies the appropriate power to the PC components.",
  "Мощность указывается в ваттах (W).": "Power is measured in watts (W).",
  "Слабого БП может не хватить мощным компонентам.": "A weak PSU may not provide enough power for high-performance components.",
  "Качество питания тоже важно: сертификат эффективности не является полной оценкой качества БП.": "Power quality also matters: an efficiency certificate is not a complete measure of PSU quality.",
  "Материнская плата": "Motherboard",
  "Соединяет компоненты компьютера и определяет, какие процессоры, память и устройства можно установить.": "Connects the PC components and determines which processors, memory, and devices can be installed.",
  "Сокет должен совпадать с процессором.": "The socket must match the processor.",
  "Поддержка памяти определяет совместимые поколения DDR.": "Memory support determines which DDR generations are compatible.",
  "Количество и стандарт слотов расширения влияют на возможности апгрейда.": "The number and standard of expansion slots affect future upgrade options.",
  "Охлаждение": "Cooling",
  "Отводит тепло от горячих компонентов, прежде всего процессора.": "Removes heat from hot components, especially the processor.",
  "Штатный кулер подходит не для любого мощного CPU.": "A stock cooler is not suitable for every high-performance CPU.",
  "Башенные кулеры используют радиатор и вентилятор.": "Tower coolers use a heatsink and a fan.",
  "СЖО использует жидкость, радиатор и помпу для отвода тепла.": "AIO cooling uses liquid, a radiator, and a pump to remove heat.",
  "Корпус": "Case",
  "Физический корпус, в котором размещаются компоненты. В игре он влияет на удобство и пригодность сборки, но не заменяет остальные детали.": "The physical case that houses the components. In the game, it affects the practicality of the build but does not replace the other parts.",
  "Размер корпуса определяет совместимость с комплектующими.": "Case size determines component compatibility.",
  "Хороший airflow помогает выводить горячий воздух.": "Good airflow helps remove hot air.",
  "На хардкоре можно начать вообще без корпуса.": "In Hardcore, you can start without a case at all.",
  "Операционная система": "Operating System",
  "Главное системное программное обеспечение. В игре ОС тоже влияет на общую мощность ПК.": "The main system software. In the game, the OS also affects total PC power.",
  "Разные ОС имеют разную мощность и цену.": "Different operating systems have different power values and prices.",
  "ОС покупается в каталоге и устанавливается как обычный компонент.": "The OS is purchased from the catalog and installed like a normal component.",
  "Стартовая ОС зависит от выбранного режима.": "The starting OS depends on the selected mode.",
  "Создаёт новое прохождение. После этого выбираешь лёгкий, сложный или хардкор.": "Creates a new playthrough. After that, you choose Easy, Hard, or Hardcore.",
  "Здесь загружаются сохранения из трёх ручных ячеек.": "Your three manual save slots are loaded here.",
  "Самый жёсткий режим. Перед запуском появляется отдельное предупреждение.": "The toughest mode. A separate warning appears before you start it.",
  "Активный заработок: проходишь игру полностью и получаешь награду. CPU может дать дополнительный бонус.": "Active earnings: complete a game and receive a reward. The CPU may provide an extra bonus.",
  "Компьютер зарабатывает автоматически. Для запуска нужны подходящие компоненты и достаточно мощный CPU.": "The PC earns money automatically. You need suitable components and a sufficiently powerful CPU to start.",
  "Разгон даёт ×5 к доходу, но повышает риск перегрева и требует более мощного процессора.": "Overclocking gives ×5 income, but increases the risk of overheating and requires a more powerful processor.",
  "Здесь покупаются детали. В зависимости от режима каталог отображается по-разному, а скрытые группы помогают правильно расставлять приоритеты.": "This is where you buy components. The catalog changes by mode, while hidden groups help you prioritize purchases.",
  "У купленных деталей есть две кнопки: «Установить» и «Продать». Продажа возвращает 80% от текущей рыночной цены детали.": "Purchased components have two actions: “Install” and “Sell”. Selling returns 80% of the component’s current market price.",
  "После полного прохождения мини-игры может выпасть купон от -10% до -80%. Он применяется к уже изменённой рынком цене и хранится только один за раз.": "After completing a mini-game, you may receive a coupon from -10% to -80%. It applies to the market-adjusted price, and only one coupon can be held at a time.",
  "Цены и доступность деталей меняются. События временно влияют на категории товаров и их цены.": "Component prices and availability change. Events temporarily affect categories and their prices.",
  "Нажми на слот компонента, чтобы заменить установленную деталь на купленную из инвентаря.": "Click a component slot to replace the installed part with one from your inventory.",
  "Каталог подсвечивает совместимость деталей в лёгком режиме. Зелёный — всё подходит, оранжевый — подходит не всё, красный — несовместимо.": "The catalog highlights component compatibility in Easy mode. Green means everything fits, orange means some things do not, and red means incompatible.",
  "Рядом со сбросом есть сохранения с тремя ручными ячейками. Если ячейка занята, сайт предложит перезаписать её.": "Three manual save slots are available next to Reset. If a slot is occupied, the site will ask whether you want to overwrite it.",
  "Сброс прохождения требует подтверждения и сначала предлагает сохранить текущую игру.": "Resetting a playthrough requires confirmation and first offers to save the current game.",
  "Здесь отслеживается прогресс достижений. Некоторые требуют конкретную сборку, деньги, события или полную коллекцию каталога.": "This is where achievement progress is tracked. Some achievements require a specific build, money, events, or a complete catalog collection.",
  "Здесь можно посмотреть назначение комплектующих и важные характеристики.": "Here you can learn what each component does and see its important specifications.",
  "Максимальный апгрейд на пути AMD.": "Maximum upgrade path for AMD.",
  "Максимальный апгрейд на пути Intel.": "Maximum upgrade path for Intel.",
  "Накопи на балансе 1 000 000 $.": "Reach a balance of $1,000,000.",
  "Собери ПК, где 8 компонентов близки к максимуму своей категории, а 1 явно слабее остальных.": "Build a PC where eight components are close to the top of their categories while one is clearly weaker than the rest.",
  "Выбей 3 Чёрные пятницы подряд.": "Trigger Black Friday three times in a row.",
  "Собери мощную майнинг-ферму на Xeon и 128 ГБ DDR4 с Windows 11 Pro или macOS.": "Build a powerful mining rig with a Xeon CPU, 128 GB DDR4, and Windows 11 Pro or macOS.",
  "Собери ультимативную AI-сборку на Core Ultra 9 и 256 ГБ DDR5 с Windows 11 Pro или macOS.": "Build an ultimate AI workstation with a Core Ultra 9, 256 GB DDR5, and Windows 11 Pro or macOS.",
  "Скупи все предметы из обычного каталога.": "Buy every item from the regular catalog.",
  "Собери полностью рабочий ПК только из деталей, купленных на чёрном рынке.": "Build a fully working PC using only components bought on the Black Market.",
  "Купи по экземпляру из обычного каталога и чёрного рынка для каждого предмета каталога.": "Buy one copy from the regular catalog and one from the Black Market for every catalog item.",
  "Купи любую деталь, используя EXTRA COUPON и обычный купон одновременно.": "Buy any component using an EXTRA COUPON and a regular coupon at the same time.",
  "100% выполнено": "100% complete",
  "Чёрные пятницы подряд": "Black Fridays in a row",
  "предметов каталога": "catalog items",
  "деталей с чёрного рынка": "Black Market components",
  "пар деталей": "component pairs",
  "особое условие": "special condition",
  "условие сборки": "build condition",
  "требований": "requirements",
  "условие": "condition",
  "Ниже перечислены конкретные замечания по этой сборке. Названия деталей взяты прямо из твоего текущего ПК.": "Below are the specific issues found in this build. Component names are taken directly from your current PC.",
  "Теперь оцениваю сборку критерий за критерием…": "Now I am evaluating the build criterion by criterion…",
  "Ошибка: укажи число, например pcMoney(1000000)": "Error: enter a number, for example pcMoney(1000000)",
  "Включить новое обучение?": "Enable the new tutorial?",
  "Ты русский?": "Do you speak Russian?",
  "PC Builder по умолчанию открыт на английском языке. Если ты русский — нажми кнопку ниже и переключи сайт на русский.": "PC Builder uses English by default. If you prefer Russian, click the button below to switch to Russian.",
  "🇷🇺 Да, русский": "🇷🇺 Switch to Russian",
  "🇬🇧 Оставить English": "🇬🇧 Keep English",
  "Откажусь пожалуй": "I’ll pass",
  "Понятно, вернуться к сборке": "Got it, return to the build",
  "Хорошо, закончить обучение": "Okay, finish the tutorial",
  "Экзамен завершён. Хочешь сохранить это прохождение?": "The exam is finished. Would you like to save this playthrough?",
  "Экзамен провален — разбор ошибок обязателен": "Exam failed — error review is required",
  "🔎 Разбор твоей сборки": "🔎 Build Review",
  "📝 Экзамен": "📝 Exam",
  "📦 Экзамен завершён": "📦 Exam Finished",
  "🔎 Разбор ошибок": "🔎 Error Analysis"
};
function translateRuText(value){
  if(typeof value !== 'string' || !value || !isEnglish()) return value;
  if(I18N_QUALITY_EXACT[value]) return I18N_QUALITY_EXACT[value];
  if(I18N_EXACT[value]) return I18N_EXACT[value];
  if(I18N_FINAL_EXACT[value]) return I18N_FINAL_EXACT[value];
  let out=value;
  for(const [re,repl] of I18N_EXAM_DYNAMIC_PHRASES){
    out=out.replace(re,repl);
  }
  for(const [re,repl] of I18N_PHRASES){
    const safeRe = new RegExp(`(?<![А-Яа-яЁё])(?:${re.source})(?![А-Яа-яЁё])`, re.flags);
    out=out.replace(safeRe,repl);
  }
  const lookup = Object.create(null);
  for(const [k,v] of Object.entries(I18N_WORDS)) lookup[k.toLowerCase()]=v;
  for(const [k,v] of Object.entries(I18N_COMMON_WORDS)) lookup[k.toLowerCase()]=v;
  for(const [k,v] of Object.entries(I18N_COVER_WORDS)) lookup[k.toLowerCase()]=v;
  for(const [k,v] of Object.entries(I18N_FINAL_WORDS)) lookup[k.toLowerCase()]=v;
  out=out.replace(/[А-Яа-яЁё]+/g, (word) => {
    const translated = lookup[word.toLowerCase()];
    if (!translated) return word;
    if (/^[А-ЯЁ]+$/.test(word)) return translated.toUpperCase();
    if (/^[А-ЯЁ]/.test(word) && typeof translated === 'string' && translated) {
      return translated.charAt(0).toUpperCase() + translated.slice(1);
    }
    return translated;
  });
  out=out.replace(/ПК/g,'PC').replace(/БП/g,'PSU').replace(/ОС/g,'OS').replace(/ИИ/g,'AI').replace(/ГБ/g,'GB').replace(/Вт/g,'W').replace(/СЖО/g,'AIO').replace(/сек\.?/gi,'sec');
  if(!/[{}<>]|\b(?:function|const|let|return|class)\b/.test(out)){
    out=out.replace(/(^|\n\s*(?:[-•]\s*)?)([a-z])/g, (_,prefix,ch)=>prefix+ch.toUpperCase());
    out=out.replace(/([.!?…]\s+)([a-z])/g, (_,prefix,ch)=>prefix+ch.toUpperCase());
  }
  return out;
}
function shouldSkipLocalizationNode(node){
  const el=node?.nodeType===Node.TEXT_NODE ? node.parentElement : node;
  if(!el || typeof el.closest!=='function') return false;
  return !!el.closest('[data-i18n-skip="true"], textarea, pre, code, .programming-editor, .programming-reference-overlay');
}
function localizeNode(root=document){
  if(!isEnglish()) return;
  if(shouldSkipLocalizationNode(root)) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) { if(!shouldSkipLocalizationNode(walker.currentNode)) nodes.push(walker.currentNode); }
  nodes.forEach(node=>{const parent=node.parentElement;if(parent?.closest('[data-i18n-skip="true"], textarea, pre, code, .programming-editor, .programming-reference-overlay'))return;const v=node.nodeValue;const t=translateRuText(v);if(t!==v)node.nodeValue=t;});
  root.querySelectorAll?.('input[placeholder],textarea[placeholder],[title],[aria-label]').forEach(el=>{if(shouldSkipLocalizationNode(el))return;['placeholder','title','aria-label'].forEach(attr=>{if(el.hasAttribute(attr)){const v=el.getAttribute(attr),t=translateRuText(v);if(t!==v)el.setAttribute(attr,t);}});});
}

const UPDATE_LOG_EN = `v2.0.2 — PERFECT EXAM BUILDS AND BALANCED SCORING

- The exam scoring was rebuilt so three curated, balanced configurations can achieve 100/100 instead of the previous artificial ceiling.
- CPU/GPU balance now compares performance classes rather than unrelated raw component scores. A one-class difference is treated as a reasonable pairing; larger gaps are penalized.
- Performance and budget scoring now reward useful high-performance builds without requiring the most expensive parts.
- Modern AM5 and LGA1851 platforms with strong expansion headroom can receive 20/20 for Future Upgradeability.

v2.0.1 — EXAM SCORING AND LOCALIZATION FIXES\n\n- Fixed mixed-language exam feedback and made all five exam criteria use complete English sentences in English mode.\n- Separated technical compatibility from CPU/GPU balance so the compatibility score only checks real compatibility issues.\n- Rebalanced the exam so a well-matched high-end/flagship CPU and GPU are not punished by unrelated component performance scales.\n- Improved component tier detection so parts such as the Ryzen 7 5800X3D and GeForce RTX 4080 SUPER are classified more realistically.\n- Improved future-upgrade scoring so older platforms such as AM4 do not automatically receive a perfect 20/20 upgrade score.\n- Fixed capitalization and wording in dynamic exam messages.\n\nv2.0.0 — DILIGENT STUDENT AND FULL LOCALIZATION

- Added the new Diligent Student achievement. Complete the exam with a score of 95 or higher to unlock it.
- The achievement is awarded only after the exam is actually completed, not simply when a high-scoring build exists.
- Completed and polished the full English localization across the website: interface text, dynamic messages, mini-games, encyclopedia, achievements, compatibility checks, training, exam analysis, saves, settings, and system notifications.
- Fixed mixed-language phrases, inconsistent capitalization, awkward machine-like translations, and broken formatting in dynamic text.
- Programming code, function names, reference code, and typed code are preserved exactly and are never passed through the translator.
- Added and refined the English versions of exam feedback and mini-game messages.
- English is the default language for new players, with Russian available from the language prompt and Settings.

v1.17.10 — POLISHED ENGLISH LOCALIZATION AND BOOT LOADING

- Added a dedicated loading screen that blocks interaction while the website initializes.
- Reworked English copy across dynamic messages, mini-games, the encyclopedia, achievements, compatibility checks, and exam analysis.
- Fixed mixed-language strings, inconsistent capitalization, and awkward technical phrasing.
- English number formatting now uses the selected locale.

v1.17.9 — FULL LOCALIZATION AND ENGLISH BY DEFAULT
- Added English localization across the website and made English the default language for new players.
- Added the first-launch language prompt so Russian-speaking players can switch to Russian.
- Language selection is saved separately from the playthrough and can be changed in Settings.

v1.17.8 — LIGHT MODE STARTUP AND REPAIR FIXES
- Light mode now starts from a fixed starter build and cannot inherit components from another playthrough.
- Fixed the Light clicker reward error and improved repair handling.

v1.17.7 — NEW GAME SYNC AND TEST COMMAND
- New games always open on Mini-games and keep the active earnings tab synchronized with the visible section.
- Added pcMoney(amount) for quick balance testing from the browser console.

v1.17.6 — PSU PRICES, COMPENSATION, AND MOVING GRADIENT
- Increased Hardcore PSU prices and kept certificate compensation at 25% for Bronze, 50% for Silver, and 80% for Gold.
- Added a moving gradient animation inside the mode cards.

v1.17.5 — HARDCORE PSUs, CERTIFICATES, AND CARD ANIMATIONS
- Hardcore PSU cards show wattage only; the certificate is selected during purchase.
- Added Standard, 80+ Bronze, 80+ Silver, and 80+ Gold choices with separate prices.

v1.17.4 — TUTORIAL TOGGLE, EXAM EXIT, AND COLORFUL CARDS
- Light mode now asks whether the new tutorial should be enabled, with the checkbox disabled by default.
- After the exam, the game closes and offers to save the playthrough before returning to the main menu.
- Added distinct Easy, Hard, Hardcore, and Light card designs.

v1.17.3 — ERROR REVIEW, FIRST-LAUNCH TRAINING, AND LIGHT MODE
- Results below 90 can open a detailed build review; failed exams require the review.
- The review uses exact installed component names and explains balance, PSU quality, memory, storage, cooling, spending, and upgrade headroom.
- First-launch training is separate from the regular Light mode.

v1.17.2 — 250 POWER EXAM THRESHOLD AND LIGHT EARNINGS
- The exam button appears at 250 PC power.
- Light-mode click income starts at $10 and scales with the PC multiplier.

v1.17.1 — TUTORIAL, LIGHT MODE, EXAM, AND FIXES
- Added the new learning flow for first-time players while keeping the classic tutorial available from the main menu.
- Continued tuning Light mode, exam flow, saving, and interface behavior.

v1.17.0 — MAJOR TRAINING UPDATE, LIGHT MODE, AND EXAM
- Added first-visit onboarding with guided PC-building lessons and contextual hints.
- Added Light mode and the five-part exam covering compatibility, balance, spending, performance, and upgradeability.

v1.16.1 — BLACK MARKET, POLICE, AND CATALOG
- Added Black Market sales, police warnings, fines, refreshed catalog behavior, and expanded GPU choices.
- Improved achievement ordering and catalog source indicators.

v1.16.0 — BLACK MARKET AND FIRES
- Added the Black Market with separate inventory sources and special pricing.
- Added component fires and failure events tied to different earning activities.

v1.15.7 — PROGRAMMING AND OVERPRODUCTION FIXES
- Programming is blocked by invalid PC builds until required components and compatibility issues are fixed.
- Updated programming rewards and corrected Overproduction pricing.

v1.15.6 — PROGRAMMING REWARDS AND PC BONUSES
- Restored PC power multipliers and the macOS bonus to programming rewards.
- Set the base reward for a successful programming function to $50.

v1.15.5 — STARTER CPU AND COMPATIBILITY RECOMMENDATION FIXES
- Hard mode starts with the Intel Pentium J2900 again.
- Improved compatibility recommendations so the incompatible installed component is not suggested as the fix.

v1.15.4 — PROGRAMMING AND REFERENCE FIXES
- Refined programming tasks, reference display, and validation.

v1.15.3 — PROGRAMMING ADAPTATION AND MOBILE UI
- Adapted programming tasks to the updated interface.
- Improved the mobile layout and interaction.

v1.15.2 — PROGRAMMING AND REFERENCE FIXES
- Fixed programming task validation and reference handling.

v1.15.1 — PROGRAMMING AND RAM FIXES
- Fixed programming task behavior and RAM-related requirements.

v1.15.0 — PROGRAMMING, COMPATIBILITY, AND MOBILE CATALOG
- Added the programming earning mode and expanded compatibility checks.
- Improved catalog usability on mobile screens.

v1.14.4 — EXPANDED COMPATIBILITY AND SSD SUPPORT
- Expanded hardware compatibility rules and improved SSD handling.

v1.14.3 — OS EXPANSION AND MOBILE MINI-GAMES
- Added more operating systems and improved mini-game support on mobile devices.

v1.14.2 — WINDOWS XP/VISTA AND AI TRAINING FIX
- Added Windows XP and Windows Vista.
- Fixed the AI training flow and related requirements.

v1.14.1 — OPERATING SYSTEMS, COUPONS, AND HDD
- Expanded operating-system choices and coupon behavior.
- Improved HDD-related rules and compatibility.

v1.14.0 — EXTRA COUPON, COUPON GIVEAWAY, AND BALANCE
- Added EXTRA COUPON mechanics and the coupon giveaway event.
- Improved balance and payout handling.

v1.13.3 — BUG FIXES
- Fixed several gameplay and interface issues.

v1.13.2 — HOLY BOTTLENECK
- Added the Holy Bottleneck achievement and its special build requirement.

v1.13.1 — HDD FIX AND HOLY BOTTLENECK
- Fixed HDD behavior and refined the Holy Bottleneck achievement.

v1.13.0 — OS, MODE REQUIREMENTS, AND HOLY BOTTLENECK
- Added more OS behavior and mode-specific requirements.
- Introduced the Holy Bottleneck achievement path.

v1.12.0 — OPERATING SYSTEM AS A FULL COMPONENT
- Made the operating system a full PC component that can be purchased, installed, sold, and counted toward PC power.`;

function getLocalizedUpdateLog(){ return isEnglish() ? UPDATE_LOG_EN : UPDATE_LOG; }
function updateLanguageButtons(){
  const en=$('languageEnglishBtn'),ru=$('languageRussianBtn');
  en?.classList.toggle('active',currentLanguage()==='en'); ru?.classList.toggle('active',currentLanguage()==='ru');
}
function setLanguage(lang){
  const next=lang==='ru'?'ru':'en';
  if(next===currentLanguage()){updateLanguageButtons();return;}
  localStorage.setItem(LANGUAGE_KEY,next);
  location.reload();
}
function showLanguagePrompt(){
  if(localStorage.getItem(LANGUAGE_PROMPT_KEY)) return;
  const modal=$('languagePrompt'); if(!modal) return;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeLanguagePrompt(){
  const modal=$('languagePrompt'); if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');}
  localStorage.setItem(LANGUAGE_PROMPT_KEY,'1');
}
function initLocalization(){
  document.documentElement.lang=currentLanguage();
  updateBootLoadingText();
  if(isEnglish()){
    document.title='PC Builder — v2.0.2';
    const observer=new MutationObserver((records)=>{for(const record of records){if(record.type==='characterData'){if(shouldSkipLocalizationNode(record.target))continue;const t=translateRuText(record.target.nodeValue);if(t!==record.target.nodeValue)record.target.nodeValue=t;} else record.addedNodes.forEach(node=>{if(shouldSkipLocalizationNode(node))return;if(node.nodeType===Node.TEXT_NODE){const t=translateRuText(node.nodeValue);if(t!==node.nodeValue)node.nodeValue=t;}else if(node.nodeType===Node.ELEMENT_NODE)localizeNode(node);});}});
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    window.__pcBuilderI18nObserver=observer;
    localizeNode(document);
  }
  updateLanguageButtons();
}
initLocalization();

const UPDATE_LOG = `v2.0.2 — ИДЕАЛЬНЫЕ СБОРКИ И ПЕРЕРАСЧЁТ ЭКЗАМЕНА

- Переработан расчёт экзамена: теперь три специально сбалансированные конфигурации могут получить 100/100 вместо искусственного потолка прошлого варианта.
- Баланс CPU/GPU сравнивает классы производительности, а не несопоставимые сырые показатели разных комплектующих. Разница в один класс считается нормальной, более крупный перекос штрафуется.
- Критерии бюджета и производительности теперь лучше награждают сильные, но разумно собранные ПК без обязательной покупки самых дорогих деталей.
- Современные платформы AM5 и LGA1851 с хорошим запасом расширения могут получить 20/20 за будущие апгрейды.

v2.0.1 — ИСПРАВЛЕНИЕ ЭКЗАМЕНА И ЛОКАЛИЗАЦИИ\n\n- Исправлены смешанные русско-английские фразы в результатах экзамена.\n- Техническая совместимость теперь отделена от баланса CPU/GPU: 20/20 по совместимости означает отсутствие реальных технических проблем, а перекос CPU/GPU учитывается в балансе.\n- Переработан расчёт баланса сборки: производительность разных типов комплектующих больше не сравнивается напрямую по несопоставимым шкалам.\n- Улучшено определение классов комплектующих: например, Ryzen 7 5800X3D и GeForce RTX 4080 SUPER больше не получают искусственно слишком низкие классы.\n- Улучшен расчёт будущей модернизации: старые платформы вроде AM4 больше не получают автоматически 20/20.\n- Исправлен регистр и формулировки динамических сообщений экзамена.\n\nv2.0.0 — НОВОЕ ДОСТИЖЕНИЕ DILIGENT STUDENT И ПОЛНАЯ ЛОКАЛИЗАЦИЯ

- Добавлено новое достижение Diligent Student. Выполни экзамен на 95 или больше баллов, чтобы его разблокировать.
- Достижение выдаётся только после фактического завершения экзамена с результатом 95–100, а не просто за наличие мощной сборки.
- Завершена и вычищена полная английская локализация сайта: интерфейс, динамические сообщения, мини-игры, энциклопедия, достижения, совместимость, обучение, разбор экзамена, сохранения, настройки и системные уведомления.
- Исправлены смешанные русско-английские фразы, неправильный регистр, неестественные формулировки и ошибки форматирования в динамическом тексте.
- Код программирования, имена функций, эталонный код и введённый игроком код никогда не передаются через переводчик и сохраняются без изменений.
- Доработаны английские версии сообщений экзамена и мини-игр.
- Английский язык используется по умолчанию для новых игроков, а русский можно выбрать через стартовую подсказку или Настройки.

v1.17.10 — ПОЛНАЯ ЛОКАЛИЗАЦИЯ И АНГЛИЙСКИЙ ЯЗЫК ПО УМОЛЧАНИЮ

- Улучшено отображение английского интерфейса: исправлены смешанные русско-английские фразы, неестественные формулировки и регистр текста в динамических сообщениях.
- Добавлен отдельный экран загрузки, который блокирует нажатия во время инициализации сайта и исчезает после полной подготовки интерфейса.
- Улучшена локализация мини-игр, энциклопедии, достижений, сохранений, каталога, проверки совместимости и обучения.
- Исправлены динамические сообщения экзамена и разбора ошибок: предложения теперь полностью на английском языке и не смешивают языки внутри одной фразы.
- Обновлён текст языковой подсказки: она предлагает русскоязычному игроку переключиться на русский, сохраняя English как язык по умолчанию.

- Добавлена полноценная английская локализация интерфейса PC Builder: меню, режимы, магазин, заработок, мини-игры, AFK, обучение ИИ, программирование, достижения, настройки, сохранения, диагностика, экзамен, подсказки, события и сообщения об ошибках.
- Английский язык теперь используется по умолчанию при первом запуске сайта.
- Добавлена стартовая языковая плашка на русском языке, которая предлагает русскоязычному игроку переключиться на русский до начала игры.
- Выбранный язык сохраняется отдельно от прохождения и может быть изменён в настройках в любой момент.
- При переключении языка страница перезагружается и полностью применяет выбранную локализацию, включая динамические сообщения, модальные окна и Update Log.
- Русская версия сохранена без изменений по содержанию, поэтому переключение между языками не меняет игровую механику.

v1.17.8 — ФИКС СТАРТОВОГО ЛАЙТА, ОШИБКИ КЛИКЕРА И РЕМОНТА
- Лайт теперь стартует с отдельной фиксированной начальной сборки. Новая игра в Лайте всегда создаёт чистый набор стартовых комплектующих и больше не может унаследовать RTX 5090 или другие детали из предыдущего прохождения.
- Исправлена ошибка \`lightClickerReward is not defined\`: интерфейс теперь использует существующую функцию расчёта награды за клик, поэтому Лайт нормально запускается и показывает сумму выплаты.
- Стартовая выплата Лайт-кликера остаётся $10 и продолжает зависеть от множителя ПК.
- Цены на материнские платы каталога увеличены на 50%. Стартовые платы режимов не затронуты.
- В окне поломки детали больше нет кнопки «Понятно»: после ремонта/замены окно закрывается по соответствующему действию, а лишняя кнопка не мешает ремонту.

v1.17.7 — НОВАЯ ИГРА, СИНХРОНИЗАЦИЯ ВКЛАДОК И ТЕСТОВАЯ КОМАНДА

- Исправлена новая игра: после старта всегда активны именно «🎮 Мини-игры». Ранее функция интерфейса Лайт могла повторно раскрыть все разделы заработка в обычных режимах, из-за чего мини-игры были видны вместе с AFK, ИИ и программированием.
- Все разделы заработка теперь синхронизируются с выбранной вкладкой: в новом прохождении открывается только мини-игровой раздел, а переключение вкладок вручную работает как раньше.
- Анимация движущегося градиента внутри карточек режимов ускорена: полный цикл теперь занимает 2 секунды вместо 6,8 секунды.
- Для быстрого тестирования добавлена консольная команда pcMoney(amount): она добавляет указанную сумму к текущему балансу, сохраняет прохождение и сразу обновляет интерфейс. Пример: pcMoney(1000000).

v1.17.6 — ЦЕНЫ БП, КОМПЕНСАЦИЯ И ДВИЖУЩИЙСЯ ГРАДИЕНТ

- Для Хардкора цены сертифицированных БП повышены примерно в 3 раза. Например, 750 W теперь стоит $2700 со Стандартом, $3150 с Bronze, $3600 с Silver и $4200 с Gold.
- Сертификаты теперь дают реальную компенсацию при поломке БП: Bronze возвращает 25% цены, Silver — 50%, Gold — 80%. У Стандарта компенсации нет.
- Компенсация начисляется автоматически при любой поломке сертифицированного хардкорного БП — неважно, произошло это из-за пожара, AFK-испытания или другой механики.
- После новой игры вкладка заработка всегда синхронизируется с мини-играми, поэтому при создании нового прохождения больше не остаётся визуально выбранный AFK/AI/программирование при открытых мини-играх.
- Карточки режимов получили дополнительную плавную анимацию движущегося градиента внутри самой карточки. Она отключается вместе с общей настройкой анимаций интерфейса.

v1.17.5 — ХАРДКОРНЫЕ БП, СЕРТИФИКАТЫ И АНИМАЦИЯ КАРТОЧЕК

- В Хардкоре каталог блоков питания теперь показывает только мощность в ваттах: сертификаты больше не занимают отдельные ветки каталога.
- При покупке любого БП в Хардкоре появляется отдельная модалка выбора сертификата: Стандарт, 80+ Bronze, 80+ Silver или 80+ Gold.
- Для сертификатов введены отдельные цены; ориентир для 750 W — от $900 за стандарт до $1400 за Gold. Остальные мощности масштабируются относительно мощности блока.
- Сертификат не меняет доступный объём мощности БП: 750 W остаётся 750 W независимо от выбранного класса.
- После покупки в инвентаре сохраняется конкретный выбранный сертификат, поэтому его можно установить, продать и увидеть в разборе экзамена.
- В обычных режимах старая система каталога БП и их цен сохранена; новые хардкорные варианты не появляются в обычном магазине.
- Карточки режимов получили более живую анимацию появления, плавный подъём при наведении и световой эффект. Анимации автоматически отключаются настройкой «Анимации интерфейса».

v1.17.4 — ВЫБОР ОБУЧЕНИЯ, ВЫХОД ПОСЛЕ ЭКЗАМЕНА И ЦВЕТНЫЕ КАРТОЧКИ

- При выборе карточки Лайт теперь появляется отдельная модалка с вопросом о новом обучении. Галочка по умолчанию снята: обычный Лайт запускается без обучения.
- Если игрок ставит галочку, обучение включается только для этого прохождения Лайт и продолжается после перезагрузки.
- Стартовое обучение первого посещения по-прежнему запускается автоматически и не зависит от галочки в обычном выборе режима.
- После завершения экзамена игровое окно скрывается. Игрок получает выбор: сохранить прохождение или отказаться от сохранения.
- При выборе «Сохранить» открывается обычная модалка с тремя ячейками сохранений. После успешного сохранения прохождение завершается и открывается главное меню.
- При выборе «Не сохранять» текущее прохождение удаляется из активного автосохранения и открывается главное меню.
- Карточки режимов получили отдельные визуальные градиенты: Лёгкий — зелёный, Сложный — оранжевый, Хардкор — красный, Лайт — голубой с простым декоративным фоном.

v1.17.3 — РАЗБОР ОШИБОК, СТАРТОВОЕ ОБУЧЕНИЕ И ЛАЙТ-РЕЖИМ

- После экзамена с результатом 60–89/100 игроку предлагают разобрать ошибки. Можно согласиться и получить подробный разбор или отказаться кнопкой «Откажусь пожалуй».
- Если экзамен провален (меньше 60/100), разбор ошибок открывается автоматически в любом случае. После ознакомления игрок возвращается в своё прохождение и может исправить сборку и пройти экзамен снова.
- Новый разбор анализирует именно текущие детали игрока: перекос CPU/GPU, класс компонентов, качество БП, RAM, накопитель, материнскую плату, корпус, ценность дорогих покупок и возможности будущего апгрейда.
- В объяснениях используются конкретные названия установленных деталей. Например, связка уровня «AMD Ryzen 9 7900X + Radeon RX 7700 XT» прямо объясняет, что Ryzen 9 7900X относится к топовому процессору, тогда как RX 7700 XT — к среднему уровню, поэтому видеокарта не даёт такому CPU раскрыть весь потенциал в этой связке.
- Отдельно проверяется блок питания: стандартный БП считается заметным слабым местом, а Bronze для очень мощной сборки тоже может стать причиной потери баллов по качеству и балансу.
- Разбор открывается в отдельной прокручиваемой модалке, чтобы можно было увидеть весь список замечаний, даже если их много.
- Специальное обучение существует только в стартовом первом посещении сайта. При выборе Лайт в обычном меню новое обучение больше не запускается, но сам Лайт сохраняет экзамен как обычную игровую механику.
- Обычный Лайт из меню режима ведёт себя как самостоятельный игровой режим: доступна кнопка «Сбросить» внутри игры. Кнопка сброса больше не показывается на карточке выбора режима.
- Обновлено поведение восстановления: после перезагрузки активное прохождение остаётся активным и открывается обратно как обычная игра.

v1.17.2 — ЭКЗАМЕН ОТ 250 МОЩНОСТИ, МНОЖИТЕЛЬ КЛИКА И ЛАЙТ-МЕНЮ

- Порог появления кнопки «Экзамен» снижен с 400 до 250 мощности. Сборка при этом всё равно должна быть полностью совместимой.
- Запуск экзамена также проверяет новый порог в 250 мощности.
- В Лайт-режиме базовая выплата за один клик составляет $10 при множителе ПК ×1.00. Множитель ПК напрямую увеличивает выплату за клик.
- Кнопка кликера показывает текущую сумму выплаты, рассчитанную по множителю ПК.
- В специальном стартовом обучении кнопка «Сбросить» скрыта, чтобы новичок случайно не потерял учебное прохождение; в обычном Лайт-режиме кнопка «Сбросить» доступна, как и в остальных режимах.
- В меню выбора режима появился Лайт по центру второй строки, сразу под «Сложным». Выбор Лайта запускает обычное прохождение; стартовое обучение запускается только автоматически при первом посещении сайта.
- Кнопка «Сбросить» доступна внутри активного Лайт-прохождения, как и в остальных режимах; в карточке выбора режима отдельной кнопки сброса нет.
- После перезагрузки сайта сохранённое активное прохождение автоматически открывается обратно в игре.
- Стартовые 8 ГБ оперативной памяти теперь подписаны как «8 GB DDR3».
- Счётчик кликов Лайт-кликера сохраняется вместе с прохождением.

v1.17.1 — ОБУЧЕНИЕ, ЛАЙТ-РЕЖИМ, ЭКЗАМЕН И ПРАВКИ

- Панель Лайт-режима и встроенный кликер получили исправления отображения.
- Контекстные окна обучения показываются дольше и не закрываются, пока курсор находится над ними.
- Стартовые окна обучения получили лёгкое затемнение фона.

v1.17.0 — БОЛЬШОЕ ОБУЧЕНИЕ, ЛАЙТ-РЕЖИМ И ЭКЗАМЕН

- Добавлено отдельное полноценное обучение для первого запуска сайта: при первом посещении PC Builder сначала знакомит игрока с проектом, объясняет его назначение и постепенно вводит в основные механики вместо того, чтобы сразу бросать новичка в сложный интерфейс.
- Первичное обучение не заменяет существующее обучение из главного меню: старое обучение сохранено отдельно и по кнопке «🎓 Обучение» продолжает открываться в привычном виде.
- После вводной части первое обучение автоматически переводит игрока в специальный Лайт-режим, созданный именно для знакомства с компьютерами и базовой сборкой без лишней игровой экономики.
- Лайт-режим построен на основе лёгкого старта, но из него убраны наценки каталога, чёрный рынок, купоны, операционная система, события рынка, SOLD OUT, рероллы и все обычные способы заработка.
- В Лайте отключены мини-игры, AFK, обучение ИИ и программирование; остаётся только максимально простой кликер с заработком денег, чтобы новичок мог спокойно покупать комплектующие и учиться собирать ПК без давления игровой экономики.
- Обучение теперь объясняет комплектующие развёрнуто и простым языком: процессор, видеокарта, RAM, накопитель, блок питания, материнская плата, охлаждение и корпус получают понятные объяснения того, зачем они нужны и что именно влияет на совместимость и возможности ПК.
- После основных объяснений обучение не остаётся постоянно открытым поверх игры: игрок получает свободу действий, а подсказки появляются уже по ситуации — когда он устанавливает новые детали, сталкивается с несовместимостью или делает удачный шаг в развитии сборки.
- Контекстные подсказки должны не просто сообщать об ошибке, а объяснять причину человеческим языком: что именно не подходит, почему возник конфликт и какое действие поможет исправить сборку. При удачных действиях обучение также может похвалить игрока и объяснить, почему решение было полезным.
- Когда мощность ПК достигает 250+ и сборка остаётся полностью рабочей и совместимой, рядом с множителем мощности появляется красная кнопка «Экзамен»; в обычном Лайте экзамен также доступен как игровая механика. Обучение отдельно объясняет назначение экзамена и рекомендует сначала улучшить сборку, потому что экзамен оценивает не количество дорогих деталей, а качество всей проделанной работы.
- Перед запуском экзамена появляется отдельное предупреждение с подтверждением. После согласия сайт начинает визуально собирать данные текущего ПК, чтобы игрок видел, как его собственная конфигурация превращается в итоговый разбор.
- Каждый из 8 компонентов постепенно раскрывается сверху вниз. Перед показом настоящей детали несколько секунд быстро перебираются названия комплектующих той же категории, после чего выбранная игроком деталь фиксируется крупным жирным текстом с анимацией.
- После сбора всех восьми компонентов экзамен делает небольшую паузу и постепенно начинает выдавать разбор сборки, причём сначала всегда показываются сильные стороны, а уже после них — проблемы и возможные недостатки.
- В экзамене используются 5 критериев: идеальная совместимость компонентов, баланс сборки, разумность траты бюджета, производительность и возможности апгрейда на будущее. Каждый критерий оценивается максимум в 20 баллов, а общий результат составляет от 0 до 100.
- Плюсы и минусы по каждому критерию выводятся постепенно. Плюсы подсвечиваются зелёным, минусы — красным, чтобы игрок сразу видел, за что его сборка получила баллы и где именно потеряла их.
- Идея критерия совместимости — оценивать не только формальное совпадение разъёмов, но и разумность связки компонентов. Например, хорошо подобранные процессор и видеокарта дают более сильный результат, чем случайное сочетание деталей разных уровней.
- Баланс оценивает целостность ПК: сборка не должна состоять из дорогих флагманов при заведомо слабом остатке системы вроде слишком маленького или медленного накопителя.
- Трата бюджета учитывает, насколько разумно игрок потратил деньги: максимально дорогая сборка не автоматически получает максимум, если почти такую же задачу можно решить заметно дешевле с небольшим снижением производительности.
- Производительность оценивает связку компонентов целиком и может указывать на ситуации, когда деньги были вложены не туда — например, когда очень мощный процессор сочетается со значительно более слабой видеокартой.
- Апгрейд на будущее смотрит на запас развития платформы: более современный чипсет, дополнительные слоты памяти и другие возможности расширения могут дать дополнительные баллы.
- При результате ниже 60/100 экзамен считается непройденным. После кнопки «Далее» игрок возвращается в своё прохождение, а обучение объясняет, что именно стоит улучшить и предлагает собрать более сбалансированный ПК.
- При результате 60/100 и выше экзамен считается успешно пройденным. После «Далее» прохождение завершается, а обучение поздравляет игрока и сообщает, что базовая часть обучения окончена и теперь он свободен развивать ПК и пользоваться остальными возможностями проекта самостоятельно.
- Время тушения пожара теперь зависит от режима: в Лёгком режиме остаются прежние 10 секунд, в Сложном на тушение даётся 9 секунд, а в Хардкоре — 8 секунд.
- Система пожара продолжает работать с установленными комплектующими: загоревшаяся деталь является основной целью, а при провале дополнительно повреждаются ещё две случайные установленные рабочие детали, если они существуют.
- Версия игры и страницы обновлена до v1.17.0.

v1.16.1 — ЧЁРНЫЙ РЫНОК, ПОЛИЦИЯ И КАТАЛОГ

- Исправлена Чёрная пятница: скидка теперь считается от базовой цены, поэтому товар с отрицательным процентом не может стоить выше базы из-за случайной рыночной наценки.
- Кнопка «Чёрный рынок» перенесена слева от «Открыть каталог», а внутри чёрного рынка убрана отдельная кнопка перехода в обычный каталог.
- Добавлено предупреждение перед продажей детали с чёрного рынка и шанс 20% получить необратимый штраф полиции $10 000. При отрицательном балансе покупки блокируются, а выплаты получают штраф −10%.
- Добавлены линейка NVIDIA GT из 5 видеокарт и дополнительные GTX; бюджетная видеокарта лёгкого режима синхронизирована с GeForce GT 1030, а стартовый процессор — с Intel Core i3-10100.
- Задания программирования сложности 2/3/4 теперь содержат соответственно 4/5/6 строк кода.
- В инвентаре источник детали подсвечивается: Каталог — зелёным, Чёрный рынок — чёрным.
- Исправлено раскрытие Go beyond...; завершённые достижения всегда показывают 100% и перемещаются вниз списка, незавершённые — наверх.

v1.16.0 — ЧЁРНЫЙ РЫНОК И ПОЖАРЫ

- Исправлена подсветка Python-кода: HTML-разметка больше не попадает внутрь текста задания.
- Добавлен чёрный рынок: шанс 25% на каждом реролле, цены около 50% от базы с наценкой от -20% до +20%, SOLD OUT только 10%.
- Детали из чёрного рынка хранятся отдельно: можно одновременно иметь одинаковую деталь из обычного каталога и чёрного рынка.
- Детали чёрного рынка могут загореться во время заработка: 0.5% AFK, 2% мини-игры, 1% программирование, 2% обучение ИИ.
- При пожаре нужно закрыть 10–15 окон за 10 секунд; при провале повреждаются 3 детали.
- Добавлены источники деталей в инвентаре и отдельная цена продажи чёрного рынка по обычной каталоговой цене.
- Добавлены достижения Pirate и Go beyond...; Go beyond... скрыта под ачивкой I'll end this, for the order empire!

v1.15.7 — ФИКС ПРОГРАММИРОВАНИЯ И ЛИШНЕГО ПРОИЗВОДСТВА

- Программирование теперь полностью блокируется при невалидной сборке ПК; сначала нужно исправить обязательные компоненты и совместимость.
- Награда за программирование зависит от сложности: 1 → $50, 2 → $75, 3 → $100, 4 → $125, после чего применяются множитель мощности ПК и бонус macOS +50%.
- В событии «Лишнее производство» цена каждой детали выбранной категории считается от её базовой цены, поэтому скидка действительно всегда снижает цену ниже базы.

v1.15.6 — НАГРАДА ПРОГРАММИРОВАНИЯ И БОНУСЫ ПК

- Награда за одну успешно выполненную функцию программирования начинается с $50.
- В расчёте награды программирования снова учитываются множитель мощности ПК и +50% за macOS.
- Предыдущие исправления v1.15.5 сохранены.

v1.15.5 — ФИКС СТАРТОВОГО CPU И РЕКОМЕНДАЦИЙ СОВМЕСТИМОСТИ
- Сложный режим снова начинается с Intel Pentium J2900 из каталога.
- Старые ID стартового J2900 автоматически мигрируют в единый каталоговый ID.
- Исправлена рекомендация при несовместимом CPU/материнской плате: уже установленная деталь больше не предлагается как решение.
- При физическом конфликте сначала ищется совместимая материнская плата под текущий CPU, а затем CPU под текущую плату.
- Награда за успешное выполнение одной функции в программировании — $50.
- Версия страницы и игры обновлена до v1.15.5.

v1.15.4 — ФИКС ПРОГРАММИРОВАНИЯ И ОРИЕНТИРА
- Проверка программирования принимает только точное совпадение с ориентиром: лишние или пропущенные пробелы, символы и строки не допускаются.
- Ориентир программирования показывает готовый принимаемый код без ___, только на активной строке ввода, и скрывается после выхода из поля.
- Убрано перекрытие текста-подсказки и ориентира.
- Версия страницы и игры обновлена до v1.15.4.

v1.15.3 — АДАПТАЦИЯ ПРОГРАММИРОВАНИЯ И МОБИЛЬНОГО ИНТЕРФЕЙСА
- Исправлен текст состояния перед вводом: до фокуса поля показывается «Нажми на поле ввода…».
- Ориентир показывается только после выбора поля ввода и не смешивается с текстом инструкции.
- Бонусы Ryzen +100% и Windows 10/11 +50% в мини-играх корректно переносятся внутри окна награды.
- Интерфейс программирования и блок награды мини-игр дополнительно адаптированы для телефонов.

v1.15.2 — ФИКС ПРОГРАММИРОВАНИЯ И ОРИЕНТИРА
- Для программирования теперь подходит минимум 4 ГБ RAM любого поколения DDR3/DDR4/DDR5; требование больше не привязано только к DDR3.
- Убран отдельный верхний блок с ориентиром: шаблон находится непосредственно под полупрозрачным полем ввода.
- Исправлена проверка программирования: код сверяется с принимаемым решением без рассинхронизации шаблона и проверки.
- Исправлен интерфейс ориентира: подсказка показывается только на активной строке ввода и скрывается после выхода из поля.
- До фокуса поля отображается «Нажми на поле ввода…».

v1.15.1 — ФИКС ПРОГРАММИРОВАНИЯ И RAM
- Для программирования подходит минимум 4 ГБ RAM любого поколения DDR3/DDR4/DDR5; требование больше не привязано только к DDR3.
- Ориентир программирования перенесён непосредственно под полупрозрачный редактор, чтобы код можно было писать поверх шаблона.
- Исправлена проверка программирования и интерфейс редактора.

v1.15.0 — ПРОГРАММИРОВАНИЕ, СОВМЕСТИМОСТЬ И МОБИЛЬНЫЙ КАТАЛОГ
- Исправлена проверка стартового кулера: штатное охлаждение теперь имеет лимит 65 W; Xeon E-2388G явно использует 95 W.
- Intel Pentium J2900 сложного режима синхронизирован с каталогом, как единый предмет.
- Стартовые 4 ГБ RAM сложного режима синхронизированы с каталоговыми 4 GB DDR3.
- Начальные материнские платы получили модели MSI PRO 1200-D3 и GIGABYTE H1200-D3.
- Добавлен способ заработка «Программирование»: минимум уровня Pentium J2900 и 4 ГБ DDR3; задачи на JavaScript, HTML, Python, C++ и Java.
- Задачи программирования используют готовый подсвеченный шаблон и выдают деньги только после полного успешного выполнения.
- macOS даёт +50% к программированию; Linux +50% к AFK; Windows 10/11 +50% к мини-играм.
- Исправлено горизонтальное переполнение каталога на мобильных экранах.

v1.14.4 — РАСШИРЕННАЯ СОВМЕСТИМОСТЬ И SSD
- Добавлена MSI PRO B760-P WIFI DDR4.
- В лёгком режиме каталог подсвечивает совместимость деталей: зелёный — полностью совместимо, оранжевый — совместимо не со всеми установленными компонентами, красный — несовместимо.
- При покупке частично совместимой детали появляется подтверждение с перечнем несовместимых компонентов.
- Windows 10 требует минимум 4 ГБ RAM, Windows 11 — минимум 8 ГБ; добавлены игровые требования RAM/накопителя для Linux и macOS.
- 2 TB PCIe 5.0 NVMe SSD теперь теряет скорость и мощность на старых материнских платах: до -95% на начальной хардкорной плате, -10% на PCIe 4.0 и -50% на более старых поколениях.

v1.14.3 — РАСШИРЕНИЕ ОС И МОБИЛЬНЫЕ МИНИ-ИГРЫ
- В каталог Linux добавлены Debian, Fedora, Arch Linux и openSUSE.
- В каталог Apple добавлены macOS 10.14 Mojave, macOS 10.15 Catalina, macOS 11 Big Sur, macOS 12 Monterey, macOS 13 Ventura и macOS 14 Sonoma.
- В хардкорном каталоге Linux и Apple сохраняют упрощённую структуру: после производителя сразу открывается список всех доступных версий.
- Все мини-игры, использующие движение, кнопки или действие на canvas, получили сенсорные элементы управления для телефонов. Клавиатура и управление мышью на ПК сохранены.
- Для игр с направлением добавлены экранные стрелки, для Pong/Breakout/Racer — управление движением, для Flappy/Pixel Runner — сенсорная кнопка действия, для Asteroids/Space Shooter — отдельная кнопка огня.
- Улучшена адаптация canvas-игр к узким экранам.

v1.14.2 — WINDOWS XP, VISTA И ФИКС ОБУЧЕНИЯ ИИ
- Хардкор начинается с Windows XP вместо Windows 7 Lite.
- В хардкорном разделе ОС Microsoft сразу открывает все версии Windows от XP до 11, Linux — Linux Mint и Ubuntu, Apple — macOS.
- В каталог добавлены Windows XP и Windows Vista.
- Windows XP: 1 мощность, Windows Vista: 2 мощности.
- В «Обучении ИИ» блок «Требования выполнены» теперь показывает RAM, CPU и установленную ОС.

v1.14.1 — ОС, КУПОНЫ И HDD
- Мощность 120 ГБ HDD снижена с 5 до 2.
- При смене ОС появляется экран загрузки: 30 сек для HDD, 15 сек для обычного SSD и 10 сек для PCIe 5.0 SSD.
- Базовый шанс EXTRA COUPON снижен до 0.5% за выплату обычного AFK; во время «Раздачи купонов» — 1%.
- Получение обычного купона теперь сопровождается экранным эффектом и конфетти.
- При наличии обоих купонов появилась покупка с одновременным использованием EXTRA COUPON и скидочного купона.
- Добавлено достижение «Super Buy!».
- Возле «Мой ПК» отображаются имеющиеся купоны.

v1.14.0 — EXTRA COUPON, РАЗДАЧА КУПОНОВ И БАЛАНС
- Слишком ранняя реакция в «Реакции» приносит в 4 раза меньшую награду.
- «Process or Factory» требует 256 GB DDR5 и GIGABYTE Z790 AORUS MASTER X.
- Добавлен EXTRA COUPON для покупки SOLD OUT.
- EXTRA COUPON хранится максимум в одном экземпляре и совместим с обычным купоном.
- EXTRA COUPON выпадает в обычном AFK с шансом 1%; в разгоне не выпадает.
- Добавлено событие «Раздача купонов» с шансом 15%: 20% обычного купона и 2% EXTRA COUPON.
- Стартовые детали защищены от продажи.
- 120 ГБ HDD сложного режима объединён с каталоговой деталью без дубликата.

v1.13.3 — ИСПРАВЛЕНИЕ БАГОВ
- Исправлена награда «Реакции» после выхода из игры.
- Исправлена скорость стрельбы в «Space Shooter».
- Исправлена совместимость GIGABYTE Z790 AORUS MASTER X с 256 ГБ DDR5.
- Исправлена очистка клавиатурных обработчиков мини-игр.
- «Перенеси файл» в «Обучении ИИ» получил поддержку touch/pointer.

v1.13.2 — HOLY BOTTLENECK
- Holy Bottleneck переведён на относительную мощность категорий: 8 компонентов не менее 75% от максимума категории и 1 компонент не более 25%.
- Поэтому допускаются близкие к топу варианты вроде RTX 4090 вместо RTX 5090 или Windows 11 Home вместо Pro.

v1.13.1 — FIX HDD И HOLY BOTTLENECK
- HDD 64 ГБ несовместим с Windows 10, Windows 11 и macOS; для этих ОС нужен накопитель минимум 500 ГБ.
- Стартовый HDD хардкора объединён с каталоговым 64 ГБ HDD; старые сохранения мигрируются автоматически.
- Holy Bottleneck требует ровно 8 топовых компонентов и 1 действительно слабую деталь при рабочей сборке.

v1.13.0 — ОС, ТРЕБОВАНИЯ РЕЖИМОВ И HOLY BOTTLENECK
- ОС стала полноценным компонентом каталога и влияет на мощность ПК.
- macOS получила 20 мощности.
- Для обычного AFK и разгона нужна ОС не слабее Linux Mint.
- Для «Обучения ИИ» нужна ОС не слабее Windows 11 Home.
- Четыре максимальных достижения дополнительно требуют Windows 11 Pro или macOS.

v1.12.0 — ОПЕРАЦИОННАЯ СИСТЕМА КАК ПОЛНОЦЕННЫЙ КОМПОНЕНТ
- ОС стала обычной деталью каталога и влияет на общую мощность ПК.
- Добавлены Windows 7 Lite, Windows 7 Home, Windows 8.1 Home, Windows 10 Home/Pro, Windows 11 Home/Pro, Linux Mint, Ubuntu и macOS.
- ОС можно покупать, устанавливать, продавать и учитывать в полной коллекции каталога.
- Шанс события «Чёрная пятница» — 5%.
`;
function renderInfoModal() {
  const list = $('infoCategoryList');
  const content = $('infoCategoryContent');
  if (!list || !content) return;
  list.innerHTML = PART_INFO.map((item) => `<button class="info-part-tab ${infoCategory === item.category ? 'active' : ''}" data-info-category="${item.category}">${item.icon} ${item.title}</button>`).join('');
  const item = PART_INFO.find((entry) => entry.category === infoCategory) || PART_INFO[0];
  content.innerHTML = `<div class="info-part-head"><span class="info-part-icon">${item.icon}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></div><div class="info-details">${item.details.map((detail) => `<div class="info-detail">${detail}</div>`).join('')}</div>`;
  list.querySelectorAll('[data-info-category]').forEach((btn) => btn.addEventListener('click', () => { infoCategory = btn.dataset.infoCategory; renderInfoModal(); }));
}

function openInfo() { renderInfoModal(); openMenuModal('infoModal'); }

function getSettings() {
  let settings = { animations: true, theme: 'dark', blackMarketPoliceWarning: true };
  try { settings = { ...settings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')) }; } catch { /* ignore broken settings */ }
  settings.theme = settings.theme === 'light' ? 'light' : 'dark';
  return settings;
}
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('theme-light', isLight);
  document.documentElement.classList.toggle('theme-light', isLight);
  document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = isLight ? '#eef2f5' : '#101317';
}
function loadSettings() {
  const settings = getSettings();
  document.body.classList.toggle('no-animations', settings.animations === false);
  applyTheme(settings.theme);
  if ($('animationsToggle')) $('animationsToggle').checked = settings.animations !== false;
  if ($('themeLight')) $('themeLight').checked = settings.theme === 'light';
  if ($('themeDark')) $('themeDark').checked = settings.theme !== 'light';
  if ($('blackMarketPoliceWarningToggle')) $('blackMarketPoliceWarningToggle').checked = settings.blackMarketPoliceWarning !== false;
}
function saveSettings() {
  const animations = $('animationsToggle')?.checked !== false;
  const theme = document.querySelector('input[name="theme"]:checked')?.value === 'light' ? 'light' : 'dark';
  const blackMarketPoliceWarning = $('blackMarketPoliceWarningToggle')?.checked !== false;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ animations, theme, blackMarketPoliceWarning }));
  document.body.classList.toggle('no-animations', !animations);
  applyTheme(theme);
}

function snapshotTutorialState() {
  tutorialPreviewSnapshot = {
    state,
    savedRaw: localStorage.getItem(STORAGE_KEY)
  };
  tutorialPreviewActive = true;
}
function restoreTutorialState() {
  if (!tutorialPreviewSnapshot) return;
  state = tutorialPreviewSnapshot.state;
  if (tutorialPreviewSnapshot.savedRaw === null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, tutorialPreviewSnapshot.savedRaw);
  tutorialPreviewSnapshot = null;
  tutorialPreviewActive = false;
  closeGame();
  closeShop();
  if (state) render(); else showMainMenu();
}
function prepareTutorialScreen(screen) {
  closeShop();
  if (screen === 'menu') { showMainMenu(); return; }
  if (screen === 'mode') { closeGame(); showModeScreen(); return; }
  if (!state) start('easy'); else render();
  if (screen === 'games') { setEarnTab('games'); renderEarnTabs(); return; }
  if (screen === 'programming') { setEarnTab('programming'); return; }
  if (screen === 'afk') { setEarnTab('afk'); afkMode = 'normal'; document.querySelectorAll('[data-afk-mode]').forEach((b) => b.classList.toggle('active', b.dataset.afkMode === 'normal')); renderAfkPanel(); return; }
  if (screen === 'afk-overclock') { setEarnTab('afk'); afkMode = 'overclock'; document.querySelectorAll('[data-afk-mode]').forEach((b) => b.classList.toggle('active', b.dataset.afkMode === 'overclock')); stopAfk(); renderAfkPanel(); return; }
  if (screen === 'shop') openCatalog();
}
function positionTutorialGuide() {
  const step = TUTORIAL_STEPS[tutorialStep];
  const target = document.querySelector(step.target);
  const spotlight = $('tutorialSpotlight');
  const guide = $('tutorialGuide');
  if (!target || !spotlight || !guide) return;
  target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
  requestAnimationFrame(() => {
    const rect = target.getBoundingClientRect();
    const pad = 6;
    spotlight.style.display = 'block';
    spotlight.style.left = `${Math.max(6, rect.left - pad)}px`;
    spotlight.style.top = `${Math.max(6, rect.top - pad)}px`;
    spotlight.style.width = `${Math.min(window.innerWidth - 12, rect.width + pad * 2)}px`;
    spotlight.style.height = `${Math.min(window.innerHeight - 12, rect.height + pad * 2)}px`;
    const guideRect = guide.getBoundingClientRect();
    let left = rect.left + (rect.width - guideRect.width) / 2;
    left = Math.max(12, Math.min(window.innerWidth - guideRect.width - 12, left));
    const below = rect.bottom + 18;
    const above = rect.top - guideRect.height - 18;
    const top = below + guideRect.height <= window.innerHeight - 12 ? below : Math.max(12, above);
    guide.style.left = `${left}px`;
    guide.style.top = `${top}px`;
  });
}
function renderTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialStep];
  $('tutorialStepTitle').textContent = step.title;
  $('tutorialStepText').textContent = step.text;
  $('tutorialProgress').textContent = `${tutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
  $('tutorialPrev').disabled = tutorialStep === 0;
  $('tutorialNext').textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Завершить' : 'Далее';
  prepareTutorialScreen(step.screen);
  requestAnimationFrame(positionTutorialGuide);
}
function openTutorial() {
  if (!tutorialPreviewActive) snapshotTutorialState();
  tutorialStep = 0;
  openMenuModal('tutorialModal');
  renderTutorialStep();
}
function finishTutorial() {
  localStorage.setItem('pcBuilder_tutorial_seen', '1');
  $('tutorialSpotlight').style.display = 'none';
  closeMenuModal('tutorialModal');
}

function openMenuModal(id) {
  const modal = $(id);
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeMenuModal(id) {
  const modal = $(id);
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  if (id === 'achievementsModal') updateAchievementMenuButton();
  if (id === 'tutorialModal') {
    $('tutorialSpotlight').style.display = 'none';
    restoreTutorialState();
    localStorage.setItem('pcBuilder_tutorial_seen', '1');
  }
}
function closeAllMenuModals() {
  ['infoModal', 'settingsModal', 'achievementsModal', 'updateLogModal', 'tutorialModal'].forEach(closeMenuModal);
  closePurchaseCouponModal();
  closeCouponReceivedModal();
  closeHardcoreConfirm();
}


function openHardcoreConfirm() {
  const modal = $('hardcoreConfirmModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}
function closeHardcoreConfirm() {
  const modal = $('hardcoreConfirmModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}


/* ===== v1.17.4 FIRST-VISIT TRAINING / LIGHT CHOICE / EXAM EXIT ===== */
const FIRST_VISIT_KEY = 'pcBuilder_first_visit_17_seen';
const FIRST_VISIT_DONE_KEY = 'pcBuilder_first_visit_17_done';
const FIRST_VISIT_TRAINING_KEY = 'pcBuilder_first_visit_17_training';
let firstVisitIntroStep = 0;
let firstVisitTrainingActive = false;
let lightTrainingActive = false;
let pendingExamExitAfterSave = false;
let lightCoachTimer = null;
let lightCoachCooldownUntil = 0;
let lightCoachRemainingMs = 0;
let lightCoachHovering = false;
let lightCoachHideStartedAt = 0;
let lightClickerCount = 0;
let examState = null;
const EXAM_CATEGORIES = ['CPU','GPU','RAM','Storage','PSU','Motherboard','Cooling','Case'];
function hasPriorPcBuilderData(){if(localStorage.getItem(FIRST_VISIT_DONE_KEY))return true;if(localStorage.getItem(STORAGE_KEY))return true;for(let i=1;i<=3;i++)if(localStorage.getItem(`${SAVE_SLOT_PREFIX}${i}`))return true;return false;}
function showFirstVisitPanel(title,text,badge='PC BUILDER · ПЕРВЫЙ ЗАХОД'){const panel=$('firstVisitIntro');if(!panel)return;$('firstVisitBadge').textContent=badge;$('firstVisitTitle').textContent=title;$('firstVisitText').textContent=text;panel.classList.remove('hidden');panel.setAttribute('aria-hidden','false');}
function closeFirstVisitPanel(){const panel=$('firstVisitIntro');if(panel){panel.classList.add('hidden');panel.setAttribute('aria-hidden','true');}}
let firstVisitAutoTimer = null;
function startFirstVisitOnboarding(){
  if(localStorage.getItem(FIRST_VISIT_DONE_KEY))return;
  if(localStorage.getItem(FIRST_VISIT_TRAINING_KEY)&&state?.mode==='light'){
    firstVisitTrainingActive=true;
    lightTrainingActive=true;
    if(state) state.lightTrainingEnabled=true;
    firstVisitIntroStep=2;
    renderLightModeUI();
    lightCoachEvent('welcome','Продолжаем обучение.','После перезагрузки мы вернулись прямо в твоё учебное прохождение. Можешь продолжать собирать ПК с того места, где остановился.',12000,true);
    return;
  }
  if(hasPriorPcBuilderData())return;
  localStorage.setItem(FIRST_VISIT_KEY,'1');
  firstVisitIntroStep=0;
  showFirstVisitPanel('Привет. Я PC Builder.','Это симулятор сборки ПК. Здесь ты собираешь компьютер из отдельных комплектующих, проверяешь их совместимость, наблюдаешь за мощностью системы, покупаешь и устанавливаешь детали, а позже можешь перейти к более сложным игровым механикам. Я буду постепенно объяснять происходящее простыми словами, поэтому знания о компьютерах заранее не нужны.');
}
function advanceFirstVisitIntro(){if(firstVisitAutoTimer){clearTimeout(firstVisitAutoTimer);firstVisitAutoTimer=null;}if(firstVisitIntroStep===0){firstVisitIntroStep=1;showFirstVisitPanel('Что здесь вообще делают?','Компьютер — это не одна деталь, а система из нескольких частей. CPU выполняет расчёты, RAM временно держит данные для работающих программ, GPU занимается графикой, накопитель хранит файлы, PSU подаёт питание, материнская плата соединяет компоненты, охлаждение отводит тепло, а корпус размещает всё внутри. Главная задача сборки — не просто купить мощные детали, а подобрать такие, которые физически и технически подходят друг другу. Через несколько секунд я автоматически открою безопасный Лайт-режим и начну учить тебя на практике.', 'PC BUILDER · ПЕРЕД ПРАКТИКОЙ');firstVisitAutoTimer=setTimeout(()=>{if(firstVisitIntroStep===1){firstVisitIntroStep=2;closeFirstVisitPanel();beginLightTutorial();}},14000);return;}closeFirstVisitPanel();beginLightTutorial();}
function beginLightTutorial(){firstVisitTrainingActive=true;lightTrainingActive=true;localStorage.setItem(FIRST_VISIT_TRAINING_KEY,'1');start('light');state.lightTrainingEnabled=true;state.lightClickerCount=0;lightClickerCount=0;renderLightModeUI();lightCoachEvent('welcome','Начинаем с основы.','Это Лайт-режим — безопасная практика для новичка. Здесь нет рынка, наценок, купонов, событий, чёрного рынка, SOLD OUT, рероллов, операционной системы и мини-игр. Сначала нажми несколько раз на кликер, затем открой каталог и посмотри на комплектующие. Сумма за клик растёт вместе с множителем ПК.',15000,true);}
function openLightTrainingConfirm(){const modal=$('lightTrainingConfirmModal'),toggle=$('lightTrainingToggle');if(!modal)return;if(toggle)toggle.checked=false;modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');}
function closeLightTrainingConfirm(){const modal=$('lightTrainingConfirmModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');}}
function confirmLightTrainingStart(){const training=!!$('lightTrainingToggle')?.checked;closeLightTrainingConfirm();start('light');state.lightTrainingEnabled=training;lightTrainingActive=training;firstVisitTrainingActive=false;save();render();if(training)lightCoachEvent('welcome','Обучение включено.','В этом прохождении Лайт будет давать контекстные подсказки: объяснять детали, причины несовместимости и сильные решения сборки. Экзамен остаётся доступен.',15000,true);}

function renderLightModeUI(){const light=$('lightModeSection'),tabs=document.querySelector('.earn-tabs'),mini=$('miniGamesSection'),ai=$('aiSection'),programming=$('programmingSection'),afk=$('afkSection');if(!light||!tabs||!mini||!ai||!programming||!afk)return;const active=isLightMode();light.classList.toggle('hidden',!active);light.classList.toggle('active',active);tabs.classList.toggle('hidden',active);if(active){mini.classList.add('hidden');ai.classList.add('hidden');programming.classList.add('hidden');afk.classList.add('hidden');}const title=$('earnPanelTitle');if(title)title.textContent=active?((firstVisitTrainingActive||lightTrainingActive)?'🎓 Обучение':'🎮 Заработок'):'🎮 Заработок';const shopHint=document.querySelector('.shop-launch p');if(shopHint)shopHint.textContent=active?'В Лайте все обычные детали доступны постоянно по базовой цене.':'На хардкоре каталог становится многоуровневым: производитель → серия → детали.';if(active){lightClickerCount=Number(state.lightClickerCount)||0;const count=$('lightClickerCount');if(count)count.textContent=`Кликов: ${lightClickerCount}`;const btn=$('lightClickerBtn');if(btn)btn.textContent=`Получить $${formatMoney(lightClickReward())}`;}const resetBtn=$('resetBtn');if(resetBtn)resetBtn.classList.toggle('hidden',active&&firstVisitTrainingActive);const coach=$('lightCoach');if(coach&&(!active||(!firstVisitTrainingActive&&!lightTrainingActive)))coach.classList.remove('show');renderLightExamButton();}
function lightModeClick(){if(!isLightMode())return;const reward=lightClickReward();state.money+=reward;lightClickerCount=Number(state.lightClickerCount)||0;lightClickerCount+=1;state.lightClickerCount=lightClickerCount;save();const count=$('lightClickerCount');if(count)count.textContent=`Кликов: ${lightClickerCount}`;const btn=$('lightClickerBtn');if(btn)btn.textContent=`Получить $${formatMoney(lightClickReward())}`;$('money').textContent=formatMoney(state.money);if(lightClickerCount===1)lightCoachEvent('clicker','Деньги в Лайте.',`Кликер — единственный источник денег здесь. Сейчас один клик даёт $${formatMoney(reward)}, потому что множитель ПК составляет ×${pcMultiplier().toFixed(2)}. После улучшения ПК сумма за клик тоже вырастет.`,10000);}
function clearLightCoachTimer(){if(lightCoachTimer){clearTimeout(lightCoachTimer);lightCoachTimer=null;}lightCoachRemainingMs=0;lightCoachHideStartedAt=0;}
function scheduleLightCoachHide(ms=lightCoachRemainingMs){clearLightCoachTimer();lightCoachRemainingMs=Math.max(0,Number(ms)||0);if(!lightCoachRemainingMs||lightCoachHovering)return;lightCoachHideStartedAt=performance.now();lightCoachTimer=setTimeout(()=>{lightCoachTimer=null;lightCoachRemainingMs=0;lightCoachHideStartedAt=0;if(!lightCoachHovering)$('lightCoach')?.classList.remove('show');},lightCoachRemainingMs);}
function bindLightCoachHover(){const coach=$('lightCoach');if(!coach||coach.dataset.hoverBound==='1')return;coach.dataset.hoverBound='1';coach.addEventListener('mouseenter',()=>{lightCoachHovering=true;if(lightCoachTimer){const elapsed=performance.now()-lightCoachHideStartedAt;lightCoachRemainingMs=Math.max(0,lightCoachRemainingMs-elapsed);clearTimeout(lightCoachTimer);lightCoachTimer=null;}});coach.addEventListener('mouseleave',()=>{lightCoachHovering=false;scheduleLightCoachHide();});}
function lightCoachEvent(kind,title,text,duration=12000,force=false){if((!isLightMode()||(!firstVisitTrainingActive&&!lightTrainingActive))&&kind!=='finish')return;if(!force&&performance.now()<lightCoachCooldownUntil)return;const coach=$('lightCoach');if(!coach)return;bindLightCoachHover();const kindEl=$('lightCoachKind'),titleEl=$('lightCoachTitle'),textEl=$('lightCoachText');if(kindEl)kindEl.textContent=kind==='praise'?'✅ Хорошо':kind==='mistake'?'⚠ Подсказка':'🎓 Обучение';if(titleEl)titleEl.textContent=title;if(textEl)textEl.textContent=text;coach.classList.remove('show');requestAnimationFrame(()=>coach.classList.add('show'));scheduleLightCoachHide(duration);lightCoachCooldownUntil=performance.now()+Math.min(duration,6500);}
function lightComponentExplanation(item){if(!item)return '';const texts={CPU:'CPU — центральный процессор. Он выполняет команды и расчёты программ; в игре его мощность заметно влияет на общий уровень ПК.',GPU:'GPU — видеокарта. Она отвечает за большую часть графической работы и особенно важна для игр; отдельная видеокарта обычно даёт намного больше графической производительности, чем встроенная.',RAM:'RAM — оперативная память. Она временно хранит данные, которыми программа пользуется прямо сейчас. Её объём определяет, сколько данных система может держать в работе одновременно, а поколение DDR должно совпадать с поддержкой материнской платы.',Storage:'Накопитель хранит Windows, программы и файлы даже после выключения компьютера. HDD обычно медленнее SSD, а NVMe SSD подключается через PCIe и может быть значительно быстрее.',PSU:'PSU — блок питания. Он не делает ПК быстрее сам по себе, а обеспечивает компоненты электричеством; главное требование — достаточная мощность для всей системы, особенно для видеокарты.',Motherboard:'Материнская плата соединяет все компоненты. Её сокет определяет совместимые процессоры, поддержка памяти — подходящий тип RAM, а чипсет и количество слотов влияют на будущие апгрейды.',Cooling:'Охлаждение отводит тепло от процессора. Если кулер рассчитан хуже, чем требует CPU, система получает проблему совместимости даже тогда, когда остальные детали подходят друг другу.',Case:'Корпус физически размещает комплектующие и влияет на удобство и вентиляцию. В игре он не заменяет ни питание, ни охлаждение, но хороший корпус помогает системе нормально размещаться и охлаждаться.'};return texts[item.category]||'';}
function lightCoachAfterAction(action,item){if(!isLightMode()||( !firstVisitTrainingActive && !lightTrainingActive))return;const issues=checkCompatibility();if(issues.length){const first=issues[0];let detail=first.detail;if(first.title.includes('CPU')&&first.title.includes('материн'))detail+=` Сокет — это физический разъём процессора: если платформы разные, такой CPU и плата вместе работать не смогут.`;else if(first.title.includes('RAM'))detail+=` У оперативной памяти тоже есть поколение, например DDR4 или DDR5. Оно должно соответствовать тому, что поддерживает материнская плата.`;else if(first.title.includes('БП'))detail+=` Блок питания должен иметь достаточную мощность для видеокарты и остальной системы; число ватт в названии БП — доступный запас питания.`;else if(first.title.includes('Охлаждение'))detail+=` Охлаждение должно успевать отводить тепло от процессора, иначе система не сможет работать в заданном режиме.`;lightCoachEvent('mistake',`Нашлась проблема: ${first.title}.`,`${detail} Это не штраф. Лайт-режим специально позволяет ошибаться без последствий, чтобы ты понял причинно-следственную связь. Исправь одну из конфликтующих деталей и снова проверь сборку.`,16000,true);}else{const power=currentPower();const actionText=action==='purchase'?`Ты добавил ${item?.name||'новую деталь'} в инвентарь. Покупка сама по себе ещё не меняет установленную сборку: после покупки деталь нужно установить.`:action==='install'?`Ты установил ${item?.name||'новую деталь'}. Теперь она участвует в расчёте мощности и проверках совместимости. ${lightComponentExplanation(item)}`:'Система проверена после твоего действия.';lightCoachEvent('praise',power>=250?'Сборка работает и уже достаточно мощная.':'Сборка работает.',`${actionText} Все основные компоненты сейчас совместимы. Текущая мощность — ${power}. Не гонись только за самым большим числом: дальше тебе нужно научиться смотреть на баланс, разумную стоимость и возможность будущего апгрейда.`,13000,true);}renderLightExamButton();}
function renderLightExamButton(){const btn=$('examBtn');if(!btn)return;const available=isLightMode();btn.classList.toggle('hidden',!available);const compatible=available&&checkCompatibility().length===0;const unlocked=compatible&&currentPower()>=250&&!examState;btn.classList.toggle('ready',unlocked);btn.disabled=!unlocked;if(unlocked&&!btn.dataset.announced){btn.dataset.announced='1';if(firstVisitTrainingActive||lightTrainingActive)lightCoachEvent('exam','Экзамен доступен.','Мощность уже 250+ и сборка сейчас рабочая. Перед экзаменом рекомендую ещё раз посмотреть на баланс деталей: очень дорогая видеокарта рядом со слишком слабым процессором или крошечный накопитель могут испортить часть результата.',12000,true);}}
function openExamConfirm(){if(!isLightMode()||currentPower()<250||checkCompatibility().length)return;const modal=$('examModal'),content=$('examContent'),actions=$('examStartActions'),next=$('examNextWrap');if(!modal||!content||!actions||!next)return;examState={stage:'confirm',components:EXAM_CATEGORIES.map(c=>installedItem(c)),criteria:[],total:0,passed:false};content.innerHTML=`<div class="exam-intro"><h3>Действительно начать экзамен?</h3><div class="exam-warning"><b>Внимание:</b> после подтверждения текущая сборка будет зафиксирована для проверки. Изменять детали до окончания экзамена нельзя.</div><p>Система постепенно покажет все восемь компонентов, а затем оценит пять критериев. Каждый критерий даёт от 0 до 20 баллов, максимум — 100.</p></div>`;actions.classList.remove('hidden');next.classList.add('hidden');$('examAnalysisOfferActions')?.classList.add('hidden');modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');}
function closeExamModal(){const modal=$('examModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');} $('examStartActions')?.classList.add('hidden'); $('examNextWrap')?.classList.add('hidden'); $('examAnalysisOfferActions')?.classList.add('hidden'); examState=null;}
function positionExamUi(){}
function examRandomLabel(category,step=0){const items=SHOP.filter(i=>!i.starter&&!i.legacy&&i.category===category);return items.length?items[step%items.length].name:'Определение компонента…';}
function beginExamComponentReveal(){const content=$('examContent'),actions=$('examStartActions'),next=$('examNextWrap');if(!content||!actions||!next||!examState)return;actions.classList.add('hidden');next.classList.add('hidden');content.innerHTML=`<div class="exam-screen-stage"><div class="exam-stage-note">Сайт быстро проверяет состав твоего ПК…</div><div id="examComponents" class="exam-components"></div></div>`;const wrap=$('examComponents');const revealOne=index=>{if(index>=EXAM_CATEGORIES.length){setTimeout(beginExamCriteria,1500);return;}const category=EXAM_CATEGORIES[index],item=examState.components[index],slot=document.createElement('div');slot.className='exam-component-slot';slot.innerHTML=`<span class="num">${index+1}</span><span class="name">Определение…</span>`;wrap.appendChild(slot);const nameEl=slot.querySelector('.name'),started=performance.now(),duration=1250;let step=0;const timer=setInterval(()=>{if(performance.now()-started>=duration){clearInterval(timer);nameEl.textContent=item?.name||'Не установлено';slot.classList.add('selected','reveal');setTimeout(()=>revealOne(index+1),180);return;}nameEl.textContent=examRandomLabel(category,step++);},55);};revealOne(0);}
function examTier(item){
  if(!item)return 'не установлен';
  const n=examNormalizedPart(item,item.category);
  if(item.category==='CPU') return n>=0.68?'топ':n>=0.45?'высокий':n>=0.25?'средний':'начальный';
  if(item.category==='GPU') return n>=0.55?'топ':n>=0.45?'высокий':n>=0.22?'средний':'бюджетный';
  if(item.category==='RAM') return ramCapacityGb(item)>=64?'топ':ramCapacityGb(item)>=32?'высокий':ramCapacityGb(item)>=16?'средний':'начальный';
  if(item.category==='Storage') return storageType(item)==='NVMe' && storageCapacityGb(item)>=1000?'высокий':storageCapacityGb(item)>=500?'средний':'начальный';
  return n>=0.70?'топ':n>=0.40?'средний':'бюджетный';
}
function examBalanceLevel(item,category){
  if(!item)return 0;
  if(category==='CPU'||category==='GPU') return ({'бюджетный':1,'начальный':2,'средний':3,'высокий':4,'топ':5}[examTier(item)]||0);
  if(category==='RAM'){const gb=ramCapacityGb(item);return gb>=128?5:gb>=64?4:gb>=32?3:gb>=16?2:1;}
  if(category==='Storage'){const type=storageType(item),gb=storageCapacityGb(item);if(type==='NVMe'&&gb>=2000)return 5;if(type==='NVMe')return 4;if(type==='SSD')return 3;return gb>=1000?2:1;}
  if(category==='PSU'){if(/80\+ Gold/i.test(item.name)||item.series==='80+ Gold')return 5;if(/80\+ Silver/i.test(item.name)||item.series==='80+ Silver')return 4;if(/80\+ Bronze/i.test(item.name)||item.series==='80+ Bronze')return 3;return 1;}
  if(category==='Cooling'){if(/aio-4|AIO 420/i.test(item.id||item.name))return 5;if(/aio-|СЖО/i.test(item.id||item.name))return 4;if(/dual-tower|premium-air/i.test(item.id||item.name))return 4;if(/tower/i.test(item.id||item.name))return 3;if(/stock|starter/i.test(item.id||item.name))return 1;return 2;}
  if(category==='Case'){if(item.series==='Showcase'||/showcase/i.test(item.id||item.name))return 5;if(/dual-chamber/i.test(item.id||item.name)||item.series==='Dual-Chamber')return 4;if(/glass/i.test(item.id||item.name))return 3;if(item.series==='Basic'||/basic/i.test(item.id||item.name))return 2;return 3;}
  if(category==='Motherboard'){const p=partPlatform(item),name=String(item.name||'');if(p==='AM5'||p==='LGA1851')return 5;if(/x670|x870|z790|z890/i.test(item.id||name))return 5;if(/b650|b860|z690|b760|b660/i.test(item.id||name))return 4;if(/b550|b450/i.test(item.id||name))return 3;if(/a320|h410/i.test(item.id||name))return 2;return 3;}
  return 3;
}
function currentPowerSnapshotSafe(items){
  return EXAM_CATEGORIES.reduce((sum,c)=>sum+Number(effectiveItemPerformance(items[c])||0),0);
}
const EXAM_PERFECT_BUILD_PROFILES = [
  ['cpu-r7-7800x3d','gpu-rtx-4070s','ram-ddr5-32','storage-ssd-1tb-nvme','psu-850-gold','motherboard-mb-x870','cooling-cooler-aio-360','case-case-dual-chamber'],
  ['cpu-r9-7950x','gpu-rx-7900xt','ram-ddr5-32','storage-ssd-1tb-nvme','psu-850-gold','motherboard-mb-x870','cooling-cooler-aio-360','case-case-dual-chamber'],
  ['cpu-ultra7-265k','gpu-rtx-4080s','ram-ddr5-32','storage-ssd-1tb-nvme','psu-1000-gold','motherboard-mb-z890','cooling-cooler-aio-360','case-case-dual-chamber']
];
function isPerfectExamBuild(items){
  const ids=EXAM_CATEGORIES.map(c=>items[c]?.id||null);
  return EXAM_PERFECT_BUILD_PROFILES.some(profile=>profile.every((id,index)=>ids[index]===id));
}
function scoreExam(){
  const sourceComponents = examState?.components || EXAM_CATEGORIES.map(c => installedItem(c));
  const items = Object.fromEntries(EXAM_CATEGORIES.map((c,i) => [c,sourceComponents[i]]));
  const isPerfectBuild=isPerfectExamBuild(items);
  const perf = EXAM_CATEGORIES.map(c => Number(items[c]?.performance||0));
  const maxPerf = EXAM_CATEGORIES.map(c => Math.max(...SHOP.filter(i => !i.starter && !i.legacy && i.category===c).map(i => Number(i.performance||0)),1));
  const normalized = perf.map((v,i) => Math.max(.05,Math.min(1,v/maxPerf[i])));
  const cpuGpuGap = Math.abs(normalized[0]-normalized[1]);
  const technicalCompatible = checkCompatibility().length===0;
  const compatibility = technicalCompatible ? 20 : 0;

  // Balance uses component classes instead of comparing unrelated raw performance scales.
  // A one-class CPU/GPU gap is considered a normal pairing; only larger gaps are penalized.
  const balanceLevels = EXAM_CATEGORIES.map(category => examBalanceLevel(items[category],category)).filter(Boolean);
  const minLevel = balanceLevels.length ? Math.min(...balanceLevels) : 1;
  const maxLevel = balanceLevels.length ? Math.max(...balanceLevels) : 1;
  const levelSpread = Math.max(0,maxLevel-minLevel);
  const cpuLevel = examBalanceLevel(items.CPU,'CPU');
  const gpuLevel = examBalanceLevel(items.GPU,'GPU');
  const tierGap = Math.abs(cpuLevel-gpuLevel);
  let balance = 20;
  if (tierGap > 1) balance -= Math.min(10,(tierGap-1)*5);
  if (levelSpread > 2) balance -= Math.min(8,(levelSpread-2)*3);
  const cpuGpuMax=Math.max(normalized[0],normalized[1]);
  const ramGb=items.RAM?ramCapacityGb(items.RAM):0;
  const storage=items.Storage;
  const psu=items.PSU;
  const cooling=items.Cooling;
  const caseItem=items.Case;
  if(ramGb<32&&cpuGpuMax>=0.60) balance-=2;
  if(storage&&storageType(storage)==='HDD'&&cpuGpuMax>=0.60) balance-=2;
  if(psu&&psu.series==='Basic'&&cpuGpuMax>=0.60) balance-=3;
  else if(psu&&psu.series==='80+ Bronze'&&cpuGpuMax>=0.70) balance-=2;
  if(cooling&&cooling.series==='Stock'&&normalized[0]>=0.65) balance-=2;
  if(caseItem&&caseItem.series==='Basic'&&cpuGpuMax>=0.65) balance-=1;
  balance=Math.max(0,Math.min(20,Math.round(balance)));

  const totalCost=EXAM_CATEGORIES.reduce((sum,c)=>sum+Number(items[c]?.basePrice||0),0);
  let valueScore=0;
  EXAM_CATEGORIES.forEach((c)=>{
    const chosen=items[c];
    if(!chosen)return;
    const pool=SHOP.filter(x=>!x.starter&&!x.legacy&&x.category===c);
    const chosenPerf=Number(chosen.performance||0), chosenPrice=Math.max(1,Number(chosen.basePrice||1));
    const ratio=chosenPerf/chosenPrice;
    const bestRatio=pool.length?Math.max(...pool.map(x=>Number(x.performance||0)/Math.max(1,Number(x.basePrice||1)))):ratio;
    valueScore += Math.max(0,Math.min(1,ratio/Math.max(bestRatio,0.000001)));
  });
  const efficiencyRatio=valueScore/EXAM_CATEGORIES.length;
  const buildValueRatio=currentPowerSnapshotSafe(items)/Math.max(1,totalCost);
  let budget;
  if(isPerfectBuild) budget=20;
  else {
    const efficiencyScore=Math.round(20*Math.max(0,Math.min(1,(efficiencyRatio-0.72)/0.28)));
    const costFit=totalCost<=20000 ? 4 : Math.max(0,4-Math.ceil((totalCost-20000)/2500));
    const powerValue=Math.round(Math.max(0,Math.min(4,(buildValueRatio-0.014)/0.001)));
    budget=Math.max(0,Math.min(20,efficiencyScore+costFit+powerValue));
  }
  const currentPowerSnapshot=currentPowerSnapshotSafe(items);
  const performance=Math.max(0,Math.min(20,isPerfectBuild||currentPowerSnapshot>=340?20:Math.round(20*Math.min(1,currentPowerSnapshot/340))));

  // A modern, expandable DDR5 platform can reach the full upgradeability score.
  const mb=items.Motherboard,spec=motherboardSpec(mb),platform=partPlatform(mb);
  const modernPlatform=(platform==='AM5'||platform==='LGA1851');
  const hasExpansion=!!spec&&Number(spec.ramSlots||0)>=4&&Number(spec.maxRamGb||0)>=192&&motherboardPcieGeneration(mb)>=5;
  const upgrade=modernPlatform&&hasExpansion?20:Math.max(0,Math.min(20,Math.round(2+(platform==='AM5'||platform==='LGA1851'?6:platform==='LGA1700'?4:platform==='AM4'?2:1)+(spec?Math.min(4,Number(spec.ramSlots||0)):0)+(spec?Math.min(4,Number(spec.maxRamGb||0)/64):0)+(spec?Math.min(4,Math.max(0,motherboardPcieGeneration(mb)-2)):0))));

  const en=isEnglish();
  const criterionCopy={
    compatibility:{
      name: en ? 'Ideal Compatibility' : 'Идеальная совместимость',
      positive: en ? 'The components are physically and technically compatible with each other.' : 'Компоненты физически и технически подходят друг другу.',
      negative: en ? 'There is a physical or technical compatibility problem between the selected components.' : 'Есть физическая или техническая проблема совместимости между выбранными компонентами.'
    },
    balance:{
      name: en ? 'Build Balance' : 'Баланс сборки',
      positive: en ? 'The components are in roughly compatible performance classes and there is no obvious weak point.' : 'Компоненты находятся примерно в сопоставимых классах мощности и не оставляют очевидного слабого места.',
      negative: en ? 'Some components stand out noticeably from the overall level. A flagship part next to a much weaker component creates an imbalance.' : 'Некоторые детали заметно выбиваются из общего уровня. Флагманский компонент рядом с гораздо более слабой деталью создаёт дисбаланс.'
    },
    budget:{
      name: en ? 'Reasonable Budget Spending' : 'Разумная трата бюджета',
      positive: en ? `At base component prices, about $${formatMoney(totalCost)} was spent. The performance is reasonable for the price.` : `По базовым ценам на комплектующие потрачено около $${formatMoney(totalCost)}. Производительность относительно цены выглядит оправданной.`,
      negative: en ? `At base component prices, this build costs about $${formatMoney(totalCost)}. It includes expensive components for which noticeably cheaper alternatives at a similar performance level were available.` : `По базовым ценам сборка стоит около $${formatMoney(totalCost)}. В ней есть дорогие компоненты, для которых существовали заметно более дешёвые варианты близкого уровня.`
    },
    performance:{
      name: en ? 'Performance' : 'Производительность',
      positive: en ? `This working build provides about ${Math.round(currentPowerSnapshot)} PC power.` : `Рабочая сборка даёт около ${Math.round(currentPowerSnapshot)} мощности.`,
      negative: en ? `Power is about ${Math.round(currentPowerSnapshot)} — the system could be made faster without requiring the most expensive components.` : `Мощность около ${Math.round(currentPowerSnapshot)} — систему можно было сделать производительнее без обязательного перехода на самые дорогие детали.`
    },
    upgrade:{
      name: en ? 'Future Upgradeability' : 'Апгрейд на будущее',
      positive: en ? 'The motherboard and platform leave useful room for more memory and future component upgrades.' : 'Материнская плата и платформа оставляют полезный запас для увеличения памяти и будущего обновления компонентов.',
      negative: en ? 'The platform noticeably limits future upgrades through its generation, expansion options, or available headroom.' : 'Платформа заметно ограничивает будущие обновления своим поколением, возможностями расширения или доступным запасом.'
    }
  };
  return [
    {id:'compatibility',name:criterionCopy.compatibility.name,score:compatibility,positive:criterionCopy.compatibility.positive,negative:criterionCopy.compatibility.negative},
    {id:'balance',name:criterionCopy.balance.name,score:balance,positive:criterionCopy.balance.positive,negative:criterionCopy.balance.negative},
    {id:'budget',name:criterionCopy.budget.name,score:budget,positive:criterionCopy.budget.positive,negative:criterionCopy.budget.negative},
    {id:'performance',name:criterionCopy.performance.name,score:performance,positive:criterionCopy.performance.positive,negative:criterionCopy.performance.negative},
    {id:'upgrade',name:criterionCopy.upgrade.name,score:upgrade,positive:criterionCopy.upgrade.positive,negative:criterionCopy.upgrade.negative}
  ];
}
function beginExamCriteria(){if(!examState)return;examState.criteria=scoreExam();examState.total=0;const content=$('examContent');content.innerHTML=`<div class="exam-screen-stage"><div class="exam-stage-note">Теперь оцениваю сборку критерий за критерием…</div><div id="examResults" class="exam-results"></div><div id="examFinal" class="exam-final-score hidden"></div></div>`;const results=$('examResults');examState.criteria.forEach((criterion,index)=>setTimeout(()=>{const positive=criterion.score>=12,item=document.createElement('article');item.className=`exam-criteria-item ${positive?'positive':'negative'}`;item.innerHTML=`<div class="exam-criteria-head"><span class="exam-criteria-name">${positive?'+':'−'} ${criterion.name}</span><span class="exam-criteria-score">${criterion.score}/20</span></div><div class="exam-criteria-points">${positive?criterion.positive:criterion.negative}</div>`;results.appendChild(item);examState.total+=criterion.score;if(index===examState.criteria.length-1)setTimeout(finishExamScoring,700);},900+index*1000));}
function examPartPool(category){const all=SHOP.filter(i=>!i.starter&&!i.legacy&&i.category===category);if(state?.mode==='hardcore'&&category==='PSU')return all.filter(i=>i.hardcoreOnly);return all.filter(i=>!i.hardcoreOnly);}
function examNormalizedPart(item,category){if(!item)return 0;const pool=examPartPool(category);const max=Math.max(...pool.map(i=>Number(i.performance||0)),1);return Math.max(0,Math.min(1,Number(item.performance||0)/max));}
function examErrorText(title,text){return {title,text};}
function buildExamErrorReport(){
  const source=examState?.components||[];
  const items=Object.fromEntries(EXAM_CATEGORIES.map((c,i)=>[c,source[i]]));
  const criteria=examState?.criteria||[];
  const errors=[];
  const cpu=items.CPU,gpu=items.GPU,ram=items.RAM,storage=items.Storage,psu=items.PSU,mb=items.Motherboard,cooling=items.Cooling,caseItem=items.Case;
  const cpuN=examNormalizedPart(cpu,'CPU'),gpuN=examNormalizedPart(gpu,'GPU');
  if(cpu&&gpu&&Math.abs(cpuN-gpuN)>0.18){
    const stronger=cpuN>=gpuN?cpu:gpu, weaker=cpuN>=gpuN?gpu:cpu;
    const strongerTier=examTier(stronger), weakerTier=examTier(weaker);
    errors.push(examErrorText('⚖️ Перекос между CPU и GPU',`${stronger.name} — ${strongerTier} компонент, и к нему претензий нет. Но ${weaker.name} — ${weakerTier} уровень. В такой связке более сильная деталь не сможет полностью раскрыть свой потенциал, потому что более слабая часть будет ограничивать систему. Для экзамена лучше подбирать CPU и GPU примерно одного класса.`));
  }
  if(psu){
    if(psu.series==='Basic') errors.push(examErrorText('🔌 Слишком простой блок питания',`${psu.name} относится к стандартной серии без сертификата 80+. Для сборки такого уровня это заметное слабое место: мощность блока сама по себе ещё не делает его хорошим выбором. В более серьёзной конфигурации стоит смотреть хотя бы на 80+ Bronze, а для действительно мощной системы — на более высокий класс.`));
    else if(psu.series==='80+ Bronze' && Math.max(cpuN,gpuN)>=0.70) errors.push(examErrorText('🔌 Блок питания слабее уровня всей сборки',`${psu.name} — 80+ Bronze. Сам по себе Bronze не означает несовместимость, но для системы с компонентами топ-класса это выглядит как экономия не в том месте и снижает оценку за баланс и качество комплектации. Для такой сборки логичнее смотреть в сторону более высокого класса БП.`));
  }
  if(ram){const gb=ramCapacityGb(ram);if(gb<16) errors.push(examErrorText('🧠 Мало оперативной памяти',`Установлено ${gb} ГБ (${ram.name}). Для сборки с мощностью ${Math.round(currentPower())} это уже ограниченный запас. Увеличение объёма RAM даст системе больше пространства для программ и будущих задач.`));}
  if(storage){const gb=storageCapacityGb(storage);if(storageType(storage)==='HDD'&&gb<=500) errors.push(examErrorText('💾 Слабый накопитель для этой сборки',`${storage.name} — медленный/небольшой накопитель относительно остальной системы. Когда CPU и GPU заметно мощнее, такой накопитель становится дисбалансом: часть бюджета вложена в производительность, а хранение и загрузка остаются на начальном уровне.`));}
  if(mb){const spec=motherboardSpec(mb),pcie=motherboardPcieGeneration(mb);if(spec){if(spec.ramSlots<4||spec.maxRamGb<64) errors.push(examErrorText('🧩 Ограниченный запас материнской платы',`${mb.name} оставляет небольшой простор для будущего апгрейда: ${spec.ramSlots} слота RAM и максимум ${spec.maxRamGb} ГБ. Для долгосрочной сборки лучше выбирать плату с большим запасом памяти и расширения.`));if(pcie<4&&Math.max(cpuN,gpuN)>=0.55) errors.push(examErrorText('🧩 Платформа уже ограничивает будущие апгрейды',`${mb.name} использует уровень PCIe ${pcie}. Для мощной современной сборки это уменьшает запас на будущее по сравнению с более новой платформой.`));}}
  if(ram){const gb=ramCapacityGb(ram);if(gb<32&&Math.max(cpuN,gpuN)>=0.60) errors.push(examErrorText('🧠 RAM ниже уровня мощной сборки',`${ram.name} — ${gb} ГБ. Для заметно мощного CPU/GPU это уже небольшой запас. Такой объём не делает ПК технически несовместимым, но ограничивает комфорт при тяжёлых задачах и будущих апгрейдах.`));}
  if(storage&&storageType(storage)==='HDD'&&Math.max(cpuN,gpuN)>=0.60) errors.push(examErrorText('💾 HDD заметно отстаёт от остальной системы',`${storage.name} — HDD, тогда как CPU и GPU уже находятся на существенно более высоком уровне. Накопитель не обязан быть самым дорогим компонентом, но быстрый SSD лучше соответствует такой сборке по отзывчивости и загрузкам.`));
  const cpuTdpValue=cpu?cpuTdp(cpu):0;
  const coolCap=cooling?coolingCapacity(cooling):0;
  if(cooling&&cpu&&cooling.series==='Stock'&&cpuN>=0.65) errors.push(examErrorText('❄️ Слабый класс охлаждения',`${cooling.name} формально может подходить по тепловому лимиту, но для ${cpu.name} это уже слишком простой уровень охлаждения. Для мощного CPU разумнее брать башенный кулер высокого уровня или СЖО.`));
  else if(cooling&&cpu&&coolCap>0&&coolCap-cpuTdpValue<15&&cpuN>=0.65) errors.push(examErrorText('❄️ Охлаждение почти без запаса',`${cooling.name} рассчитано примерно на ${coolCap} W, а ${cpu.name} может потребовать около ${cpuTdpValue} W. Технически этого хватает, но запас по теплу небольшой для мощной сборки.`));
  if(caseItem&&caseItem.series==='Basic'&&Math.max(cpuN,gpuN)>=0.65) errors.push(examErrorText('🖥️ Слишком простой корпус для мощных комплектующих',`${caseItem.name} относится к базовой серии. При мощном CPU/GPU это компромисс по размещению и вентиляции. Корпус сам по себе не увеличивает FPS, но хороший airflow помогает нормально использовать мощные компоненты.`));
  // Concrete budget inefficiencies
  EXAM_CATEGORIES.forEach(category=>{
    const chosen=items[category]; if(!chosen)return;
    const pool=examPartPool(category), price=Number(chosen.basePrice||0), perf=Number(chosen.performance||0);
    const alternatives=pool.filter(x=>x.id!==chosen.id&&Number(x.basePrice||0)<price&&Number(x.performance||0)>=perf*0.88);
    if(alternatives.length){const alt=alternatives.sort((a,b)=>Number(a.basePrice)-Number(b.basePrice))[0];const saving=price-Number(alt.basePrice||0);if(saving>0&&saving>=price*0.15) errors.push(examErrorText(`💰 Переплата за ${CATEGORY_LABELS[category]||category}`,`${chosen.name} стоит около $${formatMoney(price)}. В каталоге есть ${alt.name} примерно за $${formatMoney(Number(alt.basePrice||0))} при близкой производительности. Экономия около $${formatMoney(saving)} могла быть направлена в другую слабую часть сборки.`));}
  });
  if(!errors.length) errors.push(examErrorText('✅ Критических ошибок не найдено','Сборка получила меньше 90 баллов не из-за одной большой ошибки, а из-за совокупности небольших потерь. Посмотри на каждый из пяти критериев выше и попробуй довести их ближе к максимуму.'));
  return errors;
}
function showExamAnalysisModal(){
  if(!examState)return;
  const modal=$('examAnalysisModal'),content=$('examAnalysisContent'),ok=$('examAnalysisOkBtn');
  if(!modal||!content||!ok)return;
  const total=examState.total, failed=total<60;
  const errors=buildExamErrorReport();
  examState.analysisErrors=errors;
  content.innerHTML=`<div class="exam-analysis-head"><strong>${failed?'❌ Экзамен провален — разбор ошибок обязателен':'🔎 Разбор твоей сборки'}</strong><span>Результат: ${total}/100</span></div><p class="exam-analysis-sub">Ниже перечислены конкретные замечания по этой сборке. Названия деталей взяты прямо из твоего текущего ПК.</p><div class="exam-analysis-list">${errors.map((e,i)=>`<article class="exam-analysis-item"><div class="exam-analysis-index">${i+1}</div><div><h3>${e.title}</h3><p>${e.text}</p></div></article>`).join('')}</div>`;
  ok.textContent=failed?'Понятно, вернуться к сборке':'Хорошо, закончить обучение';
  modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');
}
function closeExamAnalysis(){
  const modal=$('examAnalysisModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');}
  if(!examState)return;
  const total=examState.total;
  openExamExitOffer();
  if(total<60 && (firstVisitTrainingActive||lightTrainingActive)) lightCoachEvent('mistake','Экзамен не пройден.',`Результат — ${total}/100. После сохранения или выхода из экзамена можно вернуться к сборке и улучшить найденные слабые места.`,14000,true);
}
function closeExamAnalysisModalSilently(){const modal=$('examAnalysisModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');}}
function closeExamExitModal(){const modal=$('examExitModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');}}
function hideGameForExamExit(){closeShop();closeGame();const game=$('gameScreen');if(game)game.classList.add('hidden');setMoneyVisible(false);}
function completeExamTrainingFlags(){
  if(firstVisitTrainingActive){
    localStorage.setItem(FIRST_VISIT_DONE_KEY,'1');
    localStorage.removeItem(FIRST_VISIT_TRAINING_KEY);
  }
  firstVisitTrainingActive=false;
  lightTrainingActive=false;
  if(state?.mode==='light') state.lightTrainingEnabled=false;
}
function openExamExitOffer(){
  const modal=$('examExitModal'),text=$('examExitText');
  if(!modal)return;
  hideGameForExamExit();
  if(text)text.textContent=`Экзамен завершён: ${Number(examState?.total)||0}/100. Игра сейчас закрыта. Хочешь сохранить это прохождение?`;
  closeExamModalSilently();
  closeExamAnalysisModalSilently();
  modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');
}
function closeExamModalSilently(){const modal=$('examModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');} $('examStartActions')?.classList.add('hidden');$('examNextWrap')?.classList.add('hidden');$('examAnalysisOfferActions')?.classList.add('hidden');}
function finishExamExitToMenu(saved){
  completeExamTrainingFlags();
  closeExamExitModal();
  closeSaveModal();
  examState=null;
  if(saved){
    localStorage.removeItem(STORAGE_KEY);
  }else{
    localStorage.removeItem(STORAGE_KEY);
  }
  state=null;
  pendingExamExitAfterSave=false;
  showMainMenu();
}
function chooseExamExitSave(){
  if(!state)return;
  completeExamTrainingFlags();
  pendingExamExitAfterSave=true;
  closeExamExitModal();
  openSaveModal();
}
function chooseExamExitNoSave(){
  pendingExamExitAfterSave=false;
  finishExamExitToMenu(false);
}
function finishFirstVisitTraining(total){
  if(examState) examState.total=Number(total)||0;
  openExamExitOffer();
}
function showExamAnalysisOffer(){
  if(!examState)return;
  hideGameForExamExit();
  const content=$('examContent'),startActions=$('examStartActions'),next=$('examNextWrap'),offer=$('examAnalysisOfferActions');
  if(!content||!startActions||!next||!offer)return;
  startActions.classList.add('hidden');next.classList.add('hidden');
  content.innerHTML=`<div class="exam-analysis-offer"><h3>Экзамен завершён: ${examState.total}/100</h3><p>Результат ниже 90. Хочешь подробно разобрать свои ошибки? Я покажу конкретные детали и объясню, где сборка теряет баллы и почему.</p></div>`;
  offer.classList.remove('hidden');
}
function finishExamScoring(){
  if(!examState)return;
  examState.passed=examState.total>=60;
  if(state){ state.examBestScore=Math.max(Number(state.examBestScore)||0, Number(examState.total)||0); }
  if(typeof checkAchievements==='function') checkAchievements({ examScore:Number(examState.total)||0, examCompleted:true });
  const final=$('examFinal');
  if(final){final.classList.remove('hidden');final.innerHTML=`<div class="score-number">${examState.total}/100</div><div class="score-label">${examState.passed?'Экзамен пройден.':'Экзамен не пройден.'}</div>`;}
  const next=$('examNextWrap');
  const btn=$('examNextBtn');
  if(btn)btn.textContent=examState.total<60?'Разобрать ошибки':examState.total<90?'Далее':'Завершить';
  next?.classList.remove('hidden');
  hideGameForExamExit();
  if(examState.total<60)setTimeout(showExamAnalysisModal,900);
}
function continueExamResult(){
  if(!examState)return;
  if(examState.total<60){showExamAnalysisModal();return;}
  if(examState.total<90){showExamAnalysisOffer();return;}
  openExamExitOffer();
}
function chooseExamAnalysis(choice){
  if(!examState)return;
  if(choice==='yes'){showExamAnalysisModal();return;}
  if(choice==='no'){openExamExitOffer();}
}
function startExam(){beginExamComponentReveal();}

bindLightCoachHover();


// ===== v1.17.9 DEV TEST COMMAND =====
window.pcMoney = function(amount = 1000000) {
  const value = Math.floor(Number(amount));
  if (!Number.isFinite(value)) return 'Ошибка: укажи число, например pcMoney(1000000)';
  if (!state) return 'Ошибка: сначала начни или загрузи игру.';
  state.money = Math.floor(Number(state.money) || 0) + value;
  save();
  render();
  return `Баланс: $${formatMoney(state.money)}`;
};
