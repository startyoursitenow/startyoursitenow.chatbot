/* ============================================
   START YOUR SITE NOW - APPLICATION LOGIC
============================================ */
'use strict';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const wait = (milliseconds) => new Promise(resolve => window.setTimeout(resolve, milliseconds));

/* ---------- SITE UI ---------- */
const navbar = $('#navbar');
const navToggle = $('#navToggle');
const navLinks = $('.nav-links');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 0.08}s`;
    observer.observe(element);
  });
} else {
  $$('.reveal').forEach(element => element.classList.add('visible'));
}

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

/* ---------- AI ASSISTANT CONFIG ---------- */
const STORAGE_LANDINGS = 'ai_landing_pages';
const STORAGE_CONTACTS = 'ai_contact_requests';
const STORAGE_NAME = 'sysn_chat_name';
const STORAGE_TOPIC = 'sysn_chat_last_topic';
const WHATSAPP = '393274813873';

const PALETTES = {
  'Viola Premium': { background: '#0e0e18', surface: '#18182e', accent: '#8b5cf6', accent2: '#a78bfa', text: '#f5f5fa' },
  'Blu Oceano': { background: '#07111f', surface: '#10223a', accent: '#2563eb', accent2: '#60a5fa', text: '#eff6ff' },
  'Verde Natura': { background: '#07130d', surface: '#12261a', accent: '#16a34a', accent2: '#4ade80', text: '#f0fdf4' },
  'Oro & Nero': { background: '#0d0a05', surface: '#211a0e', accent: '#ca8a04', accent2: '#fde047', text: '#fffbeb' },
  'Salmone': { background: '#16090d', surface: '#2a141b', accent: '#f43f5e', accent2: '#fda4af', text: '#fff1f2' },
  'Cielo': { background: '#07131d', surface: '#102638', accent: '#0284c7', accent2: '#7dd3fc', text: '#f0f9ff' }
};

const WIZARD_STEPS = [
  {
    key: 'businessType',
    question: 'Che <strong>tipo di attività</strong> hai?',
    options: ['Ristorante', 'Centro Estetico', 'Ottica', 'B&B / Hotel', 'Palestra', 'Studio Professionale', 'Impresa Edile', 'Agenzia Immobiliare', 'E-commerce', 'Altro']
  },
  { key: 'businessName', question: 'Come si chiama la tua <strong>attività</strong>?' },
  { key: 'city', question: 'In quale <strong>città</strong> operi?' },
  {
    key: 'style',
    question: 'Quale <strong>stile</strong> preferisci?',
    options: ['Elegante', 'Moderno', 'Minimal', 'Familiare', 'Premium', 'Audace']
  },
  {
    key: 'palette',
    question: 'Scegli la <strong>palette colori</strong>:',
    options: Object.keys(PALETTES)
  },
  {
    key: 'tone',
    question: 'Che <strong>tono di voce</strong> vuoi comunicare?',
    options: ['Professionale', 'Amichevole', 'Premium', 'Energico', 'Rassicurante']
  },
  {
    key: 'target',
    question: 'Qual è il tuo <strong>pubblico principale</strong>?',
    options: ['Privati', 'Aziende', 'Famiglie', 'Turisti', 'Giovani', 'Professionisti']
  },
  {
    key: 'sections',
    question: 'Quali <strong>sezioni</strong> vuoi nella demo? Puoi sceglierne più di una.',
    options: ['Servizi', 'Gallery', 'Prenotazioni', 'Recensioni', 'Team', 'FAQ'],
    multiple: true
  },
  {
    key: 'goal',
    question: 'Qual è il tuo <strong>obiettivo principale</strong>?',
    options: ['Ricevere chiamate', 'Prenotazioni online', 'Richiedere preventivi', 'Messaggi WhatsApp', 'Vendere online']
  },
  {
    key: 'contact',
    question: 'Ultimo passo. Inserisci <strong>nome e contatto</strong> (telefono o email). Li useremo solo per ricontattarti sulla demo.'
  }
];

const CHAT_RESPONSES = {
  greeting: name =>
    `Ciao${name ? ` ${escapeHtml(name)}` : ''}! Sono l'<strong>AI Demo Assistant</strong> di Start Your Site Now.<br><br>` +
    'Posso generare una demo personalizzata oppure rispondere su prezzi, servizi, SEO, portfolio e contatti.',
  pricing:
    'I piani partono da <strong>390€</strong> per una Landing Page, <strong>590€</strong> per un Sito Vetrina e <strong>790€</strong> per un Sito Locale Pro. Zero anticipo, prima versione in 48 ore.',
  services:
    'Creiamo landing page, siti vetrina e siti Local Pro per attività locali. Ogni progetto è responsive, veloce e orientato a contatti, prenotazioni o vendite.',
  process:
    'Raccogliamo informazioni essenziali, prepariamo struttura e contenuti, sviluppiamo il sito e mostriamo la prima versione entro <strong>48 ore</strong>. Puoi iniziare da “✨ Genera una landing”.',
  seo:
    'Sì. Ogni sito include base SEO tecnica, meta tag, struttura semantica, mobile e ottimizzazione locale. Strategie SEO continuative vengono valutate sul progetto.',
  contacts:
    `Puoi scriverci su WhatsApp al <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">+39 327 481 3873</a>.`,
  portfolio:
    'Trovi esempi reali nella <a href="#portfolio" data-ai-anchor="portfolio">sezione Portfolio</a>: ottica, B&B e centro estetico.',
  fallback:
    'Posso aiutarti su demo, siti web, prezzi, SEO, portfolio e contatti. Prova a chiedermi: <strong>“Quanto costa un sito?”</strong>'
};

