/* ============================================
   START YOUR SITE NOW - APPLICATION LOGIC
============================================ */
'use strict';

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

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
  const observer = new IntersectionObserver((entries) => {
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

/* ---------- CHATBOT CONFIG ---------- */
const CHATBOT_STORAGE = {
  name: 'sysn_chat_name',
  topic: 'sysn_chat_last_topic'
};

const CONTACTS = {
  whatsappNumber: '393274813873',
  whatsappLabel: '+39 327 481 3873'
};

/*
 * Extend chatbot here:
 * 1. Add response in CHATBOT_RESPONSES.
 * 2. Add keywords in INTENTS.
 * 3. Add matching case in getIntentResponse().
 */
const CHATBOT_RESPONSES = {
  greeting: (name) =>
    `Ciao${name ? ` ${escapeHtml(name)}` : ''}! Sono l'assistente di <strong>Start Your Site Now</strong>. ` +
    'Posso aiutarti con prezzi, tempi, servizi, SEO, portfolio e contatti.',

  services:
    'Creiamo siti web professionali per attività locali in <strong>48 ore</strong>: landing page, siti vetrina e soluzioni Local Pro. ' +
    'Ogni progetto è responsive, veloce e pensato per trasformare visite in contatti.',

  pricing:
    'I piani partono da <strong>390€</strong> per una Landing Page, <strong>590€</strong> per un Sito Vetrina e <strong>790€</strong> per un Sito Locale Pro. ' +
    'Partiamo senza anticipo e definiamo insieme contenuti e obiettivi.',

  process:
    'Funziona così: raccogliamo le informazioni sulla tua attività, prepariamo struttura e contenuti, sviluppiamo il sito e ti mostriamo la prima versione entro <strong>48 ore</strong>. ' +
    'Dopo il tuo feedback completiamo gli ultimi dettagli.',

  seo:
    'Sì. Ogni sito include una base SEO tecnica: struttura corretta, meta tag, prestazioni, mobile e contenuti locali. ' +
    'Per attività che vogliono crescere su Google possiamo valutare una strategia SEO continuativa.',

  contacts:
    `Puoi contattarci su WhatsApp al <a href="https://wa.me/${CONTACTS.whatsappNumber}" target="_blank" rel="noopener">${CONTACTS.whatsappLabel}</a>. ` +
    'Scrivici che tipo di attività hai: ti rispondiamo con il percorso più adatto.',

  portfolio:
    'Trovi esempi reali nella <a href="#portfolio" data-chat-anchor="portfolio">sezione Portfolio</a>: ottica, B&B e centro estetico. ' +
    'Dimmi il tuo settore e ti indico il progetto più vicino alle tue esigenze.',

  timing:
    'La prima versione viene preparata entro <strong>48 ore</strong> da quando riceviamo materiali e indicazioni essenziali. ' +
    'Tempistiche più ampie possono servire solo per progetti o integrazioni particolari.',

  ecommerce:
    'Possiamo realizzare soluzioni per vendere online. Per catalogo, pagamenti, spedizioni e automazioni serve una valutazione rapida del progetto. ' +
    `Scrivici su <a href="https://wa.me/${CONTACTS.whatsappNumber}" target="_blank" rel="noopener">WhatsApp</a> con numero di prodotti e funzionalità desiderate.`,

  followUpPricing:
    'Il piano giusto dipende da quante pagine e funzioni servono. Una landing è ideale per una singola offerta; il sito vetrina presenta meglio attività e servizi; Local Pro punta maggiormente alla visibilità locale.',

  followUpPortfolio:
    'Per consigliarti un esempio preciso, scrivi il settore della tua attività, ad esempio ristorante, estetica, ottica o B&B.',

  fallback:
    'Posso aiutarti su siti web, prezzi, consegna in 48 ore, SEO, portfolio e contatti. ' +
    'Prova a chiedermi: <strong>“Quanto costa un sito?”</strong>'
};

const INTENTS = [
  { topic: 'greeting', keywords: ['ciao', 'buongiorno', 'buonasera', 'salve', 'hey', 'hello'] },
  { topic: 'pricing', keywords: ['prezzo', 'prezzi', 'costa', 'costo', 'quanto', 'budget', 'tariffa', 'piano'] },
  { topic: 'process', keywords: ['come funziona', 'procedura', 'processo', 'come lavorate', 'come iniziare', 'iniziare'] },
  { topic: 'seo', keywords: ['seo', 'google', 'posizionamento', 'indicizzazione', 'motori di ricerca'] },
  { topic: 'contacts', keywords: ['contatto', 'contatti', 'whatsapp', 'telefono', 'chiamare', 'scrivere', 'email'] },
  { topic: 'portfolio', keywords: ['portfolio', 'esempio', 'esempi', 'lavori', 'progetti', 'demo'] },
  { topic: 'timing', keywords: ['48 ore', 'tempi di consegna', 'quanto tempo ci vuole', 'quanto ci vuole', 'quando consegnate', 'consegna del sito', 'sito veloce'] },
  { topic: 'ecommerce', keywords: ['e-commerce', 'ecommerce', 'vendere online', 'shop', 'pagamenti online'] },
  { topic: 'services', keywords: ['servizi', 'cosa fate', 'sito web', 'landing', 'sito vetrina', 'realizzate siti'] }
];

/* ---------- CHATBOT STATE ---------- */
const launcher = $('#chatLauncher');
const chatWindow = $('#chatWindow');
const chatClose = $('#chatClose');
const chatBody = $('#chatBody');
const chatForm = $('#chatForm');
const chatInput = $('#chatInput');
const chatQuick = $('#chatQuick');
const chatBadge = $('#chatBadge');
const openDemoCta = $('#openDemoCta');

const chatbotState = {
  openedOnce: false,
  userName: readStorage(CHATBOT_STORAGE.name),
  lastTopic: readStorage(CHATBOT_STORAGE.topic)
};
let botResponseQueue = Promise.resolve();

function readStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Chat remains functional when storage is unavailable.
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

function openChat() {
  if (!chatWindow || !launcher) return;

  chatWindow.classList.add('open');
  chatWindow.setAttribute('aria-hidden', 'false');
  launcher.classList.add('hidden');
  launcher.setAttribute('aria-expanded', 'true');
  if (chatBadge) chatBadge.classList.add('hidden');

  if (!chatbotState.openedOnce) {
    chatbotState.openedOnce = true;
    botSay(CHATBOT_RESPONSES.greeting(chatbotState.userName), 350);
  }

  window.setTimeout(() => chatInput?.focus(), 350);
}

function closeChat() {
  if (!chatWindow || !launcher) return;

  chatWindow.classList.remove('open');
  chatWindow.setAttribute('aria-hidden', 'true');
  launcher.classList.remove('hidden');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.focus();
}

function addMessage(content, sender = 'bot') {
  if (!chatBody) return null;

  const message = document.createElement('div');
  message.className = `msg ${sender}`;
  if (sender === 'user') {
    message.textContent = content;
  } else {
    message.innerHTML = content;
  }

  chatBody.appendChild(message);
  scrollChatToBottom();
  return message;
}

function scrollChatToBottom() {
  if (!chatBody) return;
  window.requestAnimationFrame(() => {
    chatBody.scrollTop = chatBody.scrollHeight;
  });
}

function showTyping() {
  if (!chatBody || $('#typingIndicator')) return;

  const indicator = document.createElement('div');
  indicator.className = 'typing';
  indicator.id = 'typingIndicator';
  indicator.setAttribute('aria-label', 'Assistente sta scrivendo');
  indicator.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(indicator);
  scrollChatToBottom();
}

function hideTyping() {
  $('#typingIndicator')?.remove();
}

function botSay(content, delay = 550) {
  botResponseQueue = botResponseQueue.then(() => {
    showTyping();
    return new Promise(resolve => {
      window.setTimeout(() => {
        hideTyping();
        addMessage(content, 'bot');
        resolve();
      }, delay);
    });
  });
  return botResponseQueue;
}

function extractUserName(text) {
  const match = text.match(/\b(?:mi chiamo|il mio nome e|il mio nome è)\s+([A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40})/i);
  if (!match) return '';

  return match[1]
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toLocaleUpperCase('it-IT') + part.slice(1).toLocaleLowerCase('it-IT'))
    .join(' ');
}

function detectIntent(text) {
  const normalized = normalizeText(text);
  let bestMatch = { topic: 'fallback', score: 0 };

  INTENTS.forEach(intent => {
    const score = intent.keywords.reduce((total, keyword) => {
      return total + (normalized.includes(normalizeText(keyword)) ? keyword.split(' ').length : 0);
    }, 0);

    if (score > bestMatch.score) bestMatch = { topic: intent.topic, score };
  });

  return bestMatch.topic;
}

function getIntentResponse(topic) {
  if (topic === 'pricing' && chatbotState.lastTopic === 'pricing') {
    return CHATBOT_RESPONSES.followUpPricing;
  }

  if (topic === 'portfolio' && chatbotState.lastTopic === 'portfolio') {
    return CHATBOT_RESPONSES.followUpPortfolio;
  }

  if (topic === 'greeting') return CHATBOT_RESPONSES.greeting(chatbotState.userName);
  return CHATBOT_RESPONSES[topic] || CHATBOT_RESPONSES.fallback;
}

function handleUserMessage(text) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return;

  addMessage(cleanText, 'user');

  const extractedName = extractUserName(cleanText);
  if (extractedName) {
    chatbotState.userName = extractedName;
    writeStorage(CHATBOT_STORAGE.name, extractedName);
    chatbotState.lastTopic = 'name';
    writeStorage(CHATBOT_STORAGE.topic, 'name');
    botSay(
      `Piacere, <strong>${escapeHtml(extractedName)}</strong>! ` +
      'Ora posso aiutarti a scegliere soluzione, prezzo o esempio più adatto alla tua attività.'
    );
    return;
  }

  const topic = detectIntent(cleanText);
  const response = getIntentResponse(topic);
  chatbotState.lastTopic = topic;
  writeStorage(CHATBOT_STORAGE.topic, topic);
  botSay(response);
}

launcher?.addEventListener('click', openChat);
chatClose?.addEventListener('click', closeChat);

if (openDemoCta) {
  openDemoCta.addEventListener('click', event => {
    event.preventDefault();
    openChat();
  });
}

chatForm?.addEventListener('submit', event => {
  event.preventDefault();
  const value = chatInput?.value || '';
  if (!value.trim()) return;
  chatInput.value = '';
  handleUserMessage(value);
});

chatQuick?.addEventListener('click', event => {
  const button = event.target.closest('.quick-btn');
  if (!button) return;
  handleUserMessage(button.dataset.message || button.textContent);
});

chatBody?.addEventListener('click', event => {
  const anchor = event.target.closest('[data-chat-anchor]');
  if (!anchor) return;

  event.preventDefault();
  const target = document.getElementById(anchor.dataset.chatAnchor);
  closeChat();
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && chatWindow?.classList.contains('open')) {
    closeChat();
  }
});

/* ---------- SMOOTH ANCHORS ---------- */
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
