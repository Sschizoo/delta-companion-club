const services = [
  { id: 'escort', number: '01', name: '护航撤离', en: 'ESCORT & EXTRACT', description: '熟悉路线与节奏的搭档，陪你稳稳完成目标撤离。', tags: ['路线协同', '物资保护', '节奏配合'], price: 89, unit: '局' },
  { id: 'loot', number: '02', name: '保底出货', en: 'SECURE THE LOOT', description: '围绕收益目标制定路线，让每一次入局更有方向。', tags: ['目标规划', '资源搜集', '安全撤离'], price: 169, unit: '局' },
  { id: 'fun', number: '03', name: '其他趣味单', en: 'PLAY YOUR WAY', description: '整活挑战、轻松带玩或探索新地图，按你的喜好组队。', tags: ['轻松组队', '趣味挑战', '自由定制'], price: 59, unit: '小时' }
];

const companions = [
  { id: 'lin', name: '阿凛', english: 'LIN', role: '稳健指挥 · 路线规划', maps: '零号大坝、长弓溪谷', orders: '1,286', rating: '4.9', review: '「节奏舒服，沟通清楚」', online: true, image: './assets/lin.webp' },
  { id: 'yan', name: '言川', english: 'YAN', role: '资源搜集 · 气氛担当', maps: '航天基地、巴克什', orders: '968', rating: '4.9', review: '「很会照顾新手体验」', online: true, image: './assets/yan.webp' },
  { id: 'luo', name: '洛洛', english: 'LUO', role: '战术支援 · 细节控', maps: '零号大坝、航天基地', orders: '752', rating: '4.8', review: '「地图细节非常熟」', online: false, image: './assets/luo.webp' }
];

const selection = { serviceId: null, companionId: null, quantity: 1 };
const serviceList = document.getElementById('service-list');
const companionGrid = document.getElementById('companion-grid');
const sheet = document.getElementById('order-sheet');
const backdrop = document.getElementById('sheet-backdrop');
const statusMessage = document.getElementById('status-message');
let previousFocus = null;

function selectedService() { return services.find(item => item.id === selection.serviceId); }
function selectedCompanion() { return companions.find(item => item.id === selection.companionId); }

function renderServices() {
  serviceList.innerHTML = services.map(service => `
    <button type="button" class="service-card ${selection.serviceId === service.id ? 'selected' : ''}" data-service="${service.id}" aria-pressed="${selection.serviceId === service.id}">
      <span class="service-no">${service.number}</span>
      <span class="service-main"><strong class="service-title">${service.name}</strong><span class="service-en">${service.en}</span><span class="service-desc">${service.description}</span></span>
      <span class="service-points">${service.tags.map(tag => `<span>${tag}</span>`).join('')}</span>
      <span class="service-price"><strong>¥${service.price}</strong><small> / ${service.unit}</small><i>${selection.serviceId === service.id ? '已选择' : '选择服务'} <svg><use href="#i-chevron"/></svg></i></span>
    </button>`).join('');
}

function renderCompanions() {
  companionGrid.innerHTML = companions.map(companion => `
    <article class="companion-card ${selection.companionId === companion.id ? 'selected' : ''} ${companion.online ? '' : 'offline'}">
      <div class="companion-photo"><img src="${companion.image}" alt="${companion.name}的演示形象照片" loading="lazy" /><span class="companion-status">${companion.online ? '在线 · 可接单' : '离线 · 暂不可接单'}</span></div>
      <div class="companion-body"><div class="companion-name"><strong>${companion.name}</strong><span>${companion.english}</span></div><p class="companion-role">${companion.role}</p><p class="companion-map"><span>擅长地图</span>${companion.maps}</p><div class="companion-stats"><div><strong>${companion.orders}</strong><small>累计接单</small></div><div><strong>${companion.rating} / 5</strong><small>综合评价</small></div></div><button type="button" class="companion-select" data-companion="${companion.id}" aria-pressed="${selection.companionId === companion.id}" ${companion.online ? '' : 'disabled'}>${companion.online ? (selection.companionId === companion.id ? '已加入选单' : '选择这位陪玩师') : '当前离线，暂不可选'}</button></div>
    </article>`).join('');
}