const CHAT_INTENTS = [
  { topic: 'pricing', keywords: ['prezzo', 'prezzi', 'costa', 'costo', 'quanto', 'budget', 'piano'] },
  { topic: 'process', keywords: ['come funziona', 'come lavorate', 'processo', 'come iniziare', '48 ore', 'consegna del sito'] },
  { topic: 'seo', keywords: ['seo', 'google', 'posizionamento', 'indicizzazione'] },
  { topic: 'contacts', keywords: ['contatti', 'contatto', 'whatsapp', 'telefono', 'email'] },
  { topic: 'portfolio', keywords: ['portfolio', 'esempio', 'esempi', 'progetti', 'lavori'] },
  { topic: 'services', keywords: ['servizi', 'cosa fate', 'landing page', 'sito vetrina', 'siti web'] }
];

const store = {
  get(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  push(key, value) {
    const values = this.get(key);
    values.push(value);
    this.set(key, values);
    return values;
  }
};

/* ---------- DOM REFERENCES ---------- */
const aiLauncher = $('#aiLauncher');
const aiWindow = $('#aiWindow');
const aiClose = $('#aiClose');
const aiBody = $('#aiBody');
const aiQuick = $('#aiQuick');
const aiForm = $('#aiForm');
const aiInput = $('#aiInput');
const aiBadge = $('#aiBadge');
const aiPreviewModal = $('#aiPreviewModal');
const aiPreviewFrame = $('#aiPreviewFrame');
const aiPreviewTitle = $('#aiPreviewTitle');
const aiPreviewOpen = $('#aiPreviewOpen');
const aiPreviewClose = $('#aiPreviewClose');
const openDemoCta = $('#openDemoCta');

const aiState = {
  openedOnce: false,
  wizardActive: false,
  stepIndex: 0,
  data: {},
  selectedSections: [],
  currentPreview: null,
  userName: readTextStorage(STORAGE_NAME),
  lastTopic: readTextStorage(STORAGE_TOPIC)
};

let aiResponseQueue = Promise.resolve();

function readTextStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeTextStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Assistant remains usable without persistent storage.
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function normalizeText(value = '') {
  return String(value)
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function openAssistant() {
  aiWindow?.classList.add('open');
  aiWindow?.setAttribute('aria-hidden', 'false');
  aiLauncher?.classList.add('hidden');
  aiLauncher?.setAttribute('aria-expanded', 'true');
  aiBadge?.classList.add('hidden');

  if (!aiState.openedOnce) {
    aiState.openedOnce = true;
    botSay(CHAT_RESPONSES.greeting(aiState.userName), 350);
  }

  window.setTimeout(() => aiInput?.focus(), 350);
}

function closeAssistant() {
  aiWindow?.classList.remove('open');
  aiWindow?.setAttribute('aria-hidden', 'true');
  aiLauncher?.classList.remove('hidden');
  aiLauncher?.setAttribute('aria-expanded', 'false');
  aiLauncher?.focus();
}

function addMessage(content, sender = 'bot') {
  const message = document.createElement('div');
  message.className = `ai-message ${sender}`;
  if (sender === 'user') message.textContent = content;
  else message.innerHTML = content;
  aiBody.appendChild(message);
  scrollAssistant();
  return message;
}

function scrollAssistant() {
  window.requestAnimationFrame(() => {
    aiBody.scrollTop = aiBody.scrollHeight;
  });
}

function showTyping() {
  if ($('#aiTyping')) return;
  const typing = document.createElement('div');
  typing.className = 'ai-typing';
  typing.id = 'aiTyping';
  typing.setAttribute('aria-label', 'Assistente sta scrivendo');
  typing.innerHTML = '<span></span><span></span><span></span>';
  aiBody.appendChild(typing);
  scrollAssistant();
}

function hideTyping() {
  $('#aiTyping')?.remove();
}

function botSay(content, delay = 500) {
  aiResponseQueue = aiResponseQueue.then(() => {
    showTyping();
    return new Promise(resolve => {
      window.setTimeout(() => {
        hideTyping();
        addMessage(content, 'bot');
        resolve();
      }, delay);
    });
  });
  return aiResponseQueue;
}

function showOptions(options, multiple = false) {
  const group = document.createElement('div');
  group.className = 'ai-options';

  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'ai-option';
    button.type = 'button';
    button.textContent = option;

    button.addEventListener('click', () => {
      if (multiple) {
        button.classList.toggle('selected');
        const index = aiState.selectedSections.indexOf(option);
        if (index >= 0) aiState.selectedSections.splice(index, 1);
        else aiState.selectedSections.push(option);
        return;
      }

      group.querySelectorAll('.ai-option').forEach(item => {
        item.disabled = true;
      });
      button.classList.add('picked');
      handleUserMessage(option);
    });

    group.appendChild(button);
  });

  if (multiple) {
    const confirm = document.createElement('button');
    confirm.className = 'ai-option ai-option-confirm';
    confirm.type = 'button';
    confirm.textContent = '✓ Conferma sezioni';
    confirm.addEventListener('click', () => {
      const selected = aiState.selectedSections.length ? aiState.selectedSections.join(', ') : 'Servizi';
      group.querySelectorAll('.ai-option').forEach(item => {
        item.disabled = true;
      });
      handleUserMessage(selected);
    });
    group.appendChild(confirm);
  }

  aiBody.appendChild(group);
  scrollAssistant();
}

