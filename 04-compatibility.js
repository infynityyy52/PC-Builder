function partPlatform(item) {
  if (!item) return null;
  if (item.category === 'CPU') {
    if (/starter-easy-cpu/i.test(item.id)) return 'LGA1200';
    if (/starter-hard-cpu/i.test(item.id)) return 'LGA1200';
    if (/starter-hardcore-cpu/i.test(item.id)) return 'LGA1200';
    if (/j2900|cel-g5905|pentium-g6400|i[3579]-(10100|10400|10700|11900)/i.test(item.id)) return 'LGA1200';
    if (/cel-g6900|pentium-g7400/i.test(item.id)) return 'LGA1700';
    if (/i[3579]-(12|13|14)/i.test(item.id)) return 'LGA1700';
    if (/ultra[579]-/i.test(item.id)) return 'LGA1851';
    if (/xeon-(e-2336|e-2388g|w-1290p)/i.test(item.id)) return 'LGA1200';
    if (/(3100|4100|3600|5600|5700|5800|5900)/i.test(item.id)) return 'AM4';
    if (/(7600|7800|7900|7950|9600|9700|9950)/i.test(item.id)) return 'AM5';
  }
  if (item.category === 'Motherboard') {
    if (/starter-easy-mb/i.test(item.id)) return 'LGA1200';
    if (/starter-hard-mb/i.test(item.id)) return 'LGA1200';
    if (/starter-hardcore-mb/i.test(item.id)) return 'LGA1200';
    if (/h410|b560/i.test(item.id)) return 'LGA1200';
    if (/b660|b760|z690|z790/i.test(item.id)) return 'LGA1700';
    if (/b860|z890/i.test(item.id)) return 'LGA1851';
    if (/a320|b450|b550/i.test(item.id)) return 'AM4';
    if (/b650|x670|x870/i.test(item.id)) return 'AM5';
  }
  return null;
}
function motherboardSpec(item) {
  if (!item || item.category !== 'Motherboard') return null;
  const id = item.id;
  if (/starter-easy-mb/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR3', maxRamGb: 16, ramSlots: 2, maxCpuTdp: 95 };
  if (/starter-hard-mb/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR3', maxRamGb: 8, ramSlots: 2, maxCpuTdp: 95 };
  if (/starter-hardcore-mb/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR3', maxRamGb: 4, ramSlots: 2, maxCpuTdp: 95 };
  if (/h410/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR4', maxRamGb: 64, ramSlots: 2, maxCpuTdp: 125 };
  if (/b560/i.test(id)) return { platform: 'LGA1200', ramType: 'DDR4', maxRamGb: 128, ramSlots: 4, maxCpuTdp: 125 };
  if (/mb-z790-256/i.test(id)) {
    return { platform: 'LGA1700', ramType: 'DDR5', maxRamGb: 256, ramSlots: 4, maxCpuTdp: 253 };
  }
  if (/mb-b760-ddr4/i.test(id)) return { platform: 'LGA1700', ramType: 'DDR4', maxRamGb: 128, ramSlots: 4, maxCpuTdp: 253 };
  if (/b660|b760|z690|z790/i.test(id)) return { platform: 'LGA1700', ramType: 'DDR5', maxRamGb: 192, ramSlots: 4, maxCpuTdp: 253 };
  if (/mb-z890-256/i.test(id)) {
    return { platform: 'LGA1851', ramType: 'DDR5', maxRamGb: 256, ramSlots: 4, maxCpuTdp: 253 };
  }
  if (/mb-x870e-256/i.test(id)) {
    return { platform: 'AM5', ramType: 'DDR5', maxRamGb: 256, ramSlots: 4, maxCpuTdp: 200 };
  }
  if (/b860|z890/i.test(id)) return { platform: 'LGA1851', ramType: 'DDR5', maxRamGb: 192, ramSlots: 4, maxCpuTdp: 253 };
  if (/a320/i.test(id)) return { platform: 'AM4', ramType: 'DDR4', maxRamGb: 32, ramSlots: 2, maxCpuTdp: 105 };
  if (/b450|b550/i.test(id)) return { platform: 'AM4', ramType: 'DDR4', maxRamGb: 128, ramSlots: 4, maxCpuTdp: 145 };
  if (/b650|x670|x870/i.test(id)) return { platform: 'AM5', ramType: 'DDR5', maxRamGb: 192, ramSlots: 4, maxCpuTdp: 200 };
  return null;
}
function ramType(item) {
  if (!item || item.category !== 'RAM') return null;
  if (/starter-easy-ram/i.test(item.id)) return 'DDR3';
  if (/starter-hard-ram/i.test(item.id)) return 'DDR3';
  if (/starter-hardcore-ram/i.test(item.id)) return 'DDR3';
  return item.group;
}
function numericWatts(item) {
  if (!item) return 0;
  // Поддерживаем W/Вт независимо от регистра, пробела и точек/знаков после единицы.
  const text = String(item.name || '');
  const match = text.match(/(\d{2,4})\s*(?:W|Вт)(?=\s|$|[.,;:!?)]|[-–—])/iu) || text.match(/(\d{2,4})\s*(?:W|Вт)/iu);
  return match ? Number(match[1]) : 0;
}
function gpuRecommendedPsu(item) {
  if (!item || item.category !== 'GPU') return 0;
  if (!isDiscreteGpu(item)) return 0;
  const id = item.id;
  const explicit = {
    'gpu-rtx-5090': 1000, 'gpu-rtx-4090': 850, 'gpu-rtx-4080s': 750, 'gpu-rtx-4070s': 650, 'gpu-rtx-4070': 650,
    'gpu-rtx-4060': 450, 'gpu-rtx-2070': 550, 'gpu-rtx-3060': 550, 'gpu-rtx-2060': 500,
    'gpu-rx-7900xtx': 800, 'gpu-rx-7900xt': 750, 'gpu-rx-7800xt': 700, 'gpu-rx-7700xt': 700, 'gpu-rx-7600': 550
  };
  if (explicit[id]) return explicit[id];
  if (/1660/.test(id)) return 450;
  if (/1650/.test(id)) return 300;
  if (/5500xt/.test(id)) return 450;
  if (/6600/.test(id)) return 450;
  if (/6700xt/.test(id)) return 650;
  if (/arc-(a580|a750)/.test(id)) return 550;
  if (/arc-b580/.test(id)) return 600;
  return 450;
}
function cpuTdp(item) {
  if (!item || item.category !== 'CPU') return 65;
  if (/j2900/.test(item.id)) return 10;
  if (/xeon-e-2336/.test(item.id)) return 65;
  if (/xeon-e-2388g|xeon-w-1290p/.test(item.id)) return 95;
  if (/cel-g5905|cel-g6900|pentium-g6400|pentium-g7400|i3-10100|i3-12100f|i3-13100f/.test(item.id)) return 65;
  if (/14900k|9950x|7950x|ultra9-285k/.test(item.id)) return 170;
  if (/ultra5-245k|ultra7-265k/.test(item.id)) return 145;
  if (/13900k|14700k/.test(item.id)) return 180;
  if (/14600k|13700k|12900k/.test(item.id)) return 150;
  if (/7800x3d|9700x|7900x|5900x|5800x3d/.test(item.id)) return 120;
  return /i9|r9/.test(item.name.toLowerCase()) ? 125 : 95;
}
function coolingCapacity(item) {
  if (!item || item.category !== 'Cooling') return 0;
  if (/starter-(easy|hard|hardcore)-cooling/i.test(item.id)) return 65;
  if (/stock/i.test(item.id)) return 65;
  if (/basic/i.test(item.id)) return 95;
  if (/tower[^-]|cooler-tower/.test(item.id)) return 140;
  if (/dual-tower/.test(item.id)) return 200;
  if (/premium-air/.test(item.id)) return 180;
  if (/aio-240/.test(item.id)) return 220;
  if (/aio-360/.test(item.id)) return 300;
  if (/aio-420/.test(item.id)) return 340;
  return 100;
}
function installedItem(category) { return itemById(state?.installed?.[category]); }
function ownedItemsIn(category) { return SHOP.filter((item) => item.category === category && state?.owned?.[item.id]); }
function workingOwnedItemsIn(category) { return ownedItemsIn(category).filter((item) => !isItemBroken(item)); }
function motherboardCompatibilitySummary(item) {
  const spec = motherboardSpec(item);
  if (!spec) return '';
  return `${spec.platform}, ${spec.ramType}, до ${spec.maxRamGb} ГБ RAM / ${spec.ramSlots} слота`;
}
function checkCompatibility() {
  const issues = [];
  const categories = activeCategories();
  const cpu = installedItem('CPU'); const mb = installedItem('Motherboard'); const ram = installedItem('RAM');
  const gpu = installedItem('GPU'); const psu = installedItem('PSU'); const cooling = installedItem('Cooling'); const storage = installedItem('Storage'); const os = installedItem('OS');
  categories.forEach((category) => { const installed = installedItem(category); const info = brokenInfo(installed); if (installed && info) issues.push({ category, title: 'Установленная деталь сломана', detail: `${installed.name} повреждена на ${info.damage}%.`, fixCategory: category, brokenItemId: installed.id }); });
  if (!cpu) issues.push({ category: 'CPU', title: 'Нет процессора', detail: 'Для запуска нужен процессор.', fixCategory: 'CPU' });
  if (!mb) issues.push({ category: 'Motherboard', title: 'Нет материнской платы', detail: 'Компоненты некуда подключить.', fixCategory: 'Motherboard' });
  if (!ram) issues.push({ category: 'RAM', title: 'Нет оперативной памяти', detail: 'Без RAM система не сможет нормально пройти POST.', fixCategory: 'RAM' });
  if (!storage) issues.push({ category: 'Storage', title: 'Нет накопителя', detail: 'Операционной системе неоткуда загружаться.', fixCategory: 'Storage' });
  if (!psu) issues.push({ category: 'PSU', title: 'Нет блока питания', detail: 'Системе нечем получать питание.', fixCategory: 'PSU' });
  if (!isLightMode() && !os) issues.push({ category: 'OS', title: 'Нет операционной системы', detail: 'Для запуска нужен установленный загрузочный образ ОС.', fixCategory: 'OS' });
  const mbSpec = motherboardSpec(mb);
  if (cpu && mb && partPlatform(cpu) && mbSpec?.platform && partPlatform(cpu) !== mbSpec.platform) {
    issues.push({ category: 'CPU', title: 'CPU физически несовместим с материнской платой', detail: `${cpu.name} использует ${partPlatform(cpu)}, а ${mb.name} рассчитана на ${mbSpec.platform}. Процессор в этот сокет не устанавливается.`, fixCategory: 'CPU_OR_MB', preferred: partPlatform(cpu) });
  }
  if (cpu && mbSpec?.maxCpuTdp && cpuTdp(cpu) > mbSpec.maxCpuTdp) {
    issues.push({ category: 'CPU', title: 'Материнская плата не рассчитана на такой CPU', detail: `${mb.name} рассчитана примерно до ${mbSpec.maxCpuTdp} W, а ${cpu.name} может потреблять около ${cpuTdp(cpu)} W.`, fixCategory: 'CPU_OR_MB', preferred: mbSpec.platform, preferredCpuTdp: mbSpec.maxCpuTdp });
  }
  if (ram && mbSpec) {
    const expected = mbSpec.ramType;
    if (expected && ramType(ram) !== expected) {
      issues.push({ category: 'RAM', title: 'RAM несовместима с материнской платой', detail: `${mb.name} использует ${expected}, а установлена ${ram.name}.`, fixCategory: 'RAM', preferred: expected });
    } else if (mbSpec.maxRamGb && ramCapacityGb(ram) > mbSpec.maxRamGb) {
      issues.push({ category: 'RAM', title: 'Слишком большой объём RAM для материнской платы', detail: `${mb.name} физически поддерживает максимум ${mbSpec.maxRamGb} ГБ RAM (${mbSpec.ramSlots} слота), а установлено ${ramCapacityGb(ram)} ГБ.`, fixCategory: 'RAM_CAPACITY', preferred: mbSpec.maxRamGb });
    }
  }
  if (gpu && psu && isDiscreteGpu(gpu)) {
    const required = gpuRecommendedPsu(gpu);
    if (numericWatts(psu) < required) issues.push({ category: 'GPU', title: 'БП слишком слабый для видеокарты', detail: `${gpu.name} требует рекомендованный БП около ${required} W, а установлен ${psu.name}.`, fixCategory: 'GPU_OR_PSU', preferred: required, currentPsuWatts: numericWatts(psu) });
  }
  if (storage && os && /storage-hdd-64/i.test(storage.id) && /^(os-windows-10-home|os-windows-10-pro|os-windows-11-home|os-windows-11-pro|os-macos)$/i.test(os.id)) {
    issues.push({ category: 'Storage', title: '64 GB HDD несовместим с этой ОС', detail: `${storage.name} слишком мал для ${os.name}. Для Windows 10/11 и macOS нужен HDD минимум 500 ГБ или другой накопитель.`, fixCategory: 'Storage', preferred: 500 });
  }
  if (cpu && cooling) {
    const requiredCool = cpuTdp(cpu);
    if (coolingCapacity(cooling) < requiredCool) issues.push({ category: 'Cooling', title: 'Охлаждение не справляется с CPU', detail: `${cpu.name} может потребовать около ${requiredCool} W по теплу, а это охлаждение рассчитано примерно на ${coolingCapacity(cooling)} W.`, fixCategory: 'Cooling', preferred: requiredCool });
  }
  return issues;
}
function recommendationForIssue(issue) {
  let candidates = [];
  const installedIds = new Set(activeCategories().map((category) => state?.installed?.[category]).filter(Boolean));
  const notInstalled = (item) => item && !installedIds.has(item.id) && !isItemBroken(item);

  if (issue.fixCategory === 'CPU_OR_MB') {
    const currentCpu = installedItem('CPU');
    const currentMb = installedItem('Motherboard');
    const currentRam = installedItem('RAM');

    // При физическом конфликте сначала предлагаем заменить материнскую плату,
    // чтобы сохранить уже установленный CPU, если подходящая плата есть в инвентаре.
    if (currentCpu && currentMb && partPlatform(currentCpu) && partPlatform(currentMb) && partPlatform(currentCpu) !== partPlatform(currentMb)) {
      candidates = workingOwnedItemsIn('Motherboard')
        .filter(notInstalled)
        .filter((item) => partPlatform(item) === partPlatform(currentCpu))
        .filter((item) => {
          const spec = motherboardSpec(item);
          return spec && (!currentRam || (ramType(currentRam) === spec.ramType && ramCapacityGb(currentRam) <= spec.maxRamGb)) &&
            (!spec.maxCpuTdp || cpuTdp(currentCpu) <= spec.maxCpuTdp);
        })
        .sort((a,b) => (b.performance - a.performance));

      // Если подходящей платы нет — предлагаем CPU, который можно установить в текущую плату.
      if (!candidates.length) {
        candidates = workingOwnedItemsIn('CPU')
          .filter(notInstalled)
          .filter((item) => partPlatform(item) === partPlatform(currentMb))
          .filter((item) => !motherboardSpec(currentMb)?.maxCpuTdp || cpuTdp(item) <= motherboardSpec(currentMb).maxCpuTdp)
          .sort((a,b) => b.performance-a.performance);
      }
    } else {
      // Для превышения TDP выбираем CPU под текущую платформу и лимит платы.
      candidates = workingOwnedItemsIn('CPU')
        .filter(notInstalled)
        .filter((item) => partPlatform(item) === (issue.preferred || partPlatform(currentMb)))
        .filter((item) => !issue.preferredCpuTdp || cpuTdp(item) <= Number(issue.preferredCpuTdp))
        .sort((a,b) => b.performance-a.performance);

      if (!candidates.length) {
        candidates = workingOwnedItemsIn('Motherboard')
          .filter(notInstalled)
          .filter((item) => partPlatform(item) === (issue.preferred || partPlatform(currentCpu)))
          .sort((a,b) => b.performance-a.performance);
      }
    }
  } else if (issue.fixCategory === 'GPU_OR_PSU') {
    candidates = workingOwnedItemsIn('GPU')
      .filter(notInstalled)
      .filter((item) => gpuRecommendedPsu(item) <= Number(issue.currentPsuWatts || 0))
      .sort((a,b) => b.performance-a.performance);
    if (!candidates.length) {
      candidates = workingOwnedItemsIn('PSU')
        .filter(notInstalled)
        .filter((item) => numericWatts(item) >= Number(issue.preferred || 0))
        .sort((a,b) => numericWatts(a)-numericWatts(b));
    }
  } else if (issue.fixCategory === 'PSU') {
    candidates = workingOwnedItemsIn('PSU').filter(notInstalled).filter((item) => numericWatts(item) >= Number(issue.preferred || 0)).sort((a,b) => numericWatts(a)-numericWatts(b));
  } else if (issue.fixCategory === 'RAM') {
    candidates = workingOwnedItemsIn('RAM').filter(notInstalled).filter((item) => ramType(item) === issue.preferred).sort((a,b) => a.performance-b.performance);
  } else if (issue.fixCategory === 'RAM_CAPACITY') {
    candidates = workingOwnedItemsIn('RAM').filter(notInstalled).filter((item) => ramType(item) && ramCapacityGb(item) <= Number(issue.preferred || 0)).sort((a,b) => ramCapacityGb(b)-ramCapacityGb(a));
  } else if (issue.fixCategory === 'Cooling') {
    candidates = workingOwnedItemsIn('Cooling').filter(notInstalled).filter((item) => coolingCapacity(item) >= Number(issue.preferred || 0)).sort((a,b) => coolingCapacity(a)-coolingCapacity(b));
  } else if (issue.fixCategory) {
    candidates = workingOwnedItemsIn(issue.fixCategory).filter(notInstalled).sort((a,b) => b.performance-a.performance);
  }
  return candidates[0] || null;
}
function openDiagnostic(issues) {
  const modal = $('diagnosticModal'), content = $('diagnosticContent');
  const footer = document.querySelector('.diagnostic-footer');
  if (footer) footer.classList.remove('hidden');
  if (!modal || !content) return;
  const mode = state.mode;
  if (!issues.length) {
    content.innerHTML = `<div class="diagnostic-ok"><div class="diagnostic-count">✅ Проверка пройдена</div><div>Все основные комплектующие совместимы. Запуск разрешён.</div></div>`;
  } else if (mode === 'hardcore') {
    content.innerHTML = `<div class="diagnostic-error diagnostic-hc"><span class="glitch">ОШИБКА ОШИБКА ОШИБКА</span><small>Система не смогла пройти проверку. Причины не раскрываются в хардкорном режиме.</small></div>`;
  } else if (mode === 'hard') {
    const cats = [...new Set(issues.map((issue) => issue.category))].join(', ');
    content.innerHTML = `<div class="diagnostic-error"><div class="diagnostic-count">❌ Проблем обнаружено: ${issues.length}</div><div>Проблемные разделы: <b>${cats}</b></div></div>`;
  } else {
    content.innerHTML = `<div class="diagnostic-error"><div class="diagnostic-count">❌ Проблем обнаружено: ${issues.length}</div><div class="diagnostic-list">${issues.map((issue) => { const rec = recommendationForIssue(issue); return `<article class="diagnostic-item"><b>${issue.title}</b><small>${issue.detail}</small>${rec ? `<div class="diagnostic-recommend">💡 Лучше поставить из инвентаря: ${rec.name}</div>` : `<div class="diagnostic-recommend">💡 Подходящей детали в инвентаре сейчас нет.</div>`}</article>`; }).join('')}</div></div>`;
  }
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeDiagnostic() { const modal = $('diagnosticModal'); if (!modal) return; modal.classList.add('hidden'); const footer = document.querySelector('.diagnostic-footer'); if (footer) footer.classList.remove('hidden'); modal.setAttribute('aria-hidden','true'); const title=$('diagnosticTitle'); if(title) title.textContent='🛠 Проверка ПК'; }

function currentPower() {
  return activeCategories().reduce((sum, category) => {
    const id = state.installed?.[category];
    const item = id ? itemById(id) : null;
    return sum + effectiveItemPerformance(item);
  }, 0);
}

function formatMoney(value) { const locale = typeof currentLanguage === 'function' && currentLanguage() === 'ru' ? 'ru-RU' : 'en-US'; return Number(value).toLocaleString(locale); }