function updateSummary() {
  const service = selectedService();
  const companion = selectedCompanion();
  const total = service ? service.price * selection.quantity : 0;
  document.getElementById('bar-price').textContent = `¥${total}`;
  document.getElementById('bar-count').textContent = service ? `${service.name} · ${selection.quantity}${service.unit}${companion ? ` · ${companion.name}` : ''}` : '请选择服务';
  document.getElementById('summary-service').textContent = service ? `${service.name} · ¥${service.price}/${service.unit}` : '尚未选择';
  document.getElementById('summary-companion').textContent = companion ? companion.name : '尚未选择';
  document.getElementById('quantity').textContent = selection.quantity;
  document.getElementById('summary-total').textContent = `¥${total}`;
  document.getElementById('share-order').disabled = !(service && companion);
  document.getElementById('copy-order').disabled = !(service && companion);
  document.getElementById('decrease').disabled = selection.quantity <= 1;
  document.getElementById('increase').disabled = selection.quantity >= 9;
}

function setStatus(message) { statusMessage.textContent = message; }

function openSheet() {
  previousFocus = document.activeElement;
  backdrop.hidden = false;
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('sheet-open');
  setStatus(selectedService() && selectedCompanion() ? '' : '请先选择服务和在线陪玩师。');
  document.getElementById('close-sheet').focus();
}

function closeSheet() {
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
  document.body.classList.remove('sheet-open');
  previousFocus?.focus();
}

function orderText() {
  const service = selectedService();
  const companion = selectedCompanion();
  if (!service || !companion) return '';
  return `你好，我想咨询三角洲陪玩俱乐部的服务：\n服务：${service.name}\n陪玩师：${companion.name}\n数量：${selection.quantity}${service.unit}\n展示单价：¥${service.price}/${service.unit}\n参考总价：¥${service.price * selection.quantity}\n请帮我确认可预约时段与录单细节。`;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement('textarea');
  input.value = value;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('copy unavailable');
}

serviceList.addEventListener('click', event => {
  const button = event.target.closest('[data-service]');
  if (!button) return;
  selection.serviceId = button.dataset.service;
  selection.quantity = 1;
  renderServices();
  updateSummary();
});

companionGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-companion]');
  if (!button || button.disabled) return;
  const companion = companions.find(item => item.id === button.dataset.companion);
  if (!companion?.online) return;
  selection.companionId = companion.id;
  renderCompanions();
  updateSummary();
});

document.getElementById('bar-button').addEventListener('click', openSheet);
document.getElementById('close-sheet').addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);
document.addEventListener('keydown', event => {
  if (!sheet.classList.contains('open')) return;
  if (event.key === 'Escape') closeSheet();
  if (event.key === 'Tab') {
    const focusable = [...sheet.querySelectorAll('button:not(:disabled)')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
document.getElementById('decrease').addEventListener('click', () => { selection.quantity = Math.max(1, selection.quantity - 1); updateSummary(); });
document.getElementById('increase').addEventListener('click', () => { selection.quantity = Math.min(9, selection.quantity + 1); updateSummary(); });
document.getElementById('copy-order').addEventListener('click', async () => {
  try { await copyText(orderText()); setStatus('选单已复制，可粘贴发送给客服。'); }
  catch { setStatus('复制失败，请尝试使用系统分享。'); }
});
document.getElementById('share-order').addEventListener('click', async () => {
  const text = orderText();
  if (navigator.share) {
    try { await navigator.share({ title: '三角洲陪玩俱乐部选单', text }); setStatus('选单已交给系统分享。'); }
    catch (error) { if (error.name !== 'AbortError') setStatus('分享未完成，请使用复制选单。'); }
  } else {
    try { await copyText(text); setStatus('设备暂不支持系统分享，选单已复制。'); }
    catch { setStatus('此设备暂不支持分享或复制。'); }
  }
});

renderServices();
renderCompanions();
updateSummary();
