const EVENT_REFRESH_MS = 5 * 60 * 1000;
const EVENT_DURATION_MS = 4 * 60 * 1000 + 30 * 1000;

function marketSlot() { return Math.floor(Date.now() / MARKET_REFRESH_MS); }
function eventSlot() { return Math.floor(Date.now() / EVENT_REFRESH_MS); }
function marketSecondsLeft() {
  return Math.max(0, Math.ceil((MARKET_REFRESH_MS - (Date.now() % MARKET_REFRESH_MS)) / 1000));
}
function eventElapsedMs() { return Date.now() % EVENT_REFRESH_MS; }
function eventIsActive() { return eventElapsedMs() < EVENT_DURATION_MS; }
function eventSecondsLeft() {
  const elapsed = eventElapsedMs();
  return eventIsActive()
    ? Math.max(0, Math.ceil((EVENT_DURATION_MS - elapsed) / 1000))
    : Math.max(0, Math.ceil((EVENT_REFRESH_MS - elapsed) / 1000));
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function chooseMarketEvent(slot = eventSlot()) {
  const random = seededRandom(hashSeed(`${slot}-pc-event`));
  const roll = random();
  if (roll < 0.05) return { id: 'black_friday', icon: '🛍️', name: 'Чёрная пятница', description: 'Все товары получили скидку от 10% до 50%. Без переплат.' };
  if (roll < 0.20) return { id: 'coupon_giveaway', icon: '🎟️', name: 'Раздача купонов', description: 'Шанс получить обычный купон после мини-игры удвоен с 10% до 20%, а EXTRA COUPON в обычном AFK — с 0.5% до 1%.' };
  if (roll < 0.50) return { id: 'ai_development', icon: '🤖', name: 'Разработка ИИ', description: 'Оперативная память резко подорожала и стала дефицитной.' };
  if (roll < 0.75) return { id: 'overproduction', icon: '🏭', name: 'Лишнее производство', description: 'Одну категорию комплектующих выпускают в избытке: все товары этой категории дешевеют и чаще встречаются.' };
  return { id: 'factory_explosion', icon: '💥', name: 'Взрыв фабрики', description: 'Две категории комплектующих стали дефицитными и подорожали.' };
}

function applyMarketEvent(marketItems, slot = eventSlot()) {
  const event = chooseMarketEvent(slot);
  const random = seededRandom(hashSeed(`${slot}-pc-event-effects`));
  const ids = Object.keys(marketItems);
  if (event.id === 'ai_development') {
    SHOP.filter((item) => !item.starter && !item.legacy && item.category === 'RAM').forEach((item) => {
      const entry = marketItems[item.id];
      if (!entry) return;
      const priceBoost = 2 + random() * 2; // +100%..+300%
      entry.price = Math.max(1, Math.round(entry.price * priceBoost / 5) * 5);
      entry.change = Math.max(100, Math.round((priceBoost - 1) * 100));
      entry.stockChance = clamp(entry.stockChance * 0.48, 0.04, 0.90);
      entry.available = random() < entry.stockChance;
      entry.event = 'ai_development';
    });
  } else if (event.id === 'overproduction') {
    const categories = [...new Set(SHOP.filter((item) => !item.starter && !item.legacy).map((item) => item.category))];
    const category = categories[Math.floor(random() * categories.length)];
    const categoryItems = SHOP.filter((item) => !item.starter && !item.legacy && item.category === category);
    const discount = 0.20 + random() * 0.20; // -20%..-40%
    categoryItems.forEach((item) => {
      const entry = marketItems[item.id];
      if (!entry) return;
      // Событийная цена считается напрямую от БАЗОВОЙ цены товара,
      // а не от уже случайной рыночной цены. Поэтому скидка действительно
      // всегда уводит цену ниже базы даже при обычном рыночном росте.
      entry.price = Math.max(1, Math.round(item.basePrice * (1 - discount) / 5) * 5);
      entry.change = -Math.round(discount * 100);
      entry.eventBasePrice = Number(item.basePrice) || 0;
      entry.stockChance = clamp(entry.stockChance * 1.65, 0.10, 0.99);
      entry.available = random() < entry.stockChance;
      entry.event = 'overproduction';
      entry.eventCategory = category;
    });
    event.targetCategory = category;
    event.target = category;
  } else if (event.id === 'factory_explosion') {
    const categories = [...new Set(SHOP.filter((item) => !item.starter && !item.legacy).map((item) => item.category))];
    const shuffledCategories = [...categories];
    for (let i = shuffledCategories.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [shuffledCategories[i], shuffledCategories[j]] = [shuffledCategories[j], shuffledCategories[i]];
    }
    const selectedCategories = shuffledCategories.slice(0, 2);
    event.targetCategories = selectedCategories;
    event.targets = selectedCategories;
    selectedCategories.forEach((category) => {
      const markup = 1.20 + random() * 0.80; // +20%..+100%
      SHOP.filter((item) => !item.starter && !item.legacy && item.category === category).forEach((item) => {
        const entry = marketItems[item.id];
        if (!entry) return;
        const itemMarkup = 1.20 + random() * 0.80; // +20%..+100% per item
        entry.price = Math.max(1, Math.round(entry.price * itemMarkup / 5) * 5);
        entry.change = Math.round((itemMarkup - 1) * 100);
        entry.stockChance = clamp(entry.stockChance * 0.42, 0.03, 0.88);
        entry.available = random() < entry.stockChance;
        entry.event = 'factory_explosion';
        entry.eventCategory = category;
      });
    });
  } else if (event.id === 'black_friday') {
    Object.entries(marketItems).forEach(([itemId, entry]) => {
      const item = itemById(itemId);
      if (!item) return;
      const discount = 0.10 + random() * 0.40; // -10%..-50% от базы
      const basePrice = Number(item.basePrice) || Number(entry.price) || 1;
      entry.price = Math.max(1, Math.round(basePrice * (1 - discount) / 5) * 5);
      entry.change = -Math.round(discount * 100);
      entry.eventBasePrice = basePrice;
      entry.event = 'black_friday';
    });
  }
  return event;
}

function createMarket(slot = marketSlot()) {
  const random = seededRandom(hashSeed(`${slot}-pc-market`));
  const items = {};
  SHOP.filter((item) => !item.starter && !item.legacy).forEach((item) => {
    const performanceScarcity = Math.min(1, (Number(item.performance) || 0) / 180);
    const priceScarcity = Math.min(1, (Number(item.basePrice) || 0) / 16500);
    const scarcity = Math.max(performanceScarcity, priceScarcity);
    const stockChance = Math.max(0.08, Math.min(0.96, item.availability * (1 - scarcity * 0.48)));
    const inStock = random() < stockChance;
    const [minMultiplier, maxMultiplier] = item.volatility;
    const multiplier = minMultiplier + random() * (maxMultiplier - minMultiplier);
    const price = Math.max(1, Math.round(item.basePrice * multiplier / 5) * 5);
    items[item.id] = { available: inStock, price, change: Math.round((multiplier - 1) * 100), stockChance, event: null };
  });
  const evSlot = eventSlot();
  const active = eventIsActive();
  const event = active ? applyMarketEvent(items, evSlot) : null;
  return { slot, eventSlot: evSlot, eventActive: active, event, items };
}

function createBlackMarket(slot = marketSlot()) {
  const random = seededRandom(hashSeed(`${slot}-pc-black-market`));
  const available = random() < 0.25;
  const items = {};
  SHOP.filter((item) => !item.starter && !item.legacy).forEach((item) => {
    const markup = -0.20 + random() * 0.40;
    const price = Math.max(1, Math.round((Number(item.basePrice) || 0) * 0.5 * (1 + markup) / 5) * 5);
    const stockChance = 0.90;
    items[item.id] = {
      available: random() < stockChance,
      price,
      markup: Math.round(markup * 100),
      change: -50,
      stockChance,
      event: 'black_market'
    };
  });
  return { slot, available, items };
}
function ensureBlackMarket() {
  if (!state || isLightMode()) return false;
  const slot = marketSlot();
  if (!state.blackMarket || state.blackMarket.slot !== slot) {
    state.blackMarket = createBlackMarket(slot);
    save();
    return true;
  }
  const ids = SHOP.filter((item) => !item.starter && !item.legacy).map((item) => item.id);
  if (!ids.every((id) => state.blackMarket.items?.[id])) {
    state.blackMarket = createBlackMarket(slot);
    save();
    return true;
  }
  return false;
}
function blackMarketAvailable() { if (isLightMode()) return false; ensureBlackMarket(); return !!state?.blackMarket?.available; }
function blackMarketEntry(itemId) { ensureBlackMarket(); return state?.blackMarket?.items?.[itemId] || null; }

function repairPersistedOverproductionPrices() {
  const market = state?.market;
  const event = market?.event;
  if (!market || !event || event.id !== 'overproduction' || !event.targetCategory) return false;
  const discount = Math.abs(Number(market.items?.[SHOP.find((item) => item.category === event.targetCategory && !item.starter && !item.legacy)?.id]?.change ?? 0)) / 100;
  if (!(discount > 0 && discount < 1)) return false;
  let changed = false;
  SHOP.filter((item) => !item.starter && !item.legacy && item.category === event.targetCategory).forEach((item) => {
    const entry = market.items?.[item.id];
    if (!entry) return;
    const expectedPrice = Math.max(1, Math.round(Number(item.basePrice || 0) * (1 - discount) / 5) * 5);
    const expectedChange = -Math.round(discount * 100);
    if (entry.price !== expectedPrice || entry.change !== expectedChange || entry.event !== 'overproduction') {
      entry.price = expectedPrice;
      entry.change = expectedChange;
      entry.eventBasePrice = Number(item.basePrice) || 0;
      entry.event = 'overproduction';
      entry.eventCategory = event.targetCategory;
      changed = true;
    }
  });
  return changed;
}
function ensureMarket() {
  if (isLightMode()) return false;
  const slot = marketSlot();
  const evSlot = eventSlot();
  const active = eventIsActive();
  if (!state.market || state.market.slot !== slot || state.market.eventSlot !== evSlot || Boolean(state.market.eventActive) !== active) {
    const previousEventSlot = Number(state.market?.eventSlot);
    state.market = createMarket(slot);
    state.blackMarket = createBlackMarket(slot);
    recordBlackFridayEventSlot(evSlot);
    save();
    if (previousEventSlot !== evSlot && eventIsActive()) checkAchievements();
    return true;
  }
  const allIdsPresent = SHOP.filter((item) => !item.starter && !item.legacy).every((item) => state.market.items?.[item.id]);
  if (!allIdsPresent) {
    state.market = createMarket(slot);
    state.blackMarket = createBlackMarket(slot);
    save();
    return true;
  }
  ensureBlackMarket();
  if (repairPersistedOverproductionPrices()) save();
  return false;
}

function itemById(id) { return SHOP.find((item) => item.id === id) || null; }