/* ---------- GUIDED LANDING WIZARD ---------- */
function startWizard() {
  aiState.wizardActive = true;
  aiState.stepIndex = 0;
  aiState.data = {};
  aiState.selectedSections = [];
  addMessage('✨ Genera una landing', 'user');
  botSay(
    'Perfetto. Ti faccio <strong>10 domande rapide</strong>, poi genero una demo visuale e salvo il progetto nel browser.',
    350
  ).then(askWizardStep);
}

function askWizardStep() {
  const step = WIZARD_STEPS[aiState.stepIndex];
  if (!step) return;

  aiState.selectedSections = [];
  botSay(`<small>Passo ${aiState.stepIndex + 1} di ${WIZARD_STEPS.length}</small><br>${step.question}`, 300)
    .then(() => {
      if (step.options) showOptions(step.options, Boolean(step.multiple));
      aiInput.placeholder = step.multiple ? 'Seleziona sopra o scrivi...' : 'Scrivi qui...';
    });
}

function processWizardAnswer(value) {
  const step = WIZARD_STEPS[aiState.stepIndex];
  if (!step) return;

  const cleanValue = value.trim();
  if (!cleanValue) return;

  if (step.key === 'businessName' || step.key === 'city') {
    if (cleanValue.length < 2) {
      botSay('Inserisci un valore valido di almeno 2 caratteri.');
      return;
    }
  }

  if (step.key === 'contact' && cleanValue.length < 5) {
    botSay('Inserisci nome e almeno un contatto valido: telefono oppure email.');
    return;
  }

  addMessage(cleanValue, 'user');
  aiState.data[step.key] = cleanValue;
  aiState.stepIndex += 1;

  if (aiState.stepIndex < WIZARD_STEPS.length) {
    askWizardStep();
  } else {
    finishWizard();
  }
}

