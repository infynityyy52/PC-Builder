function requestModeStart(mode) {
  if (mode === 'hardcore') {
    openHardcoreConfirm();
    return;
  }
  if (mode === 'light') {
    openLightTrainingConfirm();
    return;
  }
  start(mode);
}

$('diagnosticCloseBtn')?.addEventListener('click', closeDiagnostic);

$('tutorialBtn').addEventListener('click', openTutorial);
$('tutorialSkipBtn').addEventListener('click', finishTutorial);
$('tutorialPrev').addEventListener('click', () => { if (tutorialStep > 0) { tutorialStep -= 1; renderTutorialStep(); } });
$('tutorialNext').addEventListener('click', () => { if (tutorialStep < TUTORIAL_STEPS.length - 1) { tutorialStep += 1; renderTutorialStep(); } else finishTutorial(); });

$('startGameBtn').addEventListener('click', showModeScreen);
$('loadGameBtn').addEventListener('click', openLoadModal);
$('continueBtn').addEventListener('click', () => { if (state) render(); });
$('backToMenuBtn').addEventListener('click', showMainMenu);
$('lightTrainingStartBtn')?.addEventListener('click', confirmLightTrainingStart);
$('lightTrainingCancelBtn')?.addEventListener('click', closeLightTrainingConfirm);
$('infoBtn').addEventListener('click', openInfo);
$('settingsBtn').addEventListener('click', () => openMenuModal('settingsModal'));
$('achievementsBtn').addEventListener('click', openAchievements);
$('updateLogBtn').addEventListener('click', () => { $('updateLogContent').textContent = getLocalizedUpdateLog(); openMenuModal('updateLogModal'); });
document.querySelectorAll('[data-close-menu-modal]').forEach((el) => el.addEventListener('click', () => {
  const value = el.dataset.closeMenuModal;
  closeMenuModal(value === 'log' ? 'updateLogModal' : `${value}Modal`);
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!$('blackMarketPoliceFineModal')?.classList.contains('hidden')) return;
    if (!$('firstVisitIntro')?.classList.contains('hidden')) return;
    if (!$('examModal')?.classList.contains('hidden')) return;
    if (!$('examAnalysisModal')?.classList.contains('hidden')) { closeExamAnalysis(); return; }
    if (!$('examExitModal')?.classList.contains('hidden')) return;
    if (!$('lightTrainingConfirmModal')?.classList.contains('hidden')) { closeLightTrainingConfirm(); return; }
    closeAllMenuModals(); closeDiagnostic(); closeShop(); pendingResetAfterSave = false; closeSaveModal(); closeResetConfirm(); closeHardcoreConfirm(); closeHardcorePsuCertModal(); closePurchaseCouponModal(); closeCouponReceivedModal(); closeExtraCouponPurchaseModal(); closeSellBlockedModal(); closeBlackMarketPoliceWarning(); closePsuCompensationToast();
  }
});
$('languageEnglishBtn')?.addEventListener('click', () => setLanguage('en'));
$('languageRussianBtn')?.addEventListener('click', () => setLanguage('ru'));
$('languagePromptRussianBtn')?.addEventListener('click', () => { localStorage.setItem(LANGUAGE_KEY, 'ru'); localStorage.setItem(LANGUAGE_PROMPT_KEY, '1'); location.reload(); });
$('languagePromptEnglishBtn')?.addEventListener('click', closeLanguagePrompt);
$('animationsToggle').addEventListener('change', saveSettings);
$('blackMarketPoliceWarningToggle')?.addEventListener('change', saveSettings);
document.querySelectorAll('input[name="theme"]').forEach((input) => input.addEventListener('change', saveSettings));
$('fullscreenBtn').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    // Browser blocked fullscreen or local file does not allow it.
  }
});