async function finishWizard() {
  aiState.wizardActive = false;
  aiInput.placeholder = 'Scrivi un messaggio...';

  const timestamp = new Date().toISOString();
  const landing = {
    id: `landing-${Date.now()}`,
    ...aiState.data,
    createdAt: timestamp
  };
  landing.generatedHtml = buildGeneratedLanding(landing);

  const contact = {
    id: `contact-${Date.now()}`,
    contact: landing.contact,
    businessName: landing.businessName,
    businessType: landing.businessType,
    city: landing.city,
    goal: landing.goal,
    createdAt: timestamp
  };

  store.push(STORAGE_LANDINGS, landing);
  store.push(STORAGE_CONTACTS, contact);

  await runGenerationAnimation(landing);
  await botSay(
    `🎉 Demo pronta per <strong>${escapeHtml(landing.businessName)}</strong>.<br>` +
    `${escapeHtml(landing.style)} · ${escapeHtml(landing.palette)} · ${escapeHtml(landing.goal)}`,
    250
  );

  const actions = createActionMessage();
  actions.appendChild(createActionButton('👁️ Anteprima', () => openPreview(landing)));
  actions.appendChild(createActionButton('💬 Ricevi proposta', () => openWhatsAppForLanding(landing)));
  actions.appendChild(createActionButton('🔄 Nuova demo', startWizard));
}

async function runGenerationAnimation(landing) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-message bot ai-generation-message';
  wrapper.innerHTML = `
    <div class="ai-generation-steps">
      <div class="ai-generation-step">🔎 Analisi settore e target...</div>
      <div class="ai-generation-step">🎨 Applicazione stile ${escapeHtml(landing.style)}...</div>
      <div class="ai-generation-step">🧩 Composizione sezioni...</div>
      <div class="ai-generation-step">📱 Ottimizzazione mobile...</div>
    </div>
    <div class="ai-progress-track"><div class="ai-progress-fill"></div></div>
    <div class="ai-progress-label">0%</div>
  `;
  aiBody.appendChild(wrapper);
  scrollAssistant();

  const steps = $$('.ai-generation-step', wrapper);
  const fill = $('.ai-progress-fill', wrapper);
  const label = $('.ai-progress-label', wrapper);

  for (let index = 0; index < steps.length; index += 1) {
    await wait(450);
    steps[index].classList.add('done');
    const progress = Math.round(((index + 1) / steps.length) * 100);
    fill.style.width = `${progress}%`;
    label.textContent = `${progress}%`;
  }

  await wait(300);
  wrapper.remove();
}

/* ---------- SAVED DATA ACTIONS ---------- */
function showSavedLandings() {
  addMessage('👁️ Mostra landing', 'user');
  const landings = store.get(STORAGE_LANDINGS);

  if (!landings.length) {
    botSay('Nessuna landing salvata. Usa <strong>✨ Genera una landing</strong> per crearne una.');
    return;
  }

  botSay(`Hai <strong>${landings.length}</strong> landing salvate:`).then(() => {
    landings.slice(-5).reverse().forEach(landing => {
      const message = document.createElement('div');
      message.className = 'ai-message bot';
      message.innerHTML = `
        <strong>${escapeHtml(landing.businessName || 'Senza nome')}</strong><br>
        <small>${escapeHtml(landing.businessType || '')} · ${escapeHtml(landing.city || '')}</small>
        <div class="ai-action-group"></div>
      `;
      const actions = $('.ai-action-group', message);
      actions.appendChild(createActionButton('👁️ Apri', () => openPreview(landing)));
      actions.appendChild(createActionButton('🗑️ Elimina', () => deleteLanding(landing.id, message)));
      aiBody.appendChild(message);
    });
    scrollAssistant();
  });
}

function deleteLanding(id, messageElement) {
  const remaining = store.get(STORAGE_LANDINGS).filter(landing => landing.id !== id);
  store.set(STORAGE_LANDINGS, remaining);
  messageElement?.remove();
  botSay('Landing eliminata.', 250);
}

function showSavedContacts() {
  addMessage('📇 Contatti salvati', 'user');
  const contacts = store.get(STORAGE_CONTACTS);

  if (!contacts.length) {
    botSay('Nessun contatto salvato.');
    return;
  }

  let content = `Hai <strong>${contacts.length}</strong> richieste:<br><br>`;
  contacts.slice(-5).reverse().forEach(contact => {
    const date = new Date(contact.createdAt).toLocaleDateString('it-IT');
    content += `• <strong>${escapeHtml(contact.businessName || 'Attività')}</strong> — ${escapeHtml(contact.contact || '')}<br>`;
    content += `<small>${escapeHtml(contact.businessType || '')}, ${escapeHtml(contact.city || '')} · ${date}</small><br><br>`;
  });
  botSay(content);
}

function exportStoredData() {
  addMessage('📤 Esporta dati', 'user');
  const payload = {
    ai_landing_pages: store.get(STORAGE_LANDINGS),
    ai_contact_requests: store.get(STORAGE_CONTACTS),
    exportedAt: new Date().toISOString()
  };

  if (!payload.ai_landing_pages.length && !payload.ai_contact_requests.length) {
    botSay('Nessun dato da esportare. Genera prima una landing.');
    return;
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'start-your-site-now-export.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  botSay('Esportazione completata: <strong>start-your-site-now-export.json</strong>', 250);
}

/* ---------- PREVIEW ---------- */
function openPreview(landing) {
  const generatedHtml = landing.generatedHtml || buildGeneratedLanding(landing);
  aiState.currentPreview = { ...landing, generatedHtml };
  aiPreviewTitle.textContent = `Anteprima · ${landing.businessName || 'Landing'}`;
  aiPreviewFrame.srcdoc = generatedHtml;
  aiPreviewModal.classList.add('open');
  aiPreviewModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  aiPreviewModal.classList.remove('open');
  aiPreviewModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  window.setTimeout(() => {
    aiPreviewFrame.srcdoc = '';
  }, 250);
}

function openPreviewInNewTab() {
  if (!aiState.currentPreview) return;
  const blob = new Blob([aiState.currentPreview.generatedHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank', 'noopener');
  if (!newWindow) botSay('Il browser ha bloccato la nuova scheda. Consenti i popup e riprova.');
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function openWhatsAppForLanding(landing) {
  const text = encodeURIComponent(
    `Ciao! Ho generato una demo per "${landing.businessName}" (${landing.businessType}, ${landing.city}). Vorrei una proposta personalizzata.`
  );
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank', 'noopener');
}

function createActionMessage() {
  const message = document.createElement('div');
  message.className = 'ai-message bot';
  const group = document.createElement('div');
  group.className = 'ai-action-group';
  message.appendChild(group);
  aiBody.appendChild(message);
  scrollAssistant();
  return group;
}

function createActionButton(label, handler) {
  const button = document.createElement('button');
  button.className = 'ai-action';
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

/* ---------- FREE CHAT ---------- */
function extractUserName(text) {
  const match = text.match(/\b(?:mi chiamo|il mio nome e|il mio nome è)\s+([A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40})/i);
  if (!match) return '';
  return match[1].trim().split(/\s+/).slice(0, 2).map(part => (
    part.charAt(0).toLocaleUpperCase('it-IT') + part.slice(1).toLocaleLowerCase('it-IT')
  )).join(' ');
}

function detectTopic(text) {
  const normalized = normalizeText(text);
  let best = { topic: 'fallback', score: 0 };

  CHAT_INTENTS.forEach(intent => {
    const score = intent.keywords.reduce((total, keyword) => (
      total + (normalized.includes(normalizeText(keyword)) ? keyword.split(' ').length : 0)
    ), 0);
    if (score > best.score) best = { topic: intent.topic, score };
  });

  return best.topic;
}

function handleFreeChat(text) {
  const extractedName = extractUserName(text);
  if (extractedName) {
    aiState.userName = extractedName;
    writeTextStorage(STORAGE_NAME, extractedName);
    botSay(`Piacere, <strong>${escapeHtml(extractedName)}</strong>! Posso generare una demo o aiutarti a scegliere il piano giusto.`);
    return;
  }

  const topic = detectTopic(text);
  aiState.lastTopic = topic;
  writeTextStorage(STORAGE_TOPIC, topic);
  botSay(CHAT_RESPONSES[topic] || CHAT_RESPONSES.fallback);
}

function handleUserMessage(value) {
  const cleanValue = String(value || '').trim();
  if (!cleanValue) return;

  if (aiState.wizardActive) {
    processWizardAnswer(cleanValue);
    return;
  }

  addMessage(cleanValue, 'user');
  handleFreeChat(cleanValue);
}

/* ---------- GENERATED LANDING ---------- */
function buildGeneratedLanding(data) {
  const palette = PALETTES[data.palette] || PALETTES['Viola Premium'];
  const content = getSectorContent(data.businessType);
  const sections = String(data.sections || 'Servizi').split(',').map(section => section.trim());
  const name = escapeHtml(data.businessName || 'La Tua Attività');
  const city = escapeHtml(data.city || '');
  const target = escapeHtml(data.target || 'clienti');
  const goal = escapeHtml(data.goal || 'Ricevere contatti');
  const cta = goalCta(data.goal);
  const image = content.image;

  const optionalSections = [
    sections.some(section => /gallery/i.test(section)) ? buildGallerySection(content, palette) : '',
    sections.some(section => /recensioni/i.test(section)) ? buildReviewsSection(palette) : '',
    sections.some(section => /team/i.test(section)) ? buildTeamSection(palette) : '',
    sections.some(section => /faq/i.test(section)) ? buildFaqSection(palette) : ''
  ].join('');

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${name} · ${city}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
    body{font-family:'DM Sans',sans-serif;background:${palette.background};color:${palette.text};line-height:1.6}
    h1,h2,h3{font-family:'Syne',sans-serif}.wrap{width:min(1100px,calc(100% - 40px));margin:auto}
    nav{height:74px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.09)}
    .logo{font-family:'Syne';font-weight:800}.button{display:inline-block;padding:13px 24px;border-radius:999px;background:linear-gradient(135deg,${palette.accent},${palette.accent2});color:#fff;text-decoration:none;font-weight:700}
    .hero{min-height:78vh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:50px;padding:70px 0}
    .badge{display:inline-block;padding:7px 13px;border:1px solid rgba(255,255,255,.14);border-radius:999px;color:${palette.accent2};margin-bottom:22px;font-size:.82rem}
    h1{font-size:clamp(2.6rem,7vw,5.5rem);line-height:1.02;letter-spacing:-.04em;margin-bottom:24px}
    .hero p{color:rgba(255,255,255,.72);font-size:1.12rem;max-width:590px;margin-bottom:30px}
    .hero img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:24px;border:1px solid rgba(255,255,255,.12)}
    section{padding:84px 0}.section-title{text-align:center;font-size:clamp(1.8rem,4vw,3rem);margin-bottom:38px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{padding:25px;border-radius:18px;background:${palette.surface};border:1px solid rgba(255,255,255,.09)}
    .icon{font-size:1.8rem;margin-bottom:16px}.card h3{margin-bottom:8px}.card p{color:rgba(255,255,255,.66);font-size:.92rem}
    .media{width:100%;height:230px;object-fit:cover;border-radius:16px}
    .final{text-align:center;background:${palette.surface}}.final p{color:rgba(255,255,255,.68);margin:12px auto 26px;max-width:560px}
    footer{text-align:center;padding:28px;border-top:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.5)}
    @media(max-width:760px){.hero{grid-template-columns:1fr;padding:50px 0}.hero img{aspect-ratio:16/10}.grid{grid-template-columns:1fr}nav .button{padding:10px 15px}}
  </style>
</head>
<body>
  <nav class="wrap"><div class="logo">${name}</div><a class="button" href="#contatti">${escapeHtml(cta)}</a></nav>
  <main>
    <div class="hero wrap">
      <div>
        <span class="badge">${escapeHtml(data.businessType)} · ${city}</span>
        <h1>${escapeHtml(content.headline(name, city))}</h1>
        <p>${escapeHtml(content.subtitle(target, city, data.tone))}</p>
        <a class="button" href="#contatti">${escapeHtml(cta)} →</a>
      </div>
      <img src="${image}" alt="${escapeHtml(data.businessType)} a ${city}">
    </div>
    <section><div class="wrap"><h2 class="section-title">${escapeHtml(content.sectionTitle)}</h2><div class="grid">
      ${content.services.map(service => `<article class="card"><div class="icon">${service[0]}</div><h3>${escapeHtml(service[1])}</h3><p>${escapeHtml(service[2])}</p></article>`).join('')}
    </div></div></section>
    ${optionalSections}
    <section class="final" id="contatti"><div class="wrap"><h2 class="section-title">${goal}</h2><p>Una call to action chiara per trasformare visitatori in opportunità reali.</p><a class="button" href="#">${escapeHtml(cta)} →</a></div></section>
  </main>
  <footer>© ${new Date().getFullYear()} ${name} · ${city} · Demo Start Your Site Now</footer>
</body>
</html>`;
}

function getSectorContent(type = '') {
  const normalized = normalizeText(type);
  const presets = [
    {
      match: ['ristor'],
      headline: (name, city) => `${name}: gusto autentico nel cuore di ${city}`,
      subtitle: (target, city) => `Menu, atmosfera e prenotazioni pensati per ${target.toLowerCase()} che cercano un'esperienza speciale a ${city}.`,
      sectionTitle: 'Menu, esperienza e prenotazioni',
      services: [['🍽️', 'Menu selezionato', 'Piatti raccontati con immagini e descrizioni invitanti.'], ['📅', 'Prenotazione rapida', 'Un percorso diretto dal desiderio al tavolo.'], ['⭐', 'Recensioni', 'Fiducia costruita attraverso esperienze reali.']],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=82'
    },
    {
      match: ['estetic', 'beauty'],
      headline: name => `${name}: il tuo momento di benessere`,
      subtitle: target => `Trattamenti, pacchetti e risultati presentati con un tono adatto a ${target.toLowerCase()}.`,
      sectionTitle: 'Trattamenti e percorsi beauty',
      services: [['✨', 'Trattamenti viso', 'Percorsi personalizzati per luminosità e cura.'], ['💆', 'Benessere corpo', 'Rituali pensati per relax e risultati.'], ['📲', 'Prenota su WhatsApp', 'Contatto semplice, diretto e immediato.']],
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=82'
    },
    {
      match: ['b&b', 'hotel', 'bnb'],
      headline: (name, city) => `${name}: vivi ${city} da una posizione speciale`,
      subtitle: target => `Camere, servizi e prenotazione diretta per ${target.toLowerCase()} che cercano comfort e autenticità.`,
      sectionTitle: 'Camere, posizione e ospitalità',
      services: [['🛏️', 'Camere curate', 'Comfort, dettagli e informazioni subito visibili.'], ['📍', 'Posizione strategica', 'Distanze e luoghi vicini spiegati con chiarezza.'], ['🧳', 'Prenotazione diretta', 'Meno passaggi, più richieste senza intermediari.']],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=82'
    },
    {
      match: ['palestra', 'fitness'],
      headline: name => `${name}: allenati per il tuo prossimo risultato`,
      subtitle: target => `Corsi, abbonamenti e trainer raccontati per motivare ${target.toLowerCase()} all'azione.`,
      sectionTitle: 'Corsi, trainer e abbonamenti',
      services: [['🏋️', 'Sala e attrezzature', 'Spazi e strumenti mostrati in modo concreto.'], ['📅', 'Calendario corsi', 'Orari leggibili e scelta più semplice.'], ['💪', 'Trainer dedicati', 'Competenze e percorsi per ogni obiettivo.']],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=82'
    },
    {
      match: ['edile', 'costruz', 'ristruttur'],
      headline: (name, city) => `${name}: progetti solidi a ${city}`,
      subtitle: target => `Lavori, metodo e preventivi chiari per ${target.toLowerCase()} che cercano affidabilità.`,
      sectionTitle: 'Lavori e competenze',
      services: [['🏗️', 'Ristrutturazioni', 'Interventi raccontati con prima, dopo e risultati.'], ['📐', 'Sopralluogo', 'Valutazione iniziale chiara e professionale.'], ['📋', 'Preventivo', 'Richiesta semplice con informazioni essenziali.']],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=82'
    },
    {
      match: ['immobil'],
      headline: (name, city) => `${name}: la scelta giusta per muoversi a ${city}`,
      subtitle: target => `Immobili, valutazioni e consulenza per ${target.toLowerCase()} che vogliono decidere con sicurezza.`,
      sectionTitle: 'Immobili e consulenza',
      services: [['🏠', 'Immobili selezionati', 'Schede chiare, immagini e dettagli utili.'], ['📈', 'Valutazione', 'Un primo passo concreto per chi vuole vendere.'], ['🔑', 'Visite e consulenza', 'Contatto rapido per organizzare il prossimo passo.']],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=82'
    }
  ];

  return presets.find(preset => preset.match.some(term => normalized.includes(term))) || {
    headline: (name, city) => `${name}: qualità e servizio a ${city}`,
    subtitle: target => `Una presenza online chiara e credibile, pensata per trasformare ${target.toLowerCase()} in nuovi clienti.`,
    sectionTitle: 'Servizi principali',
    services: [['✨', 'Qualità', 'Valore e differenze spiegati con chiarezza.'], ['⚡', 'Rapidità', 'Contatto semplice e risposte immediate.'], ['🤝', 'Assistenza', 'Un rapporto diretto prima e dopo il servizio.']],
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82'
  };
}

function goalCta(goal = '') {
  const normalized = normalizeText(goal);
  if (normalized.includes('chiam')) return 'Chiama ora';
  if (normalized.includes('prenot')) return 'Prenota ora';
  if (normalized.includes('prevent')) return 'Richiedi preventivo';
  if (normalized.includes('whatsapp')) return 'Scrivi su WhatsApp';
  if (normalized.includes('vend')) return 'Acquista online';
  return 'Contattaci';
}

function buildGallerySection(content, palette) {
  return `<section><div class="wrap"><h2 class="section-title">Gallery</h2><div class="grid">${[1, 2, 3].map(index => (
    `<img class="media" src="${content.image}&sig=${index}" alt="Immagine attività ${index}">`
  )).join('')}</div></div></section>`;
}

function buildReviewsSection(palette) {
  return `<section style="background:${palette.surface}"><div class="wrap"><h2 class="section-title">Recensioni</h2><div class="grid">
    ${['Servizio curato e professionale.', 'Esperienza semplice dall’inizio alla fine.', 'Disponibilità e qualità oltre le aspettative.'].map(review => (
      `<blockquote class="card">★★★★★<p style="margin-top:10px">${review}</p></blockquote>`
    )).join('')}
  </div></div></section>`;
}

function buildTeamSection(palette) {
  return `<section><div class="wrap"><h2 class="section-title">Il team</h2><div class="grid">
    ${['Consulenza', 'Operatività', 'Assistenza'].map(role => `<article class="card"><div class="icon">👤</div><h3>${role}</h3><p>Competenze dedicate per accompagnare ogni cliente.</p></article>`).join('')}
  </div></div></section>`;
}

function buildFaqSection(palette) {
  return `<section style="background:${palette.surface}"><div class="wrap"><h2 class="section-title">Domande frequenti</h2><div class="grid">
    ${[['Come funziona?', 'Contattaci e raccontaci la tua esigenza.'], ['Quanto tempo serve?', 'Ti diamo una risposta chiara già dal primo contatto.'], ['Come prenoto?', 'Usa il pulsante principale o scrivici direttamente.']].map(([question, answer]) => (
      `<article class="card"><h3>${question}</h3><p>${answer}</p></article>`
    )).join('')}
  </div></div></section>`;
}

/* ---------- EVENTS ---------- */
aiLauncher?.addEventListener('click', openAssistant);
aiClose?.addEventListener('click', closeAssistant);
openDemoCta?.addEventListener('click', event => {
  event.preventDefault();
  openAssistant();
});

aiForm?.addEventListener('submit', event => {
  event.preventDefault();
  const value = aiInput.value;
  if (!value.trim()) return;
  aiInput.value = '';
  handleUserMessage(value);
});

aiQuick?.addEventListener('click', event => {
  const button = event.target.closest('.ai-quick-btn');
  if (!button) return;
  const actions = {
    generate: startWizard,
    show: showSavedLandings,
    contacts: showSavedContacts,
    export: exportStoredData
  };
  actions[button.dataset.action]?.();
});

aiBody?.addEventListener('click', event => {
  const anchor = event.target.closest('[data-ai-anchor]');
  if (!anchor) return;
  event.preventDefault();
  const target = document.getElementById(anchor.dataset.aiAnchor);
  closeAssistant();
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

aiPreviewClose?.addEventListener('click', closePreview);
aiPreviewOpen?.addEventListener('click', openPreviewInNewTab);
aiPreviewModal?.addEventListener('click', event => {
  if (event.target === aiPreviewModal) closePreview();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (aiPreviewModal?.classList.contains('open')) closePreview();
  else if (aiWindow?.classList.contains('open')) closeAssistant();
});

$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (event) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = $(href);
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