document.addEventListener('fullscreenchange', () => {
  const btn = $('fullscreenBtn');
  if (btn) btn.textContent = document.fullscreenElement ? '⛶ Выйти из полноэкранного режима' : '⛶ Полноэкранный режим';
});

$('miniGamesTab').addEventListener('click', () => setEarnTab('games'));
$('afkTab').addEventListener('click', () => setEarnTab('afk'));
$('aiTab').addEventListener('click', () => setEarnTab('ai'));
$('programmingTab')?.addEventListener('click', () => setEarnTab('programming'));
document.querySelectorAll('[data-afk-mode]').forEach((btn) => btn.addEventListener('click', () => {
  afkMode = btn.dataset.afkMode === 'overclock' ? 'overclock' : 'normal';
  stopAfk();
  document.querySelectorAll('[data-afk-mode]').forEach((b) => b.classList.toggle('active', b === btn));
  renderAfkPanel();
}));

$('openShopBtn').addEventListener('click', openCatalog);
$('openBlackMarketBtn')?.addEventListener('click', openBlackMarket);
$('closeShopBtn').addEventListener('click', closeShop);
document.querySelectorAll('[data-close-shop]').forEach((el) => el.addEventListener('click', closeShop));
$('saveBtn').addEventListener('click', openSaveModal);
document.querySelectorAll('[data-close-save]').forEach((el) => el.addEventListener('click', () => { if (pendingExamExitAfterSave) { closeSaveModal(); openExamExitOffer(); return; } pendingResetAfterSave = false; closeSaveModal(); }));
$('resetBtn').addEventListener('click', openResetConfirm);
$('saveBeforeResetBtn').addEventListener('click', () => { pendingResetAfterSave = true; closeResetConfirm(); openSaveModal(); });
$('resetWithoutSaveBtn').addEventListener('click', () => { pendingResetAfterSave = false; resetGameNow(); });
$('cancelResetBtn').addEventListener('click', closeResetConfirm);
document.querySelectorAll('[data-mode]').forEach((btn) => btn.addEventListener('click', () => requestModeStart(btn.dataset.mode)));
$('hardcoreConfirmYes').addEventListener('click', () => { closeHardcoreConfirm(); start('hardcore'); });
$('hardcoreConfirmNo').addEventListener('click', closeHardcoreConfirm);
$('purchaseCouponUseBtn').addEventListener('click', () => { if (pendingPurchaseItemId) purchaseItem(pendingPurchaseItemId, true); });
$('compatibilityPurchaseYesBtn').addEventListener('click', confirmCompatibilityPurchase);
$('compatibilityPurchaseNoBtn').addEventListener('click', closeCompatibilityPurchaseModal);
$('hardcorePsuCertConfirmBtn')?.addEventListener('click', confirmHardcorePsuCertPurchase);
$('hardcorePsuCertCancelBtn')?.addEventListener('click', closeHardcorePsuCertModal);
$('purchaseCouponNoBtn').addEventListener('click', () => { if (pendingPurchaseItemId) purchaseItem(pendingPurchaseItemId, false); });
$('purchaseCouponCancelBtn').addEventListener('click', closePurchaseCouponModal);
$('couponReceivedOkBtn').addEventListener('click', closeCouponReceivedModal);
$('extraCouponPurchaseBuyBtn').addEventListener('click', () => { if (pendingExtraPurchaseItemId) purchaseExtraItem(pendingExtraPurchaseItemId, false); });
$('extraCouponPurchaseUseBothBtn').addEventListener('click', () => { if (pendingExtraPurchaseItemId) purchaseExtraItem(pendingExtraPurchaseItemId, true); });
$('extraCouponPurchaseCancelBtn').addEventListener('click', closeExtraCouponPurchaseModal);
$('sellBlockedOkBtn').addEventListener('click', closeSellBlockedModal);
$('blackMarketPoliceCancelBtn')?.addEventListener('click', closeBlackMarketPoliceWarning);
$('blackMarketPoliceSellBtn')?.addEventListener('click', confirmBlackMarketPoliceSale);
$('blackMarketPolicePayBtn')?.addEventListener('click', payBlackMarketPoliceFine);
$('psuCompensationToast')?.querySelector('.psu-compensation-close')?.addEventListener('click', closePsuCompensationToast);

$('firstVisitNext')?.addEventListener('click', advanceFirstVisitIntro);
$('lightClickerBtn')?.addEventListener('click', lightModeClick);
$('examBtn')?.addEventListener('click', openExamConfirm);
$('examStartYes')?.addEventListener('click', startExam);
$('examStartNo')?.addEventListener('click', closeExamModal);
$('examNextBtn')?.addEventListener('click', continueExamResult);
$('examAnalyzeYes')?.addEventListener('click', () => chooseExamAnalysis('yes'));
$('examAnalyzeNo')?.addEventListener('click', () => chooseExamAnalysis('no'));
$('examAnalysisOkBtn')?.addEventListener('click', closeExamAnalysis);
$('examExitSaveBtn')?.addEventListener('click', chooseExamExitSave);
$('examExitNoSaveBtn')?.addEventListener('click', chooseExamExitNoSave);

loadSettings();
showLanguagePrompt();
let previous = load();
if (!previous) {
  const legacyKeys = ['pcBuilder_v05', 'pcBuilder_v04', 'pcBuilder_v03'];
  for (const key of legacyKeys) {
    try {
      const raw = localStorage.getItem(key); if (raw) { previous = JSON.parse(raw); break; }
    } catch { /* ignore */ }
  }
}
if (previous && MODE_CONFIG[previous.mode]) {
  if (previous.installed && previous.owned) {
    state = previous; ensureMarket(); state.power = currentPower(); save();
  } else {
    migrateState(previous);
  }
}
if (state) { ensureRequiredModeStarters(); normalisePsuIds(); if (typeof state.lightClickerCount !== 'number') state.lightClickerCount = 0; if (typeof state.lightTrainingEnabled !== 'boolean') state.lightTrainingEnabled = false; if (isLightMode()) lightTrainingActive = state.lightTrainingEnabled === true; if (!state.broken) state.broken = {}; if (!state.blackMarketBroken) state.blackMarketBroken = {}; if (!state.blackMarketOwned) state.blackMarketOwned = {}; if (!state.installedSource) state.installedSource = Object.fromEntries(CATEGORIES.map((category) => [category, 'catalog'])); CATEGORIES.forEach((category) => { state.installedSource[category] = state.installedSource[category] === 'black' ? 'black' : 'catalog'; }); ensureBlackMarket(); if (!state.achievements) state.achievements = {}; if (typeof state.extraCoupon !== 'boolean') state.extraCoupon = !!state.extraCoupon; if (typeof state.superBuy !== 'boolean') state.superBuy = !!state.superBuy; normaliseInstalledForAchievements(); normaliseStarterProtection(); normaliseAfkComponents(); checkAchievements(); updateAchievementMenuButton(); save(); }
if (state) render(); else showMainMenu();
updateAchievementMenuButton();
setInterval(() => {
  if (!state) return;
  if (isLightMode()) {
    renderLightExamButton();
    return;
  }
  const refreshed = ensureMarket();
  if (refreshed) {
    renderMarketEventBanner();
    if (!$('shopModal').classList.contains('hidden')) renderShopWindow();
  } else {
    updateShopRefreshTimer();
  }
  renderBlackMarketButton();
}, 1000);

startFirstVisitOnboarding();
finishBootLoading();

window.addEventListener('resize', () => { if (!$('tutorialModal').classList.contains('hidden')) positionTutorialGuide(); if (!$('examModal')?.classList.contains('hidden')) positionExamUi(); });
window.addEventListener('scroll', () => { if (!$('tutorialModal').classList.contains('hidden')) positionTutorialGuide(); }, true);
